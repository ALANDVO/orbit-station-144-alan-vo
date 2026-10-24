import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "./Dashboard";

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard title", () => {
    render(<Dashboard />);
    expect(screen.getByRole("heading", { name: /VoiceStudio/i })).toBeInTheDocument();
  });

  it("renders welcome message", () => {
    render(<Dashboard />);
    expect(screen.getByText(/Open-source voice AI platform/i)).toBeInTheDocument();
  });

  it("renders feature cards", () => {
    render(<Dashboard />);
    expect(screen.getByText(/Health Monitoring/i)).toBeInTheDocument();
    expect(screen.getByText(/Voice Synthesis/i)).toBeInTheDocument();
    expect(screen.getByText(/Model Management/i)).toBeInTheDocument();
  });

  it("renders quick actions section", () => {
    render(<Dashboard />);
    expect(screen.getByRole("heading", { name: /Quick Actions/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Check Backend Health/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /View API Docs/i })).toBeInTheDocument();
  });

  it("renders system status section", () => {
    render(<Dashboard />);
    expect(screen.getByRole("heading", { name: /System Status/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Backend/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Database/i).length).toBeGreaterThan(0);
  });
});