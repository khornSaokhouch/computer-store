"use client";
import { UploadCloud, Trash2 } from "lucide-react";
import Image from "next/image";

export default function ImageUpload({ imagePreviews, setImagePreviews, setImagesBase64, existingImages, setExistingImages }) {
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesBase64((prev) => [...prev, reader.result]);
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const isExisting = index < existingImages.length;
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingImages.length;
      setImagesBase64((prev) => prev.filter((_, i) => i !== newIndex));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
        Product Media
      </label>
      <div className="border-2 border-dashed border-gray-100 rounded-10 p-6 flex flex-col items-center justify-center bg-gray-50/50 group hover:bg-white hover:border-indigo-200 transition-all cursor-pointer relative min-h-[220px]">
        <UploadCloud size={32} className="text-gray-300 group-hover:text-indigo-600 mb-2 transition-colors" />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
          Click to upload
        </span>
        <input
          type="file"
          multiple
          onChange={handleImagesChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {imagePreviews.map((img, idx) => (
            <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-white shadow-md group/img">
              <Image
                src={img}
                alt={`preview-${idx}`}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
              />
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); removeImage(idx); }}
                className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
