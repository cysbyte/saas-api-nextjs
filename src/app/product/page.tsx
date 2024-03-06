import RecordModal from "@/components/shared/RecordModal"
import Link from "next/link"
import { Suspense } from "react"

export default function Products() {

    async function onClose() {
        "use server"
        console.log("Modal has closed")
    }

    async function onOk() {
        "use server"
        console.log("Ok was clicked")
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RecordModal/>                     
        </Suspense>
    )
}