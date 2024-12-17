import { renderHook, act } from "@testing-library/react-hooks";
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
      result.current.handlePageChange(2); // Move to the second page
    });

    act(() => {
      result.current.handlePrevPage(); // Go back to the first page
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentRecords).toEqual(
      paginationMockData.slice(0, 5)
    );
  });

  it("should go to the next page when handleNextPage is called", () => {
    const { result } = renderHook(() => usePagination(paginationMockData));

    act(() => {
      result.current.handlePageChange(1); // Move to the first page
    });

    act(() => {
      result.current.handleNextPage(); // Go to the next page
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentRecords).toEqual(
      paginationMockData.slice(5, 7)
    );
  });

  it("should not go past the last page when handleNextPage is called", () => {
    const { result } = renderHook(() => usePagination(paginationMockData));

    act(() => {
      result.current.handlePageChange(2); // Already on the last page
    });

    act(() => {
      result.current.handleNextPage(); // Try to go to the next page
    });

    expect(result.current.currentPage).toBe(2); // Should stay on the last page
    expect(result.current.currentRecords).toEqual(
      paginationMockData.slice(5, 7)
    );
  });

  it("should not go before the first page when handlePrevPage is called", () => {
    const { result } = renderHook(() => usePagination(paginationMockData));

    act(() => {
      result.current.handlePageChange(1); // Already on the first page
    });

    act(() => {
      result.current.handlePrevPage(); // Try to go to the previous page
    });

    expect(result.current.currentPage).toBe(1); // Should stay on the first page
    expect(result.current.currentRecords).toEqual(
      paginationMockData.slice(0, 5)
    );
  });
});
