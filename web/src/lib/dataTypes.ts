import { languageUrlParam, materialUrlParam, termUrlParam } from "@/lib/config"

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
  foreignLang?: Record<string, number>[]
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
    truncateLength: 25,
    queryParam: languageUrlParam,
  },
  materials: {
    title: "Materials",
    fetchUrl: "/data/materials.json",
    searchPlaceholder: "Search for a material",
    tableWidth: "500px",
    truncateLength: 50,
    queryParam: materialUrlParam,
  },
  terms: {
    title: "Terms",
    fetchUrl: "/data/terms.json",
    searchPlaceholder: "Search for a term",
    tableWidth: "1000px",
    truncateLength: 100,
    queryParam: termUrlParam,
  },
} as const

export type FieldMetadata = {
  title: string
  fetchUrl: string
  searchPlaceholder: string
  tableWidth: string
  truncateLength: number
  queryParam: string
}
export type FieldKey = keyof typeof fieldMetadata
