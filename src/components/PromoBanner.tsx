const PromoBanner = () => {
  return (
    <section className="py-6 md:py-10">
      <div className="container">
        <div className="bg-charcoal text-cream p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1 font-body font-medium">
              Limited Time Offer
            </p>
            <h3 className="font-display text-xl md:text-3xl font-bold mb-2">
              Free Shipping on All Orders
            </h3>
            <p className="text-cream/60 text-xs md:text-sm max-w-md">
              Shop now and enjoy free delivery on every order. No minimum purchase required.
            </p>
          </div>
          <a
            href="/collections"
            className="inline-block bg-primary text-primary-foreground font-semibold tracking-wider uppercase text-xs py-3 px-8 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
