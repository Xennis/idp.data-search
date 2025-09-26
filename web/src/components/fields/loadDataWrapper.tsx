"use client"

import {LoadData} from "@/components/data/loadData";
import {FieldMetadata, FieldValue} from "@/lib/dataTypes";
import {FieldValuesScreen} from "@/components/fields/fieldValuesScreen";

export const LoadDataWrapper = ({metadata}: {metadata: FieldMetadata}) => {
    return (
        <LoadData<FieldValue> fetchUrl={metadata.fetchUrl}>
            {(items) => <FieldValuesScreen items={items} metadata={metadata} />}
        </LoadData>
    )
}
