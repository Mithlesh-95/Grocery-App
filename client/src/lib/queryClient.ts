// @/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import * as mockApi from "./mockApi";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export async function apiRequest(
  method: string,
  path: string,
  body?: any
): Promise<any> {
  // Mock API implementation
  if (path === "/api/shopping-list") {
    if (method === "GET") {
      return {
        ok: true,
        data: await mockApi.getShoppingList(),
      };
    }
    if (method === "POST") {
      return {
        ok: true,
        data: await mockApi.addShoppingItem(body),
      };
    }
  }

  if (path.startsWith("/api/shopping-list/") && method === "PATCH") {
    const id = parseInt(path.split("/").pop()!, 10);
    return {
      ok: true,
      data: await mockApi.updateShoppingItem(id, body),
    };
  }

  if (path.startsWith("/api/shopping-list/") && method === "DELETE") {
    const id = parseInt(path.split("/").pop()!, 10);
    await mockApi.deleteShoppingItem(id);
    return {
      ok: true,
      data: null,
    };
  }

  // Handle /api/grocery-items
  if (path === "/api/grocery-items") {
    if (method === "GET") {
      return {
        ok: true,
        data: await mockApi.getGroceryItems(),
      };
    }
    if (method === "POST") {
      return {
        ok: true,
        data: await mockApi.addGroceryItem(body),
      };
    }
  }
  
  // Handle PATCH and DELETE for grocery items
  if (path.startsWith("/api/grocery-items/")) {
    const id = parseInt(path.split("/").pop()!, 10);
    
    if (method === "PATCH") {
      return {
        ok: true,
        data: await mockApi.updateGroceryItem(id, body),
      };
    }
    
    if (method === "DELETE") {
      await mockApi.deleteGroceryItem(id);
      return {
        ok: true,
        data: null,
      };
    }
  }

  throw new Error(`Unhandled request: ${method} ${path}`);
}