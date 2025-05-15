import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ReceiptText } from 'lucide-react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { router } from '@inertiajs/react';

interface ExpenseRecord {
    id: number;
    quantity: number;
    medicine: {
        name: string;
        generic_name: string;
        category: string | null;
        strength: string;
        route: string;
    };
}

interface ApiResponse {
    status: string;
    expenseRecords: ExpenseRecord[];
}

interface PageProps {
    expenseId: number;
}

function EditExpenseRecordDialog({ record, onClose }: { record: ExpenseRecord; onClose: () => void }) {
    const [quantity, setQuantity] = useState(record.quantity);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            router.put(route('expenseRecord.update', { id: record.id }), {
                quantity,
            }, {
                    preserveScroll: true,
                    onSuccess: onClose,
                });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Record</DialogTitle>
                        <DialogDescription>Edit the details of this expense record.</DialogDescription>
                    </DialogHeader>
                    <div className="mb-4">
                        <Label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                            Quantity
                        </Label>
                        <Input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="mt-1 mr-2 ml-2 pr-2 block w-full border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" variant="default" disabled={submitting}>
                            Save
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

const ViewExpenseRecords = ({ expenseId }: PageProps) => {
    const [records, setRecords] = useState<ExpenseRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ExpenseRecord | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(route('expense.show', { expense: expenseId }));
            const data: ApiResponse = await response.json();

            if (data.status !== 'success') {
                throw new Error('Failed to fetch records');
            }

            setRecords(data.expenseRecords);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) fetchData();
    }, [open, expenseId]);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="link" size="sm">
                        <ReceiptText className="mr-2 h-4 w-4" />
                        View Records
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                        <DialogTitle>Expense Records</DialogTitle>
                        <DialogDescription>
                            Medicines associated with this expense.
                        </DialogDescription>
                    </DialogHeader>

                    {records.length === 0 && !loading && (
                        <div className="text-center py-4">No medicine records found.</div>
                    )}

                    {records.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Medicine Info</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>
                                            {record.medicine.name} ({record.medicine.generic_name}) - {record.medicine.category || 'N/A'} ({record.medicine.route}) - {record.medicine.strength}
                                        </TableCell>
                                        <TableCell>{record.quantity}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setEditingRecord(record)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this record?')) {
                                                        router.delete(route('expenseRecord.destroy', { id: record.id }), {
                                                            preserveScroll: true,
                                                            onSuccess: fetchData,
                                                        });
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {editingRecord && (
                <EditExpenseRecordDialog
                    record={editingRecord}
                    onClose={() => {
                        setEditingRecord(null);
                        fetchData();
                    }}
                />
            )}
        </>
    );
};

export default ViewExpenseRecords;

