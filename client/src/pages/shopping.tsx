import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const GROCERY_APPS = [
  {
    id: "zepto",
    name: "Zepto",
    icon: ShoppingBag,
    url: "https://www.zeptonow.com/",
    backgroundColor: "bg-orange-100",
    appStore: "https://apps.apple.com/in/app/zepto/id1575423441",
    playStore: "https://play.google.com/store/apps/details?id=com.zeptoconsumerapp",
  },
  {
    id: "bigbasket",
    name: "BigBasket",
    icon: ShoppingBag,
    url: "https://www.bigbasket.com/",
    backgroundColor: "bg-green-100",
    appStore: "https://apps.apple.com/in/app/bigbasket/id660806884",
    playStore: "https://play.google.com/store/apps/details?id=com.bigbasket",
  },
  {
    id: "dmart",
    name: "DMart Ready",
    icon: ShoppingBag,
    url: "https://www.dmart.in/",
    backgroundColor: "bg-red-100",
    appStore: "https://apps.apple.com/in/app/dmart-ready-online-grocery/id1442337588",
    playStore: "https://play.google.com/store/apps/details?id=com.avenues.dmart",
  },
  {
    id: "swiggy-instamart",
    name: "Swiggy Instamart",
    icon: ShoppingBag,
    url: "https://www.swiggy.com/instamart",
    backgroundColor: "bg-yellow-100",
    appStore: "https://apps.apple.com/in/app/swiggy-food-grocery-delivery/id989540920",
    playStore: "https://play.google.com/store/apps/details?id=in.swiggy.android",
  },
  {
    id: "blinkit",
    name: "Blinkit",
    icon: ShoppingBag,
    url: "https://blinkit.com/",
    backgroundColor: "bg-purple-100",
    appStore: "https://apps.apple.com/in/app/blinkit-grocery-in-10-mins/id1493067167",
    playStore: "https://play.google.com/store/apps/details?id=com.grofers.customerapp",
  },
  {
    id: "bb-now",
    name: "BB Now",
    icon: ShoppingBag,
    url: "https://www.bigbasket.com/bbnow/",
    backgroundColor: "bg-blue-100",
    appStore: "https://apps.apple.com/in/app/bigbasket/id660806884",
    playStore: "https://play.google.com/store/apps/details?id=com.bigbasket",
  },
];

export default function GroceryApps() {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== "undefined" && window.innerWidth < 768
  );
  const { toast } = useToast();

  const handleAppClick = (app: typeof GROCERY_APPS[0]) => {
    try {
      if (isMobile) {
        const deepLink = app.url;
        window.location.href = deepLink;
        
        setTimeout(() => {
          const storeUrl = /iOS|iPhone|iPad/.test(navigator.userAgent)
            ? app.appStore
            : app.playStore;
          window.location.href = storeUrl;
        }, 1000);
      } else {
        window.open(app.url, "_blank");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open the app",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Grocery Shopping Apps
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {GROCERY_APPS.map((app) => {
            const Icon = app.icon;
            return (
              <Card
                key={app.id}
                className="group p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-none"
                onClick={() => handleAppClick(app)}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`${app.backgroundColor} p-3 rounded-full group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                    {app.name}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}