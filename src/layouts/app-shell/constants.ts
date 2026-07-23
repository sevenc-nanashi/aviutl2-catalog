import type { HomeDeprecationStatus, HomeInstallStatus, HomeSortOrder, SortDir, SortKey } from './types';

export const SORT_OPTIONS: readonly HomeSortOrder[] = ['popularity_desc', 'trend_desc', 'added_desc', 'updated_desc'];
export const INSTALL_STATUS_OPTIONS: readonly HomeInstallStatus[] = ['all', 'installed', 'not_installed'];
export const DEPRECATION_STATUS_OPTIONS: readonly HomeDeprecationStatus[] = ['active', 'deprecated', 'all'];
const INSTALL_STATUS_QUERY_VALUES: Record<HomeInstallStatus, string> = {
  all: '',
  installed: '1',
  not_installed: '0',
};
const DEPRECATION_STATUS_QUERY_VALUES: Record<HomeDeprecationStatus, string> = {
  all: '0',
  deprecated: '1',
  active: '',
};

export function sortOrderFromQuery(sortKey: string): HomeSortOrder {
  if (sortKey === 'popularity') return 'popularity_desc';
  if (sortKey === 'trend') return 'trend_desc';
  if (sortKey === 'added') return 'added_desc';
  if (sortKey === 'newest') return 'updated_desc';
  return 'popularity_desc';
}

export function installStatusFromQueryValue(value: string | null): HomeInstallStatus {
  if (value === '1') return 'installed';
  if (value === '0') return 'not_installed';
  return 'all';
}

export function installStatusToQueryValue(status: HomeInstallStatus): string {
  return INSTALL_STATUS_QUERY_VALUES[status];
}

export function deprecationStatusFromQueryValue(value: string | null): HomeDeprecationStatus {
  if (value === '1') return 'deprecated';
  if (value === '0') return 'all';
  return 'active';
}

export function deprecationStatusToQueryValue(status: HomeDeprecationStatus): string {
  return DEPRECATION_STATUS_QUERY_VALUES[status];
}

export function sortParamsFromOrder(order: HomeSortOrder): { sortKey: SortKey; dir: SortDir } {
  switch (order) {
    case 'popularity_desc':
      return { sortKey: 'popularity', dir: 'desc' };
    case 'trend_desc':
      return { sortKey: 'trend', dir: 'desc' };
    case 'added_desc':
      return { sortKey: 'added', dir: 'desc' };
    case 'updated_desc':
    default:
      return { sortKey: 'newest', dir: 'desc' };
  }
}
