import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Service, SERVICES_DATA, cleanPrice } from "../constants";

const STORAGE_KEY = "beautyhaven_services_catalog_v1";
const PIN_STORAGE_KEY = "beautyhaven_admin_pin_v1";
const UNLOCKED_STORAGE_KEY = "beautyhaven_admin_unlocked";
const RIBBON_STORAGE_KEY = "beautyhaven_discount_ribbon_v2";
const DEFAULT_PIN = "2540";

export interface DiscountRibbonConfig {
  enabled: boolean;
  prefix: string;
  highlight: string;
  suffix: string;
  heroBadge: string;
  showHeroBadge: boolean;
}

export const DEFAULT_DISCOUNT_RIBBON: DiscountRibbonConfig = {
  enabled: false,
  prefix: "First time? Get",
  highlight: "10% OFF",
  suffix: "your first service",
  heroBadge: "10% OFF FIRST VISIT",
  showHeroBadge: true,
};

export interface LookbookItem {
  id: string;
  title: string;
  category: string;
  url: string;
  type?: "image" | "video";
  description?: string;
  span?: string;
  createdAt?: string;
}

export const DEFAULT_LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: "lb-hero-braids",
    url: "/hero-braids.mp4",
    type: "video",
    title: "Sleek High Ponytail Cornrows",
    category: "Braids",
    description: "Precision stitch parting with laid baby edges and high ponytail braid styling.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-1",
    url: "/braids-stitch-lines.jpg",
    type: "image",
    title: "Signature Stitch Lines",
    category: "Braids",
    description: "Artistic curved parting and designer knotless stitch cornrows.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-2",
    url: "/nails-stiletto-red.jpg",
    type: "image",
    title: "Stiletto Artistry",
    category: "Nails",
    description: "Deep scarlet stiletto acrylics with glossy gel topcoat.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-3",
    url: "/braiding-process.mp4",
    type: "video",
    title: "Braiding Precision",
    category: "Braids",
    description: "Painless tension-free braiding process.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-4",
    url: "/perfect-braids.mp4",
    type: "video",
    title: "The Perfect Stitch",
    category: "Braids",
    description: "Flawless feed-in stitch braids.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-5",
    url: "/nails-french-pink.jpg",
    type: "image",
    title: "Luxury French Tips",
    category: "Nails",
    description: "Timeless blush nude French tips with delicate line art.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-6",
    url: "/nails-marble-orange.jpg",
    type: "image",
    title: "3D Nail Design",
    category: "Nails",
    description: "Artisan marble swirling and 3D textured accents.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-7",
    url: "/clean-braids.mp4",
    type: "video",
    title: "Braid Perfection",
    category: "Braids",
    description: "Clean finish with long-lasting lightweight styling.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-8",
    url: "/nail-art-works.jpg",
    type: "image",
    title: "Nail Extensions & Gel",
    category: "Nails",
    description: "High durability builder gel and extension set.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-9",
    url: "/assets/aistudio/makeup_73b32279.jpeg",
    type: "image",
    title: "Soft Glam Bridal Makeup",
    category: "Makeup",
    description: "Luminous skin finish, subtle contour, and velvet nude lips.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-10",
    url: "/assets/aistudio/lash_35d54a98.jpeg",
    type: "image",
    title: "Beauty Haven 254 Lashes",
    category: "Lashes",
    description: "Natural look, long lasting, light & comfortable custom lash artistry.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-11",
    url: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=800&auto=format&fit=crop",
    type: "image",
    title: "Sisterlocks & Dreadlocks",
    category: "Hair",
    description: "Neat retwist, interlocking, and custom styling.",
    span: "col-span-1 row-span-1",
  },
  {
    id: "lb-12",
    url: "/assets/aistudio/wig_c0a3b4a2.jpeg",
    type: "image",
    title: "Lace Wig Installation & Melt",
    category: "Wigs",
    description: "Flawless frontal lace melt before & after transformation and styling.",
    span: "col-span-1 row-span-1",
  },
];

const LOOKBOOK_STORAGE_KEY = "beautyhaven_lookbook_v3";

export interface AppointmentBooking {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  serviceCategory?: string;
  servicePrice?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  createdAt: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

const BOOKINGS_STORAGE_KEY = "beautyhaven_bookings_v1";

interface ServiceContextType {
  services: Service[];
  updateService: (index: number, updated: Service) => void;
  addService: (newService: Service) => void;
  deleteService: (index: number) => void;
  resetToDefaults: () => void;
  importServices: (imported: Service[]) => { success: boolean; count?: number; error?: string };
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (oldPin: string, newPin: string) => boolean;
  hasCustomPrices: boolean;
  isSecretAdminUnlocked: boolean;
  setIsSecretAdminUnlocked: (unlocked: boolean) => void;
  handleLogoClick: () => void;
  lockAndHideAdmin: () => void;
  discountRibbon: DiscountRibbonConfig;
  updateDiscountRibbon: (config: Partial<DiscountRibbonConfig>) => void;
  toggleDiscountRibbon: () => void;
  resetDiscountRibbon: () => void;
  // Lookbook controls
  lookbookItems: LookbookItem[];
  addLookbookItem: (item: Omit<LookbookItem, "id"> & { id?: string }) => void;
  deleteLookbookItem: (id: string) => void;
  updateLookbookItem: (id: string, updated: Partial<LookbookItem>) => void;
  resetLookbookItems: () => void;
  isLookbookOpen: boolean;
  setIsLookbookOpen: (open: boolean) => void;
  openLookbook: () => void;
  closeLookbook: () => void;
  toggleLookbook: () => void;
  // Booking modal controls
  isBookingOpen: boolean;
  bookingPreselectedService: string | null;
  openBookingModal: (serviceNameOrCategory?: string) => void;
  closeBookingModal: () => void;
  bookings: AppointmentBooking[];
  addBooking: (booking: Omit<AppointmentBooking, "id" | "createdAt" | "status">) => AppointmentBooking;
  updateBookingStatus: (id: string, status: AppointmentBooking["status"]) => void;
  deleteBooking: (id: string) => void;
  clearAllBookings: () => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: Service) => ({
            ...item,
            price: cleanPrice(item.price || ""),
          }));
        }
      }
    } catch (e) {
      console.warn("Failed to read saved services, using defaults:", e);
    }
    return SERVICES_DATA;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("beautyhaven_admin_session") === "active";
  });

  // Secret admin unlock state (only shown after 6 clicks on logo)
  const [isSecretAdminUnlocked, setIsSecretAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem(UNLOCKED_STORAGE_KEY) === "true";
  });

  // Discount Ribbon State
  const [discountRibbon, setDiscountRibbon] = useState<DiscountRibbonConfig>(() => {
    try {
      const saved = localStorage.getItem(RIBBON_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null) {
          return {
            ...DEFAULT_DISCOUNT_RIBBON,
            ...parsed,
          };
        }
      }
    } catch (e) {
      console.warn("Failed to read discount ribbon config:", e);
    }
    return DEFAULT_DISCOUNT_RIBBON;
  });

  const updateDiscountRibbon = (updated: Partial<DiscountRibbonConfig>) => {
    setDiscountRibbon((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(RIBBON_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save discount ribbon config:", e);
      }
      return next;
    });
  };

  const toggleDiscountRibbon = () => {
    setDiscountRibbon((prev) => {
      const next = { ...prev, enabled: !prev.enabled };
      try {
        localStorage.setItem(RIBBON_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const resetDiscountRibbon = () => {
    try {
      localStorage.removeItem(RIBBON_STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setDiscountRibbon(DEFAULT_DISCOUNT_RIBBON);
  };

  const clickCountRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    clickCountRef.current += 1;
    const current = clickCountRef.current;

    if (current >= 6) {
      clickCountRef.current = 0;
      setIsSecretAdminUnlocked(true);
      sessionStorage.setItem(UNLOCKED_STORAGE_KEY, "true");
      setIsAdminOpen(true);
    } else {
      // Reset if no clicks within 3 seconds
      resetTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 3000);
    }
  };

  // Keyboard shortcut listener: Alt+A or Ctrl+Shift+A secretly opens admin portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "a" || e.key === "A")) ||
        (e.altKey && (e.key === "a" || e.key === "A"))
      ) {
        e.preventDefault();
        setIsSecretAdminUnlocked(true);
        sessionStorage.setItem(UNLOCKED_STORAGE_KEY, "true");
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const lockAndHideAdmin = () => {
    setIsSecretAdminUnlocked(false);
    sessionStorage.removeItem(UNLOCKED_STORAGE_KEY);
    logoutAdmin();
    setIsAdminOpen(false);
  };

  // Check if services differ from defaults
  const [hasCustomPrices, setHasCustomPrices] = useState(false);

  useEffect(() => {
    // Purge any legacy /= from stored services so cached data reflects clean prices immediately
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.includes("/=")) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.map((item: Service) => ({
            ...item,
            price: cleanPrice(item.price || ""),
          }));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
          setServices(cleaned);
        }
      }
    } catch (e) {
      console.warn("Storage cleanup error:", e);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setHasCustomPrices(Boolean(saved && saved !== JSON.stringify(SERVICES_DATA)));
  }, [services]);

  const saveServices = (newServices: Service[]) => {
    const sanitized = newServices.map((item) => ({
      ...item,
      price: cleanPrice(item.price || ""),
    }));
    setServices(sanitized);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } catch (e) {
      console.error("Failed to persist services:", e);
    }
  };

  const updateService = (index: number, updated: Service) => {
    const next = [...services];
    if (index >= 0 && index < next.length) {
      next[index] = {
        ...updated,
        price: cleanPrice(updated.price || ""),
      };
      saveServices(next);
    }
  };

  const addService = (newService: Service) => {
    const sanitized = {
      ...newService,
      price: cleanPrice(newService.price || ""),
    };
    const next = [sanitized, ...services];
    saveServices(next);
  };

  const deleteService = (index: number) => {
    const next = services.filter((_, i) => i !== index);
    saveServices(next);
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setServices(SERVICES_DATA);
  };

  const importServices = (imported: Service[]) => {
    if (!Array.isArray(imported) || imported.length === 0) {
      return { success: false, error: "Invalid data format. Expected an array of services." };
    }
    // Basic verification of services
    const valid = imported.every((item) => typeof item.name === "string" && typeof item.price === "string");
    if (!valid) {
      return { success: false, error: "One or more services are missing required 'name' or 'price' fields." };
    }
    const sanitized = imported.map((item) => ({
      ...item,
      price: cleanPrice(item.price || ""),
    }));
    saveServices(sanitized);
    return { success: true, count: sanitized.length };
  };

  const getStoredPin = () => {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
  };

  const loginAdmin = (pin: string) => {
    const currentPin = getStoredPin();
    if (pin.trim() === currentPin.trim()) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem("beautyhaven_admin_session", "active");
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem("beautyhaven_admin_session");
  };

  const updateAdminPin = (oldPin: string, newPin: string) => {
    const currentPin = getStoredPin();
    if (oldPin.trim() !== currentPin.trim()) {
      return false;
    }
    if (newPin.trim().length < 4) {
      return false;
    }
    localStorage.setItem(PIN_STORAGE_KEY, newPin.trim());
    return true;
  };

  // Lookbook State
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);

  const [lookbookItems, setLookbookItems] = useState<LookbookItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOOKBOOK_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let updated = parsed.map((it: LookbookItem) => {
            if (
              it.url &&
              (it.url.includes("photo-1522337360788") ||
                it.url.includes("photo-1583001931096"))
            ) {
              return { ...it, url: "/lash-lounge-artistry.jpg" };
            }
            return it;
          });
          const hasHeroBraids = updated.some(
            (it: LookbookItem) => it.url === "/hero-braids.mp4"
          );
          if (!hasHeroBraids) {
            updated.unshift(DEFAULT_LOOKBOOK_ITEMS[0]);
          }
          const hasStitchLines = updated.some(
            (it: LookbookItem) => it.url === "/braids-stitch-lines.jpg"
          );
          if (!hasStitchLines) {
            updated.splice(1, 0, DEFAULT_LOOKBOOK_ITEMS[1]);
          }
          return updated;
        }
      }
    } catch (e) {
      console.warn("Failed to read lookbook items, using defaults:", e);
    }
    return DEFAULT_LOOKBOOK_ITEMS;
  });

  const saveLookbook = (items: LookbookItem[]) => {
    setLookbookItems(items);
    try {
      localStorage.setItem(LOOKBOOK_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save lookbook items:", e);
    }
  };

  const addLookbookItem = (item: Omit<LookbookItem, "id"> & { id?: string }) => {
    const newItem: LookbookItem = {
      ...item,
      id: item.id || `lb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    const next = [newItem, ...lookbookItems];
    saveLookbook(next);
  };

  const deleteLookbookItem = (id: string) => {
    const next = lookbookItems.filter((item) => item.id !== id);
    saveLookbook(next);
  };

  const updateLookbookItem = (id: string, updated: Partial<LookbookItem>) => {
    const next = lookbookItems.map((item) => (item.id === id ? { ...item, ...updated } : item));
    saveLookbook(next);
  };

  const resetLookbookItems = () => {
    try {
      localStorage.removeItem(LOOKBOOK_STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setLookbookItems(DEFAULT_LOOKBOOK_ITEMS);
  };

  const openLookbook = () => {
    setIsLookbookOpen(true);
    setTimeout(() => {
      document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  const closeLookbook = () => {
    setIsLookbookOpen(false);
  };

  const toggleLookbook = () => {
    setIsLookbookOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
        }, 120);
      }
      return next;
    });
  };

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingPreselectedService, setBookingPreselectedService] = useState<string | null>(null);

  const [bookings, setBookings] = useState<AppointmentBooking[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("Failed to read saved bookings:", e);
    }
    return [];
  });

  const saveBookings = (list: AppointmentBooking[]) => {
    setBookings(list);
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save bookings:", e);
    }
  };

  const openBookingModal = (serviceNameOrCategory?: string) => {
    setBookingPreselectedService(serviceNameOrCategory || null);
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setBookingPreselectedService(null);
  };

  const addBooking = (booking: Omit<AppointmentBooking, "id" | "createdAt" | "status">): AppointmentBooking => {
    const newBooking: AppointmentBooking = {
      ...booking,
      id: `BH-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
    };
    const next = [newBooking, ...bookings];
    saveBookings(next);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: AppointmentBooking["status"]) => {
    const next = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    saveBookings(next);
  };

  const deleteBooking = (id: string) => {
    const next = bookings.filter((b) => b.id !== id);
    saveBookings(next);
  };

  const clearAllBookings = () => {
    saveBookings([]);
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        updateService,
        addService,
        deleteService,
        resetToDefaults,
        importServices,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updateAdminPin,
        hasCustomPrices,
        isSecretAdminUnlocked,
        setIsSecretAdminUnlocked,
        handleLogoClick,
        lockAndHideAdmin,
        discountRibbon,
        updateDiscountRibbon,
        toggleDiscountRibbon,
        resetDiscountRibbon,
        // Lookbook
        lookbookItems,
        addLookbookItem,
        deleteLookbookItem,
        updateLookbookItem,
        resetLookbookItems,
        isLookbookOpen,
        setIsLookbookOpen,
        openLookbook,
        closeLookbook,
        toggleLookbook,
        // Booking
        isBookingOpen,
        bookingPreselectedService,
        openBookingModal,
        closeBookingModal,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        clearAllBookings,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within a ServiceProvider");
  }
  return context;
}
