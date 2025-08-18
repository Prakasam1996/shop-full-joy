import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Database helpers
export const createUserProfile = async (userId: string, userData: any) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ id: userId, ...userData }])
    .select()
    .single();
  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Address helpers
export const getUserAddresses = async (userId: string) => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });
  return { data, error };
};

export const createAddress = async (addressData: any) => {
  const { data, error } = await supabase
    .from('addresses')
    .insert([addressData])
    .select()
    .single();
  return { data, error };
};

export const updateAddress = async (addressId: string, updates: any) => {
  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', addressId)
    .select()
    .single();
  return { data, error };
};

// Order helpers
export const createOrder = async (orderData: any) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();
  return { data, error };
};

export const getUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getOrderById = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', orderId)
    .single();
  return { data, error };
};

// Discount helpers
export const validateDiscountCode = async (code: string, orderAmount: number) => {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return { data: null, error: 'Invalid discount code' };
  }

  // Check if expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { data: null, error: 'Discount code has expired' };
  }

  // Check usage limit
  if (data.usage_limit && data.used_count >= data.usage_limit) {
    return { data: null, error: 'Discount code usage limit reached' };
  }

  // Check minimum order amount
  if (data.min_order_amount && orderAmount < data.min_order_amount) {
    return { data: null, error: `Minimum order amount of $${data.min_order_amount} required` };
  }

  return { data, error: null };
};

// Shipping helpers
export const getShippingMethods = async () => {
  const { data, error } = await supabase
    .from('shipping_methods')
    .select('*')
    .eq('is_active', true)
    .order('price');
  return { data, error };
};