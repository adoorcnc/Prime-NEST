import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Monitor,
  Building2,
  ShoppingCart,
  Code2,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Workflow,
  Sparkles,
  FileCheck2,
  X,
} from 'lucide-react';
import { PublicPage, ServiceItem } from '../types';

interface ServicesExplainedSectionProps {
  services: ServiceItem[];
  onNavigate: (page: PublicPage) => void;
  onSelectServiceForInquiry: (serviceTitle: string) => void;
  showFullPageHeader?: boolean;
}

export const ServicesExplainedSection: React.FC<ServicesExplainedSectionProps> = ({
  services,
  onNavigate,
  onSelectServiceForInquiry,
  showFullPageHeader = false,
}) => {
  const activeServices = [...services]
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    showFullPageHeader ? activeServices[0]?.serviceId || null : null
  );
  const explainedRef = useRef<HTMLDivElement>(null);

  const renderIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Layout':
      case 'Monitor':
        return <Monitor className={className} />;
      case 'Building2':
        return <Building2 className={className} />;
      case 'ShoppingBag':
      case 'ShoppingCart':
        return <ShoppingCart className={className} />;
      case 'Code2':
        return <Code2 className={className} />;
      case 'RefreshCw':
        return <RefreshCw className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      default:
        return <Monitor className={className} />;
    }
  };

  const handleLearnMore = (serviceId: string) => {
    setSelectedServiceId((prev) =>
      prev === serviceId && !showFullPageHeader ? null : serviceId
    );
    setTimeout(() => {
      if (explainedRef.current) {
        explainedRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }, 80);
  };

  const currentService = activeServices.find(
    (s) => s.serviceId === selectedServiceId
  );

  if (activeServices.length === 0) return null;

  return (
    <section id="services" className="py-16 lg:py-24 bg-[#F7F8FC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header matching reference design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-[#6C4EFF]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                OUR SERVICES
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B0B14] tracking-tight">
              Everything You Need for Your Online Presence
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              From simple websites to complex web applications, we&apos;ve got you covered.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showFullPageHeader) {
                onNavigate('packages');
              } else {
                setSelectedServiceId(activeServices[0]?.serviceId || null);
                onNavigate('services');
              }
            }}
            className="self-start sm:self-auto px-5 py-2.5 rounded-full border border-slate-200 hover:border-[#6C4EFF] bg-white text-[#0B0B14] hover:text-[#6C4EFF] text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <span>{showFullPageHeader ? 'View Packages' : 'View All Services'}</span>
            <ArrowRight className="w-4 h-4 text-[#6C4EFF]" />
          </button>
        </motion.div>

        {/* 6-Column Service Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {activeServices.map((service, idx) => {
            const isSelected = currentService?.serviceId === service.serviceId;
            return (
              <motion.div
                key={service.serviceId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                whileHover={{ y: -5 }}
                onClick={() => handleLearnMore(service.serviceId)}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#6C4EFF] ring-2 ring-[#6C4EFF]/15 shadow-md'
                    : 'border-slate-200/90 hover:border-[#6C4EFF]/50 shadow-2xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Soft Lavender Circle Icon matching reference image */}
                  <div className="w-12 h-12 rounded-full bg-[#F1EEFF] text-[#6C4EFF] flex items-center justify-center mb-5">
                    {renderIcon(service.iconName, 'w-5 h-5')}
                  </div>

                  <h3 className="font-display text-base font-extrabold text-[#0B0B14] mb-2 leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4EFF]">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed "Services Explained" Expandable Drawer / Area */}
        {currentService && (
          <div
            ref={explainedRef}
            className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 sm:p-8 bg-[#F4F3FF] text-[#0B0B14] border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#6C4EFF] text-white flex items-center justify-center shrink-0">
                  {renderIcon(currentService.iconName, 'w-5 h-5')}
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-[#6C4EFF] block">
                    SERVICE EXPLAINED • IN-DEPTH SPECIFICATION
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B0B14]">
                    {currentService.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectServiceForInquiry(currentService.title)}
                  className="px-5 py-2.5 bg-[#6C4EFF] hover:bg-[#5B3DF5] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm shadow-[#6C4EFF]/25"
                >
                  <span>Start {currentService.title} Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {!showFullPageHeader && (
                  <button
                    type="button"
                    onClick={() => setSelectedServiceId(null)}
                    className="p-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 cursor-pointer"
                    aria-label="Close service details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Service Tabs Bar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
              {activeServices.map((srv) => (
                <button
                  key={srv.serviceId}
                  type="button"
                  onClick={() => setSelectedServiceId(srv.serviceId)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                    srv.serviceId === currentService.serviceId
                      ? 'bg-[#6C4EFF] text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-[#6C4EFF]'
                  }`}
                >
                  {srv.title}
                </button>
              ))}
            </div>

            {/* 3-Column Breakdown: What It Entails, Typical Process, Client Benefits */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-[#F7F8FC] p-5 rounded-xl border border-slate-200/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0B14] mb-3 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#6C4EFF]" />
                  <span>What This Service Entails</span>
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {currentService.whatItEntails || currentService.description}
                </p>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Included Deliverables
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(currentService.deliverables || []).map((del) => (
                    <span
                      key={del}
                      className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-md"
                    >
                      {del}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0B14] mb-3 flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-[#6C4EFF]" />
                  <span>Typical Process</span>
                </h4>
                <ol className="space-y-3">
                  {(currentService.typicalProcess || []).map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#6C4EFF]/10 text-[#6C4EFF] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B0B14] mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#6C4EFF]" />
                  <span>Client Benefits</span>
                </h4>
                <ul className="space-y-3">
                  {(currentService.clientBenefits || []).map((benefit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#6C4EFF] shrink-0 mt-0.5" />
                      <span className="leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
