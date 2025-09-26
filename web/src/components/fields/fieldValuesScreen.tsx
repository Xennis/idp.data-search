"use client"

import { FieldMetadata, FieldValue } from "@/lib/dataTypes"
import { useEffect, useMemo, useState } from "react"
import Fuse from "fuse.js"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { List } from "react-window"
import { FieldValueRow } from "@/components/fields/fieldValueRow"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

const queryUrlParam = "q"

export const FieldValuesScreen = ({ items, metadata }: { items: Array<FieldValue>; metadata: FieldMetadata }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get(queryUrlParam) || "")

  const fuse = useMemo(() => {
    return new Fuse(items, {
      includeScore: true,
      threshold: 0.3,
      keys: ["value"],
    })
  }, [items])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set(queryUrlParam, query)
    } else {
      params.delete(queryUrlParam)
    }

    router.replace(`?${params.toString()}`)
  }, [query, router, searchParams])

  const results = query ? fuse.search(query).map((result) => result.item) : items

  return (
    <div className="py-4">
      <div className="flex content-center">
        <Input
          className="max-w-[300px]"
          value={query}
          placeholder={metadata.searchPlaceholder}
          onChange={(value) => setQuery(value.target.value)}
        ></Input>
      </div>
      <div className="pt-10"></div>
      <div className="flex h-[500px] flex-col" style={{ maxWidth: metadata.tableWidth }}>
        <div className={cn("border-b", "flex flex-row")}>
          <div className="flex grow flex-row">
            <div
              className={cn(
                "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                "flex-1",
              )}
            >
              {metadata.title}
            </div>
            <div
              className={cn(
                "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                "w-24",
              )}
            >
              # Count
            </div>
          </div>
          {/*<div className="shrink" style={{width: size}}/>*/}
        </div>
        <div className="overflow-hidden">
          <List
            rowComponent={FieldValueRow}
            rowCount={results.length}
            rowHeight={50}
            rowProps={
              results
                ? { entries: results, queryParam: metadata.queryParam, truncateLength: metadata.truncateLength }
                : { entries: items, queryParam: metadata.queryParam, truncateLength: metadata.truncateLength }
            }
          />
        </div>
      </div>
    </div>
  )
}
