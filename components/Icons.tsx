import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function ArrowRight(props: IconProps) {
  return <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" {...base} {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}
export function Check(props: IconProps) {
  return <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...base} {...props}><path d="m5 12 4 4L19 6" /></svg>;
}
export function Sparkles(props: IconProps) {
  return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...base} {...props}><path d="m12 3-1.2 3.2A6 6 0 0 1 7.2 9.8L4 11l3.2 1.2a6 6 0 0 1 3.6 3.6L12 19l1.2-3.2a6 6 0 0 1 3.6-3.6L20 11l-3.2-1.2a6 6 0 0 1-3.6-3.6L12 3Z" /><path d="m19 3-.4 1.1a2 2 0 0 1-1.2 1.2l-1.1.4 1.1.4a2 2 0 0 1 1.2 1.2l.4 1.1.4-1.1a2 2 0 0 1 1.2-1.2l1.1-.4-1.1-.4a2 2 0 0 1-1.2-1.2L19 3Z" /></svg>;
}
export function Target(props: IconProps) {
  return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...base} {...props}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>;
}
export function Search(props: IconProps) {
  return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...base} {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>;
}
export function Bolt(props: IconProps) {
  return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...base} {...props}><path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z"/></svg>;
}
export function PathIcon(props: IconProps) {
  return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...base} {...props}><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/></svg>;
}
export function Growth(props: IconProps) {
  return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...base} {...props}><path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6"/><path d="M16 7h3v3"/></svg>;
}
export function Lock(props: IconProps) {
  return <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...base} {...props}><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
}
export function Message(props: IconProps) {
  return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...base} {...props}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.7-5A7 7 0 0 1 3 12V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7Z"/></svg>;
}
