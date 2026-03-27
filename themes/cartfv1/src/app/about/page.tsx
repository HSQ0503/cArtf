import Counter from "@/components/Counter";
import DynamicIcon from "@/helpers/DynamicIcon";
import ImageFallback from "@/helpers/ImageFallback";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import AboutSection from "@/partials/AboutSection";
import SeoMeta from "@/partials/SeoMeta";
import Testimonial from "@/partials/Testimonial";
import { TAbout, TTestimonial } from "@/types";

export default function AboutPage() {
  const about = getListPage("about/_index.md") as TAbout;
  const testimonials = getListPage("sections/testimonial.md") as TTestimonial;
  const {
    title,
    description,
    meta_title,
    image,
    key_benefits,
    information,
  } = about.frontmatter;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <AboutSection />

      {/* Key Benefits */}
      <section className="section-sm overflow-x-hidden">
        <div className="container">
          <div className="row g-5">
            {key_benefits.slice(0, 3).map((benefit, index) => (
              <div
                className="sm:col-6 md:col-4"
                key={index}
                data-aos="fade-right-sm"
                data-aos-delay={index * 150}
              >
                <div className="flex gap-4">
                  <div className="p-2 w-12 h-12 rounded-full bg-primary/5 shrink-0 flex items-center justify-center">
                    <DynamicIcon
                      icon={benefit.icon}
                      className="text-3xl text-primary"
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold font-primary"
                      dangerouslySetInnerHTML={markdownify(benefit.title)}
                    />
                    <p
                      className="text-text/80 text-balance text-sm mt-3"
                      dangerouslySetInnerHTML={markdownify(benefit.description)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* /Key Benefits */}

      {/* Info Section */}
      <section className="section bg-primary/5 overflow-x-hidden">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-28 items-center">
            <div className="order-2 lg:order-1 max-lg:text-center">
              <h2
                dangerouslySetInnerHTML={markdownify(information?.title)}
                data-aos="fade-up-sm"
                data-aos-delay="100"
              />
              <p
                className="text-sm text-text/90 mt-4 text-balance"
                dangerouslySetInnerHTML={markdownify(information?.description)}
                data-aos="fade-up-sm"
                data-aos-delay="150"
              />
              <div className="grid sm:grid-cols-2 gap-5 mt-14">
                {information?.metrics?.map((metric, i) => (
                  <div
                    className="border border-border rounded-lg bg-white px-10 py-8 text-center"
                    key={i}
                    data-aos="fade-up-sm"
                    data-aos-delay={i * 150}
                  >
                    <h3 className="h2">
                      <Counter
                        count={metric.counter.count}
                        suffix={metric.counter.count_suffix}
                        prefix={metric.counter.count_prefix}
                        duration={metric.counter.count_duration}
                      />
                    </h3>
                    <p
                      className="text-primary mt-2"
                      dangerouslySetInnerHTML={markdownify(metric.name)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div
              className="order-1 lg:order-2 w-full"
              data-aos="fade-left-sm"
              data-aos-delay="200"
            >
              <ImageFallback
                src="/images/about/info.png"
                alt={information?.title}
                width={557}
                height={683}
                className="rounded-lg object-cover w-[442] h-[354px] lg:w-[557px] lg:h-auto max-lg:mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
      {/* /Info Section */}

      <Testimonial data={testimonials} />
    </>
  );
}
