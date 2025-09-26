import { Headline1 } from "@/components/layout/headline"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { searchPage } from "@/lib/config"

export default function HomePage() {
  return (
    <>
      <Headline1>IDP Data Search</Headline1>
      <Button asChild>
        <Link href={searchPage} className="bg-teal-700">
          Open Search
        </Link>
      </Button>
    </>
  )
}
