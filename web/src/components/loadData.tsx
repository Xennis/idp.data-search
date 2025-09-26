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
  const [items, setItems] = useState<Array<T>>(() => {
    try {
      const cached = localStorage.getItem(fetchUrl)
      return cached ? JSON.parse(cached) : []
    } catch (e) {
      console.warn("Failed to retrieve data from localStorage:", e)
      return []
    }
  })

  const handleOnClick = async () => {
    setLoading(true)
    const res = await fetch(fetchUrl)
    if (res.ok) {
      const data = await res.json()
      try {
        localStorage.setItem(fetchUrl, JSON.stringify(data))
      } catch (error) {
        console.warn("Failed to store data in localStorage:", error)
      }
      setItems(data)
    }
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <Button className="bg-teal-700" disabled={loading} onClick={handleOnClick}>
        {loading && <Loader2Icon className="animate-spin" />}
        Load Data
      </Button>
    )
  }

  return <>{children(items)}</>
}
