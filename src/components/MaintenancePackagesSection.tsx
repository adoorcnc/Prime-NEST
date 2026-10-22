import React from 'react';
import { motion } from 'motion/react';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  ShoppingBag,
  MessageCircle,
} from 'lucide-react';

interface MaintenancePlan {
  id: string;
  name: string;
  price: string;
  billingPeriod: string;
  badge?: string;
  summary: string;
  features: string[];
  bestFor: string;
  accent: 'blue' | 'purple' | 'amber';
}

const MAINTENANCE_PLANS: MaintenancePlan[] = [
  {
    id: 'basic-care',
    name: 'Basic Care',
    price: '₹499',
    billingPeriod: '/mo',
    summary: 'Minor text and image updates, basic checks',
    features: [
      'Minor text and copy updates',
      'Image replacements and optimization',
      'Basic uptime and broken link checks',
      'Monthly overall website health verification',
      'Standard turnaround time',
    ],
    bestFor: 'Simple business websites, personal portfolios & landing pages',
    accent: 'blue',
  },
  {
    id: 'business-care',
    name: 'Business Care',
    price: '₹999',
    billingPeriod: '/mo',
    badge: 'Most Popular',
    summary: 'Updates, form testing, backups where supported and monthly checks',
    features: [
      'Regular content, copy & banner updates',
      'Contact form & lead capture verification',
      'Scheduled backups (where supported by host/platform)',
      'Monthly health, speed and mobile responsiveness audit',
      'Priority ticket & chat support',
    ],
    bestFor: 'Growing companies, professional services & lead generation sites',
    accent: 'purple',
  },
  {
    id: 'store-care',
    name: 'Store Care',
    price: '₹1,999',
    billingPeriod: '/mo',
    badge: 'For Online Stores',
    summary: 'Store checks, product updates within an agreed limit and support',
    features: [
      'Full e-commerce store & checkout flow testing',
      'Product catalog additions & updates (within agreed limit)',
      'Pricing, inventory & banner adjustment assistance',
      'Payment gateway checkout testing & alerts',
      'Dedicated high-priority support channel',
    ],
    bestFor: 'E-commerce websites, product catalogs & transactional stores',
    accent: 'amber',
  },
];

interface MaintenancePackagesSectionProps {
  onChoosePlan?: (planLabel: string) => void;
  whatsappNumber?: string;
}

export const MaintenancePackagesSection: React.FC<MaintenancePackagesSectionProps> = ({
  onChoosePlan,
  whatsappNumber = '919961512012',
}) => {
  const handleSelect = (plan: MaintenancePlan) => {
    const label = `Maintenance: ${plan.name} (${plan.price}${plan.billingPeriod})`;
    if (onChoosePlan) {
      onChoosePlan(label);
    } else {
      const msg = encodeURIComponent(
        `Hi PrimeNEST, I am interested in subscribing to the ${plan.name} website maintenance package (${plan.price}${plan.billingPeriod}). Please share the onboarding details.`
      );
      window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    }
  };

  const handleWhatsApp = (plan: MaintenancePlan) => {
    const cleanNum = whatsappNumber.replace(/[^0-9]/g, '') || '919961512012';
    const msg = encodeURIComponent(
      `Hi PrimeNEST, I would like to inquire about the ${plan.name} (${plan.price}${plan.billingPeriod}) website maintenance plan.`
    );
    window.open(`https://wa.me/${cleanNum}?text=${msg}`, '_blank');
  };

  return (
    <section
      id="maintenance-packages"
      className="py-16 lg:py-24 bg-white text-[#0B0B14] relative overflow-hidden border-t border-slate-100 scroll-mt-24"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6C4EFF]/10 text-[#6C4EFF] text-xs font-bold uppercase tracking-wider mb-4">
            <Wrench className="w-3.5 h-3.5" />
            <span>Website Care &amp; Support</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B0B14] tracking-tight leading-[1.15] mb-4">
            3. Maintenance Packages
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Keep your website fresh, safe, and running smoothly month after month with our proactive monthly care plans.
          </p>
        </motion.div>

        {/* 3 Maintenance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {MAINTENANCE_PLANS.map((plan, idx) => {
            const isFeatured = plan.accent === 'purple';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className={`flex flex-col justify-between rounded-2xl p-7 sm:p-8 transition-all relative ${
                  isFeatured
                    ? 'bg-[#0B0B14] text-white border-2 border-[#6C4EFF] shadow-xl shadow-[#6C4EFF]/15'
                    : 'bg-[#FAFAFE] text-[#0B0B14] border border-slate-200 hover:border-[#6C4EFF]/50 hover:shadow-lg'
                }`}
              >
                {/* Badge if available */}
                {plan.badge && (
                  <div className="absolute -top-3 left-8">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                        isFeatured
                          ? 'bg-[#6C4EFF] text-white shadow-md'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {plan.accent === 'purple' ? (
                        <Sparkles className="w-3 h-3" />
                      ) : (
                        <ShoppingBag className="w-3 h-3" />
                      )}
                      <span>{plan.badge}</span>
                    </span>
                  </div>
                )}

                <div>
                  {/* Title & Category */}
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className={`font-display text-2xl font-bold tracking-tight ${
                        isFeatured ? 'text-white' : 'text-[#0B0B14]'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isFeatured ? 'bg-white/10 text-[#A78BFA]' : 'bg-[#6C4EFF]/10 text-[#6C4EFF]'
                      }`}
                    >
                      {plan.id === 'basic-care' && <Wrench className="w-4 h-4" />}
                      {plan.id === 'business-care' && <ShieldCheck className="w-4 h-4" />}
                      {plan.id === 'store-care' && <ShoppingBag className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Summary */}
                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      isFeatured ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {plan.summary}
                  </p>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-1.5 mb-7 pb-6 border-b border-dashed border-slate-200/50">
                    <span
                      className={`font-display text-4xl sm:text-5xl font-extrabold tracking-tight ${
                        isFeatured ? 'text-white' : 'text-[#0B0B14]'
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        isFeatured ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {plan.billingPeriod}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <div
                      className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                        isFeatured ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      What&apos;s Included:
                    </div>
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isFeatured ? 'text-[#8B6BFF]' : 'text-[#6C4EFF]'
                          }`}
                        />
                        <span className={isFeatured ? 'text-slate-200' : 'text-slate-700'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions & Ideal Audience */}
                <div className="pt-4 border-t border-slate-200/40">
                  <p
                    className={`text-[11px] leading-snug mb-5 ${
                      isFeatured ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <strong className="font-semibold">Best for:</strong> {plan.bestFor}
                  </p>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelect(plan)}
                      className={`w-full py-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isFeatured
                          ? 'bg-[#6C4EFF] hover:bg-[#5B3DF5] text-white shadow-lg shadow-[#6C4EFF]/30'
                          : 'bg-[#0B0B14] hover:bg-[#20202F] text-white shadow-sm'
                      }`}
                    >
                      <span>Choose {plan.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWhatsApp(plan)}
                      className={`w-full py-2 rounded-full text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        isFeatured
                          ? 'text-slate-300 hover:text-white hover:bg-white/10'
                          : 'text-slate-600 hover:text-[#0B0B14] hover:bg-slate-100'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Inquire via WhatsApp</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Clear Policy Notice Banner as specified by user */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-slate-200 bg-[#FAF9FF] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-slate-700"
        >
          <div className="w-10 h-10 rounded-full bg-[#6C4EFF]/10 text-[#6C4EFF] flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs sm:text-sm leading-relaxed">
            <div className="font-bold text-[#0B0B14] mb-1 flex items-center gap-2">
              <span>Maintenance Policy &amp; Terms</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                <Clock className="w-3 h-3 text-[#6C4EFF]" />
                Transparent Scope
              </span>
            </div>
            <p className="text-slate-600">
              Define monthly work limits, response times and exclusions in writing. Hosting, paid services, major changes and emergency work are extra unless included explicitly.
            </p>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#6C4EFF] text-xs font-semibold rounded-full text-[#0B0B14] transition-colors cursor-pointer"
            >
              Custom Scope Inquiry
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
