import { Link } from "wouter";
import { motion } from "framer-motion";
import { Home, ShoppingCart, Package, UtensilsCrossed } from "lucide-react";

interface NavItem {
  href: string;
  icon: JSX.Element;
  label: string;
}

const navItems: NavItem[] = [
  {
    href: "/",
    icon: <Home className="h-4 w-4" />,
    label: "Home"
  },
  {
    href: "/shopping",
    icon: <ShoppingCart className="h-4 w-4" />,
    label: "Shopping"
  },
  {
    href: "/inventory",
    icon: <Package className="h-4 w-4" />,
    label: "Inventory"
  },
  {
    href: "/recipes",
    icon: <UtensilsCrossed className="h-4 w-4" />,
    label: "Recipes"
  }
];

export default function Nav() {
  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-sm"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-around">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer">
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
} 