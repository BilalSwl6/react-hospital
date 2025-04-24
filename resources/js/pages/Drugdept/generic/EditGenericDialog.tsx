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
import GenericForm from './GenericForm';
import { Pencil } from 'lucide-react';

const EditGenericDialog = ({ generic }) => {
    const [open, setOpen] = React.useState(false);

    const closeModal = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
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
                <GenericForm generic={generic} closeModal={closeModal} isEditing={true} />
            </DialogContent>
        </Dialog>
    );
};

export default EditGenericDialog;
