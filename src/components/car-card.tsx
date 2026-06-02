import Image from "next/image";
import Link from "next/link";
import { Car, formatPrice, formatMileage } from "@/lib/cars";
import { ArrowUpRight, Clock, ImageOff } from "lucide-react";

function CardContent({ car }: { car: Car }) {
  const isComingSoon = car.status === "coming-soon";
  return (
    <>
      <div className="relative aspect-4/3 overflow-hidden bg-stone-700">
        {isComingSoon ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-stone-600 to-stone-800">
            <Clock size={32} className="text-stone-300 mb-2" />
            <div className="text-stone-300 text-sm font-medium">Coming Soon</div>
          </div>
        ) : car.images[0] ? (
          <Image
            src={car.images[0]}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-stone-700 text-stone-300">
            <ImageOff size={28} />
            <span className="text-xs uppercase tracking-widest">No photo</span>
          </div>
        )}
        {car.status === "reserved" && (
          <div className="absolute top-4 left-4 bg-accent text-stone-900 px-3 py-1 text-xs uppercase tracking-widest font-medium">
            Reserved
          </div>
        )}
        {car.status === "sold" && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs uppercase tracking-widest font-medium">
            Sold
          </div>
        )}
        {isComingSoon && (
          <div className="absolute top-4 left-4 bg-amber-500 text-stone-900 px-3 py-1 text-xs uppercase tracking-widest font-medium">
            Coming Soon
          </div>
        )}
        {!isComingSoon && (
          <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-bg/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={18} className="text-text" />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="text-xs text-text-subtle tracking-widest uppercase mb-2">
          {car.year} · {car.bodyType}
        </div>
        <h3 className="font-display text-xl tracking-wide mb-1">
          {car.make} {car.model}
        </h3>
        {car.variant && (
          <div className="text-sm text-text-muted mb-4">{car.variant}</div>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="text-xs text-text-subtle uppercase tracking-wider">Price</div>
            <div className="font-display text-lg text-text">{formatPrice(car.price)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-subtle uppercase tracking-wider">Mileage</div>
            <div className="font-display text-lg text-text">{formatMileage(car.mileage)}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export function CarCard({ car }: { car: Car }) {
  if (car.status === "coming-soon") {
    return (
      <div className="group block bg-bg-elevated border border-border overflow-hidden cursor-default">
        <CardContent car={car} />
      </div>
    );
  }

  return (
    <Link
      href={`/inventory/${car.slug}`}
      className="group block bg-bg-elevated border border-border hover:border-brand dark:hover:border-white hover:ring-2 hover:ring-brand dark:hover:ring-white transition-all overflow-hidden"
    >
      <CardContent car={car} />
    </Link>
  );
}
