/**
 * Restaurant grid component for displaying filtered restaurants.
 * Responsive layout that adapts to different screen sizes.
 */

import { Link } from 'react-router-dom';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import type { Restaurant } from '@/types/api';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
}

export function RestaurantGrid({ restaurants, isLoading = false }: RestaurantGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-12">
        <p className="text-center text-gray-500">
          Nenhum restaurante encontrado com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => (
        <Link
          key={restaurant.id}
          to={`/restaurants/${restaurant.id}`}
          className="transition-transform hover:scale-105"
        >
          <RestaurantCard restaurant={restaurant} />
        </Link>
      ))}
    </div>
  );
}
