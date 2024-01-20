import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";

const Pagination = ({ currentPage, setPage, totalPages }) => {
  const maxPageButtons = 5;

  const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  const pageNumbers = Array.from(
    { length: Math.min(maxPageButtons, totalPages) },
    (_, index) => startPage + index
  );

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => setPage(number)}
          className={`px-4 py-2 rounded-full ${
            currentPage === number ? "bg-blue-500 text-white" : "bg-white"
          } border border-gray-300`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
