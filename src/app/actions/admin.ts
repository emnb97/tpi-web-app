"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// --- DYNAMIC ADMIN CLIENT ---
// Instantiating this inside a getter function ensures process.env 
// is read at execution time, preventing "undefined" caching bugs.
const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("🚨 CRITICAL: Missing Supabase environment variables!");
    console.error(`URL present: ${!!url}, Key present: ${!!key}`);
  }

  return createClient(url || "", key || "", {
    auth: {
      autoRefreshToken: false,
      persistSession: false // Crucial for server-side admin clients
    }
  });
};

// --- CMS ACTIONS ---
export async function getSiteContent() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order('page');
  
  if (error) {
    console.error("CMS Fetch Error:", error.message);
    return [];
  }
  return data || [];
}

export async function updateSiteContent(id: string, content: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("site_content")
    .update({ content, last_updated: new Date() })
    .eq("id", id);
  
  if (error) {
    console.error("CMS Update Error:", error.message);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/', 'layout'); 
  return { success: true };
}

// --- PRODUCT ACTIONS ---
export async function getProducts() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("products").select("*").order("id");
  return data || [];
}

export async function saveProduct(payload: any, id: number) {
  const supabase = getSupabaseAdmin();
  try {
    const dbPayload = { ...payload };
    if (dbPayload.desc) {
      dbPayload.description = dbPayload.desc;
      delete dbPayload.desc;
    }

    if (id === 0) {
      const { data, error } = await supabase.from("products").insert([dbPayload]).select();
      if (error) return { error: error.message };
      revalidatePath('/', 'layout'); 
      return { data: data[0] };
    } else {
      const { error } = await supabase.from("products").update(dbPayload).eq("id", id);
      if (error) return { error: error.message };
      revalidatePath('/', 'layout');
      return { success: true };
    }
  } catch (err: any) {
    return { error: "Server error saving product" };
  }
}

export async function updateProductStock(id: number, stock: number) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("products").update({ stock }).eq("id", id);
  return { success: !error };
}

export async function deleteProduct(id: number) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  return { success: !error };
}

// --- COURSE ACTIONS ---
export async function getCourses() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("courses").select("*").order("sort_order");
  return data || [];
}

export async function saveCourse(payload: any, id: number) {
  const supabase = getSupabaseAdmin();
  try {
    if (id === 0) {
      const { data, error } = await supabase.from("courses").insert([payload]).select();
      if (error) return { error: error.message };
      revalidatePath('/', 'layout');
      return { data: data[0] };
    } else {
      const { error } = await supabase.from("courses").update(payload).eq("id", id);
      if (error) return { error: error.message };
      revalidatePath('/', 'layout');
      return { success: true };
    }
  } catch (err: any) {
    return { error: "Server error saving course" };
  }
}

export async function deleteCourse(id: number) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("courses").delete().eq("id", id);
  revalidatePath('/', 'layout');
  return { success: !error };
}

// --- SERVICE ACTIONS ---
export async function getServices() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("services").select("*").order("sort_order");
  return data || [];
}

export async function saveService(payload: any, id: number) {
  const supabase = getSupabaseAdmin();
  try {
    if (id === 0) {
      const { data, error } = await supabase.from("services").insert([payload]).select();
      if (error) return { error: error.message };
      revalidatePath('/', 'layout');
      return { data: data[0] };
    } else {
      const { error } = await supabase.from("services").update(payload).eq("id", id);
      if (error) return { error: error.message };
      revalidatePath('/', 'layout');
      return { success: true };
    }
  } catch (err: any) {
    return { error: "Server error saving service" };
  }
}

export async function deleteService(id: number) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("services").delete().eq("id", id);
  revalidatePath('/', 'layout');
  return { success: !error };
}

// --- DIRECT UPLOAD GENERATOR (NEW METHOD) ---
export async function createSignedUploadUrl(path: string) {
  const supabase = getSupabaseAdmin();
  try {
    const BUCKET_NAME = 'tpi-media';
    
    // 1. Ask Supabase for a signed upload URL using the service key
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(path);

    if (error) throw error;

    // 2. Pre-generate what the public URL will be once the upload finishes
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return { 
      data: { 
        signedUrl: data.signedUrl, 
        token: data.token, 
        publicUrl: urlData.publicUrl 
      } 
    };
  } catch (err: any) {
    console.error("Signed URL Error:", err);
    return { error: err.message };
  }
}

// --- FILE UPLOAD (LEGACY SERVER-SIDE METHOD) ---
export async function uploadFile(formData: FormData) {
  const supabase = getSupabaseAdmin();
  try {
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage
      .from("tpi-media")
      .upload(path, buffer, { contentType: file.type, upsert: true });

    if (error) return { error: error.message };
    const { data } = supabase.storage.from("tpi-media").getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (err: any) {
    return { error: "Upload failed on server" };
  }
}

// --- ADDITIONAL DATA FETCHERS ---
export async function getEnquiries() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("enquiries").select("*").order("date", { ascending: false });
  return data || [];
}

export async function updateLeadStatus(id: number, status: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
  return { success: !error };
}

export async function getMedia() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("media_files").select("*").order("date", { ascending: false });
  return data || [];
}

export async function saveMediaRecord(record: any) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("media_files").insert([record]).select();
  return { 
    data: data ? data[0] : null, 
    error: error ? error.message : null 
  };
}

export async function deleteMediaRecord(id: number) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("media_files").delete().eq("id", id);
  return { success: !error };
}

export async function deleteFile(path: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from("tpi-media").remove([path]);
  return { success: !error };
}

export async function getTestimonials() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("testimonials").select("*").order("date", { ascending: false });
  return data || [];
}

export async function updateTestimonialStatus(id: number, status: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("testimonials").update({ status }).eq("id", id);
  return { success: !error };
}

export async function deleteTestimonial(id: number) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  return { success: !error };
}