import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { SectionTitle } from "./SectionTitle";

interface ImageUploadSectionProps {
  onGrammarExtracted: (grammar: string) => void;
}

export function ImageUploadSection({ onGrammarExtracted }: ImageUploadSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona una imagen válida");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Dynamic import to avoid SSR issues
      const Tesseract = (await import("tesseract.js")).default;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Perform OCR
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m: any) => {
          console.log("OCR progress:", m);
        },
      });

      let extractedText = result.data.text;

      // Clean up the text: normalize arrows and separators
      extractedText = extractedText
        .replace(/→/g, "->")
        .replace(/\s*->\s*/g, " -> ")
        .replace(/\s*\|\s*/g, " | ")
        .replace(/\s+/g, " ")
        .trim();

      if (extractedText.length === 0) {
        setError("No se pudo extraer texto de la imagen. Intenta con una imagen más clara.");
        return;
      }

      onGrammarExtracted(extractedText);
      setError("");
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setPreview(null);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <GlassCard>
        <SectionTitle
          eyebrow="Reconocimiento Óptico"
          title="Carga una imagen de tu gramática"
          description="Sube una foto o captura de una gramática escrita en papel o en otro formato y nuestro sistema la digitalizará automáticamente"
        />

        <div className="mt-8">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-200
              ${
                isLoading
                  ? "border-blue-400 bg-blue-500/5"
                  : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-500/5"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {isLoading ? (
              <div className="space-y-2">
                <div className="inline-block">
                  <div className="animate-spin">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Procesando imagen...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Arrastra una imagen de gramática aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF hasta 10MB</p>
              </div>
            )}
          </div>

          {preview && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vista previa:
              </p>
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded-lg mx-auto border border-gray-200 dark:border-gray-700"
              />
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
