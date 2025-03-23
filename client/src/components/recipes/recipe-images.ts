// Mapping of recipe names to curated food images from Unsplash
const recipeImages: Record<string, string> = {
  // South Indian Dishes
  'Idli': 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=800&auto=format&fit=crop',
  'Dosa': 'https://images.unsplash.com/photo-1630383249896-696899f31144?w=800&auto=format&fit=crop',
  'Upma': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
  'Uttapam': 'https://images.unsplash.com/photo-1630383249974-c11661b54388?w=800&auto=format&fit=crop',
  'Pesarattu': 'https://images.unsplash.com/photo-1667480681678-8314df20f8c3?w=800&auto=format&fit=crop',
  
  // North Indian Dishes
  'Butter Chicken': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop',
  'Paneer Tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop',
  'Dal Makhani': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
  'Naan': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
  
  // Chinese Dishes
  'Fried Rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop',
  'Noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop',
  'Manchurian': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=800&auto=format&fit=crop',
  
  // Default fallback images for different categories
  'default_breakfast': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop',
  'default_lunch': 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=800&auto=format&fit=crop',
  'default_dinner': 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=800&auto=format&fit=crop',
  'default_snack': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'
};

// Function to get image URL for a recipe
export function getRecipeImage(recipeName: string): string {
  return recipeImages[recipeName] || recipeImages['default'];
}

export default recipeImages; 