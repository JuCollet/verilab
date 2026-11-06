import { SubPageHeader } from '../components/SubPageHeader'
import { DemoPoints } from '../components/DemoMarks'
import { useI18n } from '../i18n/I18nProvider'

/** Plus › Mentions légales : rappel du caractère fictif de la démo et mention légale de la société. */
export function Legal() {
  const { t } = useI18n()
  return (
    <>
      <SubPageHeader title={t.demo.legalTitle} backTo="/plus" tabs={false} />
      <div className="flex flex-col gap-[14px] px-[7px] py-[14px]">
        <section className="rounded-[5px] bg-card px-[18px] py-[18px] shadow-card">
          <p className="text-[13px] font-medium tracking-[0.08em] text-brand uppercase">{t.demo.overline}</p>
          <h2 className="mt-[4px] text-[18px] leading-[23px] font-semibold text-ink">{t.demo.title}</h2>
          <DemoPoints className="mt-[16px]" />
        </section>
        <section className="rounded-[5px] bg-card px-[18px] py-[16px] text-[14px] leading-[20px] text-muted shadow-card">
          {t.demo.company}
        </section>
      </div>
    </>
  )
}
