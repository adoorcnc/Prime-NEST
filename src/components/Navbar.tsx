import React, { useState } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  Shield,
  User as UserIcon,
  LogOut,
  Layers,
  Sparkles,
  Building2,
  Wrench,
  Mail,
  Home as HomeIcon,
  Zap,
} from 'lucide-react';
import { AdminSettings, AppUserSession, PublicPage } from '../types';

interface NavbarProps {
  currentPage: PublicPage;
  onNavigate: (page: PublicPage, slug?: string) => void;
  settings: AdminSettings;
  isAdminAuthenticated: boolean;
  userSession: AppUserSession | null;
  onOpenSignIn: () => void;
  onSignOutSession: () => void;
}

export const PrimeNestLogoMark: React.FC<{
  className?: string;
  innerFill?: string;
}> = ({ className = 'w-8 h-8', innerFill = '#FFFFFF' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 8C8 5.79086 9.79086 4 12 4H23C30.1797 4 36 9.8203 36 17C36 24.1797 30.1797 30 23 30H16V36H8V8Z"
      fill="url(#primenest_grad)"
    />
    <path
      d="M16 12H22.5C25.5376 12 28 14.4624 28 17.5C28 20.5376 25.5376 23 22.5 23H16V12Z"
      fill={innerFill}
    />
    <defs>
      <linearGradient
        id="primenest_grad"
        x1="8"
        y1="4"
        x2="36"
        y2="36"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8B6BFF" />
        <stop offset="1" stopColor="#5B3DF5" />
      </linearGradient>
    </defs>
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isAdminAuthenticated,
  userSession,
  onOpenSignIn,
  onSignOutSession,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: {
    label: string;
    page: PublicPage;
    targetId?: string;
    badge?: string;
    iconName: 'home' | 'plans' | 'works' | 'about' | 'services' | 'contact';
  }[] = [
    { label: 'Home', page: 'home', iconName: 'home' },
    { label: 'Plans', page: 'packages', targetId: 'packages', badge: 'Popular', iconName: 'plans' },
    { label: 'Works', page: 'portfolio', targetId: 'works', iconName: 'works' },
    { label: 'About', page: 'about', targetId: 'about', iconName: 'about' },
    { label: 'Services', page: 'services', targetId: 'services', iconName: 'services' },
    { label: 'Contact', page: 'contact', targetId: 'contact', iconName: 'contact' },
  ];

  const handleNavClick = (page: PublicPage, targetId?: string) => {
    setMobileMenuOpen(false);

    // If currently on home and targetId provided, smooth scroll to section
    if (currentPage === 'home' && targetId) {
      const el =
        document.getElementById(targetId) ||
        (targetId === 'works' ? document.getElementById('featured-work') : null) ||
        (targetId === 'packages' ? document.getElementById('plans') : null);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // If already on home and clicked Home, smooth scroll to top
    if (currentPage === 'home' && page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onNavigate(page);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
        >
          <PrimeNestLogoMark className="w-8 h-8" innerFill="#FFFFFF" />
          <span className="font-display text-2xl tracking-tight text-[#0B0B14]">
            <strong className="font-extrabold">Prime</strong>
            <span className="font-light text-[#0B0B14]">NEST</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-7"
          aria-label="Primary Navigation"
        >
          {navItems.map((item) => {
            const isActive =
              currentPage === item.page ||
              (item.page === 'portfolio' && currentPage === 'project-details');
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => handleNavClick(item.page, item.targetId)}
                className={`relative py-1 text-sm transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#0B0B14] font-bold after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2.5px] after:bg-[#6C4EFF] after:rounded-full'
                    : 'text-slate-600 hover:text-[#0B0B14] font-medium'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 bg-[#6C4EFF]/10 text-[#6C4EFF] text-[9px] font-extrabold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className="px-3.5 py-2 text-xs font-semibold rounded-full border border-[#6C4EFF]/40 bg-[#6C4EFF]/10 text-[#6C4EFF] hover:bg-[#6C4EFF] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </button>
              <button
                type="button"
                onClick={onSignOutSession}
                className="p-2 text-slate-500 hover:text-[#0B0B14] rounded-full border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : userSession ? (
            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-full bg-[#F4F3FF] border border-[#6C4EFF]/20 text-[#0B0B14] text-xs font-medium flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-[#6C4EFF]" />
                <span>Hi, {userSession.name}</span>
              </div>
              <button
                type="button"
                onClick={onSignOutSession}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-[#0B0B14] border border-slate-200 hover:border-slate-300 rounded-full transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenSignIn}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border border-slate-200 text-slate-700 hover:border-[#6C4EFF] hover:text-[#6C4EFF] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#6C4EFF]" />
              <span>Sign In</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className="px-5 py-2.5 bg-[#6C4EFF] hover:bg-[#5B3DF5] text-white text-sm font-semibold rounded-full transition-all flex items-center gap-2 shadow-md shadow-[#6C4EFF]/25 cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {isAdminAuthenticated ? (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className="px-3 py-1.5 border border-[#6C4EFF]/40 bg-[#6C4EFF]/10 rounded-full text-xs font-semibold text-[#6C4EFF] flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenSignIn}
              className="px-3 py-1.5 border border-slate-200 rounded-full text-xs font-semibold text-slate-700 flex items-center gap-1"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#6C4EFF]" />
              <span>{userSession ? userSession.name : 'Sign In'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-slate-200 rounded-lg text-[#0B0B14] hover:bg-slate-50 focus:outline-none"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Top Quick Access Options Bar: Always visible on top across mobile & desktop */}
      <nav
        aria-label="Quick Access Top Navigation"
        className="w-full bg-[#FAF9FF] border-t border-slate-100/90 px-3 sm:px-6 py-2 overflow-x-auto no-scrollbar shadow-2xs"
      >
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-2 min-w-max sm:min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 hidden xs:inline-flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#6C4EFF]" />
              <span>Fast:</span>
            </span>

            {navItems.map((item) => {
              const isPlansOrWorksOrAbout =
                item.label === 'Plans' || item.label === 'Works' || item.label === 'About';
              const isSelected =
                currentPage === item.page ||
                (item.page === 'portfolio' && currentPage === 'project-details');

              return (
                <button
                  key={`top-nav-${item.label}`}
                  type="button"
                  onClick={() => handleNavClick(item.page, item.targetId)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#6C4EFF] text-white shadow-sm shadow-[#6C4EFF]/25'
                      : isPlansOrWorksOrAbout
                      ? 'bg-white border border-[#6C4EFF]/25 text-[#6C4EFF] hover:bg-[#6C4EFF] hover:text-white shadow-2xs'
                      : 'bg-white/80 border border-slate-200/80 text-slate-700 hover:text-[#0B0B14] hover:bg-white'
                  }`}
                >
                  {item.iconName === 'plans' && <Layers className="w-3 h-3" />}
                  {item.iconName === 'works' && <Sparkles className="w-3 h-3 text-amber-500" />}
                  {item.iconName === 'about' && <Building2 className="w-3 h-3 text-emerald-600" />}
                  {item.iconName === 'home' && <HomeIcon className="w-3 h-3 text-slate-400" />}
                  {item.iconName === 'services' && <Wrench className="w-3 h-3 text-blue-500" />}
                  {item.iconName === 'contact' && <Mail className="w-3 h-3 text-purple-500" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-[#6C4EFF]/15 text-[#6C4EFF] text-[9px] font-extrabold rounded-full uppercase">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pl-2">
            <button
              type="button"
              onClick={() => handleNavClick('contact', 'contact')}
              className="text-[11px] font-bold text-[#6C4EFF] hover:underline flex items-center gap-1 whitespace-nowrap cursor-pointer"
            >
              <span>Start Project</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 text-[#0B0B14] shadow-lg">

          <div className="grid grid-cols-1 divide-y divide-slate-100">
            {navItems.map((item) => {
              const isActive =
                currentPage === item.page ||
                (item.page === 'portfolio' && currentPage === 'project-details');
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleNavClick(item.page, item.targetId)}
                  className={`w-full text-left py-3 px-2 text-base font-medium flex items-center justify-between cursor-pointer ${
                    isActive ? 'text-[#6C4EFF] font-bold bg-[#F4F3FF]/50 rounded-lg' : 'text-slate-700 hover:text-[#0B0B14]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.iconName === 'home' && <HomeIcon className="w-4 h-4 text-slate-400" />}
                    {item.iconName === 'plans' && <Layers className="w-4 h-4 text-[#6C4EFF]" />}
                    {item.iconName === 'works' && <Sparkles className="w-4 h-4 text-amber-500" />}
                    {item.iconName === 'about' && <Building2 className="w-4 h-4 text-emerald-600" />}
                    {item.iconName === 'services' && <Wrench className="w-4 h-4 text-blue-500" />}
                    {item.iconName === 'contact' && <Mail className="w-4 h-4 text-purple-500" />}
                    <span>{item.label}</span>
                    {(item.label === 'Plans' || item.label === 'Works' || item.label === 'About') && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6C4EFF]/10 text-[#6C4EFF]">
                        Fast
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">→</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => handleNavClick('contact')}
              className="w-full py-3 bg-[#6C4EFF] text-white text-sm font-semibold rounded-full flex items-center justify-center gap-2 shadow-sm shadow-[#6C4EFF]/25 cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isAdminAuthenticated ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('admin')}
                  className="flex-1 py-2.5 border border-[#6C4EFF] bg-[#6C4EFF]/10 text-[#6C4EFF] text-xs font-semibold rounded-full flex items-center justify-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Open Admin Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSignOutSession();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 text-xs rounded-full"
                >
                  Sign Out
                </button>
              </div>
            ) : userSession ? (
              <button
                type="button"
                onClick={() => {
                  onSignOutSession();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 border border-slate-200 text-slate-600 text-xs rounded-full flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out ({userSession.name})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignIn();
                }}
                className="w-full py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-full flex items-center justify-center gap-2"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#6C4EFF]" />
                <span>Sign In (Customer or Admin)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
