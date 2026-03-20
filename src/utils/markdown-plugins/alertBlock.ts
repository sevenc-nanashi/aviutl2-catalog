import { AlertOctagon, AlertTriangle, Info, Lightbulb, MessageSquareWarning } from 'lucide-static';
import { MarkdownExit } from 'markdown-exit';
import githubAlerts, { MarkdownItGitHubAlertsOptions } from 'markdown-it-github-alerts';

/** GitHubのアラートつきコードブロック */
export function alertBlock(md: MarkdownExit): void {
  md.use(githubAlerts, {
    titles: {
      note: '注記',
      tip: 'ヒント',
      important: '重要',
      warning: '警告',
      caution: '注意',
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
