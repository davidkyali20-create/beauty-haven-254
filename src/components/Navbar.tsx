import { motion } from "motion/react";
import { Phone, Instagram, Music2 as TikTok, MapPin, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { useServices } from "../context/ServiceContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { handleLogoClick, openLookbook, discountRibbon, openBookingModal } = useServices();
  const isRibbonVisible = Boolean(discountRibbon && discountRibbon.enabled);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Lookbook", href: "#gallery" },
    { name: "Prices", href: "#prices" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavLinkClick = (name: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (name === "Lookbook") {
      openLookbook();
    }
  };

  return (
    <nav className={`fixed left-0 right-0 z-50 bg-white border-b border-gold lg:bg-white/95 transition-all duration-300 ${isRibbonVisible ? "top-9" : "top-0"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLogoClick}
            className="flex items-center space-x-3 cursor-pointer select-none group"
            title="Beauty Haven 254"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border border-gold/70 transition-transform group-active:scale-95 shadow-md shrink-0 bg-stone-950 flex items-center justify-center">
              <img
                src="/beauty-haven-logo.jpg"
                alt="Beauty Haven 254 Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-secondary font-serif text-base font-bold leading-none tracking-tight">BEAUTY HAVEN 254</span>
              <span className="text-gold font-sans text-[8px] tracking-[0.3em] uppercase font-bold">Salon & Spa</span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavLinkClick(link.name, e)}
                className="text-secondary hover:text-gold font-sans text-[10px] tracking-widest uppercase font-bold transition-colors"
              >
                {link.name}
              </a>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openBookingModal()}
              className="bg-gold hover:bg-secondary hover:text-gold border border-gold text-secondary px-8 py-3 rounded-none font-sans text-[10px] tracking-widest font-bold uppercase shadow-lg shadow-gold/10 transition-colors cursor-pointer"
            >
              Book Now
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-secondary p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gold"
        >
          <div className="px-4 py-8 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setIsOpen(false);
                  handleNavLinkClick(link.name, e);
                }}
                className="block text-secondary hover:text-gold font-sans text-xs tracking-widest font-bold uppercase"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                openBookingModal();
              }}
              className="w-full bg-gold text-secondary py-4 rounded-none font-sans text-center font-bold text-xs tracking-widest uppercase cursor-pointer block"
            >
              Book Appointment
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
