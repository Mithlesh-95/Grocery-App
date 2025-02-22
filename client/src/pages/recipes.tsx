import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Recipe } from "@shared/schema";
import RecipeCard from "@/components/recipes/recipe-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Recipes() {
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const { data: recipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
    refetchOnWindowFocus: false,
    staleTime: 30000,
  });

  import React from 'react';

  const filteredRecipes = React.useMemo(() => {
    return recipes.filter((recipe) => {
      if (!search.trim()) return true;
      const searchTerm = search.toLowerCase().trim();
      return (
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchTerm)
        )
      );
    });
  }, [recipes, search]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
        <p className="text-muted-foreground">
          Discover recipes based on your available ingredients
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-lg bg-muted animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <Dialog
              key={recipe.id}
              open={selectedRecipe?.id === recipe.id}
              onOpenChange={(open) => setSelectedRecipe(open ? recipe : null)}
            >
              <DialogTrigger className="text-left">
                <RecipeCard recipe={recipe} />
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{recipe.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-muted-foreground">{recipe.description}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Ingredients</h3>
                    <ul className="list-inside list-disc text-muted-foreground">
                      {recipe.ingredients.map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium">Instructions</h3>
                    <ol className="list-inside list-decimal text-muted-foreground">
                      {recipe.instructions.map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                  {recipe.videoUrl && (
                    <div>
                      <h3 className="font-medium">Video Tutorial</h3>
                      <a
                        href={recipe.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Watch on YouTube
                      </a>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </motion.div>
      )}
    </div>
  );
}
