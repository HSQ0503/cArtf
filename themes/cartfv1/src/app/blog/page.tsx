import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import config from "@/config/config.json";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import { sortByDate } from "@/lib/utils/sortFunctions";
import { markdownify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";
import { TBlog } from "@/types";

const BLOG_FOLDER = "blog";

export default function BlogIndexPage() {
  const posts = getSinglePage(BLOG_FOLDER) as TBlog[];
  const postIndex = getListPage("blog/_index.md") as TBlog;
  const sortedPosts = sortByDate(posts);
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  const currentPosts = sortedPosts.slice(0, config.settings.pagination);

  return (
    <>
      <SeoMeta
        title={postIndex.frontmatter.title}
        meta_title={postIndex.frontmatter.meta_title}
        image={postIndex.frontmatter.image}
        description={postIndex.frontmatter.description}
      />
      <section className="section pt-12 bg-primary/5">
        <div className="container">
          <div className="row justify-center">
            <div className="col-10 text-center capitalize">
              <h1
                className="mb-2 xl:text-[100px] font-normal"
                dangerouslySetInnerHTML={markdownify(
                  postIndex.frontmatter.title,
                )}
                data-aos="fade-up-sm"
                data-aos-delay="150"
              />
              <p
                className="text-balance"
                dangerouslySetInnerHTML={markdownify(
                  postIndex.frontmatter.description || "",
                )}
                data-aos="fade-up-sm"
                data-aos-delay="200"
              />
            </div>
          </div>

          <div className="mt-14">
            <div className="row g-4">
              {currentPosts.map((post, i) => (
                <div
                  className="md:col-4"
                  key={post.slug}
                  data-aos="fade-up-sm"
                  data-aos-delay={i * 150}
                >
                  <BlogCard hideContent data={post} />
                </div>
              ))}
            </div>
            <Pagination
              section={BLOG_FOLDER}
              currentPage={1}
              totalPages={totalPages}
            />
          </div>
        </div>
      </section>
    </>
  );
}
