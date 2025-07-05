import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps as InertiaPageProps, Page } from '@inertiajs/core';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

interface Records {
    id: number;
    date: string;
    status: string;
    file_name: string;
    file_size: string;
    started_at: string | null;
    error_message: string | null;
    completed_at: string | null;
    created_at: string;
}

interface BackupResponse {
    status: string;
    message: string;
    data?: {
        record_id: number;
        date: string;
        status: string;
    };
}

// ✅ This allows any extra props without type error
interface PageProps extends InertiaPageProps {
    records?: Records[];
    response?: BackupResponse;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Database Backups', href: '/settings/backup' }];

const formatFileSize = (bytes: string | number | null): string => {
    if (!bytes || bytes === '-' || bytes === '0') return '-';

    const numBytes = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
    if (isNaN(numBytes) || numBytes === 0) return '-';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const i = Math.floor(Math.log(numBytes) / Math.log(k));

    if (i === 0) return `${numBytes} B`;

    const size = (numBytes / Math.pow(k, i)).toFixed(1);
    return `${size} ${units[i]}`;
};

const formatDate = (value?: string | null): string => {
    if (!value) return '-';

    const date = new Date(value);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // If within last 24 hours, show relative time
    if (diffInHours < 24) {
        if (diffInHours < 1) {
            const minutes = Math.floor(diffInMs / (1000 * 60));
            return minutes <= 0 ? 'Just now' : `${minutes}m ago`;
        }
        return `${Math.floor(diffInHours)}h ago`;
    }

    // If within last 7 days, show days ago
    if (diffInDays < 7) {
        return `${Math.floor(diffInDays)}d ago`;
    }

    // Otherwise show formatted date in Pakistan timezone
    return date.toLocaleDateString('en-PK', {
        timeZone: 'Asia/Karachi',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getFullDateTime = (value?: string | null): string => {
    if (!value) return 'Not available';

    return new Date(value).toLocaleString('en-PK', {
        timeZone: 'Asia/Karachi',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    });
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'completed':
            return (
                <Badge variant="success" className="border-green-200 bg-green-100 text-green-800">
                    Completed
                </Badge>
            );
        case 'failed':
            return (
                <Badge variant="destructive" className="border-red-200 bg-red-100 text-red-800">
                    Failed
                </Badge>
            );
        case 'running':
            return (
                <Badge variant="outline" className="animate-pulse border-blue-500 bg-blue-50 text-blue-700">
                    Running
                </Badge>
            );
        case 'pending':
            return (
                <Badge variant="secondary" className="border-amber-400 bg-amber-50 text-amber-700">
                    Pending
                </Badge>
            );
        default:
            return (
                <Badge variant="outline" className="capitalize">
                    {status}
                </Badge>
            );
    }
};

const TruncatedCell = ({ content, maxLength = 25 }: { content: string; maxLength?: number }) => {
    if (!content || content === '-') {
        return <span className="text-muted-foreground">-</span>;
    }

    if (content.length <= maxLength) {
        return <span>{content}</span>;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="block cursor-help truncate">{content.substring(0, maxLength)}...</span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                    <p className="break-words">{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

const DateCell = ({ date }: { date: string | null }) => {
    if (!date) {
        return <span className="text-muted-foreground">-</span>;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="cursor-help font-medium">{formatDate(date)}</span>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>{getFullDateTime(date)}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default function DbBackup({ records: initialRecords }: { records: Records[] }) {
    const [records, setRecords] = useState<Records[]>(initialRecords);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    function handleRefresh() {
        setIsRefreshing(true);
        router.reload({
            only: ['records'],
            onFinish: () => setIsRefreshing(false),
            onSuccess: (page: Page<PageProps>) => {
                if (page.props.records) {
                    setRecords(page.props.records);
                }
            },
        });
    }

    function handleCreateBackup() {
        setIsCreating(true);

        axios
            .put(route('backup.database'))
            .then((response) => {
                const result: BackupResponse = response.data;

                if (result.status === 'success' && result.data) {
                    const newRecord: Records = {
                        id: result.data.record_id,
                        date: result.data.date,
                        status: result.data.status,
                        file_name: '-',
                        file_size: '-',
                        started_at: null,
                        error_message: null,
                        completed_at: null,
                        created_at: result.data.date,
                    };
                    setRecords((prev) => [newRecord, ...prev]);
                    toast(result.message, {
                        description: `${result.data.record_id} of ${result.data.date} with ${result.data.status}`,
                    });
                }
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'Something went wrong.');
            })
            .finally(() => {
                setIsCreating(false);
            });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Database Backup" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Database Backup Records"
                        description="View and manage database backup records with their current status and details."
                    />

                    <div className="flex items-center justify-end gap-3">
                        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="min-w-[100px]">
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </Button>
                        <Button onClick={handleCreateBackup} disabled={isCreating} className="min-w-[120px]">
                            {isCreating ? 'Creating...' : 'Create Backup'}
                        </Button>
                    </div>

                    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[900px]">
                                <TableCaption className="text-muted-foreground py-4 text-sm">
                                    Database backup records and their execution status
                                </TableCaption>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold whitespace-nowrap">Date Created</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">File Name</TableHead>
                                        <TableHead className="font-semibold">File Size</TableHead>
                                        <TableHead className="font-semibold">Started At</TableHead>
                                        <TableHead className="font-semibold">Completed At</TableHead>
                                        <TableHead className="font-semibold">Error Message</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-muted-foreground py-8 text-center">
                                                No backup records found. Create your first backup to get started.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        records.map((record) => (
                                            <TableRow key={record.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium">
                                                    <DateCell date={record.date} />
                                                </TableCell>
                                                <TableCell>{getStatusBadge(record.status)}</TableCell>
                                                <TableCell className="max-w-[180px]">
                                                    <TruncatedCell content={record.file_name} maxLength={25} />
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    <span
                                                        className={
                                                            record.file_size && record.file_size !== '-' ? 'text-foreground' : 'text-muted-foreground'
                                                        }
                                                    >
                                                        {formatFileSize(record.file_size)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <DateCell date={record.started_at} />
                                                </TableCell>
                                                <TableCell>
                                                    <DateCell date={record.completed_at} />
                                                </TableCell>
                                                <TableCell className="max-w-[200px]">
                                                    <TruncatedCell content={record.error_message || '-'} maxLength={30} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
