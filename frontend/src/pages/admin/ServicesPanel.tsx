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

type Service = {
  _id: string;
  title: string;
  description?: string;
  features?: string[];
  icon?: string;
  order?: number;
};

export default function ServicesPanel({
  services,
  onCreate,
  onUpdate,
  onDelete,
}: {
  services: Service[];
  onCreate: (s: Omit<Service, "_id">) => Promise<void>;
  onUpdate: (id: string, s: Omit<Service, "_id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [order, setOrder] = useState(0);

  function resetForm() {
    setTitle("");
    setDescription("");
    setFeatures("");
    setOrder(0);
    setEditingId(null);
  }

  function openCreate() {
    resetForm();
    setSheetOpen(true);
  }

  function openEdit(s: Service) {
    setEditingId(s._id);
    setTitle(s.title);
    setDescription(s.description || "");
    setFeatures((s.features || []).join("\n"));
    setOrder(s.order || 0);
    setSheetOpen(true);
  }

  async function handleSubmit() {
    const payload = {
      title,
      description,
      features: features
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      order,
    };
    try {
      if (editingId) {
        await onUpdate(editingId, payload);
        toast({ title: "Service updated" });
      } else {
        await onCreate(payload);
        toast({ title: "Service created" });
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
      toast({ title: "Service deleted" });
    } catch (e) {
      toast({
        title: "Delete failed",
        description: String(e),
        variant: "destructive",
      });
    }
    setDeleteId(null);
  }

  return (
    <div className="admin-panel-enter space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="mt-1 text-muted-foreground">
            Manage the services your company offers
          </p>
        </div>
        <Button className="btn-primary shrink-0" onClick={openCreate}>
          + Add Service
        </Button>
      </div>

      {/* Grid */}
      {services.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card/50 px-6 py-16 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 text-5xl opacity-40">⚙️</div>
          <p className="text-lg font-medium text-muted-foreground">
            No services yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Define the services your construction company provides.
          </p>
          <Button className="btn-primary mt-4" onClick={openCreate}>
            + Add Your First Service
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((s, idx) => (
            <div
              key={s._id}
              className="group overflow-hidden rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                    {s.order ?? idx + 1}
                  </div>
                  <h3 className="font-semibold leading-tight">{s.title}</h3>
                </div>
              </div>

              {s.description && (
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {s.description}
                </p>
              )}

              {/* Feature pills */}
              {s.features && s.features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.features.slice(0, 5).map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary/80"
                      style={{
                        background: "hsl(var(--primary) / 0.1)",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                  {s.features.length > 5 && (
                    <span className="text-xs text-muted-foreground">
                      +{s.features.length - 5} more
                    </span>
                  )}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openEdit(s)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setDeleteId(s._id)}
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
              {editingId ? "Edit Service" : "New Service"}
            </SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the service details below."
                : "Add a new service offering."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. General Construction"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Order</label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this service…"
                className="bg-background/50"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Features{" "}
                <span className="text-muted-foreground font-normal">
                  (one per line)
                </span>
              </label>
              <Textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder={"Foundation work\nFraming\nFinishing"}
                className="bg-background/50"
                rows={6}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                className="btn-primary flex-1"
                onClick={handleSubmit}
                disabled={!title}
              >
                {editingId ? "Save Changes" : "Create Service"}
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
            <AlertDialogTitle>Delete service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The service will be permanently
              removed.
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
