import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

const filters = [
  { name: "original", label: "original", css: "none" },
  { name: "warm", label: "warm vibes", css: "sepia(0.3) saturate(1.4) brightness(1.05)" },
  { name: "golden", label: "golden hour", css: "sepia(0.5) saturate(1.2) brightness(1.1) contrast(1.1)" },
  { name: "dreamy", label: "dreamy", css: "brightness(1.1) contrast(0.9) saturate(0.8) blur(0.5px)" },
  { name: "vintage", label: "vintage", css: "sepia(0.6) contrast(1.1) brightness(0.95)" },
  { name: "cool", label: "cool capy", css: "hue-rotate(20deg) saturate(1.3) brightness(1.05)" },
];

export default function PhotoFilterSection() {
  const [image, setImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("original");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setActiveFilter("original");
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = useCallback(() => {
    if (!imgRef.current || !image) return;
    const canvas = document.createElement("canvas");
    const img = imgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const filterObj = filters.find((f) => f.name === activeFilter);
    ctx.filter = filterObj?.css || "none";
    ctx.drawImage(img, 0, 0);
    const link = document.createElement("a");
    link.download = `capyfied-${activeFilter}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [image, activeFilter]);

  return (
    <section id="photo-filter" className="py-20 bg-gradient-to-b from-[oklch(0.94_0.03_145/0.3)] to-white">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">capy-fy your photos</h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            upload any photo and give it capybara energy with these warm cozy filters.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {!image ? (
            <div
              className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-bold text-foreground/70 mb-1">drop a photo here</p>
              <p className="text-sm text-muted-foreground">or click to upload</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </div>
          ) : (
            <div className="space-y-5">
              {/* Preview */}
              <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
                <img
                  ref={imgRef}
                  src={image}
                  alt="your photo"
                  className="w-full max-h-[400px] object-contain"
                  style={{ filter: filters.find((f) => f.name === activeFilter)?.css || "none" }}
                  crossOrigin="anonymous"
                />
              </div>

              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                {filters.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setActiveFilter(f.name)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      activeFilter === f.name
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-white border border-border text-foreground/70 hover:bg-accent"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <Button onClick={downloadImage} className="rounded-full gap-2">
                  <Download className="h-4 w-4" />
                  download
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setImage(null);
                    setActiveFilter("original");
                  }}
                >
                  upload new photo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
