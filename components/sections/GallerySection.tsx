export default function GallerySection() {
    return (
    <section
        id="gallery"
        className="min-h-screen bg-[#080808] px-6 py-32 md:px-12"
    >
        <div className="mx-auto max-w-7xl">
        <span className="text-xs uppercase tracking-[0.35em] text-[#C6922E]">
        Gallery
        </span>

        <h2 className="mt-6 text-4xl text-[#F5F1E8] md:text-7xl">
            Moments worth keeping.
        </h2>

        <div className="mt-16 grid min-h-[420px] place-items-center rounded-[2rem] border border-dashed border-white/10">
            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
            Gallery content will be added here
            </p>
        </div>
        </div>
    </section>
    );
}