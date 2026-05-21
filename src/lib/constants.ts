export const VALID_STATUSES = ["new", "contacted", "done"] as const;
export type Status = (typeof VALID_STATUSES)[number];
