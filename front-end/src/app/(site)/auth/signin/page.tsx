import { Suspense } from "react";
import SignInClient from "@/components/Auth/SignInClient";

export default function Page() {
    return (
        <Suspense fallback={<div />}>
            <SignInClient />
        </Suspense>
    );
}