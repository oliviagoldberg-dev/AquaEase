export type TermKey = "semester" | "full-year";
export type JugCount = 2 | 3 | 4;

const {
  STRIPE_PRICE_SEMESTER_BASE,
  STRIPE_PRICE_SEMESTER_STANDARD,
  STRIPE_PRICE_SEMESTER_PREMIUM,
  STRIPE_PRICE_YEAR_BASE,
  STRIPE_PRICE_YEAR_STANDARD,
  STRIPE_PRICE_YEAR_PREMIUM,
} = process.env;

const fallbackPrices = {
  semester: {
    2: "price_1T4vFcJavtxDPv9qACaBc8tv",
    3: "price_1T4vFdJavtxDPv9qlDxe7AIR",
    4: "price_1T4vFdJavtxDPv9qtSfzptte",
  },
  "full-year": {
    2: "price_1T4vFiJavtxDPv9qMGYGuCHu",
    3: "price_1T4vFcJavtxDPv9q1IFPEu67",
    4: "price_1T4vFcJavtxDPv9qT6tQTFrG",
  },
} as const;

export const serverPriceMap: Record<TermKey, Record<JugCount, string>> = {
  semester: {
    2: STRIPE_PRICE_SEMESTER_BASE || fallbackPrices.semester[2],
    3: STRIPE_PRICE_SEMESTER_STANDARD || fallbackPrices.semester[3],
    4: STRIPE_PRICE_SEMESTER_PREMIUM || fallbackPrices.semester[4],
  },
  "full-year": {
    2: STRIPE_PRICE_YEAR_BASE || fallbackPrices["full-year"][2],
    3: STRIPE_PRICE_YEAR_STANDARD || fallbackPrices["full-year"][3],
    4: STRIPE_PRICE_YEAR_PREMIUM || fallbackPrices["full-year"][4],
  },
};

export const serverAllowedPriceIds = new Set(
  Object.values(serverPriceMap).flatMap((byJugs) => Object.values(byJugs))
);
