import type { Prisma } from "@/generated/prisma/client";

export class PrismaQueryBuilder<TWhere extends Record<string, any>> {
  private _where: Record<string, any> = {};
  private _orderBy: Record<string, "asc" | "desc">[] = [];

  constructor() {}

  /**
   * Adds a `contains` filter with `mode: "insensitive"`.
   * Good for text search.
   */
  contains(field: keyof TWhere, value: string | undefined | null) {
    if (value) {
      this._where[field as string] = { contains: value, mode: "insensitive" };
    }
    return this;
  }

  /**
   * Adds an `in` filter.
   * Good for filtering by multiple exact values (e.g., roles or categories).
   */
  in(field: keyof TWhere, values: any[] | undefined | null) {
    if (values && values.length > 0) {
      this._where[field as string] = { in: values };
    }
    return this;
  }

  /**
   * Maps an array of string values (from UI filters) to a boolean field.
   * If the user selects the `trueCondition`, it filters for `true`.
   * Otherwise, it filters for `{ not: true }` (false).
   */
  boolean(
    field: keyof TWhere,
    values: string[] | undefined | null,
    trueCondition: string
  ) {
    if (values && values.length === 1) {
      this._where[field as string] =
        values[0] === trueCondition ? true : { not: true };
    }
    return this;
  }

  /**
   * Maps a tuple of timestamps (from UI date pickers) to a date range filter (`gte`, `lte`).
   */
  dateRange(field: keyof TWhere, range: (number | null)[] | undefined | null) {
    if (range && range.length > 0) {
      const dateFilter: Record<string, Date> = {};
      if (range[0]) dateFilter.gte = new Date(range[0]);
      if (range[1]) dateFilter.lte = new Date(range[1]);

      if (Object.keys(dateFilter).length > 0) {
        this._where[field as string] = dateFilter;
      }
    }
    return this;
  }

  /**
   * Adds a direct exact match filter.
   */
  equals(field: keyof TWhere, value: any) {
    if (value !== undefined && value !== null && value !== "") {
      this._where[field as string] = value;
    }
    return this;
  }

  /**
   * Parses standard TanStack Table sort states into Prisma `orderBy`.
   */
  sort(
    sortArray: { id: string; desc: boolean }[] | undefined | null,
    defaultSort?: Record<string, "asc" | "desc">[]
  ) {
    if (sortArray && sortArray.length > 0) {
      this._orderBy = sortArray.map((item) => ({
        [item.id]: item.desc ? "desc" : "asc",
      }));
    } else if (defaultSort) {
      this._orderBy = defaultSort;
    }
    return this;
  }

  /**
   * Returns the constructed Prisma query parts.
   */
  build(): { where: TWhere; orderBy: Record<string, "asc" | "desc">[] } {
    return {
      where: this._where as TWhere,
      orderBy: this._orderBy,
    };
  }
}
