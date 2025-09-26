import {homePage, languagesPages, materialsPages, termsPages} from "@/lib/config";
import Link from "next/link";

export const HeaderBar = () => {
    return (
        <header className="flex flex-row items-center justify-between gap-4 bg-teal-700 text-white">
            <div className="flex flex-row items-center gap-3">
                <Link href={homePage} className="border-e border-background-950 py-3 pe-4 ps-3">
          <span className="tracking-tight">
            <span className="font-semibold">IDP</span>
              Search 😎
          </span>
                </Link>
                <Link className="hover:underline" href={languagesPages}>Languages</Link>
                <Link className="hover:underline" href={materialsPages}>Materials</Link>
                <Link className="hover:underline" href={termsPages}>Teams</Link>
            </div>
        </header>
    )
}
