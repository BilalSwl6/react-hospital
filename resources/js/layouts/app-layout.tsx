import MessageBox from '@/components/message-box';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const currentYear = new Date().getFullYear();

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { settings } = usePage<SharedData>().props;
    return (
        <>
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
                <MessageBox />
                <footer className="w-full border-t py-6">
                    <div className="container mx-auto flex flex-col space-y-2 p-4 px-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                        <p className="text-muted-foreground text-sm">
                            &copy; {currentYear} - {usePage<SharedData>().props.settings.name}. All rights reserved.
                        </p>
                        <p className="text-muted-foreground text-sm">
                            Developed by <span dangerouslySetInnerHTML={{ __html: settings.footer_credit ?? '' }} />
                        </p>
                    </div>
                </footer>
            </AppLayoutTemplate>
        </>
    );
};
