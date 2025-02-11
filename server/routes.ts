import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGroceryItemSchema, insertShoppingItemSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Grocery Items
  app.get("/api/grocery-items", async (_req, res) => {
    const items = await storage.getGroceryItems();
    res.json(items);
  });

  app.post("/api/grocery-items", async (req, res) => {
    try {
      const item = insertGroceryItemSchema.parse(req.body);
      const newItem = await storage.createGroceryItem(item);
      res.json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.patch("/api/grocery-items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const item = insertGroceryItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateGroceryItem(id, item);
      if (!updatedItem) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.delete("/api/grocery-items/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteGroceryItem(id);
    res.status(204).send();
  });

  // Recipes
  app.get("/api/recipes", async (_req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  app.get("/api/recipes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const recipe = await storage.getRecipe(id);
    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }
    res.json(recipe);
  });

  // Shopping List
  app.get("/api/shopping-list", async (_req, res) => {
    const items = await storage.getShoppingList();
    res.json(items);
  });

  app.post("/api/shopping-list", async (req, res) => {
    try {
      const item = insertShoppingItemSchema.parse(req.body);
      const newItem = await storage.createShoppingItem(item);
      res.json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.patch("/api/shopping-list/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const item = insertShoppingItemSchema.partial().parse(req.body);
      const updatedItem = await storage.updateShoppingItem(id, item);
      if (!updatedItem) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.delete("/api/shopping-list/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteShoppingItem(id);
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
