"use client";

import { useState } from "react";
import { ExportFormData } from "./UsePDFExport";

//    ─ Types ─

export interface AssessmentMeta {
  technologyName: string;
  technologyType: string;
  trlLevel:       number;
  trlDescription: string;
}

interface ExportModalProps {
  onClose:    () => void;
  onExport:   (form: ExportFormData, mode: "download" | "email" | "both", recipientEmail: string) => Promise<void>;
  exporting:  boolean;
  meta:       AssessmentMeta;
}

type Mode = "download" | "email" | "both";

//    ─ Field component    ──────────────────────────────────────────────────────

function Field({
  id, label, placeholder, required = false, type = "text",
  value, error, onChange,
}: {
  id:          string;
  label:       string;
  placeholder: string;
  required?:   boolean;
  type?:       string;
  value:       string;
  error?:      string;
  onChange:    (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-[1.5px] uppercase text-[#94a3a0] mb-1.5">
        {label}{" "}
        {required
          ? <span className="text-red-400">*</span>
          : <span className="text-[#c8c3b8] normal-case tracking-normal font-normal">(optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-[#f8f6f1] border rounded-xl px-4 py-2.5 text-[13.5px] text-[#1a1a1a] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all ${
          error ? "border-red-300 bg-red-50" : "border-[#e5e1d8]"
        }`}
      />
      {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}

//    ─ Mode toggle pill    ─────────────────────────────────────────────────────

function ModePill({ active, onClick, icon, label }: {
  active: boolean; onClick: () => void;
  icon: React.ReactNode; label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all ${
        active
          ? "bg-[#0f2e1a] text-white shadow-sm"
          : "bg-[#f0ede6] text-[#6b7a75] hover:bg-[#e8e4db] hover:text-[#0f2e1a]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

//    ─ Main modal      

export default function ExportModal({ onClose, onExport, exporting, meta }: ExportModalProps) {
  const [mode, setMode] = useState<Mode>("download");

  const [form, setForm] = useState<ExportFormData>({
    name: "", email: "", role: "", organization: "",
  });
  const [recipientEmail, setRecipientEmail] = useState("");

  const [errors, setErrors]     = useState<Partial<Record<keyof ExportFormData | "recipientEmail", string>>>({});
  const [done,   setDone]       = useState(false);
  const [doneMode, setDoneMode] = useState<Mode>("download");
  const [doneEmail, setDoneEmail] = useState("");
  const [submitError, setSubmitError] = useState("");

  const set = (key: keyof ExportFormData) => (val: string) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim())  e.name  = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";

    if (mode === "email" || mode === "both") {
      if (!recipientEmail.trim()) e.recipientEmail = "Recipient email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail))
        e.recipientEmail = "Enter a valid email.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitError("");
    try {
      await onExport(form, mode, recipientEmail);
      setDoneMode(mode);
      setDoneEmail(recipientEmail);
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const sendLabel = mode === "download"
    ? "Download PDF"
    : mode === "email"
    ? "Send Email"
    : "Download & Send";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#0a1f10]/60 backdrop-blur-sm" onClick={() => !exporting && onClose()} />

      <div className="relative font-['DM_Sans',sans-serif] bg-white rounded-3xl shadow-2xl w-full max-w-[550px] z-10 overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#f5f2ec] bg-[#f8f6f1] flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#4aa35a] flex-shrink-0" />
          <span className="text-[11px] font-bold tracking-[2px] uppercase text-[#4aa35a]">Export Results</span>
          <button
            onClick={() => !exporting && onClose()}
            className="ml-auto w-7 h-7 rounded-full bg-[#ede9e0] hover:bg-[#e0dbd3] flex items-center justify-center text-[#6b7a75] transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="px-7 py-6 overflow-y-auto flex-1">

          {/*     Success screen     */}
          {done ? (
            <div className="flex flex-col items-center text-center py-6 gap-5">

              {/* Animated checkmark */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#4aa35a]/10 animate-ping" style={{ animationDuration: "1.8s" }} />
                <div className="w-20 h-20 rounded-full bg-[#4aa35a]/15 flex items-center justify-center">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="17" stroke="#4aa35a" strokeWidth="1.5" />
                    <path d="M11 18l5 5 9-9" stroke="#4aa35a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Headline */}
              <div>
                <h2 className="font-['DM_Serif_Display',serif] text-[24px] text-[#0f2e1a] mb-1">
                  {doneMode === "download" ? "Report Downloaded!" :
                   doneMode === "email"    ? "Report Sent!"       : "All Done!"}
                </h2>
                <p className="text-[13px] text-[#8a9a94] font-light leading-relaxed max-w-[300px]">
                  {doneMode === "download" && "Your TRACER Assessment Report has been saved to your device."}
                  {doneMode === "email"    && <>Your report has been sent to <span className="font-semibold text-[#0f2e1a]">{doneEmail}</span>.</>}
                  {doneMode === "both"     && <>Your report was downloaded and sent to <span className="font-semibold text-[#0f2e1a]">{doneEmail}</span>.</>}
                </p>
              </div>

              {/* Detail pills */}
              <div className="w-full rounded-2xl border border-[#e8e4db] bg-[#f8f6f1] px-5 py-4 space-y-2 text-left">
                <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#94a3a0] mb-3">Report Details</p>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a] flex-shrink-0" />
                  <p className="text-[12.5px] text-[#4a5568]"><span className="font-semibold text-[#0f2e1a]">Technology:</span> {meta.technologyName || "—"}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a] flex-shrink-0" />
                  <p className="text-[12.5px] text-[#4a5568]"><span className="font-semibold text-[#0f2e1a]">TRACER Level:</span> {meta.trlLevel} — {meta.trlDescription}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a] flex-shrink-0" />
                  <p className="text-[12.5px] text-[#4a5568]"><span className="font-semibold text-[#0f2e1a]">Prepared by:</span> {form.name || "—"}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a] flex-shrink-0" />
                  <p className="text-[12.5px] text-[#4a5568]"><span className="font-semibold text-[#0f2e1a]">Date:</span> {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => { setDone(false); setSubmitError(""); }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[14px] font-semibold text-white bg-[#0f2e1a] hover:bg-[#1a3d26] transition-all"
                >
                  Export Again
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1v6M2 5l3 3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
          <> {/*     Form     */}

          <h2 className="font-['DM_Serif_Display',serif] text-[22px] text-[#0f2e1a] mb-1">Export Report</h2>
          <p className="text-[13px] text-[#8a9a94] font-light mb-5">
            Your details will appear in the report header.
          </p>

          {/* Mode selector */}
          <div className="flex gap-2 mb-6 p-1 bg-[#f0ede6] rounded-2xl">
            <ModePill
              active={mode === "download"}
              onClick={() => setMode("download")}
              label="Download PDF"
              icon={
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1v7M3.5 5.5l3 3 3-3M1.5 10.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <ModePill
              active={mode === "email"}
              onClick={() => setMode("email")}
              label="Send via Email"
              icon={
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <rect x="1" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M1 4.5l5.5 3.5L12 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />
            <ModePill
              active={mode === "both"}
              onClick={() => setMode("both")}
              label="Both"
              icon={
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M4 6.5h5M7 4.5l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
          </div>

          {/* Submitter fields */}
          <div className="space-y-3.5 mb-5">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#0f2e1a]/50 mb-1">Your Details</p>
            <Field id="name"         label="Full Name"       placeholder="e.g. Juan dela Cruz"           required value={form.name}         error={errors.name}         onChange={set("name")} />
            <Field id="email"        label="Your Email"      placeholder="e.g. juan@example.com"         required value={form.email}        error={errors.email}        onChange={set("email")}        type="email" />
            <Field id="role"         label="Role / Position" placeholder="e.g. Researcher, Project Lead"          value={form.role}         error={errors.role}         onChange={set("role")} />
            <Field id="organization" label="Organization"    placeholder="e.g. DOST, State University"            value={form.organization} error={errors.organization} onChange={set("organization")} />
          </div>

          {/* Recipient email — only shown for email / both modes */}
          {(mode === "email" || mode === "both") && (
            <div className="mt-1 mb-5 space-y-3.5">
              <div className="h-px bg-[#ede9e0]" />
              <p className="text-[11px] font-bold tracking-[2px] uppercase text-[#0f2e1a]/50 mb-1 pt-1">Send Report To</p>
              <Field
                id="recipientEmail"
                label="Recipient Email"
                placeholder="e.g. director@pcaarrd.dost.gov.ph"
                required
                type="email"
                value={recipientEmail}
                error={errors.recipientEmail}
                onChange={val => { setRecipientEmail(val); setErrors(e => ({ ...e, recipientEmail: "" })); }}
              />
              {/* Assessment preview */}
              <div className="rounded-xl border border-[#e8e4db] bg-[#f8f6f1] px-4 py-3 space-y-1">
                <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#94a3a0] mb-2">Email will include</p>
                <p className="text-[12px] text-[#4a5568]"><span className="font-semibold text-[#0f2e1a]">Technology:</span> {meta.technologyName || "—"}</p>
                <p className="text-[12px] text-[#4a5568]"><span className="font-semibold text-[#0f2e1a]">Type:</span> {meta.technologyType || "—"}</p>
                <p className="text-[12px] text-[#4a5568]"><span className="font-semibold text-[#0f2e1a]">TRACER Level:</span> {meta.trlLevel} — {meta.trlDescription}</p>
                <p className="text-[12px] text-[#4a5568]"><span className="font-semibold text-[#0f2e1a]">Date:</span> {new Date().toLocaleDateString()}</p>
              </div>


            </div>
          )}

          {/* Error banner */}
          {submitError && (
            <div className="flex items-start gap-2.5 text-[12px] text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {submitError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={() => !exporting && onClose()}
              className="flex-1 px-4 py-3 rounded-full text-[14px] font-medium text-[#6b7a75] bg-white border border-[#e5e1d8] hover:border-[#0f2e1a]/30 hover:text-[#0f2e1a] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={exporting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-[14px] font-semibold text-white bg-[#4aa35a] shadow-[0_6px_24px_rgba(74,163,90,0.35)] hover:bg-[#3d8f4c] disabled:opacity-60 disabled:shadow-none transition-all"
            >
              {exporting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "email" ? "Sending…" : mode === "both" ? "Processing…" : "Generating…"}
                </>
              ) : (
                <>
                  {sendLabel}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
          </> 
          )} 
        </div>
      </div>
    </div>
  );
}