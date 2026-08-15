import { Sparkles } from "lucide-react";

export default function FloatingAIAssistant() {
  return (
    <button
      type="button"
      className="
        voyage-gradient
        group
        fixed
        bottom-8
        right-8
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        text-[#391e70]
        shadow-[0_0_25px_rgba(251,113,133,0.45)]
        transition-all
        duration-300
        hover:scale-110
        hover:shadow-[0_0_35px_rgba(252,211,77,0.35)]
      "
    >
      <Sparkles size={24} />

      <span
        className="
          pointer-events-none
          absolute
          right-16
          whitespace-nowrap
          rounded-lg
          border
          border-white/10
          bg-[#2b292f]
          px-3
          py-2
          text-sm
          text-[#e6e0e8]
          opacity-0
          shadow-xl
          transition-opacity
          group-hover:opacity-100
        "
      >
        Ask VoyageAI
      </span>
    </button>
  );
}