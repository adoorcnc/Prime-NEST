import { AdminSettings, AddOnItem, PricingPackage, Project, ServiceItem } from '../types';
import cncadoorImg from '../assets/images/cncadoor_project_1790483071576.jpg';
import greenBowlImg from '../assets/images/green_bowl_project_1790485205610.jpg';
import techSphereImg from '../assets/images/techsphere_project_1790485220539.jpg';
import fitLifeImg from '../assets/images/fitlife_project_1790485232303.jpg';
import kinetixImg from '../assets/images/kinetix_webapp_project_1790483104588.jpg';
import nordicImg from '../assets/images/nordic_redesign_project_1790483115597.jpg';
import brandBoxImg from '../assets/images/primenest_brand_box_1790485253860.jpg';
import deskWorkspaceImg from '../assets/images/primenest_desk_workspace_1790838445666.jpg';
import notebookQuoteImg from '../assets/images/primenest_notebook_quote_1790838457999.jpg';

export { brandBoxImg, deskWorkspaceImg, notebookQuoteImg };

export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
  businessName: 'PrimeNEST',
  tagline: 'We Build Websites That Build Businesses.',
  email: 'primenestonlinemart@gmail.com',
  phone: '+91 99615 12012',
  whatsapp: '919961512012',
  instagram: 'https://instagram.com/primenestonline',
  facebook: 'https://facebook.com/primenest.studio',
  logo: 'PrimeNEST',
  primaryColor: '#0B0B14',
  accentColor: '#6C4EFF',
  adminPassword: 'aarifkhaleel786',
  statsProjectsCompleted: '24+',
  statsWebsitesPublished: '18+',
  statsHappyClients: '12+',
  updatedAt: '2026-09-26T22:49:00.000Z',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    projectId: 'proj-cncadoor',
    projectName: 'CNCADOOR',
    clientName: 'CNCADOOR',
    slug: 'cncadoor',
    category: 'Business',
    description: 'Custom wooden doors and readymade products showcase website.',
    fullDescription:
      'PrimeNEST designed and developed a modern website for CNCADOOR to showcase custom wooden doors and readymade products. We built a structured digital showroom with high-resolution finish previews, specification sheets for contractors and homeowners, and a direct quotation inquiry workflow that performs effortlessly across mobile and desktop devices.',
    coverImage: cncadoorImg,
    galleryImages: [cncadoorImg, nordicImg],
    services: [
      'UI/UX Design',
      'Website Development',
      'Responsive Design',
      'Product Showcase',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Firebase'],
    year: '2026',
    domain: 'cncadoor.com',
    liveUrl: 'https://cncadoor.com',
    status: 'Published',
    featured: true,
    seoTitle: 'CNCADOOR — Custom Wooden Door Website Case Study | PrimeNEST',
    seoDescription:
      'Custom wooden doors and readymade products showcase website created by PrimeNEST.',
    createdAt: '2026-06-14T10:00:00.000Z',
    updatedAt: '2026-09-26T14:30:00.000Z',
  },
  {
    projectId: 'proj-green-bowl',
    projectName: 'The Green Bowl',
    clientName: 'The Green Bowl',
    slug: 'the-green-bowl',
    category: 'E-commerce',
    description: 'Food ordering and restaurant website with online delivery.',
    fullDescription:
      'PrimeNEST crafted a modern online food ordering and restaurant storefront for The Green Bowl. Featuring appetizing menu photography, customizable bowl builders, dietary filters, and direct WhatsApp & online delivery ordering tailored for hungry mobile customers.',
    coverImage: greenBowlImg,
    galleryImages: [greenBowlImg],
    services: [
      'E-commerce Website',
      'Online Menu & Ordering',
      'Mobile-First UI/UX',
      'WhatsApp Order Integration',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase'],
    year: '2026',
    domain: 'thegreenbowl.in',
    liveUrl: 'https://thegreenbowl.in',
    status: 'Published',
    featured: true,
    seoTitle: 'The Green Bowl — Food Ordering & E-commerce Website | PrimeNEST',
    seoDescription:
      'Food ordering and restaurant website with online delivery built by PrimeNEST.',
    createdAt: '2026-05-20T09:00:00.000Z',
    updatedAt: '2026-09-26T11:20:00.000Z',
  },
  {
    projectId: 'proj-techsphere',
    projectName: 'TechSphere',
    clientName: 'TechSphere',
    slug: 'techsphere',
    category: 'Business',
    description: 'IT solutions and technology services company website.',
    fullDescription:
      'TechSphere needed an authoritative enterprise digital presence to present their cloud infrastructure, cybersecurity, and managed IT services. PrimeNEST designed a high-contrast modern corporate website with interactive service breakdowns and consultation booking.',
    coverImage: techSphereImg,
    galleryImages: [techSphereImg],
    services: [
      'Website Design',
      'Corporate Identity UI',
      'Responsive Development',
      'SEO Optimization',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    year: '2026',
    domain: 'techsphere.io',
    liveUrl: 'https://techsphere.io',
    status: 'Published',
    featured: true,
    seoTitle: 'TechSphere — IT Solutions Business Website | PrimeNEST',
    seoDescription:
      'IT solutions and technology services company website designed by PrimeNEST.',
    createdAt: '2026-04-18T15:00:00.000Z',
    updatedAt: '2026-09-26T16:45:00.000Z',
  },
  {
    projectId: 'proj-fitlife',
    projectName: 'FitLife',
    clientName: 'FitLife',
    slug: 'fitlife',
    category: 'Portfolio',
    description: 'Fitness trainer portfolio and personal brand website.',
    fullDescription:
      'FitLife is a clean, energetic personal brand and coaching portfolio website designed by PrimeNEST. It highlights client transformation stories, coaching programs, class schedules, and instant consultation booking.',
    coverImage: fitLifeImg,
    galleryImages: [fitLifeImg],
    services: [
      'Portfolio Website Design',
      'Personal Branding UI',
      'Program Showcase',
      'Booking Integration',
    ],
    technologies: ['React', 'Tailwind CSS', 'Motion', 'Firebase'],
    year: '2026',
    domain: 'fitlifeclub.in',
    liveUrl: 'https://fitlifeclub.in',
    status: 'Published',
    featured: true,
    seoTitle: 'FitLife — Fitness Trainer Portfolio Website | PrimeNEST',
    seoDescription:
      'Fitness trainer portfolio and personal brand website built by PrimeNEST.',
    createdAt: '2026-03-10T12:00:00.000Z',
    updatedAt: '2026-09-26T09:15:00.000Z',
  },
  {
    projectId: 'proj-kinetix-ops',
    projectName: 'Kinetix Dispatch Portal',
    clientName: 'Kinetix Regional Logistics',
    slug: 'kinetix-dispatch-portal',
    category: 'Custom',
    description:
      'Custom web application and operations dashboard built for real-time inventory tracking and reporting.',
    fullDescription:
      'PrimeNEST built a bespoke internal web application with role-based permissions, live shipment milestones, and automated low-stock alerts for Kinetix Regional Logistics.',
    coverImage: kinetixImg,
    galleryImages: [kinetixImg],
    services: [
      'Custom Web Application',
      'Dashboard UI Design',
      'Role-Based Access Control',
      'Database Architecture',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Firebase'],
    year: '2025',
    domain: '',
    liveUrl: '',
    status: 'Private',
    featured: false,
    seoTitle: 'Kinetix Dispatch Portal — Custom Web Application | PrimeNEST',
    seoDescription:
      'Custom logistics and inventory management web application built by PrimeNEST.',
    createdAt: '2025-11-18T15:00:00.000Z',
    updatedAt: '2026-08-18T16:45:00.000Z',
  },
  {
    projectId: 'proj-nordic-form',
    projectName: 'Nordic Form Architecture',
    clientName: 'Nordic Form Architects',
    slug: 'nordic-form-architecture',
    category: 'Redesign',
    description:
      'Complete website redesign upgrading a legacy site into a fast, responsive architectural portfolio.',
    fullDescription:
      'PrimeNEST executed a complete website redesign for Nordic Form Architects, introducing WebP image optimization, a clean editorial grid layout, and technical SEO improvements.',
    coverImage: nordicImg,
    galleryImages: [nordicImg],
    services: [
      'Website Redesign',
      'Responsive Overhaul',
      'Performance Optimization',
      'Technical SEO',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    year: '2025',
    domain: 'nordicform.com',
    liveUrl: 'https://nordicform.com',
    status: 'Published',
    featured: false,
    seoTitle: 'Nordic Form Architecture — Website Redesign | PrimeNEST',
    seoDescription:
      'Architectural studio website redesign by PrimeNEST.',
    createdAt: '2025-09-10T12:00:00.000Z',
    updatedAt: '2026-07-01T09:15:00.000Z',
  },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    serviceId: 'srv-website-design',
    title: 'Website Design',
    description: 'Modern and responsive websites designed around your brand.',
    whatItEntails:
      'We craft bespoke visual interfaces from the ground up—never relying on bloated, cookie-cutter themes. Our design work focuses on clear typographic hierarchy, intentional whitespace, brand-aligned color systems, and intuitive navigation that guides visitors effortlessly from first impression to inquiry.',
    typicalProcess: [
      'Brand & Audience Discovery — Analyzing your market positioning, competitors, and customer expectations.',
      'Information Architecture & Wireframing — Mapping page flows, content hierarchy, and conversion paths.',
      'High-Fidelity Visual Design — Crafting responsive desktop, tablet, and mobile interface layouts.',
      'Interactive Review & Refinement — Collaborating with you to polish every visual detail before code.',
    ],
    clientBenefits: [
      'Immediate credibility and trust with prospective customers.',
      'A distinctive visual identity that sets you apart from local competitors.',
      'Clearer communication of your core value proposition within seconds.',
      'Seamless usability across every screen size from mobile phones to desktop monitors.',
    ],
    deliverables: [
      'Custom UI/UX & Brand Direction',
      'Mobile-First Responsive Layouts',
      'Interactive Prototypes & Wireframes',
      'Conversion-Focused Page Architecture',
    ],
    iconName: 'Layout',
    order: 1,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
  {
    serviceId: 'srv-business-websites',
    title: 'Business Websites',
    description: 'Professional websites for local businesses and companies.',
    whatItEntails:
      'A complete digital headquarters engineered for small businesses, local shops, service providers, and growing companies. We combine fast-loading pages, structured service showcases, local search optimization, and direct contact channels (including one-tap WhatsApp and inquiry forms) so customers can reach you without friction.',
    typicalProcess: [
      'Service & Content Structuring — Organizing your offerings, pricing, or catalog into scannable pages.',
      'Full-Stack Responsive Development — Building clean, semantic HTML/React pages optimized for speed.',
      'Lead Capture & WhatsApp Integration — Connecting inquiry forms and instant messaging directly to your team.',
      'Local SEO & Launch — Configuring metadata, sitemap, structured schema, and your custom domain.',
    ],
    clientBenefits: [
      '24/7 digital storefront that answers customer questions and captures leads automatically.',
      'Higher visibility in Google search results for local and regional inquiries.',
      'Direct WhatsApp and form inquiries delivered straight to your dashboard.',
      'Easy content and portfolio updates without needing to touch source code.',
    ],
    deliverables: [
      'Company & Service Showcase Pages',
      'Local SEO & Google Search Readiness',
      'WhatsApp & Lead Inquiry Integration',
      'Fast-Loading Cloud Architecture',
    ],
    iconName: 'Building2',
    order: 2,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
  {
    serviceId: 'srv-ecommerce-websites',
    title: 'E-commerce Websites',
    description: 'Online stores with product catalogs and customer functionality.',
    whatItEntails:
      'High-converting online stores designed to showcase physical or digital products with editorial clarity. We build structured product catalogs, category filters, variant selectors, fast image galleries, and streamlined checkout flows that turn browsers into repeat buyers.',
    typicalProcess: [
      'Catalog & Taxonomy Planning — Structuring product categories, variants, attributes, and imagery.',
      'Storefront & Product Page Engineering — Designing high-trust product detail pages and quick filters.',
      'Cart, Checkout & Order Flow Setup — Implementing frictionless mobile-friendly purchasing steps.',
      'Performance & Security Testing — Validating mobile load speed, WebP product assets, and checkout reliability.',
    ],
    clientBenefits: [
      'Expand your sales reach beyond local foot traffic to sell nationwide or globally.',
      'Faster mobile product browsing that reduces cart abandonment.',
      'Organized product management so adding new inventory takes minutes.',
      'Professional presentation that justifies premium product pricing.',
    ],
    deliverables: [
      'Structured Product Catalogs & Filters',
      'Mobile-Optimized Cart & Checkout',
      'Inventory & Order Management',
      'Secure Payment Gateway Readiness',
    ],
    iconName: 'ShoppingBag',
    order: 3,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
  {
    serviceId: 'srv-custom-web-apps',
    title: 'Custom Web Applications',
    description: 'Custom web applications and dashboards.',
    whatItEntails:
      'When off-the-shelf software doesn’t fit how your business operates, PrimeNEST engineers custom web applications. From internal inventory and dispatch portals to interactive client calculators, booking systems, and role-protected admin dashboards, we build reliable software tailored to your exact workflow.',
    typicalProcess: [
      'Technical Specification & Data Modeling — Mapping database schemas, user roles, and security rules.',
      'UI & Dashboard Prototyping — Designing clean, high-density interfaces for daily operational use.',
      'Frontend & Cloud Database Development — Building reactive TypeScript interfaces backed by Firestore/Cloud APIs.',
      'Security Auditing & Deployment — Enforcing server-side access rules, input validation, and production hosting.',
    ],
    clientBenefits: [
      'Eliminate manual spreadsheet errors and fragmented tools with one unified system.',
      'Secure, role-based access control protecting sensitive company and client data.',
      'Real-time synchronization across office desktops, warehouse tablets, and field phones.',
      'Scalable cloud architecture ready to grow alongside your operations.',
    ],
    deliverables: [
      'Bespoke Internal Portals & Dashboards',
      'Database & Cloud Storage Integration',
      'Role-Based User Authentication',
      'Custom Calculators & Booking Flows',
    ],
    iconName: 'Code2',
    order: 4,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
  {
    serviceId: 'srv-website-redesign',
    title: 'Website Redesign',
    description: 'Modernize outdated websites and improve user experience.',
    whatItEntails:
      'If your existing website looks dated, breaks on smartphones, or loads sluggishly, it may be costing you clients. We audit your current site, preserve your valuable content and search rankings, and rebuild your digital presence with a modern interface and fast performance.',
    typicalProcess: [
      'UX, Speed & SEO Audit — Identifying visual bottlenecks, mobile layout failures, and slow assets.',
      'Content & Visual Restructuring — Elevating typography, imagery, and call-to-action clarity.',
      'Modern Codebase Rebuild — Re-engineering the site with responsive layouts and WebP image optimization.',
      'Zero-Downtime Cutover — Launching the new site while preserving existing URLs and search equity.',
    ],
    clientBenefits: [
      'Transform an outdated website into a modern brand asset you are proud to share.',
      'Dramatically faster page load times on mobile networks.',
      'Higher inquiry conversion rates from clearer navigation and stronger calls to action.',
      'Eliminate legacy technical debt and broken mobile layouts.',
    ],
    deliverables: [
      'Visual & Typographic Modernization',
      'Mobile & Tablet Usability Overhaul',
      'Core Web Vitals Speed Optimization',
      'Content Migration & URL Preservation',
    ],
    iconName: 'RefreshCw',
    order: 5,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
  {
    serviceId: 'srv-website-maintenance',
    title: 'Website Maintenance',
    description: 'Ongoing updates, improvements and maintenance.',
    whatItEntails:
      'A great website is a living asset. PrimeNEST provides dependable ongoing care so you can focus on running your business while we handle content updates, new project or product additions, performance monitoring, security updates, and technical improvements.',
    typicalProcess: [
      'Baseline Health & Security Setup — Establishing uptime monitoring, backup snapshots, and asset checks.',
      'On-Demand Content & Visual Updates — Publishing new pages, announcements, images, or pricing changes.',
      'Routine Speed & Compatibility Audits — Ensuring new browsers and mobile devices render your site flawlessly.',
      'Continuous Conversion Improvements — Iterating on forms, CTAs, and SEO metadata as your business evolves.',
    ],
    clientBenefits: [
      'Peace of mind knowing your website remains fast, secure, and online at all times.',
      'Fast turnaround on text, image, or service updates without hiring a full-time developer.',
      'Consistent protection against broken links, outdated dependencies, or performance drift.',
      'A dedicated technical partner who already knows your business inside and out.',
    ],
    deliverables: [
      'Content, Product & Image Updates',
      'Security Monitoring & Backups',
      'Performance & Uptime Checks',
      'Priority Studio Support',
    ],
    iconName: 'ShieldCheck',
    order: 6,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
];

export function getPackageDomainPolicy(
  pkg: Pick<PricingPackage, 'name' | 'order' | 'domainNote'>,
  index?: number
): { domainNote: string; isFreeDomainHosting: boolean } {
  const nameLower = (pkg.name || '').trim().toLowerCase();
  const isFirstThreeByName =
    nameLower === 'starter' ||
    nameLower === 'basic' ||
    nameLower === 'business';
  const isOtherByName =
    nameLower === 'professional' ||
    nameLower === 'premium' ||
    nameLower === 'elite';

  if (pkg.domainNote && pkg.domainNote.trim()) {
    const note = pkg.domainNote.trim();
    return {
      domainNote: note,
      isFreeDomainHosting: /free/i.test(note) && !/exclud/i.test(note),
    };
  }

  const isFirstThree = isFirstThreeByName
    ? true
    : isOtherByName
    ? false
    : index !== undefined
    ? index < 3
    : (pkg.order || 1) <= 3;

  if (isFirstThree) {
    return {
      domainNote: 'Excluding Domain',
      isFreeDomainHosting: false,
    };
  }

  return {
    domainNote: '1 Year Free Domain & Hosting',
    isFreeDomainHosting: true,
  };
}

export const INITIAL_PACKAGES: PricingPackage[] = [
  {
    packageId: 'pkg-starter',
    name: 'Starter',
    price: '₹799',
    domainNote: 'Excluding Domain',
    subtitle: 'For simple personal or small business websites.',
    tierStyle: 'simple',
    features: [
      'Price excluding domain',
      '1-page website',
      'Mobile responsive design',
      'Business name and logo',
      'About section & Contact details',
      'WhatsApp button',
      'Basic modern design & Basic SEO',
      'Social media links',
      '1 revision',
    ],
    deliveryTime: '2–3 days',
    order: 1,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
  {
    packageId: 'pkg-basic',
    name: 'Basic',
    price: '₹1,999',
    domainNote: 'Excluding Domain',
    subtitle: 'For small businesses.',
    tierStyle: 'standard',
    features: [
      'Price excluding domain',
      'Up to 4 pages (Home, About, Services, Contact)',
      'Mobile + desktop responsive',
      'WhatsApp integration & Google Maps',
      'Social media integration',
      'Basic SEO & Contact form',
      '2 revisions',
    ],
    deliveryTime: '3–5 days',
    order: 2,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
  {
    packageId: 'pkg-business',
    name: 'Business',
    price: '₹3,999',
    domainNote: 'Excluding Domain',
    subtitle: 'For local businesses and service providers.',
    badge: 'MOST POPULAR',
    tierStyle: 'popular',
    features: [
      'Price excluding domain',
      'Up to 6 pages',
      'Professional UI design',
      'Services & Product/service showcase',
      'Gallery & Contact form',
      'WhatsApp & Google Maps integration',
      'Social media & Basic SEO',
      'Speed optimization',
      '3 revisions',
    ],
    deliveryTime: '5–7 days',
    order: 3,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
  {
    packageId: 'pkg-professional',
    name: 'Professional',
    price: '₹6,999',
    domainNote: '1 Year Free Domain & Hosting',
    subtitle: 'For growing businesses.',
    badge: 'RECOMMENDED',
    tierStyle: 'recommended',
    features: [
      '1 Year Free Domain & Hosting',
      'Up to 8 pages',
      'Custom UI/UX design & Advanced animations',
      'Product/service catalog & Image gallery',
      'Testimonials, FAQ & Contact form',
      'WhatsApp, Google Maps & Social media',
      'SEO setup & Performance optimization',
      '4 revisions',
    ],
    deliveryTime: '7–10 days',
    order: 4,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
  {
    packageId: 'pkg-premium',
    name: 'Premium',
    price: '₹9,999',
    domainNote: '1 Year Free Domain & Hosting',
    subtitle: 'For established businesses and brands.',
    tierStyle: 'premium',
    features: [
      '1 Year Free Domain & Hosting',
      'Up to 12 pages & Fully customized design',
      'Premium animations & Advanced showcase',
      'Categories, filtering & Image gallery',
      'Testimonials, FAQ & Blog/news section',
      'Advanced contact forms, WhatsApp & Maps',
      'SEO optimization & Google Analytics setup',
      'Performance optimization',
      '5 revisions',
    ],
    deliveryTime: '10–14 days',
    order: 5,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
  {
    packageId: 'pkg-elite',
    name: 'Elite',
    price: '₹14,999',
    domainNote: '1 Year Free Domain & Hosting',
    subtitle: 'For advanced/custom projects.',
    tierStyle: 'elite',
    features: [
      '1 Year Free Domain & Hosting',
      'Custom website architecture (Up to 15 pages)',
      'Premium UI/UX & Advanced animations',
      'Product/service management & Search/filtering',
      'Admin dashboard & Database integration',
      'Dynamic content & Inquiry management',
      'WhatsApp, SEO, Analytics & Security setup',
      '6 revisions',
    ],
    deliveryTime: '10–21 days',
    order: 6,
    active: true,
    updatedAt: '2026-09-26T20:00:00.000Z',
  },
];

export const INITIAL_ADDONS: AddOnItem[] = [
  { addOnId: 'addon-extra-page', name: 'Extra page', price: '₹300', order: 1, active: true },
  { addOnId: 'addon-extra-revision', name: 'Extra revision', price: '₹200', order: 2, active: true },
  { addOnId: 'addon-product-upload', name: 'Product upload', price: '₹20/product', order: 3, active: true },
  { addOnId: 'addon-domain-setup', name: 'Domain setup', price: '₹299', order: 4, active: true },
  { addOnId: 'addon-google-maps', name: 'Google Maps setup', price: '₹199', order: 5, active: true },
  { addOnId: 'addon-whatsapp', name: 'WhatsApp integration', price: '₹199', order: 6, active: true },
  { addOnId: 'addon-basic-seo', name: 'Basic SEO', price: '₹499', order: 7, active: true },
  { addOnId: 'addon-analytics', name: 'Google Analytics', price: '₹299', order: 8, active: true },
  { addOnId: 'addon-redesign', name: 'Website redesign', price: 'From ₹1,499', order: 9, active: true },
  { addOnId: 'addon-maintenance', name: 'Maintenance', price: 'From ₹499/month', order: 10, active: true },
  { addOnId: 'addon-custom-func', name: 'Custom functionality', price: 'From ₹999', order: 11, active: true },
  { addOnId: 'addon-ecommerce', name: 'E-commerce', price: 'From ₹7,999', order: 12, active: true },
];
