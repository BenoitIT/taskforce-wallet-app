"use client";
import PaginatorProps from "../interfaces/pagination";
const Paginator: React.FC<PaginatorProps> = ({
  activePage,
  totalPages,
  onPageChange,
  onPreviousPageChange,
  onNextPageChange,
}) => {
  return (
    <div className={totalPages == 1 ? "hidden" : "mr-[1vw]"}>
      <button
        disabled={activePage === 1}
        className="px-4 md:py-2 xs:py-1 mx-1 text-[#55865f] font-normal text-sm border shadow border-grey-200 bg-white rounded-md hover:bg-[#55865f] hover:text-white disabled:cursor-not-allowed disabled:pointer-events-none"
        onClick={onPreviousPageChange}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => {
        const ActivepageNumber = i + 1;
        return (
          <button
            key={ActivepageNumber}
            className={`px-4 md:py-2 xs:py-1 mx-1 text-grey-800 font-normal text-sm  rounded-md border shadow border-grey-400 ${
              activePage == ActivepageNumber
                ? "bg-[#55865f] text-white"
                : " bg-transparent  border border-[#55865f] hover:bg-[#55865f] text-black"
            }`}
            onClick={() => onPageChange(ActivepageNumber)}
          >
            {ActivepageNumber}
          </button>
        );
      })}
      <button
        disabled={totalPages === activePage}
        className="px-4 md:py-2 xs:py-1 mx-1 text-[#55865f] font-normal text-sm  rounded-md border shadow border-grey-400 bg-white   disabled:cursor-not-allowed disabled:pointer-events-none"
        onClick={onNextPageChange}
      >
        Next
      </button>
      <button className="px-4 md:py-2 xs:py-1  mx-1 text-[#55865f] text-sm font-light rounded-md border shadow border-grey-400 bg-white">
        {activePage}/{totalPages}
      </button>
    </div>
  );
};

export default Paginator;
