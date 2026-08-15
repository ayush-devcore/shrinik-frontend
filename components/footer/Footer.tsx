export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold tracking-[0.3em] text-[#F5F1E8]">
            SHRINIK
          </p>

          <p className="mt-2 text-xs text-white/30">
            [Footer information will be added later.]
          </p>
        </div>

        <p className="text-xs text-white/25">
          © {new Date().getFullYear()} Shrinik
        </p>
      </div>
    </footer>
  );
}