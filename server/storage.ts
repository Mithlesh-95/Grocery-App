import {
  type GroceryItem,
  type Recipe,
  type ShoppingItem,
  type InsertGroceryItem,
  type InsertRecipe,
  type InsertShoppingItem,
} from "@shared/schema";

export interface IStorage {
  getGroceryItems(): Promise<GroceryItem[]>;
  getGroceryItem(id: number): Promise<GroceryItem | undefined>;
  createGroceryItem(item: InsertGroceryItem): Promise<GroceryItem>;
  updateGroceryItem(id: number, item: Partial<InsertGroceryItem>): Promise<GroceryItem | undefined>;
  deleteGroceryItem(id: number): Promise<void>;

  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;

  getShoppingList(): Promise<ShoppingItem[]>;
  createShoppingItem(item: InsertShoppingItem): Promise<ShoppingItem>;
  updateShoppingItem(id: number, item: Partial<InsertShoppingItem>): Promise<ShoppingItem | undefined>;
  deleteShoppingItem(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private groceryItems: Map<number, GroceryItem>;
  private recipes: Map<number, Recipe>;
  private shoppingItems: Map<number, ShoppingItem>;
  private currentIds: { groceryItems: number; recipes: number; shoppingItems: number };

  constructor() {
    this.groceryItems = new Map();
    this.recipes = new Map();
    this.shoppingItems = new Map();
    this.currentIds = { groceryItems: 1, recipes: 1, shoppingItems: 1 };

    this.initializeSampleData();
  }

  private async initializeSampleData() {
    const { indianRecipes } = await import("./recipes-data.js");
    const sampleRecipes: InsertRecipe[] = indianRecipes;

    for (const recipe of sampleRecipes) {
      await this.createRecipe(recipe);
    }
  }

  // Grocery Items
  async getGroceryItems(): Promise<GroceryItem[]> {
    return Array.from(this.groceryItems.values());
  }

  async getGroceryItem(id: number): Promise<GroceryItem | undefined> {
    return this.groceryItems.get(id);
  }

  async createGroceryItem(item: InsertGroceryItem): Promise<GroceryItem> {
    const id = this.currentIds.groceryItems++;
    const newItem: GroceryItem = {
      ...item,
      id,
      notificationSent: false, // Explicitly set default
      lowStockThreshold: item.lowStockThreshold ?? null,
      notes: item.notes ?? null,
    };
    this.groceryItems.set(id, newItem);
    return newItem;
  }

  async updateGroceryItem(id: number, item: Partial<InsertGroceryItem>): Promise<GroceryItem | undefined> {
    const existingItem = this.groceryItems.get(id);
    if (!existingItem) return undefined;

    const updatedItem: GroceryItem = {
      ...existingItem,
      ...item,
      notificationSent: existingItem.notificationSent, // Preserve unless explicitly updated
    };
    this.groceryItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteGroceryItem(id: number): Promise<void> {
    this.groceryItems.delete(id);
  }

  // Recipes
  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const id = this.currentIds.recipes++;
    const newRecipe: Recipe = { ...recipe, id };
    this.recipes.set(id, newRecipe);
    return newRecipe;
  }

  // Shopping List
  async getShoppingList(): Promise<ShoppingItem[]> {
    return Array.from(this.shoppingItems.values());
  }

  async createShoppingItem(item: InsertShoppingItem): Promise<ShoppingItem> {
    const id = this.currentIds.shoppingItems++;
    const newItem: ShoppingItem = { ...item, id };
    this.shoppingItems.set(id, newItem);
    return newItem;
  }

  async updateShoppingItem(id: number, item: Partial<InsertShoppingItem>): Promise<ShoppingItem | undefined> {
    const existingItem = this.shoppingItems.get(id);
    if (!existingItem) return undefined;

    const updatedItem: ShoppingItem = { ...existingItem, ...item };
    this.shoppingItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteShoppingItem(id: number): Promise<void> {
    this.shoppingItems.delete(id);
  }
}

export const storage = new MemStorage();