import { useState, useEffect, useRef } from "react";
import {
  Home,
  Users,
  Package,
  PartyPopper,
  Star,
  Plus,
  ArrowLeft,
  Phone,
  Send,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  IndianRupee,
  CheckCircle2,
  Truck,
  Image as ImageIcon,
  X,
  Search,
  ChevronRight,
  Bell,
  Camera,
  TrendingUp,
  MapPin,
  Building2,
  MessageSquare,
  History,
} from "lucide-react";

const NAVY = "#152238";
const NAVY_SOFT = "#1F3358";
const BRASS = "#C8973F";
const BRASS_LIGHT = "#E4C078";
const CREAM = "#F6F2E9";
const CORAL = "#D2604A";
const GREEN = "#2FAE60";
const BLUE = "#3B6FA0";

const STAGES = [
  { key: "Created", label: "Order Created", emoji: "🆕" },
  { key: "Started", label: "Started", emoji: "🏭" },
  { key: "Production", label: "Production", emoji: "⚙️" },
  { key: "Completed", label: "Completed", emoji: "✅" },
  { key: "Hallmarking", label: "Hallmarking", emoji: "🏷️" },
  { key: "Ready", label: "Ready for Delivery", emoji: "📦" },
  { key: "Delivered", label: "Delivered", emoji: "🚚" },
];

const STAGE_TEMPLATE_MAP = {
  Started: "order_started",
  Production: "order_started",
  Completed: "order_completed",
  Hallmarking: "order_completed",
  Ready: "ready_for_delivery",
  Delivered: "delivery_update",
};

const CUSTOMER_TYPES = ["Retail", "Wholesale", "Exhibition Lead", "VIP"];

const DEFAULT_TEMPLATES = [
  { id: "exhibition_invitation", emoji: "🎪", label: "Exhibition Invitation", text: "வணக்கம் {name}! எங்கள் Exhibition-க்கு தங்களை அன்புடன் அழைக்கிறோம் 🎪 வந்து பாருங்க!", photo: false },
  { id: "festival_greetings", emoji: "🎉", label: "Festival Greetings + Image", text: "வணக்கம் {name}! இனிய பண்டிகை நல்வாழ்த்துக்கள் 🎉", photo: true },
  { id: "exhibition_thankyou", emoji: "🙏", label: "Exhibition/Stall Visit Thank You", text: "வணக்கம் {name}! எங்கள் Exhibition-க்கு வந்ததற்கு மிக்க நன்றி 🙏", photo: false },
  { id: "order_thankyou", emoji: "💎", label: "Order Thank You", text: "வணக்கம் {name}! உங்கள் Order-க்கு நன்றி 💎 விரைவில் delivery ஆகும்.", photo: false },
  { id: "order_started", emoji: "🏭", label: "Order Started", text: "வணக்கம் {name}! உங்கள் Order {order} Production ஆரம்பமாகிவிட்டது 🏭", photo: false },
  { id: "order_completed", emoji: "✅", label: "Order Completed", text: "வணக்கம் {name}! உங்கள் Order {order} Complete ஆகிவிட்டது ✅", photo: false },
  { id: "ready_for_delivery", emoji: "📦", label: "Ready for Delivery", text: "வணக்கம் {name}! உங்கள் Order {order} Delivery-க்கு Ready ஆகிவிட்டது 📦", photo: false },
  { id: "delivery_update", emoji: "🚚", label: "Delivery Update", text: "வணக்கம் {name}! உங்கள் Order {order} Deliver ஆகிவிட்டது 🚚 நன்றி!", photo: false },
  { id: "review_request", emoji: "⭐", label: "Customer Review Request", text: "வணக்கம் {name}! உங்கள் அனுபவம் எப்படி இருந்தது? சிறிய Review பகிருங்க ⭐", photo: false },
  { id: "repeat_order", emoji: "🔁", label: "Repeat Order / New Order", text: "வணக்கம் {name}! நீங்க கடைசியா Order பண்ணி நாள் ஆகிடுச்சு. New Order ஏதும் வேணுமா? 🔁", photo: false },
  { id: "special_offer", emoji: "🎁", label: "Special Offer / New Collection", text: "வணக்கம் {name}! Special Offer / New Collection வந்திருக்கு 🎁 பாருங்க!", photo: true },
  { id: "followup_reminder", emoji: "📅", label: "Follow-up Reminder", text: "வணக்கம் {name}! Follow-up பண்றோம் 📅 நேரம் இருக்கா?", photo: false },
];

const todayStr = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toTimeString().slice(0, 5);
const daysSince = (dateStr) => {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
const fmtMoney = (n) => "₹" + (Number(n) || 0).toLocaleString("en-IN");
const fmtDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const formatPhone = (raw) => {
  let digits = (raw || "").replace(/[^0-9]/g, "");
  if (digits.length === 10) digits = "91" + digits;
  return digits;
};
const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-3.5 border border-black/5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}1A` }}
        >
          <Icon size={16} color={color} />
        </div>
      </div>
      <p className="text-xl font-bold" style={{ color: NAVY, fontFamily: "'Poppins', sans-serif" }}>
        {value}
      </p>
      <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{label}</p>
    </div>
  );
}

function StageBadge({ stage }) {
  const s = STAGES.find((x) => x.key === stage) || STAGES[0];
  const idx = STAGES.findIndex((x) => x.key === stage);
  const color = idx >= 6 ? GREEN : idx >= 3 ? BLUE : BRASS;
  return (
    <span
      className="text-[11px] font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1"
      style={{ background: `${color}1A`, color }}
    >
      {s.emoji} {s.label}
    </span>
  );
}

function Stars({ value, onChange, size = 20 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange && onChange(n)}
          className={onChange ? "active:scale-90 transition" : ""}
        >
          <Star
            size={size}
            fill={n <= value ? BRASS : "none"}
            color={n <= value ? BRASS : "#D1D5DB"}
          />
        </button>
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 transition bg-white";

export default function BusinessCRM() {
  const [data, setData] = useState({
    customers: [],
    orders: [],
    reviews: [],
    exhibitions: [],
    activityLog: [],
  });
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("dashboard");
  const [detail, setDetail] = useState(null); // {type, id}
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(null); // 'addCustomer' | 'addOrder' | 'addExhibition' | 'addReview'
  const [customerTab, setCustomerTab] = useState("info");
  const [msgTemplateId, setMsgTemplateId] = useState(null);
  const [msgText, setMsgText] = useState("");
  const [msgPhoto, setMsgPhoto] = useState(null);
  const msgFileRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const d = await window.storage.get("crm-data", false);
        if (d && d.value) setData(JSON.parse(d.value));
      } catch (e) {
        /* first run */
      }
      try {
        const t = await window.storage.get("crm-templates", false);
        if (t && t.value) setTemplates(JSON.parse(t.value));
      } catch (e) {
        /* first run */
      }
      setLoading(false);
    })();
  }, []);

  const flashToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const persistAll = async (next) => {
    try {
      await window.storage.set("crm-data", JSON.stringify(next), false);
    } catch (e) {
      flashToast("Save ஆகல, திரும்ப முயற்சி பண்ணுங்க");
    }
  };

  const updateData = (updater) => {
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      persistAll(next);
      return next;
    });
  };

  const persistTemplates = async (list) => {
    setTemplates(list);
    try {
      await window.storage.set("crm-templates", JSON.stringify(list), false);
    } catch (e) {
      /* best effort */
    }
  };

  const logActivity = (customerId, label) => ({
    id: uid(),
    customerId,
    date: new Date().toISOString(),
    label,
  });

  // ---------- derived ----------
  const custOrders = (customerId) => data.orders.filter((o) => o.customerId === customerId);
  const custTotalBusiness = (customerId) =>
    custOrders(customerId).reduce((s, o) => s + (Number(o.value) || 0), 0);
  const custLastOrderDate = (customerId) => {
    const os = custOrders(customerId);
    if (!os.length) return null;
    return os.reduce((a, b) => (a.createdDate > b.createdDate ? a : b)).createdDate;
  };

  const filteredCustomers = data.customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.mobile || "").includes(search) ||
      (c.company || "").toLowerCase().includes(search.toLowerCase())
  );

  // ---------- actions ----------
  const addCustomer = (form) => {
    const c = { id: uid(), lastContactedDate: "", nextFollowUp: "", ...form };
    updateData((prev) => ({
      ...prev,
      customers: [...prev.customers, c],
      activityLog: [...prev.activityLog, logActivity(c.id, `Customer சேர்க்கப்பட்டார்`)],
    }));
    setModal(null);
    flashToast("Customer சேர்க்கப்பட்டார் ✓");
  };

  const editCustomer = (id, patch) => {
    updateData((prev) => ({
      ...prev,
      customers: prev.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  };

  const deleteCustomer = (id) => {
    updateData((prev) => ({
      ...prev,
      customers: prev.customers.filter((c) => c.id !== id),
    }));
    setDetail(null);
    flashToast("Customer நீக்கப்பட்டார்");
  };

  const addOrder = (form) => {
    const o = {
      id: uid(),
      createdDate: todayStr(),
      stage: "Created",
      history: [{ stage: "Created", date: todayStr(), time: nowTime(), notes: "" }],
      ...form,
    };
    updateData((prev) => ({
      ...prev,
      orders: [...prev.orders, o],
      activityLog: [...prev.activityLog, logActivity(o.customerId, `Order Created — ${o.item || ""}`)],
    }));
    setModal(null);
    flashToast("Order சேர்க்கப்பட்டது ✓");
  };

  const advanceOrderStage = (orderId, stage, notes) => {
    const order = data.orders.find((o) => o.id === orderId);
    if (!order) return;
    const entry = { stage, date: todayStr(), time: nowTime(), notes: notes || "" };
    updateData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId ? { ...o, stage, history: [...o.history, entry] } : o
      ),
      activityLog: [
        ...prev.activityLog,
        logActivity(order.customerId, `Order Stage: ${stage}`),
      ],
    }));
    flashToast(`Stage: ${stage} ✓`);
  };

  const addReview = (form) => {
    const r = { id: uid(), date: todayStr(), ...form };
    updateData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, r],
      activityLog: [
        ...prev.activityLog,
        logActivity(r.customerId, `Review Received ⭐${r.rating}`),
      ],
    }));
    setModal(null);
    flashToast("Review சேமிக்கப்பட்டது ✓");
  };

  const addExhibition = (form) => {
    const e = { id: uid(), customerIds: [], invited: {}, visited: {}, ...form };
    updateData((prev) => ({ ...prev, exhibitions: [...prev.exhibitions, e] }));
    setModal(null);
    flashToast("Exhibition சேர்க்கப்பட்டது ✓");
  };

  const toggleExhibitionCustomer = (exId, custId) => {
    updateData((prev) => ({
      ...prev,
      exhibitions: prev.exhibitions.map((e) => {
        if (e.id !== exId) return e;
        const has = e.customerIds.includes(custId);
        return {
          ...e,
          customerIds: has ? e.customerIds.filter((x) => x !== custId) : [...e.customerIds, custId],
        };
      }),
    }));
  };

  const markInvited = (exId, custId) => {
    updateData((prev) => ({
      ...prev,
      exhibitions: prev.exhibitions.map((e) =>
        e.id === exId ? { ...e, invited: { ...e.invited, [custId]: todayStr() } } : e
      ),
      activityLog: [...prev.activityLog, logActivity(custId, "Exhibition Invite Sent 🎪")],
    }));
  };

  const markVisited = (exId, custId, visited) => {
    updateData((prev) => ({
      ...prev,
      exhibitions: prev.exhibitions.map((e) =>
        e.id === exId ? { ...e, visited: { ...e.visited, [custId]: visited } } : e
      ),
      activityLog: visited
        ? [...prev.activityLog, logActivity(custId, "Visited Stall 🎪")]
        : prev.activityLog,
    }));
  };

  // ---------- messaging ----------
  const openMessageCenter = (customer, presetTemplateId) => {
    setDetail({ type: "customer", id: customer.id });
    setCustomerTab("messages");
    const tId = presetTemplateId || templates[0]?.id;
    selectTemplate(customer, tId);
  };

  const fillTemplate = (customer, text) => {
    const lastOrder = custOrders(customer.id).slice(-1)[0];
    return text
      .replace(/{name}/g, customer.name)
      .replace(/{order}/g, lastOrder ? lastOrder.item || "" : "")
      .replace(/{business}/g, fmtMoney(custTotalBusiness(customer.id)));
  };

  const selectTemplate = (customer, templateId) => {
    setMsgTemplateId(templateId);
    setMsgPhoto(null);
    const t = templates.find((x) => x.id === templateId);
    if (t) setMsgText(fillTemplate(customer, t.text));
  };

  const handleMsgPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setMsgPhoto({ dataUrl: ev.target.result, file });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const sendMessage = async (customer) => {
    if (msgPhoto && navigator.share) {
      try {
        if (navigator.canShare && navigator.canShare({ files: [msgPhoto.file] })) {
          await navigator.share({ files: [msgPhoto.file], text: msgText });
          finalizeSend(customer);
          return;
        }
      } catch (e) {
        /* fall through to wa.me */
      }
    }
    const url = `https://wa.me/${formatPhone(customer.mobile)}?text=${encodeURIComponent(msgText)}`;
    window.open(url, "_blank");
    if (msgPhoto) flashToast("WhatsApp திறந்தது — புகைப்படத்தை manual attach பண்ணுங்க");
    finalizeSend(customer);
  };

  const finalizeSend = (customer) => {
    const t = templates.find((x) => x.id === msgTemplateId);
    editCustomer(customer.id, { lastContactedDate: todayStr() });
    updateData((prev) => ({
      ...prev,
      activityLog: [
        ...prev.activityLog,
        logActivity(customer.id, `Message Sent: ${t ? t.emoji + " " + t.label : "Custom"}`),
      ],
    }));
    flashToast("Message அனுப்பப்பட்டது ✓");
  };

  // ---------- dashboard derived ----------
  const stats = {
    totalCustomers: data.customers.length,
    newCustomers: data.customers.filter((c) => {
      const created = parseInt(c.id, 36);
      return Date.now() - created < 7 * 24 * 60 * 60 * 1000;
    }).length,
    activeOrders: data.orders.filter((o) => o.stage !== "Delivered").length,
    completedOrders: data.orders.filter((o) =>
      ["Completed", "Hallmarking", "Ready", "Delivered"].includes(o.stage)
    ).length,
    pendingDeliveries: data.orders.filter((o) => o.stage === "Ready" || o.stage === "Hallmarking").length,
    orderValue: data.orders.reduce((s, o) => s + (Number(o.value) || 0), 0),
    reviews: data.reviews.length,
    repeatCustomers: data.customers.filter((c) => custOrders(c.id).length > 1).length,
  };

  const todaysFollowUps = data.customers.filter((c) => c.nextFollowUp === todayStr());
  const ordersDueToday = data.orders.filter((o) => o.expectedDate === todayStr());
  const customersToContact = data.customers.filter((c) => {
    const d = daysSince(c.lastContactedDate);
    return d !== null && d >= 60;
  });
  const upcomingExhibitions = data.exhibitions
    .filter((e) => e.date >= todayStr())
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 3);

  const fontTamil = { fontFamily: "'Noto Sans Tamil', 'Inter', sans-serif" };
  const fontDisplay = { fontFamily: "'Poppins', 'Noto Sans Tamil', sans-serif" };

  // ==================== RENDER ====================

  const Header = ({ title, subtitle, onBack, right }) => (
    <div
      className="px-5 pt-7 pb-6 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_SOFT} 100%)` }}
    >
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10" style={{ background: BRASS }} />
      <div className="relative flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="text-white active:scale-90 transition">
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-white truncate" style={fontDisplay}>
            {title}
          </h1>
          {subtitle && <p className="text-xs" style={{ color: BRASS_LIGHT }}>{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );

  const NavBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 flex items-center justify-around py-2 z-40">
      {[
        { key: "dashboard", icon: Home, label: "Home" },
        { key: "customers", icon: Users, label: "Customers" },
        { key: "orders", icon: Package, label: "Orders" },
        { key: "exhibitions", icon: PartyPopper, label: "Expo" },
        { key: "reviews", icon: Star, label: "Reviews" },
      ].map((t) => (
        <button
          key={t.key}
          onClick={() => {
            setTab(t.key);
            setDetail(null);
          }}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition"
          style={{ color: tab === t.key && !detail ? NAVY : "#9CA3AF" }}
        >
          <t.icon size={20} fill={tab === t.key && !detail ? `${NAVY}` : "none"} strokeWidth={2} />
          <span className="text-[10px] font-medium">{t.label}</span>
        </button>
      ))}
    </div>
  );

  const Toast = () =>
    toast && (
      <div
        className="fixed bottom-20 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full text-sm text-white shadow-lg z-50"
        style={{ background: NAVY }}
      >
        {toast}
      </div>
    );

  // -------- Dashboard --------
  const DashboardView = () => (
    <div>
      <Header title={`${greeting()} 👋`} subtitle="Business Overview" />
      <div className="px-4 -mt-3 pb-4 space-y-4 max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard label="Total Customers" value={stats.totalCustomers} icon={Users} color={NAVY} />
          <StatCard label="New Customers" value={stats.newCustomers} icon={TrendingUp} color={GREEN} />
          <StatCard label="Active Orders" value={stats.activeOrders} icon={Package} color={BLUE} />
          <StatCard label="Completed Orders" value={stats.completedOrders} icon={CheckCircle2} color={GREEN} />
          <StatCard label="Pending Deliveries" value={stats.pendingDeliveries} icon={Truck} color={CORAL} />
          <StatCard label="Order Value" value={fmtMoney(stats.orderValue)} icon={IndianRupee} color={BRASS} />
          <StatCard label="Reviews" value={stats.reviews} icon={Star} color={BRASS} />
          <StatCard label="Repeat Customers" value={stats.repeatCustomers} icon={TrendingUp} color={BLUE} />
        </div>

        <Section title="Today's Follow-ups" icon={Bell}>
          {todaysFollowUps.length === 0 ? (
            <EmptyLine text="இன்று follow-up ஒன்றும் இல்ல" />
          ) : (
            todaysFollowUps.map((c) => <MiniCustomerRow key={c.id} c={c} />)
          )}
        </Section>

        <Section title="Orders Due Today" icon={Package}>
          {ordersDueToday.length === 0 ? (
            <EmptyLine text="இன்று delivery due ஆகல" />
          ) : (
            ordersDueToday.map((o) => {
              const c = data.customers.find((x) => x.id === o.customerId);
              return (
                <div
                  key={o.id}
                  onClick={() => setDetail({ type: "order", id: o.id })}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: NAVY }}>{c?.name || "—"}</p>
                    <p className="text-xs text-gray-400">{o.item}</p>
                  </div>
                  <StageBadge stage={o.stage} />
                </div>
              );
            })
          )}
        </Section>

        <Section title="Customers to Contact (60+ days)" icon={Phone}>
          {customersToContact.length === 0 ? (
            <EmptyLine text="எல்லாரும் recent-ஆ contact ஆகி இருக்காங்க" />
          ) : (
            customersToContact.map((c) => <MiniCustomerRow key={c.id} c={c} extra={`${daysSince(c.lastContactedDate)} நாள்`} />)
          )}
        </Section>

        <Section title="Upcoming Exhibitions" icon={PartyPopper}>
          {upcomingExhibitions.length === 0 ? (
            <EmptyLine text="Upcoming exhibition இல்ல" />
          ) : (
            upcomingExhibitions.map((e) => (
              <div
                key={e.id}
                onClick={() => setDetail({ type: "exhibition", id: e.id })}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: NAVY }}>{e.name}</p>
                  <p className="text-xs text-gray-400">{e.venue}</p>
                </div>
                <span className="text-xs font-medium" style={{ color: BRASS }}>{fmtDate(e.date)}</span>
              </div>
            ))
          )}
        </Section>
      </div>
    </div>
  );

  const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: NAVY }}>
        <Icon size={15} /> {title}
      </h3>
      {children}
    </div>
  );

  const EmptyLine = ({ text }) => <p className="text-xs text-gray-400 py-1.5">{text}</p>;

  const MiniCustomerRow = ({ c, extra }) => (
    <div
      onClick={() => setDetail({ type: "customer", id: c.id })}
      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer"
    >
      <div>
        <p className="text-sm font-medium" style={{ color: NAVY }}>{c.name}</p>
        <p className="text-xs text-gray-400">{c.company || c.mobile}</p>
      </div>
      {extra && <span className="text-xs" style={{ color: CORAL }}>{extra}</span>}
    </div>
  );

  // -------- Customers list --------
  const CustomersView = () => (
    <div>
      <Header
        title="Customers"
        subtitle={`${data.customers.length} total`}
        right={
          <button onClick={() => setModal("addCustomer")} className="text-white active:scale-90 transition">
            <Plus size={22} />
          </button>
        }
      />
      <div className="px-4 -mt-3 pb-4 space-y-3 max-w-lg mx-auto">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="பெயர் / நம்பர் / Company தேடு..."
            className={inputCls + " pl-10"}
          />
        </div>
        {loading && <p className="text-center text-sm text-gray-400 py-6">Loading...</p>}
        {!loading && filteredCustomers.length === 0 && (
          <div className="text-center py-10">
            <Users size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">Customer இல்ல. மேலே + click பண்ணி சேருங்க.</p>
          </div>
        )}
        {filteredCustomers
          .slice()
          .reverse()
          .map((c) => (
            <div
              key={c.id}
              onClick={() => {
                setDetail({ type: "customer", id: c.id });
                setCustomerTab("info");
              }}
              className="bg-white rounded-2xl shadow-sm border border-black/5 p-3.5 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                style={{ background: NAVY_SOFT }}
              >
                {c.name.trim().charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: NAVY }}>{c.name}</p>
                <p className="text-xs text-gray-500 truncate">{c.company || c.mobile}</p>
                <div className="flex gap-1.5 mt-1">
                  {c.type && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${BRASS}1A`, color: BRASS }}>
                      {c.type}
                    </span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${BLUE}1A`, color: BLUE }}>
                    {custOrders(c.id).length} orders
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
            </div>
          ))}
      </div>
    </div>
  );

  // -------- Customer detail --------
  const CustomerDetail = ({ id }) => {
    const c = data.customers.find((x) => x.id === id);
    const [editForm, setEditForm] = useState(c || {});
    useEffect(() => setEditForm(c || {}), [id]);
    if (!c) return null;
    const orders = custOrders(id);
    const timeline = data.activityLog
      .filter((a) => a.customerId === id)
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    return (
      <div>
        <Header title={c.name} subtitle={c.company || c.mobile} onBack={() => setDetail(null)} />
        <div className="px-4 -mt-3 pb-4 max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-1.5 flex gap-1 mb-3">
            {["info", "messages", "orders", "timeline"].map((t) => (
              <button
                key={t}
                onClick={() => setCustomerTab(t)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition"
                style={{
                  background: customerTab === t ? NAVY : "transparent",
                  color: customerTab === t ? "white" : "#6B7280",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {customerTab === "info" && (
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 space-y-2.5">
              <Field label="பெயர்">
                <input className={inputCls} value={editForm.name || ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </Field>
              <Field label="Mobile">
                <input className={inputCls} value={editForm.mobile || ""} onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })} />
              </Field>
              <Field label="Company / Shop">
                <input className={inputCls} value={editForm.company || ""} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} />
              </Field>
              <Field label="City">
                <input className={inputCls} value={editForm.city || ""} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
              </Field>
              <Field label="Customer Type">
                <select className={inputCls} value={editForm.type || ""} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}>
                  <option value="">தேர்வு செய்யுங்க</option>
                  {CUSTOMER_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="Notes">
                <textarea className={inputCls} rows={2} value={editForm.notes || ""} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
              </Field>
              <Field label="Next Follow-up Date">
                <input type="date" className={inputCls} value={editForm.nextFollowUp || ""} onChange={(e) => setEditForm({ ...editForm, nextFollowUp: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded-xl p-2.5 text-center" style={{ background: `${BLUE}0D` }}>
                  <p className="text-xs text-gray-500">Total Orders</p>
                  <p className="text-base font-bold" style={{ color: BLUE }}>{orders.length}</p>
                </div>
                <div className="rounded-xl p-2.5 text-center" style={{ background: `${BRASS}0D` }}>
                  <p className="text-xs text-gray-500">Total Business</p>
                  <p className="text-base font-bold" style={{ color: BRASS }}>{fmtMoney(custTotalBusiness(id))}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Last Contacted: {c.lastContactedDate ? fmtDate(c.lastContactedDate) : "—"}</p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    editCustomer(id, editForm);
                    flashToast("Update ஆனது ✓");
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-1.5"
                  style={{ background: NAVY }}
                >
                  <Pencil size={14} /> Save
                </button>
                <button
                  onClick={() => deleteCustomer(id)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5"
                  style={{ background: `${CORAL}1A`, color: CORAL }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}

          {customerTab === "messages" && <MessageCenter customer={c} />}

          {customerTab === "orders" && (
            <div className="space-y-2.5">
              <button
                onClick={() => setModal({ type: "addOrder", customerId: id })}
                className="w-full py-2.5 rounded-xl border-2 border-dashed text-sm font-medium flex items-center justify-center gap-2"
                style={{ borderColor: BRASS_LIGHT, color: NAVY }}
              >
                <Plus size={16} /> Order சேர்
              </button>
              {orders.length === 0 && <EmptyLine text="Order இல்ல" />}
              {orders.slice().reverse().map((o) => (
                <div
                  key={o.id}
                  onClick={() => setDetail({ type: "order", id: o.id })}
                  className="bg-white rounded-2xl shadow-sm border border-black/5 p-3.5 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: NAVY }}>{o.item || "Order"}</p>
                    <p className="text-xs text-gray-400">{fmtDate(o.createdDate)} • {fmtMoney(o.value)}</p>
                  </div>
                  <StageBadge stage={o.stage} />
                </div>
              ))}
            </div>
          )}

          {customerTab === "timeline" && (
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4">
              {timeline.length === 0 && <EmptyLine text="Activity இல்ல" />}
              <div className="space-y-3">
                {timeline.map((a, i) => (
                  <div key={a.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: BRASS }} />
                      {i < timeline.length - 1 && <div className="w-px flex-1 bg-gray-200" />}
                    </div>
                    <div className="pb-3">
                      <p className="text-sm" style={{ color: NAVY }}>{a.label}</p>
                      <p className="text-xs text-gray-400">{fmtDate(a.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MessageCenter = ({ customer }) => {
    const t = templates.find((x) => x.id === msgTemplateId) || templates[0];
    useEffect(() => {
      if (!msgTemplateId) selectTemplate(customer, templates[0]?.id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-3">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5"><MessageSquare size={13} /> Template தேர்வு பண்ணுங்க</p>
          <div className="grid grid-cols-2 gap-1.5">
            {templates.map((tp) => (
              <button
                key={tp.id}
                onClick={() => selectTemplate(customer, tp.id)}
                className="text-left px-2.5 py-2 rounded-xl text-xs font-medium border transition"
                style={{
                  borderColor: msgTemplateId === tp.id ? BRASS : "#E5E7EB",
                  background: msgTemplateId === tp.id ? `${BRASS}14` : "white",
                  color: msgTemplateId === tp.id ? NAVY : "#4B5563",
                }}
              >
                {tp.emoji} {tp.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-3.5">
          <p className="text-xs text-gray-500 mb-1.5">Message Preview (edit பண்ணலாம்)</p>
          <textarea
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            rows={4}
            className={inputCls}
          />
          {t?.photo && (
            <div className="mt-2.5">
              <input ref={msgFileRef} type="file" accept="image/*" className="hidden" onChange={handleMsgPhoto} />
              <button
                onClick={() => msgFileRef.current?.click()}
                className="w-full py-2 rounded-xl border-2 border-dashed text-xs font-medium flex items-center justify-center gap-2"
                style={{ borderColor: BRASS_LIGHT, color: NAVY }}
              >
                <Camera size={14} /> {msgPhoto ? "Photo தேர்ந்தெடுக்கப்பட்டது ✓" : "Photo சேர் (optional)"}
              </button>
              {msgPhoto && (
                <img src={msgPhoto.dataUrl} alt="" className="mt-2 w-16 h-16 rounded-lg object-cover" />
              )}
            </div>
          )}
          <button
            onClick={() => sendMessage(customer)}
            className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition"
            style={{ background: GREEN }}
          >
            <Send size={15} /> WhatsApp-ல் அனுப்பு
          </button>
        </div>
      </div>
    );
  };

  // -------- Orders --------
  const OrdersView = () => {
    const [filter, setFilter] = useState("All");
    const list = data.orders.filter((o) => filter === "All" || o.stage === filter);
    return (
      <div>
        <Header
          title="Orders"
          subtitle={`${data.orders.length} total`}
          right={
            <button onClick={() => setModal({ type: "addOrder" })} className="text-white active:scale-90 transition">
              <Plus size={22} />
            </button>
          }
        />
        <div className="px-4 -mt-3 pb-4 space-y-3 max-w-lg mx-auto">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["All", ...STAGES.map((s) => s.key)].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0"
                style={{
                  background: filter === f ? NAVY : "white",
                  color: filter === f ? "white" : "#6B7280",
                  border: filter === f ? "none" : "1px solid #E5E7EB",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          {list.length === 0 && <EmptyLine text="Order இல்ல" />}
          {list.slice().reverse().map((o) => {
            const c = data.customers.find((x) => x.id === o.customerId);
            return (
              <div
                key={o.id}
                onClick={() => setDetail({ type: "order", id: o.id })}
                className="bg-white rounded-2xl shadow-sm border border-black/5 p-3.5 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold" style={{ color: NAVY }}>{c?.name || "—"}</p>
                  <StageBadge stage={o.stage} />
                </div>
                <p className="text-xs text-gray-500">{o.item}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-xs text-gray-400">{fmtDate(o.createdDate)}</p>
                  <p className="text-sm font-semibold" style={{ color: BRASS }}>{fmtMoney(o.value)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const OrderDetail = ({ id }) => {
    const o = data.orders.find((x) => x.id === id);
    const [notes, setNotes] = useState("");
    if (!o) return null;
    const c = data.customers.find((x) => x.id === o.customerId);
    const currentIdx = STAGES.findIndex((s) => s.key === o.stage);
    return (
      <div>
        <Header title={o.item || "Order"} subtitle={c?.name} onBack={() => setDetail(null)} />
        <div className="px-4 -mt-3 pb-4 space-y-3 max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">Order Value</p>
              <p className="text-lg font-bold" style={{ color: BRASS }}>{fmtMoney(o.value)}</p>
            </div>
            <div className="space-y-0">
              {STAGES.map((s, i) => (
                <div key={s.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{
                        background: i <= currentIdx ? GREEN : "#F3F4F6",
                        color: i <= currentIdx ? "white" : "#9CA3AF",
                      }}
                    >
                      {i <= currentIdx ? <CheckCircle2 size={14} /> : s.emoji}
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className="w-px flex-1 min-h-[20px]" style={{ background: i < currentIdx ? GREEN : "#E5E7EB" }} />
                    )}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium" style={{ color: i <= currentIdx ? NAVY : "#9CA3AF" }}>{s.label}</p>
                      {i === currentIdx + 1 && (
                        <button
                          onClick={() => {
                            advanceOrderStage(o.id, s.key, notes);
                            setNotes("");
                          }}
                          className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                          style={{ background: NAVY }}
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                    {o.history.find((h) => h.stage === s.key) && (
                      <p className="text-xs text-gray-400">
                        {fmtDate(o.history.find((h) => h.stage === s.key).date)} • {o.history.find((h) => h.stage === s.key).time}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {currentIdx < STAGES.length - 1 && (
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes (optional)"
                className={inputCls}
              />
            )}
          </div>

          {c && STAGE_TEMPLATE_MAP[o.stage] && (
            <button
              onClick={() => openMessageCenter(c, STAGE_TEMPLATE_MAP[o.stage])}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: GREEN }}
            >
              <Send size={15} /> Customer-க்கு Update அனுப்பு
            </button>
          )}

          {o.history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4">
              <p className="text-sm font-semibold mb-2 flex items-center gap-1.5" style={{ color: NAVY }}>
                <History size={14} /> History
              </p>
              {o.history.slice().reverse().map((h, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs" style={{ color: NAVY }}>{h.stage}</span>
                  <span className="text-xs text-gray-400">{fmtDate(h.date)} {h.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // -------- Exhibitions --------
  const ExhibitionsView = () => (
    <div>
      <Header
        title="Exhibitions"
        subtitle={`${data.exhibitions.length} campaigns`}
        right={
          <button onClick={() => setModal("addExhibition")} className="text-white active:scale-90 transition">
            <Plus size={22} />
          </button>
        }
      />
      <div className="px-4 -mt-3 pb-4 space-y-2.5 max-w-lg mx-auto">
        {data.exhibitions.length === 0 && (
          <div className="text-center py-10">
            <PartyPopper size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">Exhibition இல்ல. + click பண்ணி சேருங்க.</p>
          </div>
        )}
        {data.exhibitions.slice().reverse().map((e) => (
          <div
            key={e.id}
            onClick={() => setDetail({ type: "exhibition", id: e.id })}
            className="bg-white rounded-2xl shadow-sm border border-black/5 p-3.5 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: NAVY }}>{e.name}</p>
              <span className="text-xs font-medium" style={{ color: BRASS }}>{fmtDate(e.date)}</span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={11} /> {e.venue}</p>
            <p className="text-xs text-gray-400 mt-1.5">{e.customerIds.length} customers • {Object.keys(e.visited || {}).filter((k) => e.visited[k]).length} visited</p>
          </div>
        ))}
      </div>
    </div>
  );

  const ExhibitionDetail = ({ id }) => {
    const e = data.exhibitions.find((x) => x.id === id);
    const [showPicker, setShowPicker] = useState(false);
    if (!e) return null;
    const invitedCustomers = data.customers.filter((c) => e.customerIds.includes(c.id));
    return (
      <div>
        <Header title={e.name} subtitle={`${fmtDate(e.date)} • ${e.venue}`} onBack={() => setDetail(null)} />
        <div className="px-4 -mt-3 pb-4 space-y-3 max-w-lg mx-auto">
          <button
            onClick={() => setShowPicker((s) => !s)}
            className="w-full py-2.5 rounded-xl border-2 border-dashed text-sm font-medium flex items-center justify-center gap-2"
            style={{ borderColor: BRASS_LIGHT, color: NAVY }}
          >
            <Plus size={16} /> Customer சேர் / நீக்கு
          </button>
          {showPicker && (
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-3 max-h-56 overflow-y-auto space-y-1">
              {data.customers.map((c) => (
                <label key={c.id} className="flex items-center gap-2 py-1.5">
                  <input
                    type="checkbox"
                    checked={e.customerIds.includes(c.id)}
                    onChange={() => toggleExhibitionCustomer(e.id, c.id)}
                  />
                  <span className="text-sm" style={{ color: NAVY }}>{c.name}</span>
                </label>
              ))}
              {data.customers.length === 0 && <EmptyLine text="முதலில் Customers தேவை" />}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4">
            <p className="text-sm font-semibold mb-2" style={{ color: NAVY }}>Invite List ({invitedCustomers.length})</p>
            {invitedCustomers.length === 0 && <EmptyLine text="Customer சேர்க்கல" />}
            <div className="space-y-2">
              {invitedCustomers.map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b border-gray-50 last:border-0 py-2">
                  <div>
                    <p className="text-sm font-medium" style={{ color: NAVY }}>{c.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {e.invited?.[c.id] ? `Invited ${fmtDate(e.invited[c.id])}` : "Invite ஆகல"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-[11px] text-gray-500">
                      <input type="checkbox" checked={!!e.visited?.[c.id]} onChange={(ev) => markVisited(e.id, c.id, ev.target.checked)} />
                      Visited
                    </label>
                    <button
                      onClick={() => {
                        markInvited(e.id, c.id);
                        openMessageCenter(c, "exhibition_invitation");
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: `${GREEN}1A` }}
                    >
                      <Send size={13} color={GREEN} />
                    </button>
                    {e.visited?.[c.id] && (
                      <button
                        onClick={() => openMessageCenter(c, "exhibition_thankyou")}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: `${BRASS}1A` }}
                      >
                        🙏
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // -------- Reviews --------
  const ReviewsView = () => {
    const avg = data.reviews.length
      ? (data.reviews.reduce((s, r) => s + r.rating, 0) / data.reviews.length).toFixed(1)
      : "-";
    return (
      <div>
        <Header
          title="Customer Reviews"
          subtitle={`Average ${avg} ⭐ • ${data.reviews.length} reviews`}
          right={
            <button onClick={() => setModal("addReview")} className="text-white active:scale-90 transition">
              <Plus size={22} />
            </button>
          }
        />
        <div className="px-4 -mt-3 pb-4 space-y-2.5 max-w-lg mx-auto">
          {data.reviews.length === 0 && (
            <div className="text-center py-10">
              <Star size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-400">Review இல்ல இன்னும்.</p>
            </div>
          )}
          {data.reviews.slice().reverse().map((r) => {
            const c = data.customers.find((x) => x.id === r.customerId);
            return (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-black/5 p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold" style={{ color: NAVY }}>{c?.name || "—"}</p>
                  <Stars value={r.rating} size={14} />
                </div>
                {r.text && <p className="text-sm text-gray-600 mt-1">{r.text}</p>}
                {r.photoDataUrl && <img src={r.photoDataUrl} alt="" className="w-16 h-16 rounded-lg object-cover mt-2" />}
                <p className="text-xs text-gray-400 mt-1.5">{fmtDate(r.date)}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // -------- Modals --------
  const AddCustomerModal = () => {
    const [form, setForm] = useState({ name: "", mobile: "", company: "", city: "", type: "", notes: "" });
    return (
      <ModalShell title="புதிய Customer" onClose={() => setModal(null)}>
        <Field label="பெயர்"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Mobile"><input className={inputCls} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} /></Field>
        <Field label="Company / Shop"><input className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></Field>
        <Field label="City"><input className={inputCls} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
        <Field label="Type">
          <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="">தேர்வு செய்யுங்க</option>
            {CUSTOMER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Notes"><textarea className={inputCls} rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
        <button
          onClick={() => {
            if (!form.name.trim() || !form.mobile.trim()) { flashToast("பெயர் & Mobile தேவை"); return; }
            addCustomer(form);
          }}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: NAVY }}
        >
          Save Customer
        </button>
      </ModalShell>
    );
  };

  const AddOrderModal = ({ presetCustomerId }) => {
    const [form, setForm] = useState({ customerId: presetCustomerId || "", item: "", value: "", expectedDate: "" });
    return (
      <ModalShell title="புதிய Order" onClose={() => setModal(null)}>
        <Field label="Customer">
          <select className={inputCls} value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
            <option value="">தேர்வு செய்யுங்க</option>
            {data.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Item / Description"><input className={inputCls} value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} /></Field>
        <Field label="Value (₹)"><input type="number" className={inputCls} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></Field>
        <Field label="Expected Delivery Date"><input type="date" className={inputCls} value={form.expectedDate} onChange={(e) => setForm({ ...form, expectedDate: e.target.value })} /></Field>
        <button
          onClick={() => {
            if (!form.customerId || !form.item.trim()) { flashToast("Customer & Item தேவை"); return; }
            addOrder(form);
          }}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: NAVY }}
        >
          Save Order
        </button>
      </ModalShell>
    );
  };

  const AddExhibitionModal = () => {
    const [form, setForm] = useState({ name: "", date: todayStr(), venue: "" });
    return (
      <ModalShell title="புதிய Exhibition" onClose={() => setModal(null)}>
        <Field label="Exhibition Name"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Date"><input type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
        <Field label="Venue"><input className={inputCls} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></Field>
        <button
          onClick={() => {
            if (!form.name.trim()) { flashToast("Name தேவை"); return; }
            addExhibition(form);
          }}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: NAVY }}
        >
          Save Exhibition
        </button>
      </ModalShell>
    );
  };

  const AddReviewModal = () => {
    const [form, setForm] = useState({ customerId: "", rating: 5, text: "", photoDataUrl: null });
    const fileRef = useRef(null);
    return (
      <ModalShell title="Review சேர்" onClose={() => setModal(null)}>
        <Field label="Customer">
          <select className={inputCls} value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
            <option value="">தேர்வு செய்யுங்க</option>
            {data.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Rating"><Stars value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} /></Field>
        <Field label="Review Text"><textarea className={inputCls} rows={3} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></Field>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(ev) => {
            const file = ev.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e2) => setForm((f) => ({ ...f, photoDataUrl: e2.target.result }));
            reader.readAsDataURL(file);
          }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full py-2 rounded-xl border-2 border-dashed text-xs font-medium flex items-center justify-center gap-2"
          style={{ borderColor: BRASS_LIGHT, color: NAVY }}
        >
          <ImageIcon size={14} /> {form.photoDataUrl ? "Photo தேர்ந்தெடுக்கப்பட்டது ✓" : "Photo (optional)"}
        </button>
        <button
          onClick={() => {
            if (!form.customerId) { flashToast("Customer தேவை"); return; }
            addReview(form);
          }}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: NAVY }}
        >
          Save Review
        </button>
      </ModalShell>
    );
  };

  const ModalShell = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-lg p-5 max-h-[85vh] overflow-y-auto space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold" style={{ color: NAVY, fontFamily: "'Poppins', sans-serif" }}>{title}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        {children}
      </div>
    </div>
  );

  // -------- main switch --------
  let content;
  if (detail?.type === "customer") content = <CustomerDetail id={detail.id} />;
  else if (detail?.type === "order") content = <OrderDetail id={detail.id} />;
  else if (detail?.type === "exhibition") content = <ExhibitionDetail id={detail.id} />;
  else if (tab === "dashboard") content = <DashboardView />;
  else if (tab === "customers") content = <CustomersView />;
  else if (tab === "orders") content = <OrdersView />;
  else if (tab === "exhibitions") content = <ExhibitionsView />;
  else content = <ReviewsView />;

  return (
    <div className="min-h-screen w-full pb-16" style={{ background: CREAM, ...fontTamil }}>
      {content}
      <NavBar />
      <Toast />
      {modal === "addCustomer" && <AddCustomerModal />}
      {modal === "addExhibition" && <AddExhibitionModal />}
      {modal === "addReview" && <AddReviewModal />}
      {modal && typeof modal === "object" && modal.type === "addOrder" && (
        <AddOrderModal presetCustomerId={modal.customerId} />
      )}
    </div>
  );
}
