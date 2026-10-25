import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  Search,
  Key,
  ShieldCheck,
  AlertCircle,
  Tag,
  Sparkles,
  HelpCircle,
  Copy,
  Percent,
  Eye,
  EyeOff,
  Sliders,
  Camera,
  UploadCloud,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { useServices, DiscountRibbonConfig, LookbookItem } from "../context/ServiceContext";
import { Service, ServiceCategory, CATEGORIES, cleanPrice } from "../constants";

const CATEGORY_OPTIONS: ServiceCategory[] = ["Makeup", "Nails", "Hair", "Lashes", "Wigs"];

const RIBBON_PRESETS = [
  {
    label: "10% First Visit (Default)",
    prefix: "First time? Get",
    highlight: "10% OFF",
    suffix: "your first service",
    heroBadge: "10% OFF FIRST VISIT",
  },
  {
    label: "Weekend 15% Special",
    prefix: "Weekend Flash:",
    highlight: "15% OFF",
    suffix: "all braids & weaves this Saturday",
    heroBadge: "15% OFF WEEKEND SPECIAL",
  },
  {
    label: "Ksh 500 Off Combos",
    prefix: "Special Offer:",
    highlight: "KSH 500 OFF",
    suffix: "on Hair + Nails combo packages",
    heroBadge: "SAVE KSH 500 ON COMBOS",
  },
  {
    label: "Free Hair Treatment",
    prefix: "Complimentary:",
    highlight: "FREE TREATMENT",
    suffix: "with any Dreadlocks or Knotless set",
    heroBadge: "FREE COMPLIMENTARY TREATMENT",
  },
  {
    label: "Holiday 20% Glam",
    prefix: "Holiday Glam:",
    highlight: "20% OFF",
    suffix: "any soft glam makeup or bridal package",
    heroBadge: "20% OFF HOLIDAY GLAM",
  },
  {
    label: "Walk-ins Welcome",
    prefix: "Welcome:",
    highlight: "WALK-INS WELCOME",
    suffix: "Open everyday 8AM - 8PM at Bypass Kamakis",
    heroBadge: "OPEN EVERYDAY 8AM - 8PM",
  },
];

export default function AdminPriceModal() {
  const {
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
    lockAndHideAdmin,
    discountRibbon,
    updateDiscountRibbon,
    toggleDiscountRibbon,
    resetDiscountRibbon,
    lookbookItems,
    addLookbookItem,
    deleteLookbookItem,
    resetLookbookItems,
    openLookbook,
    isLookbookOpen,
    toggleLookbook,
  } = useServices();

  // Login PIN state
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  // Search & Filter
  const [activeCategory, setActiveCategory] = useState<"All" | ServiceCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // In-modal notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab mode in admin: "list" | "add" | "ribbon" | "lookbook" | "backup" | "pin"
  const [modalTab, setModalTab] = useState<"list" | "add" | "ribbon" | "lookbook" | "backup" | "pin">("list");

  // Lookbook Form & Filter State
  const [lbUploadMethod, setLbUploadMethod] = useState<"file" | "url">("file");
  const [newLbTitle, setNewLbTitle] = useState("");
  const [newLbCategory, setNewLbCategory] = useState("Braids");
  const [newLbUrl, setNewLbUrl] = useState("");
  const [newLbDescription, setNewLbDescription] = useState("");
  const [newLbSpan, setNewLbSpan] = useState("col-span-1 row-span-1");
  const [lbPreviewUrl, setLbPreviewUrl] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [lbSearchQuery, setLbSearchQuery] = useState("");
  const [lbCategoryFilter, setLbCategoryFilter] = useState("All");

  // New Service Form State
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState<ServiceCategory>("Makeup");
  const [newDescription, setNewDescription] = useState("");
  const [newSubType, setNewSubType] = useState("");
  const [newShape, setNewShape] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newIsPopular, setNewIsPopular] = useState(false);

  // Change PIN State
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinChangeError, setPinChangeError] = useState("");
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  // Backup / Import State
  const [importJsonText, setImportJsonText] = useState("");
  const [importError, setImportError] = useState("");
  const [copiedBackup, setCopiedBackup] = useState(false);

  // Discount Ribbon Form State
  const [ribbonEnabled, setRibbonEnabled] = useState(discountRibbon.enabled);
  const [ribbonPrefix, setRibbonPrefix] = useState(discountRibbon.prefix);
  const [ribbonHighlight, setRibbonHighlight] = useState(discountRibbon.highlight);
  const [ribbonSuffix, setRibbonSuffix] = useState(discountRibbon.suffix);
  const [ribbonHeroBadge, setRibbonHeroBadge] = useState(discountRibbon.heroBadge);
  const [ribbonShowHeroBadge, setRibbonShowHeroBadge] = useState(discountRibbon.showHeroBadge ?? true);

  // Synchronize with context updates
  useEffect(() => {
    setRibbonEnabled(discountRibbon.enabled);
    setRibbonPrefix(discountRibbon.prefix);
    setRibbonHighlight(discountRibbon.highlight);
    setRibbonSuffix(discountRibbon.suffix);
    setRibbonHeroBadge(discountRibbon.heroBadge);
    setRibbonShowHeroBadge(discountRibbon.showHeroBadge ?? true);
  }, [discountRibbon]);

  const handleSaveRibbon = (e: React.FormEvent) => {
    e.preventDefault();
    updateDiscountRibbon({
      enabled: ribbonEnabled,
      prefix: ribbonPrefix.trim(),
      highlight: ribbonHighlight.trim(),
      suffix: ribbonSuffix.trim(),
      heroBadge: ribbonHeroBadge.trim(),
      showHeroBadge: ribbonShowHeroBadge,
    });
    showToast(
      ribbonEnabled
        ? "Discount ribbon updated & live on site!"
        : "Ribbon settings saved (Ribbon currently hidden from website)"
    );
  };

  const handleQuickToggleRibbon = () => {
    const nextState = !ribbonEnabled;
    setRibbonEnabled(nextState);
    updateDiscountRibbon({ enabled: nextState });
    showToast(
      nextState
        ? "Discount ribbon is now visible on website"
        : "Discount ribbon has been removed from website"
    );
  };

  const handleApplyPreset = (preset: (typeof RIBBON_PRESETS)[0]) => {
    setRibbonPrefix(preset.prefix);
    setRibbonHighlight(preset.highlight);
    setRibbonSuffix(preset.suffix);
    setRibbonHeroBadge(preset.heroBadge);
    setRibbonEnabled(true);
    updateDiscountRibbon({
      enabled: true,
      prefix: preset.prefix,
      highlight: preset.highlight,
      suffix: preset.suffix,
      heroBadge: preset.heroBadge,
    });
    showToast(`Applied preset: "${preset.label}"`);
  };

  const handleResetRibbon = () => {
    resetDiscountRibbon();
    showToast("Discount ribbon restored to default (10% OFF).");
  };

  // Lookbook Handlers & Filtering
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file (PNG, JPG, WEBP).");
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.82);
          setLbPreviewUrl(compressed);
          setNewLbUrl(compressed);
        } else {
          setLbPreviewUrl(event.target?.result as string);
          setNewLbUrl(event.target?.result as string);
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        showToast("Error processing image.");
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setIsProcessingImage(false);
      showToast("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleAddLookbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = (newLbUrl || lbPreviewUrl || "").trim();
    if (!finalUrl) {
      showToast("Please provide an image URL or choose a photo.");
      return;
    }
    if (!newLbTitle.trim()) {
      showToast("Please enter a style title.");
      return;
    }

    addLookbookItem({
      title: newLbTitle.trim(),
      category: newLbCategory,
      url: finalUrl,
      type: "image",
      description: newLbDescription.trim() || undefined,
      span: newLbSpan,
    });

    setNewLbTitle("");
    setNewLbUrl("");
    setNewLbDescription("");
    setLbPreviewUrl(null);
    showToast(`Added "${newLbTitle.trim()}" to Lookbook!`);
  };

  const handleDeleteLookbookItem = (id: string, title: string) => {
    if (window.confirm(`Remove "${title}" from the Lookbook?`)) {
      deleteLookbookItem(id);
      showToast(`Removed "${title}" from Lookbook.`);
    }
  };

  const handleResetLookbook = () => {
    if (window.confirm("Restore Lookbook to initial curated salon photos?")) {
      resetLookbookItems();
      showToast("Lookbook reset to default photos.");
    }
  };

  const filteredLookbookItems = useMemo(() => {
    return lookbookItems.filter((item) => {
      const matchesCat = lbCategoryFilter === "All" || item.category === lbCategoryFilter;
      const q = lbSearchQuery.toLowerCase().trim();
      if (!q) return matchesCat;
      const matchesQuery =
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [lookbookItems, lbCategoryFilter, lbSearchQuery]);

  // Inline editing row tracking
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedService, setEditedService] = useState<Service | null>(null);

  // Reset confirmation
  const [confirmReset, setConfirmReset] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pinInput)) {
      setPinError("");
      setPinInput("");
      showToast("Admin access granted.");
    } else {
      setPinError("Incorrect PIN. Default is 2540");
    }
  };

  const handleStartEdit = (originalIndex: number, service: Service) => {
    setEditingIndex(originalIndex);
    setEditedService({ ...service });
  };

  const handleSaveEdit = (originalIndex: number) => {
    if (!editedService) return;
    if (!editedService.name.trim() || !editedService.price.trim()) {
      showToast("Name and Price are required.");
      return;
    }
    const sanitizedService = {
      ...editedService,
      price: cleanPrice(editedService.price),
    };
    updateService(originalIndex, sanitizedService);
    setEditingIndex(null);
    setEditedService(null);
    showToast(`Updated "${sanitizedService.name}"`);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedService(null);
  };

  const handleDelete = (index: number, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      deleteService(index);
      if (editingIndex === index) {
        setEditingIndex(null);
        setEditedService(null);
      }
      showToast(`Removed "${name}"`);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice.trim()) {
      showToast("Service name and price are required.");
      return;
    }

    // Clean price without forcing /=
    const formattedPrice = cleanPrice(newPrice);

    const created: Service = {
      name: newName.trim(),
      price: formattedPrice,
      category: newCategory,
      description: newDescription.trim() || undefined,
      subType: newSubType.trim() || undefined,
      shape: newShape.trim() || undefined,
      tag: newTag.trim() || undefined,
      isPopular: newIsPopular,
    };

    addService(created);
    setNewName("");
    setNewPrice("");
    setNewDescription("");
    setNewSubType("");
    setNewShape("");
    setNewTag("");
    setNewIsPopular(false);
    setModalTab("list");
    showToast(`Added "${created.name}" to ${created.category}`);
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError("");
    setPinChangeSuccess(false);

    if (newPin !== confirmPin) {
      setPinChangeError("New PIN and confirmation do not match.");
      return;
    }
    if (newPin.trim().length < 4) {
      setPinChangeError("PIN must be at least 4 digits.");
      return;
    }

    const ok = updateAdminPin(oldPin, newPin);
    if (ok) {
      setPinChangeSuccess(true);
      setOldPin("");
      setNewPin("");
      setConfirmPin("");
      showToast("Admin PIN updated successfully.");
      setTimeout(() => setModalTab("list"), 1500);
    } else {
      setPinChangeError("Current PIN is incorrect.");
    }
  };

  const handleCopyBackup = () => {
    const jsonStr = JSON.stringify(services, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2500);
    showToast("Prices JSON copied to clipboard!");
  };

  const handleDownloadBackup = () => {
    const jsonStr = JSON.stringify(services, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beauty-haven-254-prices-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Price list backup downloaded.");
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError("");
    try {
      const parsed = JSON.parse(importJsonText);
      const res = importServices(parsed);
      if (res.success) {
        setImportJsonText("");
        setModalTab("list");
        showToast(`Successfully imported ${res.count} services!`);
      } else {
        setImportError(res.error || "Import failed.");
      }
    } catch {
      setImportError("Invalid JSON text. Please check the format.");
    }
  };

  const handleResetDefaults = () => {
    resetToDefaults();
    setConfirmReset(false);
    showToast("Catalog reset to Beauty Haven default prices.");
  };

  // Filtered services for the admin table
  const indexedFilteredServices = useMemo(() => {
    return services
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item }) => {
        const matchesCat = activeCategory === "All" || item.category === activeCategory;
        const q = searchQuery.toLowerCase().trim();
        if (!q) return matchesCat;
        const matchesQuery =
          item.name.toLowerCase().includes(q) ||
          item.price.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q)) ||
          (item.shape && item.shape.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q);
        return matchesCat && matchesQuery;
      });
  }, [services, activeCategory, searchQuery]);

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-5xl bg-stone-900 border border-gold/40 shadow-2xl rounded-none text-white my-auto max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-gold/30 bg-stone-950">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4">
            {/* Left: Branding & Status Badges */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gold flex items-center justify-center text-stone-950 font-serif font-black text-sm shrink-0 shadow-md">
                B
              </div>
              <div className="min-w-0">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-sm sm:text-base font-serif italic text-gold font-bold whitespace-nowrap">
                    Beauty Haven 254
                  </span>
                  <span className="h-6 px-2.5 inline-flex items-center text-[10px] uppercase tracking-wider font-bold bg-gold/15 text-gold border border-gold/30 whitespace-nowrap">
                    Staff Admin
                  </span>
                  {hasCustomPrices && (
                    <span className="h-6 px-2.5 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 whitespace-nowrap font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Custom Prices Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/50 font-sans mt-0.5 truncate hidden sm:block whitespace-nowrap">
                  Real-time price & catalog manager for front-end rate cards
                </p>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto sm:ml-0">
              <button
                onClick={lockAndHideAdmin}
                className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap text-amber-300 hover:text-stone-950 hover:bg-amber-400 border border-amber-500/50 bg-amber-500/10 transition-colors shadow-sm"
                title="Lock admin session and hide button from website (click logo 6x to unhide)"
              >
                <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>Hide & Lock</span>
              </button>
              {isAdminAuthenticated && (
                <button
                  onClick={logoutAdmin}
                  className="inline-flex items-center justify-center h-8 px-3 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap text-white/70 hover:text-white hover:bg-white/10 border border-white/20 transition-colors"
                  title="Log out of admin session"
                >
                  Log Out
                </button>
              )}
              <button
                onClick={() => setIsAdminOpen(false)}
                className="inline-flex items-center justify-center h-8 w-8 text-white/60 hover:text-gold hover:bg-white/10 border border-transparent hover:border-gold/30 transition-colors shrink-0"
                title="Close Admin Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Toast alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gold text-secondary px-4 py-2 text-xs font-bold font-sans flex items-center justify-between shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                {toastMessage}
              </span>
              <button onClick={() => setToastMessage(null)}>
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-900 font-sans">
          {!isAdminAuthenticated ? (
            /* PIN Login Screen */
            <div className="max-w-md mx-auto py-12 text-center">
              <div className="w-14 h-14 bg-gold/10 border border-gold/40 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                <Lock className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-serif italic text-white mb-2">
                Admin Authentication
              </h3>
              <p className="text-xs text-white/60 mb-6 font-sans">
                Enter your administrative PIN to edit prices, add services, and customize salon rates.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    maxLength={10}
                    placeholder="Enter Admin PIN"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full text-center text-2xl tracking-[0.4em] bg-stone-950 border border-gold/40 px-4 py-3 text-gold focus:outline-none focus:border-gold font-mono"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs text-rose-400 mt-2 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {pinError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold text-secondary font-bold py-3 text-xs uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Verify & Access Dashboard
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <div className="inline-flex items-center gap-1.5 text-[11px] text-white/40 bg-white/5 px-3 py-1.5 border border-white/10">
                  <Key className="w-3.5 h-3.5 text-gold" />
                  <span>Default Manager Passcode: <strong className="text-gold font-mono">2540</strong></span>
                </div>
              </div>
            </div>
          ) : (
            /* Authenticated Admin Dashboard */
            <div>
              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar max-w-full pb-1">
                  <button
                    onClick={() => setModalTab("list")}
                    className={`h-8 sm:h-9 px-3 sm:px-3.5 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap inline-flex items-center justify-center shrink-0 ${
                      modalTab === "list"
                        ? "bg-gold text-secondary shadow-sm"
                        : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Services ({services.length})
                  </button>
                  <button
                    onClick={() => setModalTab("add")}
                    className={`h-8 sm:h-9 px-3 sm:px-3.5 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0 ${
                      modalTab === "add"
                        ? "bg-gold text-secondary shadow-sm"
                        : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service</span>
                  </button>
                  <button
                    onClick={() => setModalTab("ribbon")}
                    className={`h-8 sm:h-9 px-3 sm:px-3.5 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0 ${
                      modalTab === "ribbon"
                        ? "bg-gold text-secondary shadow-sm"
                        : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Percent className="w-3.5 h-3.5" />
                    <span>Discount Ribbon</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 font-mono uppercase font-bold ${
                        ribbonEnabled
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                          : "bg-stone-800 text-stone-400 border border-stone-700"
                      }`}
                    >
                      {ribbonEnabled ? "ON" : "OFF"}
                    </span>
                  </button>
                  <button
                    onClick={() => setModalTab("lookbook")}
                    className={`h-8 sm:h-9 px-3 sm:px-3.5 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0 ${
                      modalTab === "lookbook"
                        ? "bg-gold text-secondary shadow-sm"
                        : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Lookbook</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-stone-900 text-gold border border-gold/30 font-mono font-bold">
                      {lookbookItems.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setModalTab("backup")}
                    className={`h-8 sm:h-9 px-3 sm:px-3.5 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0 ${
                      modalTab === "backup"
                        ? "bg-gold text-secondary shadow-sm"
                        : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Backup & Sync</span>
                  </button>
                  <button
                    onClick={() => setModalTab("pin")}
                    className={`h-8 sm:h-9 px-3 sm:px-3.5 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0 ${
                      modalTab === "pin"
                        ? "bg-gold text-secondary shadow-sm"
                        : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Change PIN</span>
                  </button>
                </div>

                <div className="flex items-center shrink-0">
                  {!confirmReset ? (
                    <button
                      onClick={() => setConfirmReset(true)}
                      className="h-8 sm:h-9 px-3 text-[10px] uppercase tracking-wider font-bold text-white/50 hover:text-rose-400 hover:border-rose-400/50 border border-white/10 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                      title="Reset all prices to original salon rates"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Defaults</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1.5 bg-rose-950/80 border border-rose-500/40 p-1">
                      <span className="text-[10px] text-rose-200 px-1 font-bold">Reset all?</span>
                      <button
                        onClick={handleResetDefaults}
                        className="bg-rose-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase hover:bg-rose-500"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmReset(false)}
                        className="bg-white/10 text-white/80 px-2 py-0.5 text-[10px] font-bold uppercase hover:bg-white/20"
                      >
                        No
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* TAB 1: SERVICES LIST & INLINE EDIT */}
              {modalTab === "list" && (
                <div>
                  {/* Category Filter & Search Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                    {/* Category Buttons */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1">
                      {CATEGORIES.map((cat) => {
                        const count =
                          cat.id === "All"
                            ? services.length
                            : services.filter((s) => s.category === cat.id).length;
                        const isActive = activeCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setActiveCategory(cat.id)}
                            className={`h-8 sm:h-8.5 px-3 sm:px-3.5 text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 border ${
                              isActive
                                ? "bg-gold text-secondary border-gold shadow-sm font-extrabold"
                                : "bg-stone-900 text-white/70 hover:text-white hover:bg-stone-800 border-white/10"
                            }`}
                          >
                            <span>{cat.label}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 font-mono font-bold ${
                                isActive ? "bg-secondary/20 text-secondary" : "bg-white/10 text-white/50"
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Search & Count Info */}
                    <div className="flex items-center gap-2.5 shrink-0 w-full lg:w-auto">
                      <div className="relative flex-1 lg:w-64">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          placeholder="Search service name, shape..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-8 sm:h-8.5 bg-stone-950 border border-white/10 pl-9 pr-7 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold transition-colors"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-white/40 font-mono whitespace-nowrap hidden sm:inline-block">
                        {indexedFilteredServices.length} of {services.length}
                      </span>
                    </div>
                  </div>

                  {/* List / Table */}
                  <div className="border border-white/10 bg-stone-950/50 overflow-hidden">
                    {/* Desktop Table Header */}
                    <div className="hidden lg:grid grid-cols-12 gap-3 px-4 py-2.5 bg-stone-950 border-b border-white/10 text-[10px] uppercase tracking-wider text-gold font-bold items-center">
                      <div className="col-span-4">Service Name & Description</div>
                      <div className="col-span-2">Department</div>
                      <div className="col-span-2">Current Rate</div>
                      <div className="col-span-2">Details / Shape</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {indexedFilteredServices.length === 0 ? (
                      <div className="p-10 text-center text-white/40 text-xs">
                        No services found matching "{searchQuery}".
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setActiveCategory("All");
                          }}
                          className="block mx-auto mt-2 text-gold hover:underline font-bold uppercase tracking-wider text-[10px]"
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {indexedFilteredServices.map(({ item, originalIndex }) => {
                          const isEditing = editingIndex === originalIndex;

                          if (isEditing && editedService) {
                            return (
                              <div
                                key={originalIndex}
                                className="p-4 sm:p-5 bg-stone-850/95 border-l-4 border-gold space-y-4 shadow-inner"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                                  <span className="text-xs text-gold font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Editing Service #{originalIndex + 1}: {item.name}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEdit(originalIndex)}
                                      className="h-8 px-3.5 bg-gold text-secondary text-xs font-bold uppercase tracking-wider hover:bg-white flex items-center gap-1.5 transition-colors whitespace-nowrap"
                                    >
                                      <Save className="w-3.5 h-3.5" />
                                      <span>Save Changes</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCancelEdit}
                                      className="h-8 px-3 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-colors whitespace-nowrap"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">
                                      Service Name *
                                    </label>
                                    <input
                                      type="text"
                                      value={editedService.name}
                                      onChange={(e) =>
                                        setEditedService({ ...editedService, name: e.target.value })
                                      }
                                      className="w-full h-8.5 bg-stone-900 border border-gold/40 px-3 text-xs text-white focus:outline-none focus:border-gold"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">
                                      Price (e.g. 1,500 or 500 - 700) *
                                    </label>
                                    <input
                                      type="text"
                                      value={editedService.price}
                                      onChange={(e) =>
                                        setEditedService({ ...editedService, price: e.target.value })
                                      }
                                      className="w-full h-8.5 bg-stone-900 border border-gold/40 px-3 text-xs text-gold font-mono font-bold focus:outline-none focus:border-gold"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">
                                      Department / Category
                                    </label>
                                    <select
                                      value={editedService.category}
                                      onChange={(e) =>
                                        setEditedService({
                                          ...editedService,
                                          category: e.target.value as ServiceCategory,
                                        })
                                      }
                                      className="w-full h-8.5 bg-stone-900 border border-gold/40 px-3 text-xs text-white focus:outline-none focus:border-gold"
                                    >
                                      {CATEGORY_OPTIONS.map((c) => (
                                        <option key={c} value={c}>
                                          {c}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">
                                      Shape / Variant (Optional)
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Fox eye, Cat eye, Almond..."
                                      value={editedService.shape || ""}
                                      onChange={(e) =>
                                        setEditedService({ ...editedService, shape: e.target.value })
                                      }
                                      className="w-full h-8.5 bg-stone-900 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">
                                      Subtype / Brand (Optional)
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="L'Oréal, Mizani, Cluster..."
                                      value={editedService.subType || ""}
                                      onChange={(e) =>
                                        setEditedService({ ...editedService, subType: e.target.value })
                                      }
                                      className="w-full h-8.5 bg-stone-900 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">
                                      Badge / Tag (Optional)
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Popular, Best Value, Trending..."
                                      value={editedService.tag || ""}
                                      onChange={(e) =>
                                        setEditedService({ ...editedService, tag: e.target.value })
                                      }
                                      className="w-full h-8.5 bg-stone-900 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">
                                    Short Description
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={editedService.description || ""}
                                    onChange={(e) =>
                                      setEditedService({
                                        ...editedService,
                                        description: e.target.value,
                                      })
                                    }
                                    className="w-full bg-stone-900 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                                  />
                                </div>

                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`popular-${originalIndex}`}
                                    checked={Boolean(editedService.isPopular)}
                                    onChange={(e) =>
                                      setEditedService({
                                        ...editedService,
                                        isPopular: e.target.checked,
                                      })
                                    }
                                    className="accent-gold w-4 h-4 cursor-pointer"
                                  />
                                  <label
                                    htmlFor={`popular-${originalIndex}`}
                                    className="text-xs text-white/80 cursor-pointer"
                                  >
                                    Mark as "Popular" (featured with highlight badge on rate card)
                                  </label>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={originalIndex}
                              className="p-3.5 sm:px-4 sm:py-3 hover:bg-stone-900/90 transition-colors"
                            >
                              {/* Responsive Card Layout for Mobile & Tablet (< lg) */}
                              <div className="lg:hidden space-y-2.5">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="flex items-center flex-wrap gap-1.5">
                                      <span className="font-serif text-sm font-bold text-white">
                                        {item.name}
                                      </span>
                                      {item.isPopular && (
                                        <span className="text-[9px] uppercase tracking-wider bg-gold text-secondary font-bold px-1.5 py-0.2 whitespace-nowrap">
                                          Popular
                                        </span>
                                      )}
                                      <span className="text-[9px] uppercase tracking-wider text-white/60 bg-white/5 px-2 py-0.5 border border-white/10 whitespace-nowrap">
                                        {item.category}
                                      </span>
                                    </div>
                                    {item.description && (
                                      <p className="text-[11px] text-white/40 line-clamp-2 mt-1">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEdit(originalIndex, item)}
                                      className="h-7 px-2.5 bg-stone-800 hover:bg-gold hover:text-secondary text-white/90 text-[10px] uppercase tracking-wider font-bold border border-white/10 transition-colors whitespace-nowrap inline-flex items-center gap-1"
                                    >
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(originalIndex, item.name)}
                                      className="h-7 w-7 flex items-center justify-center text-white/40 hover:text-rose-400 hover:bg-rose-950/40 border border-white/10 transition-colors shrink-0"
                                      title="Delete service"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                                  <span className="text-sm font-serif italic text-gold font-bold bg-gold/10 px-2 py-0.5 border border-gold/30">
                                    {cleanPrice(item.price)}
                                  </span>
                                  <div className="text-[10px] text-white/50 flex items-center gap-1.5">
                                    {item.shape && (
                                      <span className="bg-white/5 px-1.5 py-0.5 border border-white/5">
                                        Shape: {item.shape}
                                      </span>
                                    )}
                                    {item.subType && (
                                      <span className="bg-white/5 px-1.5 py-0.5 border border-white/5">
                                        {item.subType}
                                      </span>
                                    )}
                                    {item.tag && (
                                      <span className="bg-gold/15 text-gold px-1.5 py-0.5 border border-gold/30">
                                        {item.tag}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Desktop Grid Layout (lg+) */}
                              <div className="hidden lg:grid grid-cols-12 gap-3 items-center">
                                <div className="col-span-4 min-w-0 pr-2">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-serif text-sm font-bold text-white">
                                      {item.name}
                                    </span>
                                    {item.isPopular && (
                                      <span className="text-[9px] uppercase tracking-wider bg-gold text-secondary font-bold px-1.5 py-0.2 whitespace-nowrap">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-[11px] text-white/40 line-clamp-1 mt-0.5">
                                      {item.description}
                                    </p>
                                  )}
                                </div>

                                <div className="col-span-2">
                                  <span className="text-[10px] uppercase tracking-wider text-white/70 bg-white/5 px-2.5 py-1 border border-white/10 whitespace-nowrap font-bold inline-block">
                                    {item.category}
                                  </span>
                                </div>

                                <div className="col-span-2">
                                  <span className="text-sm font-serif italic text-gold font-bold bg-gold/10 px-2.5 py-1 border border-gold/30 whitespace-nowrap inline-block">
                                    {cleanPrice(item.price)}
                                  </span>
                                </div>

                                <div className="col-span-2 text-[11px] text-white/50">
                                  {item.shape && <span className="block truncate">Shape: {item.shape}</span>}
                                  {item.subType && <span className="block truncate text-white/40">{item.subType}</span>}
                                  {!item.shape && !item.subType && <span className="text-white/20">—</span>}
                                </div>

                                <div className="col-span-2 flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEdit(originalIndex, item)}
                                    className="h-7.5 px-3 bg-stone-850 hover:bg-gold hover:text-secondary text-white/90 text-[11px] uppercase tracking-wider font-bold border border-white/15 transition-colors whitespace-nowrap inline-flex items-center gap-1"
                                  >
                                    <span>Edit Price</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(originalIndex, item.name)}
                                    className="h-7.5 w-7.5 flex items-center justify-center text-white/30 hover:text-rose-400 hover:bg-rose-950/40 border border-white/10 transition-colors shrink-0"
                                    title="Delete this service"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ADD NEW SERVICE */}
              {modalTab === "add" && (
                <div className="max-w-2xl mx-auto py-2">
                  <div className="mb-6">
                    <h4 className="text-lg font-serif italic text-gold">Add New Salon Service</h4>
                    <p className="text-xs text-white/50">
                      Add a new item to Beauty Haven 254 rate card. It will immediately appear on the site.
                    </p>
                  </div>

                  <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                          Service Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Silk Press & Scalp Care"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full h-9 bg-stone-950 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                          Price * (e.g. 2,000)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2,000"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-full h-9 bg-stone-950 border border-white/20 px-3 text-xs text-gold font-bold focus:outline-none focus:border-gold font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                          Department / Category *
                        </label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                          className="w-full h-9 bg-stone-950 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                        >
                          {CATEGORY_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                          Shape / Variant (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Fox eye, Hybrid, Almond, Long"
                          value={newShape}
                          onChange={(e) => setNewShape(e.target.value)}
                          className="w-full h-9 bg-stone-950 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                          Product Line / Brand Subtype (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. L’Oréal, Mizani, Mikalla, Gel Overlay"
                          value={newSubType}
                          onChange={(e) => setNewSubType(e.target.value)}
                          className="w-full h-9 bg-stone-950 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                          Badge Tag (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Best Seller, Trending, Special"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          className="w-full h-9 bg-stone-950 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                        Service Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Brief summary of what this treatment includes..."
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="w-full bg-stone-950 border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="new-popular"
                        checked={newIsPopular}
                        onChange={(e) => setNewIsPopular(e.target.checked)}
                        className="accent-gold w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="new-popular" className="text-xs text-white/80 cursor-pointer">
                        Feature as "Popular" recommendation on price card
                      </label>
                    </div>

                    <div className="pt-4 flex items-center justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setModalTab("list")}
                        className="h-9 px-4 text-xs uppercase tracking-wider font-bold text-white/60 hover:text-white transition-colors whitespace-nowrap"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="h-9 px-6 bg-gold text-secondary text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors whitespace-nowrap"
                      >
                        Publish Service
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: DISCOUNT RIBBON MANAGEMENT */}
              {modalTab === "ribbon" && (
                <div className="max-w-3xl mx-auto py-2 space-y-6">
                  {/* Status Banner & Direct Switch */}
                  <div
                    className={`p-4 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      ribbonEnabled
                        ? "bg-stone-950/90 border-gold/50 shadow-lg shadow-gold/5"
                        : "bg-stone-950/60 border-stone-800"
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div
                        className={`w-10 h-10 flex items-center justify-center font-bold text-sm border ${
                          ribbonEnabled
                            ? "bg-gold text-secondary border-gold"
                            : "bg-stone-800 text-stone-400 border-stone-700"
                        }`}
                      >
                        <Percent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-serif italic font-bold text-white">
                            Discount Ribbon Status:
                          </h4>
                          <span
                            className={`text-[10px] uppercase tracking-widest px-2 py-0.5 font-bold font-mono ${
                              ribbonEnabled
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                                : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                            }`}
                          >
                            {ribbonEnabled ? "LIVE & VISIBLE" : "HIDDEN / REMOVED"}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 mt-0.5">
                          {ribbonEnabled
                            ? "The promotional ribbon is currently pinned at the very top of the salon website."
                            : "The ribbon is completely removed and hidden from customers. The navbar automatically shifts to the top edge."}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleQuickToggleRibbon}
                      className={`px-4 py-2.5 text-xs uppercase tracking-wider font-bold transition-all shrink-0 flex items-center gap-2 ${
                        ribbonEnabled
                          ? "bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40"
                          : "bg-gold hover:bg-white text-secondary"
                      }`}
                    >
                      {ribbonEnabled ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Remove Ribbon Now</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Enable Ribbon Now</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Live Interactive Preview */}
                  <div className="bg-stone-950 border border-white/10 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-gold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Live Customer Preview (Real-Time)
                      </span>
                      <span className="text-[10px] text-white/40">Updates as you type</span>
                    </div>

                    {/* Top Ribbon simulation */}
                    <div className="rounded overflow-hidden border border-gold/30">
                      <div className="text-[9px] uppercase tracking-widest text-white/40 bg-stone-900 px-3 py-1 border-b border-white/5 flex items-center justify-between">
                        <span>Top Announcement Bar</span>
                        <span className={ribbonEnabled ? "text-emerald-400 font-bold" : "text-stone-500 italic"}>
                          {ribbonEnabled ? "● Showing" : "○ Currently Hidden"}
                        </span>
                      </div>
                      <div className="bg-secondary text-white py-2 px-4 flex items-center justify-center relative overflow-hidden">
                        <div className="flex items-center justify-center space-x-2 text-center">
                          <Sparkles className="w-3 h-3 text-gold animate-pulse shrink-0" />
                          <span className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-bold text-center">
                            {ribbonPrefix ? `${ribbonPrefix} ` : ""}
                            <span className="text-gold font-extrabold px-1">
                              {ribbonHighlight || "10% OFF"}
                            </span>
                            {ribbonSuffix ? ` ${ribbonSuffix}` : ""}
                          </span>
                          <Sparkles className="w-3 h-3 text-gold animate-pulse shrink-0" />
                        </div>
                      </div>
                    </div>

                    {/* Hero Badge simulation */}
                    {ribbonShowHeroBadge && ribbonHeroBadge && (
                      <div className="rounded overflow-hidden border border-white/10">
                        <div className="text-[9px] uppercase tracking-widest text-white/40 bg-stone-900 px-3 py-1 border-b border-white/5 flex items-center justify-between">
                          <span>Hero Section Badge</span>
                          <span className={ribbonEnabled ? "text-emerald-400 font-bold" : "text-stone-500 italic"}>
                            {ribbonEnabled ? "● Showing" : "○ Hidden with Ribbon"}
                          </span>
                        </div>
                        <div className="bg-secondary/95 p-3 flex items-center">
                          <div className="inline-block bg-gold py-1 px-4 shadow-sm">
                            <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                              {ribbonHeroBadge}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form to Update Text */}
                  <form onSubmit={handleSaveRibbon} className="space-y-4">
                    <div className="bg-stone-950/70 border border-white/10 p-4 space-y-4">
                      <h5 className="text-xs uppercase tracking-wider font-bold text-gold">
                        Ribbon Announcement Content
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                            Prefix Text
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. First time? Get"
                            value={ribbonPrefix}
                            onChange={(e) => setRibbonPrefix(e.target.value)}
                            className="w-full h-9 bg-stone-900 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                            Discount / Highlight Offer *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 10% OFF or Ksh 500 OFF"
                            value={ribbonHighlight}
                            onChange={(e) => setRibbonHighlight(e.target.value)}
                            className="w-full h-9 bg-stone-900 border border-gold/50 px-3 text-xs text-gold font-bold focus:outline-none focus:border-gold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                            Suffix Text
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. your first service"
                            value={ribbonSuffix}
                            onChange={(e) => setRibbonSuffix(e.target.value)}
                            className="w-full h-9 bg-stone-900 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                            Hero Banner Discount Badge
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 10% OFF FIRST VISIT"
                            value={ribbonHeroBadge}
                            onChange={(e) => setRibbonHeroBadge(e.target.value)}
                            className="w-full h-9 bg-stone-900 border border-white/20 px-3 text-xs text-white font-mono focus:outline-none focus:border-gold"
                          />
                        </div>

                        <div className="flex items-center gap-2 pt-2 md:pt-4">
                          <input
                            type="checkbox"
                            id="ribbon-hero-checkbox"
                            checked={ribbonShowHeroBadge}
                            onChange={(e) => setRibbonShowHeroBadge(e.target.checked)}
                            className="accent-gold w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="ribbon-hero-checkbox" className="text-xs text-white/80 cursor-pointer">
                            Show promotional badge on the Hero section
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="ribbon-enabled-checkbox"
                          checked={ribbonEnabled}
                          onChange={(e) => setRibbonEnabled(e.target.checked)}
                          className="accent-gold w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="ribbon-enabled-checkbox" className="text-xs text-white/90 font-bold cursor-pointer">
                          Display discount ribbon on top of the website
                        </label>
                      </div>
                    </div>

                    {/* Quick Campaign Presets */}
                    <div className="bg-stone-950/40 border border-white/10 p-4">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-white/70">
                          Quick Presets for Salon Campaigns
                        </span>
                        <span className="text-[10px] text-white/40">Click any preset to apply</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {RIBBON_PRESETS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleApplyPreset(p)}
                            className="text-left p-2.5 bg-stone-900 hover:bg-stone-850 border border-white/10 hover:border-gold/40 transition-colors group"
                          >
                            <p className="text-[11px] font-bold text-white group-hover:text-gold truncate">
                              {p.label}
                            </p>
                            <p className="text-[10px] text-white/50 truncate mt-0.5">
                              {p.highlight} • {p.suffix}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleResetRibbon}
                        className="h-9 px-3.5 text-xs uppercase tracking-wider font-bold text-white/50 hover:text-white flex items-center gap-1.5 border border-white/10 hover:border-white/20 transition-colors whitespace-nowrap"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Default</span>
                      </button>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setModalTab("list")}
                          className="h-9 px-4 text-xs uppercase tracking-wider font-bold text-white/60 hover:text-white transition-colors whitespace-nowrap"
                        >
                          Back to Services
                        </button>
                        <button
                          type="submit"
                          className="h-9 bg-gold text-secondary px-6 text-xs uppercase tracking-widest font-bold hover:bg-white flex items-center gap-2 shadow-lg shadow-gold/10 transition-colors whitespace-nowrap"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save & Apply Ribbon</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: LOOKBOOK PORTFOLIO MANAGER */}
              {modalTab === "lookbook" && (
                <div className="space-y-8 py-2">
                  {/* Header & Quick stats */}
                  <div className="bg-stone-950 border border-gold/30 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0 mt-0.5">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-serif italic text-gold font-bold">
                          Lookbook & Portfolio Manager
                        </h4>
                        <p className="text-xs text-white/60 font-sans mt-0.5">
                          Add, customize, and manage style photos shown to clients. Changes persist immediately in your local salon catalog.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          openLookbook();
                          setIsAdminOpen(false);
                        }}
                        className="h-8.5 px-3 text-[11px] uppercase tracking-wider font-bold bg-gold text-secondary hover:bg-white inline-flex items-center gap-1.5 transition-colors shadow-sm"
                        title="Open lookbook section and view it on the site"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View on Live Site</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetLookbook}
                        className="h-8.5 px-3 text-[11px] uppercase tracking-wider font-bold text-white/50 hover:text-white border border-white/15 hover:border-white/30 transition-colors inline-flex items-center gap-1.5"
                        title="Restore initial default salon styles"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Photos</span>
                      </button>
                    </div>
                  </div>

                  {/* Add New Lookbook Style Form */}
                  <div className="bg-stone-950/60 border border-white/10 p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-gold" />
                        <h5 className="text-sm uppercase tracking-wider font-bold text-white">
                          Add New Photo to Lookbook
                        </h5>
                      </div>

                      {/* Upload method toggle: File vs URL */}
                      <div className="flex items-center bg-stone-900 border border-white/15 p-0.5 text-xs">
                        <button
                          type="button"
                          onClick={() => setLbUploadMethod("file")}
                          className={`px-3 py-1 font-bold uppercase text-[10px] tracking-wider transition-colors ${
                            lbUploadMethod === "file"
                              ? "bg-gold text-secondary font-extrabold"
                              : "text-white/60 hover:text-white"
                          }`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setLbUploadMethod("url")}
                          className={`px-3 py-1 font-bold uppercase text-[10px] tracking-wider transition-colors ${
                            lbUploadMethod === "url"
                              ? "bg-gold text-secondary font-extrabold"
                              : "text-white/60 hover:text-white"
                          }`}
                        >
                          Image URL Link
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleAddLookbookSubmit} className="space-y-4">
                      {/* Image Input Section */}
                      {lbUploadMethod === "file" ? (
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1.5 font-bold">
                            Select Photo from Computer or Phone *
                          </label>
                          <div className="border-2 border-dashed border-white/20 hover:border-gold/60 p-4 transition-colors bg-stone-900/60 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              id="lb-file-input"
                              className="hidden"
                            />
                            <label
                              htmlFor="lb-file-input"
                              className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-3"
                            >
                              <UploadCloud className="w-8 h-8 text-gold animate-bounce" />
                              <span className="text-xs font-bold text-white hover:text-gold">
                                Click here to browse and choose an image
                              </span>
                              <span className="text-[10px] text-white/50">
                                Supports JPG, PNG, WEBP. Automatically optimized for fast loading.
                              </span>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1 font-bold">
                            Image or Video URL Link *
                          </label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/... or https://..."
                            value={newLbUrl}
                            onChange={(e) => {
                              setNewLbUrl(e.target.value);
                              setLbPreviewUrl(e.target.value);
                            }}
                            className="w-full h-9 bg-stone-900 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>
                      )}

                      {/* Image Preview if chosen */}
                      {isProcessingImage && (
                        <p className="text-xs text-gold animate-pulse">Optimizing and preparing image...</p>
                      )}
                      {lbPreviewUrl && (
                        <div className="flex items-center gap-4 bg-stone-900/80 p-3 border border-gold/30">
                          <img
                            src={lbPreviewUrl}
                            alt="Preview"
                            className="w-16 h-16 object-cover border border-white/20 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">Image ready for lookbook</p>
                            <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                              ✓ Ready to save
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setLbPreviewUrl(null);
                              setNewLbUrl("");
                            }}
                            className="text-xs text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      {/* Fields: Title, Category, Span, Description */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1 font-bold">
                            Style Title / Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Knotless Stitch Braids"
                            value={newLbTitle}
                            onChange={(e) => setNewLbTitle(e.target.value)}
                            className="w-full h-9 bg-stone-900 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1 font-bold">
                            Category *
                          </label>
                          <select
                            value={newLbCategory}
                            onChange={(e) => setNewLbCategory(e.target.value)}
                            className="w-full h-9 bg-stone-900 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                          >
                            <option value="Braids">Braids & Lines</option>
                            <option value="Nails">Nails & Acrylics</option>
                            <option value="Hair">Hair & Dreadlocks</option>
                            <option value="Makeup">Makeup & Soft Glam</option>
                            <option value="Lashes">Lashes & Brows</option>
                            <option value="Wigs">Wigs & Weaves</option>
                            <option value="Barber">Barber Cuts</option>
                            <option value="Other">Other Services</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1 font-bold">
                            Card Layout
                          </label>
                          <select
                            value={newLbSpan}
                            onChange={(e) => setNewLbSpan(e.target.value)}
                            className="w-full h-9 bg-stone-900 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                          >
                            <option value="col-span-1 row-span-1">Uniform Square (1:1 Equal Size)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1 font-bold">
                          Stylist Notes / Description (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 30 inches, includes hair extensions and blow dry"
                          value={newLbDescription}
                          onChange={(e) => setNewLbDescription(e.target.value)}
                          className="w-full h-9 bg-stone-900 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="h-9 px-6 bg-gold text-secondary font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors inline-flex items-center gap-2 shadow-md cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add to Lookbook</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Existing Lookbook Gallery List */}
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h5 className="text-sm uppercase tracking-wider font-bold text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-gold" />
                          <span>Current Lookbook Photos ({filteredLookbookItems.length})</span>
                        </h5>
                        <p className="text-[11px] text-white/50">
                          Photos and styles currently showcased in your customer Lookbook.
                        </p>
                      </div>

                      {/* Search & Filter */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-56">
                          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                          <input
                            type="text"
                            placeholder="Search lookbook..."
                            value={lbSearchQuery}
                            onChange={(e) => setLbSearchQuery(e.target.value)}
                            className="w-full h-8 pl-8 pr-3 bg-stone-950 border border-white/20 text-xs text-white focus:outline-none focus:border-gold"
                          />
                        </div>

                        <select
                          value={lbCategoryFilter}
                          onChange={(e) => setLbCategoryFilter(e.target.value)}
                          className="h-8 bg-stone-950 border border-white/20 px-2 text-xs text-white focus:outline-none focus:border-gold"
                        >
                          <option value="All">All Categories</option>
                          <option value="Braids">Braids</option>
                          <option value="Nails">Nails</option>
                          <option value="Hair">Hair</option>
                          <option value="Makeup">Makeup</option>
                          <option value="Lashes">Lashes</option>
                          <option value="Wigs">Wigs</option>
                          <option value="Barber">Barber</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {filteredLookbookItems.length === 0 ? (
                      <div className="text-center py-12 bg-stone-950/40 border border-white/10">
                        <Camera className="w-8 h-8 text-gold/40 mx-auto mb-2" />
                        <p className="text-white/60 text-xs">No lookbook photos match your filter.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {filteredLookbookItems.map((item) => {
                          const isVideo =
                            item.type === "video" ||
                            item.url.endsWith(".mp4") ||
                            item.url.endsWith(".webm");

                          return (
                            <div
                              key={item.id}
                              className="relative group bg-stone-950 border border-white/15 hover:border-gold transition-all overflow-hidden flex flex-col"
                            >
                              <div className="relative aspect-square w-full bg-black overflow-hidden">
                                {isVideo ? (
                                  <video
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                    muted
                                  />
                                ) : (
                                  <img
                                    src={item.url}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                )}
                                <span className="absolute top-1.5 left-1.5 text-[8.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-black/80 text-gold border border-gold/30">
                                  {item.category}
                                </span>
                              </div>

                              <div className="p-2.5 flex-1 flex flex-col justify-between">
                                <div>
                                  <h6 className="text-xs font-serif font-bold text-white line-clamp-1">
                                    {item.title}
                                  </h6>
                                  {item.description && (
                                    <p className="text-[10px] text-white/50 line-clamp-1 mt-0.5">
                                      {item.description}
                                    </p>
                                  )}
                                </div>

                                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(item.url);
                                      showToast("Image link copied!");
                                    }}
                                    className="text-[10px] text-white/50 hover:text-white uppercase font-bold flex items-center gap-1 cursor-pointer"
                                    title="Copy photo link"
                                  >
                                    <Copy className="w-3 h-3 text-gold" />
                                    <span>Copy</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLookbookItem(item.id, item.title)}
                                    className="text-[10px] text-rose-400 hover:text-rose-300 uppercase font-bold flex items-center gap-1 cursor-pointer"
                                    title="Delete from lookbook"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: BACKUP & SYNC */}
              {modalTab === "backup" && (
                <div className="max-w-2xl mx-auto py-2 space-y-8">
                  <div>
                    <h4 className="text-lg font-serif italic text-gold">Export & Sync Prices</h4>
                    <p className="text-xs text-white/50 mb-4">
                      Download or copy your customized price catalog so you can restore or transfer to other devices.
                    </p>

                    <div className="flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={handleCopyBackup}
                        className="h-9 px-4 bg-stone-850 hover:bg-gold hover:text-secondary text-white/90 text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 border border-white/15 transition-colors whitespace-nowrap"
                      >
                        <Copy className="w-3.5 h-3.5 text-gold" />
                        <span>{copiedBackup ? "Copied!" : "Copy Prices (JSON)"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadBackup}
                        className="h-9 px-4 bg-gold text-secondary hover:bg-white text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Backup File</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <h4 className="text-lg font-serif italic text-white mb-1">Import Price Catalog</h4>
                    <p className="text-xs text-white/50 mb-3">
                      Paste a previously exported JSON array of services to update all prices in one click.
                    </p>

                    <form onSubmit={handleImportSubmit} className="space-y-3">
                      <textarea
                        rows={6}
                        placeholder='[ { "name": "Soft Glam", "price": "1,500", "category": "Makeup" }, ... ]'
                        value={importJsonText}
                        onChange={(e) => setImportJsonText(e.target.value)}
                        className="w-full bg-stone-950 border border-white/20 p-3 text-xs font-mono text-white/90 focus:outline-none focus:border-gold"
                      />

                      {importError && (
                        <p className="text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {importError}
                        </p>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="h-9 px-5 bg-stone-800 hover:bg-gold hover:text-secondary text-white/90 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap border border-white/15"
                        >
                          Import & Apply Prices
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 4: CHANGE ADMIN PIN */}
              {modalTab === "pin" && (
                <div className="max-w-md mx-auto py-2">
                  <div className="mb-6">
                    <h4 className="text-lg font-serif italic text-gold">Update Manager PIN</h4>
                    <p className="text-xs text-white/50">
                      Set a custom 4+ digit PIN to protect price changes from unauthorized edits.
                    </p>
                  </div>

                  <form onSubmit={handleChangePinSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                        Current PIN *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Current PIN (e.g. 2540)"
                        value={oldPin}
                        onChange={(e) => setOldPin(e.target.value)}
                        className="w-full h-9 bg-stone-950 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                        New PIN (min 4 digits) *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="New PIN"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full h-9 bg-stone-950 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-white/60 block mb-1">
                        Confirm New PIN *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Confirm New PIN"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        className="w-full h-9 bg-stone-950 border border-white/20 px-3 text-xs text-white focus:outline-none focus:border-gold font-mono"
                      />
                    </div>

                    {pinChangeError && (
                      <p className="text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {pinChangeError}
                      </p>
                    )}

                    {pinChangeSuccess && (
                      <p className="text-xs text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        PIN changed successfully!
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full h-10 bg-gold text-secondary font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
                    >
                      Update Passcode
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-stone-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-white/40">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>Beauty Haven 254 Manager Console · Kamakis Bypass</span>
          </span>
          <span>Changes are stored immediately and update all customer rates</span>
        </div>
      </motion.div>
    </div>
  );
}
