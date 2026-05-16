/**
 * Restaurants discovery page with search, filters, and listing.
 * Provides a professional restaurant browsing experience.
 */

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { FullScreenLoader } from '@/components/feedback/FullScreenLoader';
import { StatusMessage } from '@/components/feedback/StatusMessage';
import { RestaurantFilters } from '@/components/restaurants/RestaurantFilters';
import { RestaurantGrid } from '@/components/restaurants/RestaurantGrid';
import { restaurantService } from '@/services/restaurant.service';
import type { Restaurant } from '@/types/api';

export function RestaurantsPage() {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const data = await restaurantService.list();
        setAllRestaurants(data);
        setFilteredRestaurants(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Não foi possível carregar os restaurantes.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRestaurants();
  }, []);

  if (isLoading) {
    return (
      <FullScreenLoader
        title="Descobrindo restaurantes"
        description="Carregando a curadoria gastronômica para você..."
      />
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-6 w-6 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">Descobrir Restaurantes</h1>
          </div>
          <p className="text-gray-600">
            Explore nossa curadoria de {allRestaurants.length} restaurante{allRestaurants.length !== 1 ? 's' : ''} e reserve sua mesa
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <StatusMessage
              tone="error"
              title="Erro ao carregar restaurantes"
              description={error}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar with Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Filtros</h2>
                <RestaurantFilters
                  restaurants={allRestaurants}
                  onFilterChange={setFilteredRestaurants}
                />
              </div>
            </div>
          </div>

          {/* Restaurant Grid */}
          <div className="lg:col-span-3">
            <RestaurantGrid
              restaurants={filteredRestaurants}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
