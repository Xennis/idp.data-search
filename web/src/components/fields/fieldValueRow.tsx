"use client"

import { type RowComponentProps } from "react-window"
import { FieldValue } from "@/lib/dataTypes"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { searchPage } from "@/lib/config"
import { TruncatedString } from "@/components/layout/truncated"

export function FieldValueRow({
  index,
  entries,
  queryParam,
  truncateLength,
  style,
}: RowComponentProps<{ entries: FieldValue[]; queryParam: string; truncateLength: number }>) {
  const entry = entries[index]
  return (
    <div
      className={cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", "flex flex-row")}
      style={style}
    >
      <div className={cn("p-2 align-middle whitespace-nowrap", "flex-1")}>
        <TruncatedString value={entry.value} maxLength={truncateLength} />
      </div>
      <div className={cn("p-2 align-middle whitespace-nowrap", "w-24")}>
        <Link
          className="underline hover:no-underline"
          href={`${searchPage}?${queryParam}=${encodeURIComponent(entry.value)}`}
        >
          {entry.tmCount}
        </Link>
      </div>
    </div>
  )
}
