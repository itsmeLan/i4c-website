import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

type Testimonial = {
  _id: string;
  name: string;
  position?: string;
  company?: string;
  rating?: number;
  content: string;
  project?: string;
  imageUrl?: string;
  order?: number;
  isPublished?: boolean;
};

/* ── Star Rating Display ── */
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${i < count ? "text-amber-400" : "text-muted-foreground/30"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ── Interactive Star Picker ── */
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className={`text-xl transition-colors ${
            i < value
              ? "text-amber-400 hover:text-amber-300"
              : "text-muted-foreground/30 hover:text-amber-400/50"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsPanel({
  testimonials,
  onCreate,
  onUpdate,
  onDelete,
}: {
  testimonials: Testimonial[];
  onCreate: (t: Omit<Testimonial, "_id">) => Promise<void>;
  onUpdate: (id: string, t: Omit<Testimonial, "_id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [company, setCompany] = useState("");
  const [project, setProject] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  function resetForm() {
    setName("");
    setContent("");
    setRating(5);
    setCompany("");
    setProject("");
    setImageUrl("");
    setIsPublished(true);
    setImageMode("url");
    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setSheetOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditingId(t._id);
    setName(t.name);
    setContent(t.content);
    setRating(t.rating || 5);
    setCompany(t.company || "");
    setProject(t.project || "");
    setImageUrl(t.imageUrl || "");
    setImageMode(t.imageUrl?.startsWith("data:") ? "file" : "url");
    setIsPublished(t.isPublished ?? true);
    setSheetOpen(true);
  }

  async function handleSubmit() {
    const payload = { name, content, rating, company, project, imageUrl, isPublished, order: 0 };
    try {
      if (editingId) {
        await onUpdate(editingId, payload);
        toast({ title: "Testimonial updated" });
      } else {
        await onCreate(payload);
        toast({ title: "Testimonial created" });
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
      toast({ title: "Testimonial deleted" });
    } catch (e) {
      toast({
        title: "Delete failed",
        description: String(e),
        variant: "destructive",
      });
    }
    setDeleteId(null);
  }

  async function togglePublish(t: Testimonial) {
    try {
      await onUpdate(t._id, {
        name: t.name,
        content: t.content,
        rating: t.rating,
        company: t.company,
        project: t.project,
        imageUrl: t.imageUrl,
        isPublished: !t.isPublished,
        order: t.order,
      });
      toast({
        title: t.isPublished ? "Testimonial unpublished" : "Testimonial published",
      });
    } catch (e) {
      toast({
        title: "Toggle failed",
        description: String(e),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="admin-panel-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="mt-1 text-muted-foreground">
            Client reviews and feedback
          </p>
        </div>
        <Button className="btn-primary shrink-0" onClick={openCreate}>
          + Add Testimonial
        </Button>
      </div>

      {/* Grid */}
      {testimonials.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/50 px-6 py-16 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 text-5xl opacity-40">⭐</div>
          <p className="text-lg font-medium text-muted-foreground">
            No testimonials yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Showcase client satisfaction by adding testimonials.
          </p>
          <Button className="btn-primary mt-4" onClick={openCreate}>
            + Add Your First Testimonial
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className={`group overflow-hidden rounded-2xl border bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${
                t.isPublished === false
                  ? "border-border/50 opacity-60"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-sm font-bold text-amber-400">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold leading-tight">{t.name}</p>
                    {t.company && (
                      <p className="text-xs text-muted-foreground">
                        {t.company}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={t.isPublished !== false}
                    onCheckedChange={() => togglePublish(t)}
                  />
                </div>
              </div>

              <div className="mt-3">
                <Stars count={t.rating || 5} />
              </div>

              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                "{t.content}"
              </p>

              {t.project && (
                <p className="mt-2 text-xs text-primary">
                  Project: {t.project}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openEdit(t)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setDeleteId(t._id)}
                >
                  Delete
                </Button>
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
              {editingId ? "Edit Testimonial" : "New Testimonial"}
            </SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the testimonial details."
                : "Add a new client testimonial."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Client Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan dela Cruz"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="ACME Corp"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Input
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Office Renovation 2024"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Client Image</label>
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

              {imageMode === "url" && (
                <Input
                  value={imageUrl.startsWith("data:") ? "" : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/client.jpg"
                  className="bg-background/50"
                />
              )}

              {imageMode === "file" && (
                <div
                  onClick={() => document.getElementById("testimonial-image-upload")?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (!file || !file.type.startsWith("image/")) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      setImageUrl(reader.result as string);
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
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              )}
              <input
                type="file"
                id="testimonial-image-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    setImageUrl(reader.result as string);
                    toast({ title: "Image loaded", description: file.name });
                  };
                  reader.readAsDataURL(file);
                  e.target.value = "";
                }}
              />

              {imageUrl && (
                <div className="relative mt-2 inline-block">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-24 w-24 rounded-full object-cover border-2 border-primary/20"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-colors hover:bg-destructive/90"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Testimonial Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did the client say about your work?"
                className="bg-background/50"
                rows={5}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <label className="text-sm font-medium">
                {isPublished ? "Published" : "Draft"}
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                className="btn-primary flex-1"
                onClick={handleSubmit}
                disabled={!name || content.length < 10}
              >
                {editingId ? "Save Changes" : "Create Testimonial"}
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
            <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
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
