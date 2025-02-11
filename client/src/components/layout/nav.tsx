import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ShoppingBasket, Refrigerator, Book, Apple } from "lucide-react";

const links = [
  { name: "Inventory", href: "/inventory", icon: Refrigerator },
  { name: "Recipes", href: "/recipes", icon: Book },
  { name: "Shopping List", href: "/shopping", icon: ShoppingBasket },
];

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

export default function Nav() {
  const [location] = useLocation();

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible" 
      className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:block"
    >
      <div className="container flex h-16 items-center">
        <Link href="/">
          <a className="mr-8 flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Apple className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-lg font-bold">GroceryAI</span>
          </a>
        </Link>
        <div className="flex space-x-4">
          {links.map(({ name, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <a
                className={cn(
                  "group relative flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                  location === href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
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
    </motion.nav>
  );
}