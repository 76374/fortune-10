type FormatFunc = (value: number, zeroDecimals?: boolean) => string;

type Formatter = FormatFunc & {
  setCurrency(currency: string): void;
};

export default (() => {
  const formatters: Record<string, FormatFunc> = {
    euro: (value: number, zeroDecimals?: boolean) =>
      `${zeroDecimals ? (value / 100).toFixed(2) : value / 100}€`,
  };

  let formatter: FormatFunc | null = null;

  const format: Formatter = (value: number, zeroDecimals = true) =>
    formatter ? formatter(value, zeroDecimals) : String(value);

  format.setCurrency = (currency: string) => {
    formatter = formatters[currency] || null;
  }

  return format;
})();
