import { useState } from "react";
import { ExportFormData } from "../exportPDF/UsePDFExport";

interface ExportModalProps {
  onClose: () => void;
  onExport: (form: ExportFormData) => void;
  exporting: boolean;
}

export default function ExportModal({ onClose, onExport, exporting }: ExportModalProps) {
  const [form, setForm] = useState<ExportFormData>({ name: "", email: "", role: "", organization: "" });
  const [errors, setErrors] = useState<Partial<ExportFormData>>({});

  const validate = () => {
    const e: Partial<ExportFormData> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onExport(form);
  };

  const inputClass = (key: keyof ExportFormData) =>
    `w-full appearance-none bg-[var(--color-bg-subtle)] border rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all ${
      errors[key] ? "border-red-300 bg-red-50" : "border-[var(--color-border-input)]"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-[#0a1f10]/60 backdrop-blur-sm"
        onClick={() => !exporting && onClose()}
      />

      <div className="relative font-['DM Sans'] bg-[var(--color-bg-card)] rounded-3xl shadow-2xl w-full max-w-[440px] z-10 overflow-hidden">

        {/* Modal header strip */}
        <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[var(--color-bg-subtle)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">Export Results</span>
          <button
            onClick={() => !exporting && onClose()}
            className="ml-auto w-7 h-7 rounded-full bg-[#ede9e0] hover:bg-[#e0dbd3] flex items-center justify-center text-[#6b7a75] transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-7 py-7">
          <h2 className=" text-[22px] text-[var(--color-primary)] mb-1">Export as PDF</h2>
          <p className="text-[13px] text-[var(--color-text-faint)] font-light mb-7">
            Your details will be included in the report header.
          </p>

          <div className="space-y-4 mb-7">
            <Field
              id="name" label="Full Name" placeholder="e.g. Juan dela Cruz"
              required form={form} errors={errors}
              onChange={(val) => { setForm(f => ({ ...f, name: val })); setErrors(e => ({ ...e, name: "" })); }}
            />
            <Field
              id="email" label="Email Address" placeholder="e.g. juan@example.com"
              required type="email" form={form} errors={errors}
              onChange={(val) => { setForm(f => ({ ...f, email: val })); setErrors(e => ({ ...e, email: "" })); }}
            />
            <Field
              id="role" label="Role / Position" placeholder="e.g. Researcher, Project Lead"
              form={form} errors={errors}
              onChange={(val) => setForm(f => ({ ...f, role: val }))}
            />
            <Field
              id="organization" label="Organization" placeholder="e.g. DOST, State University"
              form={form} errors={errors}
              onChange={(val) => setForm(f => ({ ...f, organization: val }))}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => !exporting && onClose()}
              className="flex-1 px-4 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-[var(--color-bg-card)] border border-[var(--color-border-input)] hover:border-[#0f2e1a]/30 hover:text-[var(--color-primary)] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={exporting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[14px] font-semibold text-white bg-[var(--color-accent)] shadow-[0_6px_24px_rgba(74,163,90,0.35)] hover:bg-[var(--color-accent-hover)] disabled:opacity-60 disabled:shadow-none transition-all"
            >
              {exporting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  Download PDF
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1v6M2 5l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

//    ─ Reusable field inside the modal    ─────────────────────────────────────

function Field({
  id, label, placeholder, required = false, type = "text",
  form, errors, onChange,
}: {
  id: keyof ExportFormData;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  form: ExportFormData;
  errors: Partial<ExportFormData>;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-[1.5px] uppercase text-[var(--color-text-faintest)] mb-2">
        {label}{" "}
        {required
          ? <span className="text-red-400">*</span>
          : <span className="text-[#c8c3b8] normal-case tracking-normal font-normal">(optional)</span>}
      </label>
      <input
        type={type}
        value={form[id]}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full appearance-none bg-[var(--color-bg-subtle)] border rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all ${
          errors[id] ? "border-red-300 bg-red-50" : "border-[var(--color-border-input)]"
        }`}
      />
      {errors[id] && <p className="text-[12px] text-red-400 mt-1">{errors[id]}</p>}
    </div>
  );
}