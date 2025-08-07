import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import React from 'react';
import ExpenseForm from './ExpenseForm';
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
                <Button variant="link" size="sm" className="bg-green-600">
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="custom-scrollbar max-h-[80vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Expense record</DialogTitle>
                    <DialogDescription>Update the Expense record information.</DialogDescription>
                </DialogHeader>
                <ExpenseForm wards={wards} expense={expense} closeModal={closeModal} isEditing={true} />
            </DialogContent>
        </Dialog>
    );
};

export default EditExpenseDialog;
