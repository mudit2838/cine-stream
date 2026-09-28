'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Search, Home } from 'lucide-react';
export default function Navigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation" className="flex gap-1 sm:gap-2 shrink-0">
      {[
        ['/', 'Home', Home],
        ['/search', 'Search', Search],
        ['/favorites', 'Favorites', Heart],
      ].map(([href, label, Icon]) => (
        <Link
          key={href}
          href={href}
          aria-label={label}
          aria-current={pathname === href ? 'page' : undefined}
          className={`flex items-center gap-1.5 p-2 sm:px-3 rounded-md text-sm ${pathname === href ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
