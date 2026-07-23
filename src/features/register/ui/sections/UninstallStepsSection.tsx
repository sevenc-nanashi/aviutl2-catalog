/**
 * アンインストール手順コンポーネント
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { GripVertical, Plus } from 'lucide-react';
import { UNINSTALL_ACTION_OPTIONS } from '../../model/form';
import type { PackageInstallerSectionProps } from '../types';
import ActionDropdown from '../components/ActionDropdown';
import DeleteButton from '../components/DeleteButton';
import { action, grid, layout, surface, text } from '@/components/ui/_styles';

type UninstallStepsSectionProps = Pick<
  PackageInstallerSectionProps,
  | 'installer'
  | 'uninstallListRef'
  | 'addUninstallStep'
  | 'removeUninstallStep'
  | 'startHandleDrag'
  | 'updateUninstallStep'
>;

export default function UninstallStepsSection({
  installer,
  uninstallListRef,
  addUninstallStep,
  removeUninstallStep,
  startHandleDrag,
  updateUninstallStep,
}: UninstallStepsSectionProps) {
  const { t } = useTranslation(['register', 'common']);
  const uninstallActionOptions = useMemo(
    () =>
      UNINSTALL_ACTION_OPTIONS.map((option) => ({
        ...option,
        label: t(`installer.actions.${option.value}`),
      })),
    [t],
  );
  return (
    <div className="space-y-4">
      <div className={layout.rowBetweenWrapGap2}>
        <h3 className={text.titleBaseBold}>{t('installer.uninstallSteps')}</h3>
        <Button variant="plain" size="none" type="button" className={action.stepAddButton} onClick={addUninstallStep}>
          <Plus size={14} />
          <span>{t('installer.addStep')}</span>
        </Button>
      </div>
      <div className="space-y-3" ref={uninstallListRef}>
        {installer.uninstallSteps.map((step, idx) => {
          const order = idx + 1;
          return (
            <div key={step.key} className={surface.stepCard}>
              <div className={layout.wrapItemsGap3}>
                <div className={layout.inlineGap2}>
                  <span className={surface.stepNumberBadge}>{order}</span>
                  <Button
                    variant="plain"
                    size="none"
                    type="button"
                    className={action.dragHandle}
                    onPointerDown={(e) => startHandleDrag('uninstall', idx, e)}
                    aria-label={t('installer.dragAria')}
                  >
                    <GripVertical size={16} />
                  </Button>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <ActionDropdown
                    value={step.action}
                    onChange={(val) => updateUninstallStep(step.key, 'action', val)}
                    options={uninstallActionOptions}
                    ariaLabel={t('installer.stepTypeAria')}
                  />
                </div>
                <div className={layout.inlineGap2}>
                  <DeleteButton onClick={() => removeUninstallStep(step.key)} ariaLabel={t('installer.deleteStep')} />
                </div>
              </div>
              <div className={grid.panelTwoCol}>
                <div className="space-y-1">
                  <label className={text.labelXs} htmlFor={`uninstall-${step.key}-path`}>
                    {t('common:labels.targetPath')}
                  </label>
                  <input
                    id={`uninstall-${step.key}-path`}
                    value={step.path}
                    onChange={(e) => updateUninstallStep(step.key, 'path', e.target.value)}
                    placeholder={
                      step.action === 'delete'
                        ? t('installer.deletePathPlaceholder')
                        : t('installer.targetPathPlaceholderRun')
                    }
                    className="!bg-white dark:!bg-slate-800"
                  />
                </div>
                {step.action === 'run' && (
                  <>
                    <div className="space-y-1">
                      <label className={text.labelXs} htmlFor={`uninstall-${step.key}-args`}>
                        {t('installer.args')}
                      </label>
                      <input
                        id={`uninstall-${step.key}-args`}
                        value={step.argsText}
                        onChange={(e) => updateUninstallStep(step.key, 'argsText', e.target.value)}
                        placeholder={t('installer.argsPlaceholder')}
                        className="!bg-white dark:!bg-slate-800"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={action.inlineToggleOption}>
                        <input
                          type="checkbox"
                          className="accent-blue-600"
                          checked={!!step.elevate}
                          onChange={(e) => updateUninstallStep(step.key, 'elevate', e.target.checked)}
                        />
                        <span>{t('installer.runAsAdmin')}</span>
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {!installer.uninstallSteps.length && (
          <div className={surface.dashedPlaceholder}>
            <span className="text-xs">{t('installer.uninstallStepsEmpty')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
