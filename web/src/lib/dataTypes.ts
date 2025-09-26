export type IdpEntry = {
  tm: string
  sourceFiles: string[]
  terms: string[]
  title?: string[]
  material?: string[]
  originDatesWhen?: string[]
  originDatesNotbefore?: string[]
  originDatesNotafter?: string[]
  originPlaces: string[]
  provenancesLocated: string[]
  mainLang?: string[]
  sourceAuthority: string[]
  sourceAvailability: string[]
}

export type FieldValue = {
  value: string
  tmCount: number
}

export const fieldMetadata = {
  languages: {
    title: "Languages",
    fetchUrl: "/data/mainLangs.json",
    searchPlaceholder: "Search for a language",
    tableWidth: "300px",
  },
  materials: {
    title: "Materials",
    fetchUrl: "/data/materials.json",
    searchPlaceholder: "Search for a material",
    tableWidth: "500px",
  },
  terms: {
    title: "Terms",
    fetchUrl: "/data/terms.json",
    searchPlaceholder: "Search for a term",
    tableWidth: "1200px",
  },
} as const

export type FieldMetadata = {
  title: string
  fetchUrl: string
  searchPlaceholder: string
  tableWidth: string
}
export type FieldKey = keyof typeof fieldMetadata
