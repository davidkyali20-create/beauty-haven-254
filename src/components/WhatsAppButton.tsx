import { motion } from "motion/react";
import { Phone } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
      href="https://wa.me/254796709521"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
    >
      <Phone className="w-7 h-7" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 font-sans font-bold">
        Chat with us
      </span>
    </motion.a>
  );
}
