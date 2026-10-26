import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  Phone,
  User,
  CheckCircle2,
  ChevronDown,
  Search,
  ArrowRight,
  MessageSquare,
  Scissors,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useServices, AppointmentBooking } from "../context/ServiceContext";
import { cleanPrice, Service } from "../constants";

const SALON_WHATSAPP_NUMBER = "254796709521";

const TIME_SLOTS = [
  { id: "morning", label: "Morning", sub: "8:00 AM – 12:00 PM" },
  { id: "afternoon", label: "Afternoon", sub: "12:00 PM – 5:00 PM" },
  { id: "evening", label: "Evening", sub: "5:00 PM – 9:00 PM" },
  { id: "custom", label: "Specific Time", sub: "8:00 AM – 9:00 PM" },
];

const SUGGESTED_TIMES = [
  "8:30 AM",
  "10:00 AM",
  "11:30 AM",
  "1:00 PM",
  "2:30 PM",
  "4:00 PM",
  "5:30 PM",
  "7:00 PM",
  "8:00 PM",
];

export default function BookingModal() {
  const {
    isBookingOpen,
    closeBookingModal,
    bookingPreselectedService,
    services,
    addBooking,
  } = useServices();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedServiceName, setSelectedServiceName] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [serviceSearch, setServiceSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Date selection
  const [dateOption, setDateOption] = useState<"today" | "tomorrow" | "custom">("today");
  const [customDate, setCustomDate] = useState("");
  const [isPublicHoliday, setIsPublicHoliday] = useState(false);

  // Time selection
  const [timeOption, setTimeOption] = useState<string>("afternoon");
  const [customTime, setCustomTime] = useState("");

  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Post-submission state
  const [submittedBooking, setSubmittedBooking] = useState<AppointmentBooking | null>(null);

  // Group categories from available services
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add("All");
    services.forEach((s) => set.add(s.category));
    return Array.from(set);
  }, [services]);

  // Selected Service object
  const activeService = useMemo(() => {
    if (!selectedServiceName) return null;
    return services.find(
      (s) => s.name.toLowerCase() === selectedServiceName.toLowerCase()
    );
  }, [services, selectedServiceName]);

  // Filtered services for the selector
  const availableServices = useMemo(() => {
    return services.filter((s) => {
      const matchCat = categoryFilter === "All" || s.category === categoryFilter;
      const q = serviceSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [services, categoryFilter, serviceSearch]);

  // Check if days are Sunday (day === 0)
  const todayIsSunday = useMemo(() => new Date().getDay() === 0, []);
  const tomorrowIsSunday = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.getDay() === 0;
  }, []);

  const isSelectedDateSunday = useMemo(() => {
    if (dateOption === "today") return todayIsSunday;
    if (dateOption === "tomorrow") return tomorrowIsSunday;
    if (dateOption === "custom" && customDate) {
      // YYYY-MM-DD parse safely
      const parts = customDate.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.getDay() === 0;
      }
    }
    return false;
  }, [dateOption, customDate, todayIsSunday, tomorrowIsSunday]);

  // Initialize pre-selected service when modal opens
  useEffect(() => {
    if (!isBookingOpen) {
      setSubmittedBooking(null);
      setFormError(null);
      setIsPublicHoliday(false);
      return;
    }

    // If today is Sunday, default recommendation to tomorrow (Monday)
    if (todayIsSunday && dateOption === "today") {
      setDateOption("tomorrow");
    }

    if (bookingPreselectedService) {
      // Check if it matches a service directly
      const exact = services.find(
        (s) =>
          s.name.toLowerCase() === bookingPreselectedService.toLowerCase() ||
          s.name.toLowerCase().includes(bookingPreselectedService.toLowerCase())
      );
      if (exact) {
        setSelectedServiceName(exact.name);
        setCategoryFilter(exact.category);
      } else {
        // Check if it matches a category
        const cat = categories.find(
          (c) => c.toLowerCase() === bookingPreselectedService.toLowerCase()
        );
        if (cat) {
          setCategoryFilter(cat);
          const firstInCat = services.find((s) => s.category === cat);
          if (firstInCat) setSelectedServiceName(firstInCat.name);
        } else {
          setSelectedServiceName(bookingPreselectedService);
        }
      }
    } else if (!selectedServiceName && services.length > 0) {
      setSelectedServiceName(services[0].name);
    }
  }, [isBookingOpen, bookingPreselectedService, services, categories, todayIsSunday]);

  // Calculate formatted date string
  const getFormattedDate = () => {
    const now = new Date();
    if (dateOption === "today") {
      const s = now.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return isPublicHoliday ? `${s} (Public Holiday)` : s;
    }
    if (dateOption === "tomorrow") {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const s = tomorrow.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return isPublicHoliday ? `${s} (Public Holiday)` : s;
    }
    if (customDate) {
      const parts = customDate.split("-");
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const s = d.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        return isPublicHoliday ? `${s} (Public Holiday)` : s;
      }
    }
    return "To be confirmed";
  };

  // Calculate formatted time string
  const getFormattedTime = () => {
    if (timeOption === "custom" && customTime) {
      return customTime;
    }
    const found = TIME_SLOTS.find((t) => t.id === timeOption);
    return found ? `${found.label} (${found.sub})` : timeOption;
  };

  const buildWhatsAppUrl = (booking: AppointmentBooking) => {
    const text = [
      `✨ *BEAUTY HAVEN 254 - APPOINTMENT BOOKING* ✨`,
      `----------------------------------------`,
      `👤 *Client Name:* ${booking.clientName}`,
      `📞 *Phone Number:* ${booking.clientPhone}`,
      `💅 *Selected Service:* ${booking.serviceName} (${cleanPrice(booking.servicePrice || "") || "Inquire"})`,
      `📅 *Preferred Date:* ${booking.preferredDate || "Earliest available"}`,
      `⏰ *Preferred Time:* ${booking.preferredTime || "Flexible"}`,
      isPublicHoliday ? `🎉 *Note:* Public Holiday Booking (Salon is Open 8am-9pm)` : null,
      booking.notes ? `📝 *Special Notes:* ${booking.notes}` : null,
      `🏢 *Salon Hours:* Mon-Fri: 8:00 AM – 9:00 PM | Public Holidays: OPEN | Sun: CLOSED`,
      `🔖 *Booking ID:* ${booking.id}`,
      `----------------------------------------`,
      `Hello Beauty Haven 254, I would like to confirm my appointment slot. Please let me know your availability!`,
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${SALON_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = fullName.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setFormError("Please enter your full name.");
      return;
    }

    if (!trimmedPhone || trimmedPhone.replace(/\D/g, "").length < 9) {
      setFormError("Please enter a valid phone number (at least 9 digits).");
      return;
    }

    if (!selectedServiceName) {
      setFormError("Please select the service you would like to book.");
      return;
    }

    // Operating hours check: Sunday closure
    if (isSelectedDateSunday && !isPublicHoliday) {
      setFormError(
        "Beauty Haven 254 is closed on Sundays. Please select a date between Monday and Saturday, or check 'This date is a Public Holiday' if this Sunday is an official holiday."
      );
      return;
    }

    const price = activeService ? activeService.price : "";
    const category = activeService ? activeService.category : categoryFilter;

    const newBooking = addBooking({
      clientName: trimmedName,
      clientPhone: trimmedPhone,
      serviceName: selectedServiceName,
      servicePrice: price,
      serviceCategory: category,
      preferredDate: getFormattedDate(),
      preferredTime: getFormattedTime(),
      notes: notes.trim() || undefined,
    });

    setSubmittedBooking(newBooking);

    // Open WhatsApp with pre-filled message
    const waUrl = buildWhatsAppUrl(newBooking);
    try {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.warn("Popup blocked, user can click manual button:", err);
    }
  };

  const handleResetForm = () => {
    setSubmittedBooking(null);
    setFullName("");
    setPhoneNumber("");
    setNotes("");
    setCustomDate("");
    setCustomTime("");
    setIsPublicHoliday(false);
    setDateOption(todayIsSunday ? "tomorrow" : "today");
    setTimeOption("afternoon");
  };

  if (!isBookingOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={closeBookingModal} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl bg-stone-900 border border-gold/40 text-white shadow-2xl overflow-hidden z-10 my-auto rounded-none"
        >
          {/* Header */}
          <div className="relative px-6 py-5 bg-secondary border-b border-gold/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/70 shrink-0 shadow-md bg-stone-950 flex items-center justify-center">
                <img
                  src="/beauty-haven-logo.jpg"
                  alt="Beauty Haven 254 Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-bold">
                    Salon & Spa Sanctuary
                  </span>
                  <span className="text-[9px] bg-gold/20 text-gold px-1.5 py-0.2 border border-gold/30 font-mono">
                    Bypass Kamakis
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif italic text-white leading-tight">
                  Reserve Your Appointment
                </h3>
              </div>
            </div>

            <button
              onClick={closeBookingModal}
              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Booking Form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {submittedBooking ? (
              /* Success / Confirmation State */
              <div className="text-center py-4 space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="inline-block px-3 py-1 bg-gold/15 border border-gold/40 text-gold text-xs font-mono font-bold uppercase tracking-wider mb-2">
                    Ref: {submittedBooking.id}
                  </span>
                  <h4 className="text-2xl font-serif italic text-white mb-1">
                    Booking Details Ready!
                  </h4>
                  <p className="text-xs text-white/70 max-w-md mx-auto font-sans leading-relaxed">
                    We’ve prepared your appointment request for <strong>Beauty Haven 254</strong>. Click below to launch WhatsApp and finalize your preferred slot directly with our receptionist.
                  </p>
                </div>

                {/* Booking Summary Box */}
                <div className="bg-stone-950/70 border border-white/10 p-5 text-left text-xs space-y-2.5 max-w-md mx-auto">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/50 uppercase tracking-wider text-[10px]">Client</span>
                    <span className="text-white font-bold">{submittedBooking.clientName}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/50 uppercase tracking-wider text-[10px]">Phone</span>
                    <span className="text-gold font-mono font-bold">{submittedBooking.clientPhone}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/50 uppercase tracking-wider text-[10px]">Service</span>
                    <span className="text-white font-bold">
                      {submittedBooking.serviceName}
                      {submittedBooking.servicePrice && (
                        <span className="text-gold ml-1.5 font-normal">
                          (KSh {cleanPrice(submittedBooking.servicePrice)})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/50 uppercase tracking-wider text-[10px]">Date & Time</span>
                    <span className="text-white">
                      {submittedBooking.preferredDate} • {submittedBooking.preferredTime}
                    </span>
                  </div>
                  {submittedBooking.notes && (
                    <div className="pt-1">
                      <span className="text-white/50 uppercase tracking-wider text-[10px] block mb-1">Notes:</span>
                      <p className="text-white/80 italic">{submittedBooking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a
                    href={buildWhatsAppUrl(submittedBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Open WhatsApp to Confirm</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-75" />
                  </a>
                  <button
                    onClick={handleResetForm}
                    className="px-5 py-3.5 bg-stone-800 hover:bg-stone-700 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Book Another Service
                  </button>
                  <button
                    onClick={closeBookingModal}
                    className="px-5 py-3.5 border border-white/20 hover:border-white/40 text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Input Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Salon Operating Hours Status Banner */}
                <div className="bg-stone-950/90 border border-gold/30 p-3 sm:p-3.5 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gold shrink-0" />
                      <div>
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider block sm:inline">
                          Salon Operating Hours:{" "}
                        </span>
                        <span className="text-gold font-mono font-bold text-xs">
                          Mon – Fri: 8:00 AM – 9:00 PM
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider font-bold">
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5">
                        Holidays: OPEN
                      </span>
                      <span className="bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.5">
                        Sunday: CLOSED
                      </span>
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded-none">
                    {formError}
                  </div>
                )}

                {/* Section 1: Client Personal Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-1.5">
                      Your Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Jane Wanjiku"
                        className="w-full bg-stone-950 border border-white/20 pl-9 pr-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-1.5">
                      Phone Number (WhatsApp) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0712 345 678 or +254..."
                        className="w-full bg-stone-950 border border-white/20 pl-9 pr-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Choose Service */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] uppercase tracking-widest text-gold font-bold">
                      Choose Service <span className="text-red-400">*</span>
                    </label>
                    {activeService && (
                      <span className="text-xs text-gold font-mono font-bold">
                        Rate: KSh {cleanPrice(activeService.price)}
                      </span>
                    )}
                  </div>

                  {/* Selected service display trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-stone-950 border border-white/20 px-3 py-3 text-left flex items-center justify-between text-xs text-white hover:border-gold/60 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span className="font-semibold text-white truncate">
                          {selectedServiceName || "Select a service from catalog..."}
                        </span>
                        {activeService?.category && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 bg-secondary text-gold border border-gold/30 shrink-0 font-bold">
                            {activeService.category}
                          </span>
                        )}
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-white/50 transition-transform ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Service Selector Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-stone-950 border border-gold/40 shadow-2xl z-30 p-3 max-h-72 overflow-y-auto">
                        {/* Search and Category Filter Tabs */}
                        <div className="space-y-2 mb-3">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={serviceSearch}
                              onChange={(e) => setServiceSearch(e.target.value)}
                              placeholder="Search service name (e.g. Tips, Soft Glam, Wash)..."
                              className="w-full bg-stone-900 border border-white/10 pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold"
                            />
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setCategoryFilter(cat)}
                                className={`text-[9px] uppercase tracking-wider px-2 py-1 transition-colors ${
                                  categoryFilter === cat
                                    ? "bg-gold text-secondary font-bold"
                                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Service List */}
                        <div className="space-y-1 divide-y divide-white/5">
                          {availableServices.length === 0 ? (
                            <p className="text-xs text-white/40 text-center py-4 italic">
                              No services found matching search.
                            </p>
                          ) : (
                            availableServices.map((srv) => (
                              <button
                                key={srv.name}
                                type="button"
                                onClick={() => {
                                  setSelectedServiceName(srv.name);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left py-2 px-2.5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer ${
                                  selectedServiceName === srv.name ? "bg-gold/10 border-l-2 border-gold" : ""
                                }`}
                              >
                                <div className="truncate pr-3">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-medium text-white truncate">
                                      {srv.name}
                                    </span>
                                    {srv.isPopular && (
                                      <span className="text-[8.5px] uppercase tracking-wider text-amber-300 bg-amber-500/20 px-1 py-0.2">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  {srv.description && (
                                    <p className="text-[10px] text-white/50 truncate max-w-sm">
                                      {srv.description}
                                    </p>
                                  )}
                                </div>
                                <div className="shrink-0 text-right">
                                  <span className="text-xs font-mono font-bold text-gold">
                                    KSh {cleanPrice(srv.price)}
                                  </span>
                                  <span className="block text-[8.5px] uppercase tracking-wider text-white/40">
                                    {srv.category}
                                  </span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {activeService?.description && (
                    <p className="text-[10.5px] text-white/60 mt-1.5 italic font-sans">
                      {activeService.description}
                    </p>
                  )}
                </div>

                {/* Section 3: Preferred Date */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] uppercase tracking-widest text-gold font-bold">
                      Preferred Date
                    </label>
                    <span className="text-[10px] text-white/50">
                      Open Mon–Fri (8am–9pm) & Holidays
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDateOption("today")}
                      className={`py-2 px-2.5 text-xs font-sans uppercase tracking-wider font-bold border transition-colors cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        dateOption === "today"
                          ? "bg-gold text-secondary border-gold"
                          : "bg-stone-950 text-white/70 border-white/20 hover:border-gold/50"
                      }`}
                    >
                      <span>Today</span>
                      {todayIsSunday && (
                        <span className={`text-[8px] font-mono tracking-tight font-normal ${dateOption === "today" ? "text-secondary/80" : "text-amber-400"}`}>
                          Sunday
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateOption("tomorrow")}
                      className={`py-2 px-2.5 text-xs font-sans uppercase tracking-wider font-bold border transition-colors cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        dateOption === "tomorrow"
                          ? "bg-gold text-secondary border-gold"
                          : "bg-stone-950 text-white/70 border-white/20 hover:border-gold/50"
                      }`}
                    >
                      <span>Tomorrow</span>
                      {tomorrowIsSunday && (
                        <span className={`text-[8px] font-mono tracking-tight font-normal ${dateOption === "tomorrow" ? "text-secondary/80" : "text-amber-400"}`}>
                          Sunday
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateOption("custom")}
                      className={`py-2 px-2.5 text-xs font-sans uppercase tracking-wider font-bold border transition-colors cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        dateOption === "custom"
                          ? "bg-gold text-secondary border-gold"
                          : "bg-stone-950 text-white/70 border-white/20 hover:border-gold/50"
                      }`}
                    >
                      <span>Pick Date</span>
                      <span className="text-[8px] opacity-60 font-normal">Calendar</span>
                    </button>
                  </div>

                  {dateOption === "custom" && (
                    <div className="mt-2 relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <input
                        type="date"
                        value={customDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full bg-stone-950 border border-white/20 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-gold"
                      />
                    </div>
                  )}

                  {/* Sunday Closure Warning & Public Holiday Toggle */}
                  {isSelectedDateSunday && (
                    <div className="mt-3 p-3 bg-amber-950/60 border border-amber-500/50 space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-bold text-amber-300">Sunday Closure Notice</p>
                          <p className="text-[11px] text-amber-200/80 leading-relaxed">
                            Beauty Haven 254 is regularly closed on Sundays. However, we are <strong>fully OPEN on all official Public Holidays (8:00 AM – 9:00 PM)</strong>!
                          </p>
                        </div>
                      </div>

                      <label className="flex items-center gap-2 pt-1 text-xs text-white cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isPublicHoliday}
                          onChange={(e) => setIsPublicHoliday(e.target.checked)}
                          className="accent-gold w-4 h-4 cursor-pointer"
                        />
                        <span className="font-bold text-amber-300">
                          This Sunday is an official Public Holiday (Salon is OPEN 8am–9pm)
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Section 4: Preferred Time Slot */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] uppercase tracking-widest text-gold font-bold">
                      Preferred Time Window
                    </label>
                    <span className="text-[10px] text-white/50">
                      Open 8:00 AM – 9:00 PM
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setTimeOption(slot.id)}
                        className={`p-2 text-left border transition-all cursor-pointer ${
                          timeOption === slot.id
                            ? "bg-gold text-secondary border-gold font-bold"
                            : "bg-stone-950 text-white border-white/20 hover:border-gold/50"
                        }`}
                      >
                        <span className="block text-xs font-bold leading-none mb-1">
                          {slot.label}
                        </span>
                        <span
                          className={`block text-[9px] ${
                            timeOption === slot.id ? "text-secondary/80 font-medium" : "text-white/50"
                          }`}
                        >
                          {slot.sub}
                        </span>
                      </button>
                    ))}
                  </div>

                  {timeOption === "custom" && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-white/50 uppercase tracking-wider mr-1">
                          Quick Hours:
                        </span>
                        {SUGGESTED_TIMES.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setCustomTime(time)}
                            className={`px-2 py-1 text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                              customTime === time
                                ? "bg-gold text-secondary border-gold"
                                : "bg-white/5 text-white/80 border-white/20 hover:border-gold"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                          type="text"
                          placeholder="e.g. 8:30 AM, 11:00 AM, 6:00 PM"
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className="w-full bg-stone-950 border border-white/20 pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold font-mono"
                        />
                      </div>
                      <p className="text-[10px] text-white/50 italic">
                        Operating hours: 8:00 AM to 9:00 PM daily (Sunday: Closed unless Public Holiday).
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 5: Notes / Custom Requests */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gold font-bold mb-1.5">
                    Special Notes or Preferences <span className="text-white/40 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., Natural hair / need previous gel soaked off / specific technician..."
                    className="w-full bg-stone-950 border border-white/20 p-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                {/* Submission CTA */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[10px] text-white/50">
                    Walk-ins also welcome daily at Bypass Kamakis Shop 109.
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold hover:bg-white text-secondary font-bold text-xs uppercase tracking-widest transition-all shadow-xl cursor-pointer"
                  >
                    <span>Proceed to WhatsApp Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
