import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-night">
      <div className="container-x flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2.5" aria-label="GorkhayAI home">
            <Logo className="h-7 w-7" />
            <span className="font-display text-xl">GorkhayAI</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-haze">
            An AI studio from Darjeeling. Websites, booking bots and lead systems for hotels and homestays.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-mist">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-snow">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/insights" className="hover:text-snow">
                All insights
              </Link>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-snow">
                {site.email}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-white/5 py-6 text-xs text-haze sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} GorkhayAI. Made in Darjeeling.</p>
        <p>Kanchenjunga, rendered in real time.</p>
      </div>
    </footer>
  );
}
