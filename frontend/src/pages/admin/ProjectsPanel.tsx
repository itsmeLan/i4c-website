import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Project = {
  _id: string;
  title: string;
  category: string;
  location?: string;
  year?: string;
  client?: string;
  description?: string;
  status?: "Completed" | "In Progress";
  coverImageUrl?: string;
  images?: { url: string; publicId: string }[];
};

export default function ProjectsPanel({
  projects,
  onCreate,
  onUpdate,
  onDelete,
}: {
  projects: Project[];
  onCreate: (p: Omit<Project, "_id">) => Promise<void>;
  onUpdate: (id: string, p: Omit<Project, "_id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "file">("url");

  // Form
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("commercial");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("");
  const [client, setClient] = useState("");

  function resetForm() {
    setTitle("");
    setCategory("commercial");
    setDescription("");
    setCoverImageUrl("");
    setLocation("");
    setYear("");
    setClient("");
    setEditingId(null);
    setImageMode("url");
  }

  function openCreate() {
    resetForm();
    setSheetOpen(true);
  }

  function openEdit(p: Project) {
    setEditingId(p._id);
    setTitle(p.title);
    setCategory(p.category || "commercial");
    setDescription(p.description || "");
    setCoverImageUrl(p.coverImageUrl || "");
    setImageMode(p.coverImageUrl?.startsWith("data:") ? "file" : "url");
    setLocation(p.location || "");
    setYear(p.year || "");
    setClient(p.client || "");
    setSheetOpen(true);
  }

  async function handleSubmit() {
    const payload = {
      title,
      category,
      description,
      coverImageUrl,
      location,
      year,
      client,
      images: [] as { url: string; publicId: string }[],
    };
    try {
      if (editingId) {
        await onUpdate(editingId, payload);
        toast({ title: "Project updated successfully" });
      } else {
        await onCreate(payload);
        toast({ title: "Project created successfully" });
      }
      setSheetOpen(false);
      resetForm();
    } catch (e) {
      toast({
        title: editingId ? "Update failed" : "Create failed",
        description: String(e),
        variant: "destructive",
      });
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await onDelete(deleteId);
      toast({ title: "Project deleted" });
    } catch (e) {
      toast({
        title: "Delete failed",
        description: String(e),
        variant: "destructive",
      });
    }
    setDeleteId(null);
  }

  const filtered = projects.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.client || "").toLowerCase().includes(q)
    );
  });

  const categoryColors: Record<string, string> = {
    commercial: "bg-blue-500/15 text-blue-400",
    residential: "bg-emerald-500/15 text-emerald-400",
    industrial: "bg-amber-500/15 text-amber-400",
    infrastructure: "bg-purple-500/15 text-purple-400",
  };

  return (
    <div className="admin-panel-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Showcase your construction portfolio
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              🔍
            </span>
            <Input
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background/50 pl-9"
            />
          </div>
          <Button className="btn-primary shrink-0" onClick={openCreate}>
            + Add Project
          </Button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/50 px-6 py-16 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 text-5xl opacity-40">🏗️</div>
          <p className="text-lg font-medium text-muted-foreground">
            {search ? "No projects match your search" : "No projects yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search
              ? "Try a different keyword"
              : "Start building your portfolio by adding your first project."}
          </p>
          {!search && (
            <Button className="btn-primary mt-4" onClick={openCreate}>
              + Add Your First Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="group overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              {/* Thumbnail */}
              <div className="relative h-40 overflow-hidden bg-background/50">
                {p.coverImageUrl ? (
                  <img
                    src={p.coverImageUrl}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl opacity-20">
                    🏢
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
                      categoryColors[p.category.toLowerCase()] ||
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.category}
                  </span>
                </div>
              </div>
              {/* Body */}
              <div className="p-4">
                <h3 className="font-semibold leading-tight">{p.title}</h3>
                {p.description && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {p.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {p.location && <span>📍 {p.location}</span>}
                  {p.year && <span>📅 {p.year}</span>}
                  {p.client && <span>👤 {p.client}</span>}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setDeleteId(p._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sheet Form */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto border-border bg-card sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {editingId ? "Edit Project" : "New Project"}
            </SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the project details below."
                : "Fill in the details to add a new project to your portfolio."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Office Complex"
                className="bg-background/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                  <option value="industrial">Industrial</option>
                  <option value="infrastructure">Infrastructure</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                  className="bg-background/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Manila, PH"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Client</label>
                <Input
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Client name"
                  className="bg-background/50"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Cover Image</label>
              {/* Mode Toggle */}
              <div className="flex rounded-lg border border-border bg-background/30 p-1">
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    imageMode === "url"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🔗 Paste URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode("file")}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    imageMode === "file"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  📁 From Device
                </button>
              </div>

              {/* URL Mode */}
              {imageMode === "url" && (
                <Input
                  value={coverImageUrl.startsWith("data:") ? "" : coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-background/50"
                />
              )}

              {/* File Upload Mode */}
              {imageMode === "file" && (
                <div
                  onClick={() => document.getElementById("project-image-upload")?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (!file || !file.type.startsWith("image/")) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      setCoverImageUrl(reader.result as string);
                      toast({ title: "Image loaded", description: file.name });
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background/30 px-4 py-8 transition-colors duration-200 hover:border-primary/50 hover:bg-background/50"
                >
                  <span className="text-3xl opacity-50">📷</span>
                  <p className="text-sm font-medium text-muted-foreground">
                    Click to browse or drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              )}
              <input
                type="file"
                id="project-image-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setCoverImageUrl(reader.result as string);
                    toast({ title: "Image loaded", description: file.name });
                  };
                  reader.readAsDataURL(file);
                  e.target.value = "";
                }}
              />

              {/* Image Preview */}
              {coverImageUrl && (
                <div className="relative mt-1 overflow-hidden rounded-xl border border-border">
                  <img
                    src={coverImageUrl}
                    alt="Preview"
                    className="h-36 w-full object-cover"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.display = "none")
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl("")}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs text-white backdrop-blur-sm transition-colors hover:bg-red-500"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project…"
                className="bg-background/50"
                rows={4}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                className="btn-primary flex-1"
                onClick={handleSubmit}
                disabled={!title || !category}
              >
                {editingId ? "Save Changes" : "Create Project"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSheetOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The project will be permanently
              removed from your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
