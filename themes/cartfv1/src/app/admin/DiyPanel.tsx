"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type DiySize = "large" | "medium" | "small";

type DiyVideo = {
  id: string;
  title: string;
  artist: string;
  description: string;
  youtubeId: string;
  size: DiySize;
};

type DiyData = {
  videos: DiyVideo[];
};

function extractYoutubeId(input: string): string {
  const match = input.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : input.trim();
}

function isValidYoutubeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

export default function DiyPanel({
  password,
  showToast,
}: {
  password: string;
  showToast: (message: string, type: "success" | "error") => void;
}) {
  const [data, setData] = useState<DiyData | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingVideo, setEditingVideo] = useState<DiyVideo | null>(null);
  const [showAddVideo, setShowAddVideo] = useState(false);

  useEffect(() => {
    fetch("/api/diy")
      .then((r) => r.json())
      .then((d: DiyData) => setData(d));
  }, []);

  const save = useCallback(
    async (updated: DiyData) => {
      setSaving(true);
      try {
        const res = await fetch("/api/diy", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": password,
          },
          body: JSON.stringify(updated),
        });
        if (res.status === 401) {
          showToast("Session expired — please refresh", "error");
        } else if (!res.ok) {
          const body = await res.json().catch(() => null);
          showToast(body?.error || "Failed to save", "error");
        } else {
          setData(updated);
          showToast("Saved", "success");
        }
      } catch {
        showToast("Failed to save", "error");
      }
      setSaving(false);
    },
    [password, showToast],
  );

  const addVideo = useCallback(
    (video: Omit<DiyVideo, "id">) => {
      if (!data) return;
      const id = `diy-${Date.now()}`;
      const updated: DiyData = {
        videos: [...data.videos, { ...video, id }],
      };
      save(updated);
      setShowAddVideo(false);
    },
    [data, save],
  );

  const updateVideo = useCallback(
    (video: DiyVideo) => {
      if (!data) return;
      const updated: DiyData = {
        videos: data.videos.map((v) => (v.id === video.id ? video : v)),
      };
      save(updated);
      setEditingVideo(null);
    },
    [data, save],
  );

  const deleteVideo = useCallback(
    (videoId: string) => {
      if (!data || !confirm("Delete this video?")) return;
      const updated: DiyData = {
        videos: data.videos.filter((v) => v.id !== videoId),
      };
      save(updated);
    },
    [data, save],
  );

  const moveVideo = useCallback(
    (videoId: string, direction: "up" | "down") => {
      if (!data) return;
      const videos = [...data.videos];
      const idx = videos.findIndex((v) => v.id === videoId);
      if (idx === -1) return;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= videos.length) return;
      [videos[idx], videos[swapIdx]] = [videos[swapIdx], videos[idx]];
      save({ videos });
    },
    [data, save],
  );

  if (!data) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-light">Loading DIY videos...</p>
      </div>
    );
  }

  return (
    <>
      {saving && <div className="mb-3 text-sm text-text-light">Saving...</div>}

      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-dark">
            Draw It Yourself Gallery
          </h2>
          <p className="text-sm text-text-light mt-1">
            Featured videos displayed on the /draw-it-yourself page.
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddVideo(true);
            setEditingVideo(null);
          }}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors shrink-0"
        >
          + Add Video
        </button>
      </div>

      {showAddVideo && (
        <DiyVideoForm
          onSubmit={addVideo}
          onCancel={() => setShowAddVideo(false)}
        />
      )}

      {data.videos.length === 0 && !showAddVideo && (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <p className="text-text-light mb-4">No videos yet</p>
          <button
            onClick={() => setShowAddVideo(true)}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors"
          >
            + Add First Video
          </button>
        </div>
      )}

      <div className="space-y-4">
        {data.videos.map((video, idx) => (
          <div
            key={video.id}
            className="border border-border rounded-xl p-5"
          >
            {editingVideo?.id === video.id ? (
              <DiyVideoForm
                initial={video}
                onSubmit={(v) => updateVideo({ ...v, id: video.id })}
                onCancel={() => setEditingVideo(null)}
              />
            ) : (
              <div className="flex gap-4 items-start">
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveVideo(video.id, "up")}
                    disabled={idx === 0}
                    className="w-7 h-7 flex items-center justify-center rounded border border-border hover:bg-border/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-text-light"
                    title="Move up"
                  >
                    &#8593;
                  </button>
                  <button
                    onClick={() => moveVideo(video.id, "down")}
                    disabled={idx === data.videos.length - 1}
                    className="w-7 h-7 flex items-center justify-center rounded border border-border hover:bg-border/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-text-light"
                    title="Move down"
                  >
                    &#8595;
                  </button>
                </div>

                <div className="w-48 shrink-0 aspect-video rounded-lg overflow-hidden bg-border hidden sm:block">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-text-dark truncate">
                      {video.title}
                    </h3>
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-border text-text-light shrink-0">
                      {video.size}
                    </span>
                  </div>
                  <p className="text-sm text-text-light line-clamp-2 mb-2">
                    {video.description}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {video.artist}
                  </p>
                  <p className="text-xs text-text-light mt-1 font-mono">
                    ID: {video.youtubeId}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditingVideo(video)}
                    className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-border/50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function DiyVideoForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: DiyVideo;
  onSubmit: (video: Omit<DiyVideo, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [youtubeInput, setYoutubeInput] = useState(initial?.youtubeId ?? "");
  const [artist, setArtist] = useState(initial?.artist ?? "");
  const [size, setSize] = useState<DiySize>(initial?.size ?? "medium");

  const extractedId = useMemo(
    () => extractYoutubeId(youtubeInput),
    [youtubeInput],
  );
  const validId = isValidYoutubeId(extractedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      youtubeId: extractedId,
      artist,
      size,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-primary/30 bg-primary/[0.03] rounded-xl p-5 mb-4 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-text-dark mb-1">
          YouTube URL or Video ID
        </label>
        <input
          type="text"
          value={youtubeInput}
          onChange={(e) => setYoutubeInput(e.target.value)}
          required
          placeholder="https://youtube.com/watch?v=... or paste video ID"
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
        />
        {youtubeInput && validId && (
          <div className="mt-3 flex gap-4 items-start p-3 bg-white rounded-lg border border-border">
            <div className="w-40 shrink-0 aspect-video rounded overflow-hidden bg-border">
              <img
                src={`https://img.youtube.com/vi/${extractedId}/mqdefault.jpg`}
                alt="Video preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs text-text-light">
              <p className="font-medium text-text-dark mb-1">Preview</p>
              <p className="font-mono">{extractedId}</p>
            </div>
          </div>
        )}
        {youtubeInput && !validId && (
          <p className="text-red-500 text-xs mt-1">
            Could not detect a valid YouTube video ID
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-text-dark mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-dark mb-1">
          Artist / Channel
        </label>
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-dark mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:outline-none resize-y"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-dark mb-1">
          Card Size
        </label>
        <div className="flex gap-2">
          {(["large", "medium", "small"] as DiySize[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                size === s
                  ? "bg-primary text-white"
                  : "border border-border text-text hover:bg-border/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-light mt-1">
          Controls card height in the gallery wall layout.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!validId}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initial ? "Update Video" : "Add Video"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-border/50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
