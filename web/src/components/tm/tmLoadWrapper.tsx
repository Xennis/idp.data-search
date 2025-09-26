"use client"

import { useSearchParams } from "next/navigation"
import { LoadData } from "@/components/loadData"
import { IdpEntry } from "@/lib/dataTypes"
import { TmScreen } from "@/components/tm/tmScreen"

export const TmLoadWrapper = () => {
  const searchParams = useSearchParams()
  const tm = searchParams.get("id")

  return (
    <LoadData<IdpEntry> fetchUrl="/data/ipd-data-sheet.json">
      {(items) => <TmScreen entry={items.find((item) => item.tm === tm)} />}
    </LoadData>
  )
}
