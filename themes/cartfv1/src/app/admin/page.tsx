"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

type Toast = {
  message: string;
  type: "success" | "error";
};

function extractYoutubeId(input: string): string {
  const match = input.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : input.trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isValidYoutubeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

// ─── Main ───────────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_password");
    if (stored) {
      fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: stored }),
      }).then((res) => {
        if (res.ok) {
          setPassword(stored);
          setAuthenticated(true);
        } else {
          sessionStorage.removeItem("admin_password");
        }
        setChecking(false);
      });
    } else {
      setChecking(false);
    }
  }, []);

  const handleLogin = async (pw: string) => {
    const res = await fetch("/api/tutorials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      setPassword(pw);
      setAuthenticated(true);
      sessionStorage.setItem("admin_password", pw);
      return true;
    }
    return false;
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body">
        <p className="text-text-light">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <AdminPanel password={password} />;
}

// ─── Login ──────────────────────────────────────────────
function LoginForm({
  onLogin,
}: {
  onLogin: (pw: string) => Promise<boolean>;
}) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const ok = await onLogin(pw);
    if (!ok) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-body">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-8">
        <h1 className="text-2xl font-secondary font-bold text-text-dark text-center mb-2">
          Admin Panel
        </h1>
        <p className="text-text-light text-sm text-center mb-8">
          Enter the admin password to continue
        </p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          required
          autoFocus
          className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:border-primary ${
            error ? "border-red-400" : "border-border"
          }`}
        />
        {error && (
          <p className="text-red-500 text-xs mt-2">Incorrect password</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 px-4 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          {loading ? "Checking..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

// ─── Admin Panel ────────────────────────────────────────
function AdminPanel({ password }: { password: string }) {
  const [data, setData] = useState<TutorialsData | null>(null);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    fetch("/api/tutorials")
      .then((r) => r.json())
      .then((d: TutorialsData) => {
        setData(d);
        if (d.categories.length > 0) setSelectedSlug(d.categories[0].slug);
      });
  }, []);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  const selectedCategory = useMemo(
    () => data?.categories.find((c) => c.slug === selectedSlug),
    [data, selectedSlug],
  );

  const save = useCallback(
    async (updated: TutorialsData) => {
      setSaving(true);
      try {
        const res = await fetch("/api/tutorials", {
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

  // ── Video ops ──

  const addVideo = useCallback(
    (video: Omit<Video, "id">) => {
      if (!data || !selectedSlug) return;
      const id = `${selectedSlug}-${Date.now()}`;
      const updated: TutorialsData = {
        ...data,
        categories: data.categories.map((c) =>
          c.slug === selectedSlug
            ? { ...c, videos: [...c.videos, { ...video, id }] }
            : c,
        ),
      };
      save(updated);
      setShowAddVideo(false);
    },
    [data, selectedSlug, save],
  );

  const updateVideo = useCallback(
    (video: Video) => {
      if (!data) return;
      const updated: TutorialsData = {
        ...data,
        categories: data.categories.map((c) =>
          c.slug === selectedSlug
            ? {
                ...c,
                videos: c.videos.map((v) =>
                  v.id === video.id ? video : v,
                ),
              }
            : c,
        ),
      };
      save(updated);
      setEditingVideo(null);
    },
    [data, selectedSlug, save],
  );

  const deleteVideo = useCallback(
    (videoId: string) => {
      if (!data || !confirm("Delete this video?")) return;
      const updated: TutorialsData = {
        ...data,
        categories: data.categories.map((c) =>
          c.slug === selectedSlug
            ? { ...c, videos: c.videos.filter((v) => v.id !== videoId) }
            : c,
        ),
      };
      save(updated);
    },
    [data, selectedSlug, save],
  );

  const moveVideo = useCallback(
    (videoId: string, direction: "up" | "down") => {
      if (!data || !selectedCategory) return;
      const videos = [...selectedCategory.videos];
      const idx = videos.findIndex((v) => v.id === videoId);
      if (idx === -1) return;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= videos.length) return;
      [videos[idx], videos[swapIdx]] = [videos[swapIdx], videos[idx]];
      const updated: TutorialsData = {
        ...data,
        categories: data.categories.map((c) =>
          c.slug === selectedSlug ? { ...c, videos } : c,
        ),
      };
      save(updated);
    },
    [data, selectedSlug, selectedCategory, save],
  );

  // ── Category ops ──

  const addCategory = useCallback(
    (cat: { name: string; description: string; image: string }) => {
      if (!data) return;
      const slug = slugify(cat.name);
      if (data.categories.some((c) => c.slug === slug)) {
        showToast("A category with that name already exists", "error");
        return;
      }
      const updated: TutorialsData = {
        ...data,
        categories: [...data.categories, { ...cat, slug, videos: [] }],
      };
      save(updated);
      setSelectedSlug(slug);
      setShowAddCategory(false);
    },
    [data, save, showToast],
  );

  const updateCategory = useCallback(
    (cat: {
      slug: string;
      name: string;
      description: string;
      image: string;
    }) => {
      if (!data) return;
      const updated: TutorialsData = {
        ...data,
        categories: data.categories.map((c) =>
          c.slug === cat.slug
            ? {
                ...c,
                name: cat.name,
                description: cat.description,
                image: cat.image,
              }
            : c,
        ),
      };
      save(updated);
      setEditingCategory(null);
    },
    [data, save],
  );

  const deleteCategory = useCallback(
    (slug: string) => {
      if (!data) return;
      const cat = data.categories.find((c) => c.slug === slug);
      if (!cat) return;
      const msg =
        cat.videos.length > 0
          ? `Delete "${cat.name}" and its ${cat.videos.length} video(s)? This cannot be undone.`
          : `Delete "${cat.name}"?`;
      if (!confirm(msg)) return;
      const updated: TutorialsData = {
        ...data,
        categories: data.categories.filter((c) => c.slug !== slug),
      };
      save(updated);
      if (selectedSlug === slug) {
        setSelectedSlug(updated.categories[0]?.slug ?? "");
      }
    },
    [data, selectedSlug, save],
  );

  const handleLogout = () => {
    sessionStorage.removeItem("admin_password");
    window.location.reload();
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-body">
        <p className="text-text-light">Loading tutorials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-body">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-secondary font-bold text-text-dark">
              Tutorial Admin
            </h1>
            <p className="text-text-light text-sm mt-1">
              Manage categories and videos
            </p>
          </div>
          <div className="flex items-center gap-4">
            {saving && (
              <span className="text-sm text-text-light">Saving...</span>
            )}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-border/50 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="flex gap-6 max-lg:flex-col">
          {/* ── Sidebar ── */}
          <div className="lg:w-64 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-light">
                Categories
              </h2>
              <button
                onClick={() => {
                  setShowAddCategory(true);
                  setEditingCategory(null);
                }}
                className="text-primary text-xs font-medium hover:text-primary/70 transition-colors"
              >
                + Add
              </button>
            </div>

            {showAddCategory && (
              <CategoryForm
                onSubmit={addCategory}
                onCancel={() => setShowAddCategory(false)}
              />
            )}

            <div className="flex lg:flex-col gap-2 flex-wrap">
              {data.categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => {
                    setSelectedSlug(c.slug);
                    setShowAddVideo(false);
                    setEditingVideo(null);
                    setEditingCategory(null);
                  }}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full ${
                    selectedSlug === c.slug
                      ? "bg-primary/15 text-primary"
                      : "hover:bg-border/50 text-text"
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-text-light ml-2 text-xs">
                    {c.videos.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">
            {selectedCategory && (
              <>
                {/* Category header */}
                <div className="flex items-start justify-between mb-6 gap-4">
                  <div className="flex-1 min-w-0">
                    {editingCategory === selectedCategory.slug ? (
                      <CategoryForm
                        initial={selectedCategory}
                        onSubmit={(cat) =>
                          updateCategory({
                            ...cat,
                            slug: selectedCategory.slug,
                          })
                        }
                        onCancel={() => setEditingCategory(null)}
                      />
                    ) : (
                      <>
                        <h2 className="text-lg font-semibold text-text-dark">
                          {selectedCategory.name}
                        </h2>
                        <p className="text-sm text-text-light mt-1">
                          {selectedCategory.description}
                        </p>
                      </>
                    )}
                  </div>
                  {editingCategory !== selectedCategory.slug && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() =>
                          setEditingCategory(selectedCategory.slug)
                        }
                        className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-border/50 transition-colors"
                      >
                        Edit Category
                      </button>
                      <button
                        onClick={() => deleteCategory(selectedCategory.slug)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Add video */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => {
                      setShowAddVideo(true);
                      setEditingVideo(null);
                    }}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    + Add Video
                  </button>
                </div>

                {showAddVideo && (
                  <VideoForm
                    onSubmit={addVideo}
                    onCancel={() => setShowAddVideo(false)}
                  />
                )}

                {selectedCategory.videos.length === 0 && !showAddVideo && (
                  <div className="text-center py-16 border border-dashed border-border rounded-xl">
                    <p className="text-text-light mb-4">
                      No videos in this category yet
                    </p>
                    <button
                      onClick={() => setShowAddVideo(true)}
                      className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors"
                    >
                      + Add First Video
                    </button>
                  </div>
                )}

                {/* Video list */}
                <div className="space-y-4">
                  {selectedCategory.videos.map((video, idx) => (
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
                        <div className="flex gap-4 items-start">
                          {/* Reorder */}
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
                              disabled={
                                idx ===
                                selectedCategory.videos.length - 1
                              }
                              className="w-7 h-7 flex items-center justify-center rounded border border-border hover:bg-border/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-text-light"
                              title="Move down"
                            >
                              &#8595;
                            </button>
                          </div>

                          {/* Thumbnail */}
                          <div className="w-48 shrink-0 aspect-video rounded-lg overflow-hidden bg-border hidden sm:block">
                            <img
                              src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
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

                          {/* Actions */}
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

            {data.categories.length === 0 && (
              <div className="text-center py-20">
                <p className="text-text-light mb-4">No categories yet</p>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors"
                >
                  + Add First Category
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Video Form ─────────────────────────────────────────
function VideoForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Video;
  onSubmit: (video: Omit<Video, "id"> & { id?: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [youtubeInput, setYoutubeInput] = useState(initial?.youtubeId ?? "");
  const [artist, setArtist] = useState(initial?.artist ?? "");

  const extractedId = useMemo(
    () => extractYoutubeId(youtubeInput),
    [youtubeInput],
  );
  const validId = isValidYoutubeId(extractedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, youtubeId: extractedId, artist });
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

// ─── Category Form ──────────────────────────────────────
function CategoryForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: { name: string; description: string; image: string };
  onSubmit: (cat: {
    name: string;
    description: string;
    image: string;
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      image: image || `/images/titlecards/${slugify(name)}.jpg`,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-primary/30 bg-primary/[0.03] rounded-xl p-4 mb-4 space-y-3"
    >
      <div>
        <label className="block text-xs font-medium text-text-dark mb-1">
          Category Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Anatomy"
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
        />
        {name && !initial && (
          <p className="text-xs text-text-light mt-1">
            Slug: <span className="font-mono">{slugify(name)}</span>
          </p>
        )}
      </div>
      <div>
        <label className="block text-xs font-medium text-text-dark mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Short description of this skill category"
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:outline-none resize-y"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-dark mb-1">
          Image Path (optional)
        </label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="/images/titlecards/category-name.jpg"
          className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/80 transition-colors"
        >
          {initial ? "Update" : "Add Category"}
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
