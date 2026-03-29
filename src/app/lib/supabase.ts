import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching your Supabase tables
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  desc: string;
  image: string;
  sale_sticker?: boolean;
  old_price?: number;
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: "New" | "Contacted" | "Closed";
  date: string;
  message: string;
}

export interface Testimonial {
  id: number;
  author: string;
  content: string;
  status: "Pending" | "Approved";
  date: string;
  stars: number;
}
