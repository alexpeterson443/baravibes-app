import { ExternalLink } from "lucide-react";

const supportLinks = [
  {
    emoji: "🌿",
    title: "Rainforest Trust",
    desc: "helps protect capybara habitats in South America through land conservation.",
    link: "https://www.rainforesttrust.org/",
  },
  {
    emoji: "🐾",
    title: "World Wildlife Fund",
    desc: "works to protect wildlife and wild places around the globe including capybara ecosystems.",
    link: "https://www.worldwildlife.org/",
  },
  {
    emoji: "🏠",
    title: "Capybara Rescue",
    desc: "organizations that rescue and rehome capybaras that can no longer be cared for by their owners.",
    link: "https://www.capybaraworld.com/",
  },
  {
    emoji: "📚",
    title: "Learn More",
    desc: "the more people know about capybaras the better. share this site with someone who needs more capy in their life.",
    link: "#",
  },
];

export default function SupportSection() {
  return (
    <section id="support" className="py-20 bg-gradient-to-b from-[oklch(0.94_0.03_145/0.3)] to-white">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">support capybaras</h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            if you love capybaras as much as I do here are some ways you can actually help them.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {supportLinks.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target={item.link !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-border no-underline block"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-primary">{item.title}</h3>
                    {item.link !== "#" && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
