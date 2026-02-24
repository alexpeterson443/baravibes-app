import { IMAGES } from "@shared/images";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">what even is a capybara</h2>
          <p className="text-foreground/60 max-w-2xl mx-auto">
            glad you asked. let me tell you everything.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src={IMAGES.capyMajestic} alt="majestic capybara" className="w-full h-64 object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img src={IMAGES.capyFriends} alt="capybara with friends" className="w-full h-48 object-cover" />
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-foreground/80 leading-relaxed">
              capybaras are the world's largest rodents and they are from South America. they can weigh up to 140 pounds which is honestly impressive for something that looks like a giant guinea pig.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              they are semi aquatic which means they spend a ton of time in water. they have webbed feet and can hold their breath for up to 5 minutes. they can even sleep in water with just their nose sticking out.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              but the best thing about capybaras is that literally every other animal loves them. birds sit on them. monkeys hang out with them. even crocodiles just vibe next to them. they are the most universally liked animal on the planet and I think we can all learn from that energy.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["herbivore", "semi aquatic", "social", "south america", "largest rodent"].map((tag) => (
                <span
                  key={tag}
                  className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
