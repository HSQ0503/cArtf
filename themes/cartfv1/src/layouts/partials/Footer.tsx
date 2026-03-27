"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import social from "@/config/social.json";
import { markdownify } from "@/lib/utils/textConverter";
import Logo from "@/components/Logo";
import Social from "@/components/Social";

const Footer = () => {
  const pathname = usePathname();
  const { copyright, footer_text } = config.params;

  return (
    <footer
      className="section-sm max-lg:pb-10 overflow-x-hidden"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-primary) 45%, black)",
      }}
    >
      <div className="container">
        <div className="row justify-center md:justify-between md:mb-16 g-5">
          <div className="col-12 lg:col-3">
            <div data-aos="fade-up-sm">
              <Logo isFooter />
            </div>
            <p
              className="py-6 sm:w-3/5 lg:w-full text-sm xl:text-left xl:text-wrap text-white/60"
              dangerouslySetInnerHTML={markdownify(footer_text)}
              data-aos="fade-up-sm"
            />
            <Social
              source={social.main}
              className="social-icons-footer"
              data-aos="fade-up-sm"
            />
          </div>

          <div className="col-12 lg:col-8">
            <div className="flex flex-wrap lg:justify-between max-md:gap-6">
              {menu.footer
                .filter((item: any) => item.children)
                .map((menu: any) => (
                  <div
                    key={menu.title}
                    className="w-[calc(50%_-_1rem)] lg:w-[25%] mb-7 last:mb-0"
                  >
                    <h6
                      className="mb-6 md:mb-10 text-white/90 font-primary font-bold text-lg md:text-sm"
                      data-aos="fade-up-sm"
                      data-aos-delay="200"
                    >
                      {menu.title}
                    </h6>
                    <ul>
                      {menu.children.map(
                        (child: { url: string; name: string }, i: number) => (
                          <li
                            key={child.name}
                            className={`mb-4 last:mb-0 block w-fit text-white/70 hover:text-secondary hover:underline text-sm ${
                              pathname === child.url
                                ? "text-white underline"
                                : ""
                            }`}
                            data-aos="fade-up-sm"
                            data-aos-delay={200 + i * 50}
                          >
                            <Link href={child.url}>{child.name}</Link>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                ))}

              {menu.footer
                .filter((item: any) => item.instagramImages)
                .map((item: any) => (
                  <div
                    key={item.title}
                    className="w-[calc(50%_-_1rem)] md:w-1/2"
                  >
                    <h6
                      className="mb-6 md:mb-10 text-white/90 font-primary font-bold text-lg md:text-sm"
                      data-aos="fade-up-sm"
                      data-aos-delay="200"
                    >
                      {item.title}
                    </h6>
                    <div className="grid grid-cols-2 gap-2">
                      {item.instagramImages.map(
                        (igItem: { image: string; url: string }, i: number) => (
                          <a
                            key={igItem.image}
                            href={igItem.url}
                            className="block overflow-hidden rounded-md hover:opacity-80 transition-opacity"
                            data-aos="zoom-in-sm"
                            data-aos-delay={200 + i * 50}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src={igItem.image}
                              alt="Instagram Image"
                              className="rounded-xl w-full object-cover aspect-square md:h-[176px]"
                              width={200}
                              height={176}
                            />
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="max-md:mt-16 pt-6 border-t border-primary/40">
          <p
            className="text-sm text-center text-white/50 [&_a]:underline"
            dangerouslySetInnerHTML={markdownify(copyright)}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
