import type {
	ColumnFiltersState,
	OnChangeFn,
	PaginationState,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "@/lib/router";

type UseTableUrlStateParams = {
	pagination?: {
		pageKey?: string;
		pageSizeKey?: string;
		defaultPage?: number;
		defaultPageSize?: number;
	};
	globalFilter?: {
		enabled?: boolean;
		key?: string;
		trim?: boolean;
	};
	columnFilters?: Array<
		| {
				columnId: string;
				searchKey: string;
				type?: "string";
				serialize?: (value: unknown) => unknown;
				deserialize?: (value: unknown) => unknown;
		  }
		| {
				columnId: string;
				searchKey: string;
				type: "array";
				serialize?: (value: unknown) => unknown;
				deserialize?: (value: unknown) => unknown;
		  }
	>;
};

type UseTableUrlStateReturn = {
	globalFilter?: string;
	onGlobalFilterChange?: OnChangeFn<string>;
	columnFilters: ColumnFiltersState;
	onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
	pagination: PaginationState;
	onPaginationChange: OnChangeFn<PaginationState>;
	ensurePageInRange: (
		pageCount: number,
		opts?: { resetTo?: "first" | "last" },
	) => void;
};

export function useTableUrlState(
	params: UseTableUrlStateParams,
): UseTableUrlStateReturn {
	const [searchParams, setSearchParams] = useSearchParams();
	const {
		pagination: paginationCfg,
		globalFilter: globalFilterCfg,
		columnFilters: columnFiltersCfg = [],
	} = params;

	const pageKey = paginationCfg?.pageKey ?? "page";
	const pageSizeKey = paginationCfg?.pageSizeKey ?? "pageSize";
	const defaultPage = paginationCfg?.defaultPage ?? 1;
	const defaultPageSize = paginationCfg?.defaultPageSize ?? 10;

	const globalFilterKey = globalFilterCfg?.key ?? "filter";
	const globalFilterEnabled = globalFilterCfg?.enabled ?? true;
	const trimGlobal = globalFilterCfg?.trim ?? true;

	// Helper to get search param value
	const getParam = useCallback(
		(key: string) => searchParams.get(key),
		[searchParams],
	);

	// Build initial column filters from the current search params
	const initialColumnFilters: ColumnFiltersState = useMemo(() => {
		const collected: ColumnFiltersState = [];
		for (const cfg of columnFiltersCfg) {
			const raw = getParam(cfg.searchKey);
			const deserialize = cfg.deserialize ?? ((v: unknown) => v);
			if (cfg.type === "string") {
				const value = (deserialize(raw) as string) ?? "";
				if (typeof value === "string" && value.trim() !== "") {
					collected.push({ id: cfg.columnId, value });
				}
			} else {
				// default to array type
				const rawValue = raw ? raw.split(",") : [];
				const value = (deserialize(rawValue) as unknown[]) ?? [];
				if (Array.isArray(value) && value.length > 0) {
					collected.push({ id: cfg.columnId, value });
				}
			}
		}
		return collected;
	}, [columnFiltersCfg, getParam]);

	const [columnFilters, setColumnFilters] =
		useState<ColumnFiltersState>(initialColumnFilters);

	const pagination: PaginationState = useMemo(() => {
		const rawPage = getParam(pageKey);
		const rawPageSize = getParam(pageSizeKey);
		const pageNum = rawPage ? Number(rawPage) : defaultPage;
		const pageSizeNum = rawPageSize ? Number(rawPageSize) : defaultPageSize;
		return { pageIndex: Math.max(0, pageNum - 1), pageSize: pageSizeNum };
	}, [getParam, pageKey, pageSizeKey, defaultPage, defaultPageSize]);

	const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
		const next = typeof updater === "function" ? updater(pagination) : updater;
		const nextPage = next.pageIndex + 1;
		const nextPageSize = next.pageSize;
		setSearchParams(
			(prev) => {
				if (nextPage <= defaultPage) {
					prev.delete(pageKey);
				} else {
					prev.set(pageKey, String(nextPage));
				}
				if (nextPageSize === defaultPageSize) {
					prev.delete(pageSizeKey);
				} else {
					prev.set(pageSizeKey, String(nextPageSize));
				}
				return prev;
			},
			{ replace: true },
		);
	};

	const [globalFilter, setGlobalFilter] = useState<string | undefined>(() => {
		if (!globalFilterEnabled) return undefined;
		const raw = getParam(globalFilterKey);
		return typeof raw === "string" ? raw : "";
	});

	const onGlobalFilterChange: OnChangeFn<string> | undefined =
		globalFilterEnabled
			? (updater) => {
					const next =
						typeof updater === "function"
							? updater(globalFilter ?? "")
							: updater;
					const value = trimGlobal ? next.trim() : next;
					setGlobalFilter(value);
					setSearchParams(
						(prev) => {
							prev.delete(pageKey);
							if (value) {
								prev.set(globalFilterKey, value);
							} else {
								prev.delete(globalFilterKey);
							}
							return prev;
						},
						{ replace: true },
					);
				}
			: undefined;

	const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
		const next =
			typeof updater === "function" ? updater(columnFilters) : updater;
		setColumnFilters(next);

		setSearchParams(
			(prev) => {
				prev.delete(pageKey);
				for (const cfg of columnFiltersCfg) {
					const found = next.find((f) => f.id === cfg.columnId);
					const serialize = cfg.serialize ?? ((v: unknown) => v);
					if (cfg.type === "string") {
						const value =
							typeof found?.value === "string" ? (found.value as string) : "";
						if (value.trim() !== "") {
							prev.set(cfg.searchKey, String(serialize(value)));
						} else {
							prev.delete(cfg.searchKey);
						}
					} else {
						const value = Array.isArray(found?.value)
							? (found!.value as unknown[])
							: [];
						if (value.length > 0) {
							const serialized = serialize(value);
							prev.set(
								cfg.searchKey,
								Array.isArray(serialized)
									? serialized.join(",")
									: String(serialized),
							);
						} else {
							prev.delete(cfg.searchKey);
						}
					}
				}
				return prev;
			},
			{ replace: true },
		);
	};

	const ensurePageInRange = (
		pageCount: number,
		opts: { resetTo?: "first" | "last" } = { resetTo: "first" },
	) => {
		const currentPage = getParam(pageKey);
		const pageNum = currentPage ? Number(currentPage) : defaultPage;
		if (pageCount > 0 && pageNum > pageCount) {
			setSearchParams(
				(prev) => {
					if (opts.resetTo === "last") {
						prev.set(pageKey, String(pageCount));
					} else {
						prev.delete(pageKey);
					}
					return prev;
				},
				{ replace: true },
			);
		}
	};

	return {
		globalFilter: globalFilterEnabled ? (globalFilter ?? "") : undefined,
		onGlobalFilterChange,
		columnFilters,
		onColumnFiltersChange,
		pagination,
		onPaginationChange,
		ensurePageInRange,
	};
}
