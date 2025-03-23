// @/lib/mockApi.ts
import type { ShoppingItem, InsertShoppingItem } from "./schema";
import type { GroceryItem, InsertGroceryItem } from "@shared/schema";

// Mock storage for shopping items
let shoppingItems: ShoppingItem[] = [
  {
    id: 1,
    itemName: "Milk",
    quantity: 2,
    unit: "liters",
    isPurchased: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    itemName: "Bread",
    quantity: 1,
    unit: "loaf",
    isPurchased: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextShoppingId = 3;

// Mock storage for grocery items
let groceryItems: GroceryItem[] = [];
let nextGroceryId = 1;

// Shopping List Functions
export async function getShoppingList(): Promise<ShoppingItem[]> {
  return [...shoppingItems];
}

export async function addShoppingItem(
  item: InsertShoppingItem
): Promise<ShoppingItem> {
  const newItem: ShoppingItem = {
    ...item,
    id: nextShoppingId++,
    isPurchased: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  shoppingItems.push(newItem);
  return newItem;
}

export async function updateShoppingItem(
  id: number,
  update: Partial<ShoppingItem>
): Promise<ShoppingItem> {
  const index = shoppingItems.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Item not found");
  }

  const updatedItem = {
    ...shoppingItems[index],
    ...update,
    updatedAt: new Date().toISOString(),
  };
  shoppingItems[index] = updatedItem;
  return updatedItem;
}

export async function deleteShoppingItem(id: number): Promise<void> {
  shoppingItems = shoppingItems.filter((item) => item.id !== id);
}

// Grocery Items Functions
export async function getGroceryItems(): Promise<GroceryItem[]> {
  return [...groceryItems];
}

export async function addGroceryItem(
  item: InsertGroceryItem
): Promise<GroceryItem> {
  const newItem: GroceryItem = {
    ...item,
    id: nextGroceryId++,
    createdAt: new Date().toISOString(),
  };
  groceryItems.push(newItem);
  return newItem;
}

export async function updateGroceryItem(
  id: number,
  update: Partial<GroceryItem>
): Promise<GroceryItem> {
  const index = groceryItems.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Grocery item not found");
  }

  const updatedItem = {
    ...groceryItems[index],
    ...update,
  };
  groceryItems[index] = updatedItem;
  return updatedItem;
}

export async function deleteGroceryItem(id: number): Promise<void> {
  groceryItems = groceryItems.filter((item) => item.id !== id);
}