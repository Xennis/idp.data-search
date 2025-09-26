import { TmLoadWrapper } from "@/components/tm/tmLoadWrapper"
import { Suspense } from "react"

export default function TmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TmLoadWrapper />
    </Suspense>
  )
}
