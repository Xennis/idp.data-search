"use client"

import {IdpEntry} from "@/lib/dataTypes";
import {useMemo, useState} from "react";
import Fuse from "fuse.js";
import {getScrollbarSize, List} from "react-window";
import {IdpEntryRow} from "@/components/data/idpEntryRow";
import {cn} from "@/lib/utils";

export const Search = ({items}: { items: Array<IdpEntry> }) => {
    const [query, setQuery] = useState("");
    const [size] = useState(getScrollbarSize);

    // Create fue instance once
    const fuse = useMemo(() => {
        return new Fuse(items, {
            includeScore: true,
            threshold: 0.0, // 0.0 = strict
            keys: ["material"]
        });
    }, [items]);

    const results = query
        ? fuse.search(query).map((res) => res.item)
        : [];

    return (
        <>
            <div className="p-4 max-w-xl mx-auto">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Suche..."
                    className="w-full p-2 border rounded"
                />
            </div>
            <div className="p-4">
                <div className="h-[500px] flex flex-col">
                    <div className={cn("border-b", "flex flex-row")}>
                        <div className="grow flex flex-row">
                            <div
                                className={cn("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", "w-20")}>TM
                            </div>
                            <div
                                className={cn("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", "flex-1")}>Title
                            </div>
                            <div
                                className={cn("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", "flex-1")}>Material
                            </div>
                        </div>
                        <div className="shrink" style={{width: size}}/>
                    </div>
                    <div className="overflow-hidden">
                        <List
                            rowComponent={IdpEntryRow}
                            rowCount={results.length}
                            rowHeight={50}
                            rowProps={results ? {entries: results} : {entries: items}}
                        />
                    </div>
                </div>

            </div>
        </>

    )
}