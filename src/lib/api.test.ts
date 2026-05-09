import { describe, it, expect, vi, beforeEach } from "vitest";
import * as api from "../lib/api";
import type { Contragent, Organization, SalePayload } from "../lib/types";

const mockContragent: Contragent = {
  id: "1",
  name: "Test Client",
  phone: "+79001234567",
};

const mockOrganization: Organization = {
  id: "1",
  name: "Test Organization",
  inn: "1234567890",
};

describe("API Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchContragents", () => {
    it("должен возвращать массив клиентов", async () => {
      const mockResponse = [mockContragent];
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.fetchContragents("test-token");
      expect(result).toEqual(mockResponse);
    });

    it("должен выбрасывать ошибку при невалидном токене", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ detail: "Unauthorized" }),
      });

      await expect(api.fetchContragents("invalid-token")).rejects.toThrow("Unauthorized");
    });
  });

  describe("fetchOrganizations", () => {
    it("должен возвращать массив организаций", async () => {
      const mockResponse = [mockOrganization];
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.fetchOrganizations("test-token");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchWarehouses", () => {
    it("должен возвращать массив складов", async () => {
      const mockResponse = [{ id: "1", name: "Warehouse 1" }];
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.fetchWarehouses("test-token");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchPayboxes", () => {
    it("должен возвращать массив счетов", async () => {
      const mockResponse = [{ id: "1", name: "Paybox 1" }];
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.fetchPayboxes("test-token");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchPriceTypes", () => {
    it("должен возвращать массив типов цен", async () => {
      const mockResponse = [{ id: "1", name: "Розничная" }];
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.fetchPriceTypes("test-token");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchNomenclature", () => {
    it("должен возвращать массив номенклатуры", async () => {
      const mockResponse = [{ id: "1", name: "Product 1", unit_price: 100 }];
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.fetchNomenclature("test-token");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("searchClientByPhone", () => {
    it("должен возвращать клиента при успешном поиске", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([mockContragent]),
      });

      const result = await api.searchClientByPhone("test-token", "+79001234567");
      expect(result).toEqual(mockContragent);
    });

    it("должен возвращать null если клиент не найден", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const result = await api.searchClientByPhone("test-token", "+79999999999");
      expect(result).toBeNull();
    });
  });

  describe("createSale", () => {
    it("должен создавать продажу со статусом draft", async () => {
      const payload: Omit<SalePayload, "token"> = {
        contragent_id: null,
        organization_id: "1",
        paybox_id: "1",
        warehouse_id: "1",
        price_type_id: "1",
        comment: "Test",
        positions: [{ nomenclature_id: "1", quantity: 1, unit_price: 100 }],
      };

      const mockResponse = { id: "sale-1", status: "draft" as const };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.createSale("test-token", payload, "draft");
      expect(result).toEqual(mockResponse);
    });

    it("должен создавать продажу со статусом committed", async () => {
      const payload: Omit<SalePayload, "token"> = {
        contragent_id: null,
        organization_id: "1",
        paybox_id: "1",
        warehouse_id: "1",
        price_type_id: "1",
        comment: "Test",
        positions: [{ nomenclature_id: "1", quantity: 1, unit_price: 100 }],
      };

      const mockResponse = { id: "sale-1", status: "committed" as const };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await api.createSale("test-token", payload, "committed");
      expect(result).toEqual(mockResponse);
    });
  });
});