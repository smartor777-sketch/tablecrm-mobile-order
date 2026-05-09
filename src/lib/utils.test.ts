import { describe, it, expect } from "vitest";
import {
  validateToken,
  validatePhone,
  formatPhone,
  formatPrice,
  generateId,
  debounce,
} from "../lib/utils";

describe("validateToken", () => {
  it("должен возвращать true для валидного токена", () => {
    expect(validateToken("valid_token_12345")).toBe(true);
  });

  it("должен возвращать false для пустого токена", () => {
    expect(validateToken("")).toBe(false);
  });

  it("должен возвращать false для короткого токена", () => {
    expect(validateToken("ab")).toBe(false);
  });

  it("должен возвращать false для токена с пробелами менее 10 символов", () => {
    expect(validateToken("  ")).toBe(false);
  });
});

describe("validatePhone", () => {
  it("должен возвращать true для корректного телефона", () => {
    expect(validatePhone("+79001234567")).toBe(true);
  });

  it("должен возвращать true для телефона без плюса", () => {
    expect(validatePhone("89001234567")).toBe(true);
  });

  it("должен возвращать false для невалидного телефона", () => {
    expect(validatePhone("abc")).toBe(false);
  });

  it("должен возвращать true для пустого телефона (опционально)", () => {
    expect(validatePhone("")).toBe(true);
  });
});

describe("formatPhone", () => {
  it("должен форматировать телефон правильно", () => {
    expect(formatPhone("79001234567")).toBe("+7 (900) 123-45-67");
  });

  it("должен возвращать исходную строку для невалидного формата", () => {
    expect(formatPhone("abc")).toBe("abc");
  });
});

describe("formatPrice", () => {
  it("должен форматировать цену правильно", () => {
    const result = formatPrice(1000);
    expect(result).toContain("1");
    expect(result).toContain("₽");
  });

  it("должен форматировать большую цену правильно", () => {
    const result = formatPrice(1000000);
    expect(result).toContain("1");
    expect(result).toContain("₽");
  });
});

describe("generateId", () => {
  it("должен генерировать уникальные ID", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it("должен возвращать строку", () => {
    expect(typeof generateId()).toBe("string");
  });
});

describe("debounce", () => {
  it("должен вызывать функцию после задержки", async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("должен сбрасывать таймер при повторном вызове", async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);

    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});