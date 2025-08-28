import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { can } from '@/lib/can';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from "lucide-react"
import { useState } from 'react';

interface NavMainProps {
    items: NavItem[];
    isSidebarOpen?: boolean; // Add prop to track sidebar state
}

export function NavMain({ items = [], isSidebarOpen = true }: NavMainProps) {
    const page = usePage();
    const sections = groupBySection(items);

    return (
        <div className="space-y-0.5">
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
                    <SidebarGroup key={section} className="px-2 py-1">
                        <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            {section}
                        </SidebarGroupLabel>
                        <SidebarMenu className="space-y-0.5">
                            {visibleItems.map((item) =>
                                item.children ? (
                                    <DropdownItem 
                                        key={item.title} 
                                        item={item} 
                                        pageUrl={page.url} 
                                        isSidebarOpen={isSidebarOpen}
                                    />
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={item.href === page.url} 
                                            tooltip={{ children: item.title }}
                                            className="h-9 px-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-md group"
                                        >
                                            <Link href={item.href!} prefetch>
                                                {item.icon && isSidebarOpen && (
                                                    <item.icon className="h-4 w-4 mr-2 transition-colors" />
                                                )}
                                                {item.icon && !isSidebarOpen && (
                                                    <item.icon className="h-4 w-4 transition-colors" />
                                                )}
                                                {isSidebarOpen && (
                                                    <span className="truncate">{item.title}</span>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ),
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                );
            })}
        </div>
    );
}

function DropdownItem({ item, pageUrl, isSidebarOpen }: { item: NavItem; pageUrl: string; isSidebarOpen: boolean }) {
    const storageKey = `sidebar-dropdown-${item.title}`;
  
    // Always call useState hook, regardless of conditions
    const [open, setOpen] = useState(() => {
        // Only access localStorage in browser environment
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : false;
        }
        return false;
    });

    // Check for visible children after hooks are called
    const hasVisibleChildren = item.children?.some((child) => can(child.permission));
    
    // Early return after all hooks are called
    if (!hasVisibleChildren) return null;
  
    const handleToggle = () => {
        const newState = !open;
        setOpen(newState);
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify(newState));
        }
    };
  
    return (
        <SidebarMenuItem>
            <div
                className="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground group min-h-[36px]"
                onClick={handleToggle}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {item.icon && <item.icon className="h-4 w-4 flex-shrink-0 transition-colors" />}
                    {isSidebarOpen && <span className="truncate">{item.title}</span>}
                </div>
                {isSidebarOpen && (
                    <ChevronRight
                        className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 text-muted-foreground group-hover:text-accent-foreground ${
                            open ? "rotate-90" : ""
                        }`}
                    />
                )}
            </div>

            {open && isSidebarOpen && (
                <div className="mt-0.5 ml-4 space-y-0.5">
                    {item.children?.map((child) =>
                        can(child.permission) ? (
                            <SidebarMenuButton
                                key={child.title}
                                asChild
                                isActive={child.href === pageUrl}
                                tooltip={{ children: child.title }}
                                className="h-7 px-2 text-xs font-normal transition-all duration-200 hover:bg-accent hover:text-accent-foreground rounded-sm"
                            >
                                <Link href={child.href!} className="block w-full">
                                    <span className="truncate">{child.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        ) : null
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