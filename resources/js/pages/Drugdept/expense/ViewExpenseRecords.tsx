import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ReceiptText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

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

const ViewExpenseRecords = ({ expenseId }: PageProps) => {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<ExpenseRecord[]>([]);
  const [loading, setLoading] = useState(false);

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
                    <Button variant="secondary" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
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
  );
};

export default ViewExpenseRecords;
