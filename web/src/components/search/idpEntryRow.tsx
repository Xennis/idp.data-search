"use client"

import { type RowComponentProps } from "react-window"
import { IdpEntry } from "@/lib/dataTypes"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TruncatedBadges, TruncatedString } from "@/components/layout/truncated"

export function IdpEntryRow({ index, entries, style }: RowComponentProps<{ entries: IdpEntry[] }>) {
  const entry = entries[index]
  const title = (entry.title ?? []).join(", ")
  return (
    <div
      className={cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", "flex flex-row")}
      style={style}
    >
      <div className={cn("p-2 align-middle whitespace-nowrap", "w-20")}>
        <a
          className="underline hover:no-underline"
          href={`https://www.trismegistos.org/text/${entry.tm}`}
          target="_blank"
        >
          {entry.tm}
        </a>
      </div>
      <div className={cn("p-2 align-middle whitespace-nowrap", "flex-1")}>
        <TruncatedString value={title} maxLength={75} />
      </div>
      <div className={cn("p-2 align-middle whitespace-nowrap", "w-32")}>
        {entry.material && <TruncatedBadges values={entry.material} maxBadges={2} maxStringLength={25} />}
      </div>
      <div className={cn("p-2 align-middle whitespace-nowrap", "w-32")}>
        {entry.mainLang && <TruncatedBadges values={entry.mainLang} maxBadges={2} maxStringLength={20} />}
      </div>
      <div className={cn("p-2 align-middle whitespace-nowrap", "w-32")}>
        {entry.foreignLang && <TruncatedBadges values={entry.foreignLang.map((fr) => Object.keys(fr)).flat()} maxBadges={2} maxStringLength={20} />}
      </div>
      <div className={cn("p-2 align-middle whitespace-nowrap", "flex-1")}>
        {entry.terms && <TruncatedBadges values={entry.terms} maxBadges={6} maxStringLength={20} />}
      </div>
    </div>
  )
}
