// Pagination component
import { Button } from "@/components/ui/button";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center gap-2 mt-6">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"}
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={page === currentPage ? "default" : "outline"}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {">"}
      </Button>
    </div>
  );
};
