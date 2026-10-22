import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  Wrench,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  ArrowLeft,
  Star,
  Trash2,
  Edit3,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Sparkles,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';
import {
  AdminSettings,
  AdminTab,
  AddOnItem,
  AppUserSession,
  ContactRequest,
  InquiryStatus,
  PackageTierStyle,
  PricingPackage,
  Project,
  ProjectCategory,
  ProjectStatus,
  PublicPage,
  ServiceItem,
} from '../types';
import {
  deriveProjectTitleFromDomainOrUrl,
  extractWebsiteDomain,
  generateShowcaseCoverDataUrl,
  isValidDomainOrUrl,
  normalizeWebsiteUrl,
  optimizeImageToWebP,
  sanitizeText,
  slugifyText,
} from '../utils/imageOptimizer';
import { STUDIO_OWNER_EMAIL } from '../firebase';
import { getPackageDomainPolicy } from '../data/seedData';

interface AdminDashboardProps {
  user: User | null;
  isAdmin: boolean;
  onLogin: () => Promise<void>;
  onPasswordAdminLogin: (session: AppUserSession) => void;
  onLogout: () => Promise<void>;
  onNavigatePublic: (page: PublicPage, slug?: string) => void;
  projects: Project[];
  services: ServiceItem[];
  packages: PricingPackage[];
  addOns: AddOnItem[];
  contactRequests: ContactRequest[];
  settings: AdminSettings;
  onSaveProject: (project: Project) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
  onSaveService: (service: ServiceItem) => Promise<void>;
  onDeleteService: (serviceId: string) => Promise<void>;
  onSavePackage: (pkg: PricingPackage) => Promise<void>;
  onSaveAddOn: (addOn: AddOnItem) => Promise<void>;
  onDeleteAddOn: (addOnId: string) => Promise<void>;
  onUpdateInquiryStatus: (requestId: string, status: InquiryStatus) => Promise<void>;
  onDeleteInquiry: (requestId: string) => Promise<void>;
  onSaveSettings: (newSettings: AdminSettings) => Promise<void>;
  onSeedDatabase: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  isAdmin,
  onLogin,
  onPasswordAdminLogin,
  onLogout,
  onNavigatePublic,
  projects,
  services,
  packages,
  addOns,
  contactRequests,
  settings,
  onSaveProject,
  onDeleteProject,
  onSaveService,
  onDeleteService,
  onSavePackage,
  onSaveAddOn,
  onDeleteAddOn,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  onSaveSettings,
  onSeedDatabase,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  // Project Form State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectFilterStatus, setProjectFilterStatus] = useState<string>('All');
  const [uploadMeta, setUploadMeta] = useState<string | null>(null);

  // Quick Showcase / Publish Website (Domain OR URL - any one needed)
  const [quickDomain, setQuickDomain] = useState('');
  const [quickUrl, setQuickUrl] = useState('');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState<ProjectCategory>('Business');

  // Service Form State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Package Form State
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);
  const [newAddOnName, setNewAddOnName] = useState('');
  const [newAddOnPrice, setNewAddOnPrice] = useState('');

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<AdminSettings>(settings);
  const [loginEmail, setLoginEmail] = useState(STUDIO_OWNER_EMAIL);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const showNotice = (type: 'success' | 'error', text: string) => {
    setStatusBanner({ type, text });
    setTimeout(() => {
      setStatusBanner((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  // Start adding a new project
  const startNewProject = () => {
    const now = new Date().toISOString();
    setEditingProject({
      projectId: `proj-${Date.now()}`,
      projectName: '',
      clientName: '',
      slug: '',
      category: 'Business',
      description: '',
      fullDescription: '',
      coverImage: '',
      galleryImages: [],
      services: ['UI/UX Design', 'Website Development', 'Responsive Design'],
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      year: new Date().getFullYear().toString(),
      domain: '',
      liveUrl: '',
      status: 'Published',
      featured: true,
      seoTitle: '',
      seoDescription: '',
      createdAt: now,
      updatedAt: now,
    });
    setUploadMeta(null);
    setActiveTab('add-project');
  };

  const startEditProject = (proj: Project) => {
    setEditingProject({
      ...proj,
      domain: proj.domain || extractWebsiteDomain(proj.liveUrl || ''),
      liveUrl: proj.liveUrl || (proj.domain ? normalizeWebsiteUrl(proj.domain) : ''),
    });
    setUploadMeta(null);
    setActiveTab('edit-project');
  };

  const handleQuickPublishWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawDomain = quickDomain.trim();
    const rawUrl = quickUrl.trim();
    const combinedInput = rawDomain || rawUrl;

    if (!combinedInput) {
      showNotice(
        'error',
        'Please enter either a Website Domain OR a Website URL (any one is needed).'
      );
      return;
    }

    if (rawDomain && !isValidDomainOrUrl(rawDomain)) {
      showNotice('error', 'Please enter a valid domain name (e.g. clientbusiness.com).');
      return;
    }

    if (rawUrl && !isValidDomainOrUrl(rawUrl)) {
      showNotice('error', 'Please enter a valid website URL (e.g. https://clientbusiness.com).');
      return;
    }

    const resolvedDomain = extractWebsiteDomain(rawDomain || rawUrl);
    const resolvedLiveUrl = normalizeWebsiteUrl(rawUrl || rawDomain);
    const derivedName =
      sanitizeText(quickTitle) || deriveProjectTitleFromDomainOrUrl(combinedInput);
    const slug = slugifyText(derivedName);
    const now = new Date().toISOString();
    const autoCover = generateShowcaseCoverDataUrl(
      derivedName,
      resolvedDomain || resolvedLiveUrl,
      quickCategory
    );

    const newProject: Project = {
      projectId: `proj-${Date.now()}`,
      projectName: derivedName,
      clientName: derivedName,
      slug,
      category: quickCategory,
      description: `Modern responsive ${quickCategory.toLowerCase()} website showcased at ${resolvedDomain || resolvedLiveUrl}.`,
      fullDescription: `PrimeNEST designed and published the digital presence for ${derivedName} (${resolvedDomain || resolvedLiveUrl}) with responsive architecture, modern UI/UX, and fast performance across devices.`,
      coverImage: autoCover,
      galleryImages: autoCover ? [autoCover] : [],
      services: ['UI/UX Design', 'Website Development', 'Responsive Design'],
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      year: new Date().getFullYear().toString(),
      domain: resolvedDomain,
      liveUrl: resolvedLiveUrl,
      status: 'Published',
      featured: true,
      seoTitle: `${derivedName} — Website Showcase | PrimeNEST`,
      seoDescription: `Live website showcase for ${derivedName} (${resolvedDomain || resolvedLiveUrl}).`,
      createdAt: now,
      updatedAt: now,
    };

    setIsBusy(true);
    try {
      await onSaveProject(newProject);
      setQuickDomain('');
      setQuickUrl('');
      setQuickTitle('');
      showNotice(
        'success',
        `Website "${derivedName}" (${resolvedDomain || resolvedLiveUrl}) published & showcased!`
      );
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Failed to publish website.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;
    setIsBusy(true);
    try {
      const slug = editingProject.slug || slugifyText(editingProject.projectName || 'project');
      const optimized = await optimizeImageToWebP(file, slug, 'cover');
      setEditingProject({
        ...editingProject,
        slug,
        coverImage: optimized.dataUrl,
      });
      setUploadMeta(
        `Optimized to WebP (${optimized.virtualPath}): ${optimized.originalSizeKb}KB → ${optimized.optimizedSizeKb}KB (${optimized.width}×${optimized.height})`
      );
      showNotice('success', 'Cover image optimized to WebP and attached.');
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;
    setIsBusy(true);
    try {
      const slug = editingProject.slug || slugifyText(editingProject.projectName || 'project');
      const nextIndex = (editingProject.galleryImages?.length || 0) + 1;
      const optimized = await optimizeImageToWebP(file, slug, `image-${nextIndex}`);
      setEditingProject({
        ...editingProject,
        galleryImages: [...(editingProject.galleryImages || []), optimized.dataUrl],
      });
      setUploadMeta(
        `Gallery image ${nextIndex} optimized (${optimized.virtualPath}): ${optimized.originalSizeKb}KB → ${optimized.optimizedSizeKb}KB`
      );
      showNotice('success', 'Gallery image optimized to WebP.');
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Gallery upload failed.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const rawDomain = (editingProject.domain || '').trim();
    const rawLiveUrl = (editingProject.liveUrl || '').trim();
    const anyDomainOrUrl = rawDomain || rawLiveUrl;

    // For publishing/showcasing a live website, require at least one of Domain OR URL (or Project Name if Private/Draft)
    if (editingProject.status === 'Published' && !anyDomainOrUrl && !editingProject.projectName.trim()) {
      showNotice(
        'error',
        'To publish or showcase a website, please provide either a Domain OR a Website URL (any one is needed).'
      );
      return;
    }

    if (rawDomain && !isValidDomainOrUrl(rawDomain)) {
      showNotice(
        'error',
        'Please enter a valid Domain (e.g. clientwebsite.com) or Website URL.'
      );
      return;
    }

    if (rawLiveUrl && !isValidDomainOrUrl(rawLiveUrl)) {
      showNotice(
        'error',
        'Please enter a valid Website URL (e.g. https://clientwebsite.com) or Domain.'
      );
      return;
    }

    const resolvedDomain = anyDomainOrUrl ? extractWebsiteDomain(rawDomain || rawLiveUrl) : '';
    const resolvedLiveUrl = anyDomainOrUrl ? normalizeWebsiteUrl(rawDomain || rawLiveUrl) : '';

    const resolvedProjectName =
      sanitizeText(editingProject.projectName) ||
      (anyDomainOrUrl ? deriveProjectTitleFromDomainOrUrl(anyDomainOrUrl) : '');
    const resolvedClientName =
      sanitizeText(editingProject.clientName) || resolvedProjectName;

    if (!resolvedProjectName) {
      showNotice(
        'error',
        'Please enter either a Domain / Website URL or a Project Name.'
      );
      return;
    }

    const resolvedDescription =
      sanitizeText(editingProject.description) ||
      `Modern responsive ${editingProject.category.toLowerCase()} website${
        resolvedDomain ? ` showcased at ${resolvedDomain}` : ''
      }.`;

    const resolvedCoverImage =
      editingProject.coverImage.trim() ||
      generateShowcaseCoverDataUrl(
        resolvedProjectName,
        resolvedDomain || resolvedLiveUrl || resolvedProjectName,
        editingProject.category
      );

    const finalSlug = slugifyText(editingProject.slug || resolvedProjectName);
    const updated: Project = {
      ...editingProject,
      projectName: resolvedProjectName,
      clientName: resolvedClientName,
      slug: finalSlug,
      domain: resolvedDomain,
      liveUrl: resolvedLiveUrl,
      coverImage: resolvedCoverImage,
      description: resolvedDescription,
      fullDescription: sanitizeText(editingProject.fullDescription || ''),
      updatedAt: new Date().toISOString(),
    };

    setIsBusy(true);
    try {
      await onSaveProject(updated);
      showNotice('success', `Project "${updated.projectName}" saved to database.`);
      setEditingProject(null);
      setActiveTab('projects');
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Failed to save project.');
    } finally {
      setIsBusy(false);
    }
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsBusy(true);
    try {
      await onDeleteProject(projectToDelete.projectId);
      showNotice('success', `Deleted project "${projectToDelete.projectName}".`);
      setProjectToDelete(null);
    } catch (err) {
      showNotice('error', err instanceof Error ? err.message : 'Failed to delete project.');
    } finally {
      setIsBusy(false);
    }
  };

  // ==========================================================================
  // LOGIN SCREEN IF NOT AUTHENTICATED AS ADMIN
  // ==========================================================================
  if (!isAdmin) {
    const isTypedAdminEmail =
      loginEmail.trim().toLowerCase() === STUDIO_OWNER_EMAIL.toLowerCase();

    const handleDirectLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      if (!isTypedAdminEmail) {
        onPasswordAdminLogin({
          name: loginEmail.split('@')[0] || 'Customer',
          email: loginEmail.trim() || 'customer@primenest.guest',
          role: 'customer',
        });
        onNavigatePublic('home');
        return;
      }

      const validPasswords = [
        'aarifkhaleel786',
        ...(settings.adminPassword && settings.adminPassword !== 'primenest123'
          ? [settings.adminPassword]
          : []),
      ];
      if (!validPasswords.includes(loginPassword.trim())) {
        setLoginError('Incorrect admin password. Please try again.');
        return;
      }
      onPasswordAdminLogin({
        name: 'PrimeNEST Admin',
        email: STUDIO_OWNER_EMAIL,
        role: 'admin',
      });
    };

    return (
      <div className="min-h-[85vh] bg-[#F5F5F7] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white border border-[#E4E4E7] rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 bg-[#0B0B14] text-white rounded-xl flex items-center justify-center font-display font-bold text-lg">
              P
            </div>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#6C4EFF]">
              STUDIO SIGN IN
            </span>
          </div>

          <h1 className="font-display text-2xl font-extrabold text-[#0B0B14] mb-2">
            PrimeNEST Sign In
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed mb-6">
            Customers do not need a password. Type{' '}
            <strong>{STUDIO_OWNER_EMAIL}</strong> and enter your password to log in as Admin.
          </p>

          {loginError && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {loginError}
            </div>
          )}

          <form onSubmit={handleDirectLogin} className="space-y-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-[#0B0B14] mb-1.5">
                Email ID
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="primenestonlinemart@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            {isTypedAdminEmail && (
              <div>
                <label className="block text-xs font-semibold text-[#0B0B14] mb-1.5">
                  Admin Password *
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-[#6C4EFF] rounded-xl text-sm"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-5 bg-[#6C4EFF] hover:bg-[#5B3DF5] text-white text-sm font-semibold rounded-full transition-colors cursor-pointer"
            >
              {isTypedAdminEmail ? 'Login as Admin' : 'Continue as Customer'}
            </button>
          </form>

          <div className="space-y-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onLogin}
              className="w-full py-2.5 px-5 bg-[#0B0B14] hover:bg-slate-800 text-white text-xs font-semibold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Or Sign In with Google</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigatePublic('home')}
              className="w-full py-2 px-4 text-xs font-mono-tech uppercase tracking-wider text-[#52525B] hover:text-[#0B0B0F] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ==========================================================================
  const publishedCount = projects.filter((p) => p.status === 'Published').length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const newInquiriesCount = contactRequests.filter((r) => r.status === 'New').length;

  const filteredAdminProjects =
    projectFilterStatus === 'All'
      ? projects
      : projects.filter((p) => p.status === projectFilterStatus);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col lg:flex-row">
      {/* Left Admin Sidebar */}
      <aside className="w-full lg:w-64 bg-[#0B0B0F] text-white shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
        <div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-accent text-white rounded flex items-center justify-center font-display font-bold">
                P
              </div>
              <div>
                <div className="font-display font-bold text-sm leading-none">
                  PrimeNEST
                </div>
                <div className="font-mono-tech text-[10px] text-white/50 uppercase mt-1">
                  STUDIO ADMIN
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigatePublic('home')}
              className="text-xs font-mono-tech text-white/70 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/10"
              title="View Live Website"
            >
              Live Site ↗
            </button>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="p-3 space-y-1 flex lg:flex-col overflow-x-auto">
            {(
              [
                ['dashboard', 'Dashboard', LayoutDashboard],
                ['projects', 'Projects', FolderKanban],
                ['add-project', 'Add Project', Plus],
                ['services', 'Services Explained', Wrench],
                ['packages', 'Packages & Add-Ons', Package],
                ['messages', `Messages (${contactRequests.length})`, MessageSquare],
                ['settings', 'Settings', Settings],
              ] as [AdminTab, string, React.ElementType][]
            ).map(([tabKey, label, Icon]) => {
              const isCurrent =
                activeTab === tabKey ||
                (tabKey === 'projects' && activeTab === 'edit-project');
              return (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => {
                    if (tabKey === 'add-project') {
                      startNewProject();
                    } else {
                      setActiveTab(tabKey);
                    }
                  }}
                  className={`px-3.5 py-2.5 rounded text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-colors shrink-0 lg:w-full text-left cursor-pointer ${
                    isCurrent
                      ? 'bg-accent text-white font-semibold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin User Footer */}
        <div className="hidden lg:block p-4 border-t border-white/10 text-xs">
          <div className="text-white/50 font-mono-tech uppercase text-[10px] mb-1">
            AUTHENTICATED ADMIN
          </div>
          <div className="text-white font-medium truncate mb-3">
            {user?.email || STUDIO_OWNER_EMAIL}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2 px-3 bg-white/10 hover:bg-white/15 text-white rounded flex items-center justify-center gap-2 text-xs font-mono-tech uppercase cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-6xl">
        {/* Status Notification Banner */}
        {statusBanner && (
          <div
            className={`mb-6 p-4 rounded border flex items-center justify-between ${
              statusBanner.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2.5 text-sm font-medium">
              {statusBanner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{statusBanner.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-xs font-mono-tech uppercase underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ================================================================ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-accent">
                  STUDIO COMMAND CENTER
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B0B0F]">
                  PrimeNEST Admin Dashboard
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={startNewProject}
                  className="px-4 py-2.5 bg-[#0B0B0F] hover:bg-accent text-white text-xs sm:text-sm font-semibold rounded flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={async () => {
                    setIsBusy(true);
                    try {
                      await onSeedDatabase();
                      showNotice(
                        'success',
                        'Default portfolio, services, and packages synced to Firestore.'
                      );
                    } catch (err) {
                      showNotice(
                        'error',
                        err instanceof Error ? err.message : 'Sync failed.'
                      );
                    } finally {
                      setIsBusy(false);
                    }
                  }}
                  className="px-3.5 py-2.5 bg-white border border-[#E4E4E7] hover:border-[#0B0B0F] text-[#0B0B0F] text-xs font-mono-tech uppercase rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Studio Defaults</span>
                </button>
              </div>
            </div>

            {/* 4 Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-md border border-[#E4E4E7]">
                <div className="font-mono-tech text-xs uppercase text-[#71717A] mb-2">
                  TOTAL PROJECTS
                </div>
                <div className="font-display text-3xl font-extrabold text-[#0B0B0F]">
                  {projects.length}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  className="mt-3 text-xs font-mono-tech text-accent uppercase"
                >
                  Manage Projects →
                </button>
              </div>

              <div className="bg-white p-6 rounded-md border border-[#E4E4E7]">
                <div className="font-mono-tech text-xs uppercase text-[#71717A] mb-2">
                  PUBLISHED PROJECTS
                </div>
                <div className="font-display text-3xl font-extrabold text-emerald-600">
                  {publishedCount}
                </div>
                <div className="mt-3 text-xs text-[#71717A]">
                  Visible on public Portfolio
                </div>
              </div>

              <div className="bg-white p-6 rounded-md border border-[#E4E4E7]">
                <div className="font-mono-tech text-xs uppercase text-[#71717A] mb-2">
                  FEATURED PROJECTS
                </div>
                <div className="font-display text-3xl font-extrabold text-accent">
                  {featuredCount}
                </div>
                <div className="mt-3 text-xs text-[#71717A]">
                  Active in Homepage Carousel
                </div>
              </div>

              <div className="bg-white p-6 rounded-md border border-[#E4E4E7]">
                <div className="font-mono-tech text-xs uppercase text-[#71717A] mb-2">
                  CONTACT REQUESTS
                </div>
                <div className="font-display text-3xl font-extrabold text-[#0B0B0F]">
                  {contactRequests.length}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('messages')}
                  className="mt-3 text-xs font-mono-tech text-accent uppercase"
                >
                  {newInquiriesCount} New Inquiries →
                </button>
              </div>
            </div>

            {/* Recent Projects & Inquiries Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white border border-[#E4E4E7] rounded-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold text-[#0B0B0F]">
                    Portfolio Projects
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('projects')}
                    className="text-xs font-mono-tech uppercase text-accent"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-[#E4E4E7]">
                  {projects.slice(0, 5).map((p) => (
                    <div
                      key={p.projectId}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.coverImage}
                          alt={p.projectName}
                          className="w-12 h-9 object-cover rounded border border-[#E4E4E7] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-[#0B0B0F] truncate">
                            {p.projectName}
                          </div>
                          <div className="text-xs text-[#71717A] font-mono-tech">
                            {p.category} • {p.status}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => startEditProject(p)}
                        className="px-3 py-1.5 text-xs font-mono-tech border border-[#E4E4E7] hover:border-[#0B0B0F] rounded cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-[#E4E4E7] rounded-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold text-[#0B0B0F]">
                    Recent Client Inquiries
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('messages')}
                    className="text-xs font-mono-tech uppercase text-accent"
                  >
                    Open Inbox →
                  </button>
                </div>
                {contactRequests.length === 0 ? (
                  <p className="text-sm text-[#71717A] py-8 text-center">
                    No client inquiries received yet.
                  </p>
                ) : (
                  <div className="divide-y divide-[#E4E4E7]">
                    {contactRequests.slice(0, 4).map((req) => (
                      <div key={req.requestId} className="py-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-[#0B0B0F]">
                            {req.name}
                          </span>
                          <span className="font-mono-tech text-[11px] px-2 py-0.5 bg-[#F5F5F7] rounded">
                            {req.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#52525B] mt-0.5">
                          {req.service}{' '}
                          {req.selectedPackage ? `• ${req.selectedPackage}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: PROJECTS LIST */}
        {/* ================================================================ */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B0B0F]">
                  Portfolio Projects
                </h1>
                <p className="text-sm text-[#52525B]">
                  Publish or showcase websites using either a Domain OR a Website URL (any one is needed).
                </p>
              </div>
              <button
                type="button"
                onClick={startNewProject}
                className="px-4 py-2.5 bg-[#0B0B0F] hover:bg-accent text-white text-sm font-semibold rounded flex items-center gap-2 self-start cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Full Project</span>
              </button>
            </div>

            {/* Quick Publish / Showcase Website by Domain OR URL (Any One Needed) */}
            <form
              onSubmit={handleQuickPublishWebsite}
              className="bg-white border-2 border-accent/30 rounded-md p-5 sm:p-6 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tech text-[11px] uppercase tracking-wider px-2.5 py-0.5 bg-accent/10 text-accent font-semibold rounded">
                      ANY ONE NEEDED: DOMAIN OR URL
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-[#0B0B0F] mt-1">
                    Quick Publish / Showcase Website
                  </h2>
                  <p className="text-xs text-[#52525B]">
                    To publish or showcase a website on this platform, enter <strong>either</strong> the Website Domain <strong>or</strong> the Website URL below — only any one is needed.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
                <div>
                  <label className="block font-mono-tech text-[11px] uppercase font-semibold text-[#0B0B0F] mb-1.5">
                    Website Domain
                  </label>
                  <input
                    type="text"
                    value={quickDomain}
                    onChange={(e) => setQuickDomain(e.target.value)}
                    placeholder="e.g. cncadoor.com"
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] focus:border-accent rounded text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono-tech text-[11px] uppercase font-semibold text-[#0B0B0F] mb-1.5">
                    OR Website URL
                  </label>
                  <input
                    type="text"
                    value={quickUrl}
                    onChange={(e) => setQuickUrl(e.target.value)}
                    placeholder="e.g. https://cncadoor.com"
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] focus:border-accent rounded text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono-tech text-[11px] uppercase font-semibold text-[#52525B] mb-1.5">
                    Website / Brand Name
                  </label>
                  <input
                    type="text"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="Auto-detected from Domain/URL"
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] focus:border-accent rounded text-sm outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value as ProjectCategory)}
                    className="px-3 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-xs font-medium text-[#0B0B0F]"
                    aria-label="Category"
                  >
                    {['Business', 'E-commerce', 'Portfolio', 'Custom', 'Redesign'].map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="flex-1 py-2.5 px-4 bg-accent hover:bg-[#5B3DF5] text-white text-xs sm:text-sm font-semibold rounded transition-colors cursor-pointer shrink-0"
                  >
                    {isBusy ? 'Publishing...' : 'Publish Website'}
                  </button>
                </div>
              </div>
            </form>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Published', 'Private', 'Draft', 'Archived'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setProjectFilterStatus(st)}
                  className={`px-3.5 py-1.5 rounded text-xs font-mono-tech uppercase border cursor-pointer ${
                    projectFilterStatus === st
                      ? 'bg-[#0B0B0F] text-white border-[#0B0B0F]'
                      : 'bg-white text-[#52525B] border-[#E4E4E7]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Projects Table */}
            <div className="bg-white border border-[#E4E4E7] rounded-md overflow-hidden">
              <div className="divide-y divide-[#E4E4E7]">
                {filteredAdminProjects.map((proj) => {
                  const displayDomain =
                    proj.domain || extractWebsiteDomain(proj.liveUrl || '');
                  const displayUrl =
                    proj.liveUrl || (proj.domain ? normalizeWebsiteUrl(proj.domain) : '');
                  return (
                    <div
                      key={proj.projectId}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={proj.coverImage}
                          alt={proj.projectName}
                          className="w-20 h-14 object-cover rounded border border-[#E4E4E7] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-bold text-base text-[#0B0B0F]">
                              {proj.projectName}
                            </span>
                            <span className="px-2 py-0.5 text-[11px] font-mono-tech bg-[#F5F5F7] border border-[#E4E4E7] rounded">
                              {proj.category}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[11px] font-mono-tech rounded ${
                                proj.status === 'Published'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : proj.status === 'Private'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-zinc-100 text-zinc-600'
                              }`}
                            >
                              {proj.status}
                            </span>
                          </div>
                          <div className="text-xs text-[#52525B] mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span>{proj.clientName}</span>
                            <span>• Year: {proj.year}</span>
                            <span>• Slug: /portfolio/{proj.slug}</span>
                            {(displayDomain || displayUrl) && (
                              <a
                                href={displayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-accent font-mono-tech hover:underline"
                              >
                                <span>• {displayDomain || displayUrl}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={async () => {
                            await onSaveProject({
                              ...proj,
                              featured: !proj.featured,
                              updatedAt: new Date().toISOString(),
                            });
                            showNotice(
                              'success',
                              `${proj.projectName} ${
                                !proj.featured ? 'added to' : 'removed from'
                              } Featured Carousel.`
                            );
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-mono-tech border flex items-center gap-1.5 cursor-pointer ${
                            proj.featured
                              ? 'bg-accent/10 border-accent text-accent font-semibold'
                              : 'bg-white border-[#E4E4E7] text-[#71717A]'
                          }`}
                          title="Toggle Featured on Homepage Carousel"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>{proj.featured ? 'Featured' : 'Feature'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => startEditProject(proj)}
                          className="px-3 py-1.5 bg-[#F5F5F7] hover:bg-[#0B0B0F] text-[#0B0B0F] hover:text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setProjectToDelete(proj)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delete Confirmation Modal (Required by Section 12 of PRD) */}
            {projectToDelete && (
              <div className="fixed inset-0 z-50 bg-[#0B0B0F]/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white border border-[#E4E4E7] rounded-md max-w-md w-full p-6 shadow-xl">
                  <h3 className="font-display text-xl font-bold text-[#0B0B0F] mb-2">
                    Are you sure you want to delete this project?
                  </h3>
                  <p className="text-sm text-[#52525B] mb-6">
                    You are about to permanently delete{' '}
                    <strong>{projectToDelete.projectName}</strong> (
                    {projectToDelete.clientName}). This action cannot be undone.
                  </p>
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setProjectToDelete(null)}
                      className="px-4 py-2 border border-[#E4E4E7] text-[#52525B] text-xs font-mono-tech uppercase rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={confirmDeleteProject}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono-tech uppercase font-semibold rounded cursor-pointer"
                    >
                      {isBusy ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: ADD / EDIT PROJECT FORM */}
        {/* ================================================================ */}
        {(activeTab === 'add-project' || activeTab === 'edit-project') &&
          editingProject && (
            <div className="bg-white border border-[#E4E4E7] rounded-md p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E4E4E7]">
                <div>
                  <span className="font-mono-tech text-xs uppercase text-accent">
                    {activeTab === 'add-project'
                      ? 'NEW PORTFOLIO ENTRY'
                      : 'EDITING PROJECT'}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[#0B0B0F]">
                    {editingProject.projectName || 'Publish / Showcase Website'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  className="px-3.5 py-2 border border-[#E4E4E7] text-xs font-mono-tech uppercase rounded"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleProjectSubmit} className="space-y-6">
                {/* Website Domain OR Website URL Section (Any One Needed) */}
                <div className="p-5 bg-[#F5F5F7] border-2 border-accent/30 rounded-md space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-accent/15 text-accent font-mono-tech text-[11px] uppercase font-semibold rounded mb-1">
                        ANY ONE IS NEEDED: DOMAIN OR URL
                      </span>
                      <h3 className="font-display text-base font-bold text-[#0B0B0F]">
                        Website Domain or Website URL
                      </h3>
                      <p className="text-xs text-[#52525B]">
                        For publishing or showcasing a website on this platform, you only need to provide <strong>any one</strong> — either the <strong>Domain</strong> (e.g. <code>cncadoor.com</code>) OR the <strong>Website URL</strong> (e.g. <code>https://cncadoor.com</code>).
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5 text-[#0B0B0F]">
                        Website Domain
                      </label>
                      <input
                        type="text"
                        value={editingProject.domain || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const trimmed = val.trim();
                          const syncedUrl = trimmed ? normalizeWebsiteUrl(trimmed) : '';
                          const autoTitle =
                            !editingProject.projectName && val.includes('.')
                              ? deriveProjectTitleFromDomainOrUrl(val)
                              : editingProject.projectName;
                          setEditingProject({
                            ...editingProject,
                            domain: val,
                            liveUrl: syncedUrl,
                            projectName: autoTitle,
                            clientName: editingProject.clientName || autoTitle,
                            slug: editingProject.slug || (autoTitle ? slugifyText(autoTitle) : ''),
                          });
                        }}
                        placeholder="e.g. cncadoor.com or www.thegreenbowl.in"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] focus:border-accent rounded text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5 text-[#0B0B0F]">
                        OR Live Website URL
                      </label>
                      <input
                        type="text"
                        value={editingProject.liveUrl || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const trimmed = val.trim();
                          const syncedDomain = trimmed ? extractWebsiteDomain(trimmed) : '';
                          const autoTitle =
                            !editingProject.projectName && val.includes('.')
                              ? deriveProjectTitleFromDomainOrUrl(val)
                              : editingProject.projectName;
                          setEditingProject({
                            ...editingProject,
                            liveUrl: val,
                            domain: syncedDomain,
                            projectName: autoTitle,
                            clientName: editingProject.clientName || autoTitle,
                            slug: editingProject.slug || (autoTitle ? slugifyText(autoTitle) : ''),
                          });
                        }}
                        placeholder="e.g. https://cncadoor.com"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E4E4E7] focus:border-accent rounded text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={editingProject.projectName}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          projectName: e.target.value,
                          slug: slugifyText(e.target.value),
                        })
                      }
                      placeholder="e.g. CNCADOOR"
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-2">
                      Client / Business Name
                    </label>
                    <input
                      type="text"
                      value={editingProject.clientName}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          clientName: e.target.value,
                        })
                      }
                      placeholder="e.g. CNCADOOR Custom Woodworks"
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={editingProject.slug}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          slug: slugifyText(e.target.value),
                        })
                      }
                      placeholder="cncadoor"
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm font-mono-tech"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-2">
                      Category *
                    </label>
                    <select
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          category: e.target.value as ProjectCategory,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    >
                      {['Business', 'E-commerce', 'Portfolio', 'Custom', 'Redesign'].map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-2">
                      Project Status *
                    </label>
                    <select
                      value={editingProject.status}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          status: e.target.value as ProjectStatus,
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    >
                      {['Published', 'Private', 'Draft', 'Archived'].map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-2">
                      Completion Year *
                    </label>
                    <input
                      type="text"
                      value={editingProject.year}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          year: e.target.value,
                        })
                      }
                      placeholder="2026"
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>

                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingProject.featured}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            featured: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-[#6C4EFF]"
                      />
                      <span className="text-sm font-semibold text-[#0B0B0F]">
                        Featured on Homepage Carousel
                      </span>
                    </label>
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <label className="block font-mono-tech text-xs uppercase font-semibold mb-2">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Concise summary of the website built for the client..."
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono-tech text-xs uppercase font-semibold mb-2">
                    Detailed Case Study
                  </label>
                  <textarea
                    rows={4}
                    value={editingProject.fullDescription || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        fullDescription: e.target.value,
                      })
                    }
                    placeholder="Explain the client challenge, design approach, and outcome..."
                    className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                  />
                </div>

                {/* Image Upload & WebP Optimization */}
                <div className="p-5 bg-[#F5F5F7] border border-[#E4E4E7] rounded-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-xs uppercase font-semibold text-[#0B0B0F]">
                      Portfolio Image Management (Optional — Auto-Generates Preview if Empty)
                    </span>
                    {uploadMeta && (
                      <span className="font-mono-tech text-xs text-emerald-700">
                        {uploadMeta}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold mb-2">
                        Upload Cover Image (Converts to portfolio/{editingProject.slug || 'project'}/cover.webp)
                      </label>
                      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-dashed border-[#0B0B0F] rounded cursor-pointer hover:bg-[#F5F5F7] text-xs font-mono-tech">
                        <Upload className="w-4 h-4" />
                        <span>Select Cover Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={editingProject.coverImage}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            coverImage: e.target.value,
                          })
                        }
                        placeholder="Or paste cover image URL (leave blank to auto-generate from Domain/URL)..."
                        className="mt-2 w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-2">
                        Add Gallery Images (Converts to WebP)
                      </label>
                      <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-dashed border-[#E4E4E7] hover:border-[#0B0B0F] rounded cursor-pointer text-xs font-mono-tech">
                        <Upload className="w-4 h-4" />
                        <span>Upload Gallery Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleGalleryUpload}
                          className="hidden"
                        />
                      </label>
                      {editingProject.galleryImages &&
                        editingProject.galleryImages.length > 0 && (
                          <div className="mt-2 flex items-center gap-2 overflow-x-auto">
                            {editingProject.galleryImages.map((gImg, idx) => (
                              <div key={idx} className="relative shrink-0">
                                <img
                                  src={gImg}
                                  alt={`Gallery ${idx + 1}`}
                                  className="w-16 h-11 object-cover rounded border border-[#E4E4E7]"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingProject({
                                      ...editingProject,
                                      galleryImages:
                                        editingProject.galleryImages.filter(
                                          (_, i) => i !== idx
                                        ),
                                    })
                                  }
                                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-xs text-[10px] flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Services & Technologies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-2">
                      Services Provided (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingProject.services.join(', ')}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          services: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="UI/UX Design, Website Development, Responsive Design"
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-2">
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editingProject.technologies.join(', ')}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          technologies: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="HTML, CSS, JavaScript, React, Firebase"
                      className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E4E4E7] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('projects')}
                    className="px-5 py-2.5 border border-[#E4E4E7] rounded text-xs font-mono-tech uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBusy}
                    className="px-6 py-2.5 bg-[#0B0B0F] hover:bg-accent text-white text-sm font-semibold rounded cursor-pointer"
                  >
                    {isBusy ? 'Saving...' : 'Save & Publish Project'}
                  </button>
                </div>
              </form>
            </div>
          )}

        {/* ================================================================ */}
        {/* TAB 4: SERVICES & 'SERVICES EXPLAINED' MANAGEMENT */}
        {/* ================================================================ */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B0B0F]">
                  Services &amp; “Services Explained” Manager
                </h1>
                <p className="text-sm text-[#52525B]">
                  Manage service cards, what each service entails, typical process steps, and client benefits.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingService({
                    serviceId: `srv-${Date.now()}`,
                    title: '',
                    description: '',
                    whatItEntails: '',
                    typicalProcess: [
                      'Discovery & Planning',
                      'Design & Architecture',
                      'Development & Testing',
                      'Launch & Handover',
                    ],
                    clientBenefits: [
                      'Modern, trustworthy digital presence',
                      'Responsive across mobile, tablet, and desktop',
                    ],
                    deliverables: ['Custom UI/UX', 'Responsive Layout', 'Technical SEO'],
                    iconName: 'Layout',
                    order: services.length + 1,
                    active: true,
                    updatedAt: new Date().toISOString(),
                  })
                }
                className="px-4 py-2.5 bg-[#0B0B0F] hover:bg-accent text-white text-xs sm:text-sm font-semibold rounded flex items-center gap-2 self-start cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            {editingService ? (
              <div className="bg-white border border-[#E4E4E7] rounded-md p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-4">
                  <h2 className="font-display text-xl font-bold text-[#0B0B0F]">
                    Edit Service: {editingService.title || 'New Service'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="text-xs font-mono-tech uppercase text-[#71717A]"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      value={editingService.title}
                      onChange={(e) =>
                        setEditingService({ ...editingService, title: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                      Icon
                    </label>
                    <select
                      value={editingService.iconName}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          iconName: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    >
                      {[
                        'Layout',
                        'Building2',
                        'ShoppingBag',
                        'Code2',
                        'RefreshCw',
                        'ShieldCheck',
                      ].map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={editingService.order}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          order: Number(e.target.value) || 1,
                        })
                      }
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                    Short Card Description *
                  </label>
                  <input
                    type="text"
                    value={editingService.description}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                    1. What the Service Entails (Detailed Explanation)
                  </label>
                  <textarea
                    rows={3}
                    value={editingService.whatItEntails}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        whatItEntails: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                      2. Typical Process Steps (one step per line)
                    </label>
                    <textarea
                      rows={4}
                      value={(editingService.typicalProcess || []).join('\n')}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          typicalProcess: e.target.value
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                      3. Benefits for the Client (one benefit per line)
                    </label>
                    <textarea
                      rows={4}
                      value={(editingService.clientBenefits || []).join('\n')}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          clientBenefits: e.target.value
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                    Key Deliverables (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingService.deliverables.join(', ')}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        deliverables: e.target.value
                          .split(',')
                          .map((d) => d.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#E4E4E7]">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 border border-[#E4E4E7] rounded text-xs font-mono-tech uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!editingService.title.trim()) {
                        showNotice('error', 'Service title is required.');
                        return;
                      }
                      await onSaveService({
                        ...editingService,
                        updatedAt: new Date().toISOString(),
                      });
                      showNotice('success', `Saved service "${editingService.title}".`);
                      setEditingService(null);
                    }}
                    className="px-5 py-2 bg-[#0B0B0F] hover:bg-accent text-white text-xs font-mono-tech uppercase font-semibold rounded cursor-pointer"
                  >
                    Save Service Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.serviceId}
                    className="bg-white border border-[#E4E4E7] rounded-md p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono-tech text-xs text-accent font-semibold">
                          0{srv.order} // {srv.iconName}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingService(srv)}
                            className="px-3 py-1 bg-[#F5F5F7] hover:bg-[#0B0B0F] text-[#0B0B0F] hover:text-white text-xs font-semibold rounded cursor-pointer"
                          >
                            Edit Explained Content
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteService(srv.serviceId)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#0B0B0F] mb-1">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-[#52525B] mb-3">{srv.description}</p>
                      <div className="text-[11px] text-[#71717A] bg-[#F5F5F7] p-2.5 rounded">
                        <strong>Entails:</strong>{' '}
                        {(srv.whatItEntails || '').slice(0, 110)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 5: PACKAGES & ADD-ONS MANAGEMENT */}
        {/* ================================================================ */}
        {activeTab === 'packages' && (
          <div className="space-y-8">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B0B0F]">
                Packages &amp; Add-Ons Management
              </h1>
              <p className="text-sm text-[#52525B]">
                Configure PrimeNEST’s 6 pricing packages and optional add-on services.
              </p>
            </div>

            {editingPackage ? (
              <div className="bg-white border border-[#E4E4E7] rounded-md p-6 space-y-4">
                <h2 className="font-display text-xl font-bold text-[#0B0B0F]">
                  Edit Package: {editingPackage.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-mono-tech text-xs uppercase mb-1">
                      Package Name
                    </label>
                    <input
                      type="text"
                      value={editingPackage.name}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-xs uppercase mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      value={editingPackage.price}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, price: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-xs uppercase mb-1">
                      Delivery Time
                    </label>
                    <input
                      type="text"
                      value={editingPackage.deliveryTime}
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          deliveryTime: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-xs uppercase mb-1">
                      Badge (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingPackage.badge || ''}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, badge: e.target.value })
                      }
                      placeholder="MOST POPULAR / RECOMMENDED"
                      className="w-full px-3 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono-tech text-xs uppercase mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={editingPackage.subtitle}
                      onChange={(e) =>
                        setEditingPackage({ ...editingPackage, subtitle: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono-tech text-xs uppercase mb-1">
                      Domain &amp; Hosting Note
                    </label>
                    <input
                      type="text"
                      value={
                        editingPackage.domainNote ??
                        getPackageDomainPolicy(editingPackage).domainNote
                      }
                      onChange={(e) =>
                        setEditingPackage({
                          ...editingPackage,
                          domainNote: e.target.value,
                        })
                      }
                      placeholder="Excluding Domain OR 1 Year Free Domain & Hosting"
                      className="w-full px-3 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono-tech text-xs uppercase mb-1">
                    Included Features (one per line)
                  </label>
                  <textarea
                    rows={6}
                    value={editingPackage.features.join('\n')}
                    onChange={(e) =>
                      setEditingPackage({
                        ...editingPackage,
                        features: e.target.value
                          .split('\n')
                          .map((f) => f.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingPackage(null)}
                    className="px-4 py-2 border border-[#E4E4E7] rounded text-xs font-mono-tech uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await onSavePackage({
                        ...editingPackage,
                        updatedAt: new Date().toISOString(),
                      });
                      showNotice('success', `Updated ${editingPackage.name} package.`);
                      setEditingPackage(null);
                    }}
                    className="px-5 py-2 bg-[#0B0B0F] text-white text-xs font-mono-tech uppercase rounded cursor-pointer"
                  >
                    Save Package
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg, idx) => {
                  const { domainNote, isFreeDomainHosting } =
                    getPackageDomainPolicy(pkg, idx);
                  return (
                    <div
                      key={pkg.packageId}
                      className="bg-white border border-[#E4E4E7] rounded-md p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono-tech text-xs font-bold text-[#0B0B0F]">
                            {pkg.name}
                          </span>
                          <span className="font-display font-extrabold text-lg text-accent">
                            {pkg.price}
                          </span>
                        </div>
                        <div className="mb-2.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                              isFreeDomainHosting
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {domainNote}
                          </span>
                        </div>
                        <p className="text-xs text-[#52525B] mb-3">{pkg.subtitle}</p>
                        <div className="text-[11px] font-mono-tech text-[#71717A] mb-3">
                          Delivery: {pkg.deliveryTime} • {pkg.features.length} features
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingPackage(pkg)}
                        className="w-full py-2 bg-[#F5F5F7] hover:bg-[#0B0B0F] text-[#0B0B0F] hover:text-white text-xs font-semibold rounded transition-colors cursor-pointer"
                      >
                        Edit Package
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add-Ons Manager */}
            <div className="bg-white border border-[#E4E4E7] rounded-md p-6">
              <h2 className="font-display text-lg font-bold text-[#0B0B0F] mb-4">
                Optional Add-Ons
              </h2>
              <div className="flex flex-wrap gap-3 mb-5">
                <input
                  type="text"
                  value={newAddOnName}
                  onChange={(e) => setNewAddOnName(e.target.value)}
                  placeholder="Add-on name (e.g. Extra page)"
                  className="px-3 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm flex-1 min-w-[180px]"
                />
                <input
                  type="text"
                  value={newAddOnPrice}
                  onChange={(e) => setNewAddOnPrice(e.target.value)}
                  placeholder="Price (e.g. ₹300)"
                  className="px-3 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm w-40"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!newAddOnName.trim() || !newAddOnPrice.trim()) return;
                    await onSaveAddOn({
                      addOnId: `addon-${Date.now()}`,
                      name: newAddOnName.trim(),
                      price: newAddOnPrice.trim(),
                      order: addOns.length + 1,
                      active: true,
                    });
                    setNewAddOnName('');
                    setNewAddOnPrice('');
                    showNotice('success', 'Add-on saved.');
                  }}
                  className="px-4 py-2 bg-[#0B0B0F] text-white text-xs font-mono-tech uppercase rounded cursor-pointer"
                >
                  + Add
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {addOns.map((addon) => (
                  <div
                    key={addon.addOnId}
                    className="p-3 bg-[#F5F5F7] border border-[#E4E4E7] rounded flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#0B0B0F]">
                        {addon.name}
                      </span>{' '}
                      — <span className="font-mono-tech">{addon.price}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteAddOn(addon.addOnId)}
                      className="text-red-600 hover:underline ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 6: CONTACT INQUIRIES / MESSAGES */}
        {/* ================================================================ */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B0B0F]">
                Client Project Inquiries
              </h1>
              <p className="text-sm text-[#52525B]">
                Review and respond to project requests submitted through the Contact form.
              </p>
            </div>

            {contactRequests.length === 0 ? (
              <div className="bg-white border border-[#E4E4E7] rounded-md p-12 text-center text-[#71717A]">
                No project inquiries submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {contactRequests.map((req) => (
                  <div
                    key={req.requestId}
                    className="bg-white border border-[#E4E4E7] rounded-md p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 pb-4 mb-4 border-b border-[#E4E4E7]">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="font-display text-lg font-bold text-[#0B0B0F]">
                            {req.name}
                          </h3>
                          {req.businessName && (
                            <span className="text-xs font-mono-tech px-2 py-0.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded">
                              {req.businessName}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#52525B] mt-1 flex flex-wrap gap-3">
                          <span>Email: {req.email}</span>
                          {req.phone && <span>Phone: {req.phone}</span>}
                          <span>
                            Received:{' '}
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={req.status}
                          onChange={(e) =>
                            onUpdateInquiryStatus(
                              req.requestId,
                              e.target.value as InquiryStatus
                            )
                          }
                          className="px-3 py-1.5 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-xs font-mono-tech"
                        >
                          {['New', 'In Progress', 'Responded', 'Archived'].map(
                            (st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            )
                          )}
                        </select>
                        <button
                          type="button"
                          onClick={() => onDeleteInquiry(req.requestId)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3 text-xs font-mono-tech">
                      <span className="px-2.5 py-1 bg-[#0B0B0F] text-white rounded">
                        SERVICE: {req.service}
                      </span>
                      {req.selectedPackage && (
                        <span className="px-2.5 py-1 bg-accent text-white rounded">
                          PACKAGE: {req.selectedPackage}
                        </span>
                      )}
                      {req.budget && (
                        <span className="px-2.5 py-1 bg-[#F5F5F7] border border-[#E4E4E7] text-[#0B0B0F] rounded">
                          BUDGET: {req.budget}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[#111111] whitespace-pre-line bg-[#F5F5F7] p-4 rounded border border-[#E4E4E7]">
                      {req.message}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <a
                        href={`mailto:${req.email}?subject=${encodeURIComponent(
                          `Re: Your PrimeNEST Website Inquiry`
                        )}`}
                        className="px-3.5 py-1.5 bg-[#0B0B0F] text-white text-xs font-mono-tech uppercase rounded"
                      >
                        Reply by Email
                      </a>
                      {req.phone && (
                        <a
                          href={`https://wa.me/${req.phone.replace(
                            /[^0-9]/g,
                            ''
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-mono-tech uppercase rounded"
                        >
                          WhatsApp Client
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 7: STUDIO SETTINGS & THEME & STATS */}
        {/* ================================================================ */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-[#E4E4E7] rounded-md p-6 sm:p-8 max-w-3xl">
            <h1 className="font-display text-2xl font-extrabold text-[#0B0B0F] mb-2">
              Studio Settings, WhatsApp &amp; Theme Configuration
            </h1>
            <p className="text-sm text-[#52525B] mb-6">
              Update PrimeNEST contact details, WhatsApp integration number, About page statistics, and central theme accent color.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsBusy(true);
                try {
                  await onSaveSettings({
                    ...settingsForm,
                    updatedAt: new Date().toISOString(),
                  });
                  showNotice('success', 'Studio settings updated across website.');
                } catch (err) {
                  showNotice(
                    'error',
                    err instanceof Error ? err.message : 'Failed to save settings.'
                  );
                } finally {
                  setIsBusy(false);
                }
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.businessName}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        businessName: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        tagline: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                    Public Contact Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                    Public Phone
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        whatsapp: e.target.value,
                      })
                    }
                    placeholder="919961512012"
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm font-mono-tech"
                  />
                </div>

                <div>
                  <label className="block font-mono-tech text-xs uppercase font-semibold mb-1.5">
                    Instagram Handle / URL
                  </label>
                  <input
                    type="text"
                    value={settingsForm.instagram || ''}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      const fullUrl =
                        !val || val.startsWith('http')
                          ? val
                          : `https://instagram.com/${val.replace(/^@/, '')}`;
                      setSettingsForm({
                        ...settingsForm,
                        instagram: fullUrl,
                      });
                    }}
                    placeholder="primenestonline"
                    className="w-full px-3.5 py-2 bg-[#F5F5F7] border border-[#E4E4E7] rounded text-sm"
                  />
                </div>
              </div>

              {/* Editable About Statistics */}
              <div className="p-5 bg-[#F5F5F7] border border-[#E4E4E7] rounded-md">
                <div className="font-mono-tech text-xs uppercase font-semibold text-[#0B0B0F] mb-3">
                  Editable About Section Statistics
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#52525B] mb-1">
                      Projects Completed
                    </label>
                    <input
                      type="text"
                      value={settingsForm.statsProjectsCompleted}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          statsProjectsCompleted: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#52525B] mb-1">
                      Websites Published
                    </label>
                    <input
                      type="text"
                      value={settingsForm.statsWebsitesPublished}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          statsWebsitesPublished: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#52525B] mb-1">
                      Happy Clients
                    </label>
                    <input
                      type="text"
                      value={settingsForm.statsHappyClients}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          statsHappyClients: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#E4E4E7] rounded text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Central Theme Accent Color */}
              <div className="p-5 bg-[#F5F5F7] border border-[#E4E4E7] rounded-md">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="font-mono-tech text-xs uppercase font-semibold text-[#0B0B0F]">
                      Brand Accent Color
                    </div>
                    <p className="text-xs text-[#52525B]">
                      Changes buttons, badges, and highlights across the entire website.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settingsForm.accentColor || '#6C4EFF'}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          accentColor: e.target.value,
                        })
                      }
                      className="w-10 h-10 rounded cursor-pointer border border-[#E4E4E7]"
                    />
                    <input
                      type="text"
                      value={settingsForm.accentColor}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          accentColor: e.target.value,
                        })
                      }
                      className="w-28 px-3 py-2 bg-white border border-[#E4E4E7] rounded text-xs font-mono-tech"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="px-6 py-3 bg-[#0B0B0F] hover:bg-accent text-white text-sm font-semibold rounded cursor-pointer"
              >
                {isBusy ? 'Saving...' : 'Save Studio Settings'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
