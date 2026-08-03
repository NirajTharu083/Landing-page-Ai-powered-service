import Logo from "./Logo";

export default function Header() {
  return (
    <header className="relative z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
      <div className="container-page flex h-[72px] items-center justify-center">
        <Logo />
      </div>
    </header>
  );
}
