export const WHATSAPP_NUMBER = "5511918540870";

export function buildWhatsAppUrl(message: string, number?: string) {
  const phone = number || WHATSAPP_NUMBER;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function formatPhoneDisplay(number: string) {
  if (number.length === 13 && number.startsWith("55")) {
    const ddd = number.slice(2, 4);
    const part1 = number.slice(4, 9);
    const part2 = number.slice(9);
    return `(${ddd}) ${part1}-${part2}`;
  }
  return number;
}
