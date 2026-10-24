import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { HealthCheck } from "./HealthCheck";
import { apiClient } from "../api/client";

vi.mock("../api/client", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe("HealthCheck", () => {
  const mockApiClient = vi.mocked(apiClient);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockApiClient.get.mockResolvedValueOnce({ data: { status: "ok", database: "connected" } });
    render(<HealthCheck />);
    expect(screen.getByText("Checking backend health...")).toBeInTheDocument();
  });

  it("displays healthy status when API returns ok", async () => {
    mockApiClient.get.mockResolvedValueOnce({ data: { status: "ok", database: "connected" } });
    render(<HealthCheck />);

    await waitFor(() => {
      expect(screen.getByText("Backend: Healthy")).toBeInTheDocument();
      expect(screen.getByText("Database: Connected")).toBeInTheDocument();
    });
  });

  it("displays degraded status when API returns degraded", async () => {
    mockApiClient.get.mockResolvedValueOnce({ data: { status: "degraded", database: "disconnected" } });
    render(<HealthCheck />);

    await waitFor(() => {
      expect(screen.getByText("Backend: Degraded")).toBeInTheDocument();
      expect(screen.getByText("Database: Disconnected")).toBeInTheDocument();
    });
  });

  it("displays error message when API call fails", async () => {
    mockApiClient.get.mockRejectedValueOnce(new Error("Network error"));
    render(<HealthCheck />);

    await waitFor(() => {
      expect(screen.getByText("Error: Network error")).toBeInTheDocument();
    });
  });

  it("shows retry button after error", async () => {
    mockApiClient.get.mockRejectedValueOnce(new Error("Network error"));
    render(<HealthCheck />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    });
  });

  it("retries health check when retry button is clicked", async () => {
    mockApiClient.get
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({ data: { status: "ok", database: "connected" } });

    render(<HealthCheck />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    });

    const retryButton = screen.getByRole("button", { name: /retry/i });
    const { fireEvent } = await import("@testing-library/react");
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText("Backend: Healthy")).toBeInTheDocument();
    });
  });
});