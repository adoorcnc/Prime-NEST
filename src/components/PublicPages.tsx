import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  ExternalLink,
  Globe,
  Lock,
  CheckCircle2,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  Heart,
  Rocket,
  Eye,
  Users,
  Star,
  Mail,
  Phone,
  MapPin,
  Send,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Zap,
  Layers,
  Sparkles,
  Building2,
} from 'lucide-react';
import {
  AdminSettings,
  ContactRequest,
  PricingPackage,
  Project,
  ProjectCategory,
  PublicPage,
} from '../types';
import {
  extractWebsiteDomain,
  normalizeWebsiteUrl,
  sanitizeText,
} from '../utils/imageOptimizer';
import {
  brandBoxImg,
  deskWorkspaceImg,
  notebookQuoteImg,
  getPackageDomainPolicy,
} from '../data/seedData';
import { PrimeNestLogoMark } from './Navbar';

// ============================================================================
// 1. HERO SECTION (Light Lavender & White Studio Theme)
// ============================================================================
interface HeroProps {
  settings: AdminSettings;
  featuredProject?: Project;
  onNavigate: (page: PublicPage, slug?: string) => void;
}

export const HeroSection: React.FC<HeroProps> = ({
  featuredProject,
  onNavigate,
}) => {
  return (
    <section className="relative bg-gradient-to-b from-[#F5F4FF] via-[#F9F9FF] to-white text-[#0B0B14] overflow-hidden border-b border-slate-100">
      {/* Subtle Ambient Lavender Glow */}
      <div className="pointer-events-none absolute top-1/2 right-1/4 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-[#6C4EFF]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -top-24 left-10 w-80 h-80 rounded-full bg-[#6C4EFF]/8 blur-[100px]" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline & CTA Buttons (6 cols) */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-8 h-[2px] bg-[#6C4EFF]" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                WEB DESIGN &amp; DEVELOPMENT STUDIO
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="font-display text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0B0B14] leading-[1.1] tracking-tight mb-6"
            >
              We Build Websites
              <br />
              That Build{' '}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="text-[#6C4EFF] inline-block"
              >
                Businesses.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg mb-9"
            >
              PrimeNEST creates modern, responsive and professional websites for businesses, brands and individuals.
            </motion.p>

            {/* Fast Jump Options on Top: Plans, Works, About */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="flex flex-wrap items-center gap-2 mb-8"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mr-1">
                <Zap className="w-3.5 h-3.5 text-[#6C4EFF]" />
                <span>Fast Jump:</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('packages') || document.getElementById('plans');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  else onNavigate('packages');
                }}
                className="px-3.5 py-1.5 bg-white hover:bg-[#F4F3FF] border border-slate-200 hover:border-[#6C4EFF] rounded-full text-xs font-semibold text-[#0B0B14] hover:text-[#6C4EFF] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer group"
              >
                <Layers className="w-3.5 h-3.5 text-[#6C4EFF]" />
                <span>Plans</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('works') || document.getElementById('featured-work');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  else onNavigate('portfolio');
                }}
                className="px-3.5 py-1.5 bg-white hover:bg-[#F4F3FF] border border-slate-200 hover:border-[#6C4EFF] rounded-full text-xs font-semibold text-[#0B0B14] hover:text-[#6C4EFF] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer group"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Works</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('about');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  else onNavigate('about');
                }}
                className="px-3.5 py-1.5 bg-white hover:bg-[#F4F3FF] border border-slate-200 hover:border-[#6C4EFF] rounded-full text-xs font-semibold text-[#0B0B14] hover:text-[#6C4EFF] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer group"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>About</span>
              </button>

            </motion.div>

            {/* Two CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onNavigate('portfolio')}
                className="px-7 py-3.5 bg-[#6C4EFF] hover:bg-[#5B3DF5] text-white text-sm font-semibold rounded-full transition-all flex items-center gap-2.5 shadow-lg shadow-[#6C4EFF]/25 cursor-pointer"
              >
                <span>View Our Work</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-7 py-3.5 bg-white hover:bg-[#F4F3FF] text-[#0B0B14] border border-slate-200 hover:border-[#6C4EFF] text-sm font-semibold rounded-full transition-colors cursor-pointer shadow-2xs"
              >
                <span>Start a Project</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column: Laptop + Smartphone Mockup & Vertical Attributes (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="lg:col-span-6 flex items-center gap-6"
          >
            {/* Laptop + Phone Device Showcase */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex-1 relative py-4 group"
            >
              {/* MacBook Pro Style Frame */}
              <div className="relative mx-auto max-w-[490px] bg-[#161726] rounded-t-2xl border-[6px] border-[#26283B] shadow-2xl overflow-hidden aspect-[16/10]">
                {featuredProject ? (
                  <img
                    src={featuredProject.coverImage}
                    alt={featuredProject.projectName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B14]/90 via-[#0B0B14]/65 to-transparent p-5 sm:p-7 flex flex-col justify-between">
                  {/* Mock Browser Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <PrimeNestLogoMark className="w-4 h-4" innerFill="#0B0B14" />
                      <span className="font-display text-[11px] font-bold text-white">
                        PrimeNEST
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-[9px] text-white/60">
                      <span>Home</span>
                      <span>Work</span>
                      <span>Services</span>
                      <span>Contact</span>
                      <span className="px-2 py-0.5 bg-[#6C4EFF] text-white rounded-full">
                        Get Started
                      </span>
                    </div>
                  </div>

                  {/* Mock Screen Center Copy */}
                  <div className="my-auto max-w-[240px]">
                    <div className="font-display text-lg sm:text-xl font-extrabold text-white leading-tight mb-2">
                      Better Solutions
                      <br />
                      for a Brighter Future
                    </div>
                    <p className="text-[10px] text-white/65 leading-relaxed mb-3">
                      Custom web architecture and high-converting digital experiences tailored for modern businesses.
                    </p>
                    <span className="inline-block px-3 py-1 bg-[#6C4EFF] text-white text-[9px] font-semibold rounded-full">
                      Explore Solutions →
                    </span>
                  </div>
                </div>
              </div>
              {/* Laptop Base */}
              <div className="mx-auto max-w-[530px] h-3 bg-gradient-to-b from-[#3A3D52] to-[#1E2030] rounded-b-xl shadow-xl relative">
                <div className="w-16 h-1 bg-[#141522] mx-auto rounded-b" />
              </div>

              {/* Overlapping Smartphone Frame on Bottom Right */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.4,
                }}
                className="hidden sm:flex flex-col justify-between absolute -bottom-2 right-0 w-[135px] h-[250px] bg-[#0F101E] rounded-[22px] border-[4px] border-[#2D3047] shadow-2xl p-3 overflow-hidden"
              >
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />
                <div className="my-auto">
                  <div className="flex items-center gap-1 mb-2">
                    <PrimeNestLogoMark className="w-3 h-3" innerFill="#0F101E" />
                    <span className="text-[8px] font-bold text-white">PrimeNEST</span>
                  </div>
                  <div className="font-display text-xs font-bold text-white leading-snug mb-1.5">
                    Better Solutions for a Brighter Future
                  </div>
                  <p className="text-[8px] text-white/60 leading-normal mb-2.5">
                    Mobile-first responsive design for every screen.
                  </p>
                  <span className="inline-block px-2 py-0.5 bg-[#6C4EFF] text-white text-[8px] font-semibold rounded-full">
                    Start Now
                  </span>
                </div>
                <div className="w-8 h-0.5 bg-white/30 rounded-full mx-auto" />
              </motion.div>
            </motion.div>

            {/* Far Right Vertical Attributes (Modern / Responsive / Professional) */}
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="hidden xl:flex flex-col gap-1.5 pl-4 border-l-2 border-[#6C4EFF] text-xs text-slate-600 font-semibold shrink-0"
            >
              <span>Modern</span>
              <span>Responsive</span>
              <span>Professional</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 2. ABOUT US + MORE ABOUT PRIMENEST + OUR PROCESS SECTION (Matching Reference)
// ============================================================================
export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Discover',
    description: 'Understand your business, goals and requirements.',
  },
  {
    number: '02',
    title: 'Plan',
    description: 'Create the website structure and user experience.',
  },
  {
    number: '03',
    title: 'Design',
    description: 'Create the visual design and interface.',
  },
  {
    number: '04',
    title: 'Develop',
    description: 'Build the responsive website and functionality.',
  },
  {
    number: '05',
    title: 'Test',
    description: 'Test responsiveness, performance and functionality.',
  },
  {
    number: '06',
    title: 'Launch',
    description: 'Deploy the website and connect your domain.',
  },
];

interface AboutAndProcessSectionProps {
  settings: AdminSettings;
  onNavigate: (page: PublicPage) => void;
}

export const AboutAndProcessSection: React.FC<AboutAndProcessSectionProps> = ({
  settings,
}) => {
  return (
    <div id="about">
      {/* Top Band: ABOUT US — Building the Web, One Business at a Time */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-[#F8F8FF] to-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: ABOUT US Copy & 3 Statistics (6 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-[#6C4EFF]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  ABOUT US
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0B0B14] tracking-tight leading-[1.12] mb-6">
                Building the Web,
                <br />
                One <span className="text-[#6C4EFF]">Business</span>{' '}
                <span className="text-slate-600 font-semibold">at a</span> Time.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mb-10">
                PrimeNEST is a web creation studio focused on building modern, useful and professional websites for businesses, brands and individuals. We turn your ideas into a powerful online presence that helps you grow.
              </p>

              {/* 3 Editable Statistics with Dividers */}
              <div className="grid grid-cols-3 gap-6 max-w-lg pt-2">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                >
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B0B14]">
                    {settings.statsProjectsCompleted || '24+'}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">
                    Projects Completed
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.2 }}
                  className="border-l border-slate-200 pl-6"
                >
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B0B14]">
                    {settings.statsWebsitesPublished || '18+'}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">
                    Websites Published
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.3 }}
                  className="border-l border-slate-200 pl-6"
                >
                  <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B0B14]">
                    {settings.statsHappyClients || '12+'}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">
                    Happy Clients
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Column: Studio Desk Photograph with Ideas/Design/Develop/Grow Card (6 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6"
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/70 aspect-[4/3] bg-[#EAE6DF]"
              >
                <img
                  src={deskWorkspaceImg}
                  alt="PrimeNEST Studio Desk — Modern Websites. Real Growth."
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Top-Right Wall Card Overlay matching reference image */}
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="hidden sm:block absolute top-0 right-0 bg-[#DFDBD4]/90 backdrop-blur-xs px-7 py-6 border-l border-b border-black/5"
                >
                  <div className="font-display text-base font-medium text-[#1A1A1A] leading-snug space-y-0.5">
                    <div>Ideas</div>
                    <div>Design</div>
                    <div>Develop</div>
                    <div>Grow</div>
                  </div>
                  <div className="w-4 h-[2px] bg-[#6C4EFF] mt-2.5" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Second Band: More About PrimeNEST — Your Vision. Our Code. */}
      <section className="py-16 lg:py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-stretch">
            {/* Left Column: Editorial Story + Founder Signature (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-5 flex flex-col justify-between pr-0 lg:pr-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-[2px] bg-[#6C4EFF]" />
                  <span className="text-xs font-semibold text-slate-600">
                    More About PrimeNEST
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B0B14] tracking-tight mb-6">
                  Your Vision. Our Code.
                </h3>

                <div className="space-y-5 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                  <p>
                    We believe a great website is more than just a design — it&apos;s a bridge between your business and your customers.
                  </p>
                  <p>
                    At <strong className="font-bold text-[#0B0B14]">PrimeNEST</strong>, we combine creativity, technology and a deep understanding of business needs to deliver websites that are fast, responsive and built for real results.
                  </p>
                  <p>
                    Whether you&apos;re a local shop, a growing brand, a startup or an individual, we&apos;re here to help you build a strong digital presence and take your business to the next level.
                  </p>
                </div>
              </div>

              {/* Handwritten Signature: Aarif — Founder, PrimeNEST */}
              <div className="pt-8 mt-6">
                <svg
                  viewBox="0 0 190 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-36 h-14 text-[#0B0B14]"
                  aria-label="Aarif signature"
                >
                  <path
                    d="M16 52C26 30 38 10 44 8C48 7 44 36 42 48C41 53 45 40 54 32C60 27 65 32 61 41C58 46 64 46 71 38C75 33 78 36 77 42C76 46 82 44 88 35C92 29 96 34 95 42M22 36C38 33 58 29 76 26M105 26C104 26 105 25 106 25M103 36C102 40 101 44 103 45C106 46 114 36 122 24C129 13 134 7 131 19C128 31 122 48 120 58C118 64 126 46 138 37C146 31 158 28 168 25"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Founder, PrimeNEST
                </div>
              </div>
            </motion.div>

            {/* Center Column: 4 Value Cards (Our Mission, Our Vision, Our Values, Why Choose Us) (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-4">
              {/* Card 1: Our Mission */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05 }}
                whileHover={{ y: -3 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-[#6C4EFF]/40 transition-colors flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#F1EEFF] text-[#6C4EFF] flex items-center justify-center shrink-0">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-[#0B0B14] mb-1">
                    Our Mission
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                    To create modern, useful and professional websites that help businesses grow.
                  </p>
                </div>
              </motion.div>

              {/* Card 2: Our Vision */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.12 }}
                whileHover={{ y: -3 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-[#6C4EFF]/40 transition-colors flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#F1EEFF] text-[#6C4EFF] flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-[#0B0B14] mb-1">
                    Our Vision
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                    To become a trusted web creation studio for businesses across Kerala and beyond.
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Our Values */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.2 }}
                whileHover={{ y: -3 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-[#6C4EFF]/40 transition-colors flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#F1EEFF] text-[#6C4EFF] flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-[#0B0B14] mb-1">
                    Our Values
                  </h4>
                  <div className="text-xs sm:text-[13px] text-slate-500 leading-relaxed space-y-0.5">
                    <div>
                      Quality <span className="text-[#6C4EFF] mx-1">•</span> Transparency{' '}
                      <span className="text-[#6C4EFF] mx-1">•</span> Client Success
                    </div>
                    <div>
                      Innovation <span className="text-[#6C4EFF] mx-1">•</span> Long-Term Support
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 4: Why Choose Us */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.28 }}
                whileHover={{ y: -3 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs hover:border-[#6C4EFF]/40 transition-colors flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-[#F1EEFF] text-[#6C4EFF] flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-[#0B0B14] mb-1">
                    Why Choose Us
                  </h4>
                  <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                    We focus on your goals, deliver on time, and provide real support — always.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Tall Notebook Quote Image Card (3 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl overflow-hidden shadow-md border border-slate-200/70 h-full min-h-[420px] bg-[#E8E8EE]"
              >
                <img
                  src={notebookQuoteImg}
                  alt="PrimeNEST Studio Notebook"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/25 to-transparent p-6 sm:p-7">
                  <div className="w-7 h-[2px] bg-[#6C4EFF] mb-3.5" />
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="font-display text-lg sm:text-xl font-medium text-[#0B0B14] leading-snug max-w-[200px]"
                  >
                    “Great websites
                    <br />
                    aren’t just built.
                    <br />
                    They’re crafted
                    <br />
                    with purpose.”
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Keep standalone AboutSection & ProcessSection exports for dedicated /about and /process routes
export const AboutSection = AboutAndProcessSection;
export const ProcessSection: React.FC<{
  onNavigate: (page: PublicPage) => void;
  isStandalonePage?: boolean;
}> = () => (
  <section id="process" className="py-16 lg:py-20 bg-[#F8F8FF] border-t border-slate-100">
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
      <div className="max-w-2xl mb-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-[2px] bg-[#6C4EFF]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            HOW IT WORKS
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B0B14] tracking-tight mb-2">
          Our Process
        </h2>
        <p className="text-sm sm:text-base text-slate-500">
          A simple and transparent process to bring your vision to life.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
        {PROCESS_STEPS.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: idx * 0.06 }}
            whileHover={{ y: -5 }}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-[#6C4EFF]/40 transition-colors"
          >
            <div>
              <div className="w-9 h-9 rounded-full bg-[#F1EEFF] text-[#6C4EFF] font-display text-xs font-bold flex items-center justify-center mb-4">
                {step.number}
              </div>
              <h3 className="font-display text-base font-bold text-[#0B0B14] mb-1.5">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================================
// 3. PORTFOLIO PAGE (/portfolio)
// ============================================================================
interface PortfolioPageProps {
  projects: Project[];
  onNavigate: (page: PublicPage, slug?: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  projects,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: ('All' | ProjectCategory)[] = [
    'All',
    'Business',
    'E-commerce',
    'Portfolio',
    'Custom',
    'Redesign',
  ];

  const publicProjects = projects.filter(
    (p) => p.status === 'Published' || p.status === 'Private'
  );

  const filteredProjects =
    selectedCategory === 'All'
      ? publicProjects
      : publicProjects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white py-16 lg:py-24">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C4EFF] mb-2">
            FEATURED WORK &amp; ARCHIVE
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#0B0B14] tracking-tight">
            Our Work
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-500">
            A selection of websites and digital experiences created by PrimeNEST.
          </p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pb-8 mb-10 border-b border-slate-200">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? publicProjects.length
                : publicProjects.filter((p) => p.category === cat).length;
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer border ${
                  active
                    ? 'bg-[#6C4EFF] text-white border-[#6C4EFF]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#6C4EFF]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    active ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <motion.article
              key={project.projectId}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => onNavigate('project-details', project.slug)}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#6C4EFF]/50 p-3.5 shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer transition-all duration-300"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[#0B0B14] rounded-xl overflow-hidden mb-4">
                  <img
                    src={project.coverImage}
                    alt={`${project.projectName} — ${project.clientName}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {project.status === 'Private' && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#0B0B14]/90 text-amber-300 text-[10px] font-medium rounded-md flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Private</span>
                    </span>
                  )}
                </div>

                <div className="px-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-lg font-extrabold text-[#0B0B14] group-hover:text-[#6C4EFF] transition-colors">
                      {project.projectName}
                    </h2>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {project.year}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 mb-3">
                    {project.clientName}
                  </p>

                  <div className="mb-3 flex flex-wrap items-center gap-1.5">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md">
                      {project.category}
                    </span>
                    {project.status !== 'Private' &&
                      (project.domain || project.liveUrl) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#6C4EFF]/8 text-[#6C4EFF] text-[11px] font-medium rounded-md truncate max-w-[175px]">
                          <Globe className="w-3 h-3 shrink-0" />
                          <span className="truncate">
                            {project.domain ||
                              extractWebsiteDomain(project.liveUrl || '')}
                          </span>
                        </span>
                      )}
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="px-1.5 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4EFF] group-hover:gap-2.5 transition-all">
                  <span>View Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. PROJECT DETAILS PAGE (/portfolio/:slug)
// ============================================================================
interface ProjectDetailsPageProps {
  project: Project | undefined;
  allProjects: Project[];
  onNavigate: (page: PublicPage, slug?: string) => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({
  project,
  allProjects,
  onNavigate,
}) => {
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (project) {
      setActiveImage(project.coverImage);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-3xl font-bold text-[#0B0B14] mb-3">
          Project Not Found
        </h1>
        <p className="text-slate-500 mb-6">
          The requested portfolio case study could not be found.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('portfolio')}
          className="px-6 py-2.5 bg-[#6C4EFF] text-white text-sm font-semibold rounded-full"
        >
          Back to Our Work
        </button>
      </div>
    );
  }

  const allImages = Array.from(
    new Set([project.coverImage, ...(project.galleryImages || [])].filter(Boolean))
  );

  const rawDomainOrUrl = (project.domain || project.liveUrl || '').trim();
  const resolvedLiveUrl = normalizeWebsiteUrl(rawDomainOrUrl);
  const resolvedDomainLabel = extractWebsiteDomain(rawDomainOrUrl);

  const isPublicLiveUrl =
    project.status !== 'Private' && resolvedLiveUrl.length > 0;

  const relatedProjects = allProjects
    .filter(
      (p) =>
        p.projectId !== project.projectId &&
        (p.status === 'Published' || p.status === 'Private')
    )
    .slice(0, 3);

  return (
    <article className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Back Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#6C4EFF] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Our Work</span>
          </button>
          <span className="text-xs text-slate-400">
            /portfolio/{project.slug}
          </span>
        </div>

        {/* Project Title Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 mb-10 border-b border-slate-200 items-end">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3 py-1 bg-[#6C4EFF]/10 text-[#6C4EFF] text-xs font-semibold rounded-full">
                {project.category}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                {project.year}
              </span>
              <span className="text-xs text-slate-400">
                Client: {project.clientName}
              </span>
              {isPublicLiveUrl && resolvedDomainLabel && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-[#0B0B14] text-xs font-medium rounded-full">
                  <Globe className="w-3.5 h-3.5 text-[#6C4EFF]" />
                  <span>{resolvedDomainLabel}</span>
                </span>
              )}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-[#0B0B14] tracking-tight mb-2">
              {project.projectName}
            </h1>
            <p className="text-lg text-slate-500">
              {project.clientName} — {project.category} Website
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            {isPublicLiveUrl ? (
              <a
                href={resolvedLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#6C4EFF] hover:bg-[#5B3DF5] text-white text-sm font-semibold rounded-full transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Visit Live Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="w-full sm:w-auto px-5 py-3 bg-slate-100 text-slate-600 rounded-full inline-flex items-center justify-center gap-2 text-xs font-semibold">
                <Lock className="w-4 h-4 text-[#0B0B14]" />
                <span>Private Project</span>
              </div>
            )}
          </div>
        </div>

        {/* Cover Image & Gallery */}
        <div className="mb-14">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-[#0B0B14] aspect-[16/9] max-h-[640px] shadow-md">
            <img
              src={activeImage || project.coverImage}
              alt={`${project.projectName} showcase`}
              className="w-full h-full object-cover"
            />
          </div>

          {allImages.length > 1 && (
            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-28 sm:w-36 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImage === imgUrl
                      ? 'border-[#6C4EFF] opacity-100'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${project.projectName} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Case Study Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-extrabold text-[#0B0B14] mb-3">
                About the Project
              </h2>
              <p className="text-base sm:text-lg text-[#0B0B14] font-medium leading-relaxed mb-4">
                {project.description}
              </p>
              {project.fullDescription && (
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                  {project.fullDescription}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#F7F8FC]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Services Provided
              </h3>
              <ul className="space-y-2.5">
                {project.services.map((service) => (
                  <li
                    key={service}
                    className="flex items-center gap-2.5 text-sm font-semibold text-[#0B0B14]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#6C4EFF] shrink-0" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-[#F7F8FC]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-[#0B0B14] text-xs font-semibold rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200">
            <h3 className="font-display text-2xl font-extrabold text-[#0B0B14] mb-6">
              More Recent Work
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProjects.map((rel) => (
                <div
                  key={rel.projectId}
                  onClick={() => onNavigate('project-details', rel.slug)}
                  className="group bg-white rounded-2xl border border-slate-200 p-3.5 hover:border-[#6C4EFF] cursor-pointer transition-all"
                >
                  <img
                    src={rel.coverImage}
                    alt={rel.projectName}
                    className="w-full aspect-[16/10] object-cover rounded-xl mb-3"
                  />
                  <h4 className="font-display font-bold text-base text-[#0B0B14] group-hover:text-[#6C4EFF]">
                    {rel.projectName}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                    {rel.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

// ============================================================================
// 5. CONTACT / PROJECT INQUIRY SECTION
// ============================================================================
interface ContactSectionProps {
  settings: AdminSettings;
  packages: PricingPackage[];
  initialService?: string;
  initialPackage?: string;
  initialAddOns?: string[];
  onSubmitInquiry: (
    inquiry: Omit<ContactRequest, 'requestId' | 'status' | 'createdAt'>
  ) => Promise<void>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  packages,
  initialService = 'Website Design',
  initialPackage = '',
  initialAddOns = [],
  onSubmitInquiry,
}) => {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(initialService || 'Website Design');
  const [selectedPackage, setSelectedPackage] = useState(initialPackage || '');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialService) setService(initialService);
  }, [initialService]);

  useEffect(() => {
    if (initialPackage) setSelectedPackage(initialPackage);
  }, [initialPackage]);

  useEffect(() => {
    if (initialAddOns && initialAddOns.length > 0) {
      const addOnText = `Selected Add-Ons: ${initialAddOns.join(', ')}`;
      setMessage((prev) =>
        prev.includes(addOnText) ? prev : `${addOnText}\n\n${prev}`.trim()
      );
    }
  }, [initialAddOns]);

  const serviceOptions = [
    'Website Design',
    'Business Website',
    'E-commerce',
    'Web Application',
    'Website Redesign',
    'Maintenance',
    'Other',
  ];

  const budgetOptions = [
    '₹799 – ₹1,999 — Starter / Basic',
    '₹3,999 – ₹6,999 — Business / Professional',
    '₹9,999 – ₹14,999 — Premium / Elite',
    '₹15,000+ — Custom Web Application',
    'Not sure yet — advise me',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = sanitizeText(name);
    const cleanEmail = sanitizeText(email);
    const cleanMessage = sanitizeText(message);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setErrorMsg('Please fill in your Name, Email, and Project Message.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmitInquiry({
        name: cleanName,
        businessName: sanitizeText(businessName),
        email: cleanEmail,
        phone: sanitizeText(phone),
        service: sanitizeText(service),
        selectedPackage: sanitizeText(selectedPackage),
        budget: sanitizeText(budget),
        message: cleanMessage,
      });
      setSubmittedSuccess(true);
      setName('');
      setBusinessName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not submit inquiry. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const cleanWhatsAppNumber = (settings.whatsapp || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
    `Hi PrimeNEST! I'm interested in building a website${
      selectedPackage ? ` (${selectedPackage})` : ''
    }.`
  )}`;

  return (
    <section id="contact" className="py-16 lg:py-24 bg-[#F7F8FC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-[2px] bg-[#6C4EFF]" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  START A PROJECT
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B0B14] tracking-tight">
                Let’s Build Your Website.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed">
                Tell us about your business, selected package, and goals. PrimeNEST will get back to you promptly.
              </p>
            </div>

            <div className="p-6 bg-[#F4F3FF] border border-[#6C4EFF]/15 text-[#0B0B14] rounded-2xl shadow-2xs">
              <h3 className="font-display text-lg font-bold mb-2">
                Instant Chat on WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
                Message PrimeNEST directly on WhatsApp for quick package questions or local business consultations.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm shadow-[#25D366]/25"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with PrimeNEST</span>
              </a>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#6C4EFF]" />
                <span>{settings.email || 'primenestonlinemart@gmail.com'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#6C4EFF]" />
                <span>{settings.phone || '+91 99615 12012'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#6C4EFF]" />
                <span>Sooranad, Kerala, India</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
              {submittedSuccess ? (
                <div className="py-10 px-4 text-center">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#0B0B14] mb-2">
                    Thanks! Your project request has been received.
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                    PrimeNEST will get back to you soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedSuccess(false)}
                    className="px-6 py-2.5 bg-[#6C4EFF] text-white text-xs font-semibold rounded-full cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-display text-xl font-extrabold text-[#0B0B14] mb-2">
                    Project Request Form
                  </h3>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6C4EFF] focus:bg-white rounded-xl text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Company or shop name"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6C4EFF] focus:bg-white rounded-xl text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6C4EFF] focus:bg-white rounded-xl text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6C4EFF] focus:bg-white rounded-xl text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Service Required *
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6C4EFF] focus:bg-white rounded-xl text-sm outline-none"
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Package
                      </label>
                      <select
                        value={selectedPackage}
                        onChange={(e) => setSelectedPackage(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6C4EFF] focus:bg-white rounded-xl text-sm outline-none"
                      >
                        <option value="">Select Package</option>
                        {packages.map((pkg, idx) => {
                          const { domainNote } = getPackageDomainPolicy(
                            pkg,
                            idx
                          );
                          const label = `${pkg.name} — ${pkg.price} • ${domainNote}`;
                          return (
                            <option key={pkg.packageId} value={label}>
                              {label}
                            </option>
                          );
                        })}
                        <option value="Custom / Selected Add-Ons">
                          Custom / Selected Add-Ons
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Project Budget
                      </label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6C4EFF] focus:bg-white rounded-xl text-sm outline-none"
                      >
                        <option value="">Select Budget</option>
                        {budgetOptions.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project requirements..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6C4EFF] focus:bg-white rounded-xl text-sm outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 bg-[#6C4EFF] hover:bg-[#5B3DF5] disabled:opacity-50 text-white text-sm font-semibold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#6C4EFF]/25"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {submitting ? 'Sending Request...' : 'Send Project Request'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CallToActionSection: React.FC<{
  settings: AdminSettings;
  onNavigate: (page: PublicPage) => void;
}> = ({ onNavigate }) => {
  return (
    <section className="py-16 lg:py-24 bg-[#F4F3FF] text-[#0B0B14] border-t border-slate-200/70">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: LET'S WORK TOGETHER — Turning Ideas Into Powerful Websites. (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#6C4EFF]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                LET&apos;S WORK TOGETHER
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.15] mb-4">
              Turning Ideas Into
              <br />
              <span className="text-[#6C4EFF]">Powerful Websites.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md">
              Ready to start your project? Let&apos;s create something great together. Your success is our priority.
            </p>
          </motion.div>

          {/* Right Column: 3 Value Pillars + Action Buttons (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 mb-8">
              {/* Pillar 1: Quick Response */}
              <div className="sm:pr-6">
                <MessageSquare className="w-6 h-6 text-[#6C4EFF] mb-3" />
                <h3 className="font-display text-sm sm:text-base font-bold text-[#0B0B14] mb-1">
                  Quick Response
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We reply to your queries as soon as possible.
                </p>
              </div>

              {/* Pillar 2: Secure & Reliable */}
              <div className="sm:px-6 sm:border-l sm:border-slate-200/90">
                <ShieldCheck className="w-6 h-6 text-[#6C4EFF] mb-3" />
                <h3 className="font-display text-sm sm:text-base font-bold text-[#0B0B14] mb-1">
                  Secure &amp; Reliable
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your data and ideas are always safe with us.
                </p>
              </div>

              {/* Pillar 3: Ongoing Support */}
              <div className="sm:pl-6 sm:border-l sm:border-slate-200/90">
                <Heart className="w-6 h-6 text-[#6C4EFF] mb-3" />
                <h3 className="font-display text-sm sm:text-base font-bold text-[#0B0B14] mb-1">
                  Ongoing Support
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We&apos;re here even after your website goes live.
                </p>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-7 py-3.5 bg-[#6C4EFF] hover:bg-[#5B3DF5] text-white text-sm font-semibold rounded-full inline-flex items-center gap-2.5 shadow-md shadow-[#6C4EFF]/25 transition-all cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                type="button"
                onClick={() => onNavigate('portfolio')}
                className="py-2 text-sm font-bold text-[#0B0B14] hover:text-[#6C4EFF] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>View Our Work</span>
                <ArrowRight className="w-4 h-4 text-[#6C4EFF]" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// 6. LIGHT STUDIO FOOTER & GREEN FLOATING WHATSAPP BUTTON
// ============================================================================
export const Footer: React.FC<{
  settings: AdminSettings;
  onNavigate: (page: PublicPage) => void;
}> = ({ settings, onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  return (
    <footer className="bg-white text-[#0B0B14] pt-16 pb-10 border-t border-slate-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
          {/* Col 1: Brand (3 cols) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2.5 mb-3">
              <PrimeNestLogoMark className="w-7 h-7" innerFill="#FFFFFF" />
              <span className="font-display text-xl tracking-tight text-[#0B0B14]">
                <strong className="font-extrabold">Prime</strong>
                <span className="font-light">NEST</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              We Build Websites That Build Businesses.
            </p>
          </div>

          {/* Col 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-2">
            <div className="text-xs font-bold text-[#0B0B14] mb-3">Navigation</div>
            {(
              [
                ['Home', 'home'],
                ['Work', 'portfolio'],
                ['Services', 'services'],
                ['Packages', 'packages'],
                ['About', 'about'],
                ['Contact', 'contact'],
              ] as [string, PublicPage][]
            ).map(([label, page]) => (
              <button
                key={page}
                type="button"
                onClick={() => onNavigate(page)}
                className="block text-xs text-slate-600 hover:text-[#6C4EFF] transition-colors cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Col 3: Get in Touch (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <div className="text-xs font-bold text-[#0B0B14] mb-3">Get in Touch</div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <Mail className="w-3.5 h-3.5 text-[#6C4EFF] shrink-0" />
              <a
                href={`mailto:${settings.email || 'primenestonlinemart@gmail.com'}`}
                className="hover:text-[#6C4EFF] transition-colors"
              >
                {settings.email || 'primenestonlinemart@gmail.com'}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <Phone className="w-3.5 h-3.5 text-[#6C4EFF] shrink-0" />
              <a
                href={`tel:${settings.phone || '+91 99615 12012'}`}
                className="hover:text-[#6C4EFF] transition-colors"
              >
                {settings.phone || '+91 99615 12012'}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-[#6C4EFF] shrink-0" />
              <span>Sooranad, Kerala, India</span>
            </div>
          </div>

          {/* Col 4: Follow Us (2 cols) */}
          <div className="lg:col-span-2">
            <div className="text-xs font-bold text-[#0B0B14] mb-3">Follow Us</div>
            <div className="flex items-center gap-2.5 text-slate-600">
              <a
                href={settings.instagram || 'https://instagram.com/primenestonline'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-[#F4F3FF] hover:bg-[#6C4EFF] hover:text-white transition-colors"
                aria-label="Instagram @primenestonline"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={settings.facebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-[#F4F3FF] hover:bg-[#6C4EFF] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="#linkedin"
                onClick={(e) => e.preventDefault()}
                className="p-1.5 rounded-lg bg-[#F4F3FF] hover:bg-[#6C4EFF] hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="#youtube"
                onClick={(e) => e.preventDefault()}
                className="p-1.5 rounded-lg bg-[#F4F3FF] hover:bg-[#6C4EFF] hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 5: Stay Updated (2 cols) */}
          <div className="lg:col-span-2">
            <div className="text-xs font-bold text-[#0B0B14] mb-2">Stay Updated</div>
            <p className="text-[11px] text-slate-500 mb-3">
              Get the latest updates and insights.
            </p>
            {newsletterSubscribed ? (
              <div className="text-xs text-emerald-600 font-medium">
                Subscribed! Thank you.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    setNewsletterSubscribed(true);
                    setNewsletterEmail('');
                  }
                }}
                className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3 py-2 bg-transparent text-xs text-[#0B0B14] placeholder:text-slate-400 outline-none"
                />
                <button
                  type="submit"
                  className="p-2 bg-[#6C4EFF] hover:bg-[#5B3DF5] text-white shrink-0 cursor-pointer"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.businessName || 'PrimeNEST'}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="hover:text-[#6C4EFF] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onNavigate('terms')}
              className="hover:text-[#6C4EFF] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="hover:text-[#6C4EFF] transition-colors cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const FloatingWhatsAppButton: React.FC<{ settings: AdminSettings }> = ({
  settings,
}) => {
  const cleanWhatsApp = (settings.whatsapp || '').replace(/[^0-9]/g, '');
  if (!cleanWhatsApp) return null;

  return (
    <a
      href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
        'Hi PrimeNEST! I would like to discuss a website for my business.'
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-transform hover:scale-105"
      aria-label="Chat with PrimeNEST on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
    </a>
  );
};

export const LegalPage: React.FC<{
  type: 'privacy' | 'terms';
  settings: AdminSettings;
  onNavigate: (page: PublicPage) => void;
}> = ({ type, settings, onNavigate }) => {
  return (
    <div className="py-16 lg:py-24 bg-white min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#6C4EFF] mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B0B14] mb-6">
          {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        </h1>

        <div className="space-y-5 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-200 pt-6">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>{settings.businessName || 'PrimeNEST'}</strong> respects your privacy. When you submit a project request through our Contact form, we collect your name, business name, email address, phone number, and project details solely to evaluate your requirements and communicate with you about your website project.
              </p>
              <p>
                We do not sell, rent, or trade your contact information with third-party marketers. Client project inquiries are stored in our access-controlled database and are accessible only to authorized PrimeNEST studio administration.
              </p>
            </>
          ) : (
            <>
              <p>
                Welcome to <strong>{settings.businessName || 'PrimeNEST'}</strong>. By engaging PrimeNEST for website design, development, redesign, or maintenance services, you agree to the project scope, deliverables, revision counts, and timeline outlined in your selected package or written project proposal.
              </p>
              <p>
                Package prices listed on our website represent standard build specifications. Custom integrations, third-party subscriptions, domain registration renewals, or additional pages beyond package limits are quoted transparently prior to work commencing.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
