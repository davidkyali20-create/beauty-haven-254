import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useServices } from "../context/ServiceContext";
import { cleanPrice, ServiceCategory } from "../constants";

interface ServiceDepartmentCard {
  title: string;
  subtitle: string;
  description: string;
  defaultPrice: string;
  categoryTag: ServiceCategory;
  image: string;
}

const serviceDepartments: ServiceDepartmentCard[] = [
  {
    title: "Makeup & Bridal Glam",
    subtitle: "In-House & House Calls",
    description: "Bridal packages, soft glam, full glam & radiant natural look makeup.",
    defaultPrice: "1,000",
    categoryTag: "Makeup",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80",
  },
  {
    title: "Luxury Nails & Extensions",
    subtitle: "Gel, Builder, Gum Gel & Acrylic",
    description: "Cat-eye magnet polish, tips deco, gum gel overlay, builder gel & sculpted acrylics.",
    defaultPrice: "500",
    categoryTag: "Nails",
    image: "/nail-art-works.jpg",
  },
  {
    title: "Hair Treatment Studio",
    subtitle: "L’Oréal, Mizani & Mikalla Packages",
    description: "Wash, mask & treatment therapies for natural, relaxed & texlaxed hair.",
    defaultPrice: "1,000",
    categoryTag: "Hair",
    image: "/assets/aistudio/haven_3b74a7d0.jpeg",
  },
  {
    title: "Lash Lounge",
    subtitle: "Cluster, Volume/Mega & Classic",
    description: "Custom mapping in Fox Eye, Cat Eye, Doll Eye, Wispy & Natural finishes.",
    defaultPrice: "1,000",
    categoryTag: "Lashes",
    image: "/lash-lounge-artistry.jpg",
  },
  {
    title: "Wig Studio",
    subtitle: "Installation & Laundry Revamp",
    description: "Flawless melt lace installation and deep cleansing wash & style wig laundry.",
    defaultPrice: "1,000",
    categoryTag: "Wigs",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80",
  },
];

export default function Services() {
  const { services, openBookingModal } = useServices();

  const getStartingPrice = (dept: ServiceDepartmentCard) => {
    const deptServices = services.filter((s) => s.category === dept.categoryTag);
    if (!deptServices.length) return `From ${dept.defaultPrice}`;

    let lowest = Infinity;
    let lowestStr = dept.defaultPrice;

    for (const s of deptServices) {
      const cleaned = cleanPrice(s.price || "");
      const matches = cleaned.match(/\d[\d,]*/g);
      if (matches) {
        for (const m of matches) {
          const num = parseInt(m.replace(/,/g, ""), 10);
          if (!isNaN(num) && num > 0 && num < lowest) {
            lowest = num;
            lowestStr = num.toLocaleString();
          }
        }
      }
    }

    return `From ${lowestStr}`;
  };

  return (
    <section id="services" className="pt-8 pb-10 sm:pt-10 sm:pb-12 bg-white border-y border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-10">
          <div>
            <div className="flex items-center space-x-2 text-gold text-xs uppercase tracking-[0.3em] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Boutique Sanctuary</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-serif italic text-secondary">
              Beauty Haven Services
            </h3>
            <div className="h-[1px] w-20 bg-gold mt-4" />
          </div>
          <p className="text-secondary/60 text-xs md:text-sm max-w-sm mt-4 md:mt-0 font-sans leading-relaxed">
            Five signature beauty departments offering bespoke care, high-end products, and meticulous Kenyan artistry.
          </p>
        </div>

        {/* 5-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {serviceDepartments.map((dept, index) => {
            const priceTag = getStartingPrice(dept);

            return (
              <motion.div
                key={dept.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group p-4 border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-gold hover:shadow-lg transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-[4/5] bg-stone-100 mb-5 overflow-hidden border border-secondary/5 relative">
                    <img
                      src={dept.image}
                      alt={dept.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-secondary/90 text-gold text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 border border-gold/30">
                      {priceTag}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-gold font-bold block mb-1">
                      {dept.subtitle}
                    </span>
                    <h4 className="text-lg font-serif italic text-secondary mb-2 group-hover:text-gold transition-colors">
                      {dept.title}
                    </h4>
                    <p className="text-xs text-secondary/65 leading-relaxed font-sans mb-4">
                      {dept.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <a
                    href="#prices"
                    className="text-secondary text-[10px] font-bold font-sans uppercase tracking-[0.2em] hover:text-gold transition-colors flex items-center gap-1"
                  >
                    View Rates <ArrowRight className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => openBookingModal(dept.categoryTag)}
                    className="text-gold text-[10px] font-bold uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Book →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
