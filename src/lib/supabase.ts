import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string
  email: string
  nickname: string
  phone?: string
  role: 'admin' | 'customer'
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  images?: string[]
  stock_quantity: number
  is_active: boolean
  category?: string
  ingredients?: string
  weight?: string
  scent?: string
  created_at: string
  updated_at: string
}

export interface Content {
  id: string
  title: string
  description?: string
  content_type: string
  image_url?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_name: string
  shipping_email: string
  shipping_phone: string
  shipping_address: string
  shipping_city: string
  shipping_province: string
  shipping_postal_code: string
  shipping_country: string
  payment_method?: string
  payment_status: string
  payment_proof_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  product?: Product
}

export interface InstagramPost {
  id: string
  image_url: string
  caption?: string
  instagram_url?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}
