"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"
import useSWR from "swr"
import nextConfig from "../../next.config"

type LoadDataProps<T> = {
  fetchUrl: string
  children: (items: T[]) => ReactNode
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const LoadData = <T,>({ fetchUrl, children }: LoadDataProps<T>) => {
  const url = `${nextConfig.basePath ?? ""}${fetchUrl}`
  const { data, error, isLoading } = useSWR(url, fetcher)

  if (isLoading) {
    return (
      <Button className="bg-teal-700" disabled={isLoading}>
        {isLoading && <Loader2Icon className="animate-spin" />}
        Load Data
      </Button>
    )
  }
  if (error) {
    console.warn(`failed to load data: ${error}`)
    return <div>Error loading data</div>
  }

  return <>{children(data)}</>
}
