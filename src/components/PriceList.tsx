import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, ArrowRight } from "lucide-react";
import { SERVICES_DATA } from "../constants";

export default function PriceList() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Manicure", "Pedicure", "Hair", "Glam"];

  const filteredServices = SERVICES_DATA.filter((service) => {
    return activeCategory === "All" || service.category === activeCategory;
  });

  return (
    <section id="prices" className="py-24 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Content */}
          <div className="lg:w-1/3">
            <h3 className="text-4xl serif italic mb-6">Price List</h3>
            <div className="section-divider" />
            <p className="text-sm text-secondary/60 leading-relaxed mb-8">
              Every service is a commitment to excellence. We use premium products to ensure your soft glam lasts.
            </p>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`block w-full text-left py-3 px-4 text-xs tracking-widest uppercase font-bold transition-all ${
                    activeCategory === cat ? "bg-secondary text-gold border-l-4 border-gold" : "hover:text-gold"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gold/20">
              <a 
                href="/price-list-flyer.jpg" 
                target="_blank" 
                className="text-[10px] tracking-widest uppercase font-bold text-gold hover:text-secondary transition-colors inline-block"
              >
                View Full Rate Card →
              </a>
            </div>
          </div>

          {/* Right Price Grid */}
          <div className="lg:w-2/3 bg-white p-8 md:p-12 border border-gold/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={`${service.category}-${service.name}`}
                    className="flex justify-between items-end border-b border-secondary/10 pb-2 group"
                  >
                    <span className="text-sm font-medium text-secondary group-hover:text-gold transition-colors">{service.name}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-secondary">{service.price}/-</span>
                      <a 
                        href={`https://wa.me/254796709521?text=${encodeURIComponent(`Hello Beauty Haven 254, I would like to book an appointment for ${service.name}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 bg-gold text-secondary p-1.5 rounded-sm hover:bg-secondary hover:text-gold transition-all"
                        title="Book Now"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="mt-12 bg-secondary p-6 text-white text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Walk-ins Welcome Daily at Bypass Kamakis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
