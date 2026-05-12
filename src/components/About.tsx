import { motion } from "motion/react";

export default function About() {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <h3 className="text-[10px] tracking-[0.4em] uppercase text-gold font-bold mb-4">The Haven</h3>
            <h2 className="text-4xl md:text-5xl lg:text-6xl serif italic mb-8">Crafting Your <br /><span className="text-gold">Soft Glam</span> Identity</h2>
            <div className="section-divider" />
            <p className="text-secondary/70 text-lg leading-relaxed font-sans mb-8">
              Located at the heart of Bypass Kamakis, Beauty Haven 254 is more than just a salon; it's a sanctuary for high-end artistry and self-care. Founded on the principle of "Soft Glam," we specialize in intricate braiding precision, 3D nail artistry, and professional makeup that enhances your natural elegance. Our team of expert stylists is dedicated to providing a boutique experience where every stitch, every stroke, and every tip is a masterpiece tailored to your unique style.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-2xl serif italic text-secondary">Precision</h4>
                <p className="text-xs text-secondary/50 uppercase tracking-widest mt-1">Every detail matters</p>
              </div>
              <div>
                <h4 className="text-2xl serif italic text-secondary">Luxury</h4>
                <p className="text-xs text-secondary/50 uppercase tracking-widest mt-1">Premium products only</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative"
          >
            <div className="border border-gold p-4 relative">
              <img 
                src="/salon-flyer-main.jpg" 
                alt="Beauty Haven 254 Interior" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gold/10 -z-10" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/5 -z-10" />
            </div>
            
            {/* Geometric floating element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-gold/10 translate-x-4 translate-y-4 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
