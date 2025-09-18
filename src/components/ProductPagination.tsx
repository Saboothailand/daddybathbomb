import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}: ProductPaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const generatePageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push('ellipsis-start');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('ellipsis-end');
      }
      
      // Show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
      {/* Results info */}
      <div className="text-[#B8C4DB] text-sm">
        Showing <span className="font-bold text-white">{startItem}</span> to{' '}
        <span className="font-bold text-white">{endItem}</span> of{' '}
        <span className="font-bold text-white">{totalItems}</span> products
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-[#151B2E] border-[#334155] text-white hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed comic-button"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <div key={index} className="flex items-center justify-center w-10 h-10">
                  <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                </div>
              );
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 p-0 comic-button ${
                  currentPage === page
                    ? 'bg-[#007AFF] border-[#007AFF] text-white hover:bg-[#0051D5]'
                    : 'bg-[#151B2E] border-[#334155] text-white hover:bg-[#1E293B]'
                }`}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Mobile page indicator */}
        <div className="sm:hidden flex items-center gap-2">
          <span className="text-[#B8C4DB] text-sm">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-[#151B2E] border-[#334155] text-white hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed comic-button"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Items per page selector */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-[#B8C4DB] text-sm">Show:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            // This would trigger a props callback in a real implementation
            console.log('Items per page changed:', e.target.value);
          }}
          className="bg-[#151B2E] border border-[#334155] text-white rounded-lg px-3 py-1 text-sm focus:border-[#007AFF] focus:outline-none"
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={36}>36</option>
          <option value={48}>48</option>
        </select>
        <span className="text-[#B8C4DB] text-sm">per page</span>
      </div>
    </div>
  );
}