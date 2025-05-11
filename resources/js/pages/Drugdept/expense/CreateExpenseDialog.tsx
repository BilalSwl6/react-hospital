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
import ExpenseForm from './ExpenseForm';
import { Plus } from 'lucide-react';
import { Ward, Expense } from './index';

interface PageProps {
    wards: Ward[];
}

const CreateExpenseDialog = ({ wards }: PageProps) => {
    const [open, setOpen] = React.useState(false);

    const closeModal = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>Create New expense record</DialogTitle>
                    <DialogDescription>
                        Add a date and selext ward to create new expense record.
                    </DialogDescription>
                </DialogHeader>
                <ExpenseForm wards={wards} closeModal={closeModal}  />
            </DialogContent>
        </Dialog>
    );
};

export default CreateExpenseDialog;

