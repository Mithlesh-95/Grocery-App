import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Utensils, Loader2, ChefHat, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import type { GroceryItem, InsertGroceryItem, Recipe } from "@shared/schema";
import InventoryItem from "@/components/inventory/inventory-item";
import RecipeCard from "@/components/recipes/recipe-card";
import { quickAdd } from "@/lib/constants";
import { z } from "zod";

const addItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  unit: z.string().optional(),
  expiryDate: z.string().optional(),
});

export default function InventoryPage() {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedQuickAdd, setSelectedQuickAdd] = useState<string | null>(null);
  const [recipeSuggestions, setRecipeSuggestions] = useState<Recipe[]>([]);
  
  const handleRecipesClick = () => {
    // Navigate to recipes page with inventory ingredients as query params
    if (items && items.length > 0) {
      const ingredientsList = items.map(item => item.name.toLowerCase()).join(',');
      navigate(`/recipes?ingredients=${encodeURIComponent(ingredientsList)}`);
    } else {
      navigate('/recipes');
    }
  };
  
  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/grocery-items"],
    queryFn: async () => {
      try {
        const response = await apiRequest<{data: GroceryItem[]}>("GET", "/api/grocery-items");
        return response.data;
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        throw error;
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async (item: InsertGroceryItem) => {
      await apiRequest("POST", "/api/grocery-items", item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grocery-items"] });
      setIsAddingItem(false);
      resetForm();
      toast({
        title: "Item added",
        description: `${name} has been added to your inventory`,
      });
    },
  });

  const resetForm = () => {
    setName("");
    setQuantity("1");
    setUnit("");
    setExpiryDate("");
    setErrorMessages({});
    setSelectedQuickAdd(null);
  };

  const handleAddItem = () => {
    try {
      const result = addItemSchema.safeParse({
        name,
        quantity: parseInt(quantity),
        unit: unit || undefined,
        expiryDate: expiryDate || undefined,
      });

      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setErrorMessages(errors);
        return;
      }

      addMutation.mutate(result.data);
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQuickAddSelect = (item: typeof quickAdd[0]) => {
    setName(item.name);
    setUnit(item.unit || "");
    setSelectedQuickAdd(item.name);
  };
  
  // Get recipe suggestions based on inventory items
  useEffect(() => {
    const fetchRecipeSuggestions = async () => {
      if (items.length > 0) {
        try {
          const ingredients = items.map(item => item.name.toLowerCase());
          const response = await apiRequest<{data: Recipe[]}>("POST", "/api/recipes/by-ingredients", { ingredients });
          
          // Sort by number of missing ingredients (ascending)
          const sortedData = [...response.data].sort((a, b) => {
            const aMissing = a.missedIngredientCount || 0;
            const bMissing = b.missedIngredientCount || 0;
            return aMissing - bMissing;
          });
          
          // Take top 4 suggestions
          setRecipeSuggestions(sortedData.slice(0, 4));
        } catch (error) {
          console.error("Error fetching recipe suggestions:", error);
        }
      } else {
        setRecipeSuggestions([]);
      }
    };
    
    fetchRecipeSuggestions();
  }, [items]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-center text-xl font-medium text-destructive">
          Failed to load inventory
        </p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/grocery-items"] })}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-4 pb-20 md:py-8">
      <div className="flex flex-col-reverse items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold md:text-3xl">Your Inventory</h1>
        <div className="flex w-full flex-wrap gap-2 md:w-auto">
          <Button
            onClick={handleRecipesClick}
            variant="outline"
            size="sm"
            className="flex-1 md:flex-none"
          >
            <ChefHat className="mr-2 h-4 w-4" />
            Recipes
          </Button>
          <Button 
            onClick={() => setIsAddingItem(true)}
            size="sm"
            className="flex-1 md:flex-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Utensils className="mb-2 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">Your inventory is empty</h3>
          <p className="mt-1 text-muted-foreground">
            Add items to keep track of what you have at home
          </p>
          <Button className="mt-4" onClick={() => setIsAddingItem(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Item
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4">
            <AnimatePresence>
              {items.map((item) => (
                <InventoryItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>
          
          {recipeSuggestions.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-semibold">Recipe Suggestions</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recipeSuggestions.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item to Inventory</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                placeholder="e.g., Tomatoes"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMessages((prev) => ({ ...prev, name: "" }));
                  setSelectedQuickAdd(null);
                }}
              />
              {errorMessages.name && (
                <p className="mt-1 text-xs text-destructive">{errorMessages.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setErrorMessages((prev) => ({ ...prev, quantity: "" }));
                  }}
                />
                {errorMessages.quantity && (
                  <p className="mt-1 text-xs text-destructive">
                    {errorMessages.quantity}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="unit">Unit (Optional)</Label>
                <Input
                  id="unit"
                  placeholder="e.g., kg, pieces"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>

            <div>
              <Label>Quick Add</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {quickAdd.map((item) => (
                  <Button
                    key={item.name}
                    type="button"
                    size="sm"
                    variant={selectedQuickAdd === item.name ? "default" : "outline"}
                    onClick={() => handleQuickAddSelect(item)}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingItem(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={addMutation.isPending}>
              {addMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Item"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}