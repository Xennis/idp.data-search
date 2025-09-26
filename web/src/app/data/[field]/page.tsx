import { LoadDataWrapper } from "@/components/fields/loadDataWrapper"
import { FieldKey, fieldMetadata } from "@/lib/dataTypes"
import { Headline1 } from "@/components/layout/headline"

export async function generateStaticParams() {
  return Object.keys(fieldMetadata).map((field) => ({ field }))
}

export default async function FieldPage({ params }: { params: Promise<{ field: FieldKey }> }) {
  const { field } = await params
  const metadata = fieldMetadata[field]

  return (
    <>
      <Headline1>{metadata.title}</Headline1>
      <LoadDataWrapper metadata={metadata} />
    </>
  )
}
