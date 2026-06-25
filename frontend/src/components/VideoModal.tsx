import { X } from "lucide-react";

type Props = {
  url: string | null;
  onClose: () => void;
};

export default function VideoModal({ url, onClose }: Props) {
  if (!url) return null;

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
    }
    if (url.includes("vimeo.com")) {
      const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
      const match = url.match(regExp);
      return match ? `https://player.vimeo.com/video/${match[3]}?autoplay=1` : null;
    }
    return null;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-4xl aspect-video overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-white">
            <p className="text-lg opacity-60">Unable to load video</p>
            <a href={url} target="_blank" rel="noopener" className="text-primary underline">Open link directly</a>
          </div>
        )}
      </div>
    </div>
  );
}
