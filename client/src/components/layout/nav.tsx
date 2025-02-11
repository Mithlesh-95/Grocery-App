import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShoppingBasket, Refrigerator, Book } from "lucide-react";

const links = [
  { name: "Inventory", href: "/inventory", icon: Refrigerator },
  { name: "Recipes", href: "/recipes", icon: Book },
  { name: "Shopping List", href: "/shopping", icon: ShoppingBasket },
];

export default function Nav() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 z-50 hidden w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:block">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center space-x-2">
          <ShoppingBasket className="h-6 w-6" />
          <span className="text-lg font-bold">GroceryAI</span>
        </div>
        <div className="flex space-x-4">
          {links.map(({ name, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <a
                className={cn(
                  "relative flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                  location === href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{name}</span>
                {location === href && (
                  <motion.div
                    className="absolute inset-x-0 -bottom-px h-px bg-primary"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", bounce: 0.25 }}
                  />
                )}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
