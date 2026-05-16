/**
 * Design philosophy for restaurant cards: combine appetite, data and action in a balanced composition that reads like a premium listing.
 */
import { ArrowRight, Clock3, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { imagery } from '@/lib/assets';
import type { Restaurant } from '@/types/api';

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <article className="group overflow-hidden rounded-[1.85rem] border border-white/55 bg-white/82 shadow-[0_20px_65px_rgba(75,46,25,0.10)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(75,46,25,0.14)]">
      <div className="relative h-60 overflow-hidden">
        <img
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          src={restaurant.logo_url || imagery.restaurantCard}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,14,10,0.08),rgba(21,14,10,0.72))]" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 px-6 pb-6 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/72">{restaurant.cuisine_type || 'Culinária autoral'}</p>
            <h3 className="mt-2 font-display text-3xl">{restaurant.name}</h3>
          </div>
          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] backdrop-blur-sm">
            {restaurant.city || 'Local especial'}
          </div>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6">
        <p className="line-clamp-3 min-h-[4.75rem] text-sm leading-7 text-[#675341]">
          {restaurant.description || 'Ambiente elegante, mesas preparadas com cuidado e um fluxo simples para reservar com tranquilidade.'}
        </p>

        <div className="grid gap-3 text-sm text-[#4b382a] sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-[#f8f0e2] px-4 py-3">
            <MapPin className="h-4 w-4 text-[#8b5e34]" />
            <span className="truncate">{restaurant.address || restaurant.city || 'Endereço sob consulta'}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#f8f0e2] px-4 py-3">
            <Phone className="h-4 w-4 text-[#8b5e34]" />
            <span>{restaurant.phone || 'Contato no estabelecimento'}</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#f8f0e2] px-4 py-3 sm:col-span-2">
            <Clock3 className="h-4 w-4 text-[#8b5e34]" />
            <span>
              Limite recomendado para reserva: {restaurant.reservation_limit_time ? restaurant.reservation_limit_time.slice(0, 5) : 'consulte o restaurante'}
            </span>
          </div>
        </div>

        <Link className="btn-primary inline-flex w-full items-center justify-center gap-2" to={`/restaurants/${restaurant.id}`}>
          Ver detalhes e reservar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
