import { X, MapPin, Calendar, User, ArrowRight, ExternalLink } from "lucide-react";

type ProjectItem = {
  id: string | number;
  title: string;
  category: string;
  location: string;
  year: string;
  client: string;
  description: string;
  image: string;
  status: string;
  videoUrl?: string;
};

type Props = {
  project: ProjectItem | null;
  open: boolean;
  onClose: () => void;
};

export default function ProjectDetailDialog({ project, open, onClose }: Props) {
  if (!open || !project) return null;

  const statusColor =
    project.status === "Completed"
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-primary/20 text-primary border-primary/30";

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
    }
    if (url.includes("vimeo.com")) {
      const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
      const match = url.match(regExp);
      return match ? `https://player.vimeo.com/video/${match[3]}` : null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(project.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95 fade-in duration-300 custom-scrollbar">
        {/* Cover Image */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-background">
              <span className="text-6xl opacity-30">🏗️</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

          {/* Status badge */}
          <div className="absolute right-4 top-4">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${statusColor}`}
            >
              {project.status}
            </span>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
            <span className="mb-2 inline-block rounded-full bg-primary/20 px-3 py-0.5 text-xs font-semibold capitalize text-primary backdrop-blur-sm">
              {project.category}
            </span>
            <h2 className="text-2xl font-bold text-white sm:text-3xl drop-shadow-lg">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4">
          {/* Meta grid */}
          <div className="grid grid-cols-3 gap-3">
            {project.location && (
              <div className="flex flex-col items-center gap-1.5 rounded-xl bg-background/50 px-3 py-3 text-center">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground leading-tight">
                  {project.location}
                </span>
              </div>
            )}
            {project.year && (
              <div className="flex flex-col items-center gap-1.5 rounded-xl bg-background/50 px-3 py-3 text-center">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground leading-tight">
                  {project.year}
                </span>
              </div>
            )}
            {project.client && (
              <div className="flex flex-col items-center gap-1.5 rounded-xl bg-background/50 px-3 py-3 text-center">
                <User className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground leading-tight">
                  {project.client}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {project.description && (
            <div className="mt-5">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                About This Project
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </div>
          )}

          {/* Video Player */}
          {embedUrl && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                Promotional Video
              </h3>
              <div className="aspect-video overflow-hidden rounded-xl border border-border bg-black">
                <iframe
                  src={embedUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-6 flex gap-3">
            <button
              className="btn-primary flex flex-1 items-center justify-center gap-2"
              onClick={() => {
                onClose();
                setTimeout(() => {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              }}
            >
              Discuss a Similar Project
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-border bg-background/50 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
