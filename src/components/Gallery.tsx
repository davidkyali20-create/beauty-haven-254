import { motion } from "motion/react";

const items = [
  {
    url: "/braids-stitch-lines.jpg.jpeg",
    type: "image",
    title: "Signature Stitch Lines",
    span: "col-span-2 row-span-2",
  },
  {
    url: "/nails-stiletto-red.jpg.jpeg",
    type: "image",
    title: "Stiletto Artistry",
    span: "col-span-1 row-span-1",
  },
  {
    url: "/braiding-process.mp4.mp4",
    type: "video",
    title: "Braiding Precision",
    span: "col-span-1 row-span-1",
  },
  {
    url: "/nails-french-pink.jpg.jpeg",
    type: "image",
    title: "Luxury French Tips",
    span: "col-span-1 row-span-2",
  },
  {
    url: "/nails-marble-orange.jpg.jpeg",
    type: "image",
    title: "3D Nail Design",
    span: "col-span-1 row-span-1",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-white border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl italic serif">Lookbook</h2>
          <span className="text-[10px] tracking-[0.4em] uppercase text-gold font-bold">Signature Artistry</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-2 h-[600px] lg:h-[500px]">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden group border border-secondary/5 ${item.span}`}
            >
              {item.type === "video" ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-all duration-700"
                >
                  <source src={item.url} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-all duration-700 h-full"
                />
              )}
              <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[10px] tracking-widest uppercase text-white font-bold bg-gold/80 px-4 py-2">
                  {item.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
