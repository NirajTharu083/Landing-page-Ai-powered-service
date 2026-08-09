"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Lock } from "./Icons";

type FormValues = { fullName: string; email: string; whatsapp: string; businessName: string; website: string; message: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = { fullName: "", email: "", whatsapp: "", businessName: "", website: "", message: "" };

export default function CTAForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  const validate = () => {
    const next: FormErrors = {};
    if (!values.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!values.email.trim()) next.email = "Please enter your active email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Please enter a valid email address.";
    if (!values.whatsapp.trim()) next.whatsapp = "Please enter your WhatsApp number.";
    else if (!/^\+?[0-9\s()-]{7,20}$/.test(values.whatsapp)) next.whatsapp = "Please enter a valid WhatsApp number.";
    if (!values.businessName.trim()) next.businessName = "Please enter your business name.";
    if (values.website.trim()) {
      try { new URL(values.website.match(/^https?:\/\//) ? values.website : `https://${values.website}`); }
      catch { next.website = "Please enter a valid website or Facebook URL."; }
    }
    return next;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      document.getElementById(first)?.focus();
      return;
    }
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, companyWebsite }),
      });
      const result = (await response.json()) as { error?: string; orderId?: string };

      if (!response.ok) {
        throw new Error(result.error || "We couldn't complete your request. Please try again.");
      }

      if (result.orderId) sessionStorage.setItem("digitalNirajOrderId", result.orderId);
      router.push("/thank-you");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We couldn't complete your request. Please try again.",
      );
      setSubmitting(false);
    }
  };

  const field = (name: keyof FormValues, label: string, placeholder: string, required = false, type = "text") => (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-slate-800">{label}{required && <span className="ml-1 text-blue-600" aria-hidden="true">*</span>}</label>
      <input id={name} name={name} type={type} required={required} value={values[name]} placeholder={placeholder} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} onChange={(e) => { setValues({ ...values, [name]: e.target.value }); if (errors[name]) setErrors({ ...errors, [name]: undefined }); }} className="min-h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-[16px] text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-red-50" />
      {errors[name] && <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <section id="book" className="scroll-mt-4 bg-slate-950 py-16 sm:py-24">
      <div className="container-page grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="pt-2 text-white lg:sticky lg:top-10">
          <p className="text-xs font-extrabold uppercase tracking-[.12em] text-blue-400">Book the call</p>
          <h2 className="mt-4 text-4xl font-black leading-[1.08] tracking-[-.045em] sm:text-5xl">Book Your Free AI Marketing Strategy Call</h2>
          <div className="mt-8 space-y-6">
            <div className="flex gap-3.5"><span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-500/20 text-blue-400"><Check width="16" /></span><div><h3 className="font-bold">One-to-One Consultation</h3><p className="mt-1 leading-7 text-slate-400">Get dedicated time to discuss your business challenges and marketing goals.</p></div></div>
            <div className="flex gap-3.5"><span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-500/20 text-blue-400"><Check width="16" /></span><div><h3 className="font-bold">Customized Strategy for Your Business</h3><p className="mt-1 leading-7 text-slate-400">Receive a personalized AI marketing plan based on your current situation and business objectives.</p></div></div>
          </div>
        </div>
        <form onSubmit={submit} noValidate className="relative rounded-[1.5rem] border border-white/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,.3)] sm:p-8 lg:p-10">
          <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="companyWebsite">Company website</label>
            <input id="companyWebsite" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" value={companyWebsite} onChange={(event) => setCompanyWebsite(event.target.value)} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {field("fullName", "Full Name", "Your full name", true)}
            {field("email", "Active Email", "you@example.com", true, "email")}
            {field("whatsapp", "WhatsApp Number", "+977 98XXXXXXXX", true, "tel")}
            {field("businessName", "Business Name", "Your business name", true)}
            <div className="sm:col-span-2">{field("website", "Website or Facebook URL", "yourwebsite.com (optional)")}</div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="mb-2 block text-sm font-bold text-slate-800">Anything You Want to Say</label>
              <textarea id="message" name="message" rows={4} value={values.message} placeholder="Tell me about your business or marketing goals (optional)" onChange={(e) => setValues({ ...values, message: e.target.value })} className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-[16px] text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </div>
          </div>
          {submitError && (
            <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
              {submitError}
            </p>
          )}
          <button type="submit" disabled={submitting} className="primary-button mt-6 w-full">
            {submitting ? "Saving your request…" : "Book Free Consultation"}
            {!submitting && <ArrowRight />}
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-slate-500"><Lock /> We respect your privacy. No spam.</p>
        </form>
      </div>
    </section>
  );
}
