"use client"

import {type RowComponentProps} from "react-window";
import {IdpEntry} from "@/lib/dataTypes";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

export function IdpEntryRow({index, entries, style}: RowComponentProps<{ entries: IdpEntry[]; }>) {
    const entry = entries[index];
    return (
        <div
            className={cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", "flex flex-row")}
            style={style}>
            <div
                className={cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", "w-20")}><a className="underline hover:no-underline" href={`https://www.trismegistos.org/text/${entry.tm}`} target="_blank">{entry.tm}</a></div>
            <div
                className={cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", "flex-1")}>{entry.title.join(",")}</div>
            <div
                className={cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", "flex-1")}>{entry.material.map((material) => (<Badge variant="outline">{material}</Badge>))}</div>
            <div
                className={cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", "flex-1")}>{(entry.mainLang ?? []).map((mainLang) => (<Badge variant="outline">{mainLang}</Badge>))}</div>
        </div>
    );
}
