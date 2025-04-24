import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import MedicineForm from './MedicineForm';
import { Plus } from 'lucide-react';

interface PageProps {
    generic: {
        id: string;
        name: string;
    }[];
}

const CreateMedicineDialog = ({ generic }: PageProps) => {
    const [open, setOpen] = React.useState(false);

    const closeModal = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add new item
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>Create New Medicine/Surgical Item</DialogTitle>
                    <DialogDescription>
                        Add a new Item to the hospital management system.
                    </DialogDescription>
                </DialogHeader>
                <MedicineForm closeModal={closeModal} generics={generic} />
            </DialogContent>
        </Dialog>
    );
};

export default CreateMedicineDialog;

