import DynamicIcon from "@/helpers/DynamicIcon";
import ImageFallback from "@/helpers/ImageFallback";
import { getListPage } from "@/lib/contentParser";
import { getTutorials } from "@/lib/tutorials";
import { markdownify } from "@/lib/utils/textConverter";
import AboutSection from "@/partials/AboutSection";
import SeoMeta from "@/partials/SeoMeta";
import Testimonial from "@/partials/Testimonial";
import Button from "@/shortcodes/Button";
import { THomepage, TTestimonial } from "@/types";

export default async function Home() {
  const homepage = getListPage("homepage/_index.md") as THomepage;
  const testimonials = getListPage("sections/testimonial.md") as TTestimonial;
  const { categories } = await getTutorials();

  // Pick one featured video from each category (first 4 categories)
  const featuredVideos = categories.slice(0, 4).map((cat) => ({
    ...cat.videos[0],
    categoryName: cat.name,
    categorySlug: cat.slug,
  }));

  const { hero, explore_menu, services, features } =
    homepage.frontmatter;

  return (
    <>
      <SeoMeta {...homepage.frontmatter} />
      {/* Banner */}
      <section className="relative overflow-hidden lg:h-[85vh] min-h-[600px] flex items-center justify-center">
        {/* Layer 1 — Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #F4C2D7 0%, #E8A0BF 20%, #d4a0c8 40%, #b8aad2 55%, #9AB3D6 75%, #7B9ACC 100%)",
          }}
        />

        {/* Layer 2 — Animated watercolor blooms */}
        {/* Bloom 1 — pink, top-left */}
        <div
          className="absolute rounded-full will-change-transform"
          style={{
            width: "clamp(300px, 50vw, 600px)",
            height: "clamp(300px, 50vw, 600px)",
            top: "-10%",
            left: "-10%",
            background:
              "radial-gradient(ellipse, rgba(244,194,215,0.55) 0%, transparent 70%)",
            animation: "blobDrift1 35s ease-in-out infinite",
            filter: "blur(60px)",
          }}
        />
        {/* Bloom 2 — blue, top-right */}
        <div
          className="absolute rounded-full will-change-transform"
          style={{
            width: "clamp(250px, 40vw, 500px)",
            height: "clamp(250px, 40vw, 500px)",
            top: "15%",
            right: "-8%",
            background:
              "radial-gradient(ellipse, rgba(123,154,204,0.5) 0%, transparent 70%)",
            animation: "blobDrift2 30s ease-in-out infinite",
            filter: "blur(70px)",
          }}
        />
        {/* Bloom 3 — purple, bottom-center */}
        <div
          className="absolute rounded-full will-change-transform"
          style={{
            width: "clamp(200px, 35vw, 450px)",
            height: "clamp(200px, 35vw, 450px)",
            bottom: "-5%",
            left: "25%",
            background:
              "radial-gradient(ellipse, rgba(201,168,212,0.4) 0%, transparent 70%)",
            animation: "blobDrift3 40s ease-in-out infinite",
            filter: "blur(55px)",
          }}
        />
        {/* Bloom 4 — white highlight, center-right (md+) */}
        <div
          className="absolute rounded-full will-change-transform hidden md:block"
          style={{
            width: "300px",
            height: "300px",
            top: "40%",
            left: "60%",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)",
            animation: "blobDrift4 45s ease-in-out infinite",
            filter: "blur(50px)",
          }}
        />
        {/* Bloom 5 — pink, bottom-right (lg+) */}
        <div
          className="absolute rounded-full will-change-transform hidden lg:block"
          style={{
            width: "350px",
            height: "350px",
            bottom: "10%",
            right: "20%",
            background:
              "radial-gradient(ellipse, rgba(244,194,215,0.3) 0%, transparent 70%)",
            animation: "blobDrift1 50s ease-in-out infinite reverse",
            filter: "blur(65px)",
          }}
        />

        {/* Layer 3 — Paper grain texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.07,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
          }}
        />

        {/* Layer 4 — Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.15) 100%)",
          }}
        />

        {/* Layer 5 — Floating paint accents */}
        <div className="absolute top-[18%] left-[10%] w-3 h-3 rounded-full bg-white/20 blur-[1px]" style={{ animation: "floatPaint 7s ease-in-out infinite" }} />
        <div className="absolute top-[55%] right-[14%] w-2 h-2 rounded-full bg-white/15 blur-[0.5px]" style={{ animation: "floatPaint 9s ease-in-out infinite 2s" }} />
        <div className="absolute bottom-[22%] left-[22%] w-4 h-4 rounded-full bg-white/10 blur-[1px]" style={{ animation: "floatPaint 8s ease-in-out infinite 1s" }} />
        <div className="absolute top-[30%] right-[28%] w-2.5 h-2.5 rounded-full bg-pink-200/15 hidden md:block blur-[0.5px]" style={{ animation: "floatPaint 10s ease-in-out infinite 3s" }} />
        <div className="absolute bottom-[35%] left-[60%] w-1.5 h-1.5 rounded-full bg-blue-200/20 hidden lg:block" style={{ animation: "floatPaint 6s ease-in-out infinite 4s" }} />

        {/* Title backdrop glow */}
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[250px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)",
            animation: "titleGlow 4s ease-in-out infinite",
          }}
        />

        <div className="container relative z-10 md:w-[750px] pt-28 pb-20 md:pt-0 md:pb-0">
          <h1
            className="hero-title font-secondary text-[42px] sm:text-[52px] lg:text-[68px] xl:text-[82px] leading-[1.1] font-normal mb-6 text-center text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.3),0_4px_20px_rgba(0,0,0,0.15)]"
            dangerouslySetInnerHTML={markdownify(hero.title)}
            data-aos="hero-reveal"
            data-aos-delay="100"
          />
          <p
            className="text-[13px] tracking-[0.3em] uppercase text-white/70 font-primary font-medium mb-6 text-center [text-shadow:0_1px_3px_rgba(0,0,0,0.3)]"
            dangerouslySetInnerHTML={markdownify(hero.subtitle)}
            data-aos="fade-up-sm"
            data-aos-delay="200"
          />
          {/* Decorative brush stroke */}
          <div className="flex justify-center mb-8" data-aos="fade-up-sm" data-aos-delay="250">
            <svg width="100" height="6" viewBox="0 0 100 6" fill="none" className="opacity-40">
              <path
                d="M2 3C15 1 30 5 50 3C70 1 85 5 98 3"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ strokeDasharray: 200, animation: "brushReveal 1.5s ease-out 0.8s both" }}
              />
            </svg>
          </div>
          <div
            className="flex flex-col md:flex-row justify-center items-center gap-4"
            data-aos="fade-up-sm"
            data-aos-delay="300"
          >
            {hero.buttons.map(
              (b, i: number) =>
                b.enable && (
                  <Button
                    key={i}
                    link={b.link}
                    label={b.label}
                    className="w-fit"
                    variant={i % 2 === 0 ? "outline" : "solid"}
                  />
                ),
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 hero-scroll-hint">
          <span className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-primary">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/50 via-primary/30 to-transparent scroll-line" />
        </div>
      </section>
      {/* /Banner */}

      {/* Explore Skills — Masonry Gallery */}
      {explore_menu.enable && (
        <section className="section">
          <div className="container">
            <h2
              className="text-center mb-14"
              dangerouslySetInnerHTML={markdownify(explore_menu.title)}
              data-aos="fade-up-sm"
              data-aos-delay="100"
            />
            <div className="columns-2 md:columns-3 lg:columns-4 gap-5 lg:gap-6">
              {explore_menu.items.map((item, i: number) => {
                const aspects = [
                  "aspect-[3/4]",
                  "aspect-[2/3]",
                  "aspect-[4/5]",
                  "aspect-[3/4]",
                  "aspect-[3/4]",
                  "aspect-[5/6]",
                  "aspect-[4/5]",
                ];
                return (
                  <a
                    key={i}
                    href={item.link}
                    className="block break-inside-avoid mb-5 lg:mb-6 group"
                    data-aos="fade-up-sm"
                    data-aos-delay={100 + i * 50}
                  >
                    <div className="overflow-hidden rounded-xl">
                      <ImageFallback
                        src={item.image}
                        alt={item.name}
                        width={400}
                        height={500}
                        className={`w-full object-cover ${aspects[i % aspects.length]} transition-transform duration-500 group-hover:scale-105`}
                      />
                    </div>
                    <h3 className="font-secondary font-bold text-text-dark mt-3 text-base">
                      {item.name}
                    </h3>
                    <p className="text-text-light text-xs tracking-[0.15em] uppercase mt-0.5">
                      {item.tutorials} TUTORIALS
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {/* /Explore Skills */}

      <AboutSection />

      {/* Featured Tutorials */}
      {services.enable && (
        <section className="section">
          <div className="container">
            <h2
              className="mb-14 max-md:text-center"
              dangerouslySetInnerHTML={markdownify(services.title)}
              data-aos="fade-up-sm"
              data-aos-delay="100"
            />
            <div className="row justify-center g-4">
              {featuredVideos.map((video, i) => (
                <div key={video.id} className="col-10 md:col-6 lg:col-3">
                  <a
                    href={`/explore/${video.categorySlug}`}
                    data-aos="fade-up-sm"
                    data-aos-delay={100 + i * 50}
                    className="group block"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-border">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full pointer-events-none"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="h6 font-semibold font-primary mb-1 px-3 text-text-dark group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-text/90 mb-1 text-sm px-3 line-clamp-2">
                      {video.description}
                    </p>
                    <p className="text-primary text-xs font-medium px-3">
                      {video.categoryName} &middot; {video.artist}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* /Featured Tutorials */}

      {/* Features */}
      {features.enable && (
        <section className="section bg-gradient-to-br from-primary/8 to-secondary/5">
          <div className="container">
            <div className="row justify-center">
              <div className="max-md:col-10">
                <div className="flex flex-col lg:flex-row justify-between gap-20 lg:gap-16 items-center">
                  <div className="lg:w-[58%] pb-10">
                    <div className="flex gap-5">
                      <ImageFallback
                        src={features.images[0]}
                        alt="about image"
                        width={427}
                        height={595}
                        className="rounded-lg w-[60%] h-[595px] object-cover overflow-hidden"
                        data-aos="zoom-in-sm"
                      />
                      <div className="flex flex-col gap-5 w-[45%] translate-y-10">
                        <ImageFallback
                          src={features.images[1]}
                          alt="about image"
                          width={300}
                          height={330}
                          className="rounded-lg h-[330px] object-cover overflow-hidden"
                          data-aos="zoom-in-sm"
                        />
                        <ImageFallback
                          src={features.images[2]}
                          alt="about image"
                          width={300}
                          height={240}
                          className="rounded-lg h-[238px] object-cover overflow-hidden"
                          data-aos="zoom-in-sm"
                        />
                      </div>
                    </div>
                    <p
                      className="text-text-light text-xs mt-4 text-center"
                      data-aos="fade-up-sm"
                      data-aos-delay="150"
                    >
                      Art by{" "}
                      <a
                        href="https://www.youtube.com/@samdoesarts"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/70 font-medium transition-colors"
                      >
                        samdoesarts
                      </a>
                    </p>
                  </div>
                  <div className="lg:w-[37%] lg:mt-10">
                    <h2
                      data-aos="fade-up-sm"
                      data-aos-delay="50"
                      className="text-h3 md:text-h2 text-balance mb-7 text-left"
                      dangerouslySetInnerHTML={markdownify(features.title)}
                    />
                    {features.content && (
                      <p
                        className="mb-12 text-left text-sm text-balance"
                        data-aos="fade-up-sm"
                        data-aos-delay="100"
                        dangerouslySetInnerHTML={markdownify(features.content)}
                      />
                    )}
                    {features.key_benefits.map((benefit, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 mb-4"
                        data-aos="fade-up-sm"
                        data-aos-delay={150 + i * 50}
                      >
                        <span className="p-1.5 bg-primary rounded-full inline-flex items-center justify-center">
                          <DynamicIcon
                            icon={benefit.icon}
                            className="text-white shrink-0 text-xs"
                          />
                        </span>
                        <p
                          className="text-text/90 font-medium text-lg"
                          dangerouslySetInnerHTML={markdownify(benefit.benefit)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* /Features */}

      <Testimonial data={testimonials} />

    </>
  );
}
