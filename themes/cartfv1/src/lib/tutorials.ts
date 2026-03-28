import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/tutorials.json");
const REDIS_KEY = "tutorials";

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

function getRedis(): Redis | null {
  const url =
    process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

function readFromFile(): TutorialsData {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function getTutorials(): Promise<TutorialsData> {
  const redis = getRedis();
  if (redis) {
    const cached = await redis.get<TutorialsData>(REDIS_KEY);
    if (cached) return cached;
    // First run — seed Redis from the bundled JSON file
    const fileData = readFromFile();
    await redis.set(REDIS_KEY, fileData);
    return fileData;
  }
  // No Redis configured — use filesystem (local dev)
  return readFromFile();
}

export async function saveTutorials(data: TutorialsData): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(REDIS_KEY, data);
  }
  // Also write to filesystem when possible (local dev backup)
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  } catch {
    if (!redis) throw new Error("No storage backend available");
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  const data = await getTutorials();
  return data.categories.find((c) => c.slug === slug);
}
