import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Nav from "@/components/layout/nav";
import MobileNav from "@/components/layout/mobile-nav";
import Inventory from "@/pages/inventory";
import Recipes from "@/pages/recipes";
import Shopping from "@/pages/shopping";
import { AnimatePresence } from "framer-motion";
import GroceryLoader from "@/components/grocery-loader";
import { useEffect, useState } from "react";

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Inventory} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/recipes" component={Recipes} />
        <Route path="/shopping" component={Shopping} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <GroceryLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Nav />
        <MobileNav />
        <main className="container mx-auto px-4 py-8 pt-24">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
