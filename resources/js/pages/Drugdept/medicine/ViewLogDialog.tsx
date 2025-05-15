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
import { ReceiptText, MessageCircleQuestion } from 'lucide-react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


interface Log {
    id: number;
    date: string;
    type: 'pending' | 'approve' | 'reject' | 'return';
    quantity: number;
    notes?: string;
    // Add other fields if needed
}

interface ApiResponse {
    success: boolean;
    per_page: number;
    current_page: number;
    has_more: boolean;
    logs: any[];
}

interface PageProps {
    medicineId: number;
    medicineName: string;
}

const ViewLogDialog = ({ medicineId, medicineName }: PageProps) => {
    const [open, setOpen] = useState(false);
    const [logs, setLogs] = useState<Log[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async (pageNumber = 1) => {
        setLoading(true);
        try {
            // Use the proper route and parameters
            const response = await fetch(route('medicines.logs', {
                medicine: medicineId,
                per_page: 10,
                page: pageNumber
            }));

            const data: ApiResponse = await response.json();

            if (!data.success) {
                throw new Error('Failed to fetch logs');
            }

            const arr = Array.isArray(data.logs) ? data.logs : [];
            const mapped: Log[] = arr.map((item: any) => ({
                id: item.id,
                date: item.date || item.created_at,
                quantity: item.quantity,
                notes: item.notes,
                type: item.log_type as Log['type'],
            }));

            setHasMore(data.has_more);

            if (pageNumber === 1) {
                setLogs(mapped);
            } else {
                setLogs(prev => [...prev, ...mapped]);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            setLogs([]);
            setPage(1);
            setHasMore(true);
            fetchLogs(1);
        }
    }, [open, medicineId]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchLogs(nextPage);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" size="sm">
                    <ReceiptText className="mr-2 h-4 w-4" />
                    View Logs
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle>Logs for "{medicineName}"</DialogTitle>
                    <DialogDescription>
                        All transaction logs.
                    </DialogDescription>
                </DialogHeader>

                {logs.length === 0 && !loading && (
                    <div className="text-center py-4">No logs found.</div>
                )}

                {logs.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Quantity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{new Date(log.date).toLocaleDateString()}
                                        <TooltipProvider>
                                            <Tooltip>
                                                    {log.notes && (
                                                <TooltipTrigger className="cursor-pointer">
                                                    <MessageCircleQuestion className="ml-2 h-4 w-4 text-muted-foreground" />
                                                </TooltipTrigger>
                                                )}
                                                <TooltipContent>
                                                    {log.notes || 'No notes available'}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                log.type === 'approve' ? 'default' :
                                                    log.type === 'reject' ? 'destructive' :
                                                        log.type === 'pending' ? 'secondary' :
                                                            'outline'
                                            }
                                            className="capitalize"
                                        >
                                            {log.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{log.quantity}</TableCell>
                                </TableRow>

                            ))}
                        </TableBody>
                    </Table>
                )}

                {hasMore && (
                    <div className="flex justify-center mt-4">
                        <Button variant="outline" size="sm" onClick={loadMore} disabled={loading}>
                            {loading ? 'Loading...' : 'Load More'}
                        </Button>
                    </div>
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

export default ViewLogDialog;
