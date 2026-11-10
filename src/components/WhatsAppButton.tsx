import { motion } from "motion/react";
import { Phone } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08 }}
      href="https://wa.me/254796709521?text=Hello%20Beauty%20Haven%20254%2C%20I%20would%20like%20to%20book%20an%20appointment!"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Beauty Haven 254 on WhatsApp"
      title="Chat with Beauty Haven 254 on WhatsApp"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[60] bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center justify-center group hover:bg-[#20ba59] transition-colors"
    >
      <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 font-sans font-bold text-xs sm:text-sm">
        Book on WhatsApp
      </span>
    </motion.a>
  );
}
