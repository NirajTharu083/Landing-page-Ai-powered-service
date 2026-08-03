import type { Metadata } from "next";
import { ArrowRight, Check, Message } from "@/components/Icons";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "You're Booked | Digital Niraj",
  description: "Thank you for booking your free AI Marketing Strategy Call with Digital Niraj.",
  robots: { index: false, follow: false },
};

const videoPoints = [
  "What we'll cover during the consultation",
  "How to prepare before the call",
  "What information to have ready",
  "How your personalized AI marketing plan will be created",
  "What happens after the consultation",
];

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fd]">
      <header className="border-b border-slate-200/80 bg-white"><div className="container-page flex h-[72px] items-center justify-center"><Logo /></div></header>
      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:pb-24 sm:pt-20">
        <div aria-hidden="true" className="absolute left-1/2 top-[-18rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-blue-300/25 blur-[100px]" />
        <div className="relative mx-auto max-w-[850px]">
          <div className="text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-600 text-white shadow-[0_14px_35px_rgba(37,99,235,.28)]"><Check width="30" height="30" strokeWidth="2.5" /></span>
            <p className="section-kicker mt-6">You&apos;re booked!</p>
            <h1 className="mx-auto mt-3 max-w-[740px] text-[2.4rem] font-black leading-[1.07] tracking-[-.05em] text-slate-950 sm:text-6xl">Thank You for Booking Your Free AI Marketing Strategy Call</h1>
            <p className="mx-auto mt-6 max-w-[650px] text-lg leading-8 text-slate-600">Your consultation request has been received.</p>
            <p className="mx-auto mt-3 max-w-[720px] leading-7 text-slate-500">I&apos;m looking forward to learning about your business and helping you identify practical AI marketing opportunities to generate more leads and increase sales.</p>
          </div>

          <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,.08)]">
            <div className="p-6 sm:p-9">
              <p className="section-kicker">Before your consultation</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Please Watch This Short Video</h2>
              <p className="mt-3 leading-7 text-slate-500">This short video will help you get the most value from our consultation.</p>
            </div>
            <div className="mx-6 grid aspect-video place-items-center rounded-2xl bg-slate-950 text-center text-white sm:mx-9">
              <div>
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-600 shadow-[0_10px_30px_rgba(37,99,235,.4)]" aria-hidden="true"><span className="ml-1 block h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-white" /></span>
                <p className="mt-4 text-sm font-semibold text-slate-300">Video coming soon</p>
              </div>
            </div>
            <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-9">
              {videoPoints.map((point) => <p key={point} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"><Check className="mt-0.5 shrink-0 text-blue-600" width="18" />{point}</p>)}
            </div>
          </div>

          <div className="mt-7 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-7 text-center text-white shadow-[0_18px_50px_rgba(37,99,235,.2)] sm:p-10">
            <Message className="mx-auto" width="28" height="28" />
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Want a Faster Response?</h2>
            <p className="mx-auto mt-3 max-w-[620px] leading-7 text-blue-100">If you have any questions before the consultation or would like to share additional information about your business, send me a message on WhatsApp.</p>
            <p className="mx-auto mt-2 max-w-[620px] leading-7 text-blue-100">This also helps me better understand your business before our call.</p>
            <a href="https://wa.me/9779802633026" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 font-bold text-blue-700 no-underline shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white/50">Message on WhatsApp <ArrowRight /></a>
          </div>

          <div className="mx-auto mt-12 max-w-[690px] text-center">
            <h2 className="text-3xl font-black tracking-tight">See You Soon!</h2>
            <p className="mt-4 leading-7 text-slate-600">I&apos;m excited to meet you and discuss your business.</p>
            <p className="mt-3 leading-7 text-slate-500">Together, we&apos;ll identify practical AI marketing opportunities that fit your goals and create a customized marketing plan tailored to your business.</p>
            <p className="mt-3 font-semibold text-slate-700">Thank you for booking your consultation. See you on the call!</p>
          </div>
        </div>
      </section>
    </main>
  );
}
