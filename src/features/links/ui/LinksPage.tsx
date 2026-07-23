import { ExternalLink } from 'lucide-react';
import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { page } from '@/components/ui/_styles';
import { cn } from '@/lib/cn';
import { openExternalLink } from '@/utils/externalLink';
import { LINK_SECTIONS, type LinkEntry } from '../model/links';

function isInternalHref(href: string): boolean {
  return href.startsWith('/');
}

function getDisplayHref(link: LinkEntry): string {
  if (isInternalHref(link.href)) {
    return `app${link.href}`;
  }

  return link.href.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export default function LinksPage() {
  const { t } = useTranslation('links');
  const navigate = useNavigate();
  const sectionStyles = useMemo(
    () =>
      Object.fromEntries(
        LINK_SECTIONS.map((section) => [section.id, { '--links-base': section.baseColor } as CSSProperties]),
      ) as Record<(typeof LINK_SECTIONS)[number]['id'], CSSProperties>,
    [],
  );

  const handleOpenLink = async (link: LinkEntry) => {
    if (isInternalHref(link.href)) {
      navigate(link.href);
      return;
    }

    await openExternalLink(link.href);
  };

  return (
    <div className={cn(page.container6xl, page.selectNone, page.enterFromBottom, 'space-y-10 pb-2')}>
      <header className="border-b border-slate-100 pb-6 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            {t('page.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('page.description')}</p>
        </div>
      </header>

      {LINK_SECTIONS.map((section) => {
        const SectionIcon = section.icon;

        return (
          <section key={section.id} className="links-section space-y-4" style={sectionStyles[section.id]}>
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="links-section__iconSurface flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm">
                <SectionIcon size={18} className="links-section__icon" />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-medium text-slate-700 dark:text-slate-200">{t(section.titleKey)}</h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{t(section.descriptionKey)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {section.links.map((link) => {
                const LinkIcon = link.icon;
                const external = !isInternalHref(link.href);
                const displayHref = getDisplayHref(link);

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => void handleOpenLink(link)}
                    title={displayHref}
                    className={cn(
                      'links-card group relative flex min-h-[196px] cursor-pointer flex-col justify-between overflow-hidden rounded-[24px] border p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    )}
                  >
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="links-card__iconWrap flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border backdrop-blur-sm transition-all duration-200">
                        <LinkIcon size={28} />
                      </div>

                      {external ? (
                        <div className="links-card__launch flex h-10 w-10 items-center justify-center rounded-full border p-2 shadow-sm transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ExternalLink size={18} />
                        </div>
                      ) : null}
                    </div>

                    <div className="relative mt-4 flex-1 space-y-2">
                      <div className="links-card__copy space-y-2">
                        <h3 className="links-card__title text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                          {t(link.titleKey)}
                        </h3>
                        <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {t(link.descriptionKey)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
