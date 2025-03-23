import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Edit2, Trash2, AlertTriangle } from "lucide-react";
import { differenceInDays, parseISO, startOfDay } from "date-fns";
import { type GroceryItem } from "@shared/schema";

interface InventoryItemProps {
  item: GroceryItem;
}

export default function InventoryItem({ item }: InventoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [expiryDate, setExpiryDate] = useState(
    item.expiryDate ? new Date(item.expiryDate).toISOString().split("T")[0] : ""
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (updates: { quantity?: number; expiryDate?: string | null }) => {
      await apiRequest("PATCH", `/api/grocery-items/${item.id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grocery-items"] });
      toast({
        title: "Updated item",
        description: `${item.name} has been updated`,
      });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/grocery-items/${item.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grocery-items"] });
      toast({
        title: "Item deleted",
        description: `${item.name} has been removed from inventory`,
      });
    },
  });

  const handleUpdate = () => {
    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity)) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }
    updateMutation.mutate({
      quantity: newQuantity,
      expiryDate: expiryDate || null,
    });
  };

  const getDaysUntilExpiry = () => {
    if (!item.expiryDate) return null;
    const today = startOfDay(new Date()); // Start of today, ignoring time
    const expiry = startOfDay(parseISO(item.expiryDate.toString())); // Start of expiry day
    return differenceInDays(expiry, today); // Positive if expiry is in future
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const isNearExpiry = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 7; // Only future dates
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0; // Only past dates

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className={`p-4 ${isExpired ? "border-red-500" : isNearExpiry ? "border-yellow-500" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{item.name}</h3>
              {isNearExpiry && (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
              {isExpired && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {item.quantity}{item.unit ? ` ${item.unit}` : ''}
            </p>
            {item.expiryDate && (
              <p
                className={`text-xs ${
                  isExpired
                    ? "text-red-500"
                    : isNearExpiry
                    ? "text-yellow-500"
                    : "text-muted-foreground"
                }`}
              >
                {isExpired
                  ? "Expired"
                  : isNearExpiry
                  ? `Expires in ${daysUntilExpiry} days`
                  : `Expires: ${new Date(item.expiryDate).toLocaleDateString()}`}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleUpdate}
                    disabled={updateMutation.isPending}
                  >
                    Update
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}