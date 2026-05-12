import { motion } from "motion/react";

const services = [
  {
    title: "Nail Bar",
    category: "Acrylic Artistry",
    image: "/nail-art-works.jpg",
  },
  {
    title: "Hair Studio",
    category: "Knotless Braids",
    image: "/braids-stitch-lines.jpg",
  },
  {
    title: "Glam Station",
    category: "Pro Makeup",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white border-y border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="mb-6 md:mb-0">
            <h3 className="text-3xl md:text-4xl text-secondary mb-2">Our Services</h3>
            <div className="h-[1px] w-16 bg-gold" />
          </div>
          <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-bold">Precision & Care</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-4 border border-primary bg-primary/10 hover:bg-white hover:border-gold transition-all duration-500"
            >
              <div className="w-full aspect-[4/5] bg-gray-100 mb-6 overflow-hidden border border-secondary/5">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-center">
                <h4 className="text-xl text-secondary mb-1">{service.title}</h4>
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">
                  {service.category}
                </p>
                <a
                  href={`https://wa.me/254796709521?text=${encodeURIComponent(`Hello Beauty Haven 254, I'm interested in your ${service.title} services.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gold text-[10px] font-bold font-sans uppercase tracking-[0.3em] mt-4 hover:translate-x-2 transition-transform"
                >
                  Book Now →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
