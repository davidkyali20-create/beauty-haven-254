import { motion } from "motion/react";
import { useServices } from "../context/ServiceContext";

export default function Hero() {
  const { discountRibbon, openLookbook, openBookingModal } = useServices();

  return (
    <section id="home" className="pt-24 sm:pt-28 pb-6 px-3 sm:px-6 lg:px-8 bg-stone-100/50">
      {/* Centered, Contained Luxury Hero Box - Reduced Size, Height & Width */}
      <div className="max-w-6xl mx-auto border border-gold/40 shadow-2xl overflow-hidden flex flex-col lg:flex-row bg-secondary lg:h-[480px]">
        
        {/* LEFT SECTION - Brand, Typography & Booking CTA */}
        <aside className="w-full lg:w-[46%] flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-secondary text-white relative border-b lg:border-b-0 lg:border-r border-gold/40">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative z-10 my-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 text-white">
                  BEAUTY HAVEN
                </h1>
                <p className="text-gold tracking-[0.25em] uppercase text-[10px] font-semibold">
                  Salon & Spa 254
                </p>
              </div>

              <div className="w-12 h-0.5 bg-gold my-3" />

              {discountRibbon?.enabled && discountRibbon?.showHeroBadge && discountRibbon?.heroBadge && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block bg-gold py-1 px-3 mb-3 shadow-md"
                >
                  <p className="text-[9px] text-secondary font-bold uppercase tracking-widest">
                    {discountRibbon.heroBadge}
                  </p>
                </motion.div>
              )}

              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif italic leading-tight mb-3">
                The Art of<br />
                <span className="text-gold">Soft Glam</span>
              </h2>

              <p className="text-xs sm:text-sm text-white/70 max-w-[340px] leading-relaxed mb-5">
                Premium soft glam makeup, braiding precision &amp; luxury nail artistry located at Bypass Kamakis.
              </p>

              {/* Conversion Optimized Action CTAs */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openBookingModal()}
                  className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gold text-secondary font-bold text-xs tracking-widest uppercase shadow-lg hover:bg-white transition-colors cursor-pointer"
                >
                  Book Appointment
                </motion.button>
                <a
                  href="#prices"
                  className="inline-flex items-center px-4 py-2.5 sm:py-3 bg-white/10 hover:bg-gold hover:text-secondary text-white border border-gold/50 font-sans text-xs tracking-wider uppercase font-bold transition-colors cursor-pointer"
                >
                  <span>View Rates</span>
                </a>
                <a
                  href="https://wa.me/254796709521?text=Hello%20Beauty%20Haven%20254%2C%20I%20would%20like%20to%20inquire%20about%20booking%20an%20appointment!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 sm:py-3 border border-emerald-500/60 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-600 hover:text-white font-sans text-xs tracking-wider uppercase font-bold transition-colors cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Trust & Conversion Signals */}
              <div className="flex items-center gap-3 text-[10px] text-white/60 font-sans">
                <span className="inline-flex items-center gap-1">
                  <span className="text-gold">★ 4.9/5</span> Rating
                </span>
                <span>•</span>
                <span>Walk-Ins &amp; Appointments</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Open 8AM - 9PM</span>
              </div>
            </motion.div>
          </div>

          {/* Clean Location snippet safely placed in natural document flow */}
          <div className="relative z-10 mt-5 pt-3 border-t border-gold/30 text-[9px] sm:text-[10px] tracking-wider uppercase text-white/50 flex flex-col gap-0.5 font-sans">
            <p className="text-white/80 font-bold">Bypass Kamakis, 1st Floor Shop 109 (Opposite 1.7)</p>
            <p>Hotline: +254 796 709521 • Mon-Sat 8AM-9PM</p>
          </div>
        </aside>

        {/* RIGHT SECTION - Scaled Signature Visual Showcase */}
        <main className="w-full lg:w-[54%] relative h-[280px] sm:h-[340px] lg:h-full overflow-hidden bg-stone-950 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src="/assets/aistudio/haven_3b74a7d0.jpeg"
              alt="Beauty Haven 254 Hair Treatment"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-black/10" />
          </motion.div>

          {/* Inset Decorative Frame */}
          <div className="absolute inset-3 sm:inset-4 border border-gold/30 pointer-events-none" />

          {/* Live Studio Tag */}
          <div
            onClick={openLookbook}
            role="button"
            tabIndex={0}
            title="Click to view all live client styles in Lookbook"
            className="absolute bottom-4 right-4 z-10 bg-secondary/90 backdrop-blur-md border border-gold/40 px-3.5 py-2 shadow-xl flex items-center gap-2.5 cursor-pointer hover:border-gold hover:bg-secondary transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse group-hover:scale-125 transition-transform shrink-0" />
            <div>
              <p className="text-[9px] tracking-[0.2em] text-gold uppercase font-semibold group-hover:underline leading-tight">
                Studio In Session
              </p>
              <p className="text-[10px] text-white/90 font-serif italic leading-tight">
                Bypass Kamakis • 1st Floor Shop 109
              </p>
            </div>
          </div>
        </main>

      </div>
    </section>
  );
}
