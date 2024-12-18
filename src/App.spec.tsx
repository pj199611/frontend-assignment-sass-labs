import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { useQuery } from "@tanstack/react-query";
import usePagination from "./hooks/usePagination";
import { PartialIProject } from "./interfaces/IProjectResponse";

jest.mock("@tanstack/react-query");
jest.mock("./hooks/usePagination");

jest.mock("./config/axios", () => ({
  get: jest.fn(),
}));

const mockUseQueryAndPagination = (projects: PartialIProject[], isLoading: boolean, error: Error | null) => {
  (useQuery as jest.Mock).mockReturnValue({
    data: projects,
    isLoading: isLoading,
    error: error,
  });

  (usePagination as jest.Mock).mockReturnValue({
    currentPage: 1,
    totalPages: 2,
    currentRecords: projects,
    handleRowsPerPageChange: jest.fn(),
    handlePrevPage: jest.fn(),
    handleNextPage: jest.fn(),
    recordsPerPage: 5,
  });
};

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state", () => {
    mockUseQueryAndPagination([], true, null); 

    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders error state", () => {
    mockUseQueryAndPagination([], false, new Error("Failed to fetch data")); 

    render(<App />);
    expect(screen.getByText(/Error: Failed to fetch data/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  test("renders data when fetched successfully", () => {
    const projects: PartialIProject[] = [
      { "s.no": 1, "percentage.funded": 80, "amt.pledged": 100000 },
      { "s.no": 2, "percentage.funded": 60, "amt.pledged": 80000 },
    ];

    mockUseQueryAndPagination(projects, false, null);  

    render(<App />);
    expect(screen.getByText("Projects Status Table")).toBeInTheDocument();
    expect(screen.getByText("S.No.")).toBeInTheDocument();
    expect(screen.getByText("Percentage Funded")).toBeInTheDocument();
    expect(screen.getByText("Amount Pledged")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("$1,00,000")).toBeInTheDocument();
  });

  test("renders pagination controls", () => {
    const projects: PartialIProject[] = [
      { "s.no": 1, "percentage.funded": 80, "amt.pledged": 100000 },
      { "s.no": 2, "percentage.funded": 60, "amt.pledged": 80000 },
    ];

    mockUseQueryAndPagination(projects, false, null);  

    render(<App />);
    const prevButton = screen.getByRole("button", { name: /prev/i });
    const nextButton = screen.getByRole("button", { name: /next/i });
    const pageInfo = screen.getByText(/Page 1 of 2/i);
    const rowsPerPageSelect = screen.getByRole("combobox");

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
    expect(pageInfo).toBeInTheDocument();
    expect(rowsPerPageSelect).toBeInTheDocument();
  });

  test("clicking retry button retries loading data", () => {
    mockUseQueryAndPagination([], false, new Error("Failed to fetch data")); 

    render(<App />);

    const retryButton = screen.getByRole("button", { name: /retry/i });
    delete window.location; 
    window.location = { reload: jest.fn() } as any;

    fireEvent.click(retryButton);
    expect(window.location.reload).toHaveBeenCalled();
  });
});
