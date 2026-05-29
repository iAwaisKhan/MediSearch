import { useState, useRef } from "react";
import { medicineAPI } from "../../services/api";
import toast from "react-hot-toast";
import PrescriptionSummary, { PrescriptionData } from "./PrescriptionSummary";

interface ImageUploadProps {
  onMedicineDetected: (name: string) => void;
}

export default function ImageUpload({ onMedicineDetected }: ImageUploadProps) {
  const [preview, setPreview]     = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [medicines, setMedicines] = useState<string[]>([]);
  const [prescription, setPrescription] = useState<PrescriptionData | null>(null);
  const [error, setError]         = useState<string | null>(null);
  
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate client-side
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Maximum size is 5 MB.");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Send to OCR
    setLoading(true);
    setError(null);
    setMedicines([]);
    setPrescription(null);

    try {
      const res = await medicineAPI.ocr(file);
      const data = res.data?.data;
      
      if (!data) {
        throw new Error("No data returned from AI.");
      }

      if (data.type === "prescription") {
        setPrescription(data as PrescriptionData);
        toast.success(`Scanned prescription with ${data.medicines?.length || 0} medicine(s)!`);
      } else {
        // It's a medicine box
        const detected = data.medicines?.map((m: any) => typeof m === 'string' ? m : m.name) || [];
        if (detected.length === 0) {
          setError(data.message || "No medicine names detected in this image. Try a clearer photo.");
        } else {
          setMedicines(detected);
          toast.success(`Found ${detected.length} medicine(s)!`);
        }
      }
    } catch (err: any) {
      const msg = err.message || "OCR failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be selected again
    e.target.value = "";
  };

  const handleReset = () => {
    setPreview(null);
    setMedicines([]);
    setPrescription(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 animate-fade-up">
      {/* Upload buttons */}
      {!preview && (
        <div className="border-2 border-dashed border-brand-200 rounded-2xl p-8 flex flex-col items-center gap-4 bg-brand-50/30 hover:bg-brand-50/60 transition">
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center text-3xl">
            📷
          </div>
          <p className="text-sm text-slate-500 text-center">
            Take a photo or upload an image of medicine packaging, prescription, or label
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="px-5 py-2.5 bg-brand-500 text-white rounded-full text-sm font-medium hover:bg-brand-600 transition flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              Camera
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-white text-brand-500 border border-brand-200 rounded-full text-sm font-medium hover:bg-brand-50 transition flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Photo
            </button>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleInputChange}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}

      {/* Preview + Results */}
      {preview && !prescription && (
        <div className="card overflow-hidden shadow-md">
          {/* Image preview */}
          <div className="relative bg-slate-900 flex items-center justify-center p-4 max-h-64 overflow-hidden">
            <img
              src={preview}
              alt="Uploaded medicine"
              className="max-h-56 rounded-lg object-contain"
            />
            {/* Animated Laser Scanner */}
            {loading && (
              <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                <div className="w-full h-1 bg-brand-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
              </div>
            )}
            <button
              type="button"
              onClick={handleReset}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition"
              aria-label="Remove image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="p-6 flex flex-col items-center gap-3">
              <span className="w-8 h-8 border-3 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-400 animate-pulse">
                Analyzing image (Pill Box or Prescription)...
              </p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="p-5 bg-red-50 border-t border-red-100">
              <div className="flex items-center gap-2 text-red-600">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="mt-3 text-sm text-red-500 hover:text-red-700 font-medium underline"
              >
                Try another image
              </button>
            </div>
          )}

          {/* Detected medicine box */}
          {medicines.length > 0 && !loading && (
            <div className="p-5 bg-brand-50 border-t border-brand-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">
                💊 Detected Medicines — tap to search
              </p>
              <div className="flex flex-wrap gap-2">
                {medicines.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onMedicineDetected(name)}
                    className="px-4 py-2 bg-white text-brand-500 border border-brand-200 rounded-full text-sm font-medium hover:bg-brand-500 hover:text-white transition shadow-sm"
                  >
                    {name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 text-xs text-slate-400 hover:text-slate-600 underline"
              >
                Upload a different image
              </button>
            </div>
          )}
        </div>
      )}

      {/* Prescription Summary Component */}
      {prescription && !loading && (
        <PrescriptionSummary 
          data={prescription} 
          onSelectMedicine={onMedicineDetected} 
          onReset={handleReset} 
        />
      )}
    </div>
  );
}
