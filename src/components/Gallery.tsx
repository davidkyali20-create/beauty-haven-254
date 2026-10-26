import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Camera,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Maximize2,
  SlidersHorizontal,
  PlusCircle,
} from "lucide-react";
import { useServices, LookbookItem } from "../context/ServiceContext";

export default function Gallery() {
  const {
    lookbookItems,
    isLookbookOpen,
    closeLookbook,
    isAdminAuthenticated,
    setIsAdminOpen,
    openBookingModal,
  } = useServices();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  // Derive distinct categories from existing items
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    lookbookItems.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [lookbookItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return lookbookItems;
    return lookbookItems.filter(
      (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [lookbookItems, activeCategory]);

  const activeItem =
    selectedItemIndex !== null && filteredItems[selectedItemIndex]
      ? filteredItems[selectedItemIndex]
      : null;

  const handleNext = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex((selectedItemIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (selectedItemIndex === null) return;
    setSelectedItemIndex(
      (selectedItemIndex - 1 + filteredItems.length) % filteredItems.length
    );
  };

  // If lookbook is closed, don't show it on page
  if (!isLookbookOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.section
        id="gallery"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="py-10 sm:py-14 bg-stone-950 text-white border-y border-gold/30 relative overflow-hidden"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Bar with Title, Status & Close Button */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gold font-bold">
                  <Camera className="w-3.5 h-3.5 text-gold" />
                  Live Portfolio
                </span>
                <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 border border-gold/30 font-mono font-bold">
                  {lookbookItems.length} styles
                </span>
                {isAdminAuthenticated && (
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 hover:bg-amber-500 hover:text-black transition-colors"
                  >
                    <PlusCircle className="w-3 h-3" />
                    Manage Lookbook
                  </button>
                )}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl italic font-serif text-white tracking-tight">
                Salon Lookbook
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-2 max-w-xl font-sans">
                Explore our signature braiding, precision nail art, hair transformations, and soft glam artistry. Click any photo to inspect details or book the exact look.
              </p>
            </div>

            {/* Action buttons on right: Category filter hint & Close */}
            <div className="flex items-center gap-3 self-start md:self-end">
              <button
                onClick={closeLookbook}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-gold hover:text-secondary border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-sm group"
                title="Hide Lookbook section from page"
              >
                <X className="w-4 h-4 text-gold group-hover:text-secondary transition-transform group-hover:rotate-90" />
                <span>Hide Lookbook</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gold shrink-0 mr-1 hidden sm:block" />
            {categories.map((cat) => {
              const count =
                cat === "All"
                  ? lookbookItems.length
                  : lookbookItems.filter(
                      (i) => i.category?.toLowerCase() === cat.toLowerCase()
                    ).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all border shrink-0 ${
                    activeCategory === cat
                      ? "bg-gold text-secondary border-gold shadow-md font-extrabold"
                      : "bg-white/5 text-white/70 border-white/10 hover:border-gold/40 hover:text-white"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Lookbook Media Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 border border-white/10 bg-white/5">
              <Camera className="w-10 h-10 text-gold/40 mx-auto mb-3" />
              <p className="text-white/70 text-sm font-serif italic mb-2">
                No styles found in "{activeCategory}" category.
              </p>
              <button
                onClick={() => setActiveCategory("All")}
                className="mt-3 px-4 py-2 bg-gold text-secondary text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors"
              >
                View All Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredItems.map((item, index) => {
                const isVideo =
                  item.type === "video" ||
                  item.url.endsWith(".mp4") ||
                  item.url.endsWith(".webm");

                return (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedItemIndex(index)}
                    className="relative aspect-square w-full overflow-hidden group border border-white/10 bg-stone-900 cursor-pointer shadow-lg hover:border-gold transition-all duration-300"
                  >
                    {isVideo ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      >
                        <source src={item.url} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    {/* Gradient Overlay & Details */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex flex-col justify-between p-3 sm:p-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold bg-gold/90 text-stone-950 px-2 py-0.5 shadow-sm">
                          {item.category}
                        </span>
                        <span className="w-6 h-6 rounded-full bg-black/60 text-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-3 h-3 text-gold" />
                        </span>
                      </div>

                      {/* Bottom Info */}
                      <div>
                        <h4 className="text-xs sm:text-sm font-serif font-bold text-white group-hover:text-gold transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-[10px] text-white/70 line-clamp-1 mt-0.5 font-sans">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom Bar: Inquire / Book CTA */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-6 border border-gold/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/10 border border-gold flex items-center justify-center text-gold shrink-0">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="text-base font-serif font-bold text-white">
                  Inspired by our Lookbook styles?
                </h4>
                <p className="text-xs text-white/60 font-sans">
                  Send us your preferred screenshot or style photo on WhatsApp for instant booking and consultation.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="inline-flex items-center gap-2 bg-gold hover:bg-white text-secondary font-bold text-xs uppercase tracking-widest px-6 py-3 transition-colors shrink-0 shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book an Appointment</span>
            </button>
          </div>
        </div>

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
              onClick={() => setSelectedItemIndex(null)}
            >
              <div
                className="relative max-w-4xl w-full bg-stone-950 border border-gold/40 shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Media Preview Box */}
                <div className="relative md:w-3/5 bg-black flex items-center justify-center min-h-[300px] max-h-[55vh] md:max-h-[80vh] overflow-hidden">
                  {activeItem.type === "video" ||
                  activeItem.url.endsWith(".mp4") ||
                  activeItem.url.endsWith(".webm") ? (
                    <video
                      autoPlay
                      loop
                      controls
                      playsInline
                      className="w-full h-full object-contain max-h-[75vh]"
                    >
                      <source src={activeItem.url} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={activeItem.url}
                      alt={activeItem.title}
                      className="w-full h-full object-contain max-h-[75vh]"
                    />
                  )}

                  {/* Nav Arrows */}
                  {filteredItems.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/70 hover:bg-gold hover:text-stone-950 text-white flex items-center justify-center border border-white/20 transition-colors shadow-md"
                        title="Previous photo"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/70 hover:bg-gold hover:text-stone-950 text-white flex items-center justify-center border border-white/20 transition-colors shadow-md"
                        title="Next photo"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Right Details Panel */}
                <div className="md:w-2/5 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 bg-stone-900">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-[10px] uppercase tracking-widest font-bold bg-gold/20 text-gold px-2.5 py-1 border border-gold/40">
                        {activeItem.category}
                      </span>
                      <button
                        onClick={() => setSelectedItemIndex(null)}
                        className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-gold hover:bg-white/10 transition-colors"
                        title="Close preview"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                      {activeItem.title}
                    </h3>

                    {activeItem.description ? (
                      <p className="text-xs text-white/70 font-sans leading-relaxed mb-6">
                        {activeItem.description}
                      </p>
                    ) : (
                      <p className="text-xs text-white/50 font-sans italic mb-6">
                        Signature craftsmanship by Beauty Haven 254 stylists.
                      </p>
                    )}

                    <div className="space-y-2 text-xs text-white/60 border-t border-white/10 pt-4 font-mono">
                      <div className="flex justify-between">
                        <span>Salon Location:</span>
                        <span className="text-white">Kamakis Bypass</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Availability:</span>
                        <span className="text-emerald-400">Walk-ins & Booking</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA Button */}
                  <div className="mt-8 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        const title = activeItem.title;
                        setSelectedItemIndex(null);
                        openBookingModal(title);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-white text-secondary font-bold text-xs uppercase tracking-widest py-3.5 transition-colors shadow-lg cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Book This Exact Look</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </AnimatePresence>
  );
}
