import { IdpEntry } from "@/lib/dataTypes"
import { Headline1 } from "@/components/layout/headline"
import { TruncatedBadges, TruncatedString } from "@/components/layout/truncated"

export const TmScreen = ({ entry }: { entry: IdpEntry | undefined }) => {
  if (!entry) {
    return <div>Not found</div>
  }
  return (
    <>
      <Headline1>
        TM{entry.tm}
        {entry.title && (
          <span>
            : <TruncatedString value={entry.title.join(",")} maxLength={75} />
          </span>
        )}
      </Headline1>

      <div>Material</div>
      {entry.material && <TruncatedBadges values={entry.material} maxBadges={2} maxStringLength={25} />}
      <div>MainLang</div>
      {entry.mainLang && <TruncatedBadges values={entry.mainLang} maxBadges={2} maxStringLength={20} />}
      <div>Foreignlang</div>
      {entry.foreignLang && (
        <TruncatedBadges
          values={entry.foreignLang.map((fr) => Object.keys(fr)).flat()}
          maxBadges={2}
          maxStringLength={20}
        />
      )}
      <div>Terms</div>
      {entry.terms && <TruncatedBadges values={entry.terms} maxBadges={6} maxStringLength={20} />}
      <div>SourceAuthority</div>
      {entry.sourceAuthority && (
        <>
          <ul>
            {entry.sourceAuthority.map((sa, index) => (
              <li key={index}>{sa}</li>
            ))}
          </ul>
        </>
      )}
      <div>SourceAvailability</div>
      {entry.sourceAvailability && (
        <>
          <ul>
            {entry.sourceAvailability.map((sa, index) => (
              <li key={index}>{sa}</li>
            ))}
          </ul>
        </>
      )}
      <div>Files</div>
      {entry.sourceFiles && (
        <>
          <ul>
            {entry.sourceFiles.map((sa, index) => (
              <li key={index}>{sa}</li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
