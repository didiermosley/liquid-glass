"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CSSGlass } from "@/components/CSSGlass";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/playground", label: "Lens" },
  { href: "/components", label: "UI" },
  { href: "/cards", label: "Cards" },
  { href: "/css", label: "CSS" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <CSSGlass radius={999} blur={14} tint={0.1} specular={false} className="flex gap-1 p-1.5 text-sm font-medium">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${path === href ? "bg-white/30" : "hover:bg-white/15"}`}
          >
            {label}
          </Link>
        ))}
      </CSSGlass>
    </nav>
  );
}
