export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function emptyPage<T>(page = 1, pageSize = 12): Paginated<T> {
  return { items: [], total: 0, page, pageSize, totalPages: 0 };
}
