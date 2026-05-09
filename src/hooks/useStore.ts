import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Contragent,
  Organization,
  Warehouse,
  Paybox,
  PriceType,
  Nomenclature,
  CartItem,
  SalePayload,
} from "@/lib/types";
import * as api from "@/lib/api";
import { generateId } from "@/lib/utils";

interface AppState {
  // Auth
  token: string;
  setToken: (token: string) => void;
  isAuthenticated: boolean;

  // Data
  contragents: Contragent[];
  organizations: Organization[];
  warehouses: Warehouse[];
  payboxes: Paybox[];
  priceTypes: PriceType[];
  nomenclature: Nomenclature[];

  // Loading states
  isLoading: boolean;
  isLoadingReferences: boolean;
  error: string | null;

  // Form
  selectedClient: Contragent | null;
  selectedOrganization: string;
  selectedPaybox: string;
  selectedWarehouse: string;
  selectedPriceType: string;
  cart: CartItem[];
  comment: string;

  // Actions
  loadReferences: () => Promise<void>;
  searchClient: (phone: string) => Promise<Contragent | null>;
  setSelectedClient: (client: Contragent | null) => void;
  setSelectedOrganization: (id: string) => void;
  setSelectedPaybox: (id: string) => void;
  setSelectedWarehouse: (id: string) => void;
  setSelectedPriceType: (id: string) => void;
  addToCart: (item: Omit<CartItem, "id" | "total">) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  setComment: (comment: string) => void;
  createSale: (status: "draft" | "committed") => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
}

const initialState = {
  token: "",
  isAuthenticated: false,
  contragents: [],
  organizations: [],
  warehouses: [],
  payboxes: [],
  priceTypes: [],
  nomenclature: [],
  isLoading: false,
  isLoadingReferences: false,
  error: null,
  selectedClient: null,
  selectedOrganization: "",
  selectedPaybox: "",
  selectedWarehouse: "",
  selectedPriceType: "",
  cart: [],
  comment: "",
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setToken: (token) => {
        set({ token, isAuthenticated: token.length >= 10 });
      },

      loadReferences: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoadingReferences: true, error: null });
        try {
          const [organizations, warehouses, payboxes, priceTypes, nomenclature] =
            await Promise.all([
              api.fetchOrganizations(token),
              api.fetchWarehouses(token),
              api.fetchPayboxes(token),
              api.fetchPriceTypes(token),
              api.fetchNomenclature(token),
            ]);

          set({
            organizations,
            warehouses,
            payboxes,
            priceTypes,
            nomenclature,
            isLoadingReferences: false,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to load data",
            isLoadingReferences: false,
          });
        }
      },

      searchClient: async (phone) => {
        const { token } = get();
        if (!token || !phone) return null;

        set({ isLoading: true, error: null });
        try {
          const client = await api.searchClientByPhone(token, phone);
          set({ selectedClient: client, isLoading: false });
          return client;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to search client",
            isLoading: false,
          });
          return null;
        }
      },

      setSelectedClient: (client) => set({ selectedClient: client }),
      setSelectedOrganization: (id) => set({ selectedOrganization: id }),
      setSelectedPaybox: (id) => set({ selectedPaybox: id }),
      setSelectedWarehouse: (id) => set({ selectedWarehouse: id }),
      setSelectedPriceType: (id) => set({ selectedPriceType: id }),
      setComment: (comment) => set({ comment }),

      addToCart: (item) => {
        const { cart } = get();
        const existing = cart.find((c) => c.nomenclature_id === item.nomenclature_id);
        
        if (existing) {
          set({
            cart: cart.map((c) =>
              c.nomenclature_id === item.nomenclature_id
                ? { ...c, quantity: c.quantity + item.quantity, total: (c.quantity + item.quantity) * c.unit_price }
                : c
            ),
          });
        } else {
          set({
            cart: [
              ...cart,
              {
                ...item,
                id: generateId(),
                total: item.quantity * item.unit_price,
              },
            ],
          });
        }
      },

      updateCartQuantity: (id, quantity) => {
        const { cart } = get();
        set({
          cart: cart
            .map((c) =>
              c.id === id
                ? { ...c, quantity, total: quantity * c.unit_price }
                : c
            )
            .filter((c) => c.quantity > 0),
        });
      },

      removeFromCart: (id) => {
        const { cart } = get();
        set({ cart: cart.filter((c) => c.id !== id) });
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + item.total, 0);
      },

      createSale: async (status) => {
        const {
          token,
          selectedClient,
          selectedOrganization,
          selectedPaybox,
          selectedWarehouse,
          selectedPriceType,
          cart,
          comment,
        } = get();

        const payload: Omit<SalePayload, "token"> = {
          contragent_id: selectedClient?.id || null,
          organization_id: selectedOrganization,
          paybox_id: selectedPaybox,
          warehouse_id: selectedWarehouse,
          price_type_id: selectedPriceType,
          comment,
          positions: cart.map((item) => ({
            nomenclature_id: item.nomenclature_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
        };

        set({ isLoading: true, error: null });
        try {
          await api.createSale(token, payload, status);
          set({
            isLoading: false,
            selectedClient: null,
            cart: [],
            comment: "",
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create sale",
            isLoading: false,
          });
        }
      },

      reset: () => set(initialState),
      setError: (error) => set({ error }),
    }),
    {
      name: "tablecrm-storage",
      partialize: (state) => ({
        token: state.token,
        selectedOrganization: state.selectedOrganization,
        selectedPaybox: state.selectedPaybox,
        selectedWarehouse: state.selectedWarehouse,
        selectedPriceType: state.selectedPriceType,
      }),
    }
  )
);