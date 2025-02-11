import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBasket, Refrigerator, Book } from "lucide-react";

const links = [
  { name: "Inventory", href: "/inventory", icon: Refrigerator },
  { name: "Recipes", href: "/recipes", icon: Book },
  { name: "Shopping", href: "/shopping", icon: ShoppingBasket },
];

const navVariants = {
  hidden: { y: 20, opacity: 0 },
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

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden"
    >
      <div className="container flex h-16 items-center justify-around">
        {links.map(({ name, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <a className="flex flex-col items-center space-y-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Icon
                  className={
                    location === href
                      ? "h-6 w-6 text-primary"
                      : "h-6 w-6 text-muted-foreground"
                  }
                />
                {location === href && (
                  <motion.div
                    className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                    layoutId="mobile-nav-indicator"
                    transition={{ type: "spring", bounce: 0.25 }}
                  />
                )}
              </motion.div>
              <span
                className={
                  location === href
                    ? "text-xs font-medium text-primary"
                    : "text-xs font-medium text-muted-foreground"
                }
              >
                {name}
              </span>
            </a>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}