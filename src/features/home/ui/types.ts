import type { PackageItem } from '@/utils/catalogStore';
import type {
  HomeContextValue,
  HomeDeprecationStatus,
  HomeInstallStatus,
  HomeSortOrder,
} from '@/layouts/app-shell/types';
import type { PackageTypeFilterKey } from '@/utils/query';

export type { HomeContextValue, HomeDeprecationStatus, HomeInstallStatus, HomeSortOrder };

export interface FiltersSectionProps {
  searchQuery: string;
  categories: readonly PackageTypeFilterKey[];
  selectedCategory: PackageTypeFilterKey;
  filteredCount: number;
  installStatus: HomeInstallStatus;
  deprecationStatus: HomeDeprecationStatus;
  selectedTags: string[];
  sortedSelectedTags: string[];
  sortedAllTags: string[];
  isFilterExpanded: boolean;
  isInstallMenuOpen: boolean;
  isDeprecationMenuOpen: boolean;
  isSortMenuOpen: boolean;
  sortOrder: HomeSortOrder;
  onSearchQueryChange: (next: string) => void;
  onCategoryChange: (category: PackageTypeFilterKey) => void;
  onToggleInstallMenu: () => void;
  onCloseInstallMenu: () => void;
  onSelectInstallStatus: (status: HomeInstallStatus) => void;
  onToggleDeprecationMenu: () => void;
  onCloseDeprecationMenu: () => void;
  onSelectDeprecationStatus: (status: HomeDeprecationStatus) => void;
  onToggleFilterExpanded: () => void;
  onToggleSortMenu: () => void;
  onCloseSortMenu: () => void;
  onSelectSortOrder: (order: HomeSortOrder) => void;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

export type HomeSearchBarProps = Pick<FiltersSectionProps, 'searchQuery' | 'onSearchQueryChange'>;

export type HomeQuickFiltersRowProps = Pick<
  FiltersSectionProps,
  | 'installStatus'
  | 'deprecationStatus'
  | 'selectedTags'
  | 'isFilterExpanded'
  | 'isInstallMenuOpen'
  | 'isDeprecationMenuOpen'
  | 'onToggleInstallMenu'
  | 'onCloseInstallMenu'
  | 'onSelectInstallStatus'
  | 'onToggleDeprecationMenu'
  | 'onCloseDeprecationMenu'
  | 'onSelectDeprecationStatus'
  | 'onToggleFilterExpanded'
>;

export type HomeCategorySortRowProps = Pick<
  FiltersSectionProps,
  | 'categories'
  | 'selectedCategory'
  | 'filteredCount'
  | 'isSortMenuOpen'
  | 'sortOrder'
  | 'onCategoryChange'
  | 'onToggleSortMenu'
  | 'onCloseSortMenu'
  | 'onSelectSortOrder'
>;

export type HomeTagFiltersProps = Pick<
  FiltersSectionProps,
  'selectedTags' | 'sortedSelectedTags' | 'sortedAllTags' | 'isFilterExpanded' | 'onToggleTag' | 'onClearTags'
>;

export interface PackageGridSectionProps {
  filteredPackages: PackageItem[];
  pausedPackageUpdatesLoaded: boolean;
  pausedPackageUpdateIds: ReadonlySet<string>;
  listSearch: string;
  onBeforeOpenDetail: () => void;
}

export interface EmptyStateSectionProps {
  onClearConditions: () => void;
}
