import { useCallback, useEffect, useState } from 'react';
import { detectInstalledVersionsMap } from '@/utils/installed-map';
import { safeLog } from '../../model/helpers';
import type { InitSetupStep, PackageItemsMap, PackageVersionsMap } from '../../model/types';

interface UseInitSetupVersionDetectionParams {
  step: InitSetupStep;
  requiredPluginIds: string[];
  packageItems: PackageItemsMap;
  onDetected: (versions: PackageVersionsMap) => void;
}

export default function useInitSetupVersionDetection({
  step,
  requiredPluginIds,
  packageItems,
  onDetected,
}: UseInitSetupVersionDetectionParams) {
  const [packageVersions, setPackageVersions] = useState<PackageVersionsMap>({});
  const [versionsDetected, setVersionsDetected] = useState(false);

  const markVersionsDirty = useCallback(() => {
    setVersionsDetected(false);
  }, []);

  useEffect(() => {
    if (step === 'packages') {
      markVersionsDirty();
    }
  }, [markVersionsDirty, step]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (step !== 'packages') return;
      if (versionsDetected) return;
      try {
        const itemsForDetect = requiredPluginIds.flatMap((id) => {
          const item = packageItems[id];
          return item ? [item] : [];
        });
        if (itemsForDetect.length === 0) return;
        const versions = await detectInstalledVersionsMap(itemsForDetect);
        if (cancelled) return;
        setPackageVersions(versions);
        onDetected(versions);
        setVersionsDetected(true);
      } catch (detectError) {
        await safeLog('[init-window] detect_versions_map failed', detectError);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onDetected, packageItems, requiredPluginIds, step, versionsDetected]);

  return {
    packageVersions,
    markVersionsDirty,
  };
}
