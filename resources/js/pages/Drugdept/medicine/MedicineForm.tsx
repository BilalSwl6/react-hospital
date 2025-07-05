import React from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Medicine } from './index';
import { SelectInput } from '@/components/SelectInput';

interface PageProps {
    medicine?: Medicine;
    closeModal: () => void;
    isEditing?: boolean;
    generics: {
        data: {
            id: string;
            name: string;
        }[];
    };
}

const MedicineForm = ({
    medicine = {} as Medicine,
    closeModal,
    isEditing,
    generics,
}: PageProps) => {
    // Format the expiry date for the date input (YYYY-MM-DD)
    const formatDateForInput = (dateString: string): string => {
        if (!dateString) return '';

        // Parse the ISO date and format it as YYYY-MM-DD
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const defaultData = {
        name: medicine.name || '',
        description: medicine.description || '',
        generic_id: medicine.generic_id || '',
        price: medicine.price || '',
        quantity: medicine.quantity || '',
        batch_no: medicine.batch_no || '',
        dosage: medicine.dosage || '',
        strength: medicine.strength || '',
        route: medicine.route || '',
        notes: medicine.notes || '',
        expiry_date: formatDateForInput(medicine.expiry_date || ''),
        category: medicine.category || '',
        manufacturer: medicine.manufacturer || '',
        status: medicine.status !== undefined ? medicine.status : 1,
    };

    const { data, setData, post, put, processing, errors } = useForm(defaultData);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEditing) {
            put(route('medicines.update', medicine.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('medicines.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const routeOptions = [
        { value: 'oral', label: 'Oral' },
        { value: 'intravenous', label: 'Intravenous' },
        { value: 'intramuscular', label: 'Intramuscular' },
        { value: 'subcutaneous', label: 'Subcutaneous' },
        { value: 'topical', label: 'Topical' },
        { value: 'inhalation', label: 'Inhalation' },
        { value: 'ophthalmic', label: 'Ophthalmic' },
        { value: 'nasal', label: 'Nasal' },
        { value: 'rectal', label: 'Rectal' },
    ];

    // RSelect expects value to be the full option object
    const selectedRoute = routeOptions.find((option) => option.value === data.route);
    return (
        <>
        <div className='text-red-400 text-center mb-4'>
            Use notpad to to write details and than copy-paste here
        </div>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    tabIndex={1}
                    required
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    tabIndex={2}
                    required
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="generic_id">Generic</Label>
                <SelectInput
                    id="generic_id"
                    name="generic_id"
                    options={generics.data.map((generic) => ({
                        value: generic.id,
                        label: generic.name,
                    }))}
                    value={generics.data
                        .map((generic) => ({
                            value: generic.id,
                            label: generic.name,
                        }))
                        .find((option) => option.value === data.generic_id)}
                    onChange={(selectedOption) => {
                        setData('generic_id', selectedOption?.value || '');
                    }}
                    placeholder="Select Generic"
                    className={errors.generic_id ? "border-red-500" : ""}
                    tabIndex={3}
                />
                <InputError message={errors.generic_id} className="mt-2" />
            </div>


            <div className="mb-4">
                <Label htmlFor="price">Price</Label>
                <Input
                    id="price"
                    type="number"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    tabIndex={4}
                    placeholder="leave empty for free"
                />
                <InputError message={errors.price} className="mt-2" />
            </div>
            <div className="mb-4">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                    id="quantity"
                    type="number"
                    value={data.quantity}
                    onChange={(e) => setData('quantity', e.target.value)}
                    placeholder="add quantity after creating medicine"
                    tabIndex={5}
                    disabled
                />
                <InputError message={errors.quantity} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="batch_no">Batch No</Label>
                <Input
                    id="batch_no"
                    value={data.batch_no}
                    onChange={(e) => setData('batch_no', e.target.value)}
                    tabIndex={6}
                />
                <InputError message={errors.batch_no} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                    id="dosage"
                    value={data.dosage}
                    onChange={(e) => setData('dosage', e.target.value)}
                    placeholder="e.g. 500mg/vial"
                    tabIndex={7}
                />
                <InputError message={errors.dosage} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="strength">Strength</Label>
                <Input
                    id="strength"
                    value={data.strength}
                    onChange={(e) => setData('strength', e.target.value)}
                    placeholder="e.g. 500mg"
                    tabIndex={8}
                />
                <InputError message={errors.strength} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="route">Route</Label>
                <SelectInput
                    id="route"
                    name="route"
                    options={routeOptions}
                    value={selectedRoute}
                    onChange={(selectedOption) => {
                        setData('route', selectedOption?.value || '');
                    }}
                    placeholder="Select Route"
                    className={errors.route ? 'border-red-500' : ''}
                    tabIndex={9}
                />
                <InputError message={errors.route} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                    id="expiry_date"
                    type="date"
                    value={data.expiry_date}
                    onChange={(e) => setData('expiry_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]} // Disable past dates
                    placeholder="add expiry date after creating medicine (optional)"
                    tabIndex={10}
                />
                <InputError message={errors.expiry_date} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                    id="manufacturer"
                    value={data.manufacturer}
                    onChange={(e) => setData('manufacturer', e.target.value)}
                    tabIndex={11}
                />
                <InputError message={errors.manufacturer} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="category">Category</Label>
                <Input
                    id="category"
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    tabIndex={12}
                />
                <InputError message={errors.category} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    tabIndex={13}
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="status">Status</Label>
                <Select
                    value={String(data.status)}
                    onValueChange={(value) => setData('status', parseInt(value))}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.status} className="mt-2" />
            </div>

            <div className="flex justify-end mt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="mr-2">
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {isEditing ? 'Update Medicine' : 'Create Medicine'}
                </Button>
            </div>
        </form>
</>
    );
};

export default MedicineForm;
