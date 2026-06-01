"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import type { Car } from "@/lib/cars";

type ViewMode = "grid" | "list";
type SortKey = "year-desc" | "year-asc" | "price-desc" | "price-asc";

const categoryLabel: Record<string, string> = {
  classic: "Classic",
  electric: "Electric",
  luxury: "Luxury",
  performance: "Performance",
  sports: "Sports",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(miles: number): string {
  return new Intl.NumberFormat("en-GB").format(miles) + " mi";
}

export function InventoryBrowser({ cars }: { cars: Car[] }) {
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortKey>("year-desc");
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allMakes = useMemo(() => [...new Set(cars.map((c) => c.make))].sort(), [cars]);
  const allBodyTypes = useMemo(() => [...new Set(cars.map((c) => c.bodyType))].sort(), [cars]);
  const allCategories = useMemo(() => [...new Set(cars.map((c) => c.category))].sort(), [cars]);

  const activeFilterCount = selectedMakes.length + selectedBodyTypes.length + selectedCategories.length;

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
  }, [cars, selectedMakes, selectedBodyTypes, selectedCategories, sort]);

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
    <>
    {/* Mobile filter drawer */}
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${filtersOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${filtersOpen ? "opacity-100" : "opacity-0"}`}
        onClick={() => setFiltersOpen(false)}
      />
      {/* Panel */}
      <div
        className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-bg border-r border-border flex flex-col transition-transform duration-300 ${filtersOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-sm uppercase tracking-widest font-semibold">Filters</span>
          <button
            onClick={() => setFiltersOpen(false)}
            className="text-text-muted hover:text-text transition-colors"
            aria-label="Close filters"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-8">
          {hasFilters && (
            <button
              onClick={() => { clearAll(); setFiltersOpen(false); }}
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
      </div>
    </div>

    {/* Page header */}
    <section className="container-page pt-32 md:pt-40 pb-10">
      <div className="text-xs tracking-[0.3em] uppercase text-brand mb-3">Current Stock</div>
      <h1 className="font-display font-bold text-5xl md:text-6xl tracking-tight mb-4">Our Inventory</h1>
      <p className="text-text-muted text-lg max-w-2xl leading-relaxed mb-6">
        Every car listed below is in our care and available for viewing by appointment.
        Don&apos;t see what you&apos;re after? We can source it.
      </p>
      <span className="text-sm text-text-muted">
        <span className="font-semibold text-text">{filtered.length}</span>{" "}
        vehicle{filtered.length !== 1 ? "s" : ""}
        {hasFilters && " matching your filters"}
      </span>
    </section>

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
        <div className="px-6 py-4 border-b border-border">
          {/* Filters + sort + view toggles */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-xs uppercase tracking-widest border border-border px-2.5 py-2 text-text-muted hover:text-text hover:border-text transition-colors shrink-0"
              aria-label="Open filters"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-brand text-on-brand text-[10px] px-1.5 py-0.5 font-medium leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <SortDropdown value={sort} onChange={setSort} />
            <div className="flex border border-border shrink-0">
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
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-5">
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
    </>
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
      <h3 className="text-sm uppercase tracking-widest font-semibold text-text mb-4">{title}</h3>
      <ul className="space-y-3">
        {options.map((opt) => (
          <li key={opt}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
                className="w-4 h-4 accent-brand shrink-0"
              />
              <span className="text-base text-text-muted group-hover:text-text transition-colors">
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
      className="group block bg-surface border border-border hover:border-brand dark:hover:border-white hover:ring-2 hover:ring-brand dark:hover:ring-white transition-all overflow-hidden"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-bg-elevated">
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
    <div className="group grid grid-cols-[120px_1fr_auto] md:grid-cols-[55%_45%] py-4 md:py-6 gap-0 hover:bg-bg-elevated transition-colors">
      {/* Image */}
      <Link
        href={`/inventory/${car.slug}`}
        className="relative aspect-4/3 md:aspect-16/10 overflow-hidden bg-bg-elevated block self-center md:self-auto"
        aria-label={`${car.year} ${car.make} ${car.model}`}
      >
        <Image
          src={car.images[0]}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          sizes="(max-width: 768px) 120px, 55vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {car.status === "reserved" && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-accent text-stone-900 px-2 py-0.5 md:px-2.5 md:py-1 text-xs uppercase tracking-widest font-medium">
            Reserved
          </div>
        )}
        {car.status === "sold" && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-600 text-white px-2 py-0.5 md:px-2.5 md:py-1 text-xs uppercase tracking-widest font-medium">
            Sold
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-col justify-center md:justify-between px-4 md:px-8 py-1 md:py-0">
        <div>
          <div className="text-xs text-text-subtle tracking-widest uppercase mb-1 md:mb-3">
            {car.year} · {car.bodyType}
          </div>
          <h3 className="font-display font-bold text-base md:text-3xl mb-0.5 md:mb-1 leading-tight">
            {car.make} {car.model}
          </h3>
          {car.variant && (
            <div className="text-text-muted text-xs md:text-base md:mb-4">{car.variant}</div>
          )}
          <div className="hidden md:flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-subtle mt-4">
            <span>{car.fuel}</span>
            <span>{car.transmission}</span>
            <span>{formatMileage(car.mileage)}</span>
            <span>{car.colour}</span>
          </div>
        </div>

        <div className="mt-2 md:mt-6">
          <div className="font-display font-bold text-base md:text-3xl md:mb-5">
            {formatPrice(car.price)}
          </div>
          <div className="hidden md:flex gap-3 mt-5">
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

      {/* Mobile: far-right view arrow */}
      <Link
        href={`/inventory/${car.slug}`}
        className="md:hidden flex items-center self-center pl-3 pr-4 text-brand hover:text-brand-light transition-colors"
        aria-label={`View ${car.make} ${car.model}`}
      >
        <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "year-desc", label: "Newest First" },
  { value: "year-asc",  label: "Oldest First" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "price-asc",  label: "Price: Low to High" },
];

function SortDropdown({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = sortOptions.find((o) => o.value === value)!;

  function handleBlur(e: React.FocusEvent) {
    if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
  }

  return (
    <div ref={ref} className="relative w-56 max-w-full" onBlur={handleBlur}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 border text-xs uppercase tracking-wider transition-colors ${
          open ? "border-text text-text" : "border-border text-text-muted hover:border-text hover:text-text"
        }`}
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown
          size={13}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="absolute z-20 top-full left-0 right-0 mt-1 bg-bg border border-border shadow-xl overflow-hidden">
          {sortOptions.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider transition-colors ${
                  opt.value === value
                    ? "text-brand bg-bg-elevated"
                    : "text-text-muted hover:text-text hover:bg-bg-elevated"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
