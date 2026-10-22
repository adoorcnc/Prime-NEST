export type ProjectCategory = 'Business' | 'E-commerce' | 'Portfolio' | 'Custom' | 'Redesign';

export type ProjectStatus = 'Draft' | 'Published' | 'Private' | 'Archived';

export interface Project {
  projectId: string;
  projectName: string;
  clientName: string;
  slug: string;
  category: ProjectCategory;
  description: string;
  fullDescription?: string;
  coverImage: string;
  galleryImages: string[];
  services: string[];
  technologies: string[];
  year: string;
  domain?: string;
  liveUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  serviceId: string;
  title: string;
  description: string;
  whatItEntails: string;
  typicalProcess: string[];
  clientBenefits: string[];
  deliverables: string[];
  iconName: string;
  order: number;
  active: boolean;
  updatedAt: string;
}

export type PackageTierStyle = 'simple' | 'standard' | 'popular' | 'recommended' | 'premium' | 'elite';

export interface PricingPackage {
  packageId: string;
  name: string;
  price: string;
  domainNote?: string;
  subtitle: string;
  badge?: string;
  tierStyle: PackageTierStyle;
  features: string[];
  deliveryTime: string;
  order: number;
  active: boolean;
  updatedAt: string;
}

export interface AddOnItem {
  addOnId: string;
  name: string;
  price: string;
  order: number;
  active: boolean;
}

export type InquiryStatus = 'New' | 'In Progress' | 'Responded' | 'Archived';

export interface ContactRequest {
  requestId: string;
  name: string;
  businessName?: string;
  email: string;
  phone?: string;
  service: string;
  selectedPackage?: string;
  budget?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface AdminSettings {
  businessName: string;
  tagline?: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram?: string;
  facebook?: string;
  logo?: string;
  primaryColor?: string;
  accentColor: string;
  statsProjectsCompleted: string;
  statsWebsitesPublished: string;
  statsHappyClients: string;
  adminPassword?: string;
  updatedAt: string;
}

export interface AppUserSession {
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

export type PublicPage =
  | 'home'
  | 'portfolio'
  | 'project-details'
  | 'services'
  | 'packages'
  | 'about'
  | 'process'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'admin';

export type AdminTab =
  | 'dashboard'
  | 'projects'
  | 'add-project'
  | 'edit-project'
  | 'services'
  | 'packages'
  | 'messages'
  | 'settings';
