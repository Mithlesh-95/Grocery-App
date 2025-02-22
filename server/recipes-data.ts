
import { type InsertRecipe } from "@shared/schema";

export const indianRecipes: InsertRecipe[] = [
  {
    name: "Butter Chicken",
    description: "Creamy and rich Indian curry with tender chicken pieces",
    ingredients: [
      "800g chicken thighs, cut into pieces",
      "2 cups tomato puree",
      "1 cup heavy cream",
      "2 tbsp butter",
      "2 tbsp garam masala",
      "2 tsp red chili powder",
      "2 tbsp ginger-garlic paste",
      "Salt to taste"
    ],
    instructions: [
      "Marinate chicken with yogurt and spices for 2 hours",
      "Cook marinated chicken in butter until golden",
      "Add tomato puree and simmer for 15 minutes",
      "Add cream and simmer for 10 more minutes",
      "Garnish with butter and cream"
    ],
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
    videoUrl: "https://www.youtube.com/watch?v=a03U45jFxOI",
    preparationTime: 60
  },
  {
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese cubes in spiced tomato gravy",
    ingredients: [
      "500g paneer, cubed",
      "2 cups tomato puree",
      "1 cup cream",
      "2 onions, finely chopped",
      "2 tbsp tikka masala",
      "1 tsp turmeric powder",
      "Salt to taste"
    ],
    instructions: [
      "Marinate paneer with spices and yogurt",
      "Grill paneer until charred",
      "Make gravy with tomatoes and spices",
      "Add grilled paneer to the gravy",
      "Finish with cream"
    ],
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7",
    videoUrl: "https://www.youtube.com/watch?v=_BXB2g7r4Ho",
    preparationTime: 45
  }
];
