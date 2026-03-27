import ImageFallback from "@/helpers/ImageFallback";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import Button from "@/shortcodes/Button";

const AboutSection = () => {
  const homepage = getListPage("homepage/_index.md");
  const { about } = homepage.frontmatter;

  return (
    <>
      {about.enable && (
        <section className="section-sm pb-18 xl:pb-24" style={{ background: "linear-gradient(135deg, #F0EDE8 0%, #F2E8EF 50%, #EDE8F0 100%)" }}>
          <div className="container">
            <div className="row justify-center">
              <div className="max-md:col-10">
                <div className="flex flex-col lg:flex-row justify-between gap-20 lg:gap-6 items-center">
                  <div className="lg:w-[60%]">
                    <div className="relative">
                      <ImageFallback
                        src={about.image}
                        alt="about image"
                        width={596}
                        height={563}
                        className="rounded-lg top-0 xl:-top-12"
                        data-aos="zoom-in-sm"
                      />
                    </div>
                  </div>

                  <div className="lg:w-[40%] lg:mt-10">
                    <h2
                      className="text-h3 md:text-h2 text-balance mb-7 text-center lg:text-left"
                      data-aos="fade-up-sm"
                      data-aos-delay="50"
                      dangerouslySetInnerHTML={markdownify(about.title)}
                    />

                    <p
                      dangerouslySetInnerHTML={markdownify(about.description)}
                      className="mb-8 text-center lg:text-left"
                      data-aos="fade-up-sm"
                      data-aos-delay="100"
                    />
                    {about.button.enable && (
                      <div
                        className="w-full flex justify-center lg:justify-start"
                        data-aos="fade-up-sm"
                        data-aos-delay="150"
                      >
                        <Button
                          link={about.button.link}
                          label={about.button.label}
                          className="mt-8 btn"
                          variant="solid"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AboutSection;
