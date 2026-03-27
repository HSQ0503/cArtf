"use client";

import { markdownify } from "@/lib/utils/textConverter";
import type { TTestimonial } from "@/types";
import Image from "next/image";
import { useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const Testimonial = ({ data }: { data: TTestimonial }) => {
  useEffect(() => {
    if (data.frontmatter.enable) {
      // Set equal heights for all slides
      const setEqualHeights = () => {
        const slides = document.querySelectorAll(
          ".testimonial-slider .swiper-slide",
        ) as NodeListOf<HTMLElement>;
        let maxHeight = 0;

        // Reset heights
        slides.forEach((slide) => {
          slide.style.height = "auto";
        });

        // Find max height
        slides.forEach((slide) => {
          const height = slide.offsetHeight;
          maxHeight = Math.max(maxHeight, height);
        });

        // Set equal height to all slides
        if (maxHeight > 0) {
          slides.forEach((slide) => {
            slide.style.height = `${maxHeight}px`;
          });
        }
      };

      // Set equal heights initially and on window resize
      setTimeout(setEqualHeights, 100);
      window.addEventListener("resize", setEqualHeights);

      return () => {
        window.removeEventListener("resize", setEqualHeights);
      };
    }
  }, [data.frontmatter.enable]);

  return (
    <>
      {data.frontmatter.enable && (
        <section className="section overflow-x-hidden">
          <div className="container">
            <div className="row">
              <div className="mx-auto mb-12 text-center md:col-10 lg:col-8 xl:col-6">
                <h2
                  data-aos="fade-up-sm"
                  data-aos-delay="100"
                  dangerouslySetInnerHTML={markdownify(data.frontmatter.title)}
                  className="mb-4"
                />
              </div>
              <div className="col-12">
                <Swiper
                  className="testimonial-slider swiper-container-equal-height"
                  pagination={{
                    el: ".testimonial-slider-pagination",
                    type: "bullets",
                    clickable: true,
                  }}
                  modules={[Pagination, Autoplay]}
                  spaceBetween={24}
                  loop={true}
                  centeredSlides={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  autoHeight={false}
                  watchSlidesProgress={true}
                  breakpoints={{
                    768: {
                      slidesPerView: 2,
                    },
                    992: {
                      slidesPerView: 3,
                    },
                  }}
                >
                  {data.frontmatter.testimonials.map((item, i) => (
                    <SwiperSlide
                      key={item.title + i}
                      className="swiper-slide rounded-xl bg-primary/5 px-8 py-10"
                    >
                      <div className="h-full flex flex-col">
                        <h6 className="text-secondary font-primary font-bold">
                          {item.title}
                        </h6>
                        <blockquote
                          className="mt-8 text-text/90 pb-6"
                          dangerouslySetInnerHTML={markdownify(item.content)}
                        />
                        <div className="flex items-center pt-6 mt-auto border-t border-border">
                          <Image
                            height={70}
                            width={70}
                            className="rounded-full"
                            src={item.avatar}
                            alt={item.name}
                          />
                          <div className="ml-4">
                            <h3 className="text-sm font-primary font-semibold mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm">{item.address}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="testimonial-slider-pagination mt-9 flex items-center justify-center text-center" />
              </div>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        /* Ensure equal heights for testimonial slides */
        :global(.swiper-container-equal-height .swiper-slide) {
          height: auto !important;
        }

        @media (min-width: 768px) {
          :global(.swiper-container-equal-height .swiper-wrapper) {
            display: flex;
            align-items: stretch;
          }
        }
      `}</style>
    </>
  );
};

export default Testimonial;
