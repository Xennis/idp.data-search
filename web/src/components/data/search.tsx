"use client"

import {IdpEntry} from "@/lib/dataTypes";
import {useMemo, useState} from "react";
import Fuse from "fuse.js";
import {getScrollbarSize, List} from "react-window";
import {IdpEntryRow} from "@/components/data/idpEntryRow";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDownIcon} from "lucide-react";

export const Search = ({items}: { items: Array<IdpEntry> }) => {
    const [query, setQuery] = useState("");
    const [size] = useState(getScrollbarSize);
    const [open, setOpen] = useState(false)

    // Create fue instance once
    const fuse = useMemo(() => {
        return new Fuse(items, {
            includeScore: true,
            threshold: 0.0, // 0.0 = strict
            keys: ["material"]
        });
    }, [items]);

    const materials: Array<string> = useMemo(() => {
        return new Set(items.map(item => item.material).flat()).values().toArray().toSorted();
    }, [items]);

    const fuseMaterials = useMemo(() => {
        return new Fuse(materials, {
            includeScore: true,
            threshold: 0.3,
        });
    }, [materials]);

    const results = query
        ? fuse.search(query).map((res) => res.item)
        : [];

    const resultMaterials: Array<string> = query
        ? fuseMaterials.search(query).map((res) => res.item)
        : materials;

    return (
        <>
            <div className="p-4 max-w-xl mx-auto">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[300px] justify-between"
                        >
                            {query
                                ? query
                                : "Select material..."}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                        <Command>
                            <CommandInput
                                placeholder="Type or select a material..."
                                value={query}
                                onValueChange={(val) => {
                                    setQuery(val)
                                    //setSelected(null) // reset selection, falls man tippt
                                }}
                            />
                            <CommandList>
                                <CommandEmpty>No results. Press Enter for free text.</CommandEmpty>
                                <CommandItem
                                    key={`free-text-${query}`}
                                    value={query}
                                    onSelect={(currentValue) => {
                                        setQuery(currentValue === query ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {query} (free text)
                                </CommandItem>
                                {resultMaterials.map((opt) => (
                                    <CommandItem
                                        key={opt}
                                        value={opt}
                                        onSelect={(currentValue) => {
                                            setQuery(currentValue === query ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        {opt}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                query === opt ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
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