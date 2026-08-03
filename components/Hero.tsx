import { ArrowRight, Check, Sparkles } from "./Icons";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-[#fbfcff] pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div aria-hidden="true" className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,#e8edf6_1px,transparent_1px),linear-gradient(to_bottom,#e8edf6_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-[-15rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-blue-300/25 blur-[100px]" />
      <div className="container-page relative mx-auto max-w-[900px] text-center">
        <div className="eyebrow reveal"><Sparkles /> Free one-to-one consultation</div>
        <h1 className="reveal reveal-delay-1 mx-auto mt-7 max-w-[850px] text-[2.55rem] font-black leading-[1.04] tracking-[-.055em] text-slate-950 sm:text-6xl lg:text-[4.6rem]">
          Get a Personalized <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI Marketing Plan</span>
        </h1>
        <p className="reveal reveal-delay-2 mx-auto mt-6 max-w-[700px] text-lg font-semibold leading-relaxed text-slate-700 sm:text-xl">
          To help you generate more leads and increase sales.
        </p>
        <p className="reveal reveal-delay-2 mx-auto mt-3 max-w-[660px] text-[1rem] leading-7 text-slate-500 sm:text-lg">
          See what&apos;s holding your marketing back and discover practical AI-powered strategies tailored to your business.
        </p>
        <div className="reveal reveal-delay-2 mt-9">
          <a href="#book" className="primary-button sm:min-w-[250px]">Book Free Consultation <ArrowRight /></a>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5"><Check className="text-blue-600" width="17" /> One-to-one</span>
          <span className="inline-flex items-center gap-1.5"><Check className="text-blue-600" width="17" /> Personalized plan</span>
          <span className="inline-flex items-center gap-1.5"><Check className="text-blue-600" width="17" /> Free consultation</span>
        </div>
      </div>
    </section>
  );
}
