import type { RefObject } from 'react';
import type { PackageItem } from '@/utils/catalogStore';
import type { PackageTypeFilterKey } from '@/utils/query';

export type HomeSortOrder = 'popularity_desc' | 'trend_desc' | 'added_desc' | 'updated_desc';

export type HomeInstallStatus = 'all' | 'installed' | 'not_installed';
export type HomeDeprecationStatus = 'all' | 'deprecated' | 'active';
export type SortKey = 'popularity' | 'newest' | 'trend' | 'added';
export type SortDir = 'desc' | 'asc';
export type UrlOverrideValue = string | string[] | null | undefined;

export interface ParsedHomeQuery {
  q: string;
  sortKey: SortKey;
  dir: SortDir;
  type: PackageTypeFilterKey;
  tags: string[];
  installStatus: HomeInstallStatus;
  deprecationStatus: HomeDeprecationStatus;
}

export type ActivePage =
  | 'home'
  | 'links'
  | 'updates'
  | 'register'
  | 'niconi-commons'
  | 'feedback'
  | 'settings'
  | 'package'
  | '';

export interface AppDirsPayload {
  aviutl2_data?: string;
}

export interface HomeRestoreState {
  restoreSearchFromQuery?: true;
  restoreScroll?: true;
}

export const HOME_SEARCH_RESTORE_STATE: HomeRestoreState = { restoreSearchFromQuery: true };
export const HOME_LIST_RESTORE_STATE: HomeRestoreState = { restoreSearchFromQuery: true, restoreScroll: true };

export interface HomeContextValue {
  filteredPackages: PackageItem[];
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  saveHomeScrollPosition: () => void;
  searchQuery: string;
  setSearchQuery: (next: string) => void;
  selectedCategory: PackageTypeFilterKey;
  clearFilters: () => void;
  isFilterActive: boolean;
  pausedPackageUpdatesLoaded: boolean;
  pausedPackageUpdateIdSet: ReadonlySet<string>;
  updateAvailableCount: number;
  sortOrder: HomeSortOrder;
  setSortOrder: (order: HomeSortOrder) => void;
  categories: readonly PackageTypeFilterKey[];
  allTags: string[];
  selectedTags: string[];
  installStatus: HomeInstallStatus;
  deprecationStatus: HomeDeprecationStatus;
  toggleTag: (tag: string) => void;
  updateUrl: (overrides: Record<string, UrlOverrideValue>) => void;
}
