// components/ward/WardForm.jsx
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WardForm = ({ ward = {}, closeModal, isEditing = false }) => {
  const defaultData = {
    name: ward.name || '',
    description: ward.description || '',
    capacity: ward.capacity || 0,
    status: ward.status !== undefined ? ward.status : 1,
  };

  const { data, setData, post, put, processing, errors } = useForm(defaultData);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      put(route('wards.update', ward.id), {
        onSuccess: () => closeModal(),
      });
    } else {
      post(route('wards.store'), {
        onSuccess: () => closeModal(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
          Ward Name
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
        <Label htmlFor="capacity" className="block mb-2 text-sm font-medium text-gray-700">
          Capacity
        </Label>
        <Input
          type="number"
          id="capacity"
          value={data.capacity}
          onChange={(e) => setData('capacity', parseInt(e.target.value, 10) || 0)}
          className="mt-1 block w-full"
          required
        />
        <InputError message={errors.capacity} className="mt-2" />
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
          {isEditing ? 'Update Ward' : 'Create Ward'}
        </Button>
      </div>
    </form>
  );
};

export default WardForm;


