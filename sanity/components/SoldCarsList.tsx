import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { useClient } from "sanity";
import { useIntentLink } from "sanity/router";

/**
 * A live list of the cars currently on the Recently Sold page, rendered inside
 * the Recently Sold Page document.
 *
 * The page builds itself from every car whose status is "Sold", so there's no
 * reference list to look at — without this the document is just page copy and
 * there's no way to get from it to the cars it actually shows. Each row opens
 * that car's document.
 *
 * Colours come from Studio's own CSS custom properties so this looks right in
 * both the light and dark themes (@sanity/ui isn't importable from here — it's
 * nested inside the `sanity` package rather than hoisted).
 */

type SoldCar = {
  _id: string;
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  soldDate?: string;
  hidden?: boolean;
};

const MUTED = "var(--card-muted-fg-color, #8b93a7)";
const BORDER = "var(--card-border-color, rgba(127, 127, 127, 0.3))";

const styles = {
  shell: {
    border: `1px solid ${BORDER}`,
    borderRadius: 6,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "10px 12px",
    borderBottom: `1px solid ${BORDER}`,
    fontSize: 12,
    fontWeight: 600,
    color: MUTED,
  },
  refresh: {
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 8px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 12px",
    borderBottom: `1px solid ${BORDER}`,
  },
  name: {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.3,
  },
  meta: {
    marginTop: 2,
    color: MUTED,
    fontSize: 11,
  },
  open: {
    border: `1px solid ${BORDER}`,
    borderRadius: 4,
    color: "inherit",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 600,
    padding: "5px 9px",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
  message: {
    color: MUTED,
    fontSize: 12,
    padding: "12px",
  },
} satisfies Record<string, CSSProperties>;

function carTitle(car: SoldCar) {
  return (
    [car.year, car.make, car.model, car.variant]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim() || "Untitled car"
  );
}

function formatSoldDate(soldDate?: string) {
  if (!soldDate) return "No sale date set";
  const parsed = new Date(soldDate);
  if (Number.isNaN(parsed.getTime())) return soldDate;
  return `Sold ${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed)}`;
}

function OpenCarLink({ car }: { car: SoldCar }) {
  const link = useIntentLink({
    intent: "edit",
    params: { id: car._id, type: "car" },
  });

  return (
    <a {...link} style={styles.open}>
      Open
    </a>
  );
}

// Takes no props: the stored field value is irrelevant, the list is queried live.
export function SoldCarsListInput() {
  const client = useClient({ apiVersion: "2025-05-20" });
  const [cars, setCars] = useState<SoldCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Mirrors soldCarsQuery on the frontend, but keeps the hidden ones so an
      // editor can see why a sold car isn't showing up on the page.
      const results = await client.fetch<SoldCar[]>(
        `*[_type == "car" && status == "sold" && !(_id in path("drafts.**"))]
           | order(coalesce(soldDate, _updatedAt) desc, year desc) {
             _id, make, model, variant, year, soldDate,
             "hidden": hideFromSoldPage == true
           }`,
      );
      setCars(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load sold cars.");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    // Deferred so the fetch never starts synchronously inside the effect body.
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  const shown = cars.filter((car) => !car.hidden).length;

  return (
    <div style={styles.shell}>
      <div style={styles.header}>
        <span>
          {loading ? "Loading..." : `${shown} car${shown === 1 ? "" : "s"} on the page`}
        </span>
        <button type="button" onClick={() => void load()} style={styles.refresh}>
          Refresh
        </button>
      </div>

      {error ? <div style={styles.message}>{error}</div> : null}

      {!loading && !error && cars.length === 0 ? (
        <div style={styles.message}>
          No cars are marked as sold yet. Set a car&apos;s status to Sold and it will
          appear here.
        </div>
      ) : null}

      {cars.map((car) => (
        <div key={car._id} style={styles.row}>
          <div>
            <p style={styles.name}>{carTitle(car)}</p>
            <div style={styles.meta}>
              {formatSoldDate(car.soldDate)}
              {car.hidden ? " · hidden from this page" : ""}
            </div>
          </div>
          <OpenCarLink car={car} />
        </div>
      ))}
    </div>
  );
}
