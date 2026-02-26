import Link from "next/link";

const navLinks = [
  ["Home", "/"],
  ["Services", "/services"],
  ["About", "/about"],
  ["FAQ", "/faq"],
  ["Subscribe", "/subscribe"],
] as const;

export default function SiteHeader() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-aqua-600 text-4xl font-semibold">
            Æ
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-aqua-600 font-semibold">
              AquaEase
            </p>
            <p className="text-sm text-sea-900">
              Campus Water Delivery
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          {navLinks.map(([label, link]) => (
            <Link key={label} href={link} className="hover:text-aqua-600">
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/subscribe"
          className="inline-flex items-center justify-center rounded-full bg-aqua-600 px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-aqua-500"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}
