import {LoadDataWrapper} from "@/components/fields/loadDataWrapper";
import {FieldKey, fieldMetadata} from "@/lib/dataTypes";



export async function generateStaticParams() {
    return Object.keys(fieldMetadata).map((field) => ({ field }));
}

export default async function FieldPage({params}: { params: Promise<{ field: FieldKey }> }) {
    const {field} = await params;
    const metadata = fieldMetadata[field];

    return <div className="px-4">
        <h1 className="text-4xl tracking-tight font-bold pt-10 pb-6">{metadata.title}</h1>
        <LoadDataWrapper metadata={metadata} />
    </div>
}
