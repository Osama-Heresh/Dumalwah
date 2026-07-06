export type Category = "all" | "sidr" | "sumar" | "marai" | "blends" | "bee-products";

export interface ProductSize {
  weight: string;
  price: number; // in SAR/AED
  originalPrice?: number;
}

export interface Product {
  id: string;
  category: string;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  rating: number;
  reviewsCount: number;
  sizes: ProductSize[];
  benefitsAr: string[];
  benefitsEn: string[];
  bestSeller?: boolean;
  honeyType?: string;
  sortOrder?: number;
}

export interface CartItem {
  product: Product;
  selectedSize: ProductSize;
  quantity: number;
}

export interface LoyaltyProfile {
  username: string;
  phone: string;
  points: number;
  history: Array<{
    id: string;
    date: string;
    actionAr: string;
    actionEn: string;
    points: number; // Positive for earned, negative for redeemed
  }>;
  email?: string;
  password?: string;
  registrationDate?: string;
}

export interface FeedbackTicket {
  id: string;
  type: "complaint" | "suggestion";
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  text: string;
  date: string;
  status: "pending" | "resolved" | "replied";
  replyText?: string;
  replyDate?: string;
}


export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export type Language = "ar" | "en";

export type ShippingMethod = "aramex" | "dhl" | "local";

export type PaymentMethod = "mada" | "visa" | "applepay" | "cod" | "transfer";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  pointsEarned: number;
  pointsRedeemed: number;
  shippingDetails: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    address: string;
    postalCode: string;
  };
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered";
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  productId?: string;
  productNameAr?: string;
  productNameEn?: string;
  date: string;
  isVerified: boolean;
  likes: number;
}

