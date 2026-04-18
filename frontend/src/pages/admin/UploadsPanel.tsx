import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

export default function UploadsPanel() {
  const { toast } = useToast();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    url: string;
    publicId: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFileSelect(file: File | null) {
    setUploadFile(file);
    setUploadResult(null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
    }
  }, []);

  async function uploadImage() {
    if (!uploadFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", uploadFile);
      const res = await apiFetch<{
        ok: true;
        url: string;
        publicId: string;
      }>("/api/upload/image", {
        method: "POST",
        auth: true,
        body: fd,
        headers: {},
      });
      setUploadResult({ url: res.url, publicId: res.publicId });
      toast({ title: "Uploaded!", description: "Image uploaded to Cloudinary." });
    } catch (e) {
      toast({
        title: "Upload failed",
        description: String(e),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-panel-enter space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Media Uploads</h1>
        <p className="mt-1 text-muted-foreground">
          Upload images to Cloudinary for use in projects and content
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-card/30 hover:border-primary/40 hover:bg-card/50"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {preview ? (
          /* Preview */
          <div className="flex flex-col items-center gap-4 p-8">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 rounded-xl object-contain"
              />
              <button
                onClick={() => {
                  handleFileSelect(null);
                }}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                ✕
              </button>
            </div>
            <div className="text-center">
              <p className="font-medium">{uploadFile?.name}</p>
              <p className="text-sm text-muted-foreground">
                {uploadFile
                  ? `${(uploadFile.size / 1024).toFixed(1)} KB`
                  : ""}
              </p>
            </div>
            <Button
              className="btn-primary"
              onClick={uploadImage}
              disabled={uploading}
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Uploading…
                </span>
              ) : (
                "Upload to Cloudinary"
              )}
            </Button>
          </div>
        ) : (
          /* Empty state */
          <label className="flex cursor-pointer flex-col items-center gap-4 px-8 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl transition-transform duration-200 hover:scale-110">
              📷
            </div>
            <div className="text-center">
              <p className="font-medium">
                {isDragging ? "Drop your image here" : "Drag & drop an image here"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse • PNG, JPG, WebP up to 10MB
              </p>
            </div>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleFileSelect(e.target.files?.[0] || null)
              }
            />
          </label>
        )}
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div className="overflow-hidden rounded-2xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 border-b border-primary/20 px-6 py-3">
            <span className="text-lg">✅</span>
            <span className="font-medium text-primary">Upload Successful</span>
          </div>
          <div className="space-y-3 p-6">
            <div className="overflow-hidden rounded-xl">
              <img
                src={uploadResult.url}
                alt="Uploaded"
                className="max-h-48 w-full object-contain"
              />
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Public ID
                </span>
                <p className="mt-0.5 rounded-md bg-background/50 px-3 py-1.5 font-mono text-sm">
                  {uploadResult.publicId}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  URL
                </span>
                <p className="mt-0.5 rounded-md bg-background/50 px-3 py-1.5 text-sm">
                  <a
                    href={uploadResult.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    {uploadResult.url}
                  </a>
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(uploadResult.url);
                toast({ title: "URL copied to clipboard" });
              }}
            >
              📋 Copy URL
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
