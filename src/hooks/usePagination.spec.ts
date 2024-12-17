import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react';
import usePagination from './usePagination';
import {PartialIProject} from "../interfaces/IProjectResponse";

describe('usePagination', () => {
  const mockData: PartialIProject[] = [
    { "s.no": 1, title: "Project 1" },
    { "s.no": 2, title: "Project 2" },
    { "s.no": 3, title: "Project 3" },
    { "s.no": 4, title: "Project 4" },
    { "s.no": 5, title: "Project 5" },
    { "s.no": 6, title: "Project 6" },
    { "s.no": 7, title: "Project 7" },
  ];

  it("should initialize with the correct default values", () => {
    const { result } = renderHook(() => usePagination(mockData));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.recordsPerPage).toBe(5);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.currentRecords).toEqual(mockData.slice(0, 5));
  });

  it("should change the current page when handlePageChange is called", () => {
    const { result } = renderHook(() => usePagination(mockData));
    act(() => {
      result.current.handlePageChange(2); 
    });
    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentRecords).toEqual(mockData.slice(5, 7)); 
  });

  it("should update records per page and reset to first page when handleRowsPerPageChange is called", () => {
    const { result } = renderHook(() => usePagination(mockData));
    act(() => {
      result.current.handleRowsPerPageChange({
        target: { value: "3" },
      } as React.ChangeEvent<HTMLSelectElement>);
    });
    expect(result.current.recordsPerPage).toBe(3);
    expect(result.current.currentPage).toBe(1); 
    expect(result.current.currentRecords).toEqual(mockData.slice(0, 3)); 
  });

  it("should go to the previous page when handlePrevPage is called", () => {
    const { result } = renderHook(() => usePagination(mockData));
    act(() => {
      result.current.handlePageChange(2); 
    });
    act(() => {
      result.current.handlePrevPage(); 
    });
    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentRecords).toEqual(mockData.slice(0, 5)); 
  });

  it("should go to the next page when handleNextPage is called", () => {
    const { result } = renderHook(() => usePagination(mockData));
    act(() => {
      result.current.handlePageChange(1);
    });
    act(() => {
      result.current.handleNextPage(); 
    });
    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentRecords).toEqual(mockData.slice(5, 7)); 
  });

  it("should not go past the last page when handleNextPage is called", () => {
    const { result } = renderHook(() => usePagination(mockData));
    act(() => {
      result.current.handlePageChange(2); 
    });
    act(() => {
      result.current.handleNextPage(); 
    });
    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentRecords).toEqual(mockData.slice(5, 7)); 
  });

  it("should not go before the first page when handlePrevPage is called", () => {
    const { result } = renderHook(() => usePagination(mockData));
    act(() => {
      result.current.handlePageChange(1); 
    });
    act(() => {
      result.current.handlePrevPage(); 
    });
    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentRecords).toEqual(mockData.slice(0, 5));
  });
});
