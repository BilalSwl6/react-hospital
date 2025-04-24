import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { SharedData } from "@/types";

export default function MessageBox() {
    const {
        flash: { success, error, warning, info },
    } = usePage<SharedData>().props;

    useEffect(() => {
        if (success) toast(success);
        if (error) toast(error);
        if (warning) toast(warning);
        if (info) toast.info(info);
    }, [success, error, warning, info]);

    return <Toaster />;
}
