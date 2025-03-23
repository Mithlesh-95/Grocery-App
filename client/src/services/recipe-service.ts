import type { Recipe } from "@shared/schema";

// Get API key from environment variables
const SPOONACULAR_API_KEY = '33e300042f0d40bf94fb2af219a4a8f9';
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Validate API key
if (!SPOONACULAR_API_KEY) {
  console.error('Spoonacular API key is not set.');
}

// Function to validate API key before making requests
function validateApiKey(): boolean {
  if (!SPOONACULAR_API_KEY) {
    console.error('API key is not set.');
    return false;
  }
  return true;
}

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: {
    name: string;
    amount: number;
    unit: string;
    original?: string;
    originalString?: string;
    originalName?: string;
  }[];
  usedIngredients: {
    name: string;
    amount: number;
    unit: string;
    original?: string;
    originalString?: string;
    originalName?: string;
  }[];
  extendedIngredients?: {
    id: number;
    name: string;
    amount: number;
    unit: string;
    original?: string;
    originalString?: string;
    originalName?: string;
  }[];
  readyInMinutes?: number;
  preparationMinutes?: number;
  summary: string;
  instructions?: string;
  analyzedInstructions: {
    steps: {
      number: number;
      step: string;
      ingredients: { name: string }[];
      equipment?: { name: string }[];
      length?: { number: number; unit: string };
    }[];
  }[];
  cuisines?: string[];
  videoUrl?: string;
  videoId?: string;
}

interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

// Handle API response and check for errors
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      url: response.url.replace(SPOONACULAR_API_KEY, '[HIDDEN]')
    });

    if (response.status === 401) {
      throw new Error('API key is invalid');
    }
    if (response.status === 402) {
      throw new Error('Daily API quota exceeded');
    }
    throw new Error(`API request failed: ${response.statusText}`);
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error parsing API response:', error);
    throw new Error('Failed to parse API response');
  }
}

export async function searchRecipeImage(recipeName: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(recipeName)}&number=1`
    );
    const data = await handleApiResponse(response);
    
    if (data.results && data.results.length > 0) {
      return data.results[0].image;
    }
    return null;
  } catch (error) {
    console.error('Error fetching recipe image:', error);
    return null;
  }
}

// Function to fetch YouTube video for a recipe
async function fetchRecipeVideo(recipeName: string): Promise<string | null> {
  try {
    const searchQuery = `${recipeName} recipe indian cooking`;
    const response = await fetch(
      `${BASE_URL}/videos/search?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(searchQuery)}&number=1&type=video`
    );
    const data = await handleApiResponse(response);
    
    if (data.videos && data.videos.length > 0) {
      const videoId = data.videos[0].youTubeId;
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return null;
  } catch (error) {
    console.error('Error fetching recipe video:', error);
    return null;
  }
}

// Function to fetch detailed recipe instructions
async function fetchDetailedInstructions(recipeId: number): Promise<SpoonacularRecipe['analyzedInstructions']> {
  try {
    const response = await fetch(
      `${BASE_URL}/${recipeId}/analyzedInstructions?apiKey=${SPOONACULAR_API_KEY}&stepBreakdown=true`
    );
    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error('Error fetching detailed instructions:', error);
    return [];
  }
}

// Convert Spoonacular recipe to our app's Recipe type
function convertSpoonacularRecipe(recipe: SpoonacularRecipe): Recipe {
  // Validate the recipe has the required properties
  if (!recipe || typeof recipe !== 'object') {
    console.error('Invalid recipe object received:', recipe);
    return createFallbackRecipe();
  }
  
  if (!recipe.id || !recipe.title) {
    console.error('Recipe missing required id or title:', recipe);
    return createFallbackRecipe();
  }
  
  // Handle extendedIngredients if present - this is a more reliable source of ingredient data
  const processedIngredients = extractIngredients(recipe);

  // Strip HTML tags from summary
  const stripHtml = (html: string) => {
    if (!html) return '';
    try {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    } catch (error) {
      console.error('Error stripping HTML:', error);
      return '';
    }
  };

  // Creates a simple fallback recipe when API data is invalid
  function createFallbackRecipe(): Recipe {
    return {
      id: Math.floor(Math.random() * 10000) + 2000,
      name: "Simple Dal",
      description: "A basic Indian lentil dish that's easy to prepare.",
      ingredients: [
        "1 cup Red lentils (masoor dal)",
        "1 Onion, chopped",
        "2 cloves Garlic, minced",
        "1 tsp Turmeric powder",
        "1 tsp Cumin powder",
        "Salt to taste",
        "2 cups Water",
        "Fresh cilantro for garnish"
      ],
      instructions: [
        "1. Rinse lentils thoroughly.",
        "2. In a pot, combine lentils with water, turmeric and salt.",
        "3. Bring to a boil, then simmer until soft (about 20 minutes).",
        "4. In a separate pan, sauté onions and garlic until golden.",
        "5. Add cumin powder and cook for 30 seconds.",
        "6. Add the onion mixture to the cooked lentils and mix well.",
        "7. Garnish with fresh cilantro before serving."
      ],
      imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop",
      preparationTime: 30,
      missedIngredients: ["Red lentils", "Turmeric powder"]
    };
  }

  // Enhanced instruction formatting with equipment and timing
  const formatInstructions = (recipe: SpoonacularRecipe): string[] => {
    if (recipe.analyzedInstructions?.[0]?.steps) {
      return recipe.analyzedInstructions[0].steps.map(step => {
        let instruction = `${step.step}`;
        
        // Add equipment information if available
        if (step.equipment?.length > 0) {
          const equipment = step.equipment.map(e => e.name).join(', ');
          instruction += ` (Equipment needed: ${equipment})`;
        }
        
        // Add timing information if available
        if (step.length?.number) {
          instruction += ` (${step.length.number} ${step.length.unit})`;
        }
        
        return instruction;
      });
    }
    
    // Fallback to text instructions if analyzed instructions are not available
    if (typeof recipe.instructions === 'string' && recipe.instructions.length > 0) {
      return recipe.instructions
        .split(/\n|\.|;/)  // Split by newline, period, or semicolon
        .map(step => step.trim())
        .filter(step => step.length > 0)
        .map((step, index) => {
          // Add step numbers for clarity
          return `${index + 1}. ${step}${step.endsWith('.') ? '' : '.'}`;
        });
    }
    
    return ['Instructions not available. Please check the recipe video for guidance.'];
  };

  // Extract ingredients correctly from API responses
  function extractIngredients(recipe: any): string[] {
    console.log("Extracting ingredients from recipe:", recipe.id || "unknown");

    // First try to use extendedIngredients if they're available (most complete information)
    if (recipe.extendedIngredients && Array.isArray(recipe.extendedIngredients) && recipe.extendedIngredients.length > 0) {
      console.log("Using extendedIngredients for recipe:", recipe.id);
      return recipe.extendedIngredients.map((ingredient: any) => {
        if (ingredient.original) {
          return ingredient.original;
        } else if (ingredient.originalString) {
          return ingredient.originalString;
        } else {
          // Fallback to constructing from parts
          return `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name || ''}`.trim();
        }
      });
    }

    // Next, try to use missedIngredients and usedIngredients
    const combined = [
      ...(recipe.missedIngredients || []),
      ...(recipe.usedIngredients || [])
    ];

    if (combined.length > 0) {
      console.log("Using missedIngredients/usedIngredients for recipe:", recipe.id);
      return combined.map((ingredient: any) => {
        if (ingredient.original) {
          return ingredient.original;
        } else if (ingredient.originalString) {
          return ingredient.originalString;
        } else {
          // Fallback to constructing from parts
          return `${ingredient.amount || ''} ${ingredient.unit || ''} ${ingredient.name || ''}`.trim();
        }
      });
    }

    // Last resort: if there's an ingredients array already
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      console.log("Using existing ingredients array for recipe:", recipe.id);
      return recipe.ingredients;
    }

    console.log("No ingredients found for recipe:", recipe.id);
    return ["Ingredients information not available"];
  }

  return {
    id: recipe.id,
    name: recipe.title,
    description: stripHtml(recipe.summary || ''),
    imageUrl: recipe.image,
    ingredients: processedIngredients,
    instructions: formatInstructions(recipe),
    videoUrl: recipe.videoUrl || null,
    preparationTime: recipe.readyInMinutes || recipe.preparationMinutes || null,
    shareUrl: `${window.location.origin}/recipe/${recipe.id}`,
    missedIngredients: (recipe.missedIngredients || [])
      .map(i => (i && typeof i === 'object' && (i.name || i.originalName)) 
        ? (i.name || i.originalName) 
        : null)
      .filter(Boolean) as string[]
  };
}

// Cache and API tracking configuration
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEY_RECIPES = 'cached_recipes';
const CACHE_KEY_TIMESTAMP = 'recipes_cache_timestamp';
const CACHE_KEY_API_POINTS = 'api_points_remaining';
const MAX_DAILY_POINTS = 150;

interface CacheMetadata {
  timestamp: number;
  isOffline: boolean;
  apiPointsRemaining: number;
}

export interface SearchResult {
  recipes: Recipe[];
  metadata: {
    fromCache: boolean;
    lastUpdated: string;
    apiPointsRemaining: number;
    isOffline: boolean;
    error?: string;
  };
}

// Track API points usage
let apiPointsRemaining = Number(localStorage.getItem(CACHE_KEY_API_POINTS)) || MAX_DAILY_POINTS;

function updateApiPoints(pointsUsed: number) {
  apiPointsRemaining = Math.max(0, apiPointsRemaining - pointsUsed);
  localStorage.setItem(CACHE_KEY_API_POINTS, apiPointsRemaining.toString());
  return apiPointsRemaining;
}

// Reset API points at midnight
function resetApiPointsIfNeeded() {
  const lastResetDate = localStorage.getItem('last_points_reset_date');
  const today = new Date().toDateString();
  
  if (lastResetDate !== today) {
    apiPointsRemaining = MAX_DAILY_POINTS;
    localStorage.setItem(CACHE_KEY_API_POINTS, apiPointsRemaining.toString());
    localStorage.setItem('last_points_reset_date', today);
  }
}

// Enhanced cache management
function saveToCache(recipes: Recipe[], query: string, metadata: CacheMetadata) {
  try {
    const cacheData = {
      query,
      recipes,
      metadata
    };
    localStorage.setItem(CACHE_KEY_RECIPES, JSON.stringify(cacheData));
    localStorage.setItem(CACHE_KEY_TIMESTAMP, metadata.timestamp.toString());
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

function getFromCache(query: string): SearchResult | null {
  try {
    const cacheData = localStorage.getItem(CACHE_KEY_RECIPES);
    const timestamp = Number(localStorage.getItem(CACHE_KEY_TIMESTAMP));
    
    if (!cacheData || !timestamp) return null;
    
    // Check if cache is still valid
    if (Date.now() - timestamp > CACHE_DURATION) {
      clearCache();
      return null;
    }
    
    const { query: cachedQuery, recipes, metadata } = JSON.parse(cacheData);
    
    // Only return cache if the query matches
    if (query.toLowerCase() === cachedQuery.toLowerCase()) {
      return {
        recipes,
        metadata: {
          fromCache: true,
          lastUpdated: new Date(timestamp).toLocaleString(),
          apiPointsRemaining,
          isOffline: metadata.isOffline
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

// Clear cache function
export function clearCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY_RECIPES);
    localStorage.removeItem(CACHE_KEY_TIMESTAMP);
    console.log('Cache cleared successfully');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

// Check if we're offline
export function isOffline(): boolean {
  return !navigator.onLine;
}

// Updated search function with better error handling
export async function searchRecipes(query: string): Promise<SearchResult> {
  resetApiPointsIfNeeded();
  
  if (!validateApiKey()) {
    console.error('Search failed: Missing API key');
    return { 
      recipes: [], 
      metadata: { 
        fromCache: false, 
        lastUpdated: '', 
        apiPointsRemaining, 
        isOffline: isOffline(),
        error: 'API key not configured'
      } 
    };
  }
  
  if (!query || query.length < 3) {
    return { 
      recipes: [], 
      metadata: { 
        fromCache: false, 
        lastUpdated: '', 
        apiPointsRemaining, 
        isOffline: isOffline() 
      } 
    };
  }

  // Check cache first
  const cachedResults = getFromCache(query);
  if (cachedResults) {
    console.log('Returning cached results for:', query);
    return cachedResults;
  }

  try {
    console.log('Fetching recipes for query:', query);
    const url = `${BASE_URL}/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(query)}&number=6&addRecipeInformation=true&instructionsRequired=true&fillIngredients=true`;
    
    console.log('Making API request to:', url.replace(SPOONACULAR_API_KEY, '[HIDDEN]'));
    const response = await fetch(url);
    const data = await handleApiResponse(response);

    console.log('API Response:', {
      totalResults: data.totalResults,
      number: data.number,
      offset: data.offset
    });

    if (!data.results || data.results.length === 0) {
      console.log('No recipes found for query:', query);
      return { 
        recipes: [], 
        metadata: { 
          fromCache: false, 
          lastUpdated: new Date().toLocaleString(), 
          apiPointsRemaining,
          isOffline: false
        } 
      };
    }

    const recipes = await Promise.all(data.results.map(async (recipe: SpoonacularRecipe) => {
      console.log('Processing recipe:', recipe.title);
      return convertSpoonacularRecipe(recipe);
    }));

    const metadata: CacheMetadata = {
      timestamp: Date.now(),
      isOffline: false,
      apiPointsRemaining
    };

    // Save to cache
    saveToCache(recipes, query, metadata);
    
    return {
      recipes,
      metadata: {
        fromCache: false,
        lastUpdated: new Date().toLocaleString(),
        apiPointsRemaining,
        isOffline: false
      }
    };
  } catch (error) {
    console.error('Error in searchRecipes:', error);
    
    return { 
      recipes: [], 
      metadata: { 
        fromCache: false, 
        lastUpdated: '', 
        apiPointsRemaining,
        isOffline: isOffline(),
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      } 
    };
  }
}

// Optimized ingredients search
export async function getRecipesByIngredients(ingredients: string[]): Promise<Recipe[]> {
  if (!ingredients || ingredients.length === 0) {
    return [];
  }

  try {
    // First check if we have connectivity
    if (isOffline()) {
      console.log('Using local recipes due to offline status');
      return fallbackToLocalRecipes('offline');
    }

    if (!validateApiKey()) {
      console.log('Using local recipes due to missing API key');
      return fallbackToLocalRecipes('no_api_key');
    }

    console.log(`Fetching recipes by ingredients: ${ingredients.join(', ')}`);
    const query = ingredients.join(',+');
    const apiUrl = `${BASE_URL}/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${encodeURIComponent(query)}&number=10&ranking=2&ignorePantry=false`;
    
    const response = await fetch(apiUrl);
    const recipes = await handleApiResponse(response);
    
    if (!recipes || !Array.isArray(recipes) || recipes.length === 0) {
      console.log('No recipes found, using fallback recipes');
      return fallbackToLocalRecipes('no_results');
    }
    
    // Update API points counter
    updateApiPoints(1);
    
    // Convert Spoonacular recipes to our format
    const convertedRecipes = await Promise.all(
      recipes.map(async (recipe: SpoonacularRecipe) => {
        // For each recipe ID, fetch detailed information
        try {
          const detailResponse = await fetch(
            `${BASE_URL}/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=false`
          );
          const detailData = await handleApiResponse(detailResponse);
          
          // Merge the detailed data with our recipe
          const fullRecipe = { ...recipe, ...detailData };
          return convertSpoonacularRecipe(fullRecipe);
        } catch (error) {
          console.error(`Error fetching details for recipe ${recipe.id}:`, error);
          return convertSpoonacularRecipe(recipe);
        }
      })
    );
    
    return convertedRecipes;
  } catch (error) {
    console.error('Error finding recipes by ingredients:', error);
    return fallbackToLocalRecipes('api_error');
  }
}

// Get nutritional information for a recipe
export async function getNutritionInfo(recipeName: string): Promise<NutritionInfo | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/guessNutrition?apiKey=${SPOONACULAR_API_KEY}&title=${encodeURIComponent(recipeName)}`
    );
    const data = await handleApiResponse(response);
    
    if (data && data.calories) {
      return {
        calories: `${Math.round(data.calories.value)}${data.calories.unit}`,
        protein: `${Math.round(data.protein.value)}${data.protein.unit}`,
        carbs: `${Math.round(data.carbs.value)}${data.carbs.unit}`,
        fat: `${Math.round(data.fat.value)}${data.fat.unit}`,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching nutrition info:', error);
    return null;
  }
}

// Cache for storing recipe images to avoid repeated API calls
const imageCache: Record<string, string> = {};

export async function getRecipeImageWithFallback(recipeName: string, fallbackUrl: string): Promise<string> {
  // Check cache first
  if (imageCache[recipeName]) {
    return imageCache[recipeName];
  }

  try {
    const spoonacularImage = await searchRecipeImage(recipeName);
    if (spoonacularImage) {
      // Store in cache
      imageCache[recipeName] = spoonacularImage;
      return spoonacularImage;
    }
  } catch (error) {
    console.error('Error in getRecipeImageWithFallback:', error);
  }

  return fallbackUrl;
}

// Fallback to local recipes if API unavailable
const fallbackToLocalRecipes = (reason: string): Recipe[] => {
  console.log(`Using local recipes: ${reason}`);
  return [
    {
      id: 1001,
      name: "Butter Chicken",
      description: "Creamy and rich North Indian curry with tender chicken pieces.",
      ingredients: [
        "1 lb Chicken",
        "2 tbsp Butter",
        "1 Onion",
        "2 cloves Garlic",
        "1 inch Ginger",
        "2 tbsp Tomato paste",
        "1 cup Heavy cream",
        "1 tbsp Garam masala",
        "1 tsp Turmeric"
      ],
      instructions: [
        "1. Marinate chicken in yogurt and spices.",
        "2. Sauté onions, garlic and ginger.",
        "3. Add tomato paste and spices.",
        "4. Add chicken and simmer.",
        "5. Finish with cream and butter."
      ],
      imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop",
      preparationTime: 45,
      missedIngredients: ["Heavy cream", "Butter"]
    },
    {
      id: 1002,
      name: "Chana Masala",
      description: "Spicy chickpea curry that's a popular vegetarian dish across India.",
      ingredients: [
        "2 cans Chickpeas",
        "1 Onion",
        "2 Tomatoes",
        "2 cloves Garlic",
        "1 inch Ginger",
        "1 tsp Cumin seeds",
        "1 tsp Coriander powder",
        "1/2 tsp Turmeric",
        "1 tsp Garam masala",
        "Fresh cilantro"
      ],
      instructions: [
        "1. Sauté cumin seeds in oil.",
        "2. Add chopped onions, garlic and ginger.",
        "3. Add spices and tomatoes.",
        "4. Add chickpeas and simmer.",
        "5. Garnish with fresh cilantro."
      ],
      imageUrl: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&auto=format&fit=crop",
      preparationTime: 30,
      missedIngredients: ["Chickpeas", "Coriander powder"]
    },
    {
      id: 1003,
      name: "Vegetable Biryani",
      description: "Fragrant rice dish with mixed vegetables and aromatic spices.",
      ingredients: [
        "2 cups Basmati rice",
        "2 cups Mixed vegetables",
        "1 Onion",
        "2 cloves Garlic",
        "1 inch Ginger",
        "1 tsp Cumin seeds",
        "1 Bay leaf",
        "3 Cardamom pods",
        "1 Cinnamon stick",
        "1/2 tsp Turmeric",
        "1 tsp Garam masala"
      ],
      instructions: [
        "1. Soak rice for 30 minutes and drain.",
        "2. Sauté spices in oil until fragrant.",
        "3. Add vegetables and cook for 5 minutes.",
        "4. Layer rice and vegetables in a pot.",
        "5. Add water and cook until rice is done."
      ],
      imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop",
      preparationTime: 50,
      missedIngredients: ["Basmati rice", "Bay leaf"]
    }
  ];
}; 