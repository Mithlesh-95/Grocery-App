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
  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible" 
      className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-center">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Apple className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="text-lg font-bold">GroceryAI</span>
          </a>
        </Link>
          </div>
    </motion.nav>
  );
}