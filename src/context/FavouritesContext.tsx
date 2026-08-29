import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface FavouriteItem {
  id: string;
  name: string;
}

interface FavouritesContextValue {
  favourites: FavouriteItem[];
  isFavourite: (id: string) => boolean;
  toggleFavourite: (item: FavouriteItem) => void;
}

const FavouritesContext = createContext<FavouritesContextValue | undefined>(undefined);

const initialFavourites: FavouriteItem[] = [
  { id: 'r1', name: 'Q4 Revenue Performance' },
  { id: 'r6', name: 'Executive Dashboard Summary' },
  { id: 'h1', name: 'Regional Sales Comparison' },
];

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<FavouriteItem[]>(initialFavourites);

  const isFavourite = useCallback(
    (id: string) => favourites.some((f) => f.id === id),
    [favourites]
  );

  const toggleFavourite = useCallback((item: FavouriteItem) => {
    setFavourites((prev) =>
      prev.some((f) => f.id === item.id)
        ? prev.filter((f) => f.id !== item.id)
        : [...prev, item]
    );
  }, []);

  const value = useMemo(
    () => ({ favourites, isFavourite, toggleFavourite }),
    [favourites, isFavourite, toggleFavourite]
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
}
