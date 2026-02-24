import { IMAGES } from "@shared/images";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[oklch(0.97_0.02_85)] to-[oklch(0.94_0.03_145/0.3)]">
      <div className="container flex flex-col lg:flex-row items-center gap-10 pt-24 pb-16">
        {/* Left text */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-primary shadow-sm">
            <span>🐾</span>
            <span>the internet's favorite rodent</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-primary leading-tight">
            BaraVibes
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-lg mx-auto lg:mx-0">
            ok so I made this whole website because I am genuinely obsessed with capybaras and I needed somewhere to put all of it. welcome to my corner of the internet.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button size="lg" className="rounded-full bg-primary text-primary-foreground px-8" asChild>
              <a href="#gallery">see the capys</a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <a href="#quiz">take the quiz</a>
            </Button>
          </div>
          <div className="flex gap-6 justify-center lg:justify-start pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">17+</div>
              <div className="text-xs text-muted-foreground">photos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50</div>
              <div className="text-xs text-muted-foreground">states covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-xs text-muted-foreground">vibes</div>
            </div>
          </div>
        </div>

        {/* Right image */}
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-white animate-float">
              <img
                src={IMAGES.capyFlower}
                alt="capybara with flower crown"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-full px-3 py-1 shadow-lg text-sm font-bold animate-bounce">
              🌸 vibes only
            </div>
            <div className="absolute -bottom-2 -left-4 bg-white rounded-full px-3 py-1 shadow-lg text-sm font-bold">
              ✨ unbothered
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
