import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function Nav({ active }: { active?: "gallery" | "photographers" | "about" }) {
  const links = [
    { href: "/gallery", label: "The Gallery", key: "gallery" },
    { href: "/photographers", label: "Photographers", key: "photographers" },
    { href: "/about", label: "About", key: "about" },
  ] as const;

  return (
    <header className="bg-[#f9f9f9] border-b border-[#e8e8e8] sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-6 md:py-8 max-w-screen-2xl mx-auto">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-black font-headline text-black tracking-tighter uppercase"
        >
          Limited Exposure
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-12">
          {links.map(({ href, label, key }) => (
            <Link
              key={key}
              href={href}
              className={[
                "font-headline uppercase tracking-tight text-sm transition-colors duration-300",
                active === key
                  ? "text-black border-b-2 border-black pb-1"
                  : "text-[#777777] hover:text-black",
              ].join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
