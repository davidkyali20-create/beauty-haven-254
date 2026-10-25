import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, MessageCircle, Check, Eye } from "lucide-react";
import { CATEGORIES, ServiceCategory, Service, cleanPrice } from "../constants";
import { useServices } from "../context/ServiceContext";

export default function PriceList() {
  const { services } = useServices();
  const [activeCategory, setActiveCategory] = useState<"All" | ServiceCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        activeCategory === "All" || service.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesQuery =
        service.name.toLowerCase().includes(query) ||
        (service.description && service.description.toLowerCase().includes(query)) ||
        (service.tag && service.tag.toLowerCase().includes(query)) ||
        (service.subType && service.subType.toLowerCase().includes(query)) ||
        (service.shape && service.shape.toLowerCase().includes(query)) ||
        service.category.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [services, activeCategory, searchQuery]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: services.length };
    services.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [services]);

  const getWhatsAppBookingUrl = (service: Service) => {
    const displayPrice = cleanPrice(service.price);
    const text = `Hello Beauty Haven 254, I would like to book an appointment for *${service.name}* (${displayPrice}). Please let me know your available slots.`;
    return `https://wa.me/254796709521?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="prices" className="py-24 bg-stone-50/70 border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-gold text-xs uppercase tracking-[0.3em] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Rate Card</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif italic text-secondary">
              Beauty Haven Services
            </h2>
            <div className="section-divider mt-4" />
          </div>
          <p className="text-secondary/60 text-xs md:text-sm max-w-md mt-4 md:mt-0 font-sans leading-relaxed">
            Transparent pricing with premium products. Every treatment is designed to enhance your natural grace with soft glam precision.
          </p>
        </div>

        {/* Search & Category Tabs */}
        <div className="mb-10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] ?? 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 text-xs tracking-wider uppercase font-bold transition-all border flex items-center space-x-2 ${
                    isActive
                      ? "bg-secondary text-gold border-secondary shadow-md"
                      : "bg-white text-secondary/70 border-stone-200 hover:border-gold hover:text-secondary"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-gold text-secondary" : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, lash shapes, hair packages..."
              className="w-full bg-white border border-stone-200 pl-10 pr-4 py-2.5 text-xs font-sans text-secondary placeholder:text-stone-400 focus:outline-none focus:border-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-secondary"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Lashes & Hair Highlight Banners when respective category selected */}
        {activeCategory === "Lashes" && (
          <div className="mb-8 p-4 bg-white border-l-4 border-gold shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold">Lash Extensions Menu</p>
              <p className="text-xs text-secondary/70 mt-0.5">
                Available in <strong>Cluster</strong>, <strong>Volume / Mega</strong>, and <strong>Classic</strong>. Shapes tailored to your eye profile: Fox Eye, Cat Eye, Doll Eye, Wispy, Natural & Hybrid.
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-gold/10 text-gold px-3 py-1 border border-gold/30 shrink-0">
              Custom Mapping Included
            </span>
          </div>
        )}

        {activeCategory === "Hair" && (
          <div className="mb-8 p-4 bg-white border-l-4 border-gold shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold">Hair Care Packages</p>
              <p className="text-xs text-secondary/70 mt-0.5">
                Authentic <strong>L’Oréal</strong>, <strong>Mizani</strong> & <strong>Mikalla</strong> salon therapy: Complete Wash, Mask & Treatment suitable for Natural hair, relaxed & texlaxed hair.
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-gold/10 text-gold px-3 py-1 border border-gold/30 shrink-0">
              Premium Salon Brands
            </span>
          </div>
        )}

        {/* Price Grid */}
        <div className="bg-white p-6 md:p-10 border border-gold/30 shadow-sm">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-secondary/60 text-sm font-sans mb-4">
                No services found matching "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="text-xs font-bold uppercase tracking-widest text-gold underline hover:text-secondary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    key={`${service.category}-${service.name}`}
                    className="group border-b border-stone-200/80 pb-4 transition-all hover:border-gold"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <span className="text-sm font-semibold text-secondary group-hover:text-gold transition-colors">
                            {service.name}
                          </span>
                          {service.isPopular && (
                            <span className="text-[9px] uppercase tracking-wider font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded-sm">
                              Popular
                            </span>
                          )}
                          {service.tag && (
                            <span className="text-[9px] uppercase tracking-wider font-bold bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded-sm">
                              {service.tag}
                            </span>
                          )}
                          {service.shape && (
                            <span className="text-[9px] uppercase tracking-wider font-semibold text-secondary/60 bg-gold/10 px-1.5 py-0.2 rounded-sm">
                              Shape: {service.shape}
                            </span>
                          )}
                        </div>

                        {service.description && (
                          <p className="text-xs text-secondary/60 line-clamp-2 leading-relaxed pr-2">
                            {service.description}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end">
                        <div className="text-base font-bold text-secondary font-sans group-hover:text-gold transition-colors">
                          {cleanPrice(service.price)}
                        </div>
                        <a
                          href={getWhatsAppBookingUrl(service)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-flex items-center space-x-1 text-[10px] tracking-wider uppercase font-bold text-stone-500 hover:text-[#25D366] transition-colors"
                          title="Book this service on WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3 text-[#25D366]" />
                          <span>Book</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Bottom Promo & Walk-in Info */}
          <div className="mt-12 bg-secondary p-8 text-center border border-gold/30">
            <div className="inline-flex items-center space-x-2 text-gold text-[10px] uppercase tracking-[0.3em] font-black mb-2 animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>Special Offer</span>
              <Sparkles className="w-3 h-3" />
            </div>
            <h4 className="text-white text-xl font-serif italic mb-3">
              First Time at Beauty Haven?
            </h4>
            <p className="text-white/70 text-xs tracking-widest uppercase mb-6 max-w-lg mx-auto">
              Enjoy 10% OFF any service on your first visit. Walk-ins welcome daily or reserve via WhatsApp.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-[0.25em] text-gold/70 border-t border-gold/20 pt-6">
              <span>Bypass Kamakis opposite 1.7</span>
              <span>•</span>
              <span>1st Floor Shop 109</span>
              <span>•</span>
              <span>+254 796 709521</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
