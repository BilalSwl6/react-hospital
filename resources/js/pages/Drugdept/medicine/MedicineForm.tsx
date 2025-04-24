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
//import { InertiaMultiSelect } from '@/components/multi-select';
import { Medicine } from './index';

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
        expiry_date: medicine.expiry_date || '',
        category: medicine.category || '',
        manufacturer: medicine.manufacturer || '',
        status: medicine.status !== undefined ? medicine.status : 1,
    };

    const { data, setData, post, put, processing, errors } = useForm(defaultData);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted:', typeof(data.generic_id));

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

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="description">Description</Label>
                <Input
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    required
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="generic_id">Generic</Label>
                { /*
                <InertiaMultiSelect
                    id="generic_id"
                    name="generic_id"
                    staticOptions={generics.data}
                    labelKey="name"
                    valueKey="id"
                    multiple={false}
                    placeholder="Select Generic"
                    className={errors.generic_id ? "border-red-500" : ""}
                    defaultValue={data.generic_id}
                />
                        */ }
                <InputError message={errors.generic_id} className="mt-2" />
            </div>


            <div className="mb-4">
                <Label htmlFor="price">Price</Label>
                <Input
                    id="price"
                    type="number"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
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
                />
                <InputError message={errors.batch_no} className="mt-2" />
            </div>

            <div className="mb-4">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
                id="dosage"
                value={data.dosage}
                onChange={(e) => setData('dosage', e.target.value)}
            />
            <InputError message={errors.dosage} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="strength">Strength</Label>
                <Input
                    id="strength"
                    value={data.strength}
                    onChange={(e) => setData('strength', e.target.value)}
                />
                <InputError message={errors.strength} className="mt-2" />
            </div>

            <div className="mb-4">
            <Label htmlFor="route">Route</Label>
                {/*
            <InertiaMultiSelect
                id="route"
                name="route"
                staticOptions={[
                    { id: 'oral', name: 'Oral' },
                    { id: 'intravenous', name: 'Intravenous' },
                    { id: 'intramuscular', name: 'Intramuscular' },
                    { id: 'subcutaneous', name: 'Subcutaneous' },
                    { id: 'topical', name: 'Topical' },
                    { id: 'inhalation', name: 'Inhalation' },
                    { id: 'ophthalmic', name: 'Ophthalmic' },
                    { id: 'nasal', name: 'Nasal' },
                    { id: 'rectal', name: 'Rectal' },
                ]}
                labelKey="name"
                valueKey="id"
                creatable
                multiple={false}
                placeholder="Select Route"
                className={errors.route ? "border-red-500" : ""}
                defaultValue={data.route}
            />
                        */}
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
            />
            <InputError message={errors.expiry_date} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                    id="manufacturer"
                    value={data.manufacturer}
                    onChange={(e) => setData('manufacturer', e.target.value)}
                />
                <InputError message={errors.manufacturer} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="category">Category</Label>
                <Input
                    id="category"
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                />
                <InputError message={errors.category} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
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
    );
};

export default MedicineForm;
