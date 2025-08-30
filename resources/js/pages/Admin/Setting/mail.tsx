import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Dialog } from '@headlessui/react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { type BreadcrumbItem, type SharedData } from '@/types';


interface MailSettingsProps {
    mailSettings: {
        provider: string;
        host: string;
        port: string;
        username: string;
        password: string;
        from_email: string;
        from_name: string;
        encryption: string;
        settings: string;
        mailgun_domain: string;
        mailgun_secret: string;
        mailgun_endpoint: string;
        resend_key: string;
    };
}

export default function MailSettingsPage({ mailSettings }: MailSettingsProps) {
    const { data, setData, post, processing, errors } = useForm({
        provider: mailSettings.provider || "",
        host: mailSettings.host || "",
        port: mailSettings.port || "",
        username: mailSettings.username || "",
        password: mailSettings.password || "",
        from_email: mailSettings.from_email || "",
        from_name: mailSettings.from_name || "",
        encryption: mailSettings.encryption || "",
        settings: mailSettings.settings || "",
        mailgun_domain: mailSettings.mailgun_domain || "",
        mailgun_secret: mailSettings.mailgun_secret || "",
        mailgun_endpoint: mailSettings.mailgun_endpoint || "",
        resend_key: mailSettings.resend_key || "",
    });

    const [isOpen, setIsOpen] = useState(false);
    const [testEmail, setTestEmail] = useState("");
    const [sending, setSending] = useState(false);
    const appEnv = usePage<SharedData>().props.appEnv;


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("settings.mail.update"), {
            preserveScroll: true,
        });
    };

    const handleTest = (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        router.post(route("settings.mail.test"), { email: testEmail }, {
            preserveScroll: true,
            onFinish: () => setSending(false),
            onSuccess: () => {
                setIsOpen(false);
                setTestEmail("");
            }
        });
    };

    const isEnv = data.provider === "env";

    return (
        <AppLayout>
            <Head title="Mail Settings" />

            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Mail Settings</h1>

                {appEnv === 'demo' && (
                        <div className="rounded-xl border border-yellow-500 p-4 text-sm text-yellow-600 shadow-sm">
                             <strong>Demo Mode:</strong> "Send Test Mail" feature is disabled. It will not work in demo mode.
                        </div>
                    )}
                {/* Settings Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Provider */}
                    <div>
                        <Label>Provider</Label>
                        <Select value={data.provider} onValueChange={(val) => setData("provider", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="smtp">SMTP</SelectItem>
                                <SelectItem value="mailgun">Mailgun</SelectItem>
                                <SelectItem value="resend">Resend</SelectItem>
                                <SelectItem value="env">ENV</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.provider} />
                    </div>

                    {/* Common fields (disable if env) */}
                    {!isEnv && (
                        <>
                            <div>
                                <Label>From Email</Label>
                                <Input
                                    type="email"
                                    value={data.from_email}
                                    onChange={(e) => setData("from_email", e.target.value)}
                                />
                                <InputError message={errors.from_email} />
                            </div>

                            <div>
                                <Label>From Name</Label>
                                <Input
                                    value={data.from_name}
                                    onChange={(e) => setData("from_name", e.target.value)}
                                />
                                <InputError message={errors.from_name} />
                            </div>
                        </>
                    )}

                    {/* SMTP */}
                    {data.provider === "smtp" && (
                        <>
                            <div>
                                <Label>Host</Label>
                                <Input value={data.host} onChange={(e) => setData("host", e.target.value)} />
                                <InputError message={errors.host} />
                            </div>

                            <div>
                                <Label>Port</Label>
                                <Input value={data.port} onChange={(e) => setData("port", e.target.value)} />
                                <InputError message={errors.port} />
                            </div>

                            <div>
                                <Label>Username</Label>
                                <Input value={data.username} onChange={(e) => setData("username", e.target.value)} />
                                <InputError message={errors.username} />
                            </div>

                            <div>
                                <Label>Password</Label>
                                <Input type="password" value={data.password} onChange={(e) => setData("password", e.target.value)} />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <Label>Encryption</Label>
                                <Select value={data.encryption} onValueChange={(val) => setData("encryption", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select encryption" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tls">TLS</SelectItem>
                                        <SelectItem value="ssl">SSL</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.encryption} />
                            </div>

                            <div>
                                <Label>Settings</Label>
                                <Select value={data.settings} onValueChange={(val) => setData("settings", val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select settings" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="queue">Queue</SelectItem>
                                        <SelectItem value="sync">Sync</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.settings} />
                            </div>
                        </>
                    )}

                    {/* Mailgun */}
                    {data.provider === "mailgun" && (
                        <>
                            <div>
                                <Label>Domain</Label>
                                <Input value={data.mailgun_domain} onChange={(e) => setData("mailgun_domain", e.target.value)} />
                                <InputError message={errors.mailgun_domain} />
                            </div>

                            <div>
                                <Label>Secret</Label>
                                <Input type="password" value={data.mailgun_secret} onChange={(e) => setData("mailgun_secret", e.target.value)} />
                                <InputError message={errors.mailgun_secret} />
                            </div>

                            <div>
                                <Label>Endpoint</Label>
                                <Input value={data.mailgun_endpoint} onChange={(e) => setData("mailgun_endpoint", e.target.value)} />
                                <InputError message={errors.mailgun_endpoint} />
                            </div>
                        </>
                    )}

                    {/* Resend */}
                    {data.provider === "resend" && (
                        <div>
                            <Label>API Key</Label>
                            <Input type="password" value={data.resend_key} onChange={(e) => setData("resend_key", e.target.value)} />
                            <InputError message={errors.resend_key} />
                        </div>
                    )}

                    {/* If env → just show info */}
                    {isEnv && (
                        <p className="text-sm text-gray-500">All mail settings are being read from <code>.env</code> file.</p>
                    )}

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>Save</Button>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>Send Test Mail</Button>
                    </div>
                </form>

                {/* Test Mail Dialog */}
                <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Dialog.Panel className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                            <Dialog.Title className="text-lg font-bold">Send Test Mail</Dialog.Title>
                            <form onSubmit={handleTest} className="space-y-4 mt-4">
                                <div>
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        value={testEmail}
                                        onChange={(e) => setTestEmail(e.target.value)}
                                        placeholder="Enter test email"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={sending || !testEmail}>Send</Button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </div>
        </AppLayout>
    );
}
