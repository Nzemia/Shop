import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
    getPageNumbers: number[];
    totalItems: number;
    itemsPerPage: number;
    startIndex: number;
    endIndex: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    canGoNext,
    canGoPrevious,
    getPageNumbers,
    totalItems,
    startIndex,
    endIndex
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            {/* Results info */}
            <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {endIndex} of {totalItems} products
            </div>

            {/* Pagination controls */}
            <div className="flex items-center space-x-2">
                {/* Previous button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canGoPrevious}
                    className="flex items-center space-x-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                </Button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                    {/* First page if not visible */}
                    {pageNumbers[0] > 1 && (
                        <>
                            <Button
                                variant={1 === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(1)}
                                className="w-8 h-8 p-0"
                            >
                                1
                            </Button>
                            {pageNumbers[0] > 2 && (
                                <span className="text-gray-400 px-1">...</span>
                            )}
                        </>
                    )}

                    {/* Visible page numbers */}
                    {pageNumbers.map((pageNum) => (
                        <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageChange(pageNum)}
                            className="w-8 h-8 p-0"
                        >
                            {pageNum}
                        </Button>
                    ))}

                    {/* Last page if not visible */}
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                        <>
                            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                                <span className="text-gray-400 px-1">...</span>
                            )}
                            <Button
                                variant={totalPages === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(totalPages)}
                                className="w-8 h-8 p-0"
                            >
                                {totalPages}
                            </Button>
                        </>
                    )}
                </div>

                {/* Next button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canGoNext}
                    className="flex items-center space-x-1"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}