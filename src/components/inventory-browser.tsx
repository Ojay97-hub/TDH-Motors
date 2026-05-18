"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, LayoutGrid, List, X } from "lucide-react";
import { cars, Car, formatPrice, formatMileage } from "@/lib/cars";

type ViewMode = "grid" | "list";
type SortKey = "year-desc" | "year-asc" | "price-desc" | "price-asc";

const allMakes = [...new Set(cars.map((c) => c.make))].sort();
const allBodyTypes = [...new Set(cars.map((c) => c.bodyType))].sort();
const allCategories = [...new Set(cars.map((c) => c.category))].sort();

const categoryLabel: Record<string, string> = {
  classic: "Classic",
  electric: "Electric",
  luxury: "Luxury",
  performance: "Performance",
  sports: "Sports",
};

export function InventoryBrowser() {
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortKey>("year-desc");
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let result = [...cars];
    if (selectedMakes.length) result = result.filter((c) => selectedMakes.includes(c.make));
    if (selectedBodyTypes.length) result = result.filter((c) => selectedBodyTypes.includes(c.bodyType));
    if (selectedCategories.length) result = result.filter((c) => selectedCategories.includes(c.category));
    switch (sort) {
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "year-desc": result.sort((a, b) => b.year - a.year); break;
      case "year-asc": result.sort((a, b) => a.year - b.year); break;
    }
    return result;
  }, [selectedMakes, selectedBodyTypes, selectedCategories, sort]);

  const hasFilters = selectedMakes.length > 0 || selectedBodyTypes.length > 0 || selectedCategories.length > 0;

  function toggle<T>(list: T[], set: (v: T[]) => void, val: T) {
    set(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);
  }

  function clearAll() {
    setSelectedMakes([]);
    setSelectedBodyTypes([]);
    setSelectedCategories([]);
  }

  return (
    <div className="flex border-t border-border min-h-[60vh]">
      {/* Sidebar */}
      <aside className="hidden lg:block w-60 xl:w-72 shrink-0 border-r border-border">
        <div className="sticky top-28 overflow-y-auto max-h-[calc(100vh-7rem)] p-6 space-y-8">
          {hasFilters && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-brand hover:text-brand-light transition-colors"
            >
              <X size={12} /> Clear all filters
            </button>
          )}

          <FilterGroup
            title="Make"
            options={allMakes}
            selected={selectedMakes}
            onToggle={(v) => toggle(selectedMakes, setSelectedMakes, v)}
          />

          <FilterGroup
            title="Body Type"
            options={allBodyTypes}
            selected={selectedBodyTypes}
            onToggle={(v) => toggle(selectedBodyTypes, setSelectedBodyTypes, v)}
          />

          <FilterGroup
            title="Category"
            options={allCategories}
            selected={selectedCategories}
            onToggle={(v) => toggle(selectedCategories, setSelectedCategories, v)}
            labelMap={categoryLabel}
          />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border gap-4">
          <span className="text-sm text-text-muted">
            <span className="font-semibold text-text">{filtered.length}</span>{" "}
            vehicle{filtered.length !== 1 ? "s" : ""}
          </span>

          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="text-xs bg-transparent border border-border text-text-muted px-3 py-2 outline-none hover:border-text transition-colors cursor-pointer uppercase tracking-wider"
            >
              <option value="year-desc">Newest first</option>
              <option value="year-asc">Oldest first</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>

            <div className="flex border border-border">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`p-2.5 transition-colors ${view === "grid" ? "bg-brand text-on-brand" : "text-text-muted hover:text-text"}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`p-2.5 transition-colors border-l border-border ${view === "list" ? "bg-brand text-on-brand" : "text-text-muted hover:text-text"}`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-6">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-text-muted mb-4">No cars match your filters.</p>
              <button onClick={clearAll} className="text-sm text-brand hover:text-brand-light transition-colors uppercase tracking-wider">
                Clear filters
              </button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {filtered.map((car) => (
                <GridCard key={car.slug} car={car} />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((car) => (
                <ListCard key={car.slug} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  labelMap,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  labelMap?: Record<string, string>;
}) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest font-semibold text-text mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {options.map((opt) => (
          <li key={opt}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
                className="w-4 h-4 accent-brand shrink-0"
              />
              <span className="text-sm text-text-muted group-hover:text-text transition-colors">
                {labelMap?.[opt] ?? opt}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GridCard({ car }: { car: Car }) {
  return (
    <Link
      href={`/inventory/${car.slug}`}
      className="group block bg-surface border border-border hover:border-brand transition-colors overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-elevated">
        <Image
          src={car.images[0]}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {car.status === "reserved" && (
          <div className="absolute top-3 left-3 bg-accent text-stone-900 px-2.5 py-1 text-xs uppercase tracking-widest font-medium">
            Reserved
          </div>
        )}
        {car.status === "sold" && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 text-xs uppercase tracking-widest font-medium">
            Sold
          </div>
        )}
        <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-bg/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={16} className="text-text" />
        </div>
      </div>
      <div className="p-5">
        <div className="text-xs text-text-subtle tracking-widest uppercase mb-1.5">
          {car.year} · {car.bodyType}
        </div>
        <h3 className="font-display font-bold text-lg mb-0.5">{car.make} {car.model}</h3>
        {car.variant && <div className="text-sm text-text-muted mb-3">{car.variant}</div>}
        <div className="flex items-center justify-between pt-3.5 border-t border-border">
          <div className="font-display font-bold text-lg">{formatPrice(car.price)}</div>
          <div className="text-xs text-text-subtle uppercase tracking-wider">{formatMileage(car.mileage)}</div>
        </div>
      </div>
    </Link>
  );
}

function ListCard({ car }: { car: Car }) {
  return (
    <div className="group grid grid-cols-1 md:grid-cols-[55%_45%] py-6 gap-0 hover:bg-bg-elevated transition-colors">
      {/* Large image */}
      <div className="relative aspect-16/10 overflow-hidden bg-bg-elevated">
        <Image
          src={car.images[0]}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {car.status === "reserved" && (
          <div className="absolute top-3 left-3 bg-accent text-stone-900 px-2.5 py-1 text-xs uppercase tracking-widest font-medium">
            Reserved
          </div>
        )}
        {car.status === "sold" && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 text-xs uppercase tracking-widest font-medium">
            Sold
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between px-8 py-4 md:py-0">
        <div>
          <div className="text-xs text-text-subtle tracking-widest uppercase mb-3">
            {car.year} · {car.bodyType}
          </div>
          <h3 className="font-display font-bold text-2xl md:text-3xl mb-1">
            {car.make} {car.model}
          </h3>
          {car.variant && (
            <div className="text-text-muted mb-4">{car.variant}</div>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-subtle mt-4">
            <span>{car.fuel}</span>
            <span>{car.transmission}</span>
            <span>{formatMileage(car.mileage)}</span>
            <span>{car.colour}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="font-display font-bold text-3xl mb-5">
            {formatPrice(car.price)}
          </div>
          <div className="flex gap-3">
            <Link
              href={`/contact?car=${car.slug}`}
              className="px-6 py-2.5 border border-border hover:border-text text-text text-xs uppercase tracking-widest font-medium transition-colors"
            >
              Reserve
            </Link>
            <Link
              href={`/inventory/${car.slug}`}
              className="px-6 py-2.5 bg-brand hover:bg-brand-light text-on-brand text-xs uppercase tracking-widest font-medium transition-colors"
            >
              Discover
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
