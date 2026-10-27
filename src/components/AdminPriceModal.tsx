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
  Calendar,
  User,
  Phone,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Activity,
  FileText,
  Printer,
  CheckCircle2,
} from "lucide-react";
import { useServices, DiscountRibbonConfig, LookbookItem, AppointmentBooking } from "../context/ServiceContext";
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
    label: "Operating Hours & Welcome",
    prefix: "Welcome:",
    highlight: "WALK-INS & BOOKINGS",
    suffix: "Open Mon–Fri 8AM–9PM & Public Holidays at Bypass Kamakis",
    heroBadge: "MON–FRI 8AM–9PM • HOLIDAYS OPEN",
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
    bookings,
    updateBookingStatus,
    deleteBooking,
    openBookingModal,
  } = useServices();

  // Login PIN state
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  // Search & Filter
  const [activeCategory, setActiveCategory] = useState<"All" | ServiceCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // In-modal notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab mode in admin: "list" | "add" | "bookings" | "analytics" | "ribbon" | "lookbook" | "backup" | "pin"
  const [modalTab, setModalTab] = useState<
    "list" | "add" | "bookings" | "analytics" | "ribbon" | "lookbook" | "backup" | "pin"
  >("list");

  // Booking Filter State
  const [bookingFilter, setBookingFilter] = useState<"All" | "Pending" | "Confirmed" | "Completed">("All");

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
      setPinError("Incorrect administrative PIN. Please try again.");
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

  // Comprehensive salon performance & analytics metrics
  const analyticsData = useMemo(() => {
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.status === "Pending");
    const confirmedBookings = bookings.filter((b) => b.status === "Confirmed");
    const completedBookings = bookings.filter((b) => b.status === "Completed");
    const cancelledBookings = bookings.filter((b) => b.status === "Cancelled");

    const conversionRate =
      totalBookings > 0
        ? Math.round(((confirmedBookings.length + completedBookings.length) / totalBookings) * 100)
        : 0;

    const extractPrice = (priceStr?: string) => {
      if (!priceStr) return 0;
      const numMatch = priceStr.match(/\d[\d,]*/);
      if (!numMatch) return 0;
      return parseInt(numMatch[0].replace(/,/g, ""), 10) || 0;
    };

    let totalPipelineValue = 0;
    let confirmedValue = 0;
    let completedValue = 0;

    bookings.forEach((b) => {
      let price = extractPrice(b.servicePrice);
      if (price === 0) {
        const found = services.find((s) => s.name.toLowerCase() === b.serviceName.toLowerCase());
        if (found) price = extractPrice(found.price);
      }
      totalPipelineValue += price;
      if (b.status === "Confirmed") confirmedValue += price;
      if (b.status === "Completed") completedValue += price;
    });

    const categoryStats = CATEGORY_OPTIONS.map((cat) => {
      const catServices = services.filter((s) => s.category === cat);
      const catBookings = bookings.filter((b) => {
        if (b.serviceCategory?.toLowerCase() === cat.toLowerCase()) return true;
        const matched = services.find((s) => s.name.toLowerCase() === b.serviceName.toLowerCase());
        return matched?.category.toLowerCase() === cat.toLowerCase();
      });
      const pct = totalBookings > 0 ? Math.round((catBookings.length / totalBookings) * 100) : 0;
      return {
        category: cat,
        servicesCount: catServices.length,
        bookingsCount: catBookings.length,
        percent: pct,
      };
    });

    let minPrice = Infinity;
    let maxPrice = 0;
    let sumPrice = 0;
    let validPricesCount = 0;

    services.forEach((s) => {
      const p = extractPrice(s.price);
      if (p > 0) {
        if (p < minPrice) minPrice = p;
        if (p > maxPrice) maxPrice = p;
        sumPrice += p;
        validPricesCount += 1;
      }
    });

    const avgPrice = validPricesCount > 0 ? Math.round(sumPrice / validPricesCount) : 0;
    const popularCount = services.filter((s) => s.isPopular).length;

    return {
      totalBookings,
      pendingCount: pendingBookings.length,
      confirmedCount: confirmedBookings.length,
      completedCount: completedBookings.length,
      cancelledCount: cancelledBookings.length,
      conversionRate,
      totalPipelineValue,
      confirmedValue,
      completedValue,
      categoryStats,
      minPrice: minPrice === Infinity ? 0 : minPrice,
      maxPrice,
      avgPrice,
      totalServices: services.length,
      popularCount,
      totalLookbook: lookbookItems.length,
    };
  }, [bookings, services, lookbookItems]);

  const handleCopyAnalyticsSummary = () => {
    const text = `📊 BEAUTY HAVEN 254 — SALON ANALYTICS REPORT
Generated: ${new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
-------------------------------------------
📅 APPOINTMENTS & INQUIRIES:
• Total Requests: ${analyticsData.totalBookings}
• Confirmed Appointments: ${analyticsData.confirmedCount} (${analyticsData.conversionRate}% confirmation rate)
• Pending Inquiries: ${analyticsData.pendingCount}
• Completed Services: ${analyticsData.completedCount}
• Cancelled: ${analyticsData.cancelledCount}
• Estimated Bookings Pipeline: KSh ${analyticsData.totalPipelineValue.toLocaleString()}
• Confirmed Pipeline Value: KSh ${analyticsData.confirmedValue.toLocaleString()}

💇 DEPARTMENT POPULARITY & SHARE:
${analyticsData.categoryStats
  .map(
    (c) =>
      `• ${c.category}: ${c.bookingsCount} inquiries (${c.percent}% of demand) — ${c.servicesCount} services listed`
  )
  .join("\n")}

💰 CATALOG OVERVIEW:
• Total Services: ${analyticsData.totalServices}
• Price Spectrum: KSh ${analyticsData.minPrice.toLocaleString()} - KSh ${analyticsData.maxPrice.toLocaleString()}
• Average Service Value: KSh ${analyticsData.avgPrice.toLocaleString()}
• Lookbook Portfolio Assets: ${analyticsData.totalLookbook} live styles

📍 LOCATION & HOURS:
Bypass Kamakis opposite 1.7, 1st Floor Shop 109, Nairobi
Mon–Fri: 8:00 AM – 9:00 PM | Public Holidays: Open (8AM - 9PM) | Sunday: Closed
Contact: +254 796 709521`;

    navigator.clipboard.writeText(text);
    showToast("Analytics summary report copied to clipboard!");
  };

  const generateReportHtml = (forWord: boolean = false) => {
    const reportDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const bookingsRows =
      bookings.length > 0
        ? bookings
            .map(
              (b, idx) => `
        <tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#faf7f2"};">
          <td style="padding: 8px 10px; border: 1px solid #d4c5b3; font-family: monospace; font-size: 11px; font-weight: bold; color: #85581A;">${b.id}</td>
          <td style="padding: 8px 10px; border: 1px solid #d4c5b3; font-weight: bold; color: #1c1917;">${b.clientName}</td>
          <td style="padding: 8px 10px; border: 1px solid #d4c5b3; font-family: monospace; font-size: 11px;">${b.clientPhone}</td>
          <td style="padding: 8px 10px; border: 1px solid #d4c5b3;">${b.serviceName}</td>
          <td style="padding: 8px 10px; border: 1px solid #d4c5b3; text-transform: uppercase; font-size: 10px; color: #666;">${b.serviceCategory || "General"}</td>
          <td style="padding: 8px 10px; border: 1px solid #d4c5b3; font-weight: bold; color: #85581A;">${b.servicePrice || "—"}</td>
          <td style="padding: 8px 10px; border: 1px solid #d4c5b3;">${b.preferredDate || "Not set"}</td>
          <td style="padding: 8px 10px; border: 1px solid #d4c5b3;">${b.preferredTime || "Anytime"}</td>
          <td style="padding: 8px 10px; border: 1px solid #d4c5b3; font-weight: bold; color: ${
            b.status === "Confirmed"
              ? "#047857"
              : b.status === "Completed"
              ? "#1d4ed8"
              : "#b45309"
          };">${b.status}</td>
          <td style="padding: 8px 10px; border: 1px solid #d4c5b3; font-size: 11px; color: #555;">${b.notes || "—"}</td>
        </tr>`
            )
            .join("")
        : `<tr><td colspan="10" style="padding: 16px; text-align: center; color: #78716c; border: 1px solid #d4c5b3; font-style: italic;">No client appointment requests currently logged in register.</td></tr>`;

    const categoryRows = analyticsData.categoryStats
      .map(
        (c) => `
      <tr style="border-bottom: 1px solid #e5e0d8;">
        <td style="padding: 8px 12px; font-weight: bold; color: #1c1917;">${c.category}</td>
        <td style="padding: 8px 12px; text-align: center; color: #555;">${c.servicesCount} services</td>
        <td style="padding: 8px 12px; text-align: center; font-weight: bold; color: #85581A;">${c.bookingsCount} requests</td>
        <td style="padding: 8px 12px; text-align: right; font-weight: bold; color: #1c1917;">${c.percent}% demand share</td>
      </tr>`
      )
      .join("");

    return `<!DOCTYPE html>
${
  forWord
    ? '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">'
    : "<html>"
}
<head>
<meta charset="utf-8">
<title>Beauty Haven 254 — Executive Salon Performance Report</title>
<style>
  @page { size: A4 landscape; margin: 12mm; }
  body {
    font-family: ${
      forWord
        ? "'Calibri', 'Segoe UI', Arial, sans-serif"
        : "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    };
    color: #1c1917;
    margin: ${forWord ? "20px" : "24px auto"};
    max-width: 1100px;
    background: #ffffff;
    line-height: 1.4;
  }
  .header-card {
    border-bottom: 3px solid #D4AF37;
    padding-bottom: 14px;
    margin-bottom: 20px;
  }
  .salon-title {
    font-size: 22pt;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #1A120B;
    margin: 0;
    text-transform: uppercase;
  }
  .salon-tag {
    font-size: 10pt;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #85581A;
    font-weight: 700;
    margin-top: 3px;
  }
  .kpi-grid {
    width: 100%;
    border-collapse: separate;
    border-spacing: 6px;
    margin-bottom: 20px;
  }
  .kpi-cell {
    background: #faf7f2;
    border: 1px solid #d4c5b3;
    padding: 10px 12px;
    text-align: center;
  }
  .kpi-num {
    font-size: 18pt;
    font-weight: 800;
    color: #85581A;
    line-height: 1.1;
  }
  .kpi-lbl {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #57534e;
    margin-top: 3px;
    font-weight: 600;
  }
  .section-h {
    font-size: 11.5pt;
    font-weight: 700;
    color: #1c1917;
    border-left: 4px solid #D4AF37;
    padding-left: 8px;
    margin: 20px 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6px;
    font-size: 9pt;
  }
  table.data-table th {
    background: #1A120B;
    color: #D4AF37;
    padding: 8px 10px;
    font-size: 8.5pt;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid #1A120B;
  }
  .footer-note {
    margin-top: 25px;
    padding-top: 12px;
    border-top: 1px solid #e5e0d8;
    font-size: 8pt;
    color: #78716c;
  }
  @media print {
    body { margin: 0; padding: 0; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
  <div class="header-card">
    <table style="width: 100%;">
      <tr>
        <td style="vertical-align: top;">
          <h1 class="salon-title">Beauty Haven 254</h1>
          <div class="salon-tag">Executive Salon & Spa Performance Report</div>
          <div style="font-size: 8.5pt; color: #57534e; margin-top: 4px;">
            Bypass Kamakis opposite 1.7, 1st Floor Shop 109, Nairobi • Tel: +254 796 709521
          </div>
        </td>
        <td style="vertical-align: top; text-align: right; font-size: 8.5pt; color: #57534e;">
          <strong>Generated:</strong> ${reportDate}<br>
          <strong>Total Bookings:</strong> ${analyticsData.totalBookings}<br>
          <strong>Pipeline Value:</strong> KSh ${analyticsData.totalPipelineValue.toLocaleString()}
        </td>
      </tr>
    </table>
  </div>

  <table class="kpi-grid">
    <tr>
      <td class="kpi-cell">
        <div class="kpi-num">${analyticsData.totalBookings}</div>
        <div class="kpi-lbl">Total Requests</div>
      </td>
      <td class="kpi-cell">
        <div class="kpi-num" style="color: #047857;">${analyticsData.conversionRate}%</div>
        <div class="kpi-lbl">Confirmation Rate (${analyticsData.confirmedCount} Confirmed)</div>
      </td>
      <td class="kpi-cell">
        <div class="kpi-num">KSh ${analyticsData.totalPipelineValue.toLocaleString()}</div>
        <div class="kpi-lbl">Est. Booking Pipeline</div>
      </td>
      <td class="kpi-cell">
        <div class="kpi-num" style="color: #1d4ed8;">${analyticsData.totalServices}</div>
        <div class="kpi-lbl">Active Services</div>
      </td>
    </tr>
  </table>

  <div class="section-h">Appointments & Booking Inquiries Register (${bookings.length})</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 70px;">ID</th>
        <th>Client Name</th>
        <th>Phone</th>
        <th>Service</th>
        <th>Category</th>
        <th>Price</th>
        <th>Date</th>
        <th>Time</th>
        <th>Status</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      ${bookingsRows}
    </tbody>
  </table>

  <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
    <tr>
      <td style="width: 60%; vertical-align: top; padding-right: 15px;">
        <div class="section-h">Department Popularity & Share</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Department</th>
              <th style="text-align: center;">Catalog</th>
              <th style="text-align: center;">Inquiries</th>
              <th style="text-align: right;">Demand Share</th>
            </tr>
          </thead>
          <tbody>
            ${categoryRows}
          </tbody>
        </table>
      </td>
      <td style="width: 40%; vertical-align: top;">
        <div class="section-h">Operational Schedule</div>
        <div style="background: #faf7f2; border: 1px solid #d4c5b3; padding: 12px; font-size: 8.5pt;">
          <div style="margin-bottom: 4px;"><strong>• MON - FRI:</strong> 8:00 AM - 9:00 PM</div>
          <div style="margin-bottom: 4px; color: #047857;"><strong>• PUBLIC HOLIDAYS:</strong> OPEN (8:00 AM - 9:00 PM)</div>
          <div style="margin-bottom: 8px; color: #b45309;"><strong>• SUNDAY:</strong> CLOSED</div>
          <div style="border-top: 1px solid #e0d5c1; padding-top: 6px; color: #57534e;">
            Price Spectrum: KSh ${analyticsData.minPrice.toLocaleString()} - KSh ${analyticsData.maxPrice.toLocaleString()} (Average: KSh ${analyticsData.avgPrice.toLocaleString()})
          </div>
        </div>
      </td>
    </tr>
  </table>

  <div class="footer-note">
    <table style="width: 100%;">
      <tr>
        <td>Beauty Haven 254 — Where Beauty Meets Confidence. Bypass Kamakis, Nairobi.</td>
        <td style="text-align: right;">Confidential Salon Management Document</td>
      </tr>
    </table>
  </div>
</body>
</html>`;
  };

  // Export as formatted Microsoft Word document (.doc)
  const handleExportWordDoc = () => {
    const htmlContent = generateReportHtml(true);
    const blob = new Blob(["\ufeff", htmlContent], {
      type: "application/msword;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `beauty-haven-254-salon-report-${new Date().toISOString().slice(0, 10)}.doc`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Report exported as Microsoft Word (.doc) document!");
  };

  // Export as formatted PDF document (via high-resolution printable report)
  const handleExportPdf = () => {
    const htmlContent = generateReportHtml(false);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 350);
      showToast("PDF print & save window opened!");
    } else {
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `beauty-haven-254-salon-report-${new Date().toISOString().slice(0, 10)}.html`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Report downloaded! Open and press Ctrl+P to save as PDF.");
    }
  };

  const handleExportBookingsCsv = () => {
    if (bookings.length === 0) {
      showToast("No bookings to export yet.");
      return;
    }
    const headers = [
      "ID",
      "Client Name",
      "Phone",
      "Service",
      "Category",
      "Price",
      "Preferred Date",
      "Preferred Time",
      "Status",
      "Created At",
      "Notes",
    ];
    const rows = bookings.map((b) => [
      `"${b.id}"`,
      `"${b.clientName.replace(/"/g, '""')}"`,
      `"${b.clientPhone.replace(/"/g, '""')}"`,
      `"${b.serviceName.replace(/"/g, '""')}"`,
      `"${(b.serviceCategory || "").replace(/"/g, '""')}"`,
      `"${(b.servicePrice || "").replace(/"/g, '""')}"`,
      `"${b.preferredDate || ""}"`,
      `"${b.preferredTime || ""}"`,
      `"${b.status}"`,
      `"${b.createdAt}"`,
      `"${(b.notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `beauty-haven-254-bookings-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Bookings exported as CSV file!");
  };

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
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-gold/70 shrink-0 shadow-md bg-stone-950 flex items-center justify-center">
                <img
                  src="/beauty-haven-logo.jpg"
                  alt="Beauty Haven 254 Logo"
                  className="w-full h-full object-cover"
                />
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
                    onClick={() => setModalTab("bookings")}
                    className={`h-8 sm:h-9 px-3 sm:px-3.5 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0 ${
                      modalTab === "bookings"
                        ? "bg-gold text-secondary shadow-sm"
                        : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Bookings</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-stone-900 text-gold border border-gold/30 font-mono font-bold">
                      {bookings.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setModalTab("analytics")}
                    className={`h-8 sm:h-9 px-3 sm:px-3.5 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-1.5 shrink-0 ${
                      modalTab === "analytics"
                        ? "bg-gold text-secondary shadow-sm"
                        : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Analytics</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                      LIVE
                    </span>
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

              {/* TAB: BOOKINGS & APPOINTMENT MANAGER */}
              {modalTab === "bookings" && (
                <div className="space-y-6">
                  {/* Stats Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-stone-950 border border-white/10">
                      <span className="text-[10px] uppercase tracking-wider text-white/50 block">Total Requests</span>
                      <span className="text-xl font-bold font-mono text-white">{bookings.length}</span>
                    </div>
                    <div className="p-3 bg-stone-950 border border-amber-500/30">
                      <span className="text-[10px] uppercase tracking-wider text-amber-300 block">Pending</span>
                      <span className="text-xl font-bold font-mono text-amber-400">
                        {bookings.filter((b) => b.status === "Pending").length}
                      </span>
                    </div>
                    <div className="p-3 bg-stone-950 border border-emerald-500/30">
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300 block">Confirmed</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">
                        {bookings.filter((b) => b.status === "Confirmed").length}
                      </span>
                    </div>
                    <div className="p-3 bg-stone-950 border border-blue-500/30">
                      <span className="text-[10px] uppercase tracking-wider text-blue-300 block">Completed</span>
                      <span className="text-xl font-bold font-mono text-blue-400">
                        {bookings.filter((b) => b.status === "Completed").length}
                      </span>
                    </div>
                  </div>

                  {/* Filter and Actions Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-white/50 mr-1">Filter:</span>
                      {(["All", "Pending", "Confirmed", "Completed"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setBookingFilter(st)}
                          className={`text-xs px-3 py-1 font-bold uppercase tracking-wider transition-colors ${
                            bookingFilter === st
                              ? "bg-gold text-secondary"
                              : "bg-white/5 text-white/60 hover:text-white"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleExportWordDoc}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white border border-blue-400/40 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        title="Download bookings as Microsoft Word (.doc)"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>Export Word</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleExportPdf}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold hover:bg-white text-secondary text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        title="Save or print bookings as PDF document"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Export PDF</span>
                      </button>
                      <button
                        onClick={() => openBookingModal()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Booking</span>
                      </button>
                    </div>
                  </div>

                  {/* Bookings List */}
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/10 bg-stone-950/40 p-8 space-y-3">
                      <Calendar className="w-10 h-10 text-gold/40 mx-auto" />
                      <h4 className="text-lg font-serif italic text-white">No Appointment Requests Yet</h4>
                      <p className="text-xs text-white/50 max-w-md mx-auto">
                        When clients book via the website by entering their name, phone number, and choosing their service, their appointments appear here for tracking and confirmation.
                      </p>
                      <button
                        onClick={() => openBookingModal()}
                        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-secondary text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors cursor-pointer"
                      >
                        Launch Booking Modal
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings
                        .filter((b) => (bookingFilter === "All" ? true : b.status === bookingFilter))
                        .map((b) => {
                          const cleanTel = b.clientPhone.replace(/\D/g, "");
                          const waDirectUrl = `https://wa.me/${cleanTel.startsWith("0") ? `254${cleanTel.slice(1)}` : cleanTel}?text=${encodeURIComponent(
                            `Hello ${b.clientName}, Beauty Haven 254 confirming your appointment for ${b.serviceName} on ${b.preferredDate || "your requested date"} at ${b.preferredTime || "your requested time"}! Ref: ${b.id}`
                          )}`;

                          return (
                            <div
                              key={b.id}
                              className="p-4 bg-stone-950 border border-white/10 hover:border-gold/40 transition-colors flex flex-col md:flex-row justify-between gap-4"
                            >
                              {/* Left: Client info */}
                              <div className="space-y-1 md:w-1/3">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-900 border border-gold/30 text-gold font-bold">
                                    {b.id}
                                  </span>
                                  <span
                                    className={`text-[9px] uppercase px-2 py-0.5 font-bold ${
                                      b.status === "Confirmed"
                                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                                        : b.status === "Pending"
                                        ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                                        : b.status === "Completed"
                                        ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                                        : "bg-stone-900 text-stone-400"
                                    }`}
                                  >
                                    {b.status}
                                  </span>
                                </div>
                                <h4 className="text-base font-bold text-white flex items-center gap-1.5 pt-1">
                                  <User className="w-3.5 h-3.5 text-gold" />
                                  {b.clientName}
                                </h4>
                                <p className="text-xs font-mono text-gold/90 flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-white/50" />
                                  {b.clientPhone}
                                </p>
                                <span className="text-[10px] text-white/40 block">
                                  Received: {new Date(b.createdAt).toLocaleDateString()} {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              {/* Middle: Service & Timing */}
                              <div className="space-y-1 md:w-1/3 text-xs">
                                <div className="text-white/50 text-[10px] uppercase tracking-wider">Service Chosen</div>
                                <p className="text-sm font-semibold text-white">
                                  {b.serviceName}
                                  {b.servicePrice && (
                                    <span className="text-gold ml-2 font-mono">
                                      (KSh {cleanPrice(b.servicePrice)})
                                    </span>
                                  )}
                                </p>
                                <div className="text-white/70 pt-1 flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-gold/70" />
                                  <span>{b.preferredDate || "Flexible"}</span>
                                  <span className="text-white/30">•</span>
                                  <span>{b.preferredTime || "Flexible"}</span>
                                </div>
                                {b.notes && (
                                  <p className="text-[11px] text-white/60 italic pt-1 border-t border-white/5 mt-1">
                                    Notes: {b.notes}
                                  </p>
                                )}
                              </div>

                              {/* Right: Actions */}
                              <div className="flex md:flex-col justify-between items-end gap-2 md:w-1/4">
                                <div className="flex items-center gap-2">
                                  <select
                                    value={b.status}
                                    onChange={(e) =>
                                      updateBookingStatus(
                                        b.id,
                                        e.target.value as AppointmentBooking["status"]
                                      )
                                    }
                                    className="bg-stone-900 border border-white/20 text-white text-xs px-2 py-1.5 focus:outline-none focus:border-gold"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>

                                  <button
                                    onClick={() => deleteBooking(b.id)}
                                    className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                                    title="Delete booking entry"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <a
                                  href={waDirectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                                  <span>Message Client</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: SALON ANALYTICS & BUSINESS INTELLIGENCE */}
              {modalTab === "analytics" && (
                <div className="space-y-6">
                  {/* Header & Export Actions */}
                  <div className="p-4 sm:p-5 bg-stone-950 border border-gold/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-widest font-bold mb-1">
                        <Activity className="w-3.5 h-3.5" />
                        <span>Live Business Intelligence</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif italic text-white">
                        Salon Performance & Analytics
                      </h3>
                      <p className="text-xs text-white/60 mt-1 max-w-xl font-sans">
                        Real-time analytics aggregated from client booking requests, catalog pricing, and department demand at Beauty Haven 254.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleCopyAnalyticsSummary}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-850 text-gold border border-gold/40 text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                        title="Copy formatted summary to clipboard"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Summary</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleExportWordDoc}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white border border-blue-400/50 hover:border-blue-400 text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-sm"
                        title="Download executive report as Microsoft Word (.doc) document"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>Export Word (.doc)</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleExportPdf}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gold hover:bg-white text-secondary text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-md"
                        title="Save or print report directly as PDF"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Export PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Primary KPI Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* KPI 1 */}
                    <div className="p-4 bg-stone-950 border border-white/10 hover:border-gold/40 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                          Total Inquiries
                        </span>
                        <div className="p-1.5 bg-white/5 text-gold border border-gold/20">
                          <Calendar className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">
                        {analyticsData.totalBookings}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-white/60">
                        <span>{analyticsData.confirmedCount} confirmed</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {analyticsData.conversionRate}% rate
                        </span>
                      </div>
                    </div>

                    {/* KPI 2 */}
                    <div className="p-4 bg-stone-950 border border-gold/30 hover:border-gold transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                          Est. Pipeline Value
                        </span>
                        <div className="p-1.5 bg-gold/10 text-gold border border-gold/30">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-gold mb-1">
                        KSh {analyticsData.totalPipelineValue.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-white/60 flex items-center justify-between">
                        <span>Confirmed:</span>
                        <span className="text-white font-mono font-bold">
                          KSh {analyticsData.confirmedValue.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* KPI 3 */}
                    <div className="p-4 bg-stone-950 border border-white/10 hover:border-gold/40 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                          Active Catalog
                        </span>
                        <div className="p-1.5 bg-white/5 text-white/70 border border-white/20">
                          <Tag className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">
                        {analyticsData.totalServices} <span className="text-xs text-white/50 font-sans">Services</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-white/60">
                        <span>Avg Ticket Size</span>
                        <span className="text-gold font-mono font-bold">
                          KSh {analyticsData.avgPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* KPI 4 */}
                    <div className="p-4 bg-stone-950 border border-white/10 hover:border-gold/40 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                          Lookbook Assets
                        </span>
                        <div className="p-1.5 bg-white/5 text-purple-300 border border-purple-500/20">
                          <Camera className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-white mb-1">
                        {analyticsData.totalLookbook} <span className="text-xs text-white/50 font-sans">Styles</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-white/60">
                        <span>{analyticsData.popularCount} Popular flagged</span>
                        <span className="text-purple-400 font-bold">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Row: Funnel Pipeline & Department Demand */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status Funnel */}
                    <div className="p-5 bg-stone-950 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Appointment Pipeline Funnel</span>
                        </h4>
                        <span className="text-[10px] text-white/50 uppercase tracking-widest">
                          {analyticsData.totalBookings} Total Logged
                        </span>
                      </div>

                      <div className="space-y-3">
                        {/* Pending */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              Pending Action
                            </span>
                            <span className="font-mono text-white">
                              {analyticsData.pendingCount} (
                              {analyticsData.totalBookings > 0
                                ? Math.round((analyticsData.pendingCount / analyticsData.totalBookings) * 100)
                                : 0}
                              %)
                            </span>
                          </div>
                          <div className="w-full bg-stone-900 h-2 rounded-none overflow-hidden border border-white/10">
                            <div
                              className="bg-amber-400 h-full transition-all duration-500"
                              style={{
                                width: `${
                                  analyticsData.totalBookings > 0
                                    ? (analyticsData.pendingCount / analyticsData.totalBookings) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Confirmed */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              Confirmed by Salon
                            </span>
                            <span className="font-mono text-white">
                              {analyticsData.confirmedCount} (
                              {analyticsData.totalBookings > 0
                                ? Math.round((analyticsData.confirmedCount / analyticsData.totalBookings) * 100)
                                : 0}
                              %)
                            </span>
                          </div>
                          <div className="w-full bg-stone-900 h-2 rounded-none overflow-hidden border border-white/10">
                            <div
                              className="bg-emerald-400 h-full transition-all duration-500"
                              style={{
                                width: `${
                                  analyticsData.totalBookings > 0
                                    ? (analyticsData.confirmedCount / analyticsData.totalBookings) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Completed */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-blue-300 font-semibold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-400" />
                              Completed Visits
                            </span>
                            <span className="font-mono text-white">
                              {analyticsData.completedCount} (
                              {analyticsData.totalBookings > 0
                                ? Math.round((analyticsData.completedCount / analyticsData.totalBookings) * 100)
                                : 0}
                              %)
                            </span>
                          </div>
                          <div className="w-full bg-stone-900 h-2 rounded-none overflow-hidden border border-white/10">
                            <div
                              className="bg-blue-400 h-full transition-all duration-500"
                              style={{
                                width: `${
                                  analyticsData.totalBookings > 0
                                    ? (analyticsData.completedCount / analyticsData.totalBookings) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Cancelled */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-stone-400 font-semibold flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-stone-500" />
                              Cancelled / Declined
                            </span>
                            <span className="font-mono text-white">
                              {analyticsData.cancelledCount} (
                              {analyticsData.totalBookings > 0
                                ? Math.round((analyticsData.cancelledCount / analyticsData.totalBookings) * 100)
                                : 0}
                              %)
                            </span>
                          </div>
                          <div className="w-full bg-stone-900 h-2 rounded-none overflow-hidden border border-white/10">
                            <div
                              className="bg-stone-500 h-full transition-all duration-500"
                              style={{
                                width: `${
                                  analyticsData.totalBookings > 0
                                    ? (analyticsData.cancelledCount / analyticsData.totalBookings) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                        <span className="text-white/60">Need to manage individual client appointments?</span>
                        <button
                          type="button"
                          onClick={() => setModalTab("bookings")}
                          className="text-gold hover:underline font-bold text-xs"
                        >
                          Open Bookings →
                        </button>
                      </div>
                    </div>

                    {/* Department Demand Breakdown */}
                    <div className="p-5 bg-stone-950 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-gold" />
                          <span>Department Popularity & Share</span>
                        </h4>
                        <span className="text-[10px] text-white/50 uppercase tracking-widest">
                          5 Core Studios
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        {analyticsData.categoryStats.map((cat) => (
                          <div key={cat.category}>
                            <div className="flex justify-between items-center text-xs mb-1">
                              <span className="text-white font-medium">
                                {cat.category}
                                <span className="text-white/40 text-[10px] ml-1.5">
                                  ({cat.servicesCount} services listed)
                                </span>
                              </span>
                              <span className="font-mono text-gold font-bold">
                                {cat.bookingsCount} inquiries ({cat.percent}%)
                              </span>
                            </div>
                            <div className="w-full bg-stone-900 h-2 border border-white/10 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-gold/60 to-gold h-full transition-all duration-500"
                                style={{
                                  width: `${Math.max(cat.percent, cat.bookingsCount > 0 ? 8 : 2)}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                        <span className="text-white/60">Want to add or edit services in a department?</span>
                        <button
                          type="button"
                          onClick={() => setModalTab("list")}
                          className="text-gold hover:underline font-bold text-xs"
                        >
                          Edit Services →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Catalog Pricing Breakdown & Salon Operational Schedule */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Catalog Price Health */}
                    <div className="p-4 bg-stone-950 border border-white/10 space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-gold font-bold block">
                        Catalog Price Range
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold font-mono text-white">
                          KSh {analyticsData.minPrice.toLocaleString()}
                        </span>
                        <span className="text-white/40 text-xs">to</span>
                        <span className="text-lg font-bold font-mono text-gold">
                          KSh {analyticsData.maxPrice.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">
                        Prices range from entry services (e.g., standard gel polish) up to full VIP bridal glam sessions.
                      </p>
                    </div>

                    {/* Operational Readiness */}
                    <div className="p-4 bg-stone-950 border border-white/10 space-y-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-gold font-bold block">
                        Salon Business Hours
                      </span>
                      <p className="text-xs text-white/90 font-mono">
                        MON - FRI: 8:00 AM - 9:00 PM
                      </p>
                      <p className="text-xs text-emerald-400 font-mono font-semibold">
                        PUBLIC HOLIDAYS: OPEN (8AM - 9PM)
                      </p>
                      <p className="text-xs text-amber-400 font-mono font-semibold">
                        SUNDAY: CLOSED
                      </p>
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="p-4 bg-stone-950 border border-white/10 space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-gold font-bold block">
                        Admin Controls
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setModalTab("bookings")}
                          className="p-2 text-left bg-stone-900 hover:bg-stone-800 text-xs text-white border border-white/10"
                        >
                          📋 Bookings
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalTab("list")}
                          className="p-2 text-left bg-stone-900 hover:bg-stone-800 text-xs text-white border border-white/10"
                        >
                          🏷️ Services
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalTab("ribbon")}
                          className="p-2 text-left bg-stone-900 hover:bg-stone-800 text-xs text-white border border-white/10"
                        >
                          📢 Discount Ribbon
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalTab("lookbook")}
                          className="p-2 text-left bg-stone-900 hover:bg-stone-800 text-xs text-white border border-white/10"
                        >
                          📷 Lookbook
                        </button>
                      </div>
                    </div>
                  </div>
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
                        placeholder="Enter current PIN"
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
