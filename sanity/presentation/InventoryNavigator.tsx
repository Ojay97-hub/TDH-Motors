"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { useClient } from "sanity";
import { useIntentLink } from "sanity/router";
import { usePresentationNavigate } from "sanity/presentation";

type InventoryCar = {
  _id: string;
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  status?: string;
  slug?: string;
};

const previewSearchParams: [string, string][] = [["preview", "/inventory"]];

const styles = {
  shell: {
    height: "100%",
    background: "#0f1117",
    color: "#f5f5f5",
    borderRight: "1px solid #252936",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  header: {
    padding: 16,
    borderBottom: "1px solid #252936",
    display: "grid",
    gap: 12,
  },
  eyebrow: {
    color: "#8b93a7",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.2,
  },
  body: {
    margin: 0,
    color: "#aab0c0",
    fontSize: 13,
    lineHeight: 1.4,
  },
  primaryLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: 0,
    borderRadius: 6,
    background: "#2f7d58",
    color: "white",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    padding: "10px 12px",
    textDecoration: "none",
  },
  list: {
    overflowY: "auto",
    padding: 12,
    display: "grid",
    gap: 10,
  },
  card: {
    border: "1px solid #252936",
    borderRadius: 8,
    background: "#151821",
    padding: 12,
    display: "grid",
    gap: 10,
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  name: {
    margin: 0,
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  meta: {
    marginTop: 3,
    color: "#8b93a7",
    fontSize: 12,
    lineHeight: 1.35,
  },
  status: {
    color: "#53d18d",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },
  actions: {
    display: "flex",
    gap: 8,
  },
  actionLink: {
    border: "1px solid #343949",
    borderRadius: 6,
    background: "transparent",
    color: "#f5f5f5",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    padding: "7px 10px",
    textDecoration: "none",
  },
  dangerButton: {
    border: "1px solid #5d2830",
    borderRadius: 6,
    background: "transparent",
    color: "#ff8c99",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    padding: "7px 10px",
  },
  message: {
    color: "#aab0c0",
    fontSize: 13,
    padding: 16,
  },
} satisfies Record<string, CSSProperties>;

function carTitle(car: InventoryCar) {
  return [car.year, car.make, car.model].filter(Boolean).join(" ") || "Untitled car";
}

// Mirror the labels defined on the `status` field in the car schema so the
// panel reads "Coming Soon" rather than the raw "coming-soon" value.
const statusLabels: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
  "coming-soon": "Coming Soon",
};

function statusLabel(status: string) {
  return statusLabels[status] ?? status;
}

function CreateCarLink() {
  const link = useIntentLink({
    intent: "create",
    params: { type: "car", template: "car", mode: "presentation" },
    searchParams: previewSearchParams,
  });

  return (
    <a {...link} style={styles.primaryLink}>
      Add new vehicle
    </a>
  );
}

function EditCarLink({ car }: { car: InventoryCar }) {
  const link = useIntentLink({
    intent: "edit",
    params: { id: car._id, type: "car", mode: "presentation" },
    searchParams: previewSearchParams,
  });

  return (
    <a {...link} style={styles.actionLink}>
      Edit
    </a>
  );
}

export function InventoryNavigator() {
  const client = useClient({ apiVersion: "2025-05-20" });
  // Points the live preview iframe at a given path. Because the preview runs in
  // draft mode, navigating to a car's detail page shows its unpublished content.
  const navigate = usePresentationNavigate();
  const [cars, setCars] = useState<InventoryCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await client.fetch<InventoryCar[]>(
        `*[_type == "car" && !(_id in path("drafts.**"))] | order(year desc, _createdAt desc) {
          _id,
          make,
          model,
          variant,
          year,
          status,
          "slug": slug.current
        }`,
      );
      setCars(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load vehicles.");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    void loadCars();

    // Keep the list in sync the way Structure mode does: re-fetch whenever a
    // car is created, edited, published, or deleted (drafts included) so adds
    // and edits made via the document pane show up without reloading Studio.
    const subscription = client
      .listen(
        `*[_type == "car"]`,
        {},
        { visibility: "query", includeResult: false },
      )
      .subscribe({
        next: () => {
          void loadCars();
        },
        // A dropped listen connection shouldn't surface as an error; the next
        // mount or manual action re-fetches anyway.
        error: () => {},
      });

    return () => subscription.unsubscribe();
  }, [client, loadCars]);

  async function deleteCar(car: InventoryCar) {
    const title = carTitle(car);
    if (!window.confirm(`Delete ${title}? This removes the published vehicle and any draft edits.`)) {
      return;
    }

    setDeletingId(car._id);
    setError(null);
    try {
      await client
        .transaction()
        .delete(`drafts.${car._id}`)
        .delete(car._id)
        .commit();
      await loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to delete ${title}.`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <aside style={styles.shell}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>Inventory Manager</div>
          <h2 style={styles.title}>Vehicles</h2>
        </div>
        <p style={styles.body}>
          Add, edit, or delete stock while keeping the live inventory page visible.
        </p>
        <CreateCarLink />
      </div>

      {loading ? <div style={styles.message}>Loading vehicles...</div> : null}
      {error ? <div style={styles.message}>{error}</div> : null}

      {!loading && cars.length === 0 ? (
        <div style={styles.message}>No vehicles yet. Add the first one above.</div>
      ) : null}

      <div style={styles.list}>
        {cars.map((car) => (
          <div key={car._id} style={styles.card}>
            <div style={styles.row}>
              <div>
                <p style={styles.name}>{carTitle(car)}</p>
                <div style={styles.meta}>{car.variant || "No variant set"}</div>
              </div>
              {car.status ? <span style={styles.status}>{statusLabel(car.status)}</span> : null}
            </div>
            <div style={styles.actions}>
              <button
                type="button"
                onClick={() => car.slug && navigate(`/inventory/${car.slug}`)}
                disabled={!car.slug}
                title={
                  car.slug
                    ? "Open this car's detail page in the preview"
                    : "Add a URL slug first"
                }
                style={{
                  ...styles.actionLink,
                  opacity: car.slug ? 1 : 0.5,
                  cursor: car.slug ? "pointer" : "not-allowed",
                }}
              >
                View page
              </button>
              <EditCarLink car={car} />
              <button
                type="button"
                onClick={() => void deleteCar(car)}
                disabled={deletingId === car._id}
                style={{
                  ...styles.dangerButton,
                  opacity: deletingId === car._id ? 0.5 : 1,
                }}
              >
                {deletingId === car._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
