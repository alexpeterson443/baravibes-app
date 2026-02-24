import { newsItems } from "@shared/data";
import { ExternalLink } from "lucide-react";

export default function NewsSection() {
  return (
    <section id="news" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">capy news</h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            the latest capybara news from around the world. yes this is a real section.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {newsItems.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-border no-underline block"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {item.date}
                </span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
              <h3 className="font-bold text-primary mb-2 group-hover:underline">{item.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
