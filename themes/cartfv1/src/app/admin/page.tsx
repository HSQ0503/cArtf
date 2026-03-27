"use client";

import { useEffect, useState } from "react";

type Video = {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  artist: string;
};

type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
  videos: Video[];
};

type TutorialsData = {
  categories: Category[];
};

export default function AdminPage() {
  const [data, setData] = useState<TutorialsData | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetch("/api/tutorials")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.categories.length > 0) setSelectedSlug(d.categories[0].slug);
      });
  }, []);

  const selectedCategory = data?.categories.find(
    (c) => c.slug === selectedSlug,
  );

  const save = async (updated: TutorialsData) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/tutorials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setMessage("Saved successfully");
        setData(updated);
      } else {
        setMessage("Failed to save");
      }
    } catch {
      setMessage("Failed to save");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const addVideo = (video: Omit<Video, "id">) => {
    if (!data || !selectedCategory) return;
    const id = `${selectedSlug}-${Date.now()}`;
    const updated = {
      ...data,
      categories: data.categories.map((c) =>
        c.slug === selectedSlug
          ? { ...c, videos: [...c.videos, { ...video, id }] }
          : c,
      ),
    };
    save(updated);
    setShowAddForm(false);
  };

  const updateVideo = (video: Video) => {
    if (!data) return;
    const updated = {
      ...data,
      categories: data.categories.map((c) =>
        c.slug === selectedSlug
          ? {
              ...c,
              videos: c.videos.map((v) => (v.id === video.id ? video : v)),
            }
          : c,
      ),
    };
    save(updated);
    setEditingVideo(null);
  };

  const deleteVideo = (videoId: string) => {
    if (!data || !confirm("Delete this video?")) return;
    const updated = {
      ...data,
      categories: data.categories.map((c) =>
        c.slug === selectedSlug
          ? { ...c, videos: c.videos.filter((v) => v.id !== videoId) }
          : c,
      ),
    };
    save(updated);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-light">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-body">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-secondary font-bold text-text-dark">
            Tutorial Admin
          </h1>
          {message && (
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                message.includes("success")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </span>
          )}
        </div>

        <div className="flex gap-6 max-lg:flex-col">
          {/* Sidebar — Categories */}
          <div className="lg:w-64 shrink-0">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-light mb-3">
              Categories
            </h2>
            <div className="flex lg:flex-col gap-2 flex-wrap">
              {data.categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => {
                    setSelectedSlug(c.slug);
                    setShowAddForm(false);
                    setEditingVideo(null);
                  }}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedSlug === c.slug
                      ? "bg-primary/15 text-primary"
                      : "hover:bg-border/50 text-text"
                  }`}
                >
                  {c.name}
                  <span className="text-text-light ml-2 text-xs">
                    {c.videos.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main — Videos */}
          <div className="flex-1 min-w-0">
            {selectedCategory && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-text-dark">
                    {selectedCategory.name} Videos
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setEditingVideo(null);
                    }}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    + Add Video
                  </button>
                </div>

                {showAddForm && (
                  <VideoForm
                    onSubmit={addVideo}
                    onCancel={() => setShowAddForm(false)}
                  />
                )}

                {selectedCategory.videos.length === 0 && !showAddForm && (
                  <div className="text-center py-16 border border-dashed border-border rounded-xl">
                    <p className="text-text-light">
                      No videos yet. Click &quot;+ Add Video&quot; to get
                      started.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {selectedCategory.videos.map((video) => (
                    <div
                      key={video.id}
                      className="border border-border rounded-xl p-5"
                    >
                      {editingVideo?.id === video.id ? (
                        <VideoForm
                          initial={video}
                          onSubmit={(v) =>
                            updateVideo({ ...v, id: video.id })
                          }
                          onCancel={() => setEditingVideo(null)}
                        />
                      ) : (
                        <div className="flex gap-5 items-start">
                          <div className="w-48 shrink-0 aspect-video rounded-lg overflow-hidden bg-border hidden sm:block">
                            <img
                              src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-text-dark mb-1 truncate">
                              {video.title}
                            </h3>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: { title: string; description: string; youtubeId: string; artist: string };
  onSubmit: (video: { title: string; description: string; youtubeId: string; artist: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [youtubeId, setYoutubeId] = useState(initial?.youtubeId ?? "");
  const [artist, setArtist] = useState(initial?.artist ?? "");

  const extractYoutubeId = (input: string): string => {
    const match = input.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match ? match[1] : input;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      youtubeId: extractYoutubeId(youtubeId),
      artist,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-primary/30 bg-primary/[0.03] rounded-xl p-5 mb-4 space-y-4"
    >
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
          YouTube URL or Video ID
        </label>
        <input
          type="text"
          value={youtubeId}
          onChange={(e) => setYoutubeId(e.target.value)}
          required
          placeholder="https://youtube.com/watch?v=... or video ID"
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
          Artist / Channel
        </label>
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors"
        >
          {initial ? "Update" : "Add Video"}
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
