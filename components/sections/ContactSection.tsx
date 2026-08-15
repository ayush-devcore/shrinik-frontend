export default function ContactSection() {
  return (
    <section
      id="contact"
      className="min-h-[80vh] bg-[#100306] px-6 py-32 md:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <span className="text-xs uppercase tracking-[0.35em] text-[#C6922E]">
        Contact
        </span>

        <h2 className="mt-6 max-w-4xl text-4xl text-[#F5F1E8] md:text-7xl">
          Let&apos;s build something
          <span className="text-[#C6922E]"> meaningful.</span>
        </h2>

        <div className="mt-16 rounded-[2rem] border border-dashed border-white/10 p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-white/30">
            Contact information will be added here
          </p>
        </div>
      </div>
    </section>
  );
}