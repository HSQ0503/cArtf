import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/diy.json");
const REDIS_KEY = "diy";

export type DiySize = "large" | "medium" | "small";

export type DiyVideo = {
  id: string;
  title: string;
  artist: string;
  description: string;
  youtubeId: string;
  size: DiySize;
};

export type DiyData = {
  videos: DiyVideo[];
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

function readFromFile(): DiyData {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function getDiy(): Promise<DiyData> {
  const redis = getRedis();
  if (redis) {
    const cached = await redis.get<DiyData>(REDIS_KEY);
    if (cached) return cached;
    const fileData = readFromFile();
    await redis.set(REDIS_KEY, fileData);
    return fileData;
  }
  return readFromFile();
}

export async function saveDiy(data: DiyData): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(REDIS_KEY, data);
  }
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  } catch {
    if (!redis) throw new Error("No storage backend available");
  }
}
