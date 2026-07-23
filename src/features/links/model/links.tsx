import type { ComponentType } from 'react';
import type { ParseKeys } from 'i18next';
import { BookOpenText, Globe, MessagesSquare, MessageSquareMore, PlusCircle } from 'lucide-react';
import { SiDiscord, SiGithub } from 'react-icons/si';
import { APP_ROUTE_PATHS } from '@/routePaths';

type LinkIconProps = {
  size?: number;
  className?: string;
};

type LinkIconType = ComponentType<LinkIconProps>;
type LinksTranslationKey = ParseKeys<'links'>;

export interface LinkEntry {
  id: string;
  titleKey: LinksTranslationKey;
  descriptionKey: LinksTranslationKey;
  href: string;
  icon: LinkIconType;
}

export interface LinkSection {
  id: string;
  titleKey: LinksTranslationKey;
  descriptionKey: LinksTranslationKey;
  icon: LinkIconType;
  baseColor: string;
  links: readonly LinkEntry[];
}

export const LINK_SECTIONS: readonly LinkSection[] = [
  {
    id: 'official',
    titleKey: 'sections.official.title',
    descriptionKey: 'sections.official.description',
    icon: Globe,
    baseColor: 'oklch(0.62 0.17 252)',
    links: [
      {
        id: 'official-site',
        titleKey: 'entries.official-site.title',
        descriptionKey: 'entries.official-site.description',
        href: 'https://spring-fragrance.mints.ne.jp/aviutl/',
        icon: Globe,
      },
      {
        id: 'official-changelog',
        titleKey: 'entries.official-changelog.title',
        descriptionKey: 'entries.official-changelog.description',
        href: 'https://docs.aviutl2.jp/changelog',
        icon: BookOpenText,
      },
    ],
  },
  {
    id: 'community',
    titleKey: 'sections.community.title',
    descriptionKey: 'sections.community.description',
    icon: SiDiscord,
    baseColor: 'oklch(0.5774 0.20 273.85)',
    links: [
      {
        id: 'community-discord',
        titleKey: 'entries.community-discord.title',
        descriptionKey: 'entries.community-discord.description',
        href: 'https://discord.gg/au2-daro',
        icon: SiDiscord,
      },
    ],
  },
  {
    id: 'support',
    titleKey: 'sections.support.title',
    descriptionKey: 'sections.support.description',
    icon: MessageSquareMore,
    baseColor: 'oklch(0.7132 0.2 142.67)',
    links: [
      {
        id: 'support-feedback',
        titleKey: 'entries.support-feedback.title',
        descriptionKey: 'entries.support-feedback.description',
        href: APP_ROUTE_PATHS.feedback,
        icon: MessagesSquare,
      },
      {
        id: 'support-register',
        titleKey: 'entries.support-register.title',
        descriptionKey: 'entries.support-register.description',
        href: APP_ROUTE_PATHS.register,
        icon: PlusCircle,
      },
    ],
  },
  {
    id: 'developers',
    titleKey: 'sections.developers.title',
    descriptionKey: 'sections.developers.description',
    icon: BookOpenText,
    baseColor: 'oklch(0.62 0.19 312)',
    links: [
      {
        id: 'developers-register-guide',
        titleKey: 'entries.developers-register-guide.title',
        descriptionKey: 'entries.developers-register-guide.description',
        href: 'https://github.com/Neosku/aviutl2-catalog-data/blob/main/register-package.md',
        icon: BookOpenText,
      },
      {
        id: 'developers-update-status',
        titleKey: 'entries.developers-update-status.title',
        descriptionKey: 'entries.developers-update-status.description',
        href: 'https://github.com/Neosku/aviutl2-catalog-data/blob/main/%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8.md',
        icon: BookOpenText,
      },
    ],
  },
  {
    id: 'catalog',
    titleKey: 'sections.catalog.title',
    descriptionKey: 'sections.catalog.description',
    icon: SiGithub,
    baseColor: 'oklch(0.56 0.02 260)',
    links: [
      {
        id: 'catalog-github-app',
        titleKey: 'entries.catalog-github-app.title',
        descriptionKey: 'entries.catalog-github-app.description',
        href: 'https://github.com/Neosku/aviutl2-catalog',
        icon: SiGithub,
      },
      {
        id: 'catalog-github-data',
        titleKey: 'entries.catalog-github-data.title',
        descriptionKey: 'entries.catalog-github-data.description',
        href: 'https://github.com/Neosku/aviutl2-catalog-data',
        icon: SiGithub,
      },
    ],
  },
];
