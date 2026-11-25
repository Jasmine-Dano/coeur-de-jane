// Cœur de Jane — owner admin (Firebase Auth + Firestore)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc, writeBatch, query, orderBy, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = id => document.getElementById(id);
const show = (id, on = true) => { $(id).hidden = !on; };
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const SIZES = ["XS", "XS-S", "S", "M", "L", "XL"];
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const cfg = window.FIREBASE_CONFIG;

if (!cfg || !cfg.apiKey) { show("setupView"); throw new Error("Firebase config missing"); }

const app = initializeApp(cfg);
const auth = getAuth(app);
const db = getFirestore(app);

const CATS = ["On hand", "Wedding Gown", "Collections"];
const catOf = d => d.category === "Wedding Dress" ? "Wedding Gown" : (CATS.includes(d.category) ? d.category : "On hand");
let dresses = [], photos = {}, editing = null, newPhoto = null, aCat = "All", bookings = [], bkTab = "Pending";
const STATUSES = ["Pending", "Confirmed", "Returned", "Cancelled"];

const errText = e => {
  const c = e && e.code || "";
  if (c.includes("permission-denied")) return "This login isn't allowed to change the shop. Check that its email is in the Firestore rules.";
  if (c.includes("invalid-credential") || c.includes("wrong-password") || c.includes("user-not-found") || c.includes("invalid-email")) return "Wrong email or password.";
  if (c.includes("too-many-requests")) return "Too many tries. Please wait a few minutes and try again.";
  if (c.includes("network")) return "No internet connection. Please try again.";
  return "Something went wrong: " + (e && e.message || e);
};
const flash = (msg, bad = false) => { const f = $("flash"); f.textContent = msg; f.className = "flash" + (bad ? " bad" : ""); f.hidden = false; clearTimeout(f._t); f._t = setTimeout(() => f.hidden = true, 5000); };

/* ---------- auth ---------- */
onAuthStateChanged(auth, user => {
  show("loginView", !user); show("appView", !!user);
  if (user) load();
});
$("loginForm").addEventListener("submit", async e => {
  e.preventDefault(); show("loginErr", false); show("loginMsg", false);
  $("loginBtn").disabled = true; $("loginBtn").textContent = "Logging in…";
  try { await signInWithEmailAndPassword(auth, $("email").value.trim(), $("password").value); }
  catch (err) { $("loginErr").textContent = errText(err); show("loginErr"); }
  $("loginBtn").disabled = false; $("loginBtn").textContent = "Log in";
});
$("forgot").addEventListener("click", async () => {
  show("loginErr", false); show("loginMsg", false);
  const em = $("email").value.trim();
  if (!em) { $("loginErr").textContent = "Type your email first, then tap “Forgot password?”."; show("loginErr"); return; }
  try { await sendPasswordResetEmail(auth, em); $("loginMsg").textContent = "If that email has an admin login, a reset link is on its way. Check your inbox and spam."; show("loginMsg"); }
  catch (err) { $("loginErr").textContent = errText(err); show("loginErr"); }
});
$("logout").addEventListener("click", () => signOut(auth));

/* ---------- data ---------- */
async function load() {
  try {
    const [ds, ps] = await Promise.all([getDocs(collection(db, "dresses")), getDocs(collection(db, "photos"))]);
    dresses = ds.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0));
    const old = dresses.filter(d => d.category === "Wedding Dress");
    if (old.length) { const bt = writeBatch(db); old.forEach(d => { d.category = "Wedding Gown"; bt.update(doc(db, "dresses", d.id), { category: "Wedding Gown" }); }); bt.commit().catch(() => {}); }
    photos = {}; ps.forEach(p => { if (typeof p.data().data === "string") photos[p.id] = p.data().data; });
    renderList();
  } catch (err) { flash(errText(err), true); }
  loadBookings();
}

function renderList() {
  show("listView"); show("editView", false); show("bookView", false); show("setView", false);
  show("empty", dresses.length === 0); show("table", dresses.length > 0);
  const feat = dresses.filter(d => d.featured && !d.hidden).length;
  $("sum").textContent = `${dresses.length} dresses · ☆ marks “Most rented” on the homepage (${feat}/3) · hidden ones don't show in the shop`;
  $("aCats").innerHTML = ["All", ...CATS].map(k => `<button class="cat" data-acat="${k}" aria-pressed="${k === aCat}">${k === "All" ? "All" : k}<span>${k === "All" ? dresses.length : dresses.filter(d => catOf(d) === k).length}</span></button>`).join("");
  show("aCats", dresses.length > 0);
  $("rows").innerHTML = dresses.map((d, i) => (aCat !== "All" && catOf(d) !== aCat) ? "" : `<tr>
    <td>${photos[d.id] ? `<img class="thumb" src="${esc(photos[d.id])}" alt="">` : `<div class="thumb"></div>`}</td>
    <td><b class="serif" style="font-size:20px;font-weight:500">${esc(d.name)}</b> <span class="pill">${esc(catOf(d))}</span>${d.featured ? ' <span class="pill" style="border-color:var(--stone);color:var(--ink)">★ Most rented</span>' : ""}${d.hidden ? ' <span class="pill">Hidden</span>' : ""}${photos[d.id] ? "" : ' <span class="pill">No photo</span>'}</td>
    <td>${esc((d.sizes || []).join(" | "))}${d.color ? " · " + esc(d.color) : ""} · ₱${Number(d.price || 0).toLocaleString("en-PH")}</td>
    <td style="white-space:nowrap"><button class="ib" data-up="${i}" aria-label="Move up">↑</button><button class="ib" data-down="${i}" aria-label="Move down">↓</button></td>
    <td style="white-space:nowrap"><button class="btn sm" data-edit="${esc(d.id)}">Edit</button>
      <button class="btn line sm" data-feat="${esc(d.id)}" title="Most rented on homepage">${d.featured ? "★" : "☆"}</button>
      <button class="btn line sm" data-hide="${esc(d.id)}">${d.hidden ? "Show" : "Hide"}</button></td></tr>`).join("");
}

$("rows").addEventListener("click", async e => {
  const b = e.target.closest("button"); if (!b) return;
  try {
    if (b.dataset.edit) return openEdit(dresses.find(d => d.id === b.dataset.edit));
    if (b.dataset.feat) {
      const d = dresses.find(x => x.id === b.dataset.feat); b.disabled = true;
      await updateDoc(doc(db, "dresses", d.id), { featured: !d.featured }); d.featured = !d.featured;
      const n = dresses.filter(x => x.featured && !x.hidden).length;
      renderList(); flash(n > 3 ? `Updated. Only the first 3 “Most rented” dresses show on the homepage (${n} are marked).` : "Updated.");
    }
    if (b.dataset.hide) {
      const d = dresses.find(x => x.id === b.dataset.hide); b.disabled = true;
      await updateDoc(doc(db, "dresses", d.id), { hidden: !d.hidden }); d.hidden = !d.hidden; renderList(); flash(d.hidden ? `“${d.name}” is hidden from the shop.` : `“${d.name}” is back in the shop.`);
    }
    const i = b.dataset.up ?? b.dataset.down;
    if (i !== undefined) {
      const a = +i, c = b.dataset.up !== undefined ? a - 1 : a + 1;
      if (!dresses[c]) return;
      [dresses[a], dresses[c]] = [dresses[c], dresses[a]];
      const batch = writeBatch(db);
      dresses.forEach((d, n) => { if (d.order !== n + 1) { d.order = n + 1; batch.update(doc(db, "dresses", d.id), { order: n + 1 }); } });
      await batch.commit(); renderList();
    }
  } catch (err) { flash(errText(err), true); load(); }
});

$("aCats").addEventListener("click", e => { const b = e.target.closest("[data-acat]"); if (b) { aCat = b.dataset.acat; renderList(); } });

$("seedBtn").addEventListener("click", async () => {
  $("seedBtn").disabled = true;
  try {
    const batch = writeBatch(db);
    for (const d of window.DRESSES || []) batch.set(doc(db, "dresses", d.id), { name: d.name, color: d.color, sizes: d.sizes, price: d.price, order: d.order, hidden: false, featured: false, category: d.category === "Wedding Dress" ? "Wedding Gown" : (d.category || "On hand"), note: d.note || "", desc: d.desc || "", sizeGuide: d.sizeGuide || "" });
    await batch.commit(); flash("The starter dresses are now in the shop."); load();
  } catch (err) { flash(errText(err), true); $("seedBtn").disabled = false; }
});

/* ---------- edit ---------- */
$("fSizes").innerHTML = SIZES.map(s => `<label><input type="checkbox" value="${s}"> ${s === "XS-S" ? "XS–Small" : s}</label>`).join("");
const openEdit = d => {
  editing = d ? { ...d } : { id: "d" + Date.now().toString(36), name: "", color: "", price: 450, sizes: ["S", "M"], hidden: false, featured: false, category: aCat !== "All" ? aCat : "On hand", order: Math.max(0, ...dresses.map(x => x.order || 0)) + 1, _new: true };
  newPhoto = null; $("photo").value = ""; $("rmPhoto").checked = false; show("editErr", false);
  $("editTitle").innerHTML = editing._new ? "Add a <em>dress</em>" : `Edit <em>${esc(editing.name)}</em>`;
  $("fName").value = editing.name; $("fColor").value = editing.color || ""; $("fPrice").value = editing.price ?? 450;
  for (const c of $("fSizes").querySelectorAll("input")) c.checked = (editing.sizes || []).includes(c.value);
  $("fCat").value = catOf(editing); $("fNote").value = editing.note || ""; $("fDesc").value = editing.desc || ""; $("fGuide").value = editing.sizeGuide || ""; $("fFeat").checked = !!editing.featured; $("fHidden").checked = !!editing.hidden;
  $("prev").src = photos[editing.id] || BLANK; show("rmWrap", !!photos[editing.id]);
  $("saveBtn").textContent = editing._new ? "Add dress" : "Save changes"; show("delWrap", !editing._new);
  show("listView", false); show("bookView", false); show("setView", false); show("editView"); scrollTo(0, 0); loadBlk();
};
$("addBtn").addEventListener("click", () => openEdit(null));
$("navAdd").addEventListener("click", () => openEdit(null));
$("navList").addEventListener("click", () => { editing = null; renderList(); });
$("back").addEventListener("click", () => renderList());
$("cancel").addEventListener("click", () => renderList());

// Shrink a photo so it fits in Firestore (max ~1 MB per document)
const shrink = file => new Promise((res, rej) => {
  const img = new Image(), url = URL.createObjectURL(file);
  img.onload = () => {
    URL.revokeObjectURL(url);
    let w = 900, q = 0.78, out;
    do {
      const s = Math.min(1, w / img.width, (w * 4 / 3) / img.height);
      const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      out = c.toDataURL("image/jpeg", q); w -= 120; q -= 0.06;
    } while (out.length > 700000 && w > 400);
    res(out);
  };
  img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("That file isn't a photo we can read.")); };
  img.src = url;
});
$("photo").addEventListener("change", async e => {
  const f = e.target.files[0]; if (!f) return;
  try { newPhoto = await shrink(f); $("prev").src = newPhoto; $("rmPhoto").checked = false; }
  catch (err) { newPhoto = null; $("editErr").textContent = err.message; show("editErr"); }
});

$("editForm").addEventListener("submit", async e => {
  e.preventDefault(); show("editErr", false);
  const name = $("fName").value.trim(), sizes = [...$("fSizes").querySelectorAll("input:checked")].map(c => c.value);
  if (!name) { $("editErr").textContent = "Please enter a dress name."; return show("editErr"); }
  if (!sizes.length) { $("editErr").textContent = "Please tick at least one size."; return show("editErr"); }
  const data = { name, color: $("fColor").value.trim(), price: Math.max(0, parseInt($("fPrice").value) || 0), sizes, featured: $("fFeat").checked, hidden: $("fHidden").checked, category: CATS.includes($("fCat").value) ? $("fCat").value : "On hand", note: $("fNote").value.trim().slice(0, 80), desc: $("fDesc").value.trim().slice(0, 2000), sizeGuide: $("fGuide").value.trim().slice(0, 3000), order: editing.order || 0 };
  $("saveBtn").disabled = true; $("saveBtn").textContent = "Saving…";
  try {
    if (newPhoto) await setDoc(doc(db, "photos", editing.id), { data: newPhoto });
    else if ($("rmPhoto").checked) await deleteDoc(doc(db, "photos", editing.id));
    await setDoc(doc(db, "dresses", editing.id), data);
    flash(editing._new ? `“${name}” was added to the shop.` : `“${name}” was saved.`);
    editing = null; await load();
  } catch (err) { $("editErr").textContent = errText(err); show("editErr"); }
  $("saveBtn").disabled = false; $("saveBtn").textContent = "Save";
});

$("delBtn").addEventListener("click", async () => {
  const b = $("delBtn");
  if (b.dataset.sure !== "1") { b.dataset.sure = "1"; b.textContent = "Tap again to delete for good"; return; }
  try {
    await deleteDoc(doc(db, "dresses", editing.id)); await deleteDoc(doc(db, "photos", editing.id));
    flash(`“${editing.name}” was deleted.`); editing = null; b.dataset.sure = ""; b.textContent = "Delete this dress"; load();
  } catch (err) { $("editErr").textContent = errText(err); show("editErr"); }
});

/* ---------- booked dates (per dress) ---------- */
const fmtD = s => { if (!s) return ""; const [y, m, d] = String(s).split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }); };
async function loadBlk() {
  show("blkWrap", !!editing && !editing._new); if (!editing || editing._new) return;
  const id = editing.id; $("blkList").innerHTML = `<span class="tiny" style="border:0;background:none">Loading…</span>`;
  try {
    const snap = await getDocs(query(collection(db, "blocked"), where("dressId", "==", id)));
    if (!editing || editing.id !== id) return;
    const today = new Date().toISOString().slice(0, 10);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(b => b.date >= today).sort((a, b) => a.date.localeCompare(b.date));
    $("blkList").innerHTML = list.length ? list.map(b => `<span>${esc(fmtD(b.date))}${b.bookingId === "manual" ? " (you)" : ""}<button type="button" data-unblk="${esc(b.id)}" title="Free this date" aria-label="Free ${esc(fmtD(b.date))}">×</button></span>`).join("") : `<span class="tiny" style="border:0;background:none">No upcoming booked dates.</span>`;
  } catch (err) { $("blkList").textContent = errText(err); }
}
$("blkAdd").addEventListener("click", async () => {
  const date = $("blkDate").value; if (!date || !editing) return;
  try {
    const r = doc(db, "blocked", editing.id + "_" + date);
    if ((await getDoc(r)).exists()) { flash("That date is already booked."); return; }
    await setDoc(r, { dressId: editing.id, date, bookingId: "manual" }); $("blkDate").value = ""; flash(`${fmtD(date)} is now blocked for ${editing.name}.`); loadBlk();
  } catch (err) { flash(errText(err), true); }
});
$("blkList").addEventListener("click", async e => {
  const b = e.target.closest("[data-unblk]"); if (!b) return;
  if (b.dataset.sure !== "1") { b.dataset.sure = "1"; b.textContent = "free?"; return; }
  try { await deleteDoc(doc(db, "blocked", b.dataset.unblk)); flash("Date freed. Customers can book it again."); loadBlk(); }
  catch (err) { flash(errText(err), true); }
});

/* ---------- settings ---------- */
async function openSettings() {
  show("listView", false); show("editView", false); show("bookView", false); show("setView");
  try {
    const s = await getDoc(doc(db, "settings", "shop")); const v = s.exists() ? s.data() : {};
    $("sGcash").value = v.gcashNumber || ""; $("sGname").value = v.gcashName || ""; $("sNote").value = v.paymentNote || ""; $("sFee").value = v.fittingFee ?? 200;
  } catch (err) { flash(errText(err), true); }
}
$("navSet").addEventListener("click", openSettings);
$("setForm").addEventListener("submit", async e => {
  e.preventDefault(); const b = $("setSave"); b.disabled = true;
  try {
    await setDoc(doc(db, "settings", "shop"), { gcashNumber: $("sGcash").value.trim().slice(0, 30), gcashName: $("sGname").value.trim().slice(0, 80), paymentNote: $("sNote").value.trim().slice(0, 200), fittingFee: Math.max(0, parseInt($("sFee").value) || 0) });
    flash("Settings saved. The shop shows them now.");
  } catch (err) { flash(errText(err), true); }
  b.disabled = false;
});

/* ---------- bookings ---------- */
const fmtWhen = v => { const d = new Date(v); return isNaN(d) ? String(v || "") : d.toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" }); };
const dayOf = v => String(v || "").slice(0, 10);
async function loadBookings() {
  try {
    const snap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
    bookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) { bookings = []; if (!$("bookView").hidden) flash(errText(err), true); }
  const n = bookings.filter(b => b.status === "Pending").length;
  $("pendN").textContent = n; show("pendN", n > 0);
  if (!$("bookView").hidden) renderBookings();
}
const line = (k, v) => v ? `<div class="it"><span class="tiny">${k}</span><b>${esc(v)}</b></div>` : "";
function bookingBody(b) {
  if (b.type === "rental" && b.rental) {
    const r = b.rental;
    return line("Rental", `${r.dressName} · ${r.size} · ₱${Number(r.price || 0).toLocaleString("en-PH")}`) + line("Usage date", fmtD(r.usageDate));
  }
  if (b.type === "fitting" && b.fitting) {
    const f = b.fitting;
    return line("Fitting", `${f.count || (f.dresses || []).length} dresses · ₱${Number(b.total || 0).toLocaleString("en-PH")}`) + line("Dresses", (f.dresses || []).join(", ")) + line("Usage date", fmtD(f.usageDate)) + line("Fitting date", fmtD(f.fittingDate));
  }
  // older requests (before the booking form)
  const active = bookings.filter(o => o.status === "Pending" || o.status === "Confirmed");
  return (b.items || []).map(it => `<div class="it"><b>${esc(it.name)} · ${esc(it.size)} · ₱${Number(it.price || 0).toLocaleString("en-PH")}</b><span>${esc(fmtWhen(it.when))} — ${esc(it.where)}</span>${(b.status === "Pending" || b.status === "Confirmed") && active.some(o => o.id !== b.id && (o.items || []).some(x => x.dressId === it.dressId && dayOf(x.when) === dayOf(it.when))) ? `<span class="warn">⚠ Another booking has this dress on the same day.</span>` : ""}</div>`).join("");
}
function renderBookings() {
  show("listView", false); show("editView", false); show("setView", false); show("bookView");
  $("bkTabs").innerHTML = [...STATUSES, "All"].map(k => `<button class="cat" data-bk="${k}" aria-pressed="${k === bkTab}">${k}<span>${k === "All" ? bookings.length : bookings.filter(b => b.status === k).length}</span></button>`).join("");
  const list = bookings.filter(b => bkTab === "All" || b.status === bkTab);
  $("bkList").innerHTML = list.length ? list.map(b => `<article class="bk">
    <header><b>${esc(b.name)}</b><span><span class="pill">${b.type === "fitting" ? "Fitting" : "Rental"}</span> <span class="st ${esc(b.status)}">${esc(b.status)}</span></span></header>
    <div class="tiny">Ref ${esc(b.ref)} · sent ${b.createdAt && b.createdAt.toDate ? esc(b.createdAt.toDate().toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })) : ""}</div>
    ${bookingBody(b)}
    ${line("Contact number", b.contact)}${line("Complete address", b.address)}${line("Courier", b.courier)}
    <div class="it"><span class="tiny">GCash payment</span>${b.hasPayment ? `<span><button class="btn line sm" data-pay="${esc(b.id)}">View screenshot</button></span><div id="pay-${esc(b.id)}"></div>` : `<b>No screenshot</b>`}</div>
    <div class="acts"><label class="tiny">Status <select data-st="${esc(b.id)}">${STATUSES.map(s => `<option ${s === b.status ? "selected" : ""}>${s}</option>`).join("")}</select></label>
      <button class="btn line sm danger" data-bdel="${esc(b.id)}">Delete</button></div>
  </article>`).join("") : `<p class="tiny">No ${bkTab === "All" ? "" : bkTab.toLowerCase() + " "}booking requests.</p>`;
}
// free or re-take a rental's date when its status changes
async function syncBlock(b, status) {
  if (b.type !== "rental" || !b.rental) return "";
  const r = doc(db, "blocked", b.rental.dressId + "_" + b.rental.usageDate);
  const cur = await getDoc(r);
  if (status === "Cancelled") { if (cur.exists() && cur.data().bookingId === b.id) await deleteDoc(r); return " The date is free again."; }
  if (status === "Pending" || status === "Confirmed") {
    if (!cur.exists()) { await setDoc(r, { dressId: b.rental.dressId, date: b.rental.usageDate, bookingId: b.id }); return ""; }
    if (cur.data().bookingId !== b.id) return " ⚠ Careful: that date is already taken by another booking.";
  }
  return "";
}
$("navBook").addEventListener("click", () => { renderBookings(); loadBookings(); });
$("bkRefresh").addEventListener("click", () => loadBookings());
$("bkTabs").addEventListener("click", e => { const b = e.target.closest("[data-bk]"); if (b) { bkTab = b.dataset.bk; renderBookings(); } });
$("bkList").addEventListener("change", async e => {
  const sel = e.target.closest("[data-st]"); if (!sel) return;
  const b = bookings.find(x => x.id === sel.dataset.st);
  try { await updateDoc(doc(db, "bookings", b.id), { status: sel.value }); const extra = await syncBlock(b, sel.value); b.status = sel.value; flash(`Marked as ${sel.value}.${extra}`, extra.includes("⚠")); loadBookings(); }
  catch (err) { flash(errText(err), true); }
});
$("bkList").addEventListener("click", async e => {
  const pv = e.target.closest("[data-pay]");
  if (pv) {
    const box = $("pay-" + pv.dataset.pay); pv.disabled = true;
    try { const p = await getDoc(doc(db, "payments", pv.dataset.pay)); const v = p.exists() ? p.data().data : "";
      box.innerHTML = /^data:image\/(jpeg|png|webp);base64,/.test(v) ? `<img class="payimg" src="${esc(v)}" alt="GCash payment screenshot">` : `<span class="tiny">Screenshot not found.</span>`; }
    catch (err) { box.textContent = errText(err); }
    return;
  }
  const b = e.target.closest("[data-bdel]"); if (!b) return;
  if (b.dataset.sure !== "1") { b.dataset.sure = "1"; b.textContent = "Tap again to delete"; return; }
  const bk = bookings.find(x => x.id === b.dataset.bdel);
  try { await syncBlock(bk, "Cancelled"); await deleteDoc(doc(db, "payments", bk.id)); await deleteDoc(doc(db, "bookings", bk.id)); flash("Booking deleted. Its date is free again."); loadBookings(); }
  catch (err) { flash(errText(err), true); }
});
