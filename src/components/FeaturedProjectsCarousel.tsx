import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
} from 'lucide-react';
import { Project, PublicPage } from '../types';
import { extractWebsiteDomain } from '../utils/imageOptimizer';

interface FeaturedProjectsCarouselProps {
  projects: Project[];
  onNavigate: (page: PublicPage, slug?: string) => void;
}

export const FeaturedProjectsCarousel: React.FC<FeaturedProjectsCarouselProps> = ({
  projects,
  onNavigate,
}) => {
  const visibleProjects = projects.filter(
    (p) => p.status === 'Published' || p.status === 'Private'
  );
  const featuredList =
    visibleProjects.filter((p) => p.featured).length > 0
      ? visibleProjects.filter((p) => p.featured)
      : visibleProjects;

  const [startIdx, setStartIdx] = useState(0);
  const cardsPerView = 4;
  const maxStart = Math.max(0, featuredList.length - cardsPerView);
  const safeStart = Math.min(startIdx, maxStart);
  const displayedProjects = featuredList.slice(
    safeStart,
    safeStart + cardsPerView
  );

  if (featuredList.length === 0) return null;

  return (
    <section id="works" className="py-16 lg:py-24 bg-white scroll-mt-24 relative">
      <span id="featured-work" className="absolute -top-24 pointer-events-none" />
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header Row matching reference design */}
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
                FEATURED WORK
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B0B14] tracking-tight">
              Our Recent Work
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Websites and digital experiences created by PrimeNEST.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {featuredList.length > cardsPerView && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safeStart === 0}
                  onClick={() => setStartIdx((prev) => Math.max(0, prev - 1))}
                  className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-[#6C4EFF] hover:text-[#6C4EFF] disabled:opacity-35 transition-colors cursor-pointer"
                  aria-label="Previous projects"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={safeStart >= maxStart}
                  onClick={() =>
                    setStartIdx((prev) => Math.min(maxStart, prev + 1))
                  }
                  className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:border-[#6C4EFF] hover:text-[#6C4EFF] disabled:opacity-35 transition-colors cursor-pointer"
                  aria-label="Next projects"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:border-[#6C4EFF] text-[#0B0B14] hover:text-[#6C4EFF] text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer bg-white shadow-2xs"
            >
              <span>View All Work</span>
              <ArrowRight className="w-4 h-4 text-[#6C4EFF]" />
            </button>
          </div>
        </motion.div>

        {/* 4-Column Project Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProjects.map((project, idx) => (
            <motion.article
              key={project.projectId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => onNavigate('project-details', project.slug)}
              className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#6C4EFF]/40 p-3.5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Top Mockup Image */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#0B0B14] mb-4">
                  <img
                    src={project.coverImage}
                    alt={`${project.projectName} — ${project.clientName}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {project.status === 'Private' && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#0B0B14]/85 text-amber-300 text-[10px] font-medium rounded-md flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Private</span>
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="px-1.5">
                  <h3 className="font-display text-lg font-extrabold text-[#0B0B14] group-hover:text-[#6C4EFF] transition-colors leading-snug">
                    {project.projectName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 mb-3">
                    {project.clientName}
                  </p>

                  <div className="mb-3 flex flex-wrap items-center gap-1.5">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-md">
                      {project.category}
                    </span>
                    {project.status !== 'Private' &&
                      (project.domain || project.liveUrl) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#6C4EFF]/8 text-[#6C4EFF] text-[11px] font-medium rounded-md truncate max-w-[170px]">
                          <Globe className="w-3 h-3 shrink-0" />
                          <span className="truncate">
                            {project.domain ||
                              extractWebsiteDomain(project.liveUrl || '')}
                          </span>
                        </span>
                      )}
                  </div>

                  <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed line-clamp-2 mb-5">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-1.5 pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4EFF] group-hover:gap-2.5 transition-all">
                  <span>View Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
