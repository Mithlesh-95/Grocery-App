import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Building2, Refrigerator, Book, ShoppingCart, Info } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const links = [
  { name: "Inventory", href: "/inventory", icon: Refrigerator },
  { name: "Recipes", href: "/recipes", icon: Book },
  { name: "Stores", href: "/stores", icon: Building2 },
  { name: "Shopping", href: "/shopping", icon: ShoppingCart },
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
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  
  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible" 
      className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center">
        {/* Left side navigation */}
        <div className="hidden flex-1 sm:flex justify-start space-x-6">
          {links.slice(0, 2).map(({ name, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <a className="flex items-center space-x-2">
                <Icon
                  className={
                    location === href
                      ? "h-5 w-5 text-primary"
                      : "h-5 w-5 text-muted-foreground"
                  }
                />
                <span
                  className={
                    location === href
                      ? "text-sm font-medium text-primary"
                      : "text-sm font-medium text-muted-foreground"
                  }
                >
                  {name}
                </span>
              </a>
            </Link>
          ))}
        </div>

        {/* Center logo */}
        <div className="flex flex-1 justify-center">
          <Link href="/inventory">
            <a className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <ShoppingCart className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="text-lg font-bold">GroceryAI</span>
            </a>
          </Link>
        </div>

        {/* Right side navigation */}
        <div className="hidden flex-1 sm:flex justify-end space-x-6">
          {links.slice(2).map(({ name, href, icon: Icon }) => (
            <Link key={href} href={href}>
              <a className="flex items-center space-x-2">
                <Icon
                  className={
                    location === href
                      ? "h-5 w-5 text-primary"
                      : "h-5 w-5 text-muted-foreground"
                  }
                />
                <span
                  className={
                    location === href
                      ? "text-sm font-medium text-primary"
                      : "text-sm font-medium text-muted-foreground"
                  }
                >
                  {name}
                </span>
              </a>
            </Link>
          ))}
          
          {/* About Button */}
          <button 
            onClick={() => setShowAboutDialog(true)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="About"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* About Dialog */}
      <Dialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">About Grocery AI</DialogTitle>
            <DialogDescription>
              Indian grocery and recipe app
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                This app helps you manage your grocery inventory, discover Indian recipes, and create shopping lists. Designed to make cooking Indian food easier for everyone.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Team Members</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="font-medium text-sm">Mithlesh</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="font-medium text-sm">Vijay</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="font-medium text-sm">Varshith</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="font-medium text-sm">Pardhish</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Version</h3>
              <p className="text-sm text-muted-foreground">1.0.0</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setShowAboutDialog(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.nav>
  );
}