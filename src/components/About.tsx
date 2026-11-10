import { motion } from "motion/react";

export default function About() {
  return (
    <section id="about" className="pt-10 pb-8 sm:pt-14 sm:pb-10 bg-white overflow-hidden border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-gold font-bold mb-3">The Haven</h3>
            <h2 className="text-4xl md:text-5xl lg:text-6xl serif italic mb-6">Crafting Your <br /><span className="text-gold">Soft Glam</span> Identity</h2>
            <div className="section-divider mb-6" />
            <p className="text-secondary/70 text-base md:text-lg leading-relaxed font-sans mb-6">
              Located at the heart of Bypass Kamakis, Beauty Haven 254 is more than just a salon; it's a sanctuary for high-end artistry and self-care. Founded on the principle of "Soft Glam," we specialize in intricate braiding precision, 3D nail artistry, and professional makeup that enhances your natural elegance. Our team of expert stylists is dedicated to providing a boutique experience where every stitch, every stroke, and every tip is a masterpiece tailored to your unique style.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pt-2 border-t border-stone-200">
              <div className="bg-stone-50 p-3 border border-stone-200/80">
                <h4 className="text-xl serif italic text-gold font-bold">500+</h4>
                <p className="text-[10px] text-secondary/60 uppercase tracking-widest mt-0.5">Happy Clients</p>
              </div>
              <div className="bg-stone-50 p-3 border border-stone-200/80">
                <h4 className="text-xl serif italic text-gold font-bold">4.9★</h4>
                <p className="text-[10px] text-secondary/60 uppercase tracking-widest mt-0.5">Client Rating</p>
              </div>
              <div className="bg-stone-50 p-3 border border-stone-200/80">
                <h4 className="text-xl serif italic text-gold font-bold">100%</h4>
                <p className="text-[10px] text-secondary/60 uppercase tracking-widest mt-0.5">Premium Products</p>
              </div>
              <div className="bg-stone-50 p-3 border border-stone-200/80">
                <h4 className="text-xl serif italic text-gold font-bold">VIP</h4>
                <p className="text-[10px] text-secondary/60 uppercase tracking-widest mt-0.5">Private Sanctuary</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#services"
                className="inline-flex items-center px-6 py-2.5 bg-secondary text-gold hover:bg-gold hover:text-secondary text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer shadow-sm"
              >
                Explore Services
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=-1.17112,36.97154&destination_place_id=Beauty+Haven+254+Kamakis+Ruiru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-2.5 border border-stone-300 text-secondary hover:border-gold hover:text-gold text-xs uppercase tracking-wider font-bold transition-colors"
              >
                Find Us on Map
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative"
          >
            {/* Main Editorial Image Frame */}
            <div className="border border-gold p-4 relative bg-stone-50 shadow-2xl">
              <div className="relative overflow-hidden aspect-[4/5] max-h-[500px]">
                <img 
                  src="/beauty-haven-salon-interior.jpg" 
                  alt="Beauty Haven 254 Boutique Sanctuary" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-bold mb-1">Boutique Sanctuary</p>
                  <p className="text-xl serif italic">Luxury Salon & Spa at Bypass Kamakis</p>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gold/10 -z-10" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/5 -z-10" />
            </div>
            
            {/* Geometric floating accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-gold/10 translate-x-4 translate-y-4 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
