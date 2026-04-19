import { describe, expect, it } from "vitest";
import {
  applyYardFilters,
  defaultYardFilters,
  findYardContainerById,
  getYardContainers,
} from "./yard-data";

describe("yard-data", () => {
  it("filters containers by multiple criteria", () => {
    const containers = getYardContainers();
    const filtered = applyYardFilters(containers, {
      ...defaultYardFilters,
      block: "A1",
      status: "INBOUND",
      type: "Dry",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.id).toBe("MSCU-442109");
  });

  it("finds a selected container by id", () => {
    const selected = findYardContainerById(getYardContainers(), "TRHU-550781");

    expect(selected?.location).toBe("A2-02");
    expect(selected?.isEmpty).toBe(true);
  });
});
