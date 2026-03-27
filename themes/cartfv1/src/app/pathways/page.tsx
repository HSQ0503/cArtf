import SeoMeta from "@/partials/SeoMeta";
import PathwayClient from "./PathwayClient";

const steps = [
  {
    number: "01",
    title: "Understanding Face Proportions",
    description:
      "Before you draw a single line, learn the universal landmarks of the human face. This step gives you the mental grid every portrait starts with.",
    videoId: "dBDsM6dXF-4",
  },
  {
    number: "02",
    title: "Sketching the Head Structure",
    description:
      "Turn that proportional knowledge into confident construction lines. Learn the Loomis method and how to sketch heads from any angle.",
    videoId: "dBDsM6dXF-4",
  },
  {
    number: "03",
    title: "Drawing Expressive Eyes",
    description:
      "The eyes carry the emotion of every portrait. Learn their anatomy, how light hits the iris, and how to give them life.",
    videoId: "dBDsM6dXF-4",
  },
  {
    number: "04",
    title: "Rendering Realistic Skin",
    description:
      "Skin isn't one color \u2014 it's layers. Learn to build up tones, handle subsurface scattering, and paint skin that glows.",
    videoId: "dBDsM6dXF-4",
  },
  {
    number: "05",
    title: "Painting Hair with Flow",
    description:
      "Hair is about rhythm, not individual strands. Learn to block in masses, define clumps, and add flyaways for realism.",
    videoId: "dBDsM6dXF-4",
  },
  {
    number: "06",
    title: "Mastering Light & Shadow",
    description:
      "Light defines form. Understand core shadows, bounce light, ambient occlusion, and how to make your subjects feel three-dimensional.",
    videoId: "dBDsM6dXF-4",
  },
  {
    number: "07",
    title: "Color Theory for Portraits",
    description:
      "Move beyond guesswork. Learn warm vs. cool light, color zones of the face, and how to pick palettes that feel natural.",
    videoId: "dBDsM6dXF-4",
  },
  {
    number: "08",
    title: "Painting Fabric & Clothing",
    description:
      "Fabric follows the body. Learn how different materials fold, how to simplify complex drapery, and how to suggest texture.",
    videoId: "dBDsM6dXF-4",
  },
  {
    number: "09",
    title: "Composition & Framing",
    description:
      "A great portrait isn't just a face \u2014 it's a story. Learn the rule of thirds, leading lines, and how to frame your subject.",
    videoId: "dBDsM6dXF-4",
  },
  {
    number: "10",
    title: "Final Rendering & Polish",
    description:
      "Bring it all together. Learn final pass techniques \u2014 edge refinement, color grading, subtle highlights, and knowing when to stop.",
    videoId: "dBDsM6dXF-4",
  },
];

export default function PathwayPage() {
  return (
    <>
      <SeoMeta
        title="Your Learning Path \u2014 cArtf"
        meta_title="Pathway \u2014 cArtf"
        description="A 10-step guided journey from blank canvas to finished portrait. Learn real digital art skills, one step at a time."
      />
      <PathwayClient steps={steps} />
    </>
  );
}
