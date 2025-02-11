import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Apple } from "lucide-react";

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
  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden"
    >
      <div className="container flex h-16 items-center justify-center">
        <Link href="/">
          <a className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg"
            >
              <Apple className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <span className="text-xs font-medium text-muted-foreground mt-1">GroceryAI</span>
          </a>
        </Link>
      </div>
    </motion.nav>
  );
}