'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/admin', label: 'Admin Panel' },
  { href: '/logout', label: 'Logout' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 h-screen p-4 sticky top-0 left-0 overflow-y-auto">
      <h2 className="text-lg font-bold mb-6">AI Event Monitor</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 ${
              pathname === link.href ? 'font-semibold bg-blue-50 dark:bg-gray-700' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}