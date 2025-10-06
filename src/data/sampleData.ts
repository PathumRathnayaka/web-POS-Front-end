export interface Product {
  id: number;
  name: string;
  barcode: string | null;
  discount: number;
  tax: number;
  sale_price: number;
  category: string | null;
  expire_date: string | null;
  supplier_id: number | null;
  supplier_name: string | null;
  created_date: string;
}

export interface Quantity {
  id: number;
  product_id: number;
  quantity_size: number;
  created_date: string;
  updated_date: string;
}

export interface ProductWithQuantity extends Product {
  quantities?: Quantity;
}

export const sampleProducts: ProductWithQuantity[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    barcode: "123456789012",
    discount: 15,
    tax: 8,
    sale_price: 79.99,
    category: "Electronics",
    expire_date: null,
    supplier_id: 1,
    supplier_name: "TechSupply Co.",
    created_date: "2024-01-15T10:30:00Z",
    quantities: {
      id: 1,
      product_id: 1,
      quantity_size: 150,
      created_date: "2024-01-15T10:30:00Z",
      updated_date: "2024-03-20T14:22:00Z"
    }
  },
  {
    id: 2,
    name: "Organic Green Tea - 100 Bags",
    barcode: "234567890123",
    discount: 10,
    tax: 5,
    sale_price: 12.99,
    category: "Food & Beverage",
    expire_date: "2025-12-31T00:00:00Z",
    supplier_id: 2,
    supplier_name: "Natural Foods Ltd.",
    created_date: "2024-02-10T08:15:00Z",
    quantities: {
      id: 2,
      product_id: 2,
      quantity_size: 320,
      created_date: "2024-02-10T08:15:00Z",
      updated_date: "2024-03-18T09:45:00Z"
    }
  },
  {
    id: 3,
    name: "Yoga Mat - Premium Non-Slip",
    barcode: "345678901234",
    discount: 20,
    tax: 8,
    sale_price: 45.00,
    category: "Sports",
    expire_date: null,
    supplier_id: 3,
    supplier_name: "FitGear Pro",
    created_date: "2024-01-20T12:00:00Z",
    quantities: {
      id: 3,
      product_id: 3,
      quantity_size: 85,
      created_date: "2024-01-20T12:00:00Z",
      updated_date: "2024-03-15T16:30:00Z"
    }
  },
  {
    id: 4,
    name: "LED Desk Lamp",
    barcode: "456789012345",
    discount: 5,
    tax: 8,
    sale_price: 34.99,
    category: "Electronics",
    expire_date: null,
    supplier_id: 1,
    supplier_name: "TechSupply Co.",
    created_date: "2024-02-05T14:20:00Z",
    quantities: {
      id: 4,
      product_id: 4,
      quantity_size: 200,
      created_date: "2024-02-05T14:20:00Z",
      updated_date: "2024-03-22T11:10:00Z"
    }
  },
  {
    id: 5,
    name: "Stainless Steel Water Bottle",
    barcode: "567890123456",
    discount: 12,
    tax: 8,
    sale_price: 24.99,
    category: "Home & Kitchen",
    expire_date: null,
    supplier_id: 4,
    supplier_name: "HomePlus Supplies",
    created_date: "2024-01-30T09:45:00Z",
    quantities: {
      id: 5,
      product_id: 5,
      quantity_size: 450,
      created_date: "2024-01-30T09:45:00Z",
      updated_date: "2024-03-19T13:25:00Z"
    }
  },
  {
    id: 6,
    name: "Cotton T-Shirt - White",
    barcode: "678901234567",
    discount: 25,
    tax: 8,
    sale_price: 19.99,
    category: "Clothing",
    expire_date: null,
    supplier_id: 5,
    supplier_name: "Fashion Wholesale",
    created_date: "2024-02-15T11:30:00Z",
    quantities: {
      id: 6,
      product_id: 6,
      quantity_size: 500,
      created_date: "2024-02-15T11:30:00Z",
      updated_date: "2024-03-21T10:15:00Z"
    }
  },
  {
    id: 7,
    name: "Protein Powder - Chocolate 2kg",
    barcode: "789012345678",
    discount: 18,
    tax: 5,
    sale_price: 49.99,
    category: "Food & Beverage",
    expire_date: "2025-09-30T00:00:00Z",
    supplier_id: 6,
    supplier_name: "NutriSupply Inc.",
    created_date: "2024-01-25T15:00:00Z",
    quantities: {
      id: 7,
      product_id: 7,
      quantity_size: 120,
      created_date: "2024-01-25T15:00:00Z",
      updated_date: "2024-03-17T14:40:00Z"
    }
  },
  {
    id: 8,
    name: "Gaming Mouse - RGB",
    barcode: "890123456789",
    discount: 30,
    tax: 8,
    sale_price: 59.99,
    category: "Electronics",
    expire_date: null,
    supplier_id: 1,
    supplier_name: "TechSupply Co.",
    created_date: "2024-02-20T10:10:00Z",
    quantities: {
      id: 8,
      product_id: 8,
      quantity_size: 180,
      created_date: "2024-02-20T10:10:00Z",
      updated_date: "2024-03-23T09:50:00Z"
    }
  },
  {
    id: 9,
    name: "Ceramic Coffee Mug Set - 4 Pieces",
    barcode: "901234567890",
    discount: 8,
    tax: 8,
    sale_price: 29.99,
    category: "Home & Kitchen",
    expire_date: null,
    supplier_id: 4,
    supplier_name: "HomePlus Supplies",
    created_date: "2024-01-18T13:40:00Z",
    quantities: {
      id: 9,
      product_id: 9,
      quantity_size: 250,
      created_date: "2024-01-18T13:40:00Z",
      updated_date: "2024-03-16T12:20:00Z"
    }
  },
  {
    id: 10,
    name: "Running Shoes - Men's Size 10",
    barcode: "012345678901",
    discount: 22,
    tax: 8,
    sale_price: 89.99,
    category: "Sports",
    expire_date: null,
    supplier_id: 3,
    supplier_name: "FitGear Pro",
    created_date: "2024-02-08T16:25:00Z",
    quantities: {
      id: 10,
      product_id: 10,
      quantity_size: 95,
      created_date: "2024-02-08T16:25:00Z",
      updated_date: "2024-03-20T15:35:00Z"
    }
  }
];
