"use client"

import { LoadData } from "@/components/loadData"
import { IdpEntry } from "@/lib/dataTypes"
import { TmScreen } from "@/components/tm/tmScreen"

export default async function TmPage({ params }: { params: Promise<{ tm: string }> }) {
  const { tm } = await params

  return (
    <>
      <LoadData<IdpEntry> fetchUrl="/data/ipd-data-sheet.json">
        {(items) => <TmScreen entry={items.find((item) => item.tm === tm)} />}
      </LoadData>
    </>
  )
}
