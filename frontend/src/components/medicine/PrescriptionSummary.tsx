import React from "react";

export interface PrescriptionMedicine {
  name: string;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  instructions: string | null;
}

export interface PrescriptionData {
  type: "prescription" | "medicine_box";
  patient_name: string | null;
  date: string | null;
  doctor_notes: string | null;
  medicines: PrescriptionMedicine[];
  message?: string | null;
}

interface Props {
  data: PrescriptionData;
  onSelectMedicine: (name: string) => void;
  onReset: () => void;
}

export default function PrescriptionSummary({ data, onSelectMedicine, onReset }: Props) {
  return (
    <div className="bg-[#F6F6F2] rounded-3xl p-6 shadow-sm border border-slate-100 animate-fade-up w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-[#111]">Scanned Prescription</h2>
          {data.patient_name && <p className="text-sm text-slate-500 mt-1">Patient: {data.patient_name}</p>}
          {data.date && <p className="text-xs text-slate-400 mt-0.5">Date: {data.date}</p>}
        </div>
        <button onClick={onReset} className="text-xs font-medium text-slate-400 hover:text-slate-600 px-3 py-1.5 bg-white rounded-full shadow-sm">
          Scan Another
        </button>
      </div>

      {data.doctor_notes && (
        <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1">Doctor's Notes</p>
          <p className="text-sm text-slate-700 italic">"{data.doctor_notes}"</p>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7AA95C]">
          Prescribed Medicines ({data.medicines.length})
        </p>

        {data.medicines.map((med, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border border-slate-100/80 shadow-sm transition-all hover:border-brand-200">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#2C2C2C] leading-tight">{med.name}</h3>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                {med.dosage && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> {med.dosage}
                  </span>
                )}
                {med.frequency && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {med.frequency}
                  </span>
                )}
                {med.duration && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> {med.duration}
                  </span>
                )}
              </div>
              
              {med.instructions && (
                <p className="text-xs text-slate-600 mt-2 bg-slate-50 px-2.5 py-1.5 rounded-lg inline-block">
                  {med.instructions}
                </p>
              )}
            </div>
            
            <button
              onClick={() => onSelectMedicine(med.name)}
              className="w-full sm:w-auto px-5 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
            >
              Analyze
            </button>
          </div>
        ))}
        
        {data.medicines.length === 0 && (
          <p className="text-sm text-slate-500 p-4 text-center bg-white rounded-2xl">
            {data.message || "No medicines could be identified on this prescription."}
          </p>
        )}
      </div>
      
      {data.medicines.length > 1 && (
        <div className="mt-6 flex justify-center">
          <p className="text-[10px] text-slate-400 text-center max-w-sm">
            Click "Analyze" on any medicine to view detailed side effects, alternatives, and warnings.
          </p>
        </div>
      )}
    </div>
  );
}
