import { i18n } from '@/i18n';
import { AlertOctagon, AlertTriangle, Info, Lightbulb, MessageSquareWarning } from 'lucide-static';
import { MarkdownExit } from 'markdown-exit';
import githubAlerts, { MarkdownItGitHubAlertsOptions } from 'markdown-it-github-alerts';

/** GitHubのアラートつきコードブロック */
export function alertBlock(md: MarkdownExit): void {
  md.use(githubAlerts, {
    titles: {
      note: i18n.t('common:markdownAlerts.note'),
      tip: i18n.t('common:markdownAlerts.tip'),
      important: i18n.t('common:markdownAlerts.important'),
      warning: i18n.t('common:markdownAlerts.warning'),
      caution: i18n.t('common:markdownAlerts.caution'),
    },
    icons: {
      note: Info,
      tip: Lightbulb,
      important: MessageSquareWarning,
      warning: AlertTriangle,
      caution: AlertOctagon,
    },
  } satisfies MarkdownItGitHubAlertsOptions);
}
