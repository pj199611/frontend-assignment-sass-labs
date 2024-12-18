import { renderHook, act } from "@testing-library/react";
import usePagination from "./usePagination";
import { paginationMockData } from "../mockData/paginationMockData";

describe("usePagination", () => {
  it("should initialize with the correct default values", () => {
    const { result } = renderHook(() => usePagination(paginationMockData));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.recordsPerPage).toBe(5);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.currentRecords).toEqual(
      paginationMockData.slice(0, 5)
    );
  });

  it("should change the current page when handlePageChange is called", () => {
    const { result } = renderHook(() => usePagination(paginationMockData));

    act(() => {
      result.current.handlePageChange(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentRecords).toEqual(
      paginationMockData.slice(5, 7)
    );
  });

  it("should update records per page and reset to first page when handleRowsPerPageChange is called", () => {
    const { result } = renderHook(() => usePagination(paginationMockData));

    act(() => {
      result.current.handleRowsPerPageChange({
        target: { value: "3" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });

    expect(result.current.recordsPerPage).toBe(3);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentRecords).toEqual(
      paginationMockData.slice(0, 3)
    );
  });

  it("should go to the previous page when handlePrevPage is called", () => {
    const { result } = renderHook(() => usePagination(paginationMockData));

    act(() => {
      result.current.handlePageChange(2);
    });

    act(() => {
      result.current.handlePrevPage();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentRecords).toEqual(
      paginationMockData.slice(0, 5)
    );
  });

  it("should go to the next page when handleNextPage is called", () => {
    const { result } = renderHook(() => usePagination(paginationMockData));

    act(() => {
      result.current.handlePageChange(1); 
    });

    act(() => {
      result.current.handleNextPage(); 
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentRecords).toEqual(
      paginationMockData.slice(5, 7)
    );
  });

  it("should not go past the last page when handleNextPage is called", () => {
    const { result } = renderHook(() => usePagination(paginationMockData));

    act(() => {
      result.current.handlePageChange(2); 
    });

    act(() => {
      result.current.handleNextPage();
    });

    expect(result.current.currentPage).toBe(2); 
    expect(result.current.currentRecords).toEqual(
      paginationMockData.slice(5, 7)
    );
  });

  it("should not go before the first page when handlePrevPage is called", () => {
    const { result } = renderHook(() => usePagination(paginationMockData));

    act(() => {
      result.current.handlePageChange(1); 
    });

    act(() => {
      result.current.handlePrevPage(); 
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentRecords).toEqual(
      paginationMockData.slice(0, 5)
    );
  });
});
