import { motion } from "motion/react";
import { Phone, Instagram, Music2 as TikTok, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Lookbook", href: "#gallery" },
    { name: "Prices", href: "#prices" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gold lg:bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-secondary flex items-center justify-center border border-gold">
              <span className="text-gold font-serif text-lg font-bold">B</span>
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
                className="text-secondary hover:text-gold font-sans text-[10px] tracking-widest uppercase font-bold transition-colors"
              >
                {link.name}
              </a>
            ))}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/254796709521"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold text-secondary px-8 py-3 rounded-none font-sans text-[10px] tracking-widest font-bold uppercase shadow-lg shadow-gold/10"
            >
              Book Now
            </motion.a>
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
                onClick={() => setIsOpen(false)}
                className="block text-secondary hover:text-gold font-sans text-xs tracking-widest font-bold uppercase"
              >
                {link.name}
              </a>
            ))}
            <a
              href="https://wa.me/254796709521"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gold text-secondary py-4 rounded-none font-sans text-center font-bold text-xs tracking-widest uppercase"
            >
              Book Appointment
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
