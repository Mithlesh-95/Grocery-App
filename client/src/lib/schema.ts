import { z } from "zod";

export const shoppingItemSchema = z.object({
  id: z.number(),
  itemName: z.string().min(1, "Item name is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  isPurchased: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const insertShoppingItemSchema = shoppingItemSchema.omit({
  id: true,
  isPurchased: true,
  createdAt: true,
  updatedAt: true,
});

export type ShoppingItem = z.infer<typeof shoppingItemSchema>;
export type InsertShoppingItem = z.infer<typeof insertShoppingItemSchema>;

export const storeInventoryItemSchema = z.object({
  itemId: z.string(),
  name: z.string(),
  inStock: z.boolean(),
  quantity: z.number().optional(),
  price: z.number(),
  lastUpdated: z.string(),
  aisle: z.string().optional(),
  section: z.string().optional()
});

export const storeSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  distance: z.number(),
  rating: z.number().optional(),
  isOpen: z.boolean().optional(),
  location: z.tuple([z.number(), z.number()]),
  type: z.string(),
  features: z.object({
    hasDelivery: z.boolean(),
    acceptsOnlinePayment: z.boolean(),
    hasParking: z.boolean(),
    isPartner: z.boolean(),
  }),
  timings: z.object({
    open: z.string(),
    close: z.string(),
    isOpen24x7: z.boolean(),
    weekendTimings: z.object({
      open: z.string(),
      close: z.string(),
    }).optional(),
  }),
  contact: z.object({
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().optional(),
  }),
  inventory: z.array(storeInventoryItemSchema).optional(),
  hasItems: z.number(),
  totalItems: z.number(),
});

export type StoreInventoryItem = z.infer<typeof storeInventoryItemSchema>;
export type Store = z.infer<typeof storeSchema>; 