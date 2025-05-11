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
import { Badge } from '@/components/ui/badge';

interface ApiResponse {
  success: boolean;
  medicine: MedicineDetails;
}

interface MedicineDetails {
  id: number;
  name: string;
  description: string;
  generic_id: number;
  quantity: number;
  price: number;
  batch_no: string;
  dosage: string;
  strength: string;
  route: string;
  notes: string | null;
  expiry_date: string;
  category: string | null;
  manufacturer: string;
  status: number;
  image: string | null;
  total_quantity: number | null;
  generic: {
    id: number;
    generic_name: string;
    generic_description: string;
    generic_status: number;
    generic_notes: string | null;
    generic_category: string;
    generic_subcategory: string | null;
    therapeutic_class: string | null;
    created_at: string;
    updated_at: string;
  };
}

interface PageProps {
  medicine: {
    id: number;
    name: string;
  };
}

const ViewMedicineDialog = ({ medicine }: PageProps) => {
  const [open, setOpen] = useState(false);
  const [medicineDetails, setMedicineDetails] = useState<MedicineDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMedicineDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(route('medicines.show', {
        medicine: medicine.id
      }));

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error('Failed to fetch medicine details');
      }

      setMedicineDetails(data.medicine);
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMedicineDetails();
    }
  }, [open, medicine.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (date.getFullYear() === 1970) return 'N/A';
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: number) => {
    const variant = status === 1 ? 'default' : 'destructive';
    const label = status === 1 ? 'Active' : 'Inactive';

    return (
      <Badge variant={variant} className="capitalize">
        {label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm">
          <ReceiptText className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Medicine Details - "{medicine.name}"</DialogTitle>
          <DialogDescription>
            Complete information about this medicine
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}


        {!loading && !medicineDetails && (
          <div className="text-center py-4">Could not load medicine details.</div>
        )}

        {!loading && medicineDetails && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1">{getStatusBadge(medicineDetails.status)}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                {medicineDetails.price === 0 || medicineDetails.price === null ? (
                  <p className="mt-1 text-sm">Free</p>
                ) : (
                  <p className="mt-1 text-sm">{medicineDetails.price} RS</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-sm">{medicineDetails.description || 'No description available'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Generic Name</h3>
                <p className="mt-1 text-sm">{medicineDetails.generic.generic_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Generic Category</h3>
                <p className="mt-1 text-sm">{medicineDetails.generic.generic_category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
                <p className="mt-1 text-sm">{medicineDetails.quantity}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Quantity</h3>
                <p className="mt-1 text-sm">{medicineDetails.total_quantity || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Batch No.</h3>
                <p className="mt-1 text-sm">{medicineDetails.batch_no}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-sm">{medicineDetails.category || 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Dosage</h3>
                <p className="mt-1 text-sm">{medicineDetails.dosage}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Strength</h3>
                <p className="mt-1 text-sm">{medicineDetails.strength}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Route</h3>
                <p className="mt-1 text-sm">{medicineDetails.route}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
                <p className="mt-1 text-sm">{formatDate(medicineDetails.expiry_date)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Manufacturer</h3>
              <p className="mt-1 text-sm">{medicineDetails.manufacturer}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Generic Description</h3>
              <p className="mt-1 text-sm">{medicineDetails.generic.generic_description}</p>
            </div>

            {medicineDetails.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 text-sm">{medicineDetails.notes}</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMedicineDialog;
