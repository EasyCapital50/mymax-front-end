import { Building2, Briefcase, Globe, Coins, Shield, TrendingUp } from "lucide-react";

export const getCompanyDisplayName = (name) => {
  if (!name) return "";
  
  // Hardcoded mappings for local/known names to their correct spelling/full form
  const mappings = {
    'mymaxkapital': 'MyMaxKapital',
    'Chequedetails': 'Cheque Details',
    'Offficeexp': 'Office Expenses',
    'partnersloansdeposit': 'Partners Loans/Deposit',
    'Agency details': 'Agency Details',
    'disbursedcustomers': 'Disbursed Customers',
    'Pendin emi': 'Pending EMI'
  };
  
  // If we have a direct mapping, use it
  const key = name.trim();
  if (mappings[key]) {
    return mappings[key];
  }
  
  // Look for case-insensitive match in mappings
  const lowercaseKey = key.toLowerCase();
  for (const [k, v] of Object.entries(mappings)) {
    if (k.toLowerCase() === lowercaseKey) {
      return v;
    }
  }
  
  // Otherwise, capitalize each word (Title Case)
  return key
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getCompanyGradient = (name) => {
  const gradients = [
    "from-blue-500 via-indigo-500 to-purple-600 shadow-indigo-500/10",
    "from-emerald-500 via-teal-500 to-cyan-600 shadow-teal-500/10",
    "from-rose-500 via-pink-500 to-orange-500 shadow-rose-500/10",
    "from-amber-500 via-orange-500 to-red-600 shadow-orange-500/10",
    "from-violet-600 via-fuchsia-500 to-pink-500 shadow-fuchsia-500/10",
    "from-sky-400 via-blue-500 to-indigo-600 shadow-blue-500/10",
  ];
  if (!name) return gradients[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export const getCompanyIcon = (name) => {
  const icons = [
    Building2,
    Briefcase,
    Globe,
    Coins,
    Shield,
    TrendingUp
  ];
  if (!name) return icons[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % icons.length;
  return icons[index];
};
