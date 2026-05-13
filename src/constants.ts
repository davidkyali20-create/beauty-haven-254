export interface Service {
  name: string;
  price: string;
  category: "Manicure" | "Pedicure" | "Hair" | "Glam" | "Other";
}

export const SERVICES_DATA: Service[] = [
  // Manicure
  { name: "Manicure", price: "500", category: "Manicure" },
  { name: "Gel", price: "500", category: "Manicure" },
  { name: "Manicure/gel", price: "800", category: "Manicure" },
  { name: "Tips gel", price: "1500", category: "Manicure" },
  { name: "Builder gel", price: "1500", category: "Manicure" },
  { name: "Gum gel", price: "1000", category: "Manicure" },
  { name: "Acrylic", price: "2500", category: "Manicure" },

  // Pedicure
  { name: "Pedicure plain", price: "800", category: "Pedicure" },
  { name: "Pedicure gel", price: "1300", category: "Pedicure" },
  { name: "Jelly pedicure", price: "1500", category: "Pedicure" },

  // Hair
  { name: "Knotless", price: "2000", category: "Hair" },
  { name: "Plain lines", price: "500", category: "Hair" },
  { name: "Wash and blow", price: "500", category: "Hair" },
  { name: "Cornrows", price: "2000", category: "Hair" },
  { name: "Wig installation", price: "1500", category: "Hair" },
  { name: "Flat iron", price: "500", category: "Hair" },
  { name: "Treatment leave-in", price: "1500", category: "Hair" },
  { name: "Deep treatment", price: "1000", category: "Hair" },
  { name: "Dreadlocks", price: "3000", category: "Hair" },
  { name: "Retouch", price: "1500", category: "Hair" },
  { name: "Retouch chem", price: "1500", category: "Hair" },
  { name: "Scrubbing", price: "500", category: "Hair" },
  { name: "Coco twist", price: "2000", category: "Hair" },

  // Glam
  { name: "Makeup", price: "1000", category: "Glam" },

  // Other
  { name: "Soak off", price: "200", category: "Other" },
  { name: "Cut file", price: "300", category: "Other" },
];
