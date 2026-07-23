import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { loadBootstrapCatalog } from '@/utils/catalogClient';
import { buildCatalogBootstrapPackages } from '@/utils/catalogBootstrapModel';
import PackagePage from './PackagePage';

export async function loader({ params }: LoaderFunctionArgs) {
  const result = await loadBootstrapCatalog({ timeoutMs: 10000 });
  const item = buildCatalogBootstrapPackages(result).find((entry) => entry.id === params.id) ?? null;
  return { item };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const item = data?.item;
  if (!item) return [{ title: 'AviUtl2 カタログ' }];
  const tags: ReturnType<MetaFunction> = [
    { title: `${item.name} | AviUtl2 カタログ` },
    { name: 'description', content: item.summary },
    { property: 'og:title', content: item.name },
    { property: 'og:site_name', content: 'AviUtl2 カタログ' },
    { property: 'og:description', content: item.summary },
    { property: 'og:type', content: 'website' },
  ];
  if (item.thumbnailUrl) tags.push({ property: 'og:image', content: item.thumbnailUrl });
  return tags;
};

export default PackagePage;
