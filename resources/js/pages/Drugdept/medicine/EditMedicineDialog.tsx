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
import { Pencil } from 'lucide-react';
import { Medicine, Generic } from './index';

interface PageProps {
    generic: Generic;
    medicine: Medicine;
    onOpenChange: (open: boolean) => void;
}

const EditMedicineDialog = ({ generic, medicine, onOpenChange }: PageProps) => {
    const [open, setOpen] = React.useState(false);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        onOpenChange(isOpen); // trigger parent callback
    };

    const closeModal = () => {
        setOpen(false);
        onOpenChange(false); // ensure parent knows it’s closed
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className='bg-green-600'>
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>Edit Generic</DialogTitle>
                    <DialogDescription>
                        Update the Generic information.
                    </DialogDescription>
                </DialogHeader>
                <MedicineForm
                    generics={generic}
                    medicine={medicine}
                    closeModal={closeModal}
                    isEditing={true}
                />
            </DialogContent>
        </Dialog>
    );
};

export default EditMedicineDialog;
