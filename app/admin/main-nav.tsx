"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const links = [
  {
    title: "Overview",
    href: "/admin/overview",
  },
  {
    title: "Products",
    href: "/admin/products",
  },
  {
    title: "Orders",
    href: "/admin/orders",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
];

// we want to get all attr that a normal nav element would get also in this Component we do it like this
function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      {...props} // any normal attributes that we passed into normal nav element also can pass via props into this component
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
      {links.map((link) => (
        <Link
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname.includes(link.href) ? "" : "text-muted-foreground",
          )}
          href={link.href}
          key={link.href}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}

export default MainNav;
