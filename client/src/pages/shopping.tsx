import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import type { ShoppingItem, InsertShoppingItem } from "@shared/schema";
import { z } from "zod";

const addItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
});

export default function Shopping() {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    itemName: "",
    quantity: "",
    unit: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery<ShoppingItem[]>({
    queryKey: ["/api/shopping-list"],
  });

  const addMutation = useMutation({
    mutationFn: async (item: InsertShoppingItem) => {
      await apiRequest("POST", "/api/shopping-list", item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-list"] });
      setIsAddingItem(false);
      setNewItem({ itemName: "", quantity: "", unit: "" });
      toast({
        title: "Item added",
        description: "New item has been added to your shopping list",
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      id,
      isPurchased,
    }: {
      id: number;
      isPurchased: boolean;
    }) => {
      await apiRequest("PATCH", `/api/shopping-list/${id}`, { isPurchased });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-list"] });
    },
  });

  const handleAddItem = () => {
    try {
      const parsedItem = addItemSchema.parse({
        itemName: newItem.itemName,
        quantity: parseInt(newItem.quantity),
        unit: newItem.unit,
      });
      addMutation.mutate(parsedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid input",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const toggleItem = (item: ShoppingItem) => {
    toggleMutation.mutate({
      id: item.id,
      isPurchased: !item.isPurchased,
    });
  };

  const sortedItems = [...items].sort((a, b) => {
    if (a.isPurchased === b.isPurchased) {
      return 0;
    }
    return a.isPurchased ? 1 : -1;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shopping List</h1>
          <p className="text-muted-foreground">
            Keep track of items you need to buy
          </p>
        </div>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Shopping Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  value={newItem.itemName}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, itemName: e.target.value }))
                  }
                  placeholder="e.g., Bread"
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, quantity: e.target.value }))
                  }
                  placeholder="e.g., 2"
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  value={newItem.unit}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  placeholder="e.g., loaves"
                />
              </div>
              <Button
                onClick={handleAddItem}
                disabled={addMutation.isPending}
                className="w-full"
              >
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-muted animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <motion.div layout className="space-y-4">
          <AnimatePresence>
            {sortedItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <div className="flex items-center p-4">
                    <Checkbox
                      checked={item.isPurchased}
                      onCheckedChange={() => toggleItem(item)}
                      className="mr-4"
                    />
                    <div
                      className={`flex-1 ${
                        item.isPurchased ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      <h3 className="font-medium">{item.itemName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    {item.isPurchased && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
