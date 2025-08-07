import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { can } from '@/lib/can';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface NavMainProps {
    items: NavItem[];
}

export function NavMain({ items = [] }: NavMainProps) {
    const page = usePage();
    const sections = groupBySection(items);

    return (
        <>
            {Object.entries(sections).map(([section, sectionItems]) => {
                // Filter items that are allowed (based on permission check)
                const visibleItems = sectionItems.filter((item) => {
                    if (item.children?.length) {
                        return item.children.some((child) => can(child.permission));
                    }
                    return can(item.permission);
                });

                if (visibleItems.length === 0) return null;

                return (
                    <SidebarGroup key={section} className="px-2 py-0">
                        <SidebarGroupLabel>{section}</SidebarGroupLabel>
                        <SidebarMenu>
                            {visibleItems.map((item) =>
                                item.children ? (
                                    <DropdownItem key={item.title} item={item} pageUrl={page.url} />
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.href === page.url} tooltip={{ children: item.title }}>
                                            <Link href={item.href!} prefetch>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ),
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                );
            })}
        </>
    );
}

function DropdownItem({ item, pageUrl }: { item: NavItem; pageUrl: string }) {
    const [open, setOpen] = useState(false);

    if (!item.children?.some((child) => can(child.permission))) return null;

    return (
        <SidebarMenuItem>
            <div className="hover:bg-muted flex cursor-pointer items-center justify-between rounded-md px-3 py-2" onClick={() => setOpen(!open)}>
                <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>
            {open && (
                <div className="mt-1 ml-5 flex flex-col gap-1">
                    {item.children.map((child) =>
                        can(child.permission) ? (
                            <SidebarMenuButton key={child.title} asChild isActive={child.href === pageUrl} tooltip={{ children: child.title }}>
                                <Link href={child.href!} className="pl-2 text-sm">
                                    <span>{child.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        ) : null,
                    )}
                </div>
            )}
        </SidebarMenuItem>
    );
}

// Helper to group by section
function groupBySection(items: NavItem[]): Record<string, NavItem[]> {
    return items.reduce(
        (acc, item) => {
            const section = item.section || 'Other';
            if (!acc[section]) acc[section] = [];
            acc[section].push(item);
            return acc;
        },
        {} as Record<string, NavItem[]>,
    );
}
