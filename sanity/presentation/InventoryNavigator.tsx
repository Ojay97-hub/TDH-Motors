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
  soldDate?: string;
  slug?: string;
};

const previewSearchParams: [string, string][] = [["preview", "/inventory"]];
const LISTENER_RETRY_DELAY_MS = 4000;

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
  soldStatus: {
    color: "#ffb35c",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },
  sectionHeading: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 8,
    padding: "4px 0",
    color: "#8b93a7",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  sectionNote: {
    margin: "0 0 4px",
    color: "#6f7789",
    fontSize: 11,
    letterSpacing: 0,
    textTransform: "none",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  soldButton: {
    border: "1px solid #7a5a21",
    borderRadius: 6,
    background: "transparent",
    color: "#ffb35c",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    padding: "7px 10px",
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
  connectionNotice: {
    margin: "12px 12px 0",
    border: "1px solid #7a5a21",
    borderRadius: 8,
    background: "#2a2112",
    color: "#ffd27a",
    fontSize: 13,
    fontWeight: 700,
    padding: "10px 12px",
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

/** Today as `YYYY-MM-DD` in the editor's own timezone, not UTC. */
function todayIsoDate() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function formatSoldDate(soldDate: string) {
  const parsed = new Date(soldDate);
  if (Number.isNaN(parsed.getTime())) return soldDate;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function documentIdsToDelete(id: string) {
  // Version documents (for example `versions.agent-...`) are standalone Sanity
  // variants. Prefixing them with `drafts.` creates an invalid ID, so delete the
  // version directly. Normal published cars also have a draft companion.
  if (id.startsWith("versions.")) {
    return [id];
  }

  if (id.startsWith("drafts.")) {
    return [id, id.replace(/^drafts\./, "")];
  }

  return [`drafts.${id}`, id];
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
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionLost, setConnectionLost] = useState(false);

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
          soldDate,
          "slug": slug.current
        }`,
      );
      setCars(results);
      setConnectionLost(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load vehicles.");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    // Keep the list in sync the way Structure mode does: re-fetch whenever a
    // car is created, edited, published, or deleted (drafts included) so adds
    // and edits made via the document pane show up without reloading Studio.
    let disposed = false;
    const initialLoadTimer = setTimeout(() => void loadCars(), 0);
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let subscription: { unsubscribe: () => void } | null = null;

    function clearRetryTimer() {
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
    }

    function scheduleRetry() {
      if (disposed || retryTimer) return;
      retryTimer = setTimeout(() => {
        retryTimer = null;
        connect();
      }, LISTENER_RETRY_DELAY_MS);
    }

    function connect() {
      if (disposed) return;

      try {
        subscription?.unsubscribe();
        subscription = client
          .listen(
            `*[_type == "car"]`,
            {},
            { visibility: "query", includeResult: false },
          )
          .subscribe({
            next: () => {
              setConnectionLost(false);
              void loadCars();
            },
            error: (err) => {
              console.warn("Inventory listener connection lost:", err);
              setConnectionLost(true);
              subscription?.unsubscribe();
              subscription = null;
              scheduleRetry();
            },
          });
      } catch (err) {
        console.warn("Inventory listener failed to start:", err);
        setConnectionLost(true);
        scheduleRetry();
      }
    }

    connect();

    return () => {
      disposed = true;
      clearTimeout(initialLoadTimer);
      clearRetryTimer();
      subscription?.unsubscribe();
    };
  }, [client, loadCars]);

  /**
   * Moves a car between the Inventory page and the Recently Sold page by
   * flipping its `status`. The patch is applied to the published document (so
   * the change is live immediately, without a separate publish step) and, when
   * unpublished edits exist, to the draft too — otherwise publishing those edits
   * later would quietly undo the move.
   */
  async function setSoldState(car: InventoryCar, sold: boolean) {
    const title = carTitle(car);
    if (
      !window.confirm(
        sold
          ? `Mark ${title} as sold? It moves off the Inventory page and onto the Recently Sold page.`
          : `Move ${title} back into stock? It returns to the Inventory page and leaves Recently Sold.`,
      )
    ) {
      return;
    }

    setUpdatingId(car._id);
    setError(null);
    try {
      const publishedId = car._id.replace(/^drafts\./, "");
      const draftId = car._id.startsWith("versions.")
        ? null
        : `drafts.${publishedId}`;
      const ids = [car._id];
      // `getDocument` resolves to undefined when there is no draft — patching a
      // missing id would fail the whole transaction.
      if (draftId && draftId !== car._id && (await client.getDocument(draftId))) {
        ids.push(draftId);
      }

      let transaction = client.transaction();
      for (const id of ids) {
        transaction = transaction.patch(
          id,
          sold
            ? // Keep an existing sale date if one was set by hand.
              (patch) =>
                patch
                  .set({ status: "sold" })
                  .setIfMissing({ soldDate: todayIsoDate() })
            : (patch) => patch.set({ status: "available" }).unset(["soldDate"]),
        );
      }
      await transaction.commit();
      await loadCars();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Unable to update ${title}.`,
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteCar(car: InventoryCar) {
    const title = carTitle(car);
    const ids = documentIdsToDelete(car._id);
    if (
      !window.confirm(
        `Delete ${title}? This removes ${ids.length > 1 ? "the published vehicle and any draft edits" : "this version document"}.`,
      )
    ) {
      return;
    }

    setDeletingId(car._id);
    setError(null);
    try {
      let transaction = client.transaction();
      for (const id of ids) {
        transaction = transaction.delete(id);
      }
      await transaction.commit();
      await loadCars();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Unable to delete ${title}.`);
    } finally {
      setDeletingId(null);
    }
  }

  // Two lists, mirroring the two public pages a car can live on.
  const inStock = cars.filter((car) => car.status !== "sold");
  const sold = cars.filter((car) => car.status === "sold");

  function renderCar(car: InventoryCar) {
    const isSold = car.status === "sold";
    const busy = updatingId === car._id;

    return (
      <div key={car._id} style={styles.card}>
        <div style={styles.row}>
          <div>
            <p style={styles.name}>{carTitle(car)}</p>
            <div style={styles.meta}>{car.variant || "No variant set"}</div>
            {isSold && car.soldDate ? (
              <div style={styles.meta}>Sold {formatSoldDate(car.soldDate)}</div>
            ) : null}
          </div>
          {car.status ? (
            <span style={isSold ? styles.soldStatus : styles.status}>
              {statusLabel(car.status)}
            </span>
          ) : null}
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
            onClick={() => void setSoldState(car, !isSold)}
            disabled={busy}
            title={
              isSold
                ? "Return this car to the Inventory page"
                : "Move this car to the Recently Sold page"
            }
            style={{ ...styles.soldButton, opacity: busy ? 0.5 : 1 }}
          >
            {busy ? "Saving..." : isSold ? "Back to stock" : "Mark sold"}
          </button>
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
    );
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
      {connectionLost ? (
        <div style={styles.connectionNotice}>Connection lost. Retrying...</div>
      ) : null}
      {error ? <div style={styles.message}>{error}</div> : null}

      {!loading && cars.length === 0 ? (
        <div style={styles.message}>No vehicles yet. Add the first one above.</div>
      ) : null}

      <div style={styles.list}>
        {inStock.length > 0 ? (
          <div style={styles.sectionHeading}>
            <span>In stock</span>
            <span>{inStock.length}</span>
          </div>
        ) : null}
        {inStock.map(renderCar)}

        {sold.length > 0 ? (
          <>
            <div style={styles.sectionHeading}>
              <span>Sold</span>
              <span>{sold.length}</span>
            </div>
            <p style={styles.sectionNote}>Shown on the Recently Sold page.</p>
          </>
        ) : null}
        {sold.map(renderCar)}
      </div>
    </aside>
  );
}
