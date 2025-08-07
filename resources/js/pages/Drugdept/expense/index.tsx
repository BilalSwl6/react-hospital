import InputError from '@/components/input-error';
import { SelectInput } from '@/components/SelectInput';
import { ColumnHeader } from '@/components/table/column-header';
import DataTable from '@/components/table/data-table';
import { PaginationProps } from '@/components/table/pagination';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { can } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CircleHelp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import CreateExpenseDialog from './CreateExpenseDialog';
import EditExpenseDialog from './EditExpenseDialog';
import ViewExpenseRecords from './ViewExpenseRecords';

// Define interfaces for the data structures
export interface Expense {
    id: number;
    date: string;
    ward_id: number;
    ward_name: string;
    note: string;
    total_items?: number;
}

export interface Ward {
    id: number;
    name: string;
}

interface MedicineOption {
    value: number;
    label: string;
    medicine_name?: string;
    generic_name?: string;
    category?: string;
    strength?: string;
    route?: string;
}

interface PageProps {
    data: {
        data: Expense[];
        meta: PaginationProps;
    };
    wards: {
        data: Ward[];
    };
    filters?: {
        ward_id?: number;
        medicine_id?: number;
        medicine_name?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Expenses', href: '/expenses' }];

const ExpenseIndex = ({ data, wards, filters = {} }: PageProps) => {
    const {
        data: formData,
        setData,
        errors,
        get,
    } = useForm<{
        ward_id: number[] | [];
        medicine_id: number[] | [];
        medicine_name: string;
    }>({
        ward_id: filters.ward_id ? (Array.isArray(filters.ward_id) ? filters.ward_id : [filters.ward_id]) : [],
        medicine_id: filters.medicine_id ? (Array.isArray(filters.medicine_id) ? filters.medicine_id : [filters.medicine_id]) : [],
        medicine_name: filters.medicine_name || '',
    });

    // State to track selected medicine options
    const [selectedMedicines, setSelectedMedicines] = useState<MedicineOption[]>([]);

    // State to hold all available medicines
    const [availableMedicines, setAvailableMedicines] = useState<MedicineOption[]>([]);

    // Fetch all medicines on component mount
    useEffect(() => {
        const fetchAllMedicines = async () => {
            try {
                const response = await fetch(route('medicines.search'), { headers: { 'X-Requested-With': 'XMLHttpRequest' } });

                const data = await response.json();

                if (data.success) {
                    const options = data.items.map((item: any) => ({
                        value: item.id,
                        label: item.text,
                    }));
                    setAvailableMedicines(options);
                }
            } catch (error) {
                console.error('Error fetching all medicines:', error);
            }
        };

        fetchAllMedicines();
    }, []);

    useEffect(() => {
        if (filters.medicine_id) {
            // Convert to array if it's not already
            const medicineIds = Array.isArray(filters.medicine_id) ? filters.medicine_id : [filters.medicine_id];

            if (availableMedicines.length > 0 && medicineIds.length > 0) {
                const selectedOptions = availableMedicines.filter((med) => medicineIds.includes(med.value as number));
                setSelectedMedicines(selectedOptions);
            }
        }
    }, [filters.medicine_id, availableMedicines]);

    const handleMedicineSearch = async (inputValue: string): Promise<MedicineOption[]> => {
        try {
            if (!inputValue || inputValue.length < 2) {
                return availableMedicines;
            }

            const response = await fetch(route('medicines.search', { q: inputValue }), { headers: { 'X-Requested-With': 'XMLHttpRequest' } });

            const data = await response.json();

            if (data.success) {
                // Format data for react-select
                const options = data.items.map((item: any) => ({
                    value: item.id,
                    label: item.text,
                }));

                return options;
            }
        } catch (error) {
            console.error('Error searching medicines:', error);
        }

        return availableMedicines;
    };

    // Handle search form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('expense.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Table columns
    const columns = useMemo<ColumnDef<Expense>[]>(
        () => [
            {
                accessorKey: 'id',
                header: ({ column }) => <ColumnHeader column={column} title="Sr No." />,
                cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.index + 1}</div>,
            },
            {
                accessorKey: 'date',
                header: ({ column }) => <ColumnHeader column={column} title="Date" />,
                cell: ({ row }) => {
                    const date = new Date(row.original.date);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
                    const year = date.getFullYear();

                    return <div className="text-muted-foreground text-sm">{`${day}-${month}-${year}`}</div>;
                },
            },
            {
                accessorKey: 'ward_name',
                header: ({ column }) => <ColumnHeader column={column} title="Ward" />,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <div className="text-muted-foreground text-sm">{row.original.ward_name}</div>
                        {row.original.note && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <CircleHelp className="text-muted-foreground h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{row.original.note}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                ),
            },
            {
                accessorKey: 'total_items',
                header: ({ column }) => <ColumnHeader column={column} title="Total Items" />,
                cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.original.total_items || 0}</div>,
            },
            {
                id: 'actions',
                header: ({ column }) => <ColumnHeader column={column} title="Actions" />,
                cell: ({ row }) => (
                    <div className="flex items-center space-x-3">
                        {can('expenseRecord.create') && (
                            <Link href={route('expenseRecord.create', { expense_id: row.original.id })}>
                                <Button variant="default" size="sm">
                                    Create Record
                                </Button>
                            </Link>
                        )}
                        {can('expense.edit') && <EditExpenseDialog wards={wards.data} expense={row.original} />}
                        {can('expenseRecord.view') && <ViewExpenseRecords expenseId={row.original.id} />}
                    </div>
                ),
            },
        ],
        [],
    );

    // Create ward options for SelectInput
    const wardOptions: MedicineOption[] = wards.data
        ? wards.data.map((ward) => ({
              value: ward.id,
              label: ward.name,
          }))
        : [];

    // Find selected ward options
    //const selectedWardOptions = wardOptions.filter(option =>
    //  Array.isArray(formData.ward_id) && formData.ward_id.includes(option.value as number)
    //);
    const selectedWardOptions = wardOptions.filter(
        (option) => Array.isArray(formData.ward_id) && formData.ward_id.map(Number).includes(option.value as number),
    );

    // When medicine is selected
    const handleMedicineChange = (selectedOptions: MedicineOption[]) => {
        setSelectedMedicines(selectedOptions);

        const medicineIds = selectedOptions.map((option) => option.value);
        const medicineNames = selectedOptions.map((option) => option.label).join(', ');

        setData((data) => ({
            ...data,
            medicine_id: medicineIds as number[],
            medicine_name: medicineNames,
        }));
    };

    // When ward is selected
    const handleWardChange = (selectedOptions: MedicineOption[]) => {
        const wardIds = selectedOptions.map((option) => option.value);

        setData((data) => ({
            ...data,
            ward_id: wardIds as number[],
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Expense History" />
            <div className="container mx-auto py-6">
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <h1 className="mb-4 text-2xl font-bold md:mb-0">Expense Management</h1>
                    <div className="flex flex-wrap gap-2">
                        <CreateExpenseDialog wards={wards.data} />
                        <Button variant="secondary">
                            <a href={route('expense.export')} className="btn btn-primary" target="_blank">
                                Export
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Responsive filter form */}
                <div className="mb-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                            {/* Ward filter - full width on mobile, takes 5/12 on desktop */}
                            <div className="space-y-2 md:col-span-5">
                                <Label htmlFor="ward_id" className="text-sm font-medium">
                                    Ward
                                </Label>
                                <SelectInput<MedicineOption, true> // Note the second generic argument 'true' for multi
                                    id="ward_id"
                                    name="ward_id"
                                    options={wardOptions}
                                    value={selectedWardOptions}
                                    onChange={(selected) => {
                                        const selectedOptions = Array.isArray(selected) ? selected : selected ? [selected] : [];
                                        handleWardChange(selectedOptions);
                                    }}
                                    placeholder="Select Ward"
                                    className={errors.ward_id ? 'border-red-500' : ''}
                                    isClearable
                                    isMulti // Add this line
                                />
                                {errors.ward_id && <InputError message={errors.ward_id} className="mt-1" />}
                            </div>

                            {/* Medicine filter - full width on mobile, takes 5/12 on desktop */}
                            <div className="space-y-2 md:col-span-5">
                                <Label htmlFor="medicine" className="text-sm font-medium">
                                    Medicine
                                </Label>
                                <SelectInput<MedicineOption, true>
                                    id="medicine"
                                    name="medicine"
                                    placeholder="Search for medicine..."
                                    className={errors.medicine_id ? 'border-red-500' : ''}
                                    isAsync={true}
                                    loadOptions={handleMedicineSearch}
                                    value={selectedMedicines}
                                    defaultOptions={true}
                                    onChange={(selected) => {
                                        // Handle both array and single selection cases
                                        const selectedOptions = Array.isArray(selected) ? selected : selected ? [selected] : [];
                                        handleMedicineChange(selectedOptions);
                                    }}
                                    isClearable
                                    isMulti
                                    // Use the appropriate prop for multiple selection
                                    // Based on error messages, let's try an alternative approach
                                />
                                {errors.medicine_id && <InputError message={errors.medicine_id} className="mt-1" />}
                            </div>

                            {/* Button - full width on mobile, takes 2/12 on desktop */}
                            <div className="flex items-end md:col-span-2">
                                <Button type="submit" variant="default" className="w-full md:h-10">
                                    Search
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="rounded-lg border shadow-sm">
                    <div className="overflow-x-auto">
                        <DataTable data={data.data} columns={columns} pagination={data.meta} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ExpenseIndex;
