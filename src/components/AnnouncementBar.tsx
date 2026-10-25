import { Sparkles, Camera, X } from "lucide-react";
import { useServices } from "../context/ServiceContext";

export default function AnnouncementBar() {
  const { discountRibbon, isLookbookOpen, toggleLookbook, lookbookItems } = useServices();

  const hasOffer = discountRibbon && discountRibbon.enabled;

  return (
    <div className="fixed top-0 left-0 right-0 h-9 bg-secondary text-white px-3 sm:px-6 overflow-hidden z-[60] flex items-center justify-between border-b border-gold/30 shadow-sm transition-all duration-300">
      {/* Left/Center Announcement Text */}
      <div className="flex-1 flex items-center justify-start min-w-0 pr-2">
        <div className="flex items-center space-x-2 truncate">
          <Sparkles className="w-3 h-3 text-gold animate-pulse shrink-0" />
          {hasOffer ? (
            <span className="text-[10px] sm:text-[11px] tracking-[0.14em] uppercase font-bold truncate">
              {discountRibbon.prefix ? `${discountRibbon.prefix} ` : ""}
              <span className="text-gold font-extrabold px-1">{discountRibbon.highlight}</span>
              {discountRibbon.suffix ? ` ${discountRibbon.suffix}` : ""}
            </span>
          ) : (
            <span className="text-[10px] sm:text-[11px] tracking-[0.14em] uppercase font-bold text-white/90 truncate">
              Beauty Haven 254 <span className="text-gold font-serif mx-1">•</span> Kamakis Bypass, Nairobi
            </span>
          )}
        </div>
      </div>

      {/* Right: Lookbook Ribbon Button */}
      <div className="shrink-0 flex items-center">
        <button
          onClick={toggleLookbook}
          className={`group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-[9.5px] sm:text-[10px] font-sans uppercase tracking-widest font-extrabold transition-all border shadow-sm cursor-pointer ${
            isLookbookOpen
              ? "bg-gold text-secondary border-gold hover:bg-white hover:text-secondary hover:border-white"
              : "bg-gold/15 text-gold border-gold/50 hover:bg-gold hover:text-secondary hover:border-gold"
          }`}
          title={isLookbookOpen ? "Hide Lookbook Section" : "Open Salon Lookbook & Hair Portfolio"}
        >
          {isLookbookOpen ? (
            <>
              <X className="w-3 h-3 text-secondary transition-transform group-hover:rotate-90" />
              <span>Hide Lookbook</span>
            </>
          ) : (
            <>
              <Camera className="w-3 h-3 text-gold group-hover:text-secondary transition-transform group-hover:scale-110" />
              <span>Lookbook</span>
              <span className="ml-0.5 text-[8.5px] px-1 py-0.2 bg-secondary/80 text-gold font-mono font-bold">
                {lookbookItems.length}
              </span>
            </>
          )}
        </button>
      </div>

      <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
    </div>
  );
}
