import ImageFallback from "@/helpers/ImageFallback";
import { getTutorials } from "@/lib/tutorials";
import SeoMeta from "@/partials/SeoMeta";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ExplorePage() {
  const { categories } = getTutorials();

  return (
    <>
      <SeoMeta
        title="Explore Skills"
        meta_title="Explore Skills | cArtf"
        description="Browse curated digital art tutorials organized by skill."
      />
      <section className="section pt-16 xl:pt-20">
        <div className="container">
          <div className="text-center mb-14">
            <h1 className="mb-4">Explore Skills</h1>
            <p className="text-text-light max-w-lg mx-auto">
              Browse tutorials organized by skill. Each category is
              hand-picked to help you learn real techniques from real artists.
            </p>
          </div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-5 lg:gap-6">
            {categories.map((category, i) => {
              const aspects = [
                "aspect-[3/4]",
                "aspect-[4/5]",
                "aspect-[3/4]",
                "aspect-[2/3]",
                "aspect-[3/4]",
                "aspect-[5/6]",
                "aspect-[4/5]",
              ];
              return (
                <Link
                  key={category.slug}
                  href={`/explore/${category.slug}`}
                  className="block break-inside-avoid mb-5 lg:mb-6 group"
                >
                  <div className="overflow-hidden rounded-xl">
                    <ImageFallback
                      src={category.image}
                      alt={category.name}
                      width={400}
                      height={500}
                      className={`w-full object-cover ${aspects[i % aspects.length]} transition-transform duration-500 group-hover:scale-105`}
                    />
                  </div>
                  <h3 className="font-secondary font-bold text-text-dark mt-3 text-base">
                    {category.name}
                  </h3>
                  <p className="text-text-light text-xs tracking-[0.15em] uppercase mt-0.5">
                    {category.videos.length} TUTORIALS
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
