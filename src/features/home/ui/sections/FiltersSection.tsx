import type { FiltersSectionProps } from '../types';
import HomeCategoryAndSortRow from './filters/HomeCategoryAndSortRow';
import HomeQuickFiltersRow from './filters/HomeQuickFiltersRow';
import HomeSearchBar from './filters/HomeSearchBar';
import HomeTagFilters from './filters/HomeTagFilters';

export default function FiltersSection({
  searchQuery,
  categories,
  selectedCategory,
  filteredCount,
  installStatus,
  deprecationStatus,
  selectedTags,
  sortedSelectedTags,
  sortedAllTags,
  isFilterExpanded,
  isInstallMenuOpen,
  isDeprecationMenuOpen,
  isSortMenuOpen,
  sortOrder,
  onSearchQueryChange,
  onCategoryChange,
  onToggleInstallMenu,
  onCloseInstallMenu,
  onSelectInstallStatus,
  onToggleDeprecationMenu,
  onCloseDeprecationMenu,
  onSelectDeprecationStatus,
  onToggleFilterExpanded,
  onToggleSortMenu,
  onCloseSortMenu,
  onSelectSortOrder,
  onToggleTag,
  onClearTags,
}: FiltersSectionProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
      <div className="px-6 py-3">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <HomeSearchBar searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange} />
            <HomeQuickFiltersRow
              installStatus={installStatus}
              deprecationStatus={deprecationStatus}
              selectedTags={selectedTags}
              isFilterExpanded={isFilterExpanded}
              isInstallMenuOpen={isInstallMenuOpen}
              isDeprecationMenuOpen={isDeprecationMenuOpen}
              onToggleInstallMenu={onToggleInstallMenu}
              onCloseInstallMenu={onCloseInstallMenu}
              onSelectInstallStatus={onSelectInstallStatus}
              onToggleDeprecationMenu={onToggleDeprecationMenu}
              onCloseDeprecationMenu={onCloseDeprecationMenu}
              onSelectDeprecationStatus={onSelectDeprecationStatus}
              onToggleFilterExpanded={onToggleFilterExpanded}
            />
          </div>

          <HomeCategoryAndSortRow
            categories={categories}
            selectedCategory={selectedCategory}
            filteredCount={filteredCount}
            isSortMenuOpen={isSortMenuOpen}
            sortOrder={sortOrder}
            onCategoryChange={onCategoryChange}
            onToggleSortMenu={onToggleSortMenu}
            onCloseSortMenu={onCloseSortMenu}
            onSelectSortOrder={onSelectSortOrder}
          />

          <HomeTagFilters
            selectedTags={selectedTags}
            sortedSelectedTags={sortedSelectedTags}
            sortedAllTags={sortedAllTags}
            isFilterExpanded={isFilterExpanded}
            onToggleTag={onToggleTag}
            onClearTags={onClearTags}
          />
        </div>
      </div>
    </div>
  );
}
