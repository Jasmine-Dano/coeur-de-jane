// Firebase for the shop page: loads dresses, photos, settings and booked dates, and saves bookings.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, doc, query, where, writeBatch, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg = window.FIREBASE_CONFIG;
const SIZES = ["XS", "XS-S", "S", "M", "L", "XL"];
const CATS = ["On hand", "Wedding Gown", "Collections"];
const fixCat = c => c === "Wedding Dress" ? "Wedding Gown" : (CATS.includes(c) ? c : "On hand");
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
  desc: String(v.desc || "").slice(0, 2000),
  sizeGuide: String(v.sizeGuide || "").slice(0, 3000),
  category: fixCat(v.category),
  img: ""
});

if (cfg && cfg.apiKey) {
  const db = getFirestore(initializeApp(cfg));

  // Dates already taken for one dress, as ["2026-11-25", ...]
  window.CDJ_BLOCKED = async dressId => {
    const snap = await getDocs(query(collection(db, "blocked"), where("dressId", "==", String(dressId))));
    return snap.docs.map(d => d.data().date).filter(Boolean);
  };

  // Extra photos for one dress (shown as thumbnails under the main photo), in the admin's order
  window.CDJ_GALLERY = async dressId => {
    const snap = await getDocs(query(collection(db, "gallery"), where("dressId", "==", String(dressId))));
    return snap.docs.map(d => d.data())
      .filter(v => typeof v.data === "string" && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(v.data))
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)).map(v => v.data);
  };

  // Saves a booking (and its GCash screenshot, and for a rental, the booked date) in one go.
  // A second booking for the same dress and date is refused by the database rules.
  window.CDJ_SUBMIT = async (booking, paymentData) => {
    const ref = doc(collection(db, "bookings"));
    if (booking.type === "rental") {
      const b = await getDoc(doc(db, "blocked", booking.rental.dressId + "_" + booking.rental.usageDate));
      if (b.exists()) { const e = new Error("taken"); e.code = "taken"; throw e; }
    }
    const batch = writeBatch(db);
    batch.set(ref, { ...booking, hasPayment: !!paymentData, status: "Pending", createdAt: serverTimestamp() });
    if (booking.type === "rental") {
      batch.set(doc(db, "blocked", booking.rental.dressId + "_" + booking.rental.usageDate),
        { dressId: booking.rental.dressId, date: booking.rental.usageDate, bookingId: ref.id });
    }
    if (paymentData) batch.set(doc(db, "payments", ref.id), { data: paymentData, createdAt: serverTimestamp() });
    try { await batch.commit(); }
    catch (err) {
      if (booking.type === "rental" && String(err.code || "").includes("permission")) { const e = new Error("taken"); e.code = "taken"; throw e; }
      throw err;
    }
    return ref.id;
  };

  const timer = setTimeout(() => window.CDJ && window.CDJ_LOADING && window.CDJ.fail(), 10000);
  getDoc(doc(db, "settings", "shop")).then(s => { if (s.exists() && window.CDJ) window.CDJ.settings(s.data()); }).catch(() => {});
  try {
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
