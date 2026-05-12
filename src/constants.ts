export interface Service {
  name: string;
  price: string;
  category: "Manicure" | "Pedicure" | "Hair" | "Glam" | "Other";
}

export const SERVICES_DATA: Service[] = [
  // Manicure
  { name: "Manicure", price: "500", category: "Manicure" },
  { name: "Gel", price: "500", category: "Manicure" },
  { name: "Manicure/Gel", price: "800", category: "Manicure" },
  { name: "Tips gel", price: "1000", category: "Manicure" },
  { name: "Builder gel", price: "1000", category: "Manicure" },
  { name: "Gum gel", price: "1500", category: "Manicure" },
  { name: "Acrylic", price: "2500", category: "Manicure" },

  // Pedicure
  { name: "Pedicure plain", price: "800", category: "Pedicure" },
  { name: "Gel", price: "500", category: "Pedicure" },
  { name: "Pedicure Gel", price: "1300", category: "Pedicure" },
  { name: "Jelly pedicure", price: "1500", category: "Pedicure" },

  // Hair
  { name: "Knotless", price: "1500", category: "Hair" },
  { name: "Plain lines", price: "500", category: "Hair" },
  { name: "Wash and blow", price: "500", category: "Hair" },
  { name: "Wash and straightening", price: "300", category: "Hair" },
  { name: "Concrows", price: "1000", category: "Hair" },
  { name: "Wig installation", price: "1500", category: "Hair" },
  { name: "Flat iron", price: "500", category: "Hair" },
  { name: "Treatments", price: "500", category: "Hair" },
  { name: "Deep treatment", price: "800", category: "Hair" },
  { name: "Dreadlocks", price: "3000", category: "Hair" },
  { name: "Re-touch", price: "1000", category: "Hair" },
  { name: "Re-touch(chem)", price: "1200", category: "Hair" },
  { name: "Scrubbing", price: "500", category: "Hair" },

  // Glam
  { name: "Make up", price: "1500", category: "Glam" },
  { name: "Lashes", price: "From 500", category: "Glam" },

  // Other (Important Note)
  { name: "Soak off", price: "200", category: "Other" },
  { name: "Cut file", price: "300", category: "Other" },
];
