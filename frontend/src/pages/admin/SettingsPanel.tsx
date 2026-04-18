import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

type SettingsData = {
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  mapLatitude?: string;
  mapLongitude?: string;
};

export default function SettingsPanel() {
  const { toast } = useToast();
  const [data, setData] = useState<SettingsData>({
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    mapLatitude: "",
    mapLongitude: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch<{ ok: true; data: SettingsData }>("/api/settings")
      .then((res) => {
        if (res.data) setData(res.data);
      })
      .catch((err) => {
        toast({ title: "Failed to load settings", description: String(err), variant: "destructive" });
      });
  }, [toast]);

  async function handleSave() {
    setSaving(true);
    try {
      await apiFetch("/api/settings", {
        method: "PUT",
        auth: true,
        body: JSON.stringify(data),
      });
      toast({ title: "Settings saved successfully" });
    } catch (err) {
      toast({ title: "Failed to save settings", description: String(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-panel-enter space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Update the global contact information shown on the website.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Contact Details</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Global Email Address</label>
            <Input
              value={data.email || ""}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="e.g. info@i4cconstruction.ph"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Phone Number</label>
            <Input
              value={data.phone || ""}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              placeholder="e.g. +63 (2) 8123-4567"
              className="bg-background/50"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border/50">
          <h3 className="text-xl font-semibold">Physical Address</h3>
          <p className="text-xs text-muted-foreground">This address is displayed in the Footer and Contact map section.</p>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Address Line 1</label>
            <Input
              value={data.addressLine1 || ""}
              onChange={(e) => setData({ ...data, addressLine1: e.target.value })}
              placeholder="e.g. Edison St. corner Pasteur St.,"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address Line 2 (City)</label>
            <Input
              value={data.addressLine2 || ""}
              onChange={(e) => setData({ ...data, addressLine2: e.target.value })}
              placeholder="e.g. Lahug, Cebu City,"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address Line 3 (Region/Zip)</label>
            <Input
              value={data.addressLine3 || ""}
              onChange={(e) => setData({ ...data, addressLine3: e.target.value })}
              placeholder="e.g. Cebu 6000, Philippines"
              className="bg-background/50"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border/50">
          <h3 className="text-xl font-semibold">Map Coordinates</h3>
          <p className="text-xs text-muted-foreground">Adjust the GPS coordinates for the map pin on the Contact page.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Latitude</label>
              <Input
                value={data.mapLatitude || ""}
                onChange={(e) => setData({ ...data, mapLatitude: e.target.value })}
                placeholder="e.g. 10.32895"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Longitude</label>
              <Input
                value={data.mapLongitude || ""}
                onChange={(e) => setData({ ...data, mapLongitude: e.target.value })}
                placeholder="e.g. 123.90235"
                className="bg-background/50"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button className="btn-primary px-8" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
