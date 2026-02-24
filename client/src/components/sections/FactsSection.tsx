import { funFacts } from "@shared/data";

export default function FactsSection() {
  return (
    <section id="facts" className="py-20 bg-gradient-to-br from-[oklch(0.55_0.15_145/0.1)] to-[oklch(0.45_0.08_55/0.1)]">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">fun facts</h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            things about capybaras that will make you love them even more (if that is even possible)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {funFacts.map((fact, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-white/50"
            >
              <div className="text-3xl mb-3">{fact.emoji}</div>
              <h3 className="font-bold text-primary mb-2">{fact.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{fact.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
