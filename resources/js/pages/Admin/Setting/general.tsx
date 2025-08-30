import InputError from '@/components/input-error';
import { OptionType, SelectInput } from '@/components/SelectInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import timezones from 'timezones-list';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Site Settings', href: '/admin/settings' },
    { title: 'General Settings', href: '/admin/settings/general' },
];

interface GeneralSettingsProps {
    settings: {
        site_name: string;
        site_description: string;
        site_logo: string;
        site_favicon: string;
        site_active: boolean;
        user_timezone: string;
        site_currency: string;
        site_footer_credit: string;
    };
}

export default function GeneralSettingsPage({ settings }: GeneralSettingsProps) {
    const { data, setData, put, processing, errors } = useForm({
        site_name: settings.site_name,
        site_description: settings.site_description,
        site_logo: undefined as File | undefined, // update from null to undefined
        site_favicon: undefined as File | undefined, // update from null to undefined
        site_active: settings.site_active,
        user_timezone: settings.user_timezone,
        site_currency: settings.site_currency,
        site_footer_credit: settings.site_footer_credit,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            site_name: data.site_name.trim(),
            site_description: data.site_description?.trim() ?? null,
            site_active: data.site_active ? 1 : 0,   // make sure it's 1/0 or true/false
            user_timezone: data.user_timezone || 'UTC',
            site_currency: data.site_currency.trim() || '$',
            site_footer_credit: data.site_footer_credit?.trim() ?? null,
            site_logo: data.site_logo,
            site_favicon: data.site_favicon,
        };
        

        router.post(route('settings.general.update'), payload, {
            preserveScroll: true,
            preserveState: true,
            forceFormData: true,
            onSuccess: () => {
                router.reload;
            },
            // method: 'put',
        });
    };

    function getPreview(file: File | null, fallback: string) {
        if (file) {
            return URL.createObjectURL(file); // for newly uploaded file
        }
        return fallback ? `/storage/${fallback}` : ''; // show stored logo/favicon
    }

    function isLogoUploaded() {
        return settings.site_logo && !data.site_logo; // existing saved logo
    }

    function isFaviconUploaded() {
        return settings.site_favicon && !data.site_favicon;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="General Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div>
                    <div className="mb-4">
                        <h1 className="mb-5 text-2xl font-bold">General Settings</h1>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="site_name">Site Name</Label>
                                <Input
                                    id="site_name"
                                    name="site_name"
                                    type="text"
                                    value={data.site_name}
                                    onChange={(e) => setData('site_name', e.target.value)}
                                />
                                <InputError message={errors.site_name} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="site_description">Site Description</Label>
                                <Textarea
                                    id="site_description"
                                    name="site_description"
                                    value={data.site_description}
                                    onChange={(e) => setData('site_description', e.target.value)}
                                />
                                <InputError message={errors.site_description} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="site_logo">Site Logo</Label>
                                {isLogoUploaded() && <img src={settings.site_logo} alt="Site Logo" className="h-16 object-contain" />}
                                {data.site_logo && (
                                    <img src={URL.createObjectURL(data.site_logo)} alt="New Logo Preview" className="h-16 object-contain" />
                                )}
                                <Input
                                    id="site_logo"
                                    name="site_logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        setData('site_logo', file ?? undefined); // use undefined if no file
                                    }}
                                />
                                <InputError message={errors.site_logo} />
                            </div>

                            {/* Site Favicon */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="site_favicon">Site Favicon</Label>
                                {isFaviconUploaded() && (
                                    <img src={settings.site_favicon} alt="Site Favicon" className="h-10 object-contain" />
                                )}
                                {data.site_favicon && (
                                    <img src={URL.createObjectURL(data.site_favicon)} alt="New Logo Preview" className="h-16 object-contain" />
                                )}
                                <Input
                                    id="site_favicon"
                                    name="site_favicon"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setData('site_favicon', file ?? undefined);
                                    }}
                                />
                                <InputError message={errors.site_favicon} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="site_active">Site Active</Label>
                                <Select
                                    name="site_active"
                                    value={data.site_active ? '1' : '0'}
                                    onValueChange={(value) => setData('site_active', value === '1')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Yes</SelectItem>
                                        <SelectItem value="0">No</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.site_active} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="user_timezone">User Timezone</Label>
                                <SelectInput<OptionType>
                                    id="user_timezone"
                                    name="user_timezone"
                                    value={
                                        timezones
                                            .map((tz) => ({ value: tz.tzCode, label: tz.label }))
                                            .find((tz) => tz.value === data.user_timezone) || null
                                    }
                                    onChange={(option) => setData('user_timezone', option ? option.value : '')}
                                    options={timezones.map((timezone) => ({
                                        value: timezone.tzCode,
                                        label: timezone.label,
                                    }))}
                                    placeholder="Select timezone"
                                />
                                <InputError message={errors.user_timezone} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="site_currency">Site Currency</Label>
                                <Input
                                    id="site_currency"
                                    name="site_currency"
                                    type="text"
                                    value={data.site_currency}
                                    onChange={(e) => setData('site_currency', e.target.value)}
                                />
                                <InputError message={errors.site_currency} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="site_footer_credit">Site Footer Credit</Label>
                                <Textarea
                                    id="site_footer_credit"
                                    name="site_footer_credit"
                                    value={data.site_footer_credit}
                                    onChange={(e) => setData('site_footer_credit', e.target.value)}
                                />
                                <InputError message={errors.site_footer_credit} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
