"use client"

import { IdpEntry } from "@/lib/dataTypes"
import { useEffect, useMemo, useState } from "react"
import Fuse, { Expression } from "fuse.js"
import { getScrollbarSize, List } from "react-window"
import { IdpEntryRow } from "@/components/search/idpEntryRow"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, ArrowUpDown, X } from "lucide-react"
import { DropdownSelect } from "@/components/search/dropdownSelect"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"
import { languageUrlParam, materialUrlParam, sortFieldUrlParam, sortOrderUrlParam, termUrlParam } from "@/lib/config"
import { Button } from "@/components/ui/button"

const fieldMainLang = "mainLang"
const fieldMaterial = "material"
const fieldForeignLang = "ForeignLang"
const sortAsc = "asc"
const sortDesc = "desc"

export const SearchScreen = ({ items }: { items: Array<IdpEntry> }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [queryMaterial, setQueryMaterial] = useState<string>(searchParams.get(materialUrlParam) || "")
  const [queryMainLang, setQueryMainLang] = useState<string>(searchParams.get(languageUrlParam) || "")
  const [queryTerm, setQueryTerm] = useState<string>(searchParams.get(termUrlParam) || "")
  const [sortField, setSortField] = useState<string | null>(searchParams.get(sortFieldUrlParam))
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    searchParams.get(sortOrderUrlParam) === sortDesc ? sortDesc : sortAsc,
  )
  const [size] = useState(getScrollbarSize)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (queryMaterial) {
      params.set(materialUrlParam, queryMaterial)
    } else {
      params.delete(queryMaterial)
    }
    if (queryMainLang) {
      params.set(languageUrlParam, queryMainLang)
    } else {
      params.delete(languageUrlParam)
    }
    if (queryTerm) {
      params.set(termUrlParam, queryTerm)
    } else {
      params.delete(termUrlParam)
    }
    if (sortField) {
      params.set(sortFieldUrlParam, sortField)
    } else {
      params.delete(sortFieldUrlParam)
    }
    if (sortOrder && sortOrder === sortDesc) {
      params.set(sortOrderUrlParam, sortOrder)
    } else {
      params.delete(sortOrderUrlParam)
    }

    router.replace(`?${params.toString()}`)
  }, [queryMaterial, queryMainLang, queryTerm, sortField, sortOrder, router, searchParams])

  // Create fue instance once
  const fuse = useMemo(() => {
    return new Fuse(items, {
      includeScore: true,
      threshold: 0.0, // 0.0 = strict
      keys: [fieldMaterial, fieldMainLang, "terms"],
    })
  }, [items])

  // const terms: Array<string> = useMemo(() => {
  //   return new Set(items.map((item) => item.terms ?? []).flat()).values().toArray().toSorted()
  // }, [items])

  // const fuseTerms = useMemo(() => {
  //   return new Fuse(terms, {
  //     includeScore: true,
  //     threshold: 0.3,
  //   })
  // }, [terms])

  const materials: Array<string> = useMemo(() => {
    return new Set(items.map((item) => item.material ?? []).flat()).values().toArray().toSorted()
  }, [items])

  const fuseMaterials = useMemo(() => {
    return new Fuse(materials, {
      includeScore: true,
      threshold: 0.3,
    })
  }, [materials])

  const mainLangs: Array<string> = useMemo(() => {
    return new Set(items.map((item) => item.mainLang ?? []).flat()).values().toArray().toSorted()
  }, [items])

  const fuseMainLangs = useMemo(() => {
    return new Fuse(mainLangs, {
      includeScore: true,
      threshold: 0.3,
    })
  }, [mainLangs])

  const queryF: Expression = { $and: [] }
  if (queryMaterial) {
    queryF.$and!.push({ material: queryMaterial })
  }
  if (queryMainLang) {
    queryF.$and!.push({ mainLang: queryMainLang })
  }
  if (queryTerm) {
    queryF.$and!.push({ terms: queryTerm })
  }

  const results: IdpEntry[] =
    queryMaterial || queryMainLang || queryTerm ? fuse.search(queryF).map((res) => res.item) : items
  const orderedResults = useMemo(() => {
    return results.slice().sort((a, b) => {
      let aVal = ""
      let bVal = ""

      switch (sortField) {
        case fieldMainLang:
          aVal = a.mainLang?.[0] ?? ""
          bVal = b.mainLang?.[0] ?? ""
          break

        case fieldMaterial:
          aVal = a.material?.[0] ?? ""
          bVal = b.material?.[0] ?? ""
          break

        case fieldForeignLang:
          aVal = a.foreignLang?.[0] ? Object.keys(a.foreignLang[0])[0] : ""
          bVal = b.foreignLang?.[0] ? Object.keys(b.foreignLang[0])[0] : ""
          break
      }

      const direction = sortOrder === sortDesc ? -1 : 1
      return direction * aVal.localeCompare(bVal)
    })
  }, [results, sortField, sortOrder])

  const resultMaterials: Array<string> = queryMaterial
    ? fuseMaterials.search(queryMaterial).map((res) => res.item)
    : materials
  const resultMainLangs: Array<string> = queryMainLang
    ? fuseMainLangs.search(queryMaterial).map((res) => res.item)
    : mainLangs
  //const resultTerms: Array<string> = queryTerm ? fuseTerms.search(queryMaterial).map((res) => res.item) : terms

  return (
    <>
      <div className="flex flex-row gap-2">
        <DropdownSelect
          items={resultMaterials}
          placeholder="Type or select a material..."
          defaultText="Select material..."
          query={queryMaterial}
          setQuery={setQueryMaterial}
        />
        <DropdownSelect
          items={resultMainLangs}
          placeholder="Type or select a langauge..."
          defaultText="Select language..."
          query={queryMainLang}
          setQuery={setQueryMainLang}
        />
        <DropdownSelect
          items={[]}
          placeholder="Type or select a term..."
          defaultText="Select term..."
          query={queryTerm}
          setQuery={setQueryTerm}
        />
      </div>
      <div className="flex flex-row gap-2 py-4">
        <span>{orderedResults.length} hits </span>
        {(queryMaterial || queryMainLang || queryTerm) && <span>for </span>}
        {queryMaterial && (
          <Badge>
            <span>Material: {queryMaterial}</span>
            <button className="ps-1" onClick={() => setQueryMaterial("")}>
              <X className="h-4 w-4" />
            </button>
          </Badge>
        )}
        {queryMainLang && (
          <Badge>
            <span>Language: {queryMainLang}</span>
            <button className="ps-1" onClick={() => setQueryMainLang("")}>
              <X className="h-4 w-4" />
            </button>
          </Badge>
        )}
        {queryTerm && (
          <Badge>
            <span>Term: {queryTerm}</span>
            <button className="ps-1" onClick={() => setQueryTerm("")}>
              <X className="h-4 w-4" />
            </button>
          </Badge>
        )}
      </div>
      <div className="py-4">
        <div className="flex h-[500px] flex-col">
          <div className={cn("border-b", "flex flex-row")}>
            <div className="flex grow flex-row">
              <div
                className={cn("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap", "w-20")}
              >
                TM
              </div>
              <div
                className={cn(
                  "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap",
                  "flex-1",
                )}
              >
                Title
              </div>
              <div
                className={cn("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap", "w-32")}
              >
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSortField(fieldMaterial)
                    setSortOrder(sortOrder === sortAsc ? sortDesc : sortAsc)
                  }}
                >
                  Material
                  {sortField === fieldMaterial ? sortOrder === sortDesc ? <ArrowDown /> : <ArrowUp /> : <ArrowUpDown />}
                </Button>
              </div>
              <div
                className={cn("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap", "w-32")}
              >
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSortField(fieldMainLang)
                    setSortOrder(sortOrder === sortAsc ? sortDesc : sortAsc)
                  }}
                >
                  Lang
                  {sortField === fieldMainLang ? sortOrder === sortDesc ? <ArrowDown /> : <ArrowUp /> : <ArrowUpDown />}
                </Button>
              </div>
              <div className={cn("text-foreground h-10 px-2 text-left align-middle font-medium", "w-32")}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSortField(fieldForeignLang)
                    setSortOrder(sortOrder === sortAsc ? sortDesc : sortAsc)
                  }}
                >
                  Foreign
                  {sortField === fieldForeignLang ? (
                    sortOrder === sortDesc ? (
                      <ArrowDown />
                    ) : (
                      <ArrowUp />
                    )
                  ) : (
                    <ArrowUpDown />
                  )}
                </Button>
              </div>
              <div
                className={cn(
                  "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap",
                  "flex-1",
                )}
              >
                Terms
              </div>
            </div>
            <div className="shrink" style={{ width: size }} />
          </div>
          <div className="overflow-hidden">
            <List
              rowComponent={IdpEntryRow}
              rowCount={orderedResults.length}
              rowHeight={50}
              rowProps={{ entries: orderedResults }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
