export default function PlanTripHero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/plan-trip/plan-trip-hero.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#0A0F1F]/80" />

      {/* Blend Into Page */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1F] via-[#0A0F1F]/30 to-[#0A0F1F]/50" />

      {/* Content */}
      <div className="relative z-10 py-4 sm:py-5 md:py-4">
        <h1 className="text-xl font-semibold tracking-tight text-[#e6e0e8] md:text-lg lg:text-xl">
          Design Your Expedition
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-5 text-[#948e9c] md:text-xs md:leading-5">
          Tell us your vision, and VoyageAI will craft a
          personalized itinerary around your destination,
          budget, interests and travel preferences.
        </p>
      </div>
    </section>
  );
}