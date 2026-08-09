import FlodeskEmbed from "./FlodeskEmbed";
import { Check, Lock } from "./Icons";

export default function CTAForm() {
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
        <div className="rounded-[1.5rem] border border-white/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,.3)] sm:p-8 lg:p-10">
          <FlodeskEmbed />
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-slate-500"><Lock /> We respect your privacy. No spam.</p>
        </div>
      </div>
    </section>
  );
}
