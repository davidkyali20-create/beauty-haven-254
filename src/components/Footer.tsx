import { motion } from "motion/react";
import { Instagram, Music2 as TikTok, MapPin, Mail, Phone, Clock } from "lucide-react";

export default function Footer() {
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
                    href="https://www.google.com/maps/dir/?api=1&destination=Beauty+Haven+254+Bypass+Kamakis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 text-sm font-sans leading-relaxed block hover:text-gold transition-colors text-balance"
                  >
                    Bypass Kamakis opposite 1.7,<br />
                    1st Floor Shop 109, Kenya
                  </a>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase text-gold font-bold mb-2">Social</h4>
                  <div className="flex space-x-4">
                    <a href="https://instagram.com/beautyhaven254" target="_blank" className="text-white/60 hover:text-gold transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://tiktok.com/@beautyhaven254" target="_blank" className="text-white/60 hover:text-gold transition-colors">
                      <TikTok className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase text-gold font-bold mb-2">Connect</h4>
                  <p className="text-white/60 text-sm font-sans">+254 796 709521</p>
                  <p className="text-white/60 text-sm font-sans">essyndungu94@gmail.com</p>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-widest uppercase text-gold font-bold mb-2">Hours</h4>
                  <p className="text-white/60 text-[10px] font-sans">MON - SAT: 8:00 AM - 8:00 PM</p>
                  <p className="text-white/60 text-[10px] font-sans">SUN: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full border border-gold/40 relative group">
            <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.51864197368!2d36.95!3d-1.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTAnNDguMCJTIDM2wrA1NycwMC4wIkU!5e0!3m2!1sen!2ske!4v1651234567890!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="contrast-125"
            ></iframe>
            <div className="absolute bottom-6 right-6">
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=Beauty+Haven+254+Bypass+Kamakis"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold text-secondary px-6 py-3 text-[10px] tracking-widest uppercase font-bold flex items-center gap-2 hover:bg-white transition-colors shadow-2xl"
              >
                <MapPin className="w-3 h-3" />
                Get Directions
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gold flex items-center justify-center">
              <span className="text-secondary font-bold text-xs">B</span>
            </div>
            <span className="text-[10px] tracking-widest uppercase text-white/30 font-bold font-sans">Beauty Haven 254 © 2026 / Kenyan Excellence</span>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 font-bold font-sans">
              Designed & Developed by
            </span>
            <div className="flex items-center gap-3">
              <a 
                href="https://www.tiktok.com/@charlie_ceo5?_r=1&_t=ZS-96JE1s45aza" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] tracking-widest uppercase text-white/40 hover:text-gold font-bold transition-colors"
              >
                Praxis Labs
              </a>
              <span className="w-1 h-1 bg-gold/30 rounded-full" />
              <a 
                href="https://wa.me/254758740590" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] tracking-widest uppercase text-white/40 hover:text-gold font-bold transition-colors"
              >
                Reach Out
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
