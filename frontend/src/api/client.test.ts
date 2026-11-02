import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";

vi.mock("axios");

describe("apiClient", () => {
  const mockAxios = vi.mocked(axios, { deep: true });
  let mockInstance: {
    interceptors: { request: { use: ReturnType<typeof vi.fn> }; response: { use: ReturnType<typeof vi.fn> } };
    defaults: { baseURL: string; headers: { common: Record<string, string> } };
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockInstance = {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      defaults: {
        baseURL: "/api/v1",
        headers: { common: { "Content-Type": "application/json" } },
      },
      get: vi.fn(),
      post: vi.fn(),
    };

    mockAxios.create.mockReturnValue(mockInstance as unknown as ReturnType<typeof axios.create>);
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create axios instance with correct base URL", async () => {
    const { apiClient } = await import("./client");
    expect(mockAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "/api/v1",
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      })
    );
    expect(apiClient.axiosInstance.defaults.baseURL).toBe("/api/v1");
    expect(apiClient.axiosInstance.defaults.headers.common["Content-Type"]).toBe("application/json");
  });

  it("should have healthCheck method that calls axios get", async () => {
    const { apiClient } = await import("./client");
    mockInstance.get.mockResolvedValue({ data: { status: "ok", database: "connected" } });

    const result = await apiClient.healthCheck();

    expect(mockInstance.get).toHaveBeenCalledWith("/health");
    expect(result).toEqual({ status: "ok", database: "connected" });
  });

  it("should have healthCheckDb method that calls axios get", async () => {
    const { apiClient } = await import("./client");
    mockInstance.get.mockResolvedValue({ data: { status: "ok", database: "connected" } });

    const result = await apiClient.healthCheckDb();

    expect(mockInstance.get).toHaveBeenCalledWith("/health/db");
    expect(result).toEqual({ status: "ok", database: "connected" });
  });

  it("should call axios post for login", async () => {
    const { apiClient } = await import("./client");
    mockInstance.post.mockResolvedValue({ data: { access_token: "token123", token_type: "bearer" } });

    const result = await apiClient.login("user", "pass");

    expect(mockInstance.post).toHaveBeenCalled();
    expect(result).toEqual({ access_token: "token123", token_type: "bearer" });
  });
});

