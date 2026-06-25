import { useEffect } from "react";

/**
 * Sequential Navigation Hook
 * Navigates through a sequence of "stops" (sections and items) using arrow keys.
 */
export const useKeyboardNavigation = () => {
  useEffect(() => {
    // Helper to find all navigation stops in order
    const getStops = () => {
      const stops: HTMLElement[] = [];
      
      const addStop = (id: string) => {
        const el = document.getElementById(id);
        if (el) stops.push(el);
      };

      const addItems = (sectionId: string, itemPrefix: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const items = Array.from(section.querySelectorAll(`[id^="${itemPrefix}"]`)) as HTMLElement[];
          if (items.length > 0) {
            stops.push(...items);
          } else {
            stops.push(section);
          }
        }
      };

      addStop("home");
      addStop("about");
      addItems("services", "service-card-");
      addStop("estimator");
      addItems("projects", "project-card-");
      addStop("testimonials");
      addStop("contact");

      return stops;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in inputs
      const activeElement = document.activeElement;
      const isInput = 
        activeElement instanceof HTMLInputElement || 
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        activeElement?.hasAttribute('contenteditable');
      
      if (isInput) return;

      const isNextKey = e.key === "ArrowDown" || e.key === "ArrowRight";
      const isPrevKey = e.key === "ArrowUp" || e.key === "ArrowLeft";

      if (isNextKey || isPrevKey) {
        const stops = getStops();
        if (stops.length === 0) return;

        // Prevent default scrolling
        e.preventDefault();

        const currentScroll = window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // Find current stop
        let currentIndex = -1;
        const currentHighlighted = document.querySelector(".nav-highlight") as HTMLElement;
        
        if (currentHighlighted) {
          currentIndex = stops.indexOf(currentHighlighted);
        } else {
          // If no highlight, find stop closest to current scroll
          stops.forEach((stop, index) => {
            if (stop.offsetTop <= currentScroll + viewportHeight / 3) {
              currentIndex = index;
            }
          });
        }

        let targetIndex = currentIndex;
        if (isNextKey) {
          targetIndex = Math.min(currentIndex + 1, stops.length - 1);
          if (currentIndex === -1) targetIndex = 0;
        } else if (isPrevKey) {
          targetIndex = Math.max(currentIndex - 1, 0);
        }

        // Update highlights
        stops.forEach(s => s.classList.remove("nav-highlight"));
        const targetStop = stops[targetIndex];
        
        if (targetStop) {
          // Only highlight "cards", sections just get scrolled to
          if (targetStop.id.includes("card")) {
            targetStop.classList.add("nav-highlight");
          }
          
          // Scroll target into view
          // If it's a card, center it. If it's a section, align to top.
          const isCard = targetStop.id.includes("card");
          targetStop.scrollIntoView({ 
            behavior: "smooth", 
            block: isCard ? "center" : "start" 
          });
        }
      }

      // Handle Enter key for highlighted items
      if (e.key === "Enter") {
        const highlighted = document.querySelector(".nav-highlight") as HTMLElement;
        if (highlighted) {
          // Find any button or link inside and click it
          const actionBtn = highlighted.querySelector("button, a") as HTMLElement;
          if (actionBtn) actionBtn.click();
        }
      }

      // Escape to clear highlight
      if (e.key === "Escape") {
        document.querySelectorAll(".nav-highlight").forEach(el => el.classList.remove("nav-highlight"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
};
