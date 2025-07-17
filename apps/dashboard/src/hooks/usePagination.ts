import { useState, useMemo } from 'react';

interface UsePaginationProps {
    totalItems: number;
    itemsPerPage?: number;
    initialPage?: number;
}

interface UsePaginationReturn {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    startIndex: number;
    endIndex: number;
    goToPage: (page: number) => void;
    goToNext: () => void;
    goToPrevious: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
    getPageNumbers: number[];
}

export const usePagination = ({
    totalItems,
    itemsPerPage = 10,
    initialPage = 1
}: UsePaginationProps): UsePaginationReturn => {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const canGoNext = currentPage < totalPages;
    const canGoPrevious = currentPage > 1;

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const goToNext = () => {
        if (canGoNext) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPrevious = () => {
        if (canGoPrevious) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const getPageNumbers = useMemo(() => {
        const pages: number[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show smart pagination
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    }, [currentPage, totalPages]);

    return {
        currentPage,
        totalPages,
        itemsPerPage,
        startIndex,
        endIndex,
        goToPage,
        goToNext,
        goToPrevious,
        canGoNext,
        canGoPrevious,
        getPageNumbers
    };
};