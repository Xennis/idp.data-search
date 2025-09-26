"use client"

import { ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"

type LoadDataProps<T> = {
  fetchUrl: string
  children: (items: T[]) => ReactNode
}

export const LoadData = <T,>({ fetchUrl, children }: LoadDataProps<T>) => {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Array<T>>([])

  const handleOnClick = async () => {
    setLoading(true)
    const res = await fetch(fetchUrl)
    if (res.ok) {
      setItems(await res.json())
    }
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <div className="flex h-full justify-center p-5">
        <Button size="sm" disabled={loading} onClick={handleOnClick}>
          {loading && <Loader2Icon className="animate-spin" />}
          Load Data
        </Button>
      </div>
    )
  }

  return <>{children(items)}</>
}
