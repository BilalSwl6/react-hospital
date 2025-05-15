import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import MessageBox from '@/components/message-box';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const currentYear = new Date().getFullYear();


export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <>
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
        <MessageBox />
    </AppLayoutTemplate>


    <footer className="w-full border-t py-6">
      <div className="container mx-auto flex flex-col space-y-2 px-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Sahiwal Teaching Hospital. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground">
          Developed by <a href="https://www.facebook.com/Bilalswl.6" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">Bilal Swl</a>
        </p>
      </div>
    </footer>

    </>
);
