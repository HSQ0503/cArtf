import ImageFallback from "@/helpers/ImageFallback";
import { getCategoryBySlug, getTutorials } from "@/lib/tutorials";
import SeoMeta from "@/partials/SeoMeta";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <SeoMeta
        title={`${category.name} Tutorials`}
        meta_title={`${category.name} Tutorials | cArtf`}
        description={category.description}
      />
      <section className="section pt-16 xl:pt-20">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mb-16">
            <div className="w-full md:w-48 shrink-0">
              <div className="overflow-hidden rounded-xl">
                <ImageFallback
                  src={category.image}
                  alt={category.name}
                  width={192}
                  height={256}
                  className="w-full object-cover aspect-[3/4]"
                />
              </div>
            </div>
            <div className="flex-1">
              <Link
                href="/explore"
                className="text-primary text-sm font-medium hover:text-primary/70 transition-colors mb-4 inline-block"
              >
                &larr; All Skills
              </Link>
              <h1 className="mb-4">{category.name}</h1>
              <p className="text-text-light max-w-2xl text-balance">
                {category.description}
              </p>
              <p className="text-text-light text-sm mt-3">
                {category.videos.length} tutorial
                {category.videos.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {category.videos.map((video) => (
              <div key={video.id}>
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-border">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <h3 className="font-primary font-semibold text-text-dark text-lg mb-2">
                  {video.title}
                </h3>
                <p className="text-text-light text-sm leading-relaxed mb-2">
                  {video.description}
                </p>
                <p className="text-primary text-xs font-medium">
                  {video.artist}
                </p>
              </div>
            ))}
          </div>

          {category.videos.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-light text-lg">
                No tutorials yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
