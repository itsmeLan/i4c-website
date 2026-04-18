import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

/** Fallbacks for Cebu City */
const DEFAULT_LAT = 10.32895;
const DEFAULT_LNG = 123.90235;

const markerIcon = L.icon({
  iconUrl: "/favicon.ico",
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -44],
  className: "rounded-full bg-white p-1 shadow-md", // optional tailwind classes to make it look clean
});

function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  map.setView(position);
  return null;
}

export default function OfficeMap() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiFetch<{ok: true, data: any}>("/api/settings").then(res => res.data),
  });

  const lat = parseFloat(settings?.mapLatitude) || DEFAULT_LAT;
  const lng = parseFloat(settings?.mapLongitude) || DEFAULT_LNG;
  const position: [number, number] = [lat, lng];

  return (
    <MapContainer
      center={position}
      zoom={17}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
      className="z-0 [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-attribution]:bg-background/80"
    >
      <MapUpdater position={position} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={markerIcon}>
        <Popup>
          <span className="font-semibold">i4C Construction</span>
          <br />
          {settings?.addressLine1 || "Edison St. corner Pasteur St., Lahug"}
          <br />
          {settings?.addressLine2 || "Cebu City, 6000, Philippines"}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
