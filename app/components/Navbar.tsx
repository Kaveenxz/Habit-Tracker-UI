"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, Plus, Settings } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/habits", icon: ListChecks, label: "Habits" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <link.icon className="h-5 w-5 mr-2" />
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navActive"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}