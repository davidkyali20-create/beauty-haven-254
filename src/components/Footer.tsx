import { motion } from "motion/react";
import { Instagram, Music2 as TikTok, MapPin, Mail, Phone, Clock } from "lucide-react";
import { useServices } from "../context/ServiceContext";

export default function Footer() {
  const { handleLogoClick } = useServices();
  return (
    <footer id="contact" className="bg-secondary text-white pt-24 pb-12 overflow-hidden border-t-4 border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="text-4xl md:text-5xl mb-8 serif italic">Visit the <br /><span className="text-gold">Haven</span></h2>
            <div className="section-divider" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase text-gold font-bold mb-3">Location</h4>
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=-1.17112,36.97154&destination_place_id=Beauty+Haven+254+Kamakis+Ruiru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-gold text-sm font-sans leading-relaxed block transition-colors text-balance"
                  >
                    Ruiru, Eastern Bypass Kamakis,<br />
                    1st Floor Shop 109 <span className="text-gold font-bold">(Opposite 1.7)</span>, Kenya
                  </a>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase text-gold font-bold mb-2">Social</h4>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.instagram.com/beautyhaven254.salon?vrfl=MXZvMXo5aWgyeTQzcg=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-gold transition-colors"
                      title="Follow on Instagram (@beautyhaven254.salon)"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@havenbeauty254?_r=1&_t=ZS-9Au5QCNbvQF"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-gold transition-colors"
                      title="Follow on TikTok (@havenbeauty254)"
                      aria-label="TikTok"
                    >
                      <TikTok className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase text-gold font-bold mb-2">Connect</h4>
                  <a
                    href="tel:+254796709521"
                    className="text-white/80 hover:text-gold text-sm font-sans block transition-colors font-medium"
                  >
                    +254 796 709521
                  </a>
                  <a
                    href="mailto:essyndungu94@gmail.com"
                    className="text-white/60 hover:text-gold text-sm font-sans block transition-colors"
                  >
                    essyndungu94@gmail.com
                  </a>
                  <a
                    href="https://wa.me/254796709521?text=Hello%20Beauty%20Haven%20254%2C%20I%20would%20like%20to%20book%20an%20appointment!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-400 hover:text-emerald-300 mt-2 transition-colors"
                  >
                    <span>💬 WhatsApp Reception</span>
                  </a>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase text-gold font-bold mb-2">Salon Hours</h4>
                  <p className="text-white/70 text-[10px] font-sans">MON - FRI: 8:00 AM - 9:00 PM</p>
                  <p className="text-emerald-400/90 text-[10px] font-sans font-semibold">PUBLIC HOLIDAYS: OPEN (8AM - 9PM)</p>
                  <p className="text-amber-400/90 text-[10px] font-sans font-bold">SUNDAY: CLOSED</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full border border-gold/40 relative group overflow-hidden bg-stone-950">
            <div className="absolute inset-0 bg-gold/5 pointer-events-none z-10" />
            <iframe
              src="https://maps.google.com/maps?q=-1.17112,36.97154+(Beauty+Haven+254+Ruiru+Bypass+Kamakis)&t=&z=16&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Beauty Haven 254 Location Map, Ruiru Bypass Kamakis"
              className="w-full h-full contrast-125 brightness-95"
            ></iframe>
            
            {/* Landmark Tag Overlay */}
            <div className="absolute top-4 left-4 z-20 bg-secondary/95 backdrop-blur-md border border-gold/60 px-3.5 py-2 shadow-xl">
              <p className="text-[9px] uppercase tracking-widest text-gold font-bold">
                📍 Ruiru, Eastern Bypass
              </p>
              <p className="text-xs text-white font-medium">
                Kamakis, 1st Floor Shop 109 <span className="text-gold font-bold">(Opposite 1.7)</span>
              </p>
            </div>

            <div className="absolute bottom-6 right-6 z-20">
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=-1.17112,36.97154&destination_place_id=Beauty+Haven+254+Kamakis+Ruiru"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold text-secondary px-6 py-3 text-[10px] tracking-widest uppercase font-bold flex items-center gap-2 hover:bg-white transition-colors shadow-2xl"
              >
                <MapPin className="w-3.5 h-3.5" />
                Get Directions
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div 
              onClick={handleLogoClick}
              className="flex items-center space-x-3 cursor-pointer select-none group"
              title="Beauty Haven 254"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gold/70 transition-transform group-active:scale-95 shadow-sm shrink-0 bg-stone-950 flex items-center justify-center">
                <img
                  src="/beauty-haven-logo.jpg"
                  alt="Beauty Haven 254 Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] tracking-widest uppercase text-white/40 group-hover:text-white/80 transition-colors font-bold font-sans">
                Beauty Haven 254 © 2026 / Kenyan Excellence
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 font-bold font-sans">
              Designed by <a href="https://www.tiktok.com/@charlie_ceo5?_r=1&_t=ZS-96JE1s45aza" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-colors">Praxis Labs</a>
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 font-bold font-sans">
              Lead Engineering by Charlie CEO
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
