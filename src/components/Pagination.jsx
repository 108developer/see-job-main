import { Button } from "@/components/ui/button";

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  buttonsPerGroup = 10,
}) => {
  const currentGroup = Math.floor((currentPage - 1) / buttonsPerGroup);
  const startPage = currentGroup * buttonsPerGroup + 1;
  const endPage = Math.min(startPage + buttonsPerGroup - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const hasPrevGroup = startPage > 1;
  const hasNextGroup = endPage < totalPages;

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
      {hasPrevGroup && (
        <Button onClick={() => onPageChange(startPage - 1)}>{"<<"}</Button>
      )}

      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"}
      </Button>

      {pageNumbers.map((page) => (
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

      {hasNextGroup && (
        <Button onClick={() => onPageChange(endPage + 1)}>{">>"}</Button>
      )}
    </div>
  );
};
