import useHomePage from './hooks/useHomePage';
import { EmptyStateSection, FiltersSection, PackageGridSection } from './sections';

export default function HomePage() {
  const state = useHomePage();
  const filteredCount = state.filteredPackages.length;

  return (
    <div className="flex h-full min-h-0 flex-col select-none">
      <FiltersSection
        searchQuery={state.searchQuery}
        categories={state.categories}
        selectedCategory={state.selectedCategory}
        filteredCount={filteredCount}
        installStatus={state.installStatus}
        deprecationStatus={state.deprecationStatus}
        selectedTags={state.selectedTags}
        sortedSelectedTags={state.sortedSelectedTags}
        sortedAllTags={state.sortedAllTags}
        isFilterExpanded={state.isFilterExpanded}
        isInstallMenuOpen={state.isInstallMenuOpen}
        isDeprecationMenuOpen={state.isDeprecationMenuOpen}
        isSortMenuOpen={state.isSortMenuOpen}
        sortOrder={state.sortOrder}
        onSearchQueryChange={state.setSearchQuery}
        onCategoryChange={state.setCategory}
        onToggleInstallMenu={state.toggleInstallMenu}
        onCloseInstallMenu={state.closeInstallMenu}
        onSelectInstallStatus={state.selectInstallStatus}
        onToggleDeprecationMenu={state.toggleDeprecationMenu}
        onCloseDeprecationMenu={state.closeDeprecationMenu}
        onSelectDeprecationStatus={state.selectDeprecationStatus}
        onToggleFilterExpanded={state.toggleFilterExpanded}
        onToggleSortMenu={state.toggleSortMenu}
        onCloseSortMenu={state.closeSortMenu}
        onSelectSortOrder={state.selectSortOrder}
        onToggleTag={state.toggleTag}
        onClearTags={state.clearTags}
      />

      <div
        ref={state.scrollContainerRef}
        className="min-h-0 flex-1 overflow-y-auto px-6 pt-6 pb-6 scroll-smooth [scrollbar-gutter:stable]"
      >
        {filteredCount > 0 ? (
          <PackageGridSection
            filteredPackages={state.filteredPackages}
            pausedPackageUpdatesLoaded={state.pausedPackageUpdatesLoaded}
            pausedPackageUpdateIds={state.pausedPackageUpdateIdSet}
            listSearch={state.listSearch}
            onBeforeOpenDetail={state.saveHomeScrollPosition}
          />
        ) : (
          <EmptyStateSection onClearConditions={state.clearConditions} />
        )}
      </div>
    </div>
  );
}
