export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500">
        <p>© 2026 AquaEase. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Hydrate, with ease.</span>
          <a
            className="text-sm font-semibold text-aqua-600 hover:text-aqua-500"
            href="https://instagram.com/Aquaeasedelivery"
            rel="noreferrer"
            target="_blank"
          >
            @Aquaeasedelivery
          </a>
        </div>
      </div>
    </footer>
  );
}
