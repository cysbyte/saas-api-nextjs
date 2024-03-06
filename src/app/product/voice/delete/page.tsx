import DeleteModal from "@/components/shared/DeleteModal"
import Link from "next/link"
import { Suspense } from "react"

export default function DeleteVoicePage() {

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
            <DeleteModal onClose={onClose} onOk={onOk} title=''/>                     
        </Suspense>
    )
}