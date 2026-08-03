const steps = [
  "Book your free consultation by completing the form below.",
  "Meet one-to-one to discuss your business, current marketing, and goals.",
  "Receive your customized AI marketing plan with practical recommendations for your business.",
];

export default function Process() {
  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-[660px] text-center">
          <p className="section-kicker">Consultation process</p>
          <h2 className="section-title">Three simple steps to your marketing plan.</h2>
        </div>
        <div className="relative mt-12 grid gap-5 md:grid-cols-3">
          <div aria-hidden="true" className="absolute left-[16.7%] right-[16.7%] top-8 hidden border-t-2 border-dashed border-blue-200 md:block" />
          {steps.map((step, index) => (
            <article key={step} className="relative rounded-2xl border border-slate-200 bg-white p-6 text-center md:border-0 md:px-7 md:shadow-none">
              <span className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-black text-white shadow-[0_10px_28px_rgba(37,99,235,.22)]">0{index + 1}</span>
              <h3 className="mt-5 text-lg font-bold">Step {index + 1}</h3>
              <p className="mt-2 leading-7 text-slate-500">{step}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
