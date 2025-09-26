import { ReactNode } from "react"

export const Headline1 = ({ children }: { children: ReactNode }) => {
  return <h1 className="pt-10 pb-6 text-4xl font-bold tracking-tight">{children}</h1>
}
