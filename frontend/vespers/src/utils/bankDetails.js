export const getCardNetwork = (numStr) => {
  const cleanNum = numStr.replace(/\D/g, "");
  if (!cleanNum.length) return null;

  if (/^4/.test(cleanNum)) return "Visa";
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(cleanNum)) return "Mastercard";
  if (/^3[47]/.test(cleanNum)) return "Amex";
  if (/^6(?:011|5)/.test(cleanNum)) return "Discover";
  if (/^(6[05]|8[12])/.test(cleanNum)) return "RuPay"; // Indian generic
  
  return null;
};

export const BANK_BINS = {
  // === USA ===
  "414720": { name: "Chase", gradient: "from-[#0F5298] via-[#0A3D73] to-blue-950" },
  "401288": { name: "Bank of America", gradient: "from-[#E31837] via-red-800 to-red-950" },
  "473702": { name: "Wells Fargo", gradient: "from-[#D71E28] via-[#B8161D] to-[#FFAB40]" },
  "517856": { name: "Capital One", gradient: "from-[#002B49] via-blue-950 to-red-900" },
  "542418": { name: "Citibank", gradient: "from-[#003B70] via-sky-800 to-[#E81A2D]" },
  "601100": { name: "Discover Bank", gradient: "from-orange-500 via-yellow-600 to-gray-900", textDark: true },

  // === INDIA ===
  "431581": { name: "HDFC Bank", gradient: "from-[#004A8F] via-[#EB1C24] to-[#002A5C]" },
  "431522": { name: "State Bank of India", gradient: "from-[#114D98] via-[#01AEEF] to-[#0D3873]" },
  "413289": { name: "ICICI Bank", gradient: "from-[#E36924] via-[#F29F10] to-[#8C3A10]" },
  "437608": { name: "Axis Bank", gradient: "from-[#AE275F] via-[#CF427E] to-pink-900" },
  "416629": { name: "Kotak Mahindra", gradient: "from-[#ED1C24] via-red-700 to-[#1C1F5C]" },
  "607100": { name: "NPCI RuPay", gradient: "from-orange-400 via-white to-green-500", textDark: true },

  // === UK ===
  "453978": { name: "Barclays", gradient: "from-[#00AEEF] via-teal-500 to-[#00395D]" },
  "440066": { name: "HSBC", gradient: "from-[#DB0011] via-[#A8000B] to-black" },
  "454313": { name: "Lloyds Bank", gradient: "from-[#00603A] via-emerald-800 to-green-950" },
  "475141": { name: "NatWest", gradient: "from-[#411C64] via-purple-800 to-[#ED1C24]" },
  "450917": { name: "Standard Chartered", gradient: "from-[#01B93F] via-green-600 to-[#027E2E]" },
  "535522": { name: "Monzo", gradient: "from-[#FBA57A] via-[#EF5451] to-[#E93A60]" },

  // === CANADA ===
  "450003": { name: "RBC Royal Bank", gradient: "from-[#0051A5] via-[#FFD200] to-[#001D47]" },
  "453676": { name: "TD Bank", gradient: "from-[#00B32C] via-[#008A20] to-green-950" },
  "453600": { name: "Scotiabank", gradient: "from-[#ED0026] via-red-700 to-black" },
  "519123": { name: "BMO", gradient: "from-[#0079C1] via-[#005286] to-[#00395D]" },
  "450644": { name: "CIBC", gradient: "from-[#B3003F] via-rose-800 to-yellow-600" },

  // === AUSTRALIA ===
  "535316": { name: "CommBank", gradient: "from-[#FFCC00] via-yellow-400 to-[#111111]", textDark: true },
  "456426": { name: "Westpac", gradient: "from-[#DA1710] via-red-700 to-black" },
  "456480": { name: "ANZ Bank", gradient: "from-[#004165] via-[#007DBA] to-cyan-900" },
  "450614": { name: "NAB", gradient: "from-[#CC0000] via-red-800 to-black" },
  "516315": { name: "Macquarie", gradient: "from-black via-gray-900 to-gray-800" },

  // === GERMANY ===
  "516648": { name: "N26", gradient: "from-[#33D2AE] via-teal-400 to-[#2A9E88]", textDark: true },
  "430335": { name: "Deutsche Bank", gradient: "from-[#0018A8] via-blue-800 to-black" },

  // === FRANCE ===
  "497331": { name: "BNP Paribas", gradient: "from-[#0F9E5E] via-emerald-600 to-emerald-900" },
  "454508": { name: "Societe Generale", gradient: "from-[#E60028] via-black to-gray-900" },

  // === BRAZIL ===
  "550209": { name: "Nubank", gradient: "from-[#8A05BE] via-purple-700 to-purple-950" },
  "404364": { name: "Itau", gradient: "from-[#EC7000] via-orange-600 to-[#101F6E]" },

  // === SINGAPORE ===
  "455624": { name: "DBS Bank", gradient: "from-[#ED1B24] via-black to-black" },
  "451121": { name: "UOB", gradient: "from-[#004077] via-[#D31F3A] to-blue-950" },

  // === SWITZERLAND ===
  "450302": { name: "UBS", gradient: "from-[#E60000] via-black to-gray-900" },

  // === JAPAN ===
  "421316": { name: "SMBC", gradient: "from-[#00D042] via-emerald-700 to-green-950" },

  // === SOUTH AFRICA ===
  "522100": { name: "Standard Bank", gradient: "from-[#0033A0] via-blue-800 to-black" },

  // === MEXICO ===
  "415231": { name: "BBVA", gradient: "from-[#004481] via-[#1464A5] to-blue-950" },

  // === UAE ===
  "417228": { name: "Emirates NBD", gradient: "from-[#002D62] via-yellow-500 to-blue-950" },

  // === NEW ZEALAND ===
  "450541": { name: "Kiwibank", gradient: "from-[#37A845] via-emerald-600 to-green-950" },

  // === NETHERLANDS ===
  "490010": { name: "ING Bank", gradient: "from-[#FF6200] via-orange-500 to-gray-900", textDark: true }
};
