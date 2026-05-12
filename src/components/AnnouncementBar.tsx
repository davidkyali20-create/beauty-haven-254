import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-secondary text-white py-2 px-4 overflow-hidden z-[60] flex items-center justify-center">
      <motion.div 
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-center space-x-3"
      >
        <Sparkles className="w-3 h-3 text-gold animate-pulse" />
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-center">
          First time? Get <span className="text-gold">10% OFF</span> your first service
        </span>
        <Sparkles className="w-3 h-3 text-gold animate-pulse" />
      </motion.div>
      <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
    </div>
  );
}
