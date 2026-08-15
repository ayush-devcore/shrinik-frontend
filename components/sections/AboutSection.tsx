export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen bg-[#080808] px-6 py-32 md:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <span className="text-xs uppercase tracking-[0.35em] text-[#C6922E]">
        About
        </span>

        <div className="mt-8 max-w-4xl">
          <h2 className="text-4xl font-medium tracking-tight text-[#F5F1E8] md:text-7xl">
            The story of
            <span className="block text-[#C6922E]">SHRINIK.</span>
          </h2>

          <div className="mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.025] p-8">
            <p className="text-sm leading-8 text-white/45">
              [About section content will be added here.]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}