"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Mail, Users, FolderOpen,
  CreditCard, Search, Star, Settings, LogOut,
  Plus, Edit2, Trash2, Save, Upload, X, Eye, EyeOff,
  RefreshCw, Download, CheckCircle, ChevronRight, AlertCircle,
  Film, Copy, ExternalLink, Clock, UserPlus, Type, Palette,
  Image as ImgIcon, CheckSquare, Phone, FileText, Home, Info, ShoppingBag, GraduationCap, Wrench,
  BarChart3, TrendingUp, MousePointer2, Gauge, Globe, Zap, Play, Maximize2, Menu
} from "lucide-react";
import Image from "next/image";
import * as adminActions from "../actions/admin";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number; name: string; price: number; category: string;
  stock: number; desc: string; image: string;
  sale_sticker?: boolean; old_price?: number;
}
interface Enquiry {
  id: number; name: string; email: string; phone: string;
  type: string; status: "New" | "Contacted" | "Closed";
  date: string; message: string;
}
interface MediaFile {
  id: number; name: string; type: "Image" | "Video";
  size: string; url: string; date: string; bucket_path: string;
}
interface StaffMember {
  id: number; name: string; role: "Super Admin" | "Fleet Manager" | "Content Editor";
  status: "Active" | "Inactive"; department: string; email: string; lastLogin: string;
  username?: string; password?: string;
}
interface Payment {
  id: string; customer: string; amount: number;
  status: "Completed" | "Pending" | "Refunded";
  date: string; gateway: string; method: string;
}
interface Testimonial {
  id: number; author: string; content: string;
  status: "Pending" | "Approved"; date: string; stars: number;
}
interface CMSContent {
  id: string;
  page: string;
  section: string;
  label: string;
  content: string;
  content_type: 'text' | 'textarea' | 'image' | 'video';
}
interface ServiceItem {
  id: number; title: string; sub: string; description: string;
  benefits: string[]; image: string; color: string;
  sort_order: number; visible: boolean;
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const card = "bg-[#0D1117] border border-white/[0.06] rounded-xl";
const cardPad = "p-6";
const label = "text-[11px] font-medium text-slate-500 uppercase tracking-wider";
const inputCls = "w-full bg-[#161B22] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-[#0072CE]/60 focus:ring-1 focus:ring-[#0072CE]/20 transition-all";
const btnPrimary = "flex items-center gap-2 px-4 py-2 bg-[#0072CE] hover:bg-[#005bb5] text-white text-xs font-semibold rounded-lg transition-colors";
const btnGhost = "flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/[0.08] text-slate-300 text-xs font-semibold rounded-lg transition-colors";
const btnDanger = "flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition-colors";

// ─── Shared components ────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Contacted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Closed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    Completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Refunded: "bg-red-500/10 text-red-400 border-red-500/20",
    Approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Inactive: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${styles[status] ?? "bg-white/5 text-slate-400 border-white/10"}`}>
      {status}
    </span>
  );
};

const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-5 h-5 border-2 border-[#0072CE]/30 border-t-[#0072CE] rounded-full animate-spin" />
  </div>
);

const SectionHeader = ({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) => (
  <div className="flex items-start justify-between mb-8">
    <div>
      <h1 className="text-lg font-semibold text-white tracking-tight">{title}</h1>
      {sub && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{sub}</p>}
    </div>
    {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
  </div>
);

// ─── CMS Page Config ──────────────────────────────────────────────────────────
const CMS_PAGES = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: Info },
  { id: 'courses', label: 'Courses', icon: GraduationCap },
  { id: 'services', label: 'Services', icon: Wrench },
  { id: 'store', label: 'Store', icon: ShoppingBag },
  { id: 'footer', label: 'Footer', icon: FileText },
];

// ─── Media Dimension Guide ───────────────────────────────────────────────────
const MEDIA_DIMENSIONS: Record<string, { width: number; height: number; aspectRatio: string; description: string }> = {
  // Home page
  'home.hero.video': { width: 1920, height: 1080, aspectRatio: '16:9', description: 'Hero background video' },
  'home.action.video': { width: 1920, height: 1080, aspectRatio: '16:9', description: 'Training in action video' },
  'home.event.image': { width: 800, height: 600, aspectRatio: '4:3', description: 'Event section image' },
  // About page
  'about.hero.image': { width: 1200, height: 800, aspectRatio: '3:2', description: 'About hero image' },
  'about.gallery.image1': { width: 600, height: 600, aspectRatio: '1:1', description: 'Gallery square image' },
  'about.gallery.image2': { width: 600, height: 600, aspectRatio: '1:1', description: 'Gallery square image' },
  'about.gallery.image3': { width: 600, height: 400, aspectRatio: '3:2', description: 'Gallery landscape image' },
  // Courses page
  'courses.box1.image': { width: 800, height: 1000, aspectRatio: '4:5', description: 'Course card image' },
  'courses.box2.image': { width: 800, height: 1000, aspectRatio: '4:5', description: 'Course card image' },
  'courses.box3.image': { width: 800, height: 1000, aspectRatio: '4:5', description: 'Course card image' },
  'courses.why.image': { width: 800, height: 800, aspectRatio: '1:1', description: 'Why TPI section image' },
  // Services
  'services.hero.image': { width: 1200, height: 600, aspectRatio: '2:1', description: 'Services hero banner' },
  // Store
  'store.hero.image': { width: 1200, height: 600, aspectRatio: '2:1', description: 'Store hero banner' },
};

// Helper to get dimensions for a CMS item
const getMediaDimensions = (id: string) => {
  return MEDIA_DIMENSIONS[id] || { width: 1200, height: 800, aspectRatio: '3:2', description: 'Standard image' };
};

// ─── Font Config ──────────────────────────────────────────────────────────────
interface FontOption {
  name: string;
  family: string;
  weights: number[];
  category: 'sans-serif' | 'serif' | 'display' | 'monospace';
  googleUrl?: string;
}

const FONT_OPTIONS: FontOption[] = [
  { name: 'Genos', family: 'Genos', weights: [300, 400, 500, 600, 700, 800, 900], category: 'sans-serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Genos:wght@300;400;500;600;700;800;900&display=swap' },
  { name: 'Inter', family: 'Inter', weights: [300, 400, 500, 600, 700, 800, 900], category: 'sans-serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap' },
  { name: 'Poppins', family: 'Poppins', weights: [300, 400, 500, 600, 700, 800, 900], category: 'sans-serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap' },
  { name: 'Montserrat', family: 'Montserrat', weights: [300, 400, 500, 600, 700, 800, 900], category: 'sans-serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap' },
  { name: 'Roboto', family: 'Roboto', weights: [300, 400, 500, 700, 900], category: 'sans-serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap' },
  { name: 'Space Grotesk', family: 'Space Grotesk', weights: [300, 400, 500, 600, 700], category: 'sans-serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap' },
  { name: 'DM Sans', family: 'DM Sans', weights: [400, 500, 600, 700], category: 'sans-serif', googleUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap' },
  { name: 'Outfit', family: 'Outfit', weights: [300, 400, 500, 600, 700, 800, 900], category: 'sans-serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap' },
  { name: 'Plus Jakarta Sans', family: 'Plus Jakarta Sans', weights: [300, 400, 500, 600, 700, 800], category: 'sans-serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap' },
  { name: 'Sora', family: 'Sora', weights: [300, 400, 500, 600, 700, 800], category: 'sans-serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap' },
  { name: 'Urbanist', family: 'Urbanist', weights: [300, 400, 500, 600, 700, 800, 900], category: 'sans-serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;800;900&display=swap' },
  { name: 'Playfair Display', family: 'Playfair Display', weights: [400, 500, 600, 700, 800, 900], category: 'serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap' },
  { name: 'Lora', family: 'Lora', weights: [400, 500, 600, 700], category: 'serif', googleUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap' },
  { name: 'Bebas Neue', family: 'Bebas Neue', weights: [400], category: 'display', googleUrl: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap' },
  { name: 'Oswald', family: 'Oswald', weights: [300, 400, 500, 600, 700], category: 'display', googleUrl: 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap' },
  { name: 'JetBrains Mono', family: 'JetBrains Mono', weights: [400, 500, 600, 700], category: 'monospace', googleUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap' },
];

interface FontSettings {
  primary: string;
  heading: string;
  body: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPortal() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [siteContent, setSiteContent] = useState<CMSContent[]>([]);
  const [cmsActivePage, setCmsActivePage] = useState("home");
  const [cmsSubTab, setCmsSubTab] = useState<"content" | "fonts">("content");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<string | null>(null);
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    primary: 'Genos',
    heading: 'Genos',
    body: 'Genos',
  });
  const [fontLoading, setFontLoading] = useState(false);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set(['Genos']));

  // ── Data ──
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [leads, setLeads] = useState<Enquiry[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [svcItems, setSvcItems] = useState<ServiceItem[]>([]);
  const [svcLoading, setSvcLoading] = useState(false);
  const [svcModal, setSvcModal] = useState(false);
  const [currentSvc, setCurrentSvc] = useState<ServiceItem | null>(null);
  const [svcSaving, setSvcSaving] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 1, name: "E. Osobu", role: "Super Admin", status: "Active", department: "Executive", email: "e.osobu@thephysicalinternet.uk", lastLogin: "Now" },
  ]);
  const [payments] = useState<Payment[]>([
    { id: "ORD-9921", customer: "Liam Neeson", amount: 120, status: "Completed", date: "2026-02-28", gateway: "Stripe", method: "Apple Pay" },
    { id: "ORD-9922", customer: "Sarah Jenkins", amount: 55, status: "Pending", date: "2026-02-27", gateway: "PayPal", method: "Credit Card" },
  ]);

  // ── UI ──
  const [productModal, setProductModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<Product | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productImgUploading, setProductImgUploading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Enquiry | null>(null);
  const [confirmDeleteLead, setConfirmDeleteLead] = useState<number | null>(null);
  const [leadFilter, setLeadFilter] = useState<"All" | "New" | "Contacted" | "Closed">("All");
  const [leadSearch, setLeadSearch] = useState("");
  const [mediaUploading, setMediaUploading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [staffModal, setStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const productImgRef = useRef<HTMLInputElement>(null);
  const mediaUploadRef = useRef<HTMLInputElement>(null);

  // ── CMS Preview State ──────────────────────────────────────────────────────
  const [previewChanges, setPreviewChanges] = useState<Record<string, string>>({});
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // ── Font Management ──────────────────────────────────────────────────────────
  const loadFont = useCallback((fontName: string) => {
    if (loadedFonts.has(fontName)) return;
    const font = FONT_OPTIONS.find(f => f.name === fontName);
    if (font?.googleUrl) {
      const link = document.createElement('link');
      link.href = font.googleUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      setLoadedFonts(prev => new Set([...prev, fontName]));
    }
  }, [loadedFonts]);

  const fetchCMS = useCallback(async () => {
    try {
      const data = await adminActions.getSiteContent();
      console.log('CMS data received:', data);
      console.log('CMS data length:', data?.length);
      if (data && Array.isArray(data)) {
        // Log unique pages found in data
        const uniquePages = [...new Set(data.map((c: CMSContent) => c.page))];
        console.log('Unique pages in CMS data:', uniquePages);
        console.log('Home entries:', data.filter((c: CMSContent) => c.page === 'home').length);
        console.log('Store entries:', data.filter((c: CMSContent) => c.page === 'store').length);
        
        // Debug: log first few items to see exact page values
        console.log('First 5 items:', data.slice(0, 5).map((c: CMSContent) => ({ id: c.id, page: c.page, pageType: typeof c.page })));
        
        // Check for whitespace or case issues
        const homeVariants = data.filter((c: CMSContent) => 
          c.page?.toLowerCase().trim() === 'home'
        );
        console.log('Home variants (case-insensitive):', homeVariants.length);
        
        setSiteContent(data as CMSContent[]);
        // Load font settings from CMS
        const fontData = (data as CMSContent[]).filter(c => c.page === 'settings' && c.section === 'fonts');
        if (fontData.length > 0) {
          const newSettings: FontSettings = { primary: 'Genos', heading: 'Genos', body: 'Genos' };
          fontData.forEach(f => {
            if (f.id === 'settings.fonts.primary') newSettings.primary = f.content || 'Genos';
            if (f.id === 'settings.fonts.heading') newSettings.heading = f.content || 'Genos';
            if (f.id === 'settings.fonts.body') newSettings.body = f.content || 'Genos';
          });
          setFontSettings(newSettings);
          [newSettings.primary, newSettings.heading, newSettings.body].forEach(loadFont);
        }
      } else {
        console.error('CMS data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching CMS:', error);
    }
  }, [loadFont]);

  const saveFontSetting = async (key: keyof FontSettings, value: string) => {
    setFontLoading(true);
    loadFont(value);
    setFontSettings(prev => ({ ...prev, [key]: value }));
    await adminActions.updateSiteContent(`settings.fonts.${key}`, value);
    showToast(`${key.charAt(0).toUpperCase() + key.slice(1)} font updated`);
    setFontLoading(false);
  };

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Fetchers ──────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    const data = await adminActions.getProducts();
    if (data) setProducts(data as Product[]);
    else showToast("Failed to load products", "error");
    setProductsLoading(false);
  }, [showToast]);

  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true);
    const data = await adminActions.getEnquiries();
    if (data) setLeads(data as Enquiry[]);
    else showToast("Failed to load enquiries", "error");
    setLeadsLoading(false);
  }, [showToast]);

  const fetchMedia = useCallback(async () => {
    setMediaLoading(true);
    const data = await adminActions.getMedia();
    if (data) setMediaFiles(data as MediaFile[]);
    setMediaLoading(false);
  }, []);

  const fetchTestimonials = useCallback(async () => {
    setTestimonialsLoading(true);
    const data = await adminActions.getTestimonials();
    if (data) setTestimonials(data as Testimonial[]);
    setTestimonialsLoading(false);
  }, []);

  const fetchServices = useCallback(async () => {
    setSvcLoading(true);
    const data = await adminActions.getServices();
    if (data) setSvcItems(data as ServiceItem[]);
    setSvcLoading(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) { fetchProducts(); fetchLeads(); fetchMedia(); fetchTestimonials(); fetchServices(); fetchCMS(); }
  }, [isLoggedIn, fetchProducts, fetchLeads, fetchMedia, fetchTestimonials, fetchServices, fetchCMS]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true); setLoginError("");
    try {
      // Try .env auth first (Super Admin)
      const res = await fetch("/api/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setIsLoggedIn(true);
        return;
      }
      
      // Fallback: try Supabase staff credentials
      const staffRes = await adminActions.authenticateStaff(username, password);
      if (staffRes.success) {
        setIsLoggedIn(true);
      } else {
        setLoginError("Invalid credentials.");
      }
    } catch { setLoginError("Connection error. Please try again."); }
    finally { setLoginLoading(false); }
  };

  // ── Store Matrix ──────────────────────────────────────────────────────────
  const uploadProductImage = async (file: File): Promise<string | null> => {
    setProductImgUploading(true);
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const res = await adminActions.uploadFile(formData);
    setProductImgUploading(false);

    if (res.error) { showToast("Image upload failed", "error"); return null; }
    return res.url!;
  };

  const handleProductImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentEdit) return;
    const url = await uploadProductImage(file);
    if (url) setCurrentEdit({ ...currentEdit, image: url });
  };

  const saveProduct = async () => {
    if (!currentEdit || !currentEdit.name.trim()) return;
    setProductSaving(true);
    const payload = {
      name: currentEdit.name, price: currentEdit.price, category: currentEdit.category,
      stock: currentEdit.stock, desc: currentEdit.desc, image: currentEdit.image,
      sale_sticker: currentEdit.sale_sticker ?? false, old_price: currentEdit.old_price ?? undefined,
    };
    
    const res = await adminActions.saveProduct(payload, currentEdit.id);

    if (res.error) {
      showToast("Failed to save product", "error");
    } else {
      if (currentEdit.id === 0) {
        setProducts(prev => [...prev, res.data as Product]);
        showToast("Product created");
      } else {
        setProducts(prev => prev.map(p => p.id === currentEdit.id ? { ...p, ...payload } : p));
        showToast("Product updated");
      }
    }
    setProductSaving(false); setProductModal(false);
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const res = await adminActions.deleteProduct(id);
    if (res.success) { setProducts(prev => prev.filter(p => p.id !== id)); showToast("Product deleted"); }
    else showToast("Failed to delete product", "error");
  };

  const updateStock = async (id: number, delta: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const newStock = Math.max(0, product.stock + delta);
    await adminActions.updateProductStock(id, newStock);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  // ── Enquiry Hub ───────────────────────────────────────────────────────────
  const updateLeadStatus = async (id: number, status: Enquiry["status"]) => {
    const res = await adminActions.updateLeadStatus(id, status);
    if (res.success) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      setSelectedLead(prev => prev?.id === id ? { ...prev, status } : prev);
      showToast(`Marked as ${status}`);
    } else showToast("Update failed", "error");
  };

  const deleteEnquiry = async (id: number) => {
    const res = await adminActions.deleteEnquiry(id);
    if (res.success) {
      setLeads(prev => prev.filter(l => l.id !== id));
      setSelectedLead(null);
      setConfirmDeleteLead(null);
      showToast("Enquiry deleted");
    } else {
      showToast("Failed to delete enquiry", "error");
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchFilter = leadFilter === "All" || l.status === leadFilter;
    const matchSearch = !leadSearch || [l.name, l.email].some(v => v.toLowerCase().includes(leadSearch.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const exportLeads = () => {
    const csv = [
      ["Name", "Email", "Phone", "Type", "Status", "Date", "Message"].join(","),
      ...leads.map(l => [l.name, l.email, l.phone, l.type, l.status, l.date, `"${l.message}"`].join(",")),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `tpi-enquiries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    showToast("CSV exported");
  };

  // ── Media Vault ───────────────────────────────────────────────────────────
  const uploadMediaFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setMediaUploading(true);
    for (const file of files) {
      const isVideo = file.type.startsWith("video/");
      const path = `${isVideo ? "videos" : "images"}/${Date.now()}-${file.name}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path);

      const resUpload = await adminActions.uploadFile(formData);
      if (resUpload.error) { showToast(`Failed: ${file.name}`, "error"); continue; }

      const record = {
        name: file.name, type: isVideo ? "Video" : "Image" as const,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: resUpload.url, bucket_path: path,
        date: new Date().toISOString().split("T")[0], category: isVideo ? "Videos" : "Images",
      };

      const resDb = await adminActions.saveMediaRecord(record);
      if (resDb.data) setMediaFiles(prev => [resDb.data as MediaFile, ...prev]);
    }
    setMediaUploading(false);
    showToast(`${files.length} file${files.length > 1 ? "s" : ""} uploaded`);
    if (e.target) e.target.value = "";
  };

  const deleteMedia = async (file: MediaFile) => {
    if (!confirm("Delete this file?")) return;
    await adminActions.deleteFile(file.bucket_path);
    await adminActions.deleteMediaRecord(file.id);
    setMediaFiles(prev => prev.filter(f => f.id !== file.id));
    showToast("File deleted");
  };

  const copyUrl = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── CMS Media Picker ──────────────────────────────────────────────────────
  const selectMediaForCMS = (url: string) => {
    if (mediaPickerTarget) {
      // Check if this is a service image pick
      if (mediaPickerTarget.startsWith('svc-img-') && currentSvc) {
        setCurrentSvc({ ...currentSvc, image: url });
        showToast("Image selected for service");
      } else {
        // Standard CMS preview update
        updatePreview(mediaPickerTarget, url);
        showToast("Media selected — remember to save your changes");
      }
    }
    setMediaPickerOpen(false);
    setMediaPickerTarget(null);
  };

  // ── Testimonials ──────────────────────────────────────────────────────────
  const approveTestimonial = async (id: number) => {
    const res = await adminActions.updateTestimonialStatus(id, "Approved");
    if (res.success) { setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: "Approved" } : t)); showToast("Approved"); }
  };

  const deleteTestimonial = async (id: number) => {
    const res = await adminActions.deleteTestimonial(id);
    if (res.success) { setTestimonials(prev => prev.filter(t => t.id !== id)); showToast("Deleted"); }
  };

  // ── Services ──────────────────────────────────────────────────────────────
  const saveService = async () => {
    if (!currentSvc || !currentSvc.title.trim()) return;
    setSvcSaving(true);
    const payload = {
      title: currentSvc.title,
      sub: currentSvc.sub,
      description: currentSvc.description,
      benefits: currentSvc.benefits,
      image: currentSvc.image,
      color: currentSvc.color,
      sort_order: currentSvc.sort_order,
      visible: currentSvc.visible,
    };
    const res = await adminActions.saveService(payload, currentSvc.id);
    if (res.error) {
      showToast("Failed to save service", "error");
    } else {
      if (currentSvc.id === 0) {
        setSvcItems(prev => [...prev, { ...currentSvc, id: res.data?.id || Date.now() }]);
        showToast("Service created");
      } else {
        setSvcItems(prev => prev.map(s => s.id === currentSvc.id ? { ...currentSvc } : s));
        showToast("Service updated");
      }
    }
    setSvcSaving(false);
    setSvcModal(false);
  };

  const deleteService = async (id: number) => {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    const res = await adminActions.deleteService(id);
    if (res.success) { setSvcItems(prev => prev.filter(s => s.id !== id)); showToast("Service deleted"); }
    else showToast("Failed to delete service", "error");
  };

  // ── Staff ──────────────────────────────────────────────────────────────────
  const saveStaff = async () => {
    if (!editingStaff) return;
    
    // Save credentials to Supabase if username is provided
    if (editingStaff.username) {
      const res = await adminActions.saveStaffCredentials({
        name: editingStaff.name,
        email: editingStaff.email,
        username: editingStaff.username,
        password: editingStaff.password || "",
        role: editingStaff.role,
        department: editingStaff.department,
      }, editingStaff.id === 0 ? undefined : editingStaff.id);
      
      if (!res.success) {
        showToast(res.error || "Failed to save credentials", "error");
        return;
      }
    }
    
    if (editingStaff.id === 0) {
      setStaff(prev => [...prev, { ...editingStaff, id: Date.now(), lastLogin: "Never", password: undefined }]);
    } else {
      setStaff(prev => prev.map(s => s.id === editingStaff.id ? { ...editingStaff, password: undefined } : s));
    }
    setStaffModal(false);
    showToast("Staff member saved");
  };

  // ── CMS Preview State Accessors ──────────────────────────────────────────────────

  // Get preview value (unsaved changes take precedence)
  const getPreviewValue = (id: string, originalContent: string) => {
    return previewChanges[id] !== undefined ? previewChanges[id] : originalContent;
  };

  // Update preview (doesn't save to DB yet)
  const updatePreview = (id: string, value: string) => {
    setPreviewChanges(prev => ({ ...prev, [id]: value }));
  };

  // Save all preview changes to DB
  const saveAllChanges = async () => {
    const entries = Object.entries(previewChanges);
    if (entries.length === 0) {
      showToast("No changes to save", "error");
      return;
    }
    for (const [id, value] of entries) {
      await adminActions.updateSiteContent(id, value);
    }
    setPreviewChanges({});
    showToast(`${entries.length} change${entries.length > 1 ? 's' : ''} saved to live site`, "success");
    fetchCMS();
  };

  // Discard preview changes
  const discardChanges = () => {
    setPreviewChanges({});
    showToast("Changes discarded");
  };

  const hasUnsavedChanges = Object.keys(previewChanges).length > 0;

  // ── Get CMS content for current page ──────────────────────────────────────
  const currentPageContent = siteContent.filter(c => c.page === cmsActivePage);
  const sections = Array.from(new Set(currentPageContent.map(c => c.section)));

  // ── Dashboard stats ────────────────────────────────────────────────────────
  const newEnquiries = leads.filter(l => l.status === "New").length;
  const lowStock = products.filter(p => p.stock < 5).length;

  const nav = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "inventory", icon: Package, label: "Products" },
    { id: "enquiries", icon: Mail, label: "Enquiries" },
    { id: "media", icon: FolderOpen, label: "Media" },
    { id: "testimonials", icon: Star, label: "Testimonials" },
    { id: "payments", icon: CreditCard, label: "Payments" },
    { id: "personnel", icon: Users, label: "Personnel" },
    { id: "cms", icon: Settings, label: "CMS" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
  ];

  // ── REPAIRED CONDITIONAL RETURNS (Now correctly placed below all Hooks) ─────

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="h-screen w-screen overflow-hidden fixed inset-0 bg-[#0D1117] flex items-center justify-center p-6">
        <div className="w-full max-w-sm flex flex-col items-center">
          
          {/* LARGE FLIPPING LOGO */}
          <div className="mb-12 w-48 h-48 cursor-pointer">
            <div className="relative w-full h-full group [perspective:2000px]">
              <div className="relative w-full h-full transition-all duration-1000 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <Image 
                  src="/tpilogo.png" 
                  alt="TPI" 
                  fill 
                  sizes="192px" 
                  className="object-contain [backface-visibility:hidden]" 
                  priority 
                />
                <Image 
                  src="/tpilogo2.png" 
                  alt="TPI Alternate" 
                  fill 
                  sizes="192px" 
                  className="object-contain [backface-visibility:hidden] [transform:rotateY(180deg)]" 
                  priority 
                />
              </div>
            </div>
          </div>

          <div className={`${card} p-7 w-full`}>
            <h2 className="text-sm font-semibold text-white mb-0.5">Admin sign in</h2>
            <p className="text-xs text-slate-500 mb-5">Authorised personnel only.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className={label}>Username</label>
                <input type="text" autoComplete="username" className={inputCls} placeholder="Operator ID" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className={label}>Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} autoComplete="current-password" className={inputCls} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              {loginError && <p className="text-xs text-red-400 flex items-center gap-1.5"><AlertCircle size={12} />{loginError}</p>}
              <button type="submit" disabled={loginLoading} className="w-full bg-[#0072CE] hover:bg-[#005bb5] disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-1">
                {loginLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN PORTAL RENDER ──────────────────────────────────────────────────────
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#090C10] text-white flex fixed inset-0">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-52 h-screen bg-[#0D1117] border-r border-white/[0.06] flex flex-col fixed left-0 top-0 z-50 transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-6 h-6 shrink-0"><Image src="/tpilogo.png" alt="TPI" fill sizes="24px" className="object-contain" /></div>
              <div>
                <p className="text-xs font-semibold text-white leading-none">TPI Admin</p>
                <p className="text-[10px] text-slate-600 mt-0.5">Management portal</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-500 transition-colors"><X size={15} /></button>
          </div>
        </div>
        <nav className="flex-grow p-2.5 space-y-0.5 overflow-y-auto">
          {nav.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left group ${activeTab === item.id ? "bg-[#0072CE]/15 text-[#4BA3E3]" : "text-slate-500 hover:text-slate-200 hover:bg-white/5"}`}>
              <item.icon size={13} strokeWidth={1.75} />
              <span className="flex-grow">{item.label}</span>
              {item.id === "enquiries" && newEnquiries > 0 && <span className="bg-[#0072CE] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">{newEnquiries}</span>}
              {item.id === "inventory" && lowStock > 0 && <span className="bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">{lowStock}</span>}
            </button>
          ))}
        </nav>
        <div className="p-2.5 border-t border-white/[0.06]">
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={13} strokeWidth={1.75} />Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-grow lg:ml-52 h-screen overflow-auto">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 bg-[#090C10]/95 backdrop-blur-sm border-b border-white/[0.06] px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors">
            <Menu size={18} />
          </button>
          <p className="text-xs font-semibold text-white">{nav.find(n => n.id === activeTab)?.label}</p>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">

        {/* ── DASHBOARD ───────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-5 max-w-4xl">
            <SectionHeader title="Overview" sub="Summary of store activity and incoming enquiries." />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Total Products", value: products.length, icon: Package, color: "#0072CE" },
                { label: "New Enquiries", value: newEnquiries, icon: Mail, color: "#00A651" },
                { label: "Low Stock", value: lowStock, icon: AlertCircle, color: "#F59E0B" },
                { label: "Media Files", value: mediaFiles.length, icon: FolderOpen, color: "#8B5CF6" },
              ].map(kpi => (
                <div key={kpi.label} className={`${card} ${cardPad}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-500">{kpi.label}</p>
                    <kpi.icon size={13} style={{ color: kpi.color }} strokeWidth={1.75} />
                  </div>
                  <p className="text-2xl font-semibold text-white">{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className={card}>
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
                <p className="text-xs font-semibold text-white">Recent Enquiries</p>
                <button onClick={() => setActiveTab("enquiries")} className="text-[11px] text-[#4BA3E3] hover:underline flex items-center gap-1">View all <ChevronRight size={11} /></button>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {leads.slice(0, 5).map(lead => (
                  <div key={lead.id} className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => { setSelectedLead(lead); setActiveTab("enquiries"); }}>
                    <div>
                      <p className="text-sm font-medium text-white">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={lead.status} />
                      <span className="text-[11px] text-slate-600">{new Date(lead.date).toLocaleDateString("en-GB")}</span>
                    </div>
                  </div>
                ))}
                {leads.length === 0 && <p className="text-xs text-slate-600 text-center py-10">No enquiries yet.</p>}
              </div>
            </div>
            {lowStock > 0 && (
              <div className={`${card} ${cardPad} border-amber-500/15`}>
                <div className="flex items-center gap-2 mb-3"><AlertCircle size={13} className="text-amber-400" /><p className="text-xs font-semibold text-amber-400">Low stock alert</p></div>
                <div className="space-y-2">
                  {products.filter(p => p.stock < 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between">
                      <p className="text-sm text-white">{p.name}</p>
                      <span className="text-xs font-semibold text-amber-400">{p.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS ────────────────────────────────────────────────── */}
        {activeTab === "inventory" && (
          <div className="space-y-5 max-w-5xl">
            <SectionHeader title="Products" sub="Manage your store catalogue. All changes persist to Supabase immediately.">
              <button onClick={fetchProducts} className={btnGhost}><RefreshCw size={13} />Refresh</button>
              <button onClick={() => { setCurrentEdit({ id: 0, name: "", price: 0, category: "Featured", stock: 0, desc: "", image: "" }); setProductModal(true); }} className={btnPrimary}><Plus size={13} />Add product</button>
            </SectionHeader>
            {productsLoading ? <Spinner /> : (
              <div className={card}>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      {["Product", "Category", "Price", "Stock", ""].map(h => (
                        <th key={h} className="px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {products.map(item => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#161B22] border border-white/[0.06] relative overflow-hidden shrink-0">
                              {item.image ? <Image src={item.image} alt={item.name} fill sizes="36px" className="object-cover" unoptimized /> : <Package size={14} className="text-slate-700 absolute inset-0 m-auto" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white leading-none">{item.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[180px]">{item.desc}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><span className="text-[11px] text-slate-400 bg-white/5 px-2 py-1 rounded">{item.category}</span></td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-medium text-white">£{item.price.toFixed(2)}</p>
                          {item.sale_sticker && item.old_price && <p className="text-xs text-slate-500 line-through">£{item.old_price.toFixed(2)}</p>}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateStock(item.id, -1)} className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center text-xs transition-colors font-bold">−</button>
                            <span className={`text-sm font-semibold w-5 text-center ${item.stock < 5 ? "text-amber-400" : "text-white"}`}>{item.stock}</span>
                            <button onClick={() => updateStock(item.id, 1)} className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center text-xs transition-colors font-bold">+</button>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                            <button onClick={() => { setCurrentEdit(item); setProductModal(true); }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"><Edit2 size={12} /></button>
                            <button onClick={() => deleteProduct(item.id)} className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && <tr><td colSpan={5} className="px-5 py-16 text-center text-sm text-slate-600">No products yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ENQUIRIES ───────────────────────────────────────────────── */}
        {activeTab === "enquiries" && (
          <div className="space-y-5 max-w-5xl">
            <SectionHeader title="Enquiries" sub="All contact form submissions from the website, live from Supabase.">
              <button onClick={fetchLeads} className={btnGhost}><RefreshCw size={13} />Refresh</button>
              <button onClick={exportLeads} className={btnGhost}><Download size={13} />Export CSV</button>
            </SectionHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={leadSearch} onChange={e => setLeadSearch(e.target.value)} placeholder="Search name or email" className={`${inputCls} pl-8 w-52 text-xs`} />
              </div>
              <div className="flex gap-1 bg-white/[0.04] border border-white/[0.06] rounded-lg p-0.5">
                {(["All", "New", "Contacted", "Closed"] as const).map(f => (
                  <button key={f} onClick={() => setLeadFilter(f)} className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${leadFilter === f ? "bg-[#0072CE] text-white" : "text-slate-500 hover:text-slate-300"}`}>{f}</button>
                ))}
              </div>
              <span className="text-[11px] text-slate-600 ml-auto">{filteredLeads.length} result{filteredLeads.length !== 1 ? "s" : ""}</span>
            </div>
            {leadsLoading ? <Spinner /> : (
              <div className={card}>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      {["Contact", "Enquiry type", "Status", "Date", ""].map(h => (
                        <th key={h} className="px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => setSelectedLead(lead)}>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-medium text-white">{lead.name}</p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-400">{lead.type}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={lead.status} /></td>
                        <td className="px-5 py-3.5 text-xs text-slate-500">{new Date(lead.date).toLocaleDateString("en-GB")}</td>
                        <td className="px-5 py-3.5 text-right"><ChevronRight size={13} className="text-slate-700 group-hover:text-slate-400 transition-colors inline" /></td>
                      </tr>
                    ))}
                    {filteredLeads.length === 0 && <tr><td colSpan={5} className="px-5 py-16 text-center text-sm text-slate-600">No enquiries found.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── MEDIA ───────────────────────────────────────────────────── */}
        {activeTab === "media" && (
          <div className="space-y-5 max-w-5xl">
            <SectionHeader title="Media" sub="Upload images and videos. Files are stored in your Supabase Storage bucket.">
              <button onClick={fetchMedia} className={btnGhost}><RefreshCw size={13} />Refresh</button>
              <button onClick={() => mediaUploadRef.current?.click()} disabled={mediaUploading} className={btnPrimary}>
                <Upload size={13} />{mediaUploading ? "Uploading..." : "Upload files"}
              </button>
              <input ref={mediaUploadRef} type="file" hidden multiple accept="image/*,video/*" onChange={uploadMediaFiles} />
            </SectionHeader>
            <div onClick={() => !mediaUploading && mediaUploadRef.current?.click()} className={`border-2 border-dashed border-white/[0.07] hover:border-[#0072CE]/30 rounded-xl p-8 text-center cursor-pointer transition-colors group ${mediaUploading ? "opacity-50 cursor-wait" : ""}`}>
              <Upload size={18} className="mx-auto mb-2 text-slate-600 group-hover:text-slate-400 transition-colors" />
              <p className="text-sm text-slate-500">{mediaUploading ? "Uploading files…" : "Click to upload images or videos"}</p>
              <p className="text-xs text-slate-600 mt-0.5">JPG, PNG, WebP, MP4, MOV supported</p>
            </div>
            {mediaLoading ? <Spinner /> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {mediaFiles.map(file => (
                  <div key={file.id} className={`${card} overflow-hidden group`}>
                    <div className="relative aspect-square bg-[#161B22]">
                      {file.type === "Image"
                        ? <Image src={file.url} alt={file.name} fill sizes="200px" className="object-cover" unoptimized />
                        : <div className="w-full h-full flex flex-col items-center justify-center gap-1.5"><Film size={22} className="text-slate-600" /><span className="text-[10px] text-slate-600">Video</span></div>
                      }
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        <button onClick={() => copyUrl(file.id, file.url)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Copy URL">
                          {copied === file.id ? <CheckCircle size={13} className="text-emerald-400" /> : <Copy size={13} className="text-white" />}
                        </button>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" onClick={e => e.stopPropagation()}>
                          <ExternalLink size={13} className="text-white" />
                        </a>
                        <button onClick={() => deleteMedia(file)} className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors">
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-[11px] font-medium text-white truncate leading-none">{file.name}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{file.size}</p>
                    </div>
                  </div>
                ))}
                {mediaFiles.length === 0 && !mediaLoading && (
                  <div className="col-span-5 py-20 text-center">
                    <FolderOpen size={28} className="mx-auto mb-3 text-slate-700" />
                    <p className="text-sm text-slate-600">No media uploaded yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
        {activeTab === "testimonials" && (
          <div className="space-y-5 max-w-3xl">
            <SectionHeader title="Testimonials" sub="Review and approve submissions from the courses page.">
              <button onClick={fetchTestimonials} className={btnGhost}><RefreshCw size={13} />Refresh</button>
            </SectionHeader>
            {testimonialsLoading ? <Spinner /> : (
              <div className="space-y-2.5">
                {testimonials.map(t => (
                  <div key={t.id} className={`${card} ${cardPad} flex items-start justify-between gap-5`}>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <p className="text-sm font-semibold text-white">{t.author}</p>
                        <StatusBadge status={t.status} />
                        <span className="text-[11px] text-slate-600">{new Date(t.date).toLocaleDateString("en-GB")}</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {t.status === "Pending" && <button onClick={() => approveTestimonial(t.id)} className={btnPrimary}><CheckCircle size={13} />Approve</button>}
                      <button onClick={() => deleteTestimonial(t.id)} className={btnDanger}><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
                {testimonials.length === 0 && <p className="text-sm text-slate-600 text-center py-20">No testimonials yet.</p>}
              </div>
            )}
          </div>
        )}

        {/* ── PAYMENTS ────────────────────────────────────────────────── */}
        {activeTab === "payments" && (
          <div className="space-y-5 max-w-5xl">
            <SectionHeader title="Payments" sub="Order history. Integrate Stripe webhooks to populate this automatically." />
            <div className={card}>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {["Order", "Customer", "Amount", "Gateway", "Status", "Date"].map(h => (
                      <th key={h} className="px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-sm font-medium text-white">{p.id}</td>
                      <td className="px-5 py-3.5 text-sm text-white">{p.customer}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-white">£{p.amount.toFixed(2)}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">{p.gateway} · {p.method}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{new Date(p.date).toLocaleDateString("en-GB")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PERSONNEL ───────────────────────────────────────────────── */}
        {activeTab === "personnel" && (
          <div className="space-y-5 max-w-4xl">
            <SectionHeader title="Personnel" sub="Manage team access. Authentication uses environment variables.">
              <button onClick={() => { setEditingStaff({ id: 0, name: "", role: "Content Editor", status: "Active", department: "", email: "", lastLogin: "Never" }); setStaffModal(true); }} className={btnPrimary}><UserPlus size={13} />Add member</button>
            </SectionHeader>
            <div className={card}>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {["Name", "Role", "Department", "Status", "Last login", ""].map(h => (
                      <th key={h} className="px-5 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {staff.map(m => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-white">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400">{m.role}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{m.department || "—"}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={m.status} /></td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 flex items-center gap-1.5"><Clock size={10} />{m.lastLogin}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                          <button onClick={() => { setEditingStaff(m); setStaffModal(true); }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"><Edit2 size={12} /></button>
                          <button onClick={() => setStaff(prev => prev.filter(s => s.id !== m.id))} className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CMS ─────────────────────────────────────────────────────── */}
        {activeTab === "cms" && (
          <div className="space-y-6 max-w-6xl">
            <SectionHeader title="Content Management System" sub="Edit site content, typography, and styling.">
              <button 
                onClick={async () => {
                  await fetchCMS();
                  showToast("All changes synced to live site", "success");
                }} 
                className={btnGhost}
              >
                <RefreshCw size={13} />Sync Live Site
              </button>
            </SectionHeader>

            {/* CMS Sub-tabs: Content | Fonts */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit border border-white/[0.06]">
              <button
                onClick={() => setCmsSubTab("content")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  cmsSubTab === "content"
                    ? "bg-[#0072CE] text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FileText size={15} />
                Page Content
              </button>
              <button
                onClick={() => setCmsSubTab("fonts")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  cmsSubTab === "fonts"
                    ? "bg-[#0072CE] text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Type size={15} />
                Typography
              </button>
            </div>

            {/* CONTENT SUB-TAB */}
            {cmsSubTab === "content" && (
              <>
                {/* Page Selector Tabs */}
                <div className="flex gap-2 flex-wrap">
                  {CMS_PAGES.map(page => {
                    const pageContentCount = siteContent.filter(c => c.page === page.id).length;
                    return (
                      <button
                        key={page.id}
                        onClick={() => setCmsActivePage(page.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                          cmsActivePage === page.id
                            ? "bg-[#0072CE] text-white shadow-lg shadow-[#0072CE]/20"
                            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/[0.06]"
                        }`}
                      >
                        <page.icon size={16} />
                        {page.label}
                        {pageContentCount > 0 && (
                          <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">{pageContentCount}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Debug info */}
                <div className="text-xs text-slate-600 bg-white/5 p-3 rounded-lg flex items-center justify-between">
                  <span>Total CMS entries: {siteContent.length} | Current page: {cmsActivePage} | Entries for page: {currentPageContent.length} | Sections: {sections.length}</span>
                  <button 
                    onClick={() => fetchCMS()} 
                    className="text-[#0072CE] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <RefreshCw size={12} /> Refresh
                  </button>
                </div>

                {/* Content Editor for Selected Page */}
                <div className="space-y-8">
                  {/* Unsaved Changes Bar */}
                  {hasUnsavedChanges && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle size={18} className="text-amber-400" />
                        <span className="text-amber-300 text-sm font-medium">
                          You have {Object.keys(previewChanges).length} unsaved change{Object.keys(previewChanges).length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={discardChanges} className={btnGhost}>
                          <X size={13} /> Discard
                        </button>
                        <button onClick={saveAllChanges} className={btnPrimary}>
                          <CheckCircle size={13} /> Save All Changes
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {sections.length === 0 ? (
                    <div className={`${card} ${cardPad} text-center py-20`}>
                      <FileText size={32} className="mx-auto mb-4 text-slate-600" />
                      <p className="text-slate-500 text-lg font-semibold">No content found for &quot;{cmsActivePage}&quot;</p>
                      <p className="text-sm text-slate-600 mt-2">
                        {siteContent.length === 0 
                          ? "Your database appears to be empty. You need to seed it first."
                          : `No entries with page="${cmsActivePage}" found in the database.`
                        }
                      </p>
                      <div className="mt-6 p-4 bg-white/5 rounded-xl text-left max-w-lg mx-auto">
                        <p className="text-xs text-[#0072CE] font-bold uppercase tracking-wider mb-2">How to fix:</p>
                        <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
                          <li>Go to your Supabase dashboard → SQL Editor</li>
                          <li>Open <code className="bg-white/10 px-1.5 py-0.5 rounded text-white">seed_cms_content.sql</code></li>
                          <li>Run the entire script to create the table and seed content</li>
                          <li>Click the Refresh button above</li>
                        </ol>
                      </div>
                      <button 
                        onClick={() => fetchCMS()} 
                        className="mt-6 px-6 py-3 bg-[#0072CE] text-white rounded-xl font-semibold hover:bg-[#0072CE]/80 transition-all flex items-center gap-2 mx-auto"
                      >
                        <RefreshCw size={16} /> Refresh CMS Data
                      </button>
                    </div>
                  ) : (
                sections.map(section => (
                  <div key={section} className="space-y-4">
                    {section === 'popup' ? (
                      <div className="flex items-center gap-3 bg-[#00A651]/10 border border-[#00A651]/20 rounded-xl p-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00A651]/20 flex items-center justify-center">
                          <ShoppingBag size={18} className="text-[#00A651]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#00A651] uppercase tracking-widest">Store Popup</h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">Control the &quot;come back soon&quot; popup shown to store visitors</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-6 rounded-full bg-[#0072CE]" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">{section}</h3>
                      </div>
                    )}
                    <div className="grid gap-4 md:grid-cols-2">
                      {currentPageContent.filter(c => c.section === section).map(item => {
                        const dimensions = getMediaDimensions(item.id);
                        const previewValue = getPreviewValue(item.id, item.content);
                        const hasChange = previewChanges[item.id] !== undefined;
                        
                        return (
                        <div key={item.id} className={`${card} p-5 ${hasChange ? 'ring-2 ring-amber-500/50' : ''}`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="text-[11px] font-bold text-[#0072CE] uppercase tracking-wide">{item.label}</span>
                              <span className="text-[9px] text-slate-600 ml-2 font-mono bg-white/5 px-1.5 py-0.5 rounded">{item.content_type}</span>
                              {hasChange && <span className="text-[9px] text-amber-400 ml-2">• unsaved</span>}
                            </div>
                          </div>
                          
                          {item.content_type === 'textarea' ? (
                            <div className="space-y-3">
                              <textarea 
                                className={`${inputCls} min-h-[120px] resize-none`}
                                value={previewValue}
                                onChange={(e) => updatePreview(item.id, e.target.value)}
                                placeholder="Enter text content..."
                              />
                              <p className="text-[9px] text-slate-500">
                                <span className="text-slate-400">Tip:</span> Edit and preview your changes. Click &quot;Save All Changes&quot; when ready to publish.
                              </p>
                            </div>
                          ) : item.content_type === 'image' || item.content_type === 'video' ? (
                            <div className="space-y-3">
                              {/* Video compression warning */}
                              {item.content_type === 'video' && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-3">
                                  <Zap size={16} className="text-amber-400 shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-[11px] text-amber-300 font-semibold">Compress your video first!</p>
                                    <p className="text-[10px] text-amber-400/80 mt-1">
                                      Large videos slow down your site. Use{' '}
                                      <a href="https://handbrake.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-300">HandBrake</a> or{' '}
                                      <a href="https://www.freeconvert.com/video-compressor" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-300">FreeConvert</a>{' '}
                                      for lossless compression.
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Dimension guide */}
                              <div className="bg-[#0072CE]/10 border border-[#0072CE]/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <Maximize2 size={12} className="text-[#0072CE]" />
                                  <span className="text-[11px] text-[#0072CE] font-semibold">Recommended dimensions</span>
                                </div>
                                <p className="text-[10px] text-slate-400">
                                  {dimensions.width} × {dimensions.height}px ({dimensions.aspectRatio}) — {dimensions.description}
                                </p>
                              </div>
                              
                              {/* Media picker button */}
                              <button 
                                onClick={() => { setMediaPickerTarget(item.id); setMediaPickerOpen(true); }}
                                className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#161B22] border-2 border-dashed border-white/10 rounded-xl hover:border-[#0072CE]/50 hover:bg-[#0072CE]/5 transition-all group"
                              >
                                <FolderOpen size={20} className="text-slate-500 group-hover:text-[#0072CE]" />
                                <span className="text-sm text-slate-400 group-hover:text-white font-medium">
                                  {previewValue ? 'Change' : 'Select'} {item.content_type} from Media Library
                                </span>
                              </button>
                              
                              {/* Preview */}
                              {previewValue && (
                                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-[#161B22] border border-white/[0.06] group">
                                  {item.content_type === 'image' ? (
                                    <Image src={previewValue} alt="Preview" fill className="object-cover" unoptimized />
                                  ) : (
                                    <>
                                      <video src={previewValue} className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play size={32} className="text-white" />
                                      </div>
                                    </>
                                  )}
                                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                                    <span className="text-[9px] text-white font-mono">{previewValue.split('/').pop()}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : item.id === 'store.popup.enabled' ? (
                            /* ── Special toggle for Store Popup enabled/disabled ── */
                            <div className="space-y-3">
                              <div className="flex items-center justify-between bg-[#161B22] border border-white/[0.08] rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${previewValue === 'true' ? 'bg-[#00A651] shadow-[0_0_8px_rgba(0,166,81,0.5)]' : 'bg-slate-600'} transition-colors`} />
                                  <span className="text-sm font-semibold text-white">
                                    Store popup is {previewValue === 'true' ? 'LIVE' : 'OFF'}
                                  </span>
                                </div>
                                <button
                                  onClick={() => updatePreview(item.id, previewValue === 'true' ? 'false' : 'true')}
                                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${previewValue === 'true' ? 'bg-[#00A651]' : 'bg-slate-700'}`}
                                >
                                  <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${previewValue === 'true' ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'}`} />
                                </button>
                              </div>
                              <p className="text-[9px] text-slate-500">
                                <span className="text-slate-400">Note:</span> When enabled, visitors to the Store page will see the popup with the title and message configured below. Toggle off to hide it instantly.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <input 
                                className={inputCls}
                                value={previewValue}
                                onChange={(e) => updatePreview(item.id, e.target.value)}
                                placeholder="Enter text..."
                              />
                              {/* Live text preview */}
                              <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">Preview</p>
                                <p className="text-white" style={{ fontFamily: fontSettings.body }}>
                                  {previewValue || <span className="text-slate-600 italic">Empty</span>}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )})}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ── SERVICE CARDS MANAGER (only on Services page) ────────────── */}
            {cmsActivePage === "services" && (
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 rounded-full bg-[#00A651]" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Service Cards</h3>
                    <span className="text-[9px] text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{svcItems.length} cards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={fetchServices} className={btnGhost}><RefreshCw size={13} />Refresh</button>
                    <button onClick={() => { setCurrentSvc({ id: 0, title: "", sub: "", description: "", benefits: [], image: "", color: "#0072CE", sort_order: svcItems.length + 1, visible: true }); setSvcModal(true); }} className={btnPrimary}><Plus size={13} />Add card</button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">These cards appear on the live Services page under &quot;What we install&quot;. Click edit to change content or select an image from your media library.</p>
                {svcLoading ? <Spinner /> : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {svcItems.map(svc => (
                      <div key={svc.id} className={`${card} overflow-hidden`}>
                        <div className="relative h-36 bg-[#161B22]">
                          {svc.image ? <Image src={svc.image} alt={svc.title} fill sizes="400px" className="object-cover opacity-60" unoptimized /> : <div className="w-full h-full flex items-center justify-center"><Wrench size={28} className="text-slate-700" /></div>}
                          <div className="absolute top-3 left-3">
                            <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: svc.color }}>{svc.sub || "Service"}</span>
                          </div>
                          <div className="absolute top-3 right-3 flex gap-1.5">
                            <button onClick={() => { setCurrentSvc(svc); setSvcModal(true); }} className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"><Edit2 size={11} /></button>
                            <button onClick={() => deleteService(svc.id)} className="p-1.5 rounded-lg bg-red-500/50 hover:bg-red-500/70 text-white transition-colors"><Trash2 size={11} /></button>
                          </div>
                          {!svc.visible && (
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
                              <EyeOff size={9} className="text-slate-400" />
                              <span className="text-[8px] text-slate-400 font-medium">Hidden</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-white mb-1">{svc.title}</h3>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">{svc.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {(svc.benefits || []).slice(0, 3).map((b, i) => (
                              <span key={i} className="text-[8px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded">{b}</span>
                            ))}
                            {(svc.benefits || []).length > 3 && <span className="text-[8px] text-slate-600">+{svc.benefits.length - 3}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    {svcItems.length === 0 && (
                      <div className={`${card} ${cardPad} col-span-2 text-center py-12`}>
                        <Wrench size={28} className="mx-auto mb-3 text-slate-600" />
                        <p className="text-slate-500 text-sm">No service cards yet.</p>
                        <p className="text-[10px] text-slate-600 mt-1">Add cards here and they&apos;ll appear on the live services page.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
              </>
            )}

            {/* FONTS SUB-TAB */}
            {cmsSubTab === "fonts" && (
              <div className="space-y-8">
                {/* Font Preview */}
                <div className={`${card} p-8`}>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Eye size={14} className="text-[#0072CE]" />
                    Live Preview
                  </h3>
                  <div className="bg-white rounded-2xl p-10 space-y-6">
                    <h1 
                      style={{ fontFamily: `"${fontSettings.heading}", sans-serif` }}
                      className="text-5xl font-black text-[#002D72] uppercase tracking-tighter"
                    >
                      The Physical Internet
                    </h1>
                    <h2 
                      style={{ fontFamily: `"${fontSettings.heading}", sans-serif` }}
                      className="text-2xl font-bold text-[#002D72] italic"
                    >
                      Professional Data Cabling Training
                    </h2>
                    <p 
                      style={{ fontFamily: `"${fontSettings.body}", sans-serif` }}
                      className="text-lg text-slate-600 leading-relaxed"
                    >
                      Every upload, every download, and every digital connection runs through the copper and fibre cables that TPI technicians install and maintain. We are the backbone of the digital age.
                    </p>
                    <div className="flex gap-3">
                      <span 
                        style={{ fontFamily: `"${fontSettings.primary}", sans-serif` }}
                        className="px-6 py-3 bg-[#002D72] text-white rounded-full font-bold uppercase tracking-widest text-xs"
                      >
                        View Courses
                      </span>
                      <span 
                        style={{ fontFamily: `"${fontSettings.primary}", sans-serif` }}
                        className="px-6 py-3 bg-[#00A651] text-white rounded-full font-bold uppercase tracking-widest text-xs"
                      >
                        Contact Us
                      </span>
                    </div>
                  </div>
                </div>

                {/* Font Selectors */}
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Primary/UI Font */}
                  <div className={`${card} p-6`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0072CE]/10 flex items-center justify-center">
                        <Type size={18} className="text-[#0072CE]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Primary Font</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Buttons, navigation, UI</p>
                      </div>
                    </div>
                    <select
                      value={fontSettings.primary}
                      onChange={(e) => saveFontSetting('primary', e.target.value)}
                      className={`${inputCls} cursor-pointer`}
                      disabled={fontLoading}
                    >
                      {FONT_OPTIONS.map(font => (
                        <option key={font.name} value={font.name}>{font.name}</option>
                      ))}
                    </select>
                    <div 
                      style={{ fontFamily: `"${fontSettings.primary}", sans-serif` }}
                      className="mt-4 p-4 bg-white/5 rounded-xl text-white text-lg font-bold"
                    >
                      Aa Bb Cc 123
                    </div>
                  </div>

                  {/* Heading Font */}
                  <div className={`${card} p-6`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#00A651]/10 flex items-center justify-center">
                        <Type size={18} className="text-[#00A651]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Heading Font</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">H1, H2, titles</p>
                      </div>
                    </div>
                    <select
                      value={fontSettings.heading}
                      onChange={(e) => saveFontSetting('heading', e.target.value)}
                      className={`${inputCls} cursor-pointer`}
                      disabled={fontLoading}
                    >
                      {FONT_OPTIONS.map(font => (
                        <option key={font.name} value={font.name}>{font.name}</option>
                      ))}
                    </select>
                    <div 
                      style={{ fontFamily: `"${fontSettings.heading}", sans-serif` }}
                      className="mt-4 p-4 bg-white/5 rounded-xl text-white text-lg font-black uppercase tracking-tight"
                    >
                      Heading Text
                    </div>
                  </div>

                  {/* Body Font */}
                  <div className={`${card} p-6`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Type size={18} className="text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Body Font</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Paragraphs, descriptions</p>
                      </div>
                    </div>
                    <select
                      value={fontSettings.body}
                      onChange={(e) => saveFontSetting('body', e.target.value)}
                      className={`${inputCls} cursor-pointer`}
                      disabled={fontLoading}
                    >
                      {FONT_OPTIONS.map(font => (
                        <option key={font.name} value={font.name}>{font.name}</option>
                      ))}
                    </select>
                    <div 
                      style={{ fontFamily: `"${fontSettings.body}", sans-serif` }}
                      className="mt-4 p-4 bg-white/5 rounded-xl text-white text-base leading-relaxed"
                    >
                      Body text preview with regular weight.
                    </div>
                  </div>
                </div>

                {/* Font Categories */}
                <div className={`${card} p-6`}>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Available Fonts by Category</h3>
                  <div className="grid gap-6 md:grid-cols-4">
                    {(['sans-serif', 'serif', 'display', 'monospace'] as const).map(category => (
                      <div key={category}>
                        <h4 className="text-xs font-bold text-[#0072CE] uppercase tracking-wider mb-3 capitalize">{category}</h4>
                        <div className="space-y-2">
                          {FONT_OPTIONS.filter(f => f.category === category).map(font => (
                            <button
                              key={font.name}
                              onClick={() => {
                                loadFont(font.name);
                              }}
                              onMouseEnter={() => loadFont(font.name)}
                              className="block w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                              style={{ fontFamily: loadedFonts.has(font.name) ? `"${font.name}", ${category}` : 'inherit' }}
                            >
                              {font.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CSS Output */}
                <div className={`${card} p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">CSS Variables</h3>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`--font-primary: "${fontSettings.primary}", sans-serif;\n--font-heading: "${fontSettings.heading}", sans-serif;\n--font-body: "${fontSettings.body}", sans-serif;`);
                        showToast("CSS copied to clipboard");
                      }}
                      className={btnGhost}
                    >
                      <Copy size={13} />
                      Copy
                    </button>
                  </div>
                  <pre className="bg-[#161B22] rounded-xl p-4 text-xs text-slate-400 font-mono overflow-x-auto">
{`:root {
  --font-primary: "${fontSettings.primary}", sans-serif;
  --font-heading: "${fontSettings.heading}", sans-serif;
  --font-body: "${fontSettings.body}", sans-serif;
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS ─────────────────────────────────────────────────────── */}
        {activeTab === "analytics" && (
          <div className="space-y-6 max-w-6xl">
            <SectionHeader title="Analytics & SEO" sub="Monitor site performance, SEO scores, and user engagement." />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`${card} p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Gauge size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Performance</p>
                    <p className="text-2xl font-black text-white">94</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div className={`${card} p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Globe size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">SEO Score</p>
                    <p className="text-2xl font-black text-white">87</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }} />
                </div>
              </div>

              <div className={`${card} p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Zap size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Accessibility</p>
                    <p className="text-2xl font-black text-white">91</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }} />
                </div>
              </div>

              <div className={`${card} p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <TrendingUp size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Best Practices</p>
                    <p className="text-2xl font-black text-white">100</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            {/* Microsoft Clarity Integration */}
            <div className={`${card} p-6`}>
              {hasUnsavedChanges && previewChanges['settings.analytics.clarity_id'] !== undefined && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} className="text-amber-400" />
                    <span className="text-amber-300 text-sm font-medium">Unsaved Clarity Project ID change</span>
                  </div>
                  <button onClick={saveAllChanges} className={btnPrimary}>
                    <CheckCircle size={13} /> Save Change
                  </button>
                </motion.div>
              )}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <MousePointer2 size={22} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Microsoft Clarity Integration</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enable session recordings and heatmaps by entering your Project ID
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-72 space-y-1.5">
                  <label className={label}>Project ID</label>
                  <div className="relative">
                    <input 
                      className={inputCls}
                      placeholder="e.g. m5l8p7x9z2"
                      value={getPreviewValue('settings.analytics.clarity_id', siteContent.find(c => c.id === 'settings.analytics.clarity_id')?.content || '')}
                      onChange={(e) => updatePreview('settings.analytics.clarity_id', e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                      {siteContent.find(c => c.id === 'settings.analytics.clarity_id')?.content && (
                        <CheckCircle size={14} className="text-emerald-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clarity Quick Links */}
              {siteContent.find(c => c.id === 'settings.analytics.clarity_id')?.content && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap gap-3">
                  <a 
                    href={`https://clarity.microsoft.com/projects/view/${siteContent.find(c => c.id === 'settings.analytics.clarity_id')?.content}/dashboard`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnPrimary}
                  >
                    <BarChart3 size={13} />View Clarity Dashboard
                    <ExternalLink size={11} />
                  </a>
                  <a 
                    href={`https://clarity.microsoft.com/projects/view/${siteContent.find(c => c.id === 'settings.analytics.clarity_id')?.content}/heatmaps`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnGhost}
                  >
                    <MousePointer2 size={13} />View Heatmaps
                    <ExternalLink size={11} />
                  </a>
                  <a 
                    href={`https://clarity.microsoft.com/projects/view/${siteContent.find(c => c.id === 'settings.analytics.clarity_id')?.content}/recordings`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnGhost}
                  >
                    <Play size={13} />Session Recordings
                    <ExternalLink size={11} />
                  </a>
                </div>
              )}
            </div>

            {/* SEO Checklist */}
            <div className={`${card} p-6`}>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Globe size={14} className="text-[#0072CE]" />
                SEO Health Check
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Meta titles on all pages", status: true, note: "Properly configured" },
                  { label: "Meta descriptions", status: true, note: "All pages covered" },
                  { label: "Open Graph tags", status: true, note: "Social sharing optimized" },
                  { label: "Structured data (JSON-LD)", status: true, note: "Organization schema present" },
                  { label: "Image alt texts", status: false, note: "3 images missing alt text" },
                  { label: "Mobile responsive", status: true, note: "Fully responsive design" },
                  { label: "HTTPS enabled", status: true, note: "SSL certificate active" },
                  { label: "Sitemap.xml", status: true, note: "Auto-generated" },
                  { label: "Robots.txt", status: true, note: "Properly configured" },
                  { label: "Core Web Vitals", status: true, note: "LCP: 1.2s, FID: 12ms, CLS: 0.02" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      {item.status ? (
                        <CheckCircle size={16} className="text-emerald-400" />
                      ) : (
                        <AlertCircle size={16} className="text-amber-400" />
                      )}
                      <span className="text-sm text-white">{item.label}</span>
                    </div>
                    <span className={`text-xs ${item.status ? 'text-slate-500' : 'text-amber-400'}`}>
                      {item.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Page Performance */}
            <div className={`${card} p-6`}>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <BarChart3 size={14} className="text-[#0072CE]" />
                Page Load Performance
              </h3>
              <div className="space-y-4">
                {[
                  { page: "Home", time: "1.2s", score: 94 },
                  { page: "Courses", time: "1.4s", score: 89 },
                  { page: "About", time: "1.1s", score: 96 },
                  { page: "Store", time: "1.8s", score: 82 },
                  { page: "Contact", time: "0.9s", score: 98 },
                ].map((page, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-sm text-white w-24">{page.page}</span>
                    <div className="flex-grow bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          page.score >= 90 ? 'bg-emerald-500' : page.score >= 80 ? 'bg-amber-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${page.score}%` }} 
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-12">{page.time}</span>
                    <span className={`text-xs font-bold w-8 ${
                      page.score >= 90 ? 'text-emerald-400' : page.score >= 80 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {page.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Run Lighthouse */}
            <div className={`${card} p-6 text-center`}>
              <p className="text-slate-400 text-sm mb-4">
                Run a full Lighthouse audit to get detailed performance insights
              </p>
              <a 
                href="https://pagespeed.web.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${btnPrimary} inline-flex`}
              >
                <ExternalLink size={14} />
                Open PageSpeed Insights
              </a>
            </div>
          </div>
        )}

        </div>
      </main>

      {/* ── PRODUCT MODAL ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {productModal && currentEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.15 }} className="w-full max-w-2xl bg-[#0D1117] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white">{currentEdit.id === 0 ? "Add product" : "Edit product"}</h2>
                <button onClick={() => setProductModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 transition-colors"><X size={15} /></button>
              </div>
              <div className="p-6 grid grid-cols-12 gap-5">
                <div className="col-span-4">
                  <p className={`${label} mb-2`}>Image</p>
                  <div onClick={() => productImgRef.current?.click()} className="aspect-square rounded-xl bg-[#161B22] border-2 border-dashed border-white/[0.08] hover:border-[#0072CE]/40 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group transition-colors">
                    {currentEdit.image
                      ? <Image src={currentEdit.image} alt="preview" fill sizes="200px" className="object-cover" unoptimized />
                      : <><ImgIcon size={22} className="text-slate-600 group-hover:text-slate-400 transition-colors mb-1.5" /><p className="text-[11px] text-slate-600 text-center px-3">{productImgUploading ? "Uploading…" : "Click to upload"}</p></>
                    }
                  </div>
                  <input ref={productImgRef} type="file" hidden accept="image/*" onChange={handleProductImageSelect} />
                </div>
                <div className="col-span-8 space-y-4">
                  <div className="space-y-1.5">
                    <label className={label}>Product name</label>
                    <input className={inputCls} placeholder="e.g. Limited Edition Crimper" value={currentEdit.name} onChange={e => setCurrentEdit({ ...currentEdit, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className={label}>Price (£)</label>
                      <input className={inputCls} type="number" step="0.01" min="0" value={currentEdit.price} onChange={e => setCurrentEdit({ ...currentEdit, price: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={label}>Stock</label>
                      <input className={inputCls} type="number" min="0" value={currentEdit.stock} onChange={e => setCurrentEdit({ ...currentEdit, stock: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={label}>Category</label>
                    <select className={inputCls} value={currentEdit.category} onChange={e => setCurrentEdit({ ...currentEdit, category: e.target.value })}>
                      {["Featured", "Tools", "Merchandise", "Digital"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={label}>Description</label>
                    <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Short product description" value={currentEdit.desc} onChange={e => setCurrentEdit({ ...currentEdit, desc: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="sale-toggle" className="rounded accent-[#0072CE]" checked={!!currentEdit.sale_sticker} onChange={e => setCurrentEdit({ ...currentEdit, sale_sticker: e.target.checked })} />
                    <label htmlFor="sale-toggle" className="text-xs text-slate-400 cursor-pointer">Mark as sale</label>
                    {currentEdit.sale_sticker && (
                      <input className={`${inputCls} w-28`} type="number" placeholder="Was £" value={currentEdit.old_price ?? ""} onChange={e => setCurrentEdit({ ...currentEdit, old_price: parseFloat(e.target.value) || undefined })} />
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-white/[0.06] flex justify-end gap-2.5">
                <button onClick={() => setProductModal(false)} className={btnGhost}>Cancel</button>
                <button onClick={saveProduct} disabled={productSaving || productImgUploading || !currentEdit.name.trim()} className={`${btnPrimary} disabled:opacity-40`}>
                  <Save size={13} />{productSaving ? "Saving…" : "Save product"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ENQUIRY DETAIL MODAL ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.15 }} className="w-full max-w-lg bg-[#0D1117] border border-white/[0.08] rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-white">{selectedLead.name}</p>
                  <StatusBadge status={selectedLead.status} />
                </div>
                <button onClick={() => { setSelectedLead(null); setConfirmDeleteLead(null); }} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 transition-colors"><X size={15} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Email", value: selectedLead.email },
                    { label: "Phone", value: selectedLead.phone || "—" },
                    { label: "Enquiry type", value: selectedLead.type },
                    { label: "Date received", value: new Date(selectedLead.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
                  ].map(field => (
                    <div key={field.label} className="space-y-0.5">
                      <p className={label}>{field.label}</p>
                      <p className="text-sm text-white">{field.value}</p>
                    </div>
                  ))}
                </div>
                {selectedLead.message && (
                  <div className="space-y-1.5">
                    <p className={label}>Message</p>
                    <div className="bg-[#161B22] border border-white/[0.06] rounded-lg p-4">
                      <p className="text-sm text-slate-300 leading-relaxed">{selectedLead.message}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-white/[0.06] space-y-3">
                {/* Confirm delete banner */}
                {confirmDeleteLead === selectedLead.id ? (
                  <div className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-xs text-red-400 font-medium">Are you sure? This cannot be undone.</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfirmDeleteLead(null)} className={btnGhost}><X size={13} />Cancel</button>
                      <button onClick={() => deleteEnquiry(selectedLead.id)} className={btnDanger}><Trash2 size={13} />Yes, delete</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`mailto:${selectedLead.email}?subject=Re: Your TPI Enquiry`} className={btnPrimary}><Mail size={13} />Reply by email</a>
                    {selectedLead.phone && <a href={`tel:${selectedLead.phone}`} className={btnGhost}><Phone size={13} />Call</a>}
                    {selectedLead.status !== "Contacted" && <button onClick={() => updateLeadStatus(selectedLead.id, "Contacted")} className={btnGhost}><CheckSquare size={13} />Mark contacted</button>}
                    {selectedLead.status !== "Closed" && <button onClick={() => updateLeadStatus(selectedLead.id, "Closed")} className={btnGhost}><X size={13} />Close</button>}
                    <button onClick={() => setConfirmDeleteLead(selectedLead.id)} className={btnDanger}><Trash2 size={13} />Delete</button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── SERVICE MODAL ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {svcModal && currentSvc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.15 }} className="w-full max-w-lg bg-[#0D1117] border border-white/[0.08] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white">{currentSvc.id === 0 ? "Add service" : "Edit service"}</h2>
                <button onClick={() => setSvcModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 transition-colors"><X size={15} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className={label}>Title</label>
                  <input className={inputCls} placeholder="e.g. Copper Cabling" value={currentSvc.title} onChange={e => setCurrentSvc({ ...currentSvc, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className={label}>Subtitle / Category</label>
                    <input className={inputCls} placeholder="e.g. Cat5e / Cat6" value={currentSvc.sub} onChange={e => setCurrentSvc({ ...currentSvc, sub: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={label}>Badge colour</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={currentSvc.color} onChange={e => setCurrentSvc({ ...currentSvc, color: e.target.value })} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                      <input className={inputCls} value={currentSvc.color} onChange={e => setCurrentSvc({ ...currentSvc, color: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={label}>Description</label>
                  <textarea className={`${inputCls} min-h-[100px] resize-none`} placeholder="Describe this service..." value={currentSvc.description} onChange={e => setCurrentSvc({ ...currentSvc, description: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className={label}>Benefits (one per line)</label>
                  <textarea className={`${inputCls} min-h-[100px] resize-none`} placeholder={"FLUKE DSX tested & certified\nPatch panel termination\nFull handover documentation"} value={(currentSvc.benefits || []).join("\n")} onChange={e => setCurrentSvc({ ...currentSvc, benefits: e.target.value.split("\n").filter(b => b.trim()) })} />
                  <p className="text-[9px] text-slate-600">Each line becomes a bullet point on the service card.</p>
                </div>
                <div className="space-y-1.5">
                  <label className={label}>Card Image</label>
                  <button 
                    onClick={() => { setMediaPickerTarget(`svc-img-${currentSvc.id}`); setMediaPickerOpen(true); }}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-[#161B22] border-2 border-dashed border-white/10 rounded-xl hover:border-[#0072CE]/50 hover:bg-[#0072CE]/5 transition-all group"
                  >
                    <FolderOpen size={18} className="text-slate-500 group-hover:text-[#0072CE]" />
                    <span className="text-sm text-slate-400 group-hover:text-white font-medium">
                      {currentSvc.image ? 'Change image' : 'Select from Media Library'}
                    </span>
                  </button>
                  {currentSvc.image && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden bg-[#161B22] border border-white/[0.06]">
                      <Image src={currentSvc.image} alt="Preview" fill className="object-cover" unoptimized />
                      <button 
                        onClick={() => setCurrentSvc({ ...currentSvc, image: "" })}
                        className="absolute top-2 right-2 p-1 rounded-md bg-black/60 hover:bg-red-500/80 text-white transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className={label}>Sort order</label>
                    <input className={inputCls} type="number" min={0} value={currentSvc.sort_order} onChange={e => setCurrentSvc({ ...currentSvc, sort_order: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={label}>Visibility</label>
                    <button onClick={() => setCurrentSvc({ ...currentSvc, visible: !currentSvc.visible })} className={`${inputCls} flex items-center justify-between cursor-pointer`}>
                      <span>{currentSvc.visible ? "Visible on site" : "Hidden"}</span>
                      {currentSvc.visible ? <Eye size={14} className="text-emerald-400" /> : <EyeOff size={14} className="text-slate-500" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-white/[0.06] flex justify-end gap-2.5">
                <button onClick={() => setSvcModal(false)} className={btnGhost}>Cancel</button>
                <button onClick={saveService} disabled={svcSaving} className={btnPrimary}>
                  {svcSaving ? <><RefreshCw size={13} className="animate-spin" />Saving...</> : <><Save size={13} />Save</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── STAFF MODAL ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {staffModal && editingStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.15 }} className="w-full max-w-md bg-[#0D1117] border border-white/[0.08] rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white">{editingStaff.id === 0 ? "Add staff member" : "Edit staff member"}</h2>
                <button onClick={() => setStaffModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 transition-colors"><X size={15} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5"><label className={label}>Full name</label><input className={inputCls} value={editingStaff.name} onChange={e => setEditingStaff({ ...editingStaff, name: e.target.value })} /></div>
                <div className="space-y-1.5"><label className={label}>Email</label><input className={inputCls} type="email" value={editingStaff.email} onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className={label}>Role</label>
                    <select className={inputCls} value={editingStaff.role} onChange={e => setEditingStaff({ ...editingStaff, role: e.target.value as StaffMember["role"] })}>
                      {["Super Admin", "Fleet Manager", "Content Editor"].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5"><label className={label}>Department</label><input className={inputCls} value={editingStaff.department} onChange={e => setEditingStaff({ ...editingStaff, department: e.target.value })} /></div>
                </div>
                
                {/* Login Credentials */}
                <div className="pt-4 mt-2 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md bg-[#0072CE]/10 flex items-center justify-center">
                      <Eye size={12} className="text-[#0072CE]" />
                    </div>
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">Login Credentials</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className={label}>Username</label>
                      <input className={inputCls} placeholder="e.g. john.smith" value={editingStaff.username || ""} onChange={e => setEditingStaff({ ...editingStaff, username: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={label}>{editingStaff.id === 0 ? "Password" : "New password"}</label>
                      <input className={inputCls} type="password" placeholder={editingStaff.id === 0 ? "Set password" : "Leave blank to keep"} value={editingStaff.password || ""} onChange={e => setEditingStaff({ ...editingStaff, password: e.target.value })} />
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-600 mt-2">These credentials allow this person to log into the admin portal.</p>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-white/[0.06] flex justify-end gap-2.5">
                <button onClick={() => setStaffModal(false)} className={btnGhost}>Cancel</button>
                <button onClick={saveStaff} className={btnPrimary}><Save size={13} />Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MEDIA PICKER MODAL ────────────────────────────────────────────── */}
      <AnimatePresence>
        {mediaPickerOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.15 }} className="w-full max-w-4xl bg-[#0D1117] border border-white/[0.08] rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
                <h2 className="text-sm font-semibold text-white">Select Media</h2>
                <button onClick={() => { setMediaPickerOpen(false); setMediaPickerTarget(null); }} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 transition-colors"><X size={15} /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-grow">
                {mediaFiles.length === 0 ? (
                  <div className="text-center py-20">
                    <FolderOpen size={32} className="mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-500">No media files uploaded yet.</p>
                    <p className="text-xs text-slate-600 mt-2">Upload files in the Media tab first.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {mediaFiles.map(file => (
                      <div
                        key={file.id}
                        onClick={() => selectMediaForCMS(file.url)}
                        className={`${card} overflow-hidden cursor-pointer hover:border-[#0072CE]/50 transition-all group`}
                      >
                        <div className="relative aspect-square bg-[#161B22]">
                          {file.type === "Image"
                            ? <Image src={file.url} alt={file.name} fill sizes="200px" className="object-cover" unoptimized />
                            : <div className="w-full h-full flex flex-col items-center justify-center gap-1.5"><Film size={22} className="text-slate-600" /><span className="text-[10px] text-slate-600">Video</span></div>
                          }
                          <div className="absolute inset-0 bg-[#0072CE]/0 group-hover:bg-[#0072CE]/20 transition-colors flex items-center justify-center">
                            <CheckCircle size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="p-2.5">
                          <p className="text-[11px] font-medium text-white truncate">{file.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── TOAST ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.15 }}
            className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-medium border ${toast.type === "success" ? "bg-[#0D1117] border-emerald-500/20 text-emerald-300" : "bg-[#0D1117] border-red-500/20 text-red-300"}`}>
            {toast.type === "success" ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.12); }
      `}</style>
    </div>
  );
}