export type ServiceCategory = "Makeup" | "Nails" | "Hair" | "Lashes" | "Wigs";

export interface Service {
  name: string;
  price: string;
  category: ServiceCategory;
  description?: string;
  subType?: string;
  shape?: string;
  tag?: string;
  isPopular?: boolean;
}

/**
 * Strips any unwanted trailing or embedded "/=" from prices entered by users or stored in data.
 * e.g. "1,500/=" -> "1,500", "500/= - 700/=" -> "500 - 700", "2,000" -> "2,000"
 */
export function cleanPrice(price: string): string {
  if (!price) return "";
  return price
    .replace(/\/=/g, "")
    .replace(/\/+$/, "")
    .replace(/\s*-\s*/g, " - ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export const CATEGORIES: { id: "All" | ServiceCategory; label: string; count?: number }[] = [
  { id: "All", label: "All Services" },
  { id: "Makeup", label: "Makeup" },
  { id: "Nails", label: "Nails" },
  { id: "Hair", label: "Hair & Treatments" },
  { id: "Lashes", label: "Lashes" },
  { id: "Wigs", label: "Wigs" },
];

export const SERVICES_DATA: Service[] = [
  // ==============================
  // MAKEUP
  // ==============================
  {
    name: "Bridal – In House",
    price: "5,000",
    category: "Makeup",
    subType: "Bridal",
    description: "In-house luxury bridal glam session with long-wear setting and precision sculpting",
    isPopular: true,
  },
  {
    name: "Bridal – House Call",
    price: "7,000",
    category: "Makeup",
    subType: "Bridal",
    description: "On-location house call bridal glam service at your home or wedding venue",
    isPopular: true,
  },
  {
    name: "Soft Glam",
    price: "1,500",
    category: "Makeup",
    description: "Luminous skin finish, soft neutral eyes, subtle flutter lashes & polished nude lips",
    isPopular: true,
  },
  {
    name: "Full Glam",
    price: "2,000",
    category: "Makeup",
    description: "Dramatic sculpted contours, bold eye artistry, cut crease & statement lips",
    isPopular: true,
  },
  {
    name: "Natural Look",
    price: "1,000",
    category: "Makeup",
    description: "Fresh, lightweight 'no-makeup' makeup glow highlighting your natural beauty",
  },

  // ==============================
  // NAILS
  // ==============================
  {
    name: "Gel",
    price: "500 - 700",
    category: "Nails",
    description: "High-shine, chip-resistant gel polish cured with professional UV/LED light",
    isPopular: true,
  },
  {
    name: "Magnet",
    price: "800",
    category: "Nails",
    description: "Magnetic velvet cat-eye polish creating dynamic multidimensional light reflection",
    isPopular: true,
  },
  {
    name: "Tips Gel Plain",
    price: "1,500",
    category: "Nails",
    description: "Full tip extensions finished with smooth single-tone professional gel polish",
  },
  {
    name: "Tips Gel Deco",
    price: "2,000",
    category: "Nails",
    description: "Tip extensions paired with custom hand-painted nail art, french tips, or chrome decor",
    isPopular: true,
  },
  {
    name: "Tips Builder",
    price: "2,000",
    category: "Nails",
    description: "Extensions reinforced with heavy-duty builder gel for extra durability & strength",
  },
  {
    name: "Gum Gel Overlay",
    price: "2,000",
    category: "Nails",
    description: "Polygel overlay directly on natural nails for flawless reinforcement and natural curve",
  },
  {
    name: "Builder",
    price: "1,500",
    category: "Nails",
    description: "Strengthening apex builder layer protecting natural nails and encouraging healthy growth",
  },
  {
    name: "Gum Gel Extension",
    price: "2,000",
    category: "Nails",
    description: "Full sculpted gum gel (polygel) extensions engineered for lightweight, break-proof wear",
  },
  {
    name: "Tips Extension",
    price: "2,500 - 3,000",
    category: "Nails",
    description: "Premium length tip extensions shaped to perfection (coffin, stiletto, almond or square)",
  },
  {
    name: "Acrylic Overall",
    price: "2,500",
    category: "Nails",
    description: "Full acrylic overlay applied over natural nails for unmatched toughness and durability",
  },
  {
    name: "Acrylic Extension",
    price: "3,000",
    category: "Nails",
    description: "Signature full set acrylic sculpted extensions with pristine apex architecture",
    isPopular: true,
  },
  {
    name: "Tips + Magnet",
    price: "1,800",
    category: "Nails",
    description: "Full tip extensions coupled with hypnotic magnetic cat-eye shimmer finish",
    isPopular: true,
  },
  {
    name: "Soak Off",
    price: "200",
    category: "Nails",
    description: "Gentle damage-free gel or extension removal with cuticle hydration",
  },
  {
    name: "Cut & File",
    price: "300",
    category: "Nails",
    description: "Quick nail trimming, edge filing, buffing and tidy-up",
  },

  // ==============================
  // HAIR
  // ==============================
  {
    name: "L’Oréal Products Service Package",
    price: "5,000",
    category: "Hair",
    tag: "L’Oréal Package",
    description: "Wash, Mask, Treatment for natural hair, relaxed & texlaxed hair using authentic L’Oréal products",
    isPopular: true,
  },
  {
    name: "Mizani Service Package",
    price: "6,000",
    category: "Hair",
    tag: "Mizani Package",
    description: "Wash, Mask, Treatment for relaxed, texlaxed hair & natural hair with premium Mizani moisture care",
    isPopular: true,
  },
  {
    name: "Auntie Jackie – Leave-in Treatment",
    price: "1,500",
    category: "Hair",
    tag: "Auntie Jackie",
    description: "Deep leave-in moisture infusion, curl detangling & intensive hydration therapy",
  },
  {
    name: "Black Like Me",
    price: "1,000",
    category: "Hair",
    tag: "Hair Treatment",
    description: "Classic revitalizing scalp conditioning & strengthening hair treatment",
  },
  {
    name: "Mikalla Service Package",
    price: "3,000",
    category: "Hair",
    tag: "Mikalla Package",
    description: "Wash, Mask, Treatment on relaxed, natural & texlaxed hair with Mikalla nutrient complex",
    isPopular: true,
  },

  // ==============================
  // LASHES
  // ==============================
  {
    name: "Cluster – Fox Eye",
    price: "1,500",
    category: "Lashes",
    subType: "Cluster",
    shape: "Fox Eye",
    description: "Cluster lashes with elongated outer corners for an alluring, lifted almond eye effect",
    isPopular: true,
  },
  {
    name: "Cluster – Cat Eye",
    price: "1,500",
    category: "Lashes",
    subType: "Cluster",
    shape: "Cat eye",
    description: "Classic flirty taper that flares out toward the outer edge of the eye",
  },
  {
    name: "Cluster – Doll Eye",
    price: "1,500",
    category: "Lashes",
    subType: "Cluster",
    shape: "Doll eye",
    description: "Longest clusters concentrated in the center to create a wide, open-eyed look",
  },
  {
    name: "Cluster – Wispy",
    price: "1,500",
    category: "Lashes",
    subType: "Cluster",
    shape: "Wispy",
    description: "Multi-length fluttery clusters creating airy, multidimensional texture",
    isPopular: true,
  },
  {
    name: "Cluster – Natural",
    price: "1,000",
    category: "Lashes",
    subType: "Cluster",
    shape: "Natural",
    description: "Soft, lightweight cluster set designed to seamlessly blend with natural lashes",
  },
  {
    name: "Volume / Mega – Hybrid",
    price: "1,500",
    category: "Lashes",
    subType: "Volume / Mega",
    shape: "Hybrid",
    description: "Ultra-dense volume fans blended with textured hybrid spikes for a show-stopping look",
    isPopular: true,
  },
  {
    name: "Classic – Fox Eye",
    price: "2,000",
    category: "Lashes",
    subType: "Classic",
    shape: "Fox eye",
    description: "1:1 individual single lash extensions sculpted into a sleek fox eye sweep",
    isPopular: true,
  },
  {
    name: "Classic – Hybrid",
    price: "1,500",
    category: "Lashes",
    subType: "Classic",
    shape: "Hybrid",
    description: "Individual lash application combined with delicate volume fans for ideal density",
  },

  // ==============================
  // WIGS
  // ==============================
  {
    name: "Wig Installation",
    price: "1,500 - 2,000",
    category: "Wigs",
    description: "Lace customization, knot bleaching, hairline plucking & flawless melt installation",
    isPopular: true,
  },
  {
    name: "Wig Laundry (Wash & Style)",
    price: "1,000",
    category: "Wigs",
    description: "Deep cleansing detox wash, protein/moisture revival, revamping & hot tool styling",
    isPopular: true,
  },
];
