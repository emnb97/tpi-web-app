"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// --- DYNAMIC ADMIN CLIENT ---
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
      persistSession: false
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
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(path);

    if (error) throw error;

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

// --- ENQUIRY ACTIONS ---
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

export async function deleteEnquiry(id: number) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  return { success: !error };
}

// --- SUBMIT ENQUIRY (called from Contact form) ---
export async function submitEnquiry(data: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
}) {
  const supabase = getSupabaseAdmin();
  try {
    const { error } = await supabase.from("enquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      type: data.company ? `Contact — ${data.company}` : "Contact Form",
      message: data.message,
      status: "New",
      date: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("submitEnquiry error:", err);
    return { success: false, error: "Server error" };
  }
}

// --- MEDIA ACTIONS ---
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

// --- TESTIMONIAL ACTIONS ---
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

export async function submitTestimonial(data: { author: string; content: string }) {
  const supabase = getSupabaseAdmin();
  try {
    const { error } = await supabase.from("testimonials").insert({
      author: data.author,
      content: data.content,
      status: "Pending",
      stars: 5,
      date: new Date().toISOString(),
    });
    if (error) {
      console.error("Testimonial insert error:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error("submitTestimonial error:", err);
    return { success: false, error: "Server error" };
  }
}

// --- STAFF AUTH ACTIONS ---
export async function authenticateStaff(username: string, password: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("staff_auth")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .eq("status", "Active")
    .single();

  if (error || !data) return { success: false };
  
  // Update last login
  await supabase
    .from("staff_auth")
    .update({ last_login: new Date().toISOString() })
    .eq("id", data.id);

  return { success: true, role: data.role };
}

export async function saveStaffCredentials(
  payload: {
    name: string;
    email: string;
    username: string;
    password: string;
    role: string;
    department: string;
  },
  id?: number
) {
  const supabase = getSupabaseAdmin();
  try {
    if (!id) {
      // New staff member
      const { error } = await supabase.from("staff_auth").insert([{
        name: payload.name,
        email: payload.email,
        username: payload.username,
        password: payload.password,
        role: payload.role,
        department: payload.department,
        status: "Active",
        last_login: null,
      }]);
      if (error) return { success: false, error: error.message };
    } else {
      // Update existing — only update password if provided
      const updateData: Record<string, string> = {
        name: payload.name,
        email: payload.email,
        username: payload.username,
        role: payload.role,
        department: payload.department,
      };
      if (payload.password) updateData.password = payload.password;

      const { error } = await supabase.from("staff_auth").update(updateData).eq("id", id);
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: "Server error saving credentials" };
  }
}