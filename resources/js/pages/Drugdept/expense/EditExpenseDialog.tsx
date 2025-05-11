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
import { Pencil } from 'lucide-react';
import { Expense, Ward } from './index';

interface PageProps {
    wards: Ward[];
    expense: Expense;
}

const EditExpenseDialog = ({ wards, expense }: PageProps) => {
    const [open, setOpen] = React.useState(false);

    const closeModal = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" size="sm">
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>Edit Expense record</DialogTitle>
                    <DialogDescription>
                        Update the Expense record information.
                    </DialogDescription>
                </DialogHeader>
                <ExpenseForm wards={wards} expense={expense} closeModal={closeModal} isEditing={true} />
            </DialogContent>
        </Dialog>
    );
};

export default EditExpenseDialog;
