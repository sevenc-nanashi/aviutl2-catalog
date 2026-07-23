import PackageCard from '@/components/package-card/PackageCard';
import type { PackageGridSectionProps } from '../types';

export default function PackageGridSection({
  filteredPackages,
  pausedPackageUpdatesLoaded,
  pausedPackageUpdateIds,
  listSearch,
  onBeforeOpenDetail,
}: PackageGridSectionProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(500px,1fr))] gap-6">
      {filteredPackages.map((item) => (
        <PackageCard
          key={item.id}
          item={item}
          isPauseStateLoaded={pausedPackageUpdatesLoaded}
          isUpdatePaused={pausedPackageUpdateIds.has(item.id)}
          listSearch={listSearch}
          onBeforeOpenDetail={onBeforeOpenDetail}
        />
      ))}
    </div>
  );
}
