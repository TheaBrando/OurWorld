import { supabase, isSupabaseConfigured } from "./supabase";

const localKey = "dios-archive-demo";
function readLocal() {
  try { return JSON.parse(localStorage.getItem(localKey) || '{"guestbook":[],"doodles":[]}'); }
  catch { return { guestbook: [], doodles: [] }; }
}
function writeLocal(data) { localStorage.setItem(localKey, JSON.stringify(data)); }

async function uploadImage(file, bucket) {
  if (!file) return null;
  if (!file.type.startsWith("image/")) throw new Error("请选择图片文件。");
  if (file.size > 5 * 1024 * 1024) throw new Error("图片不能超过 5MB。");
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `public/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function listGuestbook() {
  if (!isSupabaseConfigured) return readLocal().guestbook;
  const { data, error } = await supabase.from("guestbook").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  return data || [];
}

export async function addGuestbook({ nickname, message, file }) {
  if (!isSupabaseConfigured) {
    const db = readLocal();
    const item = { id: crypto.randomUUID(), nickname: nickname || "匿名访客", message, image_url: file ? URL.createObjectURL(file) : null, created_at: new Date().toISOString() };
    db.guestbook.unshift(item); writeLocal(db); return item;
  }
  const image_url = file ? await uploadImage(file, "guestbook-images") : null;
  const { data, error } = await supabase.from("guestbook").insert({ nickname: nickname || "匿名访客", message, image_url }).select().single();
  if (error) throw error;
  return data;
}

export async function listDoodles() {
  if (!isSupabaseConfigured) return readLocal().doodles;
  const { data, error } = await supabase.from("doodles").select("*").order("created_at", { ascending: false }).limit(60);
  if (error) throw error;
  return data || [];
}

export async function addDoodle({ nickname, blob }) {
  if (!isSupabaseConfigured) {
    const db = readLocal();
    const image_url = URL.createObjectURL(blob);
    const item = { id: crypto.randomUUID(), nickname: nickname || "匿名画手", image_url, created_at: new Date().toISOString() };
    db.doodles.unshift(item); writeLocal(db); return item;
  }
  const file = new File([blob], "doodle.png", { type: "image/png" });
  const image_url = await uploadImage(file, "doodles");
  const { data, error } = await supabase.from("doodles").insert({ nickname: nickname || "匿名画手", image_url }).select().single();
  if (error) throw error;
  return data;
}

export async function adminLogin(email, password) {
  if (!isSupabaseConfigured) throw new Error("请先配置 Supabase 环境变量。");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
export async function adminLogout() {
  if (supabase) await supabase.auth.signOut();
}
export async function adminDelete(table, id) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}
export async function adminSetApproved(table, id, approved) {
  const { error } = await supabase.from(table).update({ approved }).eq("id", id);
  if (error) throw error;
}
