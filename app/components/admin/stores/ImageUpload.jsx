"use client";
import { useRef } from "react";
import { Plus, X } from "lucide-react";

export default function ImageUpload({ image, setImage, disabled }) {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImage("");
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
        Store Image
      </label>

      <div className="flex items-center gap-4">
        {/* Preview */}
        {image ? (
          <div className="relative w-24 h-24 border border-gray-100 rounded-xl overflow-hidden">
            <img src={image} alt="Store" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
              aria-label="Remove Image"
              disabled={disabled}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          // Upload Button
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400"
            disabled={disabled}
          >
            <Plus size={20} />
          </button>
        )}

        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={disabled} />
      </div>
    </div>
  );
}
