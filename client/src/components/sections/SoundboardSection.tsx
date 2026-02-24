import { useState } from "react";

const sounds = [
  { title: "happy capybara purring", emoji: "😊", videoId: "dGmwIhXnyeo", start: 15 },
  { title: "capybara eating watermelon", emoji: "🍉", videoId: "RF9Z1TB0iWs", start: 0 },
  { title: "baby capybara squeaking", emoji: "🐣", videoId: "bnCaxJQqeKE", start: 0 },
  { title: "capybara in hot spring", emoji: "♨️", videoId: "2LRGzoe_mio", start: 10 },
  { title: "capybara swimming sounds", emoji: "🏊", videoId: "CdMUOsf2QNc", start: 0 },
  { title: "capybara group chattering", emoji: "💬", videoId: "aAHPDPyKYog", start: 0 },
];

export default function SoundboardSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section id="soundboard" className="py-20 bg-gradient-to-b from-white to-[oklch(0.94_0.03_145/0.3)]">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">capybara sounds</h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            real capybara sounds from YouTube. click one to hear the most soothing noises on earth.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {sounds.map((s) => (
            <button
              key={s.videoId}
              onClick={() => setActiveVideo(activeVideo === s.videoId ? null : s.videoId)}
              className={`rounded-2xl p-5 text-center transition-all hover:scale-105 ${
                activeVideo === s.videoId
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-white shadow-sm hover:shadow-md border border-border"
              }`}
            >
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="text-xs font-bold leading-tight">{s.title}</div>
            </button>
          ))}
        </div>

        {/* YouTube embed */}
        {activeVideo && (
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden shadow-lg">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&start=${sounds.find((s) => s.videoId === activeVideo)?.start || 0}`}
                title="Capybara Sound"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
