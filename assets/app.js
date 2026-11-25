(()=>{
const IG="https://www.instagram.com/coeur_dejane",DM="https://ig.me/m/coeur_dejane";
const BUILTIN=window.CDJ_LOADING?[]:(Array.isArray(window.DRESSES)?window.DRESSES:[]);
const SIZE_ALL=["XS","XS-S","S","M","L","XL"],SNAME={XS:"Extra small","XS-S":"XS–Small",S:"Small",M:"Medium",L:"Large",XL:"Extra large"};
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const peso=n=>"₱"+Number(n||0).toLocaleString("en-PH");
const tone=c=>{c=(c||"").toLowerCase();
 if(c.includes("/"))return c.split("/").map(x=>tone(x)[0]);
 const m=[["baby pink","#f1c6cc"],["light pink","#f3d2d4"],["pink","#efc2c8"],["yellow","#efd47c"],["blue","#a8bfdc"],["off white","#efe7da"],["beige white","#ece1d0"],["silk","#f1e8da"],["beige","#dcc4a3"],["white","#f8f5f0"],["floral","#efe2d5"]];
 const f=m.find(([k])=>c.includes(k));return [f?f[1]:"#e3d2bf"]};
const shape=["M70 118 Q40 196 20 238 Q100 252 180 238 Q160 196 130 118Z","M74 118 Q58 182 50 238 Q100 248 150 238 Q142 182 126 118Z","M72 118 Q50 150 42 182 Q100 196 158 182 Q150 150 128 118Z","M76 112 Q72 176 68 238 Q100 244 132 238 Q128 176 124 112Z"];
let uid=0;
const dressArt=(d,i=0)=>{const t=tone(d.color||(/^Wedding/.test(d.category||"")?"White":"")),c=t[0],c2=t[1]||t[0],k=i%4,g="g"+(++uid);
 const floral=/floral/i.test(d.color)?Array.from({length:22},(_,j)=>`<circle cx="${60+((j*37)%80)}" cy="${128+((j*53)%104)}" r="${2+j%3}" fill="${["#c98f86","#9fb08d","#d9a7a0"][j%3]}" opacity=".75"/>`).join(""):"";
 const straps=k===3||k===2?`<path d="M82 64 L86 40 M118 64 L114 40" stroke="${c}" stroke-width="2.5"/>`:k===1?`<path d="M76 68 Q60 56 58 84 Q68 88 78 82Z M124 68 Q140 56 142 84 Q132 88 122 82Z" fill="${c}"/>`:"";
 return `<svg viewBox="0 0 200 266" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(d.name)} illustration"><defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#5a3a22" stop-opacity=".28"/></linearGradient><clipPath id="c${g}"><path d="${shape[k]}"/></clipPath></defs>
 <rect width="200" height="266" fill="var(--latte)"/><ellipse cx="100" cy="246" rx="70" ry="8" fill="var(--sand)"/>
 <path d="M100 14v22" stroke="var(--mute)" stroke-width="1.2"/><path d="M84 40 Q100 30 116 40" fill="none" stroke="var(--mute)" stroke-width="1.6"/>
 ${straps}<path d="M78 60 Q100 72 122 60 L126 118 Q100 126 74 118Z" fill="${c}"/>
 <path d="${shape[k]}" fill="${c2}"/><g clip-path="url(#c${g})">${floral}<rect width="200" height="266" fill="url(#${g})"/></g>
 <path d="M78 60 Q100 72 122 60 L126 118 Q100 126 74 118Z" fill="url(#${g})"/>
 <path d="M74 118 Q100 126 126 118" stroke="#fff" stroke-opacity=".6" fill="none" stroke-width="1.5"/></svg>`};
const photo=(d,i)=>d.img?`<img src="${esc(d.img)}" alt="${esc(d.name)} in ${esc(d.color)}" loading="lazy">`:dressArt(d,i);

const CATS=["On hand","Wedding Gown","Collections"];const catOf=d=>d.category==="Wedding Dress"?"Wedding Gown":(CATS.includes(d.category)?d.category:"On hand");
let dresses=BUILTIN.slice(),sizeF="All",catF="All",q="",cur=null;
const visible=()=>dresses.filter(d=>!d.hidden).sort((a,b)=>(a.order||0)-(b.order||0));

const renderHero=()=>{const box=$("heroPick");if(!box||window.CDJ_LOADING)return;
 const v=visible();let pick=v.filter(d=>d.featured).slice(0,3);const most=pick.length>0;
 if(pick.length<3)pick=pick.concat(v.filter(d=>!pick.includes(d)).slice(0,3-pick.length));
 const order=pick.length===3?[pick[1],pick[0],pick[2]]:pick;
 $("heroTag").textContent=most?"Most rented":"Featured dresses";
 box.innerHTML=order.map((d,i)=>`<button class="arch${order.length===3&&i===1?" mid":""}" data-open="${esc(d.id)}" aria-label="View ${esc(d.name)}"><span class="aph">${photo(d,dresses.indexOf(d))}</span><span class="cap"><b>${esc(d.name)}</b><small>${peso(d.price)}</small></span></button>`).join("");
};

const sizeGuide=d=>{const g=String(d.sizeGuide||"").trim();if(!g)return"";const rows=g.split(/\n+/).map(l=>l.split("|").map(x=>x.trim())).filter(r=>r.some(Boolean));
 const head=["Height","Weight","Bust","Waist","Notes"];
 const body=rows.map(r=>r.length<2?`<p>${esc(r[0])}</p>`:`<div class="sgi"><b>${esc(r[0])}</b><dl>${r.slice(1).map((c,i)=>`<div><dt>${head[i]||""}</dt><dd>${esc(c).replace(/\s*\(([^()]*)\)\s*$/,"<small>$1</small>")}</dd></div>`).join("")}</dl></div>`).join("");
 return `<details class="sg" open><summary>Size guide</summary>${body}<p class="tiny">Actual fit may vary depending on the dress design, fabric, and body proportions.</p></details>`};
const renderCats=()=>{const c=$("cats");if(!c)return;c.innerHTML=["All",...CATS].map(k=>{const n=k==="All"?visible().length:visible().filter(d=>catOf(d)===k).length;return `<button class="cat" data-c="${k}" aria-pressed="${k===catF}">${k==="All"?"All dresses":k}<span>${n}</span></button>`}).join("")};
const renderSizes=()=>{$("sizes").innerHTML=["All","XS","S","M","L"].map(s=>`<button class="chip" data-s="${s}" aria-pressed="${s===sizeF}">${s==="All"?"All sizes":s}</button>`).join("")};
const renderGrid=()=>{
 const list=visible().filter(d=>(catF==="All"||catOf(d)===catF)&&(sizeF==="All"||d.sizes.some(z=>z===sizeF||z.split("-").includes(sizeF)))&&(!q||(d.name+" "+d.color+" "+catOf(d)).toLowerCase().includes(q)));
 if(window.CDJ_LOADING){$("grid").innerHTML=`<p class="none">Loading dresses…</p>`;$("countLine").textContent="";return}
 renderCats();$("countLine").textContent=`${visible().length} dresses`;const dc=$("dressCount");if(dc)dc.textContent=visible().length;
 $("grid").innerHTML=list.length?list.map((d,i)=>`<div class="card"><button class="ph" data-open="${esc(d.id)}" aria-label="View ${esc(d.name)}" style="border:0;padding:0">${photo(d,dresses.indexOf(d))}</button>
  <div class="tags"><span class="ctag">${esc(catOf(d))}</span>${d.featured?`<span class="hot">Most rented</span>`:""}${d.note?`<span class="hot">${esc(d.note)}</span>`:""}</div><h3>${esc(d.name)}</h3><div class="meta"><span>${[d.color,d.sizes.map(z=>z==="XS-S"?"XS–S":z).join(" | ")].filter(Boolean).map(esc).join(" · ")}</span><b>${peso(d.price)}</b></div>
  <button class="rent" data-open="${esc(d.id)}">Rent</button></div>`).join(""):(q||sizeF!=="All")?`<p class="none">No dresses match your search. Try another name, color or size.</p>`:`<div class="none soon"><b>${catF==="All"?"No dresses yet":esc(catF)+" — coming soon"}</b><span>New pieces are added here by the shop. Message us on <a href="https://ig.me/m/coeur_dejane" target="_blank" rel="noopener">Instagram</a> to ask what's available.</span></div>`;
 $("photoNote").textContent=visible().some(d=>!d.img)?"Dresses without a photo yet show an illustration in their color.":"";
};
const openOv=(id,o=true)=>{$(id).classList.toggle("open",o);document.body.style.overflow=o?"hidden":""};

/* ---------- shop settings (GCash etc., editable by the admin) ---------- */
let settings={gcashNumber:"",gcashName:"",paymentNote:"",fittingFee:200};
const applySettings=()=>{for(const el of document.querySelectorAll("[data-fee]"))el.textContent=peso(settings.fittingFee)};

/* ---------- helpers ---------- */
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today0=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const fmtDate=s=>{if(!s)return"";const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d).toLocaleDateString("en-PH",{month:"long",day:"numeric",year:"numeric"})};
const newRef=()=>"CDJ-"+Math.random().toString(36).slice(2,7).toUpperCase();
let cust={name:"",phone:"",address:"",courier:"Lalamove"};
try{Object.assign(cust,JSON.parse(localStorage.getItem("cdj-cust2")||"{}"))}catch(e){}
const saveCust=()=>{try{localStorage.setItem("cdj-cust2",JSON.stringify(cust))}catch(e){}};
const toast=t=>{const e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),2800)};
const X=`<button class="ib x" data-close aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M5 5l14 14M19 5L5 19"/></svg></button>`;

// shrink a payment screenshot so it fits in the database
const shrink=file=>new Promise((res,rej)=>{const img=new Image(),url=URL.createObjectURL(file);
 img.onload=()=>{URL.revokeObjectURL(url);let w=1100,qq=.8,out;do{const s=Math.min(1,w/img.width,(w*2)/img.height);const c=document.createElement("canvas");c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext("2d").drawImage(img,0,0,c.width,c.height);out=c.toDataURL("image/jpeg",qq);w-=150;qq-=.07}while(out.length>750000&&w>400);res(out)};
 img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error("That file isn't a picture we can read. Please upload a screenshot (JPG or PNG)."))};img.src=url});

const custFields=()=>`
  <label><span class="lab">Name</span><input class="inp" id="fName" maxlength="80" autocomplete="name" value="${esc(cust.name)}"></label>
  <label><span class="lab">Contact number</span><input class="inp" id="fPhone" type="tel" inputmode="tel" maxlength="20" autocomplete="tel" placeholder="e.g. 0917 123 4567" value="${esc(cust.phone)}"></label>
  <label><span class="lab">Complete address</span><textarea class="inp area" id="fAddr" maxlength="300" rows="3" autocomplete="street-address" placeholder="House no., street, barangay, city">${esc(cust.address)}</textarea></label>
  <fieldset class="courier"><legend class="lab">Preferred courier</legend>
   ${["Lalamove","Pick-up"].map(c=>`<label class="radio"><input type="radio" name="courier" value="${c}" ${cust.courier===c?"checked":""}><span>${c}</span></label>`).join("")}
  </fieldset>`;
const payBox=amount=>settings.gcashNumber?`<div class="pay"><b>Pay via GCash</b>
  <div class="gc"><span class="tiny">GCash number</span><strong>${esc(settings.gcashNumber)}</strong>${settings.gcashName?`<span>${esc(settings.gcashName)}</span>`:""}<button type="button" class="rm" data-copy="${esc(settings.gcashNumber)}">Copy number</button></div>
  <p class="tiny" style="margin:0">Amount: <b>${peso(amount)}</b>${settings.paymentNote?" · "+esc(settings.paymentNote):""}</p>
  <label><span class="lab">Upload your GCash payment screenshot</span><input class="inp" type="file" accept="image/*" id="payFile" style="padding:10px"></label>
  <img id="payPrev" class="payprev" hidden alt="Your payment screenshot"></div>`
 :`<div class="pay"><b>Payment</b><p class="tiny" style="margin:0">Amount: <b>${peso(amount)}</b>. We'll send our GCash details when we confirm your booking.</p></div>`;
const readCust=()=>{cust={name:$("fName").value.trim(),phone:$("fPhone").value.trim(),address:$("fAddr").value.trim(),courier:(document.querySelector("input[name=courier]:checked")||{}).value||""};saveCust();
 const miss=[!cust.name&&"your name",!/^[0-9+()\-\s]{7,20}$/.test(cust.phone)&&"a valid contact number",!cust.address&&"your complete address",!cust.courier&&"a courier"].filter(Boolean);return miss};
let payData=null;

/* ---------- availability calendar ---------- */
let cal={dressId:null,month:null,booked:new Set(),sel:"",loading:false};
const renderCal=()=>{const el=$("cal");if(!el)return;const m=cal.month,y=m.getFullYear(),mo=m.getMonth(),t=today0();
 const first=new Date(y,mo,1),days=new Date(y,mo+1,0).getDate(),prevOk=first>new Date(t.getFullYear(),t.getMonth(),1);
 let cells="";for(let i=0;i<first.getDay();i++)cells+="<span></span>";
 for(let d=1;d<=days;d++){const dt=new Date(y,mo,d),ds=iso(dt),past=dt<t,bk=cal.booked.has(ds);
  cells+=`<button type="button" class="day${bk?" bk":""}${ds===cal.sel?" on":""}" data-day="${ds}" ${past||bk?"disabled":""} aria-pressed="${ds===cal.sel}" aria-label="${fmtDate(ds)}${bk?", already booked":""}">${d}</button>`}
 el.innerHTML=`<div class="calh"><button type="button" class="ib" data-cm="-1" ${prevOk?"":"disabled"} aria-label="Previous month">‹</button><b>${first.toLocaleDateString("en-PH",{month:"long",year:"numeric"})}</b><button type="button" class="ib" data-cm="1" aria-label="Next month">›</button></div>
 <div class="calg">${["Su","Mo","Tu","We","Th","Fr","Sa"].map(x=>`<i>${x}</i>`).join("")}${cells}</div>
 <div class="calk"><span><i class="kb"></i>Booked</span><span><i class="ks"></i>Your date</span>${cal.loading?"<span>Checking dates…</span>":""}</div>`;
 const o=$("usageOut");if(o)o.textContent=cal.sel?fmtDate(cal.sel):"Tap a date on the calendar";
};
const loadBooked=async id=>{cal.loading=true;renderCal();
 try{if(window.CDJ_BLOCKED){const l=await window.CDJ_BLOCKED(id);if(cal.dressId===id)cal.booked=new Set(l)}}catch(e){console.error(e)}
 cal.loading=false;if(cal.dressId===id){if(cal.booked.has(cal.sel))cal.sel="";renderCal()}};

/* ---------- dress page + rental booking form ---------- */
const openPd=id=>{
 const d=dresses.find(x=>x.id===id);if(!d)return;cur={id,size:d.sizes.length===1?d.sizes[0]:""};payData=null;
 const gown=catOf(d)==="Wedding Gown";
 $("pd").innerHTML=`${X}<div class="pd"><div class="ph">${photo(d,dresses.indexOf(d))}</div>
 <form id="rentForm" novalidate><div><span class="ctag">${esc(catOf(d))}</span><h2>${esc(d.name)}</h2><div class="price">${peso(d.price)} <span class="tiny" style="font-family:Jost">${gown?"special rental rate":"per rental"}</span></div>${d.note?`<p class="note">${esc(d.note)}</p>`:""}</div>
  ${d.desc?`<p class="desc">${esc(d.desc).replace(/\n/g,"<br>")}</p>`:""}
  ${d.color?`<p class="tiny" style="margin:0">Color: <b>${esc(d.color)}</b></p>`:""}
  ${sizeGuide(d)}
  <div class="formhead"><h3>Rental Booking Form</h3><p class="tiny">Kindly fill out the following details to proceed with your rental reservation.</p></div>
  <label><span class="lab">Dress name</span><input class="inp" value="${esc(d.name)}" readonly></label>
  <div><span class="lab">Size</span><div class="opts">${d.sizes.map(s=>`<button type="button" class="opt" data-sz="${esc(s)}" aria-pressed="${cur.size===s}">${esc(SNAME[s]||s)}</button>`).join("")}</div></div>
  <div><span class="lab">Usage date (month / day / year)</span><div class="cal" id="cal"></div><p class="usage">Selected: <b id="usageOut"></b></p></div>
  ${custFields()}
  ${payBox(d.price)}
  <div class="err" id="err" role="alert"></div>
  <button class="btn car" type="submit" id="rentBtn">Reserve this dress</button>
  <p class="tiny" style="margin:0">Your date is held as soon as you send this. We'll contact you to confirm.</p>
 </form></div>`;
 const t=today0();cal={dressId:d.id,month:new Date(t.getFullYear(),t.getMonth(),1),booked:new Set(),sel:"",loading:false};
 openOv("pdOv");loadBooked(d.id);
};
const igMsg=(ref,lines)=>`Hi Cœur de Jane! 🤍 (booking ref ${ref})\n\n${lines.join("\n")}\n\nThank you!`;
const doneView=(title,ref,lines)=>`${X}<div class="done pad"><b>${title}</b><span>Reference <strong>${esc(ref)}</strong></span>
 <ul class="sum">${lines.map(l=>`<li>${esc(l)}</li>`).join("")}</ul>
 <span>We'll contact you at <b>${esc(cust.phone)}</b> to confirm. You can also message us on Instagram with your reference.</span>
 <textarea class="msg" id="msg" readonly>${esc(igMsg(ref,lines))}</textarea>
 <button class="btn car" id="copyMsg">Copy message &amp; open Instagram</button>
 <button class="btn line" data-close>Done</button></div>`;
const submitRental=async btn=>{
 const d=dresses.find(x=>x.id===cur.id);const err=$("err");err.textContent="";
 const miss=[!cur.size&&"a size",!cal.sel&&"your usage date"].filter(Boolean).concat(readCust());
 if(settings.gcashNumber&&!payData)miss.push("your GCash payment screenshot");
 if(miss.length){err.textContent="Please add "+miss.join(", ")+".";return}
 if(typeof window.CDJ_SUBMIT!=="function"){err.textContent="Booking isn't available right now. Please message us on Instagram.";return}
 const ref=newRef();btn.disabled=true;btn.textContent="Reserving…";
 try{
  await window.CDJ_SUBMIT({type:"rental",ref,name:cust.name,contact:cust.phone,address:cust.address,courier:cust.courier,total:Number(d.price)||0,
   rental:{dressId:String(d.id),dressName:d.name,size:cur.size,price:Number(d.price)||0,usageDate:cal.sel}},payData);
  const lines=["Rental: "+d.name+" ("+(SNAME[cur.size]||cur.size)+")","Usage date: "+fmtDate(cal.sel),"Name: "+cust.name,"Contact: "+cust.phone,"Address: "+cust.address,"Courier: "+cust.courier,"Payment: "+(payData?"GCash screenshot sent":"to follow")];
  $("pd").innerHTML=doneView("Your reservation is sent!",ref,lines);$("pd").scrollTop=0;toast("Reservation saved!");
 }catch(e){console.error(e);btn.disabled=false;btn.textContent="Reserve this dress";
  if(e.code==="taken"){cal.booked.add(cal.sel);cal.sel="";renderCal();err.textContent="Sorry, that date was just booked by someone else. Please pick another date."}
  else err.textContent="We couldn't send your reservation just now. Please check your internet and try again, or message us on Instagram."}
};

/* ---------- fitting service ---------- */
let fitSel=new Set();
const openFit=()=>{payData=null;fitSel=new Set();const min=iso(today0());
 $("fit").innerHTML=`${X}<form id="fitForm" class="pad" novalidate>
  <div class="formhead"><h2>Fitting <em>Service</em></h2><p>Fitting is available for <b data-fee>${peso(settings.fittingFee)}</b>, covering 5–10 dresses. Dresses must be returned immediately after fitting. Subject to availability.</p></div>
  ${custFields().split("</label>")[0]}</label>
  <div><span class="lab">Dresses to try on (choose 5–10)</span><p class="usage" style="margin:0 0 6px">Number of dresses: <b id="fitN">0</b></p>
   <div class="fitlist">${visible().map(d=>`<label class="chk"><input type="checkbox" data-fd="${esc(d.id)}"><span>${esc(d.name)}<small>${esc(catOf(d))}</small></span></label>`).join("")}</div></div>
  <label><span class="lab">Usage date (month / day / year)</span><input class="inp" type="date" id="fUse" min="${min}"></label>
  <label><span class="lab">Fitting date</span><input class="inp" type="date" id="fFit" min="${min}"></label>
  ${custFields().split("</label>").slice(1).join("</label>")}
  ${payBox(settings.fittingFee)}
  <div class="err" id="ferr" role="alert"></div>
  <button class="btn car" type="submit">Book my fitting</button>
 </form>`;
 openOv("fitOv");
};
const submitFit=async btn=>{const err=$("ferr");err.textContent="";
 const use=$("fUse").value,fitD=$("fFit").value;const miss=readCust();
 if(fitSel.size<5||fitSel.size>10)miss.unshift("5 to 10 dresses to try on");
 if(!use)miss.push("your usage date");if(!fitD)miss.push("your fitting date");
 if(settings.gcashNumber&&!payData)miss.push("your GCash payment screenshot");
 if(miss.length){err.textContent="Please add "+miss.join(", ")+".";return}
 if(fitD>use){err.textContent="Your fitting date should be on or before your usage date.";return}
 if(typeof window.CDJ_SUBMIT!=="function"){err.textContent="Booking isn't available right now. Please message us on Instagram.";return}
 const names=[...fitSel].map(id=>(dresses.find(d=>d.id===id)||{}).name).filter(Boolean);
 const ref=newRef();btn.disabled=true;btn.textContent="Sending…";
 try{
  await window.CDJ_SUBMIT({type:"fitting",ref,name:cust.name,contact:cust.phone,address:cust.address,courier:cust.courier,total:Number(settings.fittingFee)||0,
   fitting:{count:names.length,dresses:names,usageDate:use,fittingDate:fitD}},payData);
  const lines=["Fitting: "+names.length+" dresses — "+names.join(", "),"Usage date: "+fmtDate(use),"Fitting date: "+fmtDate(fitD),"Name: "+cust.name,"Contact: "+cust.phone,"Address: "+cust.address,"Courier: "+cust.courier,"Payment: "+(payData?"GCash screenshot sent":"to follow")];
  $("fit").innerHTML=doneView("Your fitting request is sent!",ref,lines);$("fit").scrollTop=0;toast("Fitting request saved!");
 }catch(e){console.error(e);btn.disabled=false;btn.textContent="Book my fitting";err.textContent="We couldn't send your request just now. Please check your internet and try again, or message us on Instagram."}
};

/* ---------- events ---------- */
const closeAll=()=>{for(const id of["pdOv","fitOv"])openOv(id,false)};
document.addEventListener("click",e=>{
 const t=e.target;
 const o=t.closest("[data-open]");if(o){openPd(o.dataset.open);return}
 if(t.closest("[data-fit]")){e.preventDefault();openFit();return}
 if(t.closest("[data-close]")||t.classList.contains("ov")){closeAll();return}
 const s=t.closest("[data-s]");if(s){sizeF=s.dataset.s;renderSizes();renderGrid();return}
 const cb=t.closest("[data-c]");if(cb){catF=cb.dataset.c;renderGrid();return}
 const cl=t.closest("[data-cat]");if(cl){catF=cl.dataset.cat;renderGrid()}
 const sz=t.closest("[data-sz]");if(sz&&cur){cur.size=sz.dataset.sz;for(const b of document.querySelectorAll("[data-sz]"))b.setAttribute("aria-pressed",b===sz);return}
 const dy=t.closest("[data-day]");if(dy&&!dy.disabled){cal.sel=dy.dataset.day;renderCal();return}
 const cm=t.closest("[data-cm]");if(cm&&!cm.disabled){cal.month=new Date(cal.month.getFullYear(),cal.month.getMonth()+Number(cm.dataset.cm),1);renderCal();return}
 const cp=t.closest("[data-copy]");if(cp){navigator.clipboard.writeText(cp.dataset.copy).then(()=>toast("GCash number copied")).catch(()=>toast("GCash number: "+cp.dataset.copy));return}
 if(t.closest("#copyMsg")){const m=$("msg").value;navigator.clipboard.writeText(m).then(()=>{toast("Message copied! Paste it in our Instagram DMs.");window.open(DM,"_blank","noopener")}).catch(()=>{$("msg").select();toast("Copy the message above, then send it on Instagram.");window.open(DM,"_blank","noopener")});return}
});
document.addEventListener("change",async e=>{
 const t=e.target;
 if(t.dataset&&t.dataset.fd){t.checked?fitSel.add(t.dataset.fd):fitSel.delete(t.dataset.fd);$("fitN").textContent=fitSel.size;
  if(fitSel.size>10){t.checked=false;fitSel.delete(t.dataset.fd);$("fitN").textContent=fitSel.size;toast("You can choose up to 10 dresses")}return}
 if(t.id==="payFile"){const f=t.files[0];payData=null;const pv=$("payPrev");pv.hidden=true;if(!f)return;
  try{payData=await shrink(f);pv.src=payData;pv.hidden=false}catch(err){t.value="";toast(err.message)}}
});
document.addEventListener("submit",e=>{
 if(e.target.id==="rentForm"){e.preventDefault();submitRental($("rentBtn"));return}
 if(e.target.id==="fitForm"){e.preventDefault();submitFit(e.target.querySelector("button[type=submit]"));return}
 if(e.target.id==="fsearch"){e.preventDefault();q=$("fq").value.trim().toLowerCase();$("q").value=$("fq").value;renderGrid();location.hash="shop"}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});
$("q").addEventListener("input",e=>{q=e.target.value.trim().toLowerCase();renderGrid()});
$("menuBtn").addEventListener("click",()=>{const o=$("menu").classList.toggle("open");$("menuBtn").setAttribute("aria-expanded",o)});
$("menu").addEventListener("click",()=>{$("menu").classList.remove("open");$("menuBtn").setAttribute("aria-expanded","false")});
$("searchBtn").addEventListener("click",()=>{$("shop").scrollIntoView();setTimeout(()=>$("q").focus({preventScroll:true}),350)});

renderSizes();renderGrid();renderHero();applySettings();
const mbar=$("mbar");
if(mbar&&"IntersectionObserver" in window){const io=new IntersectionObserver(es=>{mbar.classList.toggle("hide",es.some(x=>x.isIntersecting))});io.observe($("grid"));io.observe($("book"))}
window.CDJ={set(list){window.CDJ_LOADING=false;dresses=list;renderGrid();renderHero()},
 photos(map){let ch=false;for(const d of dresses){if(map[d.id]&&d.img!==map[d.id]){d.img=map[d.id];ch=true}}if(ch){renderGrid();renderHero()}},
 fail(){window.CDJ_LOADING=false;dresses=(window.DRESSES||[]).slice();renderGrid();renderHero()},
 settings(v){settings={gcashNumber:String(v.gcashNumber||"").slice(0,30),gcashName:String(v.gcashName||"").slice(0,80),paymentNote:String(v.paymentNote||"").slice(0,200),fittingFee:Number(v.fittingFee)||200};applySettings()}};
})();
