"use client"

import { LoadData } from "@/components/loadData"
import { IdpEntry } from "@/lib/dataTypes"
import { SearchScreen } from "@/components/search/searchScreen"
import { Headline1 } from "@/components/layout/headline"

export default function SearchPage() {
  return (
    <>
      <Headline1>Search</Headline1>
      <LoadData<IdpEntry> fetchUrl="/data/ipd-data-sheet.json">{(items) => <SearchScreen items={items} />}</LoadData>
    </>
  )
}
