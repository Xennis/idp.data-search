"use client"

import { LoadData } from "@/components/data/loadData"
import { IdpEntry } from "@/lib/dataTypes"
import { Search } from "@/components/data/search"

export default function DataPage() {
  return (
    <>
      <LoadData<IdpEntry> fetchUrl="/data/ipd-data-sheet.json">{(items) => <Search items={items} />}</LoadData>
    </>
  )
}
