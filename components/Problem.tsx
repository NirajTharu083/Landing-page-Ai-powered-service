import { ArrowRight } from "./Icons";

export default function Problem() {
  return (
    <section className="section-pad bg-white">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="section-kicker">Is this for you?</p>
          <h2 className="section-title max-w-[560px]">A clearer path to consistent leads and sales.</h2>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-6 shadow-[0_16px_50px_rgba(15,23,42,.06)] sm:p-9">
          <p className="section-copy text-slate-700">If you&apos;re a small or medium business owner struggling to generate consistent leads and sales, this free one-to-one consultation is designed for you.</p>
          <div className="my-6 h-px bg-slate-200" />
          <p className="section-copy">You&apos;ll receive a customized AI marketing plan focused on your business and your growth goals.</p>
          <a href="#book" className="mt-7 inline-flex items-center gap-2 font-bold text-blue-600 no-underline transition-colors hover:text-blue-700">Book Free Consultation <ArrowRight /></a>
        </div>
      </div>
    </section>
  );
}
