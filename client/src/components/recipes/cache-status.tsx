import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudOff, Database, RefreshCw, Wifi, WifiOff, Clock, AlertCircle } from "lucide-react";
import { clearCache } from "@/services/recipe-service";
import { useState, useEffect } from "react";

interface CacheStatusProps {
  fromCache: boolean;
  lastUpdated: string;
  apiPointsRemaining: number;
  isOffline: boolean;
  onClearCache?: () => void;
}

export function CacheStatus({ 
  fromCache, 
  lastUpdated, 
  apiPointsRemaining, 
  isOffline,
  onClearCache 
}: CacheStatusProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");
  const [nextResetTime, setNextResetTime] = useState<string>("");

  // Debug logging
  console.log('Cache Status Props:', {
    fromCache,
    lastUpdated,
    apiPointsRemaining,
    isOffline,
    timeUntilReset
  });

  useEffect(() => {
    const updateResetTime = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const msUntilReset = tomorrow.getTime() - now.getTime();
      const hoursUntilReset = Math.floor(msUntilReset / (1000 * 60 * 60));
      const minutesUntilReset = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilReset(`${hoursUntilReset}h ${minutesUntilReset}m`);
      setNextResetTime(tomorrow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updateResetTime();
    const interval = setInterval(updateResetTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      clearCache();
      onClearCache?.();
    } finally {
      setIsClearing(false);
    }
  };

  const isLowOnPoints = apiPointsRemaining < 30;

  return (
    <div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg text-sm border border-border">
      {/* Status Badges Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOffline ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              Offline
            </Badge>
          ) : (
            <Badge variant="default" className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Online
            </Badge>
          )}
          
          {fromCache ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              Cached Results
            </Badge>
          ) : (
            <Badge variant="default" className="flex items-center gap-1">
              <Cloud className="h-3 w-3" />
              Live Results
            </Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearCache}
          disabled={isClearing || (!fromCache && !isOffline)}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-3 w-3 ${isClearing ? 'animate-spin' : ''}`} />
          Clear Cache
        </Button>
      </div>

      {/* API Points and Reset Time Row */}
      <div className="flex items-center justify-between bg-background/50 p-2 rounded-md">
        <div className="flex items-center gap-2">
          <Badge 
            variant={isLowOnPoints ? "destructive" : "default"}
            className="font-mono"
          >
            {apiPointsRemaining} / 150 API Points
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">Resets in: {timeUntilReset}</span>
            <span className="text-xs text-muted-foreground">at {nextResetTime}</span>
          </div>
        </div>
      </div>

      {/* Warning Message for Low Points */}
      {isLowOnPoints && (
        <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-600 p-2 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="text-xs">
            Running low on API points! Full access will be restored at {nextResetTime}.
            {fromCache && " You can continue using cached results until then."}
          </span>
        </div>
      )}

      {/* Last Updated Info */}
      {fromCache && lastUpdated && (
        <div className="text-xs text-muted-foreground">
          Cache last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
} 