import { useState, useRef } from "react";
import { GlassCard } from "./GlassCard";

interface ImageUploadSmallProps {
  onTextExtracted: (text: string) => void;
  label: string;
  placeholder: string;
}

export function ImageUploadSmall({ onTextExtracted, label, placeholder }: ImageUploadSmallProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona una imagen válida");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const Tesseract = (await import("tesseract.js")).default;

      const result = await Tesseract.recognize(file, "eng", {
        logger: (m: any) => {
          console.log("OCR progress:", m);
        },
      });

      let extractedText = result.data.text;

      // Clean up the text: normalize arrows and separators
      extractedText = extractedText
        .replace(/→/g, "->")
        .replace(/\s*->\s*/g, "->")
        .replace(/\s*\|\s*/g, "|")
        .replace(/\s+/g, " ")
        .trim();

      if (extractedText.length === 0) {
        setError("No se pudo extraer texto de la imagen. Intenta con una imagen más clara.");
        return;
      }

      onTextExtracted(extractedText);
      setError("");

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("OCR error:", err);
      setError("Error al procesar la imagen. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-2">
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
        {label}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="text-xs rounded-full bg-sky-400/10 px-2 py-1 text-sky-600 hover:bg-sky-400/20 disabled:opacity-50 transition dark:text-sky-300"
          title={`Subir imagen para ${label.toLowerCase()}`}
        >
          <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Foto
        </button>
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-3 text-center cursor-pointer
          transition-all duration-200 text-xs
          ${
            isLoading
              ? "border-blue-400 bg-blue-500/5"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-500/5"
          }
        `}
      >
        {isLoading ? (
          <div className="inline-block">
            <svg
              className="w-4 h-4 text-blue-400 animate-spin mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Arrastra imagen o haz clic
          </p>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
