import { IMAGES } from "@shared/images";

export default function CapyWeekSection() {
  return (
    <section id="capy-week" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">capybara of the week</h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            every week I pick a capybara that deserves recognition. this week it is this absolute legend.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-gradient-to-br from-[oklch(0.97_0.02_85)] to-[oklch(0.94_0.03_145/0.3)] rounded-3xl overflow-hidden shadow-lg">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={IMAGES.capyWatermelon}
                alt="capybara of the week"
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold rounded-full px-3 py-1 mb-3 w-fit">
                <span>⭐</span> week of feb 24
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Melon Lord</h3>
              <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                this capybara was photographed absolutely demolishing a watermelon and honestly the energy is unmatched. no hesitation. no shame. just pure commitment to the snack. we should all aspire to this level of dedication.
              </p>
              <div className="flex gap-2">
                <span className="bg-white text-xs font-semibold px-2 py-1 rounded-full text-primary">snack king</span>
                <span className="bg-white text-xs font-semibold px-2 py-1 rounded-full text-primary">unbothered</span>
                <span className="bg-white text-xs font-semibold px-2 py-1 rounded-full text-primary">iconic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
