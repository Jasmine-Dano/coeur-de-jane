// Loads dresses (and their photos) from Firebase for the shop page.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg = window.FIREBASE_CONFIG;
const SIZES = ["XS", "XS-S", "S", "M", "L", "XL"];
const clean = (id, v) => ({
  id,
  name: String(v.name || "").slice(0, 120),
  color: String(v.color || "").slice(0, 80),
  price: Number(v.price) || 0,
  sizes: Array.isArray(v.sizes) ? v.sizes.filter(s => SIZES.includes(s)) : [],
  order: Number(v.order) || 0,
  hidden: !!v.hidden,
  featured: !!v.featured,
  note: String(v.note || "").slice(0, 80),
  sizeGuide: String(v.sizeGuide || "").slice(0, 3000),
  category: ["On hand", "Wedding Dress", "Collections"].includes(v.category) ? v.category : "On hand",
  img: ""
});

if (cfg && cfg.apiKey) {
  const timer = setTimeout(() => window.CDJ && window.CDJ_LOADING && window.CDJ.fail(), 10000);
  try {
    const db = getFirestore(initializeApp(cfg));
    const snap = await getDocs(collection(db, "dresses"));
    clearTimeout(timer);
    if (snap.empty) { window.CDJ.fail(); }
    else {
      const list = snap.docs.map(d => clean(d.id, d.data())).filter(d => !d.hidden).sort((a, b) => a.order - b.order);
      window.CDJ.set(list);
      const ph = await getDocs(collection(db, "photos"));
      const map = {};
      ph.forEach(p => { const v = p.data().data; if (typeof v === "string" && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v)) map[p.id] = v; });
      window.CDJ.photos(map);
    }
  } catch (e) {
    clearTimeout(timer);
    console.error("Couldn't load dresses from Firebase:", e);
    window.CDJ.fail();
  }
}
