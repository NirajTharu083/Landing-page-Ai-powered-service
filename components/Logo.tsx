export default function Logo() {
  return (
    <div className="inline-flex items-center gap-2.5" aria-label="Digital Niraj">
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[11px] bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-black text-white shadow-[0_8px_20px_rgba(37,99,235,.22)]">
        DN
        <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/20" />
      </span>
      <span className="text-[1.05rem] font-extrabold tracking-[-.035em] text-slate-950">Digital <span className="text-blue-600">Niraj</span></span>
    </div>
  );
}
