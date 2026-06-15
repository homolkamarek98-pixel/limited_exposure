import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-32">
        <span className="font-label text-xs uppercase tracking-[0.3em] text-[#8e8779] mb-6">404</span>
        <h1 className="serif-display text-4xl md:text-6xl font-semibold text-[#2f2a22] mb-5">Stránka nenalezena</h1>
        <p className="font-body text-[#8e8779] max-w-sm mb-10">
          Tahle stránka neexistuje nebo byla přesunuta.
        </p>
        <Link
          href="/"
          className="bg-mocha text-on-primary px-10 py-4 font-label text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Zpět na úvod
        </Link>
      </main>
      <Footer />
    </>
  );
}
