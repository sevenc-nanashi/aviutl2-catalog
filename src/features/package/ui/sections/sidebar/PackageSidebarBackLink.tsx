import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/Button';
import type { PackageSidebarSectionProps } from '../../types';
import { cn } from '@/lib/cn';

type PackageSidebarBackLinkProps = Pick<PackageSidebarSectionProps, 'listLink' | 'listLabel' | 'listLinkState'>;

export default function PackageSidebarBackLink({ listLink, listLabel, listLinkState }: PackageSidebarBackLinkProps) {
  const { t } = useTranslation('package');

  return (
    <div className="contents lg:block lg:sticky lg:bottom-0 lg:z-10 lg:mt-auto lg:pt-4">
      <Link
        to={listLink}
        state={listLinkState}
        className={cn(buttonVariants({ variant: 'secondary', size: 'default', radius: 'xl' }), 'w-full justify-center')}
      >
        <ArrowLeft size={18} /> {t('list.backToList', { label: listLabel })}
      </Link>
    </div>
  );
}
