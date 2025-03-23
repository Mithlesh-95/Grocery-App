import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, Clock, Share2, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recipe, GroceryItem } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  // Determine difficulty level based on ingredient count and cooking steps
  const getDifficultyLevel = () => {
    if (recipe.ingredients.length <= 7 && recipe.instructions.length <= 5) {
      return { level: "Easy", color: "bg-green-500/90" };
    } else if (recipe.ingredients.length <= 12 && recipe.instructions.length <= 10) {
      return { level: "Medium", color: "bg-yellow-500/90" };
    } else {
      return { level: "Advanced", color: "bg-orange-500/90" };
    }
  };
  
  const difficultyInfo = getDifficultyLevel();
  
  // Format preparation time or set a default estimate
  const prepTime = recipe.preparationTime || 
    Math.round(recipe.ingredients.length * 3 + recipe.instructions.length * 2);
  
  // Determine cuisine type based on recipe name and spices
  const getCuisineType = () => {
    const name = recipe.name.toLowerCase();
    
    if (name.includes('south') || 
        name.includes('kerala') || 
        name.includes('tamil') || 
        name.includes('andhra') || 
        name.includes('idli') || 
        name.includes('dosa')) {
      return 'South Indian';
    } else if (name.includes('north') || 
              name.includes('punjabi') || 
              name.includes('butter') || 
              name.includes('paneer') || 
              name.includes('naan')) {
      return 'North Indian';
    } else if (name.includes('east') || 
              name.includes('bengali') ||
              name.includes('oriya')) {
      return 'East Indian';
    } else if (name.includes('west') || 
              name.includes('gujarati') || 
              name.includes('maharashtrian') ||
              name.includes('dhokla')) {
      return 'West Indian';
    }
    
    return 'Indian';
  };
  
  const cuisineType = getCuisineType();
  
  // Share recipe function using Web Share API with improved mobile support
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a rich sharing message with recipe details
    const shareTitle = `${recipe.name} - ${cuisineType} Recipe`;
    const shareText = `*${recipe.name}*\n\n${recipe.description.substring(0, 150)}${recipe.description.length > 150 ? '...' : ''}\n\nPreparation time: ${prepTime} mins\nDifficulty: ${difficultyInfo.level}\n\nShared from Grocery AI`;
    
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
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-[320px] max-w-full"
      onClick={onClick}
    >
      <div 
        className="h-32 sm:h-36 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${recipe.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
            <Badge className="bg-orange-600 hover:bg-orange-700 text-xs">
              {cuisineType}
            </Badge>
            <Badge variant="outline" className="bg-black/30 border-none text-white text-xs">
              <ChefHat className="h-3 w-3 mr-1" /> {difficultyInfo.level}
            </Badge>
          </div>
          <button 
            className="absolute top-2 right-2 rounded-full p-1.5 bg-black/30 text-white hover:bg-black/50"
            onClick={handleShare}
            aria-label="Share recipe"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow">
        <CardHeader className="p-2 sm:p-3 pb-1">
          <h3 className="font-semibold truncate text-sm sm:text-base">{recipe.name}</h3>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {prepTime} mins
            </div>
            <div>{recipe.ingredients.length} ingredients</div>
          </div>
        </CardHeader>
        
        <CardContent className="p-2 sm:p-3 pt-1 flex-grow">
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
            {recipe.description}
          </p>
        </CardContent>
        
        <CardFooter className="p-2 sm:p-3 pt-1 border-t">
          <div className="w-full text-xs sm:text-sm font-medium">
            <Button
              variant="ghost"
              className="w-full justify-center bg-gray-50 hover:bg-gray-100 text-gray-800 py-1 h-8"
              onClick={(e) => {
                e.stopPropagation();
                window.open(recipe.videoUrl || `https://www.google.com/search?q=${encodeURIComponent(recipe.name + ' recipe')}`, '_blank');
              }}
            >
              View Full Recipe
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
