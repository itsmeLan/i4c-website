import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

function installGa4IfConfigured() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
  if (!id) return;
  if (document.querySelector(`script[data-ga4="${id}"]`)) return;

  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  s1.dataset.ga4 = id;
  document.head.appendChild(s1);

  const s2 = document.createElement("script");
  s2.dataset.ga4 = id;
  s2.text = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${id}', { send_page_view: true });
  `;
  document.head.appendChild(s2);
}

installGa4IfConfigured();

createRoot(document.getElementById("root")!).render(<App />);
