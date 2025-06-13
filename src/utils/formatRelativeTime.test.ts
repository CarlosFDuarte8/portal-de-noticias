import { formatRelativeTime } from "./formatRelativeTime";

describe("formatRelativeTime", () => {
  it('deve retornar "Agora" para uma data com menos de 1 minuto atrás', () => {
    const now = new Date();
    const dateString = now.toISOString();
    const result = formatRelativeTime(dateString);
    expect(result).toBe("Agora");
  });

  it('deve retornar "5min atrás" para uma data de 5 minutos atrás', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const dateString = fiveMinutesAgo.toISOString();
    const result = formatRelativeTime(dateString);
    expect(result).toBe("5min atrás");
  });

  it('deve retornar "2h atrás" para uma data de 2 horas atrás', () => {
    const now = new Date();
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const dateString = twoHoursAgo.toISOString();
    const result = formatRelativeTime(dateString);
    expect(result).toBe("2h atrás");
  });

  it('deve retornar "Ontem" para uma data de exatamente 24 horas atrás', () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const dateString = yesterday.toISOString();
    const result = formatRelativeTime(dateString);
    expect(result).toBe("Ontem");
  });

  it('deve retornar "3 dias atrás" para uma data de 3 dias atrás', () => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const dateString = threeDaysAgo.toISOString();
    const result = formatRelativeTime(dateString);
    expect(result).toBe("3 dias atrás");
  });

  it('deve retornar "7 dias atrás" para uma data de exatamente 7 dias atrás', () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dateString = sevenDaysAgo.toISOString();
    const result = formatRelativeTime(dateString);
    expect(result).toBe("7 dias atrás");
  });

  it("deve retornar uma string de data formatada para uma data com mais de 7 dias atrás", () => {
    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
    const dateString = tenDaysAgo.toISOString();
    const result = formatRelativeTime(dateString);

    const expectedFormat = tenDaysAgo.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    expect(result).toBe(expectedFormat);
  });

  it("deve lidar com datas no futuro retornando uma string de data formatada", () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 dias no futuro
    const dateString = futureDate.toISOString();
    const result = formatRelativeTime(dateString);

    const expectedFormat = futureDate.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    expect(result).toBe(expectedFormat);
  });

  it('deve retornar "Agora" para o timestamp exato atual', () => {
    const now = new Date();
    const currentTimestamp = now.toISOString();
    const result = formatRelativeTime(currentTimestamp);
    expect(result).toBe("Agora");
  });

  it('deve lidar com strings de data inválidas retornando "Data inválida"', () => {
    const invalidDateString = "not a valid date";
    const result = formatRelativeTime(invalidDateString);
    expect(result).toBe("Data inválida");
  });
});
