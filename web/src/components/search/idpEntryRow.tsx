"use client"

import { type RowComponentProps } from "react-window"
import { IdpEntry } from "@/lib/dataTypes"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function IdpEntryRow({ index, entries, style }: RowComponentProps<{ entries: IdpEntry[] }>) {
  const entry = entries[index]
  const title = (entry.title ?? []).join(", ")
  return (
    <div
      className={cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", "flex flex-row")}
      style={style}
    >
      <div
        className={cn(
          "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          "w-20",
        )}
      >
        <a
          className="underline hover:no-underline"
          href={`https://www.trismegistos.org/text/${entry.tm}`}
          target="_blank"
        >
          {entry.tm}
        </a>
      </div>
      <div
        className={cn(
          "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          "flex-1",
        )}
      >
        {title.slice(0, 75)}
        {title.length > 75 ? "..." : ""}
      </div>
      <div
        className={cn(
          "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          "w-32",
        )}
      >
        <div className="flex flex-row gap-0.5">
          {(entry.material ?? []).map((material, index) => (
            <Badge key={index} variant="outline">
              {material.slice(0, 25)}
              {material.length > 25 ? "..." : ""}
            </Badge>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          "w-32",
        )}
      >
        <div className="flex flex-row gap-0.5">
          {(entry.mainLang ?? []).map((mainLang, index) => (
            <Badge key={index} variant="outline">
              {mainLang}
            </Badge>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          "flex-1",
        )}
      >
        <div className="flex flex-row gap-0.5">
          {(entry.terms ?? []).slice(0, 7).map((term, index) => (
            <Badge key={index} variant="outline">
              {term.length > 20 ? (
                <Tooltip>
                  <TooltipTrigger>
                    <span>{term.slice(0, 20)}...</span>
                  </TooltipTrigger>
                  <TooltipContent>{term}</TooltipContent>
                </Tooltip>
              ) : (
                <>{term}</>
              )}
            </Badge>
          ))}
          {(entry.terms ?? []).length > 7 ? (
            <Tooltip>
              <TooltipTrigger>
                <Badge key="more" variant="outline">
                  ...
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{(entry.terms ?? []).slice(7).join(", ")}</TooltipContent>
            </Tooltip>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  )
}
