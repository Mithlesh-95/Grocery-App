import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/recipes/recipe-card";
import { RecipeDialog } from "@/components/recipes/recipe-dialog";
import { CacheStatus } from "@/components/recipes/cache-status";
import { searchRecipes, getRecipesByIngredients, type SearchResult } from "@/services/recipe-service";
import type { Recipe } from "@shared/schema";
import { useLocation } from "wouter";

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isIngredientMode, setIsIngredientMode] = useState(false);
  const [location, navigate] = useLocation();
  
  // Parse ingredients from URL query parameters
  useEffect(() => {
    const url = new URL(window.location.href);
    const ingredientsParam = url.searchParams.get('ingredients');
    
    if (ingredientsParam) {
      const ingredientsList = ingredientsParam.split(',').map(i => i.trim());
      setIngredients(ingredientsList);
      setIsIngredientMode(true);
    }
  }, [location]);

  // Query for ingredient-based recipes
  const { 
    data: ingredientRecipes = [],
    isLoading: isLoadingIngredients,
  } = useQuery<Recipe[]>({
    queryKey: ["recipes-by-ingredients", ingredients.join(',')],
    queryFn: () => getRecipesByIngredients(ingredients),
    enabled: isIngredientMode && ingredients.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Standard search query
  const { 
    data: searchResult, 
    isLoading: isLoadingSearch, 
    refetch 
  } = useQuery<SearchResult>({
    queryKey: ["recipes", searchQuery],
    queryFn: () => searchRecipes(searchQuery),
    enabled: !isIngredientMode && searchQuery.length >= 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const recipes = isIngredientMode ? ingredientRecipes : (searchResult?.recipes || []);
  const metadata = searchResult?.metadata;
  const hasSearched = !isIngredientMode && searchQuery.length >= 3;
  const isLoading = isIngredientMode ? isLoadingIngredients : isLoadingSearch;

  const handleClearCache = () => {
    console.log('Clearing cache and refetching...');
    refetch();
  };
  
  const handleBackToSearch = () => {
    setIsIngredientMode(false);
    setIngredients([]);
    navigate('/recipes', { replace: true });
  };

  return (
    <div className="container h-[calc(100vh-4rem)] flex flex-col py-6">
      <div className="flex flex-col gap-4 flex-none">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Indian Recipes</h1>
          {isIngredientMode && (
            <Button variant="ghost" onClick={handleBackToSearch}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          )}
        </div>
        
        {isIngredientMode ? (
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium">Showing recipes based on your ingredients:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {ingredients.map((ing, i) => (
                <span key={i} className="px-2 py-1 bg-background rounded-full text-xs">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-auto py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isIngredientMode && ingredients.length > 0 && recipes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recipes found with your ingredients. Try adding more ingredients to your inventory.
          </div>
        ) : !isIngredientMode && !hasSearched ? (
          <div className="text-center py-8 text-muted-foreground">
            Enter at least 3 characters to search for recipes
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {metadata?.isOffline 
              ? "You're offline. No cached recipes found for this search."
              : "No recipes found. Try a different search term."}
          </div>
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </motion.div>
        )}
      </div>

      <Dialog open={selectedRecipe !== null} onOpenChange={() => setSelectedRecipe(null)}>
        {selectedRecipe && <RecipeDialog recipe={selectedRecipe} />}
      </Dialog>
    </div>
  );
}
