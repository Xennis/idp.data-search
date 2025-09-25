"use client"

import {useState} from "react";
import {IdpEntry} from "@/lib/dataTypes";
import {Button} from "@/components/ui/button";
import {Loader2Icon} from "lucide-react";
import {Search} from "@/components/data/search";

export const LoadData = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<Array<IdpEntry>>([]);

    const handleOnClick = async () => {
        setLoading(true);
        const res = await fetch("/data/ipd-data-sheet.json");
        if (res.ok) {
            setItems(await res.json());
        }
        setLoading(false);
    }

    if (items.length === 0) {
        return <div className="h-full p-5 flex justify-center">
            <Button size="sm" disabled={loading} onClick={handleOnClick}>
                {loading && <Loader2Icon className="animate-spin"/>}
                Load Data
            </Button>
        </div>
    }

    return <>
        <Search items={items}/>
    </>
}