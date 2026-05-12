import { motion } from "motion/react";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden pt-20 lg:pt-0">
      {/* LEFT SECTION (40%) - Desktop Sidebar Feel */}
      <aside className="w-full lg:w-[40%] flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-secondary text-white relative border-b lg:border-b-0 lg:border-r border-gold">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-braids.mp4.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">BEAUTY HAVEN</h1>
              <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold">Salon & Spa 254</p>
            </div>
            
            <div className="section-divider" />
            
            <h2 className="text-5xl md:text-6xl font-serif italic leading-tight mb-8">
              The Art of<br />
              <span className="text-gold">Soft Glam</span>
            </h2>
            
            <p className="text-sm md:text-base text-white/70 max-w-[320px] leading-relaxed mb-10">
              Premium braiding precision and luxury nail artistry located at the heart of Bypass Kamakis.
            </p>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/254796709521?text=Hello%20Beauty%20Haven%20254%2C%20I'd%20like%20to%20book%20an%20appointment."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-10 py-4 bg-gold text-secondary font-bold text-xs tracking-widest uppercase rounded-sm shadow-xl hover:bg-white transition-colors"
            >
              Book Your Appointment
            </motion.a>
          </motion.div>
        </div>

        <div className="hidden lg:block absolute bottom-12 left-16 z-10 text-[10px] tracking-widest uppercase opacity-50 border-t border-gold/40 pt-6 w-[280px]">
          <p className="mb-2">Bypass Kamakis, 1st Floor Shop 109</p>
          <p className="mb-2">Opposite 1.7 / +254 796 709521</p>
          <p>IG: @Beautyhaven254</p>
        </div>
      </aside>

      {/* RIGHT SECTION (60%) - Large Visual */}
      <main className="w-full lg:w-[60%] relative h-[400px] lg:h-auto overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="/salon-flyer-main.jpg.jpeg" 
            alt="Soft Glam Beauty"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-secondary/10" />
        </motion.div>
        
        {/* Floating Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-white/20 pointer-events-none hidden lg:block" />
      </main>
    </section>
  );
}
