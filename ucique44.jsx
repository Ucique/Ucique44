import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// --- Utils -----------------------------------------------------------------
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// --- Parallax Background (independent from foreground) ---------------------
function ParallaxBackground() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return; // throttle
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY || 0;
        const h = window.innerHeight || 1;
        const a = clamp(y * -0.08, -300, 0); // aurora
        const g = clamp(y * -0.04, -120, 0); // grain
        const s = clamp(y * -0.12, -400, 0); // stars
        ref.current?.style.setProperty("--y-aurora", `${a}px`);
        ref.current?.style.setProperty("--y-grain", `${g}px`);
        ref.current?.style.setProperty("--y-stars", `${s}px`);
        const hue = (y / (h * 6)) * 360; // slow hue cycle
        ref.current?.style.setProperty("--hue", `${hue % 360}deg`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep gradient base */}
      <div aria-hidden className="absolute inset-0" style={{
        background:
          "radial-gradient(1200px 800px at 20% 15%, rgba(180,0,255,0.22), transparent 60%),"+
          "radial-gradient(1000px 700px at 80% 85%, rgba(0,160,255,0.18), transparent 55%),"+
          "radial-gradient(900px 600px at 60% 30%, rgba(255,120,0,0.10), transparent 60%),"+
          "linear-gradient(180deg, #0a0a0f, #06060a 60%, #050509)",
        filter: "saturate(110%)"
      }} />

      {/* Aurora sheets */}
      <div aria-hidden className="absolute -top-40 left-0 right-0 h-[140vh] pointer-events-none" style={{
        transform: "translate3d(0,var(--y-aurora),0)",
        background: "conic-gradient(from 180deg at 50% 40%, hsla(280,90%,60%,0.16), transparent 20% 60%, hsla(200,90%,60%,0.16))",
        mixBlendMode: "screen",
        filter: "blur(40px) saturate(130%)"
      }} />

      {/* Starfield */}
      <div aria-hidden className="absolute -top-20 left-0 right-0 h-[120vh] opacity-60" style={{
        transform: "translate3d(0,var(--y-stars),0)",
        backgroundImage:
          "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,.35) 40%, transparent 41%),"+
          "radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,.35) 40%, transparent 41%),"+
          "radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,.28) 40%, transparent 41%),"+
          "radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,.25) 40%, transparent 41%)",
        backgroundRepeat: "repeat",
        backgroundSize: "300px 300px"
      }} />

      {/* Film grain */}
      <div aria-hidden className="absolute inset-0 opacity-[.15]" style={{
        transform: "translate3d(0,var(--y-grain),0)",
        backgroundImage:
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAU0lEQVQYV2P4////fwYiYGBg2L9/f3dQkGQyQGQYQwZgYGB4z8DAwPDLwMDA8P+f4bE0JmBgYHhfwYGBgYkJgYGBzEwMDAC4Lk7Ckqv8cQAAAABJRU5ErkJggg==')",
        backgroundSize: "auto",
        mixBlendMode: "overlay"
      }} />

      {/* Hue overlay */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, transparent, hsla(0,0%,0%,0.3))",
        filter: "hue-rotate(var(--hue))"
      }} />
    </div>
  );
}

// --- Typography helpers ----------------------------------------------------
function Title({ children }) {
  return (
    <h1 className="font-display font-extrabold tracking-[.18em] uppercase text-center text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-300 drop-shadow-[0_2px_0_rgba(255,255,255,.08)]">
      {children}
    </h1>
  );
}
function Kicker({ children }) {
  return (
    <p className="mt-4 text-center text-zinc-300/90 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
      {children}
    </p>
  );
}
function SectionTitle({ children }) {
  return (
    <h2 className="font-display text-zinc-100 font-bold tracking-widest uppercase text-[clamp(1.2rem,2.6vw,1.8rem)]">
      {children}
    </h2>
  );
}

// --- Glass Card (the look you liked) --------------------------------------
function Card({ title, subtitle, cta, href, children }) {
  return (
    <motion.a
      whileHover={{ y: -4 }}
      href={href}
      className="group relative block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-7 shadow-[0_8px_40px_rgba(0,0,0,.35)] hover:shadow-[0_12px_50px_rgba(0,0,0,.5)] transition-shadow"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      <div className="flex items-center gap-3">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400/90 shadow-[0_0_20px_rgba(16,185,129,.6)]" />
        <div className="text-zinc-200/90 text-sm tracking-wider uppercase">{subtitle}</div>
      </div>
      <div className="mt-3 text-zinc-50 font-semibold text-2xl">{title}</div>
      <div className="mt-3 text-zinc-300/90 text-base leading-relaxed">{children}</div>
      <div className="mt-5 inline-flex items-center gap-2 text-emerald-400 font-semibold tracking-wide">
        <span>{cta}</span>
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </div>
    </motion.a>
  );
}

// --- Main Page -------------------------------------------------------------
export default function UciqueHome() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || 0) > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen text-zinc-100 selection:bg-emerald-300/30 selection:text-white">
      <ParallaxBackground />

      {/* Font from the first attempt (Cinzel via Google Fonts) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&display=swap');
        :root { --font-display: "Cinzel", ui-serif, Georgia, "Times New Roman", serif; }
        .font-display { font-family: var(--font-display); }
      `}</style>

      {/* Nav */}
      <header className={`fixed top-0 inset-x-0 z-40 transition-all ${scrolled ? "backdrop-blur-md bg-black/40 border-b border-white/10" : "bg-transparent"}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="h-16 flex items-center justify-between">
            <a href="#top" className="font-display font-black tracking-[.24em] uppercase text-sm">UCIQUE</a>
            <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase">
              <a href="#store" className="hover:text-white/90">Shop</a>
              <a href="#discussion" className="hover:text-white/90">Discussion</a>
              <a href="#gallery" className="hover:text-white/90">Artwork</a>
              <a href="#blog" className="hover:text-white/90">Blog</a>
              <a href="#ethos" className="hover:text-white/90">Eco</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative pt-36 sm:pt-40 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Title>HEALING PROCESSES</Title>
          <Kicker>
            in a distorted world — spiritual gangstar edition. I make art that bites back, poetry that mends with teeth, and clothing that wears the wound with dignity.
          </Kicker>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#process" className="rounded-full px-6 py-3 bg-emerald-500/90 hover:bg-emerald-400 text-black font-bold tracking-wider uppercase shadow-[0_10px_30px_rgba(16,185,129,.35)]">Enter the Process</a>
            <a href="#store" className="rounded-full px-6 py-3 border border-white/20 hover:border-white/40 text-white/90 font-semibold tracking-wider uppercase">Visit the Store</a>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section id="process" className="relative py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card title="Art & Apparel" subtitle="Ritual clothing" cta="Visit the Store" href="#store">
              Wearable wounds. Sacred sarcasm. Prints, textiles, and objects tuned to frequency — for those who refuse costume‑spirituality.
            </Card>
            <Card title="Discussion" subtitle="Brutally honest forum" cta="Join the Forum" href="#discussion">
              A real space for the unpolished, the burned, the brilliant. Talk trauma, giftedness, healing, and madness without filters.
            </Card>
            <Card title="Artwork" subtitle="Gallery of ghosts" cta="Enter Gallery" href="#gallery">
              Visual stories & poetic fragments. Distorted beauty as medicine. Frequencies, scars, and truth — curated without apology.
            </Card>
          </div>
        </div>
      </section>

      {/* Featured grid / shop preview (no food images; abstract placeholders) */}
      <section id="store" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <SectionTitle>Featured Pieces</SectionTitle>
            <a href="#" className="text-sm uppercase tracking-widest text-emerald-400 hover:text-emerald-300">All Products →</a>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Signal: 3·6·9 Spiral Tee","Ritual Scar Hoodie","Ghost‑Field Print","Silver‑8 Ancestral Cap","Fifth Age Poster","Frequency Journal"].map((name, i) => (
              <motion.div key={i} whileHover={{ y: -6 }} className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-4">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                  {/* abstract placeholder art */}
                  <svg viewBox="0 0 200 200" className="h-full w-full opacity-80">
                    <defs>
                      <linearGradient id={`g${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(16,185,129,.7)" />
                        <stop offset="100%" stopColor="rgba(59,130,246,.5)" />
                      </linearGradient>
                    </defs>
                    <path d="M100 20c-35 0-64 29-64 64s29 64 64 64 64-29 64-64-29-64-64-64zm0 18a46 46 0 100 92 46 46 0 000-92z" fill={`url(#g${i})`} />
                    <circle cx="100" cy="100" r="6" fill="white" />
                  </svg>
                </div>
                <div className="pt-4">
                  <div className="text-zinc-100 font-semibold">{name}</div>
                  <div className="text-zinc-400 text-sm">Eco print‑on‑demand • Organic / recycled</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-zinc-200">€{ (i+1) * 18 }</span>
                    <button className="px-3 py-2 rounded-full bg-emerald-500/90 text-black text-sm font-bold uppercase tracking-wider">Add</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Discussion CTA */}
      <section id="discussion" className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <SectionTitle>Join the Community</SectionTitle>
              <p className="mt-4 text-zinc-300 leading-relaxed">
                This is not a safe space. It’s a real space. No filters. No fixations. No gods. Just breath, breakage, and becoming. Bring your story. Bring your edges. Leave the costume.
              </p>
              <div className="mt-6">
                <a href="#" className="rounded-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white/90 font-semibold tracking-wider uppercase">Join the Forum</a>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm uppercase tracking-widest text-zinc-400">House Rules</div>
              <ul className="mt-3 space-y-2 text-zinc-200">
                <li>• Radical honesty. No spiritual bypassing.</li>
                <li>• No savior‑complex. Offer experience, not prescriptions.</li>
                <li>• Respect boundaries. No voyeurism, no harassment.</li>
                <li>• Art welcome. Mess welcome. Sales okay in #show‑your‑work.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>Artwork</SectionTitle>
          <p className="mt-3 text-zinc-300/90 max-w-3xl">Visual stories, poetic fragments, distorted beauty. Frequencies, ghosts, and truths curated into a gallery that remembers the wound and still dances.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-900">
                <div className="h-full w-full grid place-items-center">
                  <div className="text-zinc-400">Artwork {i + 1}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle>Latest from the Blog</SectionTitle>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {[
              { t: "How to Heal Without Becoming a Liar", d: "Read about the brutal honesty required to break from spiritual bypassing..." },
              { t: "Gifted & Gaslit", d: "Why intelligence feels like madness when surrounded by mediocrity and fear..." },
              { t: "Insane Stepmothers", d: "A poetic grotesque memoir of masks falling off and poison leaking through silk smiles..." },
            ].map((p, i) => (
              <motion.a key={i} whileHover={{ y: -4 }} href="#" className="block rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-zinc-50 font-semibold text-lg">{p.t}</div>
                <p className="mt-2 text-zinc-300 text-sm leading-relaxed">{p.d}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-emerald-400 font-semibold tracking-wide">Read More
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Ethos / Eco */}
      <section id="ethos" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <SectionTitle>Earth First — Real Sustainability</SectionTitle>
              <p className="mt-4 text-zinc-300/90 leading-relaxed">
                Everything here is built on ecological principles. Organic cotton or recycled fibers, water‑based inks, print‑on‑demand to avoid over‑production, minimal packaging, carbon‑aware shipping, and repair over replacement. Art can be medicine without poisoning the planet.
              </p>
              <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-zinc-200">
                <li>• Organic / recycled textiles only</li>
                <li>• Water‑based, low‑impact inks</li>
                <li>• On‑demand: zero dead stock</li>
                <li>• Re‑use, repair, circularity</li>
                <li>• Plastic‑free packaging</li>
                <li>• Transparent suppliers</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm uppercase tracking-widest text-zinc-400">My Oath</div>
              <p className="mt-3 text-zinc-100">
                I won’t greenwash. If a supplier fails the bar, I drop them. I don’t sell enlightenment. I sell reality‑tested art, texts, and tools that help you stay honest while you heal. Spiritual gangstar, not spiritual mascot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="subscribe" className="relative py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle>Subscribe — Healing Poetry & Releases</SectionTitle>
          <p className="mt-4 text-zinc-300/90">Monthly rage, art, and insight — straight to your soul. No spam. No bullshit. No lightworker fluff.</p>
          <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <input type="email" required placeholder="your@email.com" className="w-full sm:w-80 rounded-full bg-white/10 border border-white/20 px-5 py-3 outline-none placeholder:text-zinc-400" />
            <button className="rounded-full px-6 py-3 bg-emerald-500/90 hover:bg-emerald-400 text-black font-bold tracking-wider uppercase">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-10 text-sm text-zinc-400/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} UCIQUE — Healing Processes</div>
          <nav className="flex items-center gap-6">
            <a href="#" className="hover:text-white/90">Contact</a>
            <a href="#" className="hover:text-white/90">Privacy</a>
            <a href="#" className="hover:text-white/90">Instagram</a>
            <a href="#" className="hover:text-white/90">TikTok</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
