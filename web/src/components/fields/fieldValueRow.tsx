"use client"

import {type RowComponentProps} from "react-window";
import {FieldValue} from "@/lib/dataTypes";
import {cn} from "@/lib/utils";

export function FieldValueRow({index, entries, style}: RowComponentProps<{ entries: FieldValue[]; }>) {
    const entry = entries[index];
    return (
        <div
            className={cn("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", "flex flex-row")}
            style={style}>
            <div
                className={cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", "flex-1")}>{entry.value}</div>
            <div
                className={cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", "w-24")}>{entry.tmCount}</div>
        </div>
    );
}
