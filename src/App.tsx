/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  auth,
  db,
  handleFirestoreError,
  isStudioAdminUser,
  logOutAdmin,
  signInWithGoogle,
} from './firebase';
import {
  AdminSettings,
  AddOnItem,
  AppUserSession,
  ContactRequest,
  InquiryStatus,
  OperationType,
  PricingPackage,
  Project,
  PublicPage,
  ServiceItem,
} from './types';
import {
  INITIAL_ADDONS,
  INITIAL_ADMIN_SETTINGS,
  INITIAL_PACKAGES,
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  getPackageDomainPolicy,
} from './data/seedData';
import {
  extractWebsiteDomain,
  normalizeWebsiteUrl,
} from './utils/imageOptimizer';
import { Navbar } from './components/Navbar';
import { SignInModal } from './components/SignInModal';
import { FeaturedProjectsCarousel } from './components/FeaturedProjectsCarousel';
import { ServicesExplainedSection } from './components/ServicesExplainedSection';
import { PackagesSection } from './components/PackagesSection';
import { MaintenancePackagesSection } from './components/MaintenancePackagesSection';
import {
  AboutSection,
  CallToActionSection,
  ContactSection,
  FloatingWhatsAppButton,
  Footer,
  HeroSection,
  LegalPage,
  PortfolioPage,
  ProcessSection,
  ProjectDetailsPage,
} from './components/PublicPages';
import { AdminDashboard } from './components/AdminDashboard';

function parseRouteFromLocation(): { page: PublicPage; slug?: string } {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path.startsWith('/portfolio/')) {
    const slug = path.replace('/portfolio/', '').trim();
    return { page: 'project-details', slug };
  }
  switch (path) {
    case '/portfolio':
      return { page: 'portfolio' };
    case '/services':
      return { page: 'services' };
    case '/packages':
      return { page: 'packages' };
    case '/about':
      return { page: 'about' };
    case '/process':
      return { page: 'process' };
    case '/contact':
      return { page: 'contact' };
    case '/privacy':
      return { page: 'privacy' };
    case '/terms':
      return { page: 'terms' };
    case '/admin':
      return { page: 'admin' };
    default:
      return { page: 'home' };
  }
}

const SAVED_PROJECTS_MAP_KEY = 'primenest_saved_projects_map_v3';
const DELETED_PROJECT_IDS_KEY = 'primenest_deleted_projects_v3';
const PROJECTS_CACHE_KEY = 'primenest_projects_cache_v3';

function getSavedProjectsMap(): Record<string, Project> {
  try {
    const raw = localStorage.getItem(SAVED_PROJECTS_MAP_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Project>) : {};
  } catch {
    return {};
  }
}

function saveProjectToLocalMap(project: Project): void {
  try {
    const map = getSavedProjectsMap();
    map[project.projectId] = project;
    localStorage.setItem(SAVED_PROJECTS_MAP_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
}

function removeProjectFromLocalMap(projectId: string): void {
  try {
    const map = getSavedProjectsMap();
    delete map[projectId];
    localStorage.setItem(SAVED_PROJECTS_MAP_KEY, JSON.stringify(map));
    const deletedRaw = localStorage.getItem(DELETED_PROJECT_IDS_KEY);
    const deleted: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (!deleted.includes(projectId)) {
      deleted.push(projectId);
      localStorage.setItem(DELETED_PROJECT_IDS_KEY, JSON.stringify(deleted));
    }
  } catch {
    // Ignore storage errors
  }
}

function getDeletedProjectIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_PROJECT_IDS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function cleanProjectDomainAndUrl(proj: Project): {
  cleaned: Project;
  wasDummyFixed: boolean;
} {
  let rawDomain = (proj.domain || '').trim();
  let rawLiveUrl = (proj.liveUrl || '').trim();
  let wasDummyFixed = false;

  const isDummyDomain = rawDomain.endsWith('.primenest.studio');
  const isDummyUrl = rawLiveUrl.includes('.primenest.studio');

  if (isDummyDomain) {
    rawDomain = '';
    wasDummyFixed = true;
  }
  if (isDummyUrl) {
    rawLiveUrl = '';
    wasDummyFixed = true;
  }

  // If user set a valid custom domain, always synchronize liveUrl from it
  if (rawDomain) {
    const cleanDom = extractWebsiteDomain(rawDomain);
    const cleanUrl = normalizeWebsiteUrl(cleanDom);
    if (proj.domain !== cleanDom || proj.liveUrl !== cleanUrl) {
      return {
        cleaned: { ...proj, domain: cleanDom, liveUrl: cleanUrl },
        wasDummyFixed: true,
      };
    }
    return { cleaned: proj, wasDummyFixed };
  }

  // If user set a valid custom liveUrl, always synchronize domain from it
  if (rawLiveUrl) {
    const cleanDom = extractWebsiteDomain(rawLiveUrl);
    const cleanUrl = normalizeWebsiteUrl(rawLiveUrl);
    if (proj.domain !== cleanDom || proj.liveUrl !== cleanUrl) {
      return {
        cleaned: { ...proj, domain: cleanDom, liveUrl: cleanUrl },
        wasDummyFixed: true,
      };
    }
    return { cleaned: proj, wasDummyFixed };
  }

  // If both were cleared because of legacy .primenest.studio dummy URL, use clean default from INITIAL_PROJECTS if applicable
  if (wasDummyFixed) {
    const seedMatch = INITIAL_PROJECTS.find(
      (p) => p.projectId === proj.projectId
    );
    const fallbackDom = seedMatch?.domain || '';
    const fallbackUrl = seedMatch?.liveUrl || '';
    return {
      cleaned: {
        ...proj,
        domain: fallbackDom,
        liveUrl: fallbackUrl,
      },
      wasDummyFixed: true,
    };
  }

  return { cleaned: proj, wasDummyFixed: false };
}

export default function App() {
  const initialRoute = parseRouteFromLocation();
  const [currentPage, setCurrentPage] = useState<PublicPage>(initialRoute.page);
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(
    initialRoute.slug
  );

  // Pre-selected inquiry fields when navigating from a Package or Service card
  const [preselectedService, setPreselectedService] =
    useState<string>('Website Design');
  const [preselectedPackage, setPreselectedPackage] = useState<string>('');
  const [preselectedAddOns, setPreselectedAddOns] = useState<string[]>([]);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [userSession, setUserSession] = useState<AppUserSession | null>(() => {
    try {
      const saved = localStorage.getItem('primenest_user_session');
      return saved ? (JSON.parse(saved) as AppUserSession) : null;
    } catch {
      return null;
    }
  });

  // Firestore Dynamic State (initialized with saved cache + studio seed data)
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedMap = getSavedProjectsMap();
    const deletedIds = getDeletedProjectIds();
    try {
      const cached = localStorage.getItem(PROJECTS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Project[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .filter((p) => !deletedIds.has(p.projectId))
            .map((p) => cleanProjectDomainAndUrl(savedMap[p.projectId] || p).cleaned);
        }
      }
    } catch {
      // Fallback to INITIAL_PROJECTS merged with savedMap
    }
    return INITIAL_PROJECTS.filter((p) => !deletedIds.has(p.projectId)).map(
      (p) => cleanProjectDomainAndUrl(savedMap[p.projectId] || p).cleaned
    );
  });
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [packages, setPackages] = useState<PricingPackage[]>(INITIAL_PACKAGES);
  const [addOns, setAddOns] = useState<AddOnItem[]>(INITIAL_ADDONS);
  const [settings, setSettings] = useState<AdminSettings>(INITIAL_ADMIN_SETTINGS);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);

  const isAdmin =
    isStudioAdminUser(user, userRole) || userSession?.role === 'admin';

  // Handle browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      const route = parseRouteFromLocation();
      setCurrentPage(route.page);
      setCurrentSlug(route.slug);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = useCallback((page: PublicPage, slug?: string) => {
    setCurrentPage(page);
    setCurrentSlug(slug);
    let targetPath = '/';
    if (page === 'project-details' && slug) {
      targetPath = `/portfolio/${slug}`;
    } else if (page !== 'home') {
      targetPath = `/${page}`;
    }
    try {
      window.history.pushState({}, '', targetPath);
    } catch {
      // Ignore history push errors inside restricted iframe contexts
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Sync central theme accent color CSS variable
  useEffect(() => {
    if (settings.accentColor) {
      document.documentElement.style.setProperty(
        '--accent-color',
        settings.accentColor
      );
    }
  }, [settings.accentColor]);

  // Dynamic SEO metadata per route/project
  useEffect(() => {
    const brand = settings.businessName || 'PrimeNEST';
    let title = `${brand} — Professional Website Design & Development`;
    let desc =
      'PrimeNEST creates modern, responsive and professional websites for businesses, brands and individuals.';

    if (currentPage === 'portfolio') {
      title = `Our Work — Portfolio | ${brand}`;
      desc = `A selection of websites and digital experiences created by ${brand}.`;
    } else if (currentPage === 'project-details' && currentSlug) {
      const proj = projects.find((p) => p.slug === currentSlug);
      if (proj) {
        title =
          proj.seoTitle ||
          `${proj.projectName} — ${proj.clientName} Case Study | ${brand}`;
        desc = proj.seoDescription || proj.description;
      }
    } else if (currentPage === 'services') {
      title = `Web Design & Development Services | ${brand}`;
    } else if (currentPage === 'packages') {
      title = `Website Pricing Packages (Starting at ₹799) | ${brand}`;
    } else if (currentPage === 'about') {
      title = `About ${brand} — Building the Web, One Business at a Time`;
    } else if (currentPage === 'process') {
      title = `Our 6-Step Website Development Process | ${brand}`;
    } else if (currentPage === 'contact') {
      title = `Start a Project — Contact ${brand}`;
    } else if (currentPage === 'admin') {
      title = `Studio Admin Dashboard | ${brand}`;
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
  }, [currentPage, currentSlug, projects, settings.businessName]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Listen to user role document if authenticated
  useEffect(() => {
    if (!user) {
      setUserRole(null);
      return;
    }
    const unsubRole = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (snap.exists()) {
          setUserRole(snap.data()?.role || null);
        }
      },
      () => {
        // Ignore read error if doc does not exist yet
      }
    );
    return () => unsubRole();
  }, [user]);

  // Real-time listeners for Public Collections: projects, services, packages, addons, adminSettings
  useEffect(() => {
    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        const savedMap = getSavedProjectsMap();
        const deletedIds = getDeletedProjectIds();

        if (!snap.empty) {
          const loaded = snap.docs
            .map((d) => d.data() as Project)
            .filter((p) => !deletedIds.has(p.projectId))
            .map((rawProj) => {
              const localOverride = savedMap[rawProj.projectId];
              const isLocalNewer =
                localOverride &&
                new Date(localOverride.updatedAt || 0).getTime() >=
                  new Date(rawProj.updatedAt || 0).getTime() &&
                (localOverride.domain !== rawProj.domain ||
                  localOverride.liveUrl !== rawProj.liveUrl ||
                  localOverride.projectName !== rawProj.projectName);

              const baseProj = isLocalNewer ? localOverride : rawProj;
              const { cleaned, wasDummyFixed } =
                cleanProjectDomainAndUrl(baseProj);

              if (wasDummyFixed || isLocalNewer) {
                setDoc(doc(db, 'projects', cleaned.projectId), cleaned).catch(
                  () => {
                    // Ignore background sync notice
                  }
                );
              }
              return cleaned;
            });

          const loadedIds = new Set(loaded.map((p) => p.projectId));
          const localOnlyProjects = Object.values(savedMap).filter(
            (p) => !loadedIds.has(p.projectId) && !deletedIds.has(p.projectId)
          );
          const mergedIds = new Set([
            ...loadedIds,
            ...localOnlyProjects.map((p) => p.projectId),
          ]);

          const merged = [
            ...localOnlyProjects,
            ...loaded,
            ...INITIAL_PROJECTS.filter(
              (p) => !mergedIds.has(p.projectId) && !deletedIds.has(p.projectId)
            ),
          ];

          setProjects(merged);
          try {
            localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(merged));
          } catch {
            // Ignore quota errors
          }
        }
      },
      (err) => {
        console.warn('Firestore projects listener notice:', err.message);
      }
    );

    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map((d) => d.data() as ServiceItem);
          loaded.sort((a, b) => a.order - b.order);
          setServices(loaded);
        }
      },
      (err) => {
        console.warn('Firestore services listener notice:', err.message);
      }
    );

    const unsubPackages = onSnapshot(
      collection(db, 'packages'),
      (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map((d) => d.data() as PricingPackage);
          loaded.sort((a, b) => a.order - b.order);
          const enriched = loaded.map((pkg, idx) => {
            const { domainNote, isFreeDomainHosting } = getPackageDomainPolicy(
              pkg,
              idx
            );
            const hasDomainInFeatures = (pkg.features || []).some((f) =>
              /domain/i.test(f)
            );
            return {
              ...pkg,
              domainNote: pkg.domainNote || domainNote,
              features: hasDomainInFeatures
                ? pkg.features
                : [
                    isFreeDomainHosting
                      ? '1 Year Free Domain & Hosting'
                      : 'Price excluding domain',
                    ...(pkg.features || []),
                  ],
            };
          });
          setPackages(enriched);
        }
      },
      (err) => {
        console.warn('Firestore packages listener notice:', err.message);
      }
    );

    const unsubAddOns = onSnapshot(
      collection(db, 'addons'),
      (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map((d) => d.data() as AddOnItem);
          loaded.sort((a, b) => a.order - b.order);
          setAddOns(loaded);
        }
      },
      (err) => {
        console.warn('Firestore addons listener notice:', err.message);
      }
    );

    const unsubSettings = onSnapshot(
      doc(db, 'adminSettings', 'global'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as AdminSettings;
          const isOldPlaceholderEmail =
            !data.email || data.email === 'hello@primenest.in';
          const isOldPlaceholderPhone =
            !data.phone ||
            data.phone === '+91 98765 43210' ||
            data.phone === '+1 (555) 234-8900';
          const isOldPlaceholderWhatsApp =
            !data.whatsapp ||
            data.whatsapp === '919876543210' ||
            data.whatsapp === '15552348900';
          const isOldDefaultPassword =
            !data.adminPassword ||
            data.adminPassword === 'primenest123' ||
            data.adminPassword === '9961512012';
          const isOldPlaceholderInstagram =
            !data.instagram ||
            data.instagram.includes('primenest.studio') ||
            data.instagram === 'https://instagram.com';

          const resolvedInstagram = isOldPlaceholderInstagram
            ? 'https://instagram.com/primenestonline'
            : data.instagram;

          setSettings({
            ...data,
            email: isOldPlaceholderEmail
              ? 'primenestonlinemart@gmail.com'
              : data.email,
            phone: isOldPlaceholderPhone ? '+91 99615 12012' : data.phone,
            whatsapp: isOldPlaceholderWhatsApp
              ? '919961512012'
              : data.whatsapp,
            adminPassword: isOldDefaultPassword
              ? 'aarifkhaleel786'
              : data.adminPassword,
            instagram: resolvedInstagram,
          });

          if (isOldPlaceholderInstagram) {
            setDoc(
              doc(db, 'adminSettings', 'global'),
              { instagram: 'https://instagram.com/primenestonline' },
              { merge: true }
            ).catch(() => {});
          }
        }
      },
      (err) => {
        console.warn('Firestore settings listener notice:', err.message);
      }
    );

    return () => {
      unsubProjects();
      unsubServices();
      unsubPackages();
      unsubAddOns();
      unsubSettings();
    };
  }, []);

  // Real-time listener for Contact Requests (only when Admin is authenticated)
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setContactRequests([]);
      return;
    }

    const unsubInquiries = onSnapshot(
      collection(db, 'contactRequests'),
      (snap) => {
        const loaded = snap.docs.map((d) => d.data() as ContactRequest);
        loaded.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setContactRequests(loaded);
      },
      (err) => {
        console.warn('Firestore contactRequests listener notice:', err.message);
      }
    );

    return () => unsubInquiries();
  }, [authReady, isAdmin]);

  // Non-destructively sync missing studio defaults into Firestore without overwriting existing edited projects
  const seedDatabaseToFirestore = useCallback(async () => {
    try {
      const existingProjectsSnap = await getDocs(collection(db, 'projects'));
      const existingProjectIds = new Set(
        existingProjectsSnap.docs.map((d) => d.id)
      );
      const deletedIds = getDeletedProjectIds();

      const batch = writeBatch(db);
      INITIAL_PROJECTS.forEach((proj) => {
        if (
          !existingProjectIds.has(proj.projectId) &&
          !deletedIds.has(proj.projectId)
        ) {
          batch.set(doc(db, 'projects', proj.projectId), proj);
        }
      });
      INITIAL_SERVICES.forEach((srv) => {
        batch.set(doc(db, 'services', srv.serviceId), srv, { merge: true });
      });
      INITIAL_PACKAGES.forEach((pkg) => {
        batch.set(doc(db, 'packages', pkg.packageId), pkg, { merge: true });
      });
      INITIAL_ADDONS.forEach((addon) => {
        batch.set(doc(db, 'addons', addon.addOnId), addon, { merge: true });
      });
      batch.set(doc(db, 'adminSettings', 'global'), INITIAL_ADMIN_SETTINGS, {
        merge: true,
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'seedDatabase');
    }
  }, []);

  // ==========================================================================
  // CRUD HANDLERS
  // ==========================================================================
  const handleSaveProject = async (project: Project) => {
    const { cleaned } = cleanProjectDomainAndUrl(project);
    saveProjectToLocalMap(cleaned);

    setProjects((prev) => {
      const exists = prev.some((p) => p.projectId === cleaned.projectId);
      const next = exists
        ? prev.map((p) => (p.projectId === cleaned.projectId ? cleaned : p))
        : [cleaned, ...prev];
      try {
        localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });

    try {
      await setDoc(doc(db, 'projects', cleaned.projectId), cleaned);
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.WRITE,
        `projects/${cleaned.projectId}`
      );
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    removeProjectFromLocalMap(projectId);
    setProjects((prev) => {
      const next = prev.filter((p) => p.projectId !== projectId);
      try {
        localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}`);
    }
  };

  const handleSaveService = async (service: ServiceItem) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.serviceId === service.serviceId);
      const updated = exists
        ? prev.map((s) => (s.serviceId === service.serviceId ? service : s))
        : [...prev, service];
      return updated.sort((a, b) => a.order - b.order);
    });

    try {
      await setDoc(doc(db, 'services', service.serviceId), service);
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.WRITE,
        `services/${service.serviceId}`
      );
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.serviceId !== serviceId));
    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `services/${serviceId}`);
    }
  };

  const handleSavePackage = async (pkg: PricingPackage) => {
    setPackages((prev) =>
      prev.map((p) => (p.packageId === pkg.packageId ? pkg : p))
    );
    try {
      await setDoc(doc(db, 'packages', pkg.packageId), pkg);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `packages/${pkg.packageId}`);
    }
  };

  const handleSaveAddOn = async (addOn: AddOnItem) => {
    setAddOns((prev) => [...prev, addOn]);
    try {
      await setDoc(doc(db, 'addons', addOn.addOnId), addOn);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `addons/${addOn.addOnId}`);
    }
  };

  const handleDeleteAddOn = async (addOnId: string) => {
    setAddOns((prev) => prev.filter((a) => a.addOnId !== addOnId));
    try {
      await deleteDoc(doc(db, 'addons', addOnId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `addons/${addOnId}`);
    }
  };

  const handleSubmitInquiry = async (
    inquiryData: Omit<ContactRequest, 'requestId' | 'status' | 'createdAt'>
  ) => {
    const requestId = `req-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)}`;
    const newRequest: ContactRequest = {
      ...inquiryData,
      requestId,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'contactRequests', requestId), newRequest);
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.CREATE,
        `contactRequests/${requestId}`
      );
    }
  };

  const handleUpdateInquiryStatus = async (
    requestId: string,
    status: InquiryStatus
  ) => {
    const target = contactRequests.find((r) => r.requestId === requestId);
    if (!target) return;
    const updated: ContactRequest = { ...target, status };
    setContactRequests((prev) =>
      prev.map((r) => (r.requestId === requestId ? updated : r))
    );
    try {
      await setDoc(doc(db, 'contactRequests', requestId), updated);
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.UPDATE,
        `contactRequests/${requestId}`
      );
    }
  };

  const handleDeleteInquiry = async (requestId: string) => {
    setContactRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    try {
      await deleteDoc(doc(db, 'contactRequests', requestId));
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.DELETE,
        `contactRequests/${requestId}`
      );
    }
  };

  const handleSaveSettings = async (newSettings: AdminSettings) => {
    setSettings(newSettings);
    try {
      await setDoc(doc(db, 'adminSettings', 'global'), newSettings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'adminSettings/global');
    }
  };

  // Helpers to jump directly to Contact page with a preselected Package or Service
  const handleChoosePackage = (packageLabel: string, chosenAddOns?: string[]) => {
    setPreselectedPackage(packageLabel);
    if (chosenAddOns && chosenAddOns.length > 0) {
      setPreselectedAddOns(chosenAddOns);
    }
    navigateTo('contact');
  };

  const handleSelectServiceForInquiry = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    navigateTo('contact');
  };

  const selectedProject = projects.find((p) => p.slug === currentSlug);
  const featuredHeroProject =
    projects.find((p) => p.featured && p.status === 'Published') || projects[0];

  const handleSignInSuccess = (session: AppUserSession) => {
    setUserSession(session);
    try {
      localStorage.setItem('primenest_user_session', JSON.stringify(session));
    } catch {
      // Ignore storage error
    }
    if (session.role === 'admin') {
      navigateTo('admin');
    }
  };

  const handleSignOutSession = async () => {
    setUserSession(null);
    try {
      localStorage.removeItem('primenest_user_session');
    } catch {
      // Ignore storage error
    }
    if (user) {
      await logOutAdmin();
    }
    if (currentPage === 'admin') {
      navigateTo('home');
    }
  };

  // If on Admin route, render Admin Dashboard
  if (currentPage === 'admin') {
    return (
      <AdminDashboard
        user={user}
        isAdmin={isAdmin}
        onLogin={async () => {
          await signInWithGoogle();
        }}
        onPasswordAdminLogin={handleSignInSuccess}
        onLogout={handleSignOutSession}
        onNavigatePublic={navigateTo}
        projects={projects}
        services={services}
        packages={packages}
        addOns={addOns}
        contactRequests={contactRequests}
        settings={settings}
        onSaveProject={handleSaveProject}
        onDeleteProject={handleDeleteProject}
        onSaveService={handleSaveService}
        onDeleteService={handleDeleteService}
        onSavePackage={handleSavePackage}
        onSaveAddOn={handleSaveAddOn}
        onDeleteAddOn={handleDeleteAddOn}
        onUpdateInquiryStatus={handleUpdateInquiryStatus}
        onDeleteInquiry={handleDeleteInquiry}
        onSaveSettings={handleSaveSettings}
        onSeedDatabase={seedDatabaseToFirestore}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        settings={settings}
        isAdminAuthenticated={isAdmin}
        userSession={userSession}
        onOpenSignIn={() => setIsSignInModalOpen(true)}
        onSignOutSession={handleSignOutSession}
      />

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignInSuccess={handleSignInSuccess}
        onGoogleAdminLogin={async () => {
          await signInWithGoogle();
        }}
        configuredAdminPassword={settings.adminPassword}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            <HeroSection
              settings={settings}
              featuredProject={featuredHeroProject}
              onNavigate={navigateTo}
            />
            <FeaturedProjectsCarousel
              projects={projects}
              onNavigate={navigateTo}
            />
            <PackagesSection
              packages={packages}
              addOns={addOns}
              onChoosePackage={handleChoosePackage}
            />
            <MaintenancePackagesSection
              onChoosePlan={handleChoosePackage}
              whatsappNumber={settings.whatsapp}
            />
            <ServicesExplainedSection
              services={services}
              onNavigate={navigateTo}
              onSelectServiceForInquiry={handleSelectServiceForInquiry}
            />
            <AboutSection settings={settings} onNavigate={navigateTo} />
            <CallToActionSection settings={settings} onNavigate={navigateTo} />
            <ContactSection
              settings={settings}
              packages={packages}
              initialService={preselectedService}
              initialPackage={preselectedPackage}
              initialAddOns={preselectedAddOns}
              onSubmitInquiry={handleSubmitInquiry}
            />
          </>
        )}

        {currentPage === 'portfolio' && (
          <>
            <PortfolioPage projects={projects} onNavigate={navigateTo} />
            <CallToActionSection settings={settings} onNavigate={navigateTo} />
          </>
        )}

        {currentPage === 'project-details' && (
          <>
            <ProjectDetailsPage
              project={selectedProject}
              allProjects={projects}
              onNavigate={navigateTo}
            />
            <CallToActionSection settings={settings} onNavigate={navigateTo} />
          </>
        )}

        {currentPage === 'services' && (
          <>
            <ServicesExplainedSection
              services={services}
              onNavigate={navigateTo}
              onSelectServiceForInquiry={handleSelectServiceForInquiry}
              showFullPageHeader
            />
            <PackagesSection
              packages={packages}
              addOns={addOns}
              onChoosePackage={handleChoosePackage}
            />
            <CallToActionSection settings={settings} onNavigate={navigateTo} />
          </>
        )}

        {currentPage === 'packages' && (
          <>
            <PackagesSection
              packages={packages}
              addOns={addOns}
              onChoosePackage={handleChoosePackage}
            />
            <MaintenancePackagesSection
              onChoosePlan={handleChoosePackage}
              whatsappNumber={settings.whatsapp}
            />
            <ProcessSection onNavigate={navigateTo} />
            <ContactSection
              settings={settings}
              packages={packages}
              initialService={preselectedService}
              initialPackage={preselectedPackage}
              initialAddOns={preselectedAddOns}
              onSubmitInquiry={handleSubmitInquiry}
            />
          </>
        )}

        {currentPage === 'about' && (
          <>
            <AboutSection settings={settings} onNavigate={navigateTo} />
            <CallToActionSection settings={settings} onNavigate={navigateTo} />
          </>
        )}

        {currentPage === 'process' && (
          <>
            <ProcessSection onNavigate={navigateTo} isStandalonePage />
            <PackagesSection
              packages={packages}
              addOns={addOns}
              onChoosePackage={handleChoosePackage}
            />
            <CallToActionSection settings={settings} onNavigate={navigateTo} />
          </>
        )}

        {currentPage === 'contact' && (
          <ContactSection
            settings={settings}
            packages={packages}
            initialService={preselectedService}
            initialPackage={preselectedPackage}
            initialAddOns={preselectedAddOns}
            onSubmitInquiry={handleSubmitInquiry}
          />
        )}

        {currentPage === 'privacy' && (
          <LegalPage
            type="privacy"
            settings={settings}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'terms' && (
          <LegalPage type="terms" settings={settings} onNavigate={navigateTo} />
        )}
      </main>

      <Footer settings={settings} onNavigate={navigateTo} />
      <FloatingWhatsAppButton settings={settings} />

    </div>
  );
}
