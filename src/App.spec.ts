import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

// Mocking axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create a QueryClient for React Query context
const queryClient = new QueryClient();

const renderWithQueryClient = (ui: JSX.Element) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display loading state initially", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] }); // mock empty data for the first query

    renderWithQueryClient(<App />);

    // Check if "Loading..." text is visible
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("should display error message when data fetch fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Failed to fetch data"));

    renderWithQueryClient(<App />);

    await waitFor(() => expect(screen.getByText(/Error: Failed to fetch data/)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /Retry loading the project/ })).toBeInTheDocument();
  });

  it("should display projects after successful data fetch", async () => {
    const mockProjects = [
      {
        "s.no": 1,
        "percentage.funded": "80%",
        "amt.pledged": 1000,
      },
      {
        "s.no": 2,
        "percentage.funded": "50%",
        "amt.pledged": 500,
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockProjects });

    renderWithQueryClient(<App />);

    await waitFor(() => expect(screen.getByText(/Projects Status Table/)).toBeInTheDocument());

    // Check if table rows are rendered correctly
    expect(screen.getByText("1")).toBeInTheDocument(); // S.No. 1
    expect(screen.getByText("80%")).toBeInTheDocument(); // Percentage funded
    expect(screen.getByText("$1,000")).toBeInTheDocument(); // Amt. pledged

    expect(screen.getByText("2")).toBeInTheDocument(); // S.No. 2
    expect(screen.getByText("50%")).toBeInTheDocument(); // Percentage funded
    expect(screen.getByText("$500")).toBeInTheDocument(); // Amt. pledged
  });

  it("should allow pagination to next page", async () => {
    const mockProjects = Array.from({ length: 20 }, (_, i) => ({
      "s.no": i + 1,
      "percentage.funded": "50%",
      "amt.pledged": 1000,
    }));

    mockedAxios.get.mockResolvedValueOnce({ data: mockProjects });

    renderWithQueryClient(<App />);

    await waitFor(() => screen.getByText("Projects Status Table"));

    const nextButton = screen.getByLabelText(/Next page/);
    fireEvent.click(nextButton);

    // Assert that the page has changed by checking the page number
    expect(screen.getByText("Page 2")).toBeInTheDocument();
  });

  it("should not go past the last page when clicking next", async () => {
    const mockProjects = Array.from({ length: 5 }, (_, i) => ({
      "s.no": i + 1,
      "percentage.funded": "50%",
      "amt.pledged": 1000,
    }));

    mockedAxios.get.mockResolvedValueOnce({ data: mockProjects });

    renderWithQueryClient(<App />);

    await waitFor(() => screen.getByText("Projects Status Table"));

    const nextButton = screen.getByLabelText(/Next page/);
    fireEvent.click(nextButton); // Go to next page

    // Assert that the button is disabled on the last page
    expect(nextButton).toBeDisabled();
  });

  it("should go to previous page when clicking prev", async () => {
    const mockProjects = Array.from({ length: 5 }, (_, i) => ({
      "s.no": i + 1,
      "percentage.funded": "50%",
      "amt.pledged": 1000,
    }));

    mockedAxios.get.mockResolvedValueOnce({ data: mockProjects });

    renderWithQueryClient(<App />);

    await waitFor(() => screen.getByText("Projects Status Table"));

    const nextButton = screen.getByLabelText(/Next page/);
    fireEvent.click(nextButton); // Go to next page

    const prevButton = screen.getByLabelText(/Previous page/);
    fireEvent.click(prevButton); // Go back to previous page

    // Assert that we are back on the first page
    expect(screen.getByText("Page 1")).toBeInTheDocument();
  });

  it("should allow changing rows per page", async () => {
    const mockProjects = Array.from({ length: 15 }, (_, i) => ({
      "s.no": i + 1,
      "percentage.funded": "50%",
      "amt.pledged": 1000,
    }));

    mockedAxios.get.mockResolvedValueOnce({ data: mockProjects });

    renderWithQueryClient(<App />);

    await waitFor(() => screen.getByText("Projects Status Table"));

    const rowsPerPageSelect = screen.getByRole("combobox");
    fireEvent.change(rowsPerPageSelect, { target: { value: "10" } });

    // Assert that the new value is selected
    expect(rowsPerPageSelect.value).toBe("10");
  });

  it("should focus retry button on error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Failed to fetch data"));

    renderWithQueryClient(<App />);

    await waitFor(() => screen.getByText(/Error: Failed to fetch data/));

    const retryButton = screen.getByRole("button", { name: /Retry loading the project/ });
    expect(retryButton).toHaveFocus();
  });
});
