import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MapPin,
  Loader2,
  ExternalLink,
  Navigation,
  Store as StoreIcon
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Store } from "@/lib/schema";
import Map from "@/components/map";

// Sample store data - in a real app, this would come from an API based on location
const generateNearbyStores = (userLat: number, userLng: number): Store[] => {
  // Generate random stores within 5km radius
  const stores: Store[] = [
    {
      id: "1",
      name: "Local Mart",
      address: "Near your location",
      distance: 0.3,
      location: [
        userLat + (Math.random() - 0.5) * 0.01, // Approximately within 1km
        userLng + (Math.random() - 0.5) * 0.01
      ],
      type: "Supermarket",
      isOpen: true,
      rating: 4.5,
      features: {
        hasDelivery: true,
        acceptsOnlinePayment: true,
        hasParking: true,
        isPartner: true
      },
      timings: {
        open: "08:00",
        close: "22:00",
        isOpen24x7: false,
        weekendTimings: {
          open: "08:00",
          close: "22:00"
        }
      },
      contact: {
        phone: "1234567890",
        whatsapp: "911234567890",
        email: "localmart@example.com"
      },
      hasItems: 10,
      totalItems: 10
    },
    {
      id: "2",
      name: "Fresh Grocery",
      address: "2 blocks away",
      distance: 0.8,
      location: [
        userLat + (Math.random() - 0.5) * 0.02, // Approximately within 2km
        userLng + (Math.random() - 0.5) * 0.02
      ],
      type: "Supermarket",
      isOpen: true,
      rating: 4.3,
      features: {
        hasDelivery: true,
        acceptsOnlinePayment: true,
        hasParking: true,
        isPartner: true
      },
      timings: {
        open: "07:00",
        close: "23:00",
        isOpen24x7: false,
        weekendTimings: {
          open: "07:00",
          close: "23:00"
        }
      },
      contact: {
        phone: "9876543210",
        whatsapp: "919876543210",
        email: "freshgrocery@example.com"
      },
      hasItems: 10,
      totalItems: 10
    }
  ];

  return stores;
};

function StoreCard({ store, onNavigate }: { store: Store, onNavigate: (store: Store) => void }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <StoreIcon className="h-5 w-5 text-primary" />
            <h3 className="font-medium">{store.name}</h3>
            <Badge variant={store.isOpen ? "default" : "destructive"}>
              {store.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{store.address}</p>
          <p className="text-sm text-muted-foreground">
            {store.distance.toFixed(1)} km away
          </p>
          <div className="text-sm text-muted-foreground">
            Hours: {store.timings.open} - {store.timings.close}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${store.name} ${store.address}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Maps
            </Button>
            <Button 
              size="sm"
              onClick={() => onNavigate(store)}
            >
              <Navigation className="h-4 w-4 mr-2" />
              Navigate
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function Stores() {
  const [isLoading, setIsLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  const findStores = async () => {
    setIsLoading(true);
    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      setUserLocation([userLat, userLng]);

      // In a real app, you would make an API call here with the coordinates
      // For now, we'll generate some nearby stores
      const nearbyStores = generateNearbyStores(userLat, userLng);
      setStores(nearbyStores);
      
      toast({
        title: `Found ${nearbyStores.length} stores nearby`,
        description: "Here are the stores in your area",
      });
    } catch (error) {
      toast({
        title: "Error finding stores",
        description: "Please allow location access to find nearby stores",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (store: Store) => {
    toast({
      title: "Starting navigation",
      description: `Navigating to ${store.name}`,
    });
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${store.name} ${store.address}`, '_blank');
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Nearby Stores</h1>
        <p className="text-muted-foreground">
          Find and navigate to grocery stores in your area
        </p>
      </div>

      {/* Find Stores Button */}
      <Button 
        onClick={findStores} 
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Finding stores...
          </>
        ) : (
          <>
            <MapPin className="mr-2 h-4 w-4" />
            Find Nearby Stores
          </>
        )}
      </Button>

      {/* Map and Stores Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Map */}
        <Card className="p-4 h-[400px]">
          {stores.length > 0 && (
            <Map 
              center={userLocation}
              markers={[
                // User location marker
                ...(userLocation ? [{
                  position: userLocation,
                  type: 'user' as const,
                  popup: 'Your location'
                }] : []),
                // Store markers
                ...stores.map(store => ({
                  position: store.location,
                  type: 'store' as const,
                  label: store.name,
                  popup: `
                    <div class="p-2">
                      <h3 class="font-medium">${store.name}</h3>
                      <p class="text-sm">${store.address}</p>
                      <p class="text-sm">${store.distance.toFixed(1)} km away</p>
                    </div>
                  `
                }))
              ]}
            />
          )}
          {stores.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click "Find Nearby Stores" to see stores in your area
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Store List */}
        <div className="space-y-4">
          {stores.map((store) => (
            <StoreCard 
              key={store.id} 
              store={store}
              onNavigate={handleNavigate}
            />
          ))}
          {stores.length === 0 && (
            <div className="text-center text-muted-foreground">
              No stores found yet. Click "Find Nearby Stores" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 