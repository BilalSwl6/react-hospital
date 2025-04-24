import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const GenericForm = ({ generic = {}, closeModal, isEditing = false }) => {
    const defaultData = {
        name: generic.name || '',
        description: generic.description || '',
        category: generic.category || '',
        sub_category: generic.sub_category || '',
        therapeutic_class: generic.therapeutic_class || '',
        notes: generic.notes || '',
        status: generic.status !== undefined ? generic.status : 1,
    };

    const { data, setData, post, put, processing, errors } = useForm(defaultData);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('generics.update', generic.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('generics.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <Label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                    Generic Name
                </Label>
                <Input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                </Label>
                <Input
                    type="text"
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
                    Category
                </Label>
                <Input
                    type="text"
                    id="category"
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.category} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="sub_category" className="block mb-2 text-sm font-medium text-gray-700">
                    Sub Category
                </Label>
                <Input
                    type="text"
                    id="sub_category"
                    value={data.sub_category}
                    onChange={(e) => setData('sub_category', e.target.value)}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.sub_category} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="therapeutic_class" className="block mb-2 text-sm font-medium text-gray-700">
                    Therapeutic Class
                </Label>
                <Input
                    type="text"
                    id="therapeutic_class"
                    value={data.therapeutic_class}
                    onChange={(e) => setData('therapeutic_class', e.target.value)}
                    className="mt-1 block w-full"
                    required
                />
                <InputError message={errors.therapeutic_class} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-700">
                    Notes
                </Label>
                <Textarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    className="mt-1 block w-full"
                />
                <InputError message={errors.notes} className="mt-2" />
            </div>

            <div className="mb-4">
                <Label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">
                    Status
                </Label>
                <Select
                    value={data.status.toString()}
                    onValueChange={(value) => setData('status', parseInt(value, 10))}
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

            <div className="flex items-center justify-end mt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="mr-2">
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {isEditing ? 'Update Generic' : 'Create Generic name'}
                </Button>
            </div>
        </form>
    );
};

export default GenericForm;
