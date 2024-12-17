import React, { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./config/axios";
import usePagination from "./hooks/usePagination";
import { PartialIProject } from "./interfaces/IProjectResponse";
import "./App.css";

const fetchProjects = async (): Promise<PartialIProject[]> => {
  try {
    const response = await axiosInstance.get("frontend-assignment.json");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

const App = () => {
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const {
    currentPage,
    totalPages,
    currentRecords,
    handleRowsPerPageChange,
    handlePrevPage,
    handleNextPage,
    recordsPerPage,
  } = usePagination(projects);

  const retryButtonRef = useRef(null);

  useEffect(() => {
    if (error) {
      retryButtonRef?.current?.focus();
    }
  }, [error]);

  if (isLoading) {
    return <p aria-live="polite">Loading...</p>;
  }

  if (error instanceof Error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button
          ref={retryButtonRef}
          onClick={() => window.location.reload()}
          aria-label="Retry loading the project"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Projects Status Table</h1>
      <table className="projects-table" role="table">
        <thead>
          <tr>
            <th scope="col">S.No.</th>
            <th scope="col">Percentage Funded</th>
            <th scope="col">Amount Pledged</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((project, index) => (
            <tr key={project["s.no"]}>
              <td>{project["s.no"] + 1}</td>
              <td>{project["percentage.funded"]}</td>
              <td>${project["amt.pledged"].toLocaleString()}</td>
            </tr>
          ))}
          <tr className="pagination-row">
            <td colSpan={3}>
              <div className="pagination-controls">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="pagination-button"
                  aria-label="Previous page"
                >
                  Prev
                </button>
                <span className="page-info" aria-live="polite">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                  aria-label="Next page"
                >
                  Next
                </button>
                <select
                  value={recordsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="rows-per-page-select"
                >
                  <option value={5}>5 rows</option>
                  <option value={10}>10 rows</option>
                  <option value={15}>15 rows</option>
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
