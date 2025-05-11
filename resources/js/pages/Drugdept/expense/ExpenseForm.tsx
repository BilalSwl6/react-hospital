import React from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { Ward, Expense} from './index';
import { SelectInput } from '@/components/SelectInput';

interface PageProps {
    expense?: Expense;
    wards: Ward[];
    closeModal: () => void;
    isEditing?: boolean;
}

const ExpenseForm = ({
    expense = {} as Expense,
    wards,
    closeModal,
    isEditing,
}: PageProps) => {


    // Format the expiry date for the date input (YYYY-MM-DD)
    const formatDateForInput = (dateString: string): string => {
        if (!dateString) return '';

        // Parse the ISO date and format it as YYYY-MM-DD
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const defaultData = {
        date: expense.date || new Date().toISOString().split('T')[0], // Default to today's date
        ward_id: expense.ward_id || '',
        note: expense.note || '',
    };

    const { data, setData, post, put, processing, errors } = useForm(defaultData);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEditing) {
            put(route('expense.update', expense.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('expense.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <Label htmlFor="date">Date</Label>
                <Input
                    id="date"
                    type="date"
                    value={formatDateForInput(data.date)}
                    onChange={(e) => setData('date', e.target.value)}
                    tabIndex={1}
                    // add today date by default
                    required
                />
                <InputError message={errors.date} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="ward_id">Ward</Label>
                <SelectInput
                    id="ward_id"
                    name="ward_id"
                    options={wards.map((ward) => ({
                        value: ward.id,
                        label: ward.name,
                    }))}
                    value={wards
                        .map((ward) => ({
                            value: ward.id,
                            label: ward.name,
                        }))
                        .find((option) => option.value === data.ward_id)}
                    onChange={(selectedOption) => {
                        setData('ward_id', selectedOption?.value || '');
                    }}
                    placeholder="Select Ward"
                    className={errors.ward_id ? "border-red-500" : ""}
                    tabIndex={3}
                />

                <InputError message={errors.ward_id} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="note"
                    value={data.note}
                    onChange={(e) => setData('note', e.target.value)}
                    tabIndex={2}
                />
                <InputError message={errors.note} className="mt-2" />
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

export default ExpenseForm;
