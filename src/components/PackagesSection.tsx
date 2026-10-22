import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  Plus,
  Layers,
  ChevronDown,
  ChevronUp,
  Globe,
} from 'lucide-react';
import { AddOnItem, PricingPackage } from '../types';
import { getPackageDomainPolicy } from '../data/seedData';

interface PackagesSectionProps {
  packages: PricingPackage[];
  addOns: AddOnItem[];
  onChoosePackage: (packageString: string, selectedAddOns?: string[]) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  addOns,
  onChoosePackage,
}) => {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showFullFeatures, setShowFullFeatures] = useState<boolean>(false);

  const activePackages = [...packages]
    .filter((p) => p.active)
    .sort((a, b) => a.order - b.order);

  const activeAddOns = [...addOns]
    .filter((a) => a.active)
    .sort((a, b) => a.order - b.order);

  const toggleAddOn = (addOnLabel: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnLabel)
        ? prev.filter((item) => item !== addOnLabel)
        : [...prev, addOnLabel]
    );
  };

  return (
    <section
      id="packages"
      className="py-16 lg:py-24 bg-gradient-to-b from-[#F5F4FF] to-white text-[#0B0B14] relative overflow-hidden border-t border-slate-100 scroll-mt-24"
    >
      <span id="plans" className="absolute -top-24 pointer-events-none" />
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none absolute -top-32 left-1/3 w-96 h-96 rounded-full bg-[#6C4EFF]/8 blur-3xl" />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-6 items-center">
          {/* Left Column: PRICING PACKAGES Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
            className="xl:col-span-3"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-[#6C4EFF]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                PRICING PACKAGES
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B0B14] tracking-tight leading-tight mb-4">
              Choose the Perfect Plan
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Flexible packages for every business size. Need a custom solution? Get in touch!
            </p>

            {/* Domain & Hosting Policy Summary */}
            <div className="mb-5 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 text-[11px]">
              <div className="flex items-start gap-2 text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#0B0B14]">Starter, Basic &amp; Business:</strong> Prices excluding domain
                </span>
              </div>
              <div className="flex items-start gap-2 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-[#0B0B14]">All Other Packages:</strong> 1 Year Free Domain &amp; Hosting
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFullFeatures((prev) => !prev)}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-[#6C4EFF] text-xs font-semibold text-[#0B0B14] hover:text-[#6C4EFF] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Layers className="w-3.5 h-3.5 text-[#6C4EFF]" />
              <span>
                {showFullFeatures
                  ? 'Hide Detailed Features & Add-Ons'
                  : 'Compare All Features & Add-Ons'}
              </span>
              {showFullFeatures ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </motion.div>

          {/* Right Column: 6 Package Cards Row */}
          <div className="xl:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-end">
              {activePackages.map((pkg, idx) => {
                const isPopular =
                  pkg.tierStyle === 'popular' ||
                  pkg.name.toLowerCase() === 'business';
                const isRecommended =
                  pkg.tierStyle === 'recommended' ||
                  pkg.name.toLowerCase() === 'professional';
                const { domainNote, isFreeDomainHosting } =
                  getPackageDomainPolicy(pkg, idx);
                const packageLabel = `${pkg.name} — ${pkg.price} • ${domainNote}`;

                const hasDomainInFeatures = (pkg.features || []).some((f) =>
                  /domain/i.test(f)
                );
                const displayFeatures = hasDomainInFeatures
                  ? pkg.features
                  : [
                      isFreeDomainHosting
                        ? '1 Year Free Domain & Hosting'
                        : 'Price excluding domain',
                      ...(pkg.features || []),
                    ];

                return (
                  <motion.div
                    key={pkg.packageId}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: idx * 0.06 }}
                    whileHover={{ y: -5 }}
                    className="flex flex-col"
                  >
                    {/* Top Tab for MOST POPULAR and RECOMMENDED */}
                    {isPopular && (
                      <div className="bg-[#6C4EFF] text-white text-[10px] font-bold uppercase tracking-wider text-center py-1.5 rounded-t-xl mx-1">
                        {pkg.badge || 'MOST POPULAR'}
                      </div>
                    )}
                    {isRecommended && (
                      <div className="bg-[#E8E2FF] text-[#4A32D4] text-[10px] font-bold uppercase tracking-wider text-center py-1.5 rounded-t-xl mx-1">
                        {pkg.badge || 'RECOMMENDED'}
                      </div>
                    )}

                    {/* White Card Body */}
                    <div
                      className={`bg-white text-[#0B0B14] rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md ${
                        isPopular
                          ? 'border-2 border-[#6C4EFF] min-h-[285px]'
                          : isRecommended
                          ? 'border-2 border-[#B8A9FF] min-h-[285px]'
                          : 'border border-slate-200/90 min-h-[270px]'
                      }`}
                    >
                      <div>
                        <div className="font-display text-sm font-bold text-[#0B0B14] mb-1">
                          {pkg.name}
                        </div>

                        <div className="font-display text-2xl sm:text-[26px] font-extrabold text-[#0B0B14] tracking-tight mb-1.5">
                          {pkg.price}
                        </div>

                        {/* Domain & Hosting Note Badge right under price */}
                        <div className="mb-2.5">
                          {isFreeDomainHosting ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold leading-tight">
                              <Globe className="w-2.5 h-2.5 shrink-0" />
                              <span>{domainNote}</span>
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold leading-tight">
                              {domainNote}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 leading-relaxed min-h-[44px]">
                          {pkg.subtitle}
                        </p>

                        {/* Expanded Feature List when toggled */}
                        {showFullFeatures && (
                          <ul className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 mb-3">
                            {displayFeatures.map((feat, i) => (
                              <li
                                key={i}
                                className="text-[11px] text-slate-600 flex items-start gap-1.5 leading-snug"
                              >
                                <Check className="w-3 h-3 text-[#6C4EFF] shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="pt-4">
                        <div className="text-[11px] font-semibold text-slate-700 mb-3">
                          Delivery: {pkg.deliveryTime}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onChoosePackage(packageLabel, selectedAddOns)
                          }
                          className={`w-full py-2 px-3 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                            isPopular
                              ? 'bg-[#6C4EFF] hover:bg-[#5B3DF5] text-white shadow-sm shadow-[#6C4EFF]/30'
                              : isRecommended
                              ? 'bg-white border border-[#6C4EFF] text-[#6C4EFF] hover:bg-[#6C4EFF] hover:text-white'
                              : 'bg-white border border-slate-200 text-[#0B0B14] hover:border-[#6C4EFF] hover:text-[#6C4EFF]'
                          }`}
                        >
                          Choose Package
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expandable Add-Ons Drawer */}
        {showFullFeatures && (
          <div className="mt-12 pt-10 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-[#0B0B14]">
                  Optional Add-Ons
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select any optional add-on below to attach it to your project request.
                </p>
              </div>
              {selectedAddOns.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    onChoosePackage('Custom / Selected Add-Ons', selectedAddOns)
                  }
                  className="px-5 py-2.5 bg-[#6C4EFF] text-white text-xs font-semibold rounded-full cursor-pointer self-start shadow-sm shadow-[#6C4EFF]/25"
                >
                  Include {selectedAddOns.length} Selected Add-On(s) →
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeAddOns.map((addon) => {
                const label = `${addon.name} (${addon.price})`;
                const isSelected = selectedAddOns.includes(label);
                return (
                  <button
                    key={addon.addOnId}
                    type="button"
                    onClick={() => toggleAddOn(label)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#6C4EFF] text-white border-[#6C4EFF] shadow-sm'
                        : 'bg-white text-[#0B0B14] border-slate-200 hover:border-[#6C4EFF]/50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{addon.name}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          isSelected ? 'text-white/90' : 'text-[#6C4EFF] font-medium'
                        }`}
                      >
                        {addon.price}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#F1EEFF] text-[#6C4EFF]'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
