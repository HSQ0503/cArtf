import SeoMeta from "@/partials/SeoMeta";
import { getDiy } from "@/lib/diy";
import DrawItYourselfClient from "./DrawItYourselfClient";

export default async function DrawItYourselfPage() {
  const { videos } = await getDiy();

  return (
    <>
      <SeoMeta
        title="Draw It Yourself"
        meta_title="Draw It Yourself | cArtf"
        description="Real artists. Real techniques. No prompts needed."
      />
      <DrawItYourselfClient videos={videos} />
    </>
  );
}
