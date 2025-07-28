'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type SheetType = 'notifications' | 'driver' | null;

interface SheetContextType {
  activeSheet: SheetType;
  openSheet: (type: SheetType) => void;
  closeSheet: () => void;
  isSheetOpen: (type: SheetType) => boolean;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function SheetProvider({ children }: { children: ReactNode }) {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  const openSheet = (type: SheetType) => {
    setActiveSheet(type);
  };

  const closeSheet = () => {
    setActiveSheet(null);
  };

  const isSheetOpen = (type: SheetType) => {
    return activeSheet === type;
  };

  return (
    <SheetContext.Provider value={{ activeSheet, openSheet, closeSheet, isSheetOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function useSheet() {
  const context = useContext(SheetContext);

  if (context === undefined) {
    throw new Error('useSheet must be used within a SheetProvider');
  }

  return context;
}
