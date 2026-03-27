import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/tutorials.json");

export type Video = {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  artist: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
  videos: Video[];
};

export type TutorialsData = {
  categories: Category[];
};

export function getTutorials(): TutorialsData {
  const data = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(data);
}

export function saveTutorials(data: TutorialsData): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const data = getTutorials();
  return data.categories.find((c) => c.slug === slug);
}
