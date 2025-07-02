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
    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(`<!doctype html><body>${label}`, "text/html");
      return dom.body.textContent || "";
    } catch (e) {
      return label;
    }
  };

  // Function to determine which page links to show
  const getVisiblePageLinks = () => {
    if (!pagination.links || pagination.links.length <= 2) return [];

    // Remove first and last links (previous and next)
    const pageLinks = pagination.links.slice(1, -1);

    // For small number of pages, show all
    if (pageLinks.length <= 5) return pageLinks;

    const currentPageIndex = pageLinks.findIndex(link => link.active);
    if (currentPageIndex === -1) return pageLinks.slice(0, 5); // Fallback if active page not found

    // Build visible links array
    const result = [];

    // If current page is not near the beginning, add ellipsis
    if (currentPageIndex > 1) {
      result.push({ url: null, label: "...", active: false });
    }

    // Include up to 1 page before current page
    if (currentPageIndex > 0) {
      result.push(pageLinks[currentPageIndex - 1]);
    }

    // Always include current page
    result.push(pageLinks[currentPageIndex]);

    // Include up to 1 page after current page
    if (currentPageIndex < pageLinks.length - 1) {
      result.push(pageLinks[currentPageIndex + 1]);
    }

    // If we're not near the end, add ellipsis
    if (currentPageIndex < pageLinks.length - 2) {
      result.push({ url: null, label: "...", active: false });
    }

    return result;
  };

  const visiblePageLinks = getVisiblePageLinks();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 mb-10 gap-4 sm:gap-6">
      {/* Total Results */}
      <div className="text-xs sm:text-sm text-muted-foreground">
        Showing <span className="font-medium">{pagination.from}</span> to{" "}
        <span className="font-medium">{pagination.to}</span> of{" "}
        <span className="font-medium">{pagination.total}</span> results
      </div>

      {/* Pagination Component */}
      <ShadPagination>
        <PaginationContent className="flex-wrap justify-center gap-1 sm:gap-2">
          {/* First Page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigateToPage(pagination.links?.[1]?.url); // First page (index 1 after prev)
              }}
              className={pagination.current_page === 1 ? "pointer-events-none opacity-50" : ""}
            >
              First
            </PaginationLink>
          </PaginationItem>

          {/* Previous Page */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.current_page > 1) {
                  navigateToPage(pagination.links?.[0]?.url);
                }
              }}
              className={pagination.current_page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {visiblePageLinks.map((link, index) => {
            // For ellipsis
            if (link.url === null) {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            // For normal page links
            return (
              <PaginationItem key={`page-${link.label}`}>
                <PaginationLink
                  href="#"
                  isActive={link.active}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToPage(link.url);
                  }}
                >
                  {parseLabel(link.label)}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Next Page */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (pagination.current_page < pagination.last_page) {
                  navigateToPage(pagination.links?.[pagination.links.length - 1]?.url);
                }
              }}
              className={pagination.current_page === pagination.last_page ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Last Page */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigateToPage(pagination.links?.[pagination.links.length - 2]?.url); // Last page (index -2 before next)
              }}
              className={pagination.current_page === pagination.last_page ? "pointer-events-none opacity-50" : ""}
            >
              Last
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </ShadPagination>
    </div>
  );
}

export default Pagination;
