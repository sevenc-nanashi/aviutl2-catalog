import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoaderData, type ClientLoaderFunctionArgs, type MetaFunction } from 'react-router';
import { APP_ROUTE_PATHS } from '@/routePaths';
import ErrorDialog from '@/components/ErrorDialog';
import { latestVersionOf, loadCatalogData } from '@/utils/catalog';
import { useCatalog, useCatalogDispatch, toUpdatedAt, type PackageItem } from '@/utils/catalogStore';
import { hasInstaller } from '@/utils/installer';
import { buildLicenseBody } from '@/utils/licenseTemplates';
import { formatDate, normalize } from '@/utils/text';
import { HOME_LIST_RESTORE_STATE } from '@/layouts/app-shell/types';
import { openExternalLink } from '@/utils/externalLink';
import {
  collectPackageImages,
  readPackageDetailSource,
  readPackageListSearchFromDetail,
  shouldOpenExternalLink,
} from '../model/helpers';
import type { PackageLicenseEntry } from '../model/types';
import LicenseModal from './components/LicenseModal';
import usePackageAutoInstall from './hooks/usePackageAutoInstall';
import usePackageDescription from './hooks/usePackageDescription';
import usePackageInstallActions from './hooks/usePackageInstallActions';
import { PackageContentSection, PackageHeaderSection, PackageSidebarSection } from './sections';
import { page } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';
import { isWeb } from '@/lib/target';

const MARKDOWN_BASE_URL = 'https://raw.githubusercontent.com/Neosku/aviutl2-catalog-data/main/md/';

async function loaderImpl({ params }: ClientLoaderFunctionArgs) {
  const id = String(params.id || '');
  const { items } = await loadCatalogData({ timeoutMs: 10000 });
  const item = items.find((entry) => entry.id === id) ?? null;
  return { item };
}

export const clientLoader = loaderImpl;
export const loader = isWeb ? loaderImpl : undefined;

export const meta: MetaFunction<typeof loaderImpl> = ({ loaderData: data }) => {
  const item = data?.item;
  if (!item) return [{ title: 'AviUtl2 カタログ' }];

  const thumbnail = item.images.find((g) => g.thumbnail)?.thumbnail;
  const tags: ReturnType<MetaFunction> = [
    { title: `${item.name} | AviUtl2 カタログ` },
    { name: 'description', content: item.summary },
    { property: 'og:title', content: item.name },
    { property: 'og:site_name', content: 'AviUtl2 カタログ' },
    { property: 'og:description', content: item.summary },
    { property: 'og:type', content: 'website' },
  ];
  if (thumbnail) tags.push({ property: 'og:image', content: thumbnail });
  return tags;
};

export default function PackagePage() {
  const { item: baseItem } = useLoaderData<typeof loaderImpl>();
  const location = useLocation();
  const { detectedMap } = useCatalog();
  const dispatch = useCatalogDispatch();
  const [openLicense, setOpenLicense] = useState<PackageLicenseEntry | null>(null);

  const listSearch = useMemo(() => readPackageListSearchFromDetail(location.search), [location.search]);
  const detailSource = useMemo(() => readPackageDetailSource(location.search), [location.search]);
  const listLink = useMemo(() => {
    if (detailSource === 'updates') return APP_ROUTE_PATHS.updates;
    if (detailSource === 'niconi-commons') return APP_ROUTE_PATHS.niconiCommons;
    return listSearch ? { pathname: '/', search: listSearch } : APP_ROUTE_PATHS.home;
  }, [detailSource, listSearch]);
  const listLabel =
    detailSource === 'updates'
      ? 'アップデートセンター'
      : detailSource === 'niconi-commons'
        ? 'ニコニコモンズ'
        : 'パッケージ一覧';
  const listLinkState = detailSource === 'home' ? HOME_LIST_RESTORE_STATE : undefined;

  const item = useMemo<PackageItem | undefined>(() => {
    if (!baseItem) return undefined;
    const detectedVersion = detectedMap[baseItem.id] || '';
    const latest = latestVersionOf(baseItem) || '';
    return {
      ...baseItem,
      updatedAt: toUpdatedAt(baseItem),
      nameKey: normalize(baseItem.name || ''),
      authorKey: normalize(baseItem.author || ''),
      summaryKey: normalize(baseItem.summary || ''),
      installed: detectedVersion !== '',
      installedVersion: detectedVersion,
      isLatest: !!detectedVersion && !!latest && detectedVersion === latest,
      catalogIndex: 0,
    };
  }, [baseItem, detectedMap]);

  const { heroImage, carouselImages } = useMemo(() => collectPackageImages(item?.images), [item?.images]);

  const descriptionSource = item?.description || '';
  const description = usePackageDescription({
    descriptionSource,
    baseUrl: MARKDOWN_BASE_URL,
  });

  const actions = usePackageInstallActions({
    item,
    dispatch,
  });

  const canInstall = item ? hasInstaller(item) : false;

  usePackageAutoInstall({
    item,
    locationSearch: location.search,
    canInstall,
    downloading: actions.busyAction === 'download',
    onDownload: actions.onDownload,
  });

  const licenseEntries = useMemo<PackageLicenseEntry[]>(() => {
    if (!item) return [];
    const rawLicenses = Array.isArray(item.licenses) ? item.licenses : [];
    const entries = rawLicenses.map((license, idx) => ({
      ...license,
      key: `${license.type || 'license'}-${idx}`,
      body: String(buildLicenseBody(license) || ''),
    }));
    return entries;
  }, [item]);

  const renderableLicenses = useMemo(() => licenseEntries.filter((entry) => entry.body), [licenseEntries]);

  const licenseTypesLabel = useMemo(() => {
    const types = Array.isArray(item?.licenses) ? item.licenses.map((license) => license?.type).filter(Boolean) : [];
    return types.length ? types.join(', ') : '?';
  }, [item]);

  const handleOpenDescriptionLink = useCallback(async (href: string) => {
    if (!shouldOpenExternalLink(href)) return;
    await openExternalLink(href);
  }, []);

  if (!item) {
    return (
      <div className={page.container3xl}>
        <div className="error">パッケージが見つかりませんでした。</div>
      </div>
    );
  }

  const updated = item.updatedAt ? formatDate(item.updatedAt).replace(/-/g, '/') : '?';
  const latest = latestVersionOf(item) || '?';

  return (
    <div className={cn(page.container6xl, 'space-y-6 min-h-[calc(100vh-6rem)] flex flex-col select-none')}>
      <PackageHeaderSection item={item} listLink={listLink} listLabel={listLabel} heroImage={heroImage} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] flex-1">
        <PackageContentSection
          item={item}
          carouselImages={carouselImages}
          descriptionHtml={description.descriptionHtml}
          descriptionLoading={description.descriptionLoading}
          descriptionError={description.descriptionError}
          onOpenLink={handleOpenDescriptionLink}
        />
        <PackageSidebarSection
          item={item}
          listLink={listLink}
          listLabel={listLabel}
          listLinkState={listLinkState}
          updated={updated}
          latest={latest}
          canInstall={canInstall}
          busyAction={actions.busyAction}
          isBusy={actions.isBusy}
          progress={actions.progressView}
          renderableLicenses={renderableLicenses}
          licenseTypesLabel={licenseTypesLabel}
          onOpenLicense={setOpenLicense}
          onDownload={actions.onDownload}
          onUpdate={actions.onUpdate}
          onRemove={actions.onRemove}
        />
      </div>

      {openLicense ? <LicenseModal license={openLicense} onClose={() => setOpenLicense(null)} /> : null}
      <ErrorDialog open={Boolean(actions.error)} message={actions.error} onClose={() => actions.setError('')} />
    </div>
  );
}
