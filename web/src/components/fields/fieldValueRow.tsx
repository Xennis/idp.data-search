"use client"

import { type RowComponentProps } from "react-window"
import { FieldValue } from "@/lib/dataTypes"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { searchPage } from "@/lib/config"

export function FieldValueRow({
  index,
  entries,
  queryParam,
  style,
}: RowComponentProps<{ entries: FieldValue[]; queryParam: string }>) {
  const entry = entries[index]
  return (
    <div
      className={cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", "flex flex-row")}
      style={style}
    >
      <div
        className={cn(
          "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          "flex-1",
        )}
      >
        {entry.value}
      </div>
      <div
        className={cn(
          "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          "w-24",
        )}
      >
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
