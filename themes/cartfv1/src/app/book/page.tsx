import { getListPage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import config from "@/config/config.json";
import { TBook } from "@/types";

export default function BookPage() {
  const book = getListPage("book/_index.md") as TBook;

  const { contact_form_action } = config.params;
  const { title, description } = book.frontmatter;

  return (
    <>
      <SeoMeta {...book.frontmatter} />
      <PageHeader
        title={title}
        description={description}
        backgroundColor="bg-body"
        height="h-[300px] md:h-[360px]"
      />
      <div className="container relative z-10">
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
                  <label htmlFor="date" className="form-label">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="date"
                    name="date"
                    className="form-input"
                    type="date"
                    required
                  />
                </div>
                <div className="md:col-6">
                  <label htmlFor="time" className="form-label">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="time"
                    name="time"
                    className="form-input"
                    type="time"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="md:col-6">
                  <label htmlFor="phone" className="form-label">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className="form-input"
                    type="tel"
                    placeholder="xxx-xxx-xxxx"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="total-person" className="form-label">
                  Total Person <span className="text-red-500">*</span>
                </label>
                <input
                  id="total-person"
                  name="total-person"
                  className="form-input"
                  type="number"
                  placeholder="Enter total person"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn w-full bg-secondary text-white"
              >
                Book A Table
              </button>
            </form>
          </div>
        </div>
      </div>

      <iframe
        className="w-full h-[810px] -mt-96 md:-mt-60"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47416.27917198903!2d-92.94334545729342!3d42.03208138701794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87efa530badb1481%3A0xf015a2c84b2c1be4!2sMarshalltown%2C%20IA%2050158%2C%20USA!5e0!3m2!1sen!2sbd!4v1754466434457!5m2!1sen!2sbd"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </>
  );
}
