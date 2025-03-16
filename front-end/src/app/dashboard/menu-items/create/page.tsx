
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {Metadata} from "next";
import MenuItemForm from "@/components/Navbar/MenuItemForm";

export const metadata: Metadata = {
    title: 'Create Menu-item | TailAdmin Next.js',
    description: 'Create new Menu-item page',
};

export default function CreateSettingPage() {

    return (
        <DefaultLayout>
            <div>
                <MenuItemForm />
            </div>
        </DefaultLayout>
    );
}