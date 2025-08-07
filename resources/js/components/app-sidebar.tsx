import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { FlaskRoundIcon, FocusIcon, HouseIcon, LayoutGrid, PillIcon, ReceiptText } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutGrid,
      permission: 'allow.always',
      section: 'Platform',
    },
    {
      title: 'Wards',
      href: '/wards',
      icon: HouseIcon,
      permission: 'ward.view',
      section: 'Platform',
    },
    {
      title: 'Generics',
      href: '/generics',
      icon: FlaskRoundIcon,
      permission: 'generic.view',
      section: 'Platform',
    },
    {
      title: 'Expense',
      href: '/expense',
      icon: ReceiptText,
      permission: 'expense.view',
      section: 'Platform',
    },
    {
      title: 'Medicines',
      href: '/medicines',
      icon: PillIcon,
      permission: 'medicine.view',
      section: 'Platform',
    },
    {
        title: 'Manage',
        permission: 'user.view',
        icon: PillIcon,
        section: 'Admin',
        children: [
          {
            title: 'Users',
            href: '/admin/users',
            permission: 'user.view',
          },
          {
            title: 'Roles',
            href: '/admin/roles',
            permission: 'role.view',
          },
        ],
      },
  ];
  

const footerNavItems: NavItem[] = [
    {
        title: 'Shortcuts',
        href: '/shortcuts',
        icon: FocusIcon,
        permission: 'allow.always',
    }
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
