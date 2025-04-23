import { Table } from "@tanstack/react-table";
import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { router } from "@inertiajs/react";

export interface PaginationProps {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
}

interface PageProps<TData> {
  table: Table<TData>;
  pagination: PaginationProps;
}

function Pagination<TData>({ pagination }: PageProps<TData>) {

  const navigateToPage = (url: string | null) => {
    if (!url) return;
    const urlObj = new URL(url);
    router.visit(urlObj.pathname + urlObj.search);
  };

  const parseLabel = (label: string) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(`<!doctype html><body>${label}`, "text/html");
    return dom.body.textContent || "";
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 mb-10 gap-4 sm:gap-6">
      {/* Total Results */}
      <div className="text-xs sm:text-sm text-muted-foreground">
        Showing <span className="font-medium">{pagination.to}</span> to{" "}
        <span className="font-medium">{pagination.to}</span> of{" "}
        <span className="font-medium">{pagination.total}</span> results
      </div>

      {/* Pagination Component */}
      <ShadPagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e: { preventDefault: () => void; }) => {
                e.preventDefault();
                navigateToPage(pagination.links?.[0]?.url);
              }}
              className={pagination.current_page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {Array.isArray(pagination.links) &&
            pagination.links.map((link, index) => {
              if (index === 0 || index === pagination.links.length - 1) return null;

              const label = parseLabel(link.label);
              {/* add ellipsis if link is more than 2 */}
              if (label === "...") {
                return (
                  <PaginationItem key={index}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={link.active}
                    onClick={(e: { preventDefault: () => void; }) => {
                      e.preventDefault();
                      navigateToPage(link.url);
                    }}
                  >
                    {label}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e: { preventDefault: () => void; }) => {
                e.preventDefault();
                navigateToPage(pagination.links?.[pagination.links.length - 1]?.url);
              }}
              className={pagination.current_page === pagination.last_page ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadPagination>
    </div>
  );
}

export default Pagination;
