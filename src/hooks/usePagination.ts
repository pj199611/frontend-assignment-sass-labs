import { useState,useMemo } from "react";
import {PartialIProject} from "../interfaces/IProjectResponse";


const usePagination = (
    data: PartialIProject[],
  ) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [recordsPerPage,setRecordsPerPage]=useState<number>(5);
    const totalPages = useMemo(() => Math.ceil(data.length / recordsPerPage), [data, recordsPerPage]);
  
    const currentRecords = useMemo(() => {
      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      return data.slice(indexOfFirstRecord, indexOfLastRecord);
    }, [currentPage, recordsPerPage, data]);
  
    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };
  
    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newRecordsPerPage = Number(event.target.value);
      setRecordsPerPage(newRecordsPerPage); 
      setCurrentPage(1); 
    };
  
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    return {
      currentPage,
      totalPages,
      recordsPerPage,
      currentRecords,
      handlePageChange,
      handleRowsPerPageChange,
      handlePrevPage,
      handleNextPage,
    };
  };
  

  export default usePagination