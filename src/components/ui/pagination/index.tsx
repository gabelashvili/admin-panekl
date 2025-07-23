import { Pagination as PaginationComponent } from "react-headless-pagination";
import { buttonSizeClasses, buttonVariantClasses } from "../button/helprs";


interface PaginationProps {
  totalPages: number;
  edgePageCount?: number;
  middlePagesSiblingCount?: number;
  page: number;
  setPage: (page: number) => void;
}

const Pagination = ({ totalPages, edgePageCount, middlePagesSiblingCount, page, setPage  }: PaginationProps) => {

const handlePageChange = (page: number) => {
  setPage(page);
};

return (
  <>
    <PaginationComponent
      totalPages={totalPages}
      edgePageCount={edgePageCount || 2}
      middlePagesSiblingCount={middlePagesSiblingCount || 2}
      currentPage={page}
      setCurrentPage={handlePageChange}
      className="flex items-center gap-2"
      truncableText="..."
      truncableClassName=""
    >
    <PaginationComponent.PrevButton   className={`inline-flex items-center justify-center gap-2 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonSizeClasses.md} ${buttonVariantClasses.outline}`}   >
      Previous
    </PaginationComponent.PrevButton>

      <nav className="flex justify-center flex-grow">
        <ul className="flex items-center">
          <PaginationComponent.PageButton
            activeClassName="bg-brand-100 dark:bg-brand-500/40 dark:bg-opacity-0 text-primary-600 dark:text-white text-brand-500"
            inactiveClassName="text-gray-500"
            className="flex items-center justify-center h-10 w-10 rounded-full cursor-pointer "
          />
        </ul>
      </nav>

      <PaginationComponent.NextButton className={`inline-flex items-center justify-center gap-2 rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${buttonSizeClasses.md} ${buttonVariantClasses.outline}`}>
        Next
      </PaginationComponent.NextButton>
    </PaginationComponent>
  </>
);
}

export default Pagination;