import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type Recipe } from "@shared/schema";
import { Clock } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="aspect-video relative">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <CardHeader>
          <h3 className="text-lg font-semibold">{recipe.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {recipe.preparationTime} mins
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recipe.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
