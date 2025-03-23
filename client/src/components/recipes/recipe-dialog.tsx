import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Youtube, Clock, Check, AlertCircle, ShoppingCart, Share2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Recipe } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GroceryItem } from "@shared/schema";

interface RecipeDialogProps {
  recipe: Recipe;
}

export function RecipeDialog({ recipe }: RecipeDialogProps) {
  // Fetch inventory items
  const { data: inventoryItems = [] } = useQuery<GroceryItem[]>({
    queryKey: ["/api/grocery-items"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/grocery-items");
      if (!response.ok) return [];
      return response.data as GroceryItem[];
    },
  });
  
  // Check if an ingredient is in inventory
  const isInInventory = (ingredientName: string | undefined) => {
    if (!ingredientName) return false;
    
    return inventoryItems.some(item => 
      ingredientName.toLowerCase().includes(item.name.toLowerCase()) ||
      item.name.toLowerCase().includes(ingredientName.toLowerCase())
    );
  };
  
  // Count available and missing ingredients
  const availableCount = recipe.ingredients.filter(isInInventory).length;
  const missingCount = recipe.ingredients.length - availableCount;
  
  // Calculate recipe completeness percentage
  const completenessPercentage = Math.round((availableCount / recipe.ingredients.length) * 100);
  
  // Handle sharing the recipe with details
  const handleShareRecipe = (recipe: Recipe) => {
    // Create a rich sharing message with recipe details
    const shareTitle = `${recipe.name} - Indian Recipe`;
    const shareText = `*${recipe.name}*\n\n${recipe.description.substring(0, 200)}${recipe.description.length > 200 ? '...' : ''}\n\nPreparation time: ${recipe.preparationTime || 30} mins\n\nShared from Grocery AI`;
    
    // Check if running in Capacitor (mobile app)
    const isNative = typeof (window as any).Capacitor !== 'undefined';
    
    if (isNative) {
      // Use native sharing if available (for Capacitor/mobile apps)
      try {
        const SharePlugin = (window as any).Capacitor.Plugins.Share;
        
        SharePlugin.share({
          title: shareTitle,
          text: shareText,
          url: recipe.imageUrl, // Share the recipe image
          dialogTitle: 'Share this delicious recipe'
        });
      } catch (error) {
        console.error('Error using native share:', error);
        fallbackShare();
      }
    } else if (navigator.share) {
      // Use Web Share API for browsers that support it
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: recipe.shareUrl || window.location.href
      })
      .catch(error => {
        console.log('Error sharing:', error);
        fallbackShare();
      });
    } else {
      fallbackShare();
    }
    
    // Fallback sharing method
    function fallbackShare() {
      // Try to open WhatsApp directly if on mobile
      const isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
      if (isMobile) {
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        // Desktop fallback
        navigator.clipboard.writeText(shareText);
        alert('Recipe details copied to clipboard!');
      }
    }
  };

  return (
    <DialogContent className="max-w-[95vw] sm:max-w-4xl h-[90vh] p-0">
      <ScrollArea className="h-full">
        <div className="p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">{recipe.name}</DialogTitle>
            <div className="flex items-center gap-2 mt-1">
              {recipe.preparationTime && (
                <DialogDescription className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Preparation time: {recipe.preparationTime} minutes</span>
                </DialogDescription>
              )}
            </div>
          </DialogHeader>
          
          <div className="grid gap-4 sm:gap-6 py-4">
            {recipe.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg relative">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="h-full w-full object-cover"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-2 right-2 bg-black/30 text-white border-none hover:bg-black/50"
                  onClick={() => handleShareRecipe(recipe)}
                  aria-label="Share recipe"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            )}
            
            {/* Recipe completeness indicator */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm sm:text-base">Recipe Completeness</h3>
                <Badge variant="outline" className={completenessPercentage >= 80 ? "bg-green-100" : "bg-yellow-100"}>
                  {completenessPercentage}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    completenessPercentage >= 80 ? "bg-green-500" : 
                    completenessPercentage >= 50 ? "bg-yellow-500" : "bg-orange-500"
                  }`} 
                  style={{ width: `${completenessPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600">
                <span>{availableCount} available</span>
                <span>{missingCount} missing</span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-medium text-sm sm:text-base mb-2">Description</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{recipe.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm sm:text-base mb-2">Ingredients</h3>
                <div className="p-3 sm:p-4 bg-orange-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-orange-800 mb-2">
                    To see this recipe's detailed ingredients:
                  </p>
                  <Button
                    variant="outline"
                    className="w-full bg-white h-9 sm:h-10 text-xs sm:text-sm"
                    onClick={() => window.open(recipe.videoUrl || `https://www.google.com/search?q=${encodeURIComponent(recipe.name + ' recipe')}`, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Search for Full Recipe
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-sm sm:text-base mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 sm:space-y-3">
                  {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
                    recipe.instructions.map((instruction, index) => (
                      <li key={index} className="text-xs sm:text-sm pl-2 py-1 rounded hover:bg-gray-50">
                        {typeof instruction === 'string' ? instruction : 'Missing instruction'}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs sm:text-sm pl-2 py-1 text-muted-foreground">
                      Instructions not available. Please check the recipe video for guidance.
                    </li>
                  )}
                </ol>
              </div>

              {recipe.videoUrl && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                    onClick={() => window.open(recipe.videoUrl, '_blank')}
                  >
                    <Youtube className="mr-2 h-4 w-4" />
                    Watch Video Tutorial
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  );
} 