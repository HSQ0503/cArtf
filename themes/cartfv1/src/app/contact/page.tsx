import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { TContact } from "@/types";
import Link from "next/link";

export default function ContactPage() {
  const contactData = getListPage("contact/_index.md") as TContact;
  const { title, description, meta_title, image, open_hours } =
    contactData.frontmatter;
  const { contact_form_action }: { contact_form_action: string } =
    config.params;
  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />

      <PageHeader title={title} description={description} />

      <section className="section pt-0 -mt-80 md:-mt-52">
        <div className="container">
          <div className="row">
            <div className="mx-auto col-11 sm:col-10 lg:col-7">
              <form
                className="p-10 rounded-2xl bg-body"
                action={contact_form_action}
                method="POST"
                style={{
                  boxShadow:
                    "0 8px 30px rgba(0, 0, 0, 0.05), 0 2px 30px rgba(0, 0, 0, 0.05)",
                }}
                data-aos="fade-up-sm"
                data-aos-delay="250"
              >
                <div className="row g-4 mb-6">
                  <div className="md:col-6">
                    <label htmlFor="name" className="form-label">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      className="form-input"
                      type="text"
                      required
                    />
                  </div>
                  <div className="md:col-6">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      className="form-input"
                      type="email"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="form-label">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    className="form-input"
                    type="text"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="form-label">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-input"
                    rows={2}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn w-full bg-secondary text-white"
                >
                  Send Message
                </button>
              </form>

              {/* contact information */}
              <div className="mt-16">
                <div
                  className="row g-5"
                  data-aos="fade-up-sm"
                  data-aos-delay="250"
                >
                  <div className="sm:col-6 md:col-4">
                    <h6 className="font-primary font-bold text-lg mb-4">
                      Call Us:
                    </h6>
                    <a href={`tel:${config.contact.phone}`}>
                      <p
                        className="text-secondary h6 font-semibold font-primary"
                        dangerouslySetInnerHTML={markdownify(
                          config.contact.phone,
                        )}
                      />
                    </a>
                  </div>
                  {open_hours && open_hours.length > 0 && (
                    <div className="sm:col-6 md:col-4">
                      <h6 className="font-primary font-bold text-lg mb-4">
                        Open Hours:
                      </h6>
                      <ul>
                        {open_hours.map((hour, i: number) => (
                          <li key={i} className="text-text-light">
                            {hour}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="sm:col-6 md:col-4">
                    <h6 className="font-primary font-bold text-lg mb-4">
                      Our Location:
                    </h6>
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.contact.address)}`}
                    >
                      <p
                        className="text-text-light text-balance"
                        dangerouslySetInnerHTML={markdownify(
                          config.contact.address,
                        )}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
