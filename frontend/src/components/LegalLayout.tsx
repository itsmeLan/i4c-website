import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export default function LegalLayout({ title, children }: { title: string, children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container-custom section-padding">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold leading-none hover:opacity-80 transition-opacity">
              <span className="gradient-text">i4C</span> Construction
              <span className="text-primary">.</span>
            </Link>
            
            <Link 
              to="/" 
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <MoveLeft className="w-4 h-4 mr-2" />
              Return to Website
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container-custom pt-32 pb-20 max-w-4xl w-full mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 animate-fade-in">{title}</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground animate-slide-up bg-card/30 p-8 md:p-12 rounded-2xl border border-border/50 shadow-sm">
          {children}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 text-center border-t border-border mt-auto">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} i4C Construction. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
