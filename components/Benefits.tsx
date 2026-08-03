import { Bolt, Growth, PathIcon, Search, Target } from "./Icons";

const benefits = [
  { icon: Target, title: "Personalized plan", text: "Get a personalized AI marketing plan for your business." },
  { icon: Search, title: "Identify limitations", text: "Identify what's limiting your leads and sales." },
  { icon: Bolt, title: "Find opportunities", text: "Discover practical AI-powered marketing opportunities." },
  { icon: PathIcon, title: "Clear next steps", text: "Learn clear next steps to improve your marketing." },
  { icon: Growth, title: "Understand AI", text: "Gain a better understanding of how AI can support your business growth." },
];

export default function Benefits() {
  return (
    <section className="section-pad border-y border-slate-200/80 bg-[#f7f9fd]">
      <div className="container-page">
        <div className="mx-auto max-w-[690px] text-center">
          <p className="section-kicker">How you benefit</p>
          <h2 className="section-title">Practical direction, built around your business.</h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className={`group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,.035)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(37,99,235,.09)] ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white"><Icon /></span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">{title}</h3>
              <p className="mt-2 leading-7 text-slate-500">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
