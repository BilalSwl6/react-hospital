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
import { Plus } from 'lucide-react';

const CreateGenericDialog = () => {
    const [open, setOpen] = React.useState(false);

    const closeModal = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Generic
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>Create New Generic name</DialogTitle>
                    <DialogDescription>
                        Add a new Generic name to the hospital management system.
                    </DialogDescription>
                </DialogHeader>
                <GenericForm closeModal={closeModal} />
            </DialogContent>
        </Dialog>
    );
};

export default CreateGenericDialog;

