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
const dressArt=(d,i=0)=>{const t=tone(d.color||(d.category==="Wedding Dress"?"White":"")),c=t[0],c2=t[1]||t[0],k=i%4,g="g"+(++uid);
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

const CATS=["On hand","Wedding Dress","Collections"];const catOf=d=>CATS.includes(d.category)?d.category:"On hand";
let dresses=BUILTIN.slice(),sizeF="All",catF="All",q="",bag=[],cur=null;
try{bag=JSON.parse(localStorage.getItem("cdj-bag")||"[]")}catch(e){}
const saveBag=()=>{try{localStorage.setItem("cdj-bag",JSON.stringify(bag))}catch(e){}};
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

const openPd=id=>{
 const d=dresses.find(x=>x.id===id);if(!d)return;cur={id,size:d.sizes.length===1?d.sizes[0]:""};
 const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
 $("pd").innerHTML=`<button class="ib x" data-close aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M5 5l14 14M19 5L5 19"/></svg></button>
 <div class="pd"><div class="ph">${photo(d,dresses.indexOf(d))}</div>
 <form id="rentForm" novalidate><div><span class="ctag">${esc(catOf(d))}</span><h2>${esc(d.name)}</h2><div class="price">${peso(d.price)} <span class="tiny" style="font-family:Jost">${catOf(d)==="Wedding Dress"?"special rental rate":"per rental"}</span></div>${d.note?`<p class="note">${esc(d.note)}</p>`:""}</div>${sizeGuide(d)}
  <div><span class="lab">Size</span><div class="opts" id="szOpts">${d.sizes.map(s=>`<button type="button" class="opt" data-sz="${esc(s)}" aria-pressed="${cur.size===s}">${esc(SNAME[s]||s)}</button>`).join("")}</div></div>
  ${d.color?`<div><span class="lab">Color</span><div class="opts"><span class="opt" aria-pressed="true" style="display:inline-flex;align-items:center;gap:8px"><i style="width:14px;height:14px;border-radius:50%;background:${tone(d.color)[0]};border:1px solid var(--line)"></i>${esc(d.color)}</span></div></div>`:""}
  <label><span class="lab">Date of use (exact date and time)</span><input class="inp" type="datetime-local" id="when" min="${today.toISOString().slice(0,16)}"></label>
  <label><span class="lab">Event location</span><input class="inp" id="where" placeholder="e.g. Manila Hotel, Ermita"></label>
  <div class="err" id="err"></div>
  <button class="btn" type="submit">Rent</button>
  <p class="tiny" style="margin:0">Rent adds this dress to your rent list. Then we'll write your Instagram booking message for you.</p>
 </form></div>`;
 openOv("pdOv");
};
const fmtWhen=v=>{if(!v)return"";const d=new Date(v);return d.toLocaleString("en-PH",{dateStyle:"long",timeStyle:"short"})};
const message=()=>"Hi Cœur de Jane! 🤍 I'd like to book:\n\n"+bag.map((b,i)=>`${bag.length>1?(i+1)+". ":""}Dress Name: ${b.name} (${b.size}, ${b.color})\nDate of Use: ${fmtWhen(b.when)}\nEvent Location: ${b.where}`).join("\n\n")+"\n\nIs it available? Thank you!";
const renderBag=()=>{const mb=document.querySelector("#mbar .btn");if(mb){if(bag.length){mb.textContent="View rent list ("+bag.length+")";mb.setAttribute("href","#");mb.onclick=e=>{e.preventDefault();renderBag();openOv("bagOv")}}else{mb.textContent="Browse dresses";mb.setAttribute("href","#shop");mb.onclick=null}}
 $("badge").textContent=bag.length||"";
 $("lines").innerHTML=bag.length?bag.map((b,i)=>{const d=dresses.find(x=>x.id===b.id)||b;return `<div class="ln"><div class="ph">${photo(d,i)}</div>
  <div><b>${esc(b.name)}</b><small>${esc(SNAME[b.size]||b.size)} · ${esc(b.color)}</small><small>${esc(fmtWhen(b.when))}</small><small>${esc(b.where)}</small></div>
  <div style="text-align:right"><div class="price" style="font-size:19px">${peso(b.price)}</div><button class="rm" data-rm="${i}">Remove</button></div></div>`}).join(""):`<p class="empty">Your rent list is empty.<br>Find a dress you love ♡</p>`;
 const total=bag.reduce((a,b)=>a+Number(b.price||0),0);
 $("df").innerHTML=bag.length?`<div class="row"><span>Total rental</span><b>${peso(total)}</b></div>
  <span class="lab" style="margin:0">Your booking message</span><textarea class="msg" id="msg" readonly>${esc(message())}</textarea>
  <button class="btn car" id="copyMsg">Copy message &amp; open Instagram</button>
  <a class="btn line" href="${DM}" target="_blank" rel="noopener">Open Instagram only</a>
  <p class="tiny" style="margin:0">We confirm availability on Instagram. Nothing is charged here.</p>`:"";
};
const toast=t=>{const e=$("toast");e.textContent=t;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),2600)};

/* events */
document.addEventListener("click",e=>{
 const t=e.target;
 const o=t.closest("[data-open]");if(o){openPd(o.dataset.open);return}
 if(t.closest("[data-close]")||t.classList.contains("ov")){for(const id of["pdOv","bagOv"])openOv(id,false);return}
 const s=t.closest("[data-s]");if(s){sizeF=s.dataset.s;renderSizes();renderGrid();return}
 const cb=t.closest("[data-c]");if(cb){catF=cb.dataset.c;renderGrid();return}
 const cl=t.closest("[data-cat]");if(cl){catF=cl.dataset.cat;renderGrid()}
 const sz=t.closest("[data-sz]");if(sz&&cur){cur.size=sz.dataset.sz;for(const b of document.querySelectorAll("[data-sz]"))b.setAttribute("aria-pressed",b===sz);return}
 const rm=t.closest("[data-rm]");if(rm){bag.splice(+rm.dataset.rm,1);saveBag();renderBag();return}
 if(t.closest("#copyMsg")){const m=message();const open=()=>window.open(DM,"_blank","noopener");
  navigator.clipboard.writeText(m).then(()=>{toast("Message copied! Paste it in our Instagram DMs.");open()}).catch(()=>{$("msg").select();toast("Copy the message above, then send it on Instagram.");open()});return}
});
document.addEventListener("submit",e=>{
 if(e.target.id==="rentForm"){e.preventDefault();const d=dresses.find(x=>x.id===cur.id);
  const when=$("when").value,where=$("where").value.trim();
  const miss=[!cur.size&&"a size",!when&&"your date and time",!where&&"the event location"].filter(Boolean);
  if(miss.length){$("err").textContent="Please add "+miss.join(", ")+".";return}
  bag.push({id:d.id,name:d.name,color:d.color,price:d.price,size:cur.size,when,where});saveBag();renderBag();
  openOv("pdOv",false);openOv("bagOv");toast(d.name+" added to your rent list");}
 if(e.target.id==="fsearch"){e.preventDefault();q=$("fq").value.trim().toLowerCase();$("q").value=$("fq").value;renderGrid();location.hash="shop"}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")for(const id of["pdOv","bagOv"])openOv(id,false)});
$("q").addEventListener("input",e=>{q=e.target.value.trim().toLowerCase();renderGrid()});
$("menuBtn").addEventListener("click",()=>{const o=$("menu").classList.toggle("open");$("menuBtn").setAttribute("aria-expanded",o)});
$("menu").addEventListener("click",()=>{$("menu").classList.remove("open");$("menuBtn").setAttribute("aria-expanded","false")});
$("searchBtn").addEventListener("click",()=>{$("shop").scrollIntoView();setTimeout(()=>$("q").focus({preventScroll:true}),350)});
$("bagBtn").addEventListener("click",()=>{renderBag();openOv("bagOv")});

renderSizes();renderGrid();renderBag();renderHero();
const mbar=$("mbar");
if(mbar&&"IntersectionObserver" in window){const io=new IntersectionObserver(es=>{const shopVis=es.some(e=>e.isIntersecting);mbar.classList.toggle("hide",shopVis)});io.observe($("grid"));io.observe($("book"))}
window.CDJ={set(list){window.CDJ_LOADING=false;dresses=list;renderGrid();renderHero();renderBag()},
 photos(map){let ch=false;for(const d of dresses){if(map[d.id]&&d.img!==map[d.id]){d.img=map[d.id];ch=true}}if(ch){renderGrid();renderHero()}},
 fail(){window.CDJ_LOADING=false;dresses=(window.DRESSES||[]).slice();renderGrid();renderHero()}};
})();
