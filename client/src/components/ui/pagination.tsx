import { Button } from "@/components/ui/button";

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (page > 1) onPageChange(page - 1);
    };
    const handleNext = () => {
        if (page < totalPages) onPageChange(page + 1);
    };

    // Show up to 5 page numbers
    const getPages = () => {
        const pages = [];
        let start = Math.max(1, page - 2);
        let end = Math.min(totalPages, page + 2);
        if (page <= 3) end = Math.min(5, totalPages);
        if (page >= totalPages - 2) start = Math.max(1, totalPages - 4);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={page === 1}>
                Prev
            </Button>
            {getPages().map((p) => (
                <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(p)}
                >
                    {p}
                </Button>
            ))}
            <Button variant="outline" size="sm" onClick={handleNext} disabled={page === totalPages}>
                Next
            </Button>
        </div>
    );
}
