import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { locationsApi } from '@shared/api/locations';
import { Button } from '@shared/ui/forms/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/layout/dialog';
import { LocationType } from '@entities/locations/enums';
import type { LocationDTO } from '@entities/locations/interface/LocationDTO';

export interface LocationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (locationId: string) => void;
}

export function LocationSelectionModal({ isOpen, onClose, onLocationSelect }: LocationSelectionModalProps) {
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await locationsApi.getLocations({
          type: [LocationType.Other],
          isActive: true,
          size: 100,
          sortBy: 'name',
          sortOrder: 'Asc'
        });
        
        setLocations(response.data);
      } catch {
        // В production здесь можно добавить логирование ошибки
        setError('Не удалось загрузить список стартовых точек');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [isOpen]);

  const handleSelect = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Выберите стартовую точку</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-destructive text-center py-4">{error}</div>
          ) : locations.length === 0 ? (
            <div className="text-muted-foreground text-center py-4">Нет доступных стартовых точек</div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {locations.map((location) => (
                <div 
                  key={location.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedLocation === location.id 
                      ? 'border-primary bg-primary/10' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setSelectedLocation(location.id)}
                >
                  <h3 className="font-medium">{location.name}</h3>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              onClick={handleSelect}
              disabled={!selectedLocation || isLoading}
            >
              Выбрать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
