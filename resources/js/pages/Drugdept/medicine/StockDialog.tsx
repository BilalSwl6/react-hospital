import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle } from "lucide-react";
import { Medicine } from "./index";
import { useForm } from "@inertiajs/react";
import InputError from "@/components/input-error";

interface StockDialogProps {
    medicine: Medicine;
}

const StockDialog = ({ medicine }: StockDialogProps) => {
    // Dialog state separate from form state
    const [open, setOpen] = React.useState(false);

    // Default form state
    const defaultFormState = {
        log_type: "pending",
        quantity: "",
        notes: "",
        expiry_date: "",
        date: "",
    };

    // Initialize form with default state
    const { data, setData, post, processing, errors, reset } = useForm(defaultFormState);

    // Hard reset function that explicitly sets each field back to default
    const hardReset = () => {
        setData(defaultFormState);
    };

    // Reset form when dialog opens (in case it was previously closed with data)
    useEffect(() => {
        if (open) {
            hardReset();
        }
    }, [open]);

    // Handle dialog state change
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            // When closing, force a hard reset
            hardReset();
        }
        setOpen(newOpen);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('medicines.addStock', medicine.id), {
            onSuccess: () => {
                // First reset the form
                hardReset();
                // Then close the dialog
                setOpen(false);
            }
        });
    };

    // Handle quantity input change with proper validation
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Remove leading zeros, but allow a single "0"
        const formattedValue = value === "0" || value === ""
            ? value
            : value.replace(/^0+/, '');

        setData('quantity', formattedValue);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <PlusCircle className="mr-1 h-3 w-3" />
                    Add Stock
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Stock</DialogTitle>
                    <DialogDescription>Update the stock details for this medicine.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="log_type_group">Log Type</Label>
                        <RadioGroup
                            id="log_type_group"
                            value={data.log_type}
                            onValueChange={(value) => setData('log_type', value)}
                            className="grid grid-cols-2 gap-2"
                        >
                            {["approve", "reject", "pending", "return"].map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <RadioGroupItem value={type} id={`log_type_${type}`} />
                                    <Label htmlFor={`log_type_${type}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <InputError message={errors.log_type} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="quantity_input">Quantity</Label>
                        <Input
                            id="quantity_input"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={data.quantity}
                            onChange={handleQuantityChange}
                            required
                        />
                        <InputError message={errors.quantity} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes_textarea">Notes</Label>
                        <Textarea
                            id="notes_textarea"
                            rows={2}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            required={data.log_type === "return"}
                        />
                        <InputError message={errors.notes} className="mt-2" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="expiry_date_input">Expiry Date</Label>
                            <Input
                                id="expiry_date_input"
                                type="date"
                                value={data.expiry_date}
                                onChange={(e) => setData('expiry_date', e.target.value)}
                            />
                            <InputError message={errors.expiry_date} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date_input">Transaction Date</Label>
                            <Input
                                id="date_input"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                required
                            />
                            <InputError message={errors.date} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default StockDialog;
