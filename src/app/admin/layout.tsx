import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/photographers", label: "Fotografové" },
  { href: "/admin/photos", label: "Fotografie" },
  { href: "/admin/editions", label: "Edice" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex flex-col">
      {/* Admin header */}
      <header className="bg-primary text-on-primary sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="serif-display font-black text-sm uppercase tracking-tight opacity-70 hover:opacity-100 transition-opacity">
              ← Limited Exposure
            </Link>
            <span className="font-label text-[10px] uppercase tracking-widest opacity-50">|</span>
            <span className="font-label text-xs uppercase tracking-widest">Admin</span>
          </div>
          <span className="font-label text-[10px] uppercase tracking-widest opacity-60 hidden md:block">
            {session.user?.name ?? session.user?.email}
          </span>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 bg-surface border-r border-outline-variant/20 py-10 px-6 hidden md:block">
          <nav className="space-y-1">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block font-label text-xs uppercase tracking-widest py-3 px-4 hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
