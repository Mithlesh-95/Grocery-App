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
      <div className="min-h-screen bg-background relative">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 bg-repeat opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
        <Nav />
        <MobileNav />
        <main className="container mx-auto px-4 py-8 pt-24 relative">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;