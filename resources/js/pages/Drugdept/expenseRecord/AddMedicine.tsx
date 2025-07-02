import React, { useState, useEffect } from 'react';
import { SelectInput } from '@/components/SelectInput';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Head, Link, useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Medicine {
    id: number;
    name: string;
    generic_id: number;
    generic_name: string;
    category: string;
    strength: string;
    route: string;
    quantity: number;
}

interface Expense {
    id: number;
    ward_name: string;
    date: string;
}

interface PageProps {
    message?: string;
    expense: Expense;
    expense_id: number;
    medicines: {
        data: Medicine[];
    }
}

interface MedicineField {
    medicine_id: string;
    medicine_name: string;
    generic_name: string;
    quantity: string;
    availableQuantity: string;
    medicine_search: string;
}

function AddMedicine({ message, expense, expense_id, medicines }: PageProps) {
    const [medicineFields, setMedicineFields] = useState<MedicineField[]>([]);
    const [selectedMedicines, setSelectedMedicines] = useState<Map<number, string>>(new Map());
    const [medicineOptions, setMedicineOptions] = useState<any[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        expense_id: expense_id.toString(),
        medicine_id: [] as string[],
        medicine_name: [] as string[],
        generic_name: [] as string[],
        quantity: [] as string[],
        medicine_search: [] as string[]
    });

    const addMedicineField = () => {
        setMedicineFields(prevFields => {
            const updatedFields = [
                ...prevFields,
                {
                    medicine_id: '',
                    medicine_name: '',
                    generic_name: '',
                    quantity: '',
                    availableQuantity: '--',
                    medicine_search: ''
                }
            ];
            return updatedFields;
        });
    };

    const removeMedicineField = (index: number) => {
        const updatedFields = [...medicineFields];

        const medicineId = updatedFields[index].medicine_id;
        if (medicineId) {
            const updatedSelectedMedicines = new Map(selectedMedicines);
            updatedSelectedMedicines.delete(index);
            setSelectedMedicines(updatedSelectedMedicines);
        }

        updatedFields.splice(index, 1);
        setMedicineFields(updatedFields);

        // Update form data
        const medicine_ids = [...data.medicine_id];
        const medicine_names = [...data.medicine_name];
        const generic_names = [...data.generic_name];
        const quantities = [...data.quantity];
        const medicine_searches = [...data.medicine_search];

        medicine_ids.splice(index, 1);
        medicine_names.splice(index, 1);
        generic_names.splice(index, 1);
        quantities.splice(index, 1);
        medicine_searches.splice(index, 1);

        setData({
            ...data,
            medicine_id: medicine_ids,
            medicine_name: medicine_names,
            generic_name: generic_names,
            quantity: quantities,
            medicine_search: medicine_searches
        });
    };

    const handleSelectChange = (index: number, selectedOption: any) => {
        if (!selectedOption) {
            handleClearSelection(index);
            return;
        }

        const selectedId = selectedOption.value;
        const selectedMedicine = medicines.data.find(med => med.id.toString() === selectedId);

        // Check for duplicates
        let isDuplicate = false;
        selectedMedicines.forEach((value, key) => {
            if (value === selectedId && key !== index) {
                isDuplicate = true;
            }
        });

        if (isDuplicate) {
            alert('This medicine has already been added.');
            handleClearSelection(index);
            return;
        }

        const updatedSelectedMedicines = new Map(selectedMedicines);
        updatedSelectedMedicines.set(index, selectedId);
        setSelectedMedicines(updatedSelectedMedicines);

        // Get generic name directly from selected medicine
        const selectedGenericName = selectedMedicine?.generic_name || '';

        const updatedFields = [...medicineFields];
        updatedFields[index] = {
            ...updatedFields[index],
            medicine_id: selectedId,
            medicine_name: selectedMedicine?.name || '',
            generic_name: selectedGenericName,
            availableQuantity: selectedMedicine?.quantity.toString() || '--',
            medicine_search: selectedId
        };
        setMedicineFields(updatedFields);

        // Update form data
        const medicine_ids = [...data.medicine_id];
        const medicine_names = [...data.medicine_name];
        const generic_names = [...data.generic_name];
        const medicine_searches = [...data.medicine_search];

        medicine_ids[index] = selectedId;
        medicine_names[index] = selectedMedicine?.name || '';
        generic_names[index] = selectedGenericName;
        medicine_searches[index] = selectedId;

        setData({
            ...data,
            medicine_id: medicine_ids,
            medicine_name: medicine_names,
            generic_name: generic_names,
            medicine_search: medicine_searches
        });
    };

    const handleClearSelection = (index: number) => {
        const updatedSelectedMedicines = new Map(selectedMedicines);
        updatedSelectedMedicines.delete(index);
        setSelectedMedicines(updatedSelectedMedicines);

        const updatedFields = [...medicineFields];
        updatedFields[index] = {
            ...updatedFields[index],
            medicine_id: '',
            medicine_name: '',
            generic_name: '',
            availableQuantity: '--',
            medicine_search: ''
        };
        setMedicineFields(updatedFields);

        // Update form data
        const medicine_ids = [...data.medicine_id];
        const medicine_names = [...data.medicine_name];
        const generic_names = [...data.generic_name];
        const medicine_searches = [...data.medicine_search];

        medicine_ids[index] = '';
        medicine_names[index] = '';
        generic_names[index] = '';
        medicine_searches[index] = '';

        setData({
            ...data,
            medicine_id: medicine_ids,
            medicine_name: medicine_names,
            generic_name: generic_names,
            medicine_search: medicine_searches
        });
    };

    const handleQuantityChange = (index: number, value: string) => {
        // Check if quantity exceeds available quantity
        const availableQuantity = medicineFields[index].availableQuantity;
        if (availableQuantity !== '--' && parseInt(value) > parseInt(availableQuantity)) {
            alert(`Warning: The quantity entered (${value}) exceeds the available quantity (${availableQuantity}).`);
        }

        const updatedFields = [...medicineFields];
        updatedFields[index] = {
            ...updatedFields[index],
            quantity: value
        };
        setMedicineFields(updatedFields);

        const quantities = [...data.quantity];
        quantities[index] = value;

        setData({
            ...data,
            quantity: quantities
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Filter out empty fields
        const filteredData = {
            expense_id: data.expense_id,
            medicine_id: data.medicine_id.filter((id, index) => id && data.quantity[index]),
            medicine_name: data.medicine_name.filter((name, index) => data.medicine_id[index] && data.quantity[index]),
            generic_name: data.generic_name.filter((name, index) => data.medicine_id[index] && data.quantity[index]),
            quantity: data.quantity.filter((qty, index) => data.medicine_id[index] && qty)
        };

        post(route('expenseRecord.store'));
    };

    const getMedicineOptions = () => {
        if (!medicines.data) {
            return [];
        }

        const options = medicines.data.map(med => {
            // Extract properties safely with fallbacks
            const genericName = med.generic_name || 'Unknown';
            const category = med.category || 'Unknown';
            const strength = med.strength || 'Unknown';
            const route = med.route || 'Unknown';

            const displayText = `${med.name} (${genericName}) - ${category} - ${strength} - ${route}`;

            return {
                value: med.id.toString(),
                label: displayText
            };
        });

        return options;
    };


    // Prepare medicine options once on component mount and whenever data changes
    useEffect(() => {
        if (medicines.data?.length > 0) {
            const options = getMedicineOptions();
            setMedicineOptions(options);
        }
    }, [medicines.data]);

    useEffect(() => {
        // Initialize with 4 medicine fields
        addMedicineField();
        addMedicineField();

        // Add keyboard shortcut for adding new fields
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'N' && e.shiftKey) {
                addMedicineField();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <AppLayout>
            {/* ward name and date in title */}
            <Head title={`${expense.ward_name} - ${format(new Date(expense.date), 'dd-MM-yyyy')}`} />
            <div className="p-4 md:p-6 mx-auto">
                <h1 className="mb-4 md:mb-8 text-2xl md:text-4xl font-bold text-center">
                    Create New Record{" "}
                    <span className="block md:inline text-sm mt-1 md:mt-0">
                        ({expense.ward_name} - {format(new Date(expense.date), 'dd-MM-yyyy')})
                    </span>
                </h1>

                <Separator className="mb-4 md:mb-6" />

                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <Link
                        href={route('expense.index')}
                        className="inline-block px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base font-bold text-white bg-blue-600 rounded hover:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-700"
                        id="back-button"
                    >
                        Back
                    </Link>
                </div>

                {message && (
                    <div className="mb-4 text-sm text-red-600">
                        {message}
                    </div>
                )}

                <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                    <AlertDescription className="text-sm">
                        <p className="font-semibold mb-1">Quick Tips:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-xs font-mono">Shift + N</kbd> to quickly add a new medicine field (make sure Caps Lock is off)</li>
                            <li>All fields are required except those marked as optional</li>
                            <li>System will warn you when quantity exceeds available stock</li>
                        </ul>
                    </AlertDescription>
                </Alert>

                <Card className="rounded-lg shadow-lg">
                    <CardContent className="p-3 md:p-6">
                        <form id="expenseForm" className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <input type="hidden" name="expense_id" value={expense_id} />

                            <div id="medicineFields" className="space-y-4">
                                {medicineFields.map((field, index) => (
                                    <div
                                        key={index}
                                        className="p-3 md:p-4 rounded-lg border border-gray-200 dark:border-gray-700 input-group"
                                    >
                                        <input
                                            type="hidden"
                                            id={`medicine_id_${index}`}
                                            name="medicine_id[]"
                                            value={field.medicine_id}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                            <div className="col-span-1 md:col-span-2 lg:col-span-1">
                                                <Label
                                                    htmlFor={`medicine_search_${index}`}
                                                    className="block text-sm font-medium mb-1"
                                                >
                                                    Search Medicine:
                                                </Label>
                                                <SelectInput
                                                    id={`medicine_search_${index}`}
                                                    name={`medicine_search_${index}`}
                                                    options={medicineOptions}
                                                    onChange={(option) => handleSelectChange(index, option)}
                                                    value={field.medicine_search ?
                                                        medicineOptions.find(opt => opt.value === field.medicine_search) : null
                                                    }
                                                    placeholder="Search for a medicine"
                                                    isClearable
                                                    className="w-full"
                                                    menuPortalTarget={document.body}
                                                    styles={{
                                                        menu: (provided) => ({
                                                            ...provided,
                                                            zIndex: 9999
                                                        })
                                                    }}
                                                />
                                                <InputError message={errors.medicine_id} className="mt-1" />
                                            </div>

                                            <div className="col-span-1">
                                                <Label
                                                    htmlFor={`medicine_name_${index}`}
                                                    className="block text-sm font-medium mb-1"
                                                >
                                                    Medicine Name:
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id={`medicine_name_${index}`}
                                                    name={`medicine_name_${index}`}
                                                    value={field.medicine_name}
                                                    readOnly
                                                    tabIndex={-1}
                                                />
                                            </div>

                                            <div className="col-span-1">
                                                <Label
                                                    htmlFor={`generic_name_${index}`}
                                                    className="block text-sm font-medium mb-1"
                                                >
                                                    Generic Name:
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id={`generic_name_${index}`}
                                                    name={`generic_name_${index}`}
                                                    value={field.generic_name}
                                                    readOnly
                                                    tabIndex={-1}
                                                />
                                            </div>

                                            <div className="col-span-1">
                                                <Label
                                                    htmlFor={`quantity_${index}`}
                                                    className="block text-sm font-medium mb-1"
                                                >
                                                    Quantity:
                                                </Label>
                                                <Input
                                                    type="number"
                                                    id={`quantity_${index}`}
                                                    name={`quantity_${index}`}
                                                    value={field.quantity}
                                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                    min="1"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between col-span-1 md:col-span-2 lg:col-span-1">
                                                <div className="mr-2">
                                                    <Label className="block text-sm font-medium mb-1">
                                                        Available:
                                                    </Label>
                                                    <p
                                                        id={`available_quantity_${index}`}
                                                        className="text-sm font-medium"
                                                    >
                                                        {field.availableQuantity}
                                                    </p>
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() => removeMedicineField(index)}
                                                    className="h-10 px-3 text-sm"
                                                    size="sm"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addMedicineField}
                                    className="font-bold text-white bg-green-600 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-700"
                                >
                                    Add Medicine
                                </Button>
                            </div>

                            <div className="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto font-bold text-white bg-blue-600 hover:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-700"
                                >
                                    {processing ? 'Saving...' : 'Save Records'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

export default AddMedicine;
