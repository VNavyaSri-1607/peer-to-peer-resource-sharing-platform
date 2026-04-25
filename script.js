/* ============ CVR P2P – Shared JS ============ */

// ---- Storage helpers ----
const LS = {
  get:(k,fb)=>{ try{return JSON.parse(localStorage.getItem(k)) ?? fb}catch{return fb} },
  set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))
};

// ---- Auth helpers ----
function getUser(){ return LS.get('cvr_user', null); }
function requireAuth(){
  const u = getUser();
  if(!u && !location.pathname.endsWith('login.html')){
    location.href = 'login.html';
  }
  return u;
}
function logout(){
  localStorage.removeItem('cvr_user');
  location.href='login.html';
}

// ---- Toast ----
function toast(msg){
  let t = document.querySelector('.toast');
  if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(()=>t.classList.remove('show'),2200);
}

// ---- Navbar injection ----
function renderNavbar(active=''){
  const u = getUser();
  const name = u?.name || 'Guest';
  const initials = name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase();
  const html = `
    <div class="navbar">
      <a href="dashboard.html" class="logo">CVR P2P</a>
      <nav>
        <a href="dashboard.html" ${active==='dashboard'?'style="color:var(--primary)"':''}>Dashboard</a>
        <a href="buy.html" ${active==='buy'?'style="color:var(--primary)"':''}>Buy</a>
        <a href="sell.html" ${active==='sell'?'style="color:var(--primary)"':''}>Sell</a>
        <a href="borrow.html" ${active==='borrow'?'style="color:var(--primary)"':''}>Borrow</a>
        <a href="lend.html" ${active==='lend'?'style="color:var(--primary)"':''}>Lend</a>
        <a href="profile.html" ${active==='profile'?'style="color:var(--primary)"':''}>Profile</a>
        <a href="#" onclick="logout();return false;" style="color:var(--danger)">Logout</a>
        <span class="user-chip">${initials} • ${name}</span>
      </nav>
    </div>`;
  const slot = document.getElementById('navbar');
  if(slot) slot.outerHTML = html;
}

// ---- Data accessors ----
const DATA = {
  sells:  ()=>LS.get('cvr_sells',[]),
  lends:  ()=>LS.get('cvr_lends',[]),
  history:()=>LS.get('cvr_history',{bought:[],sold:[],borrowed:[],lent:[]}),
  saveSells:v=>LS.set('cvr_sells',v),
  saveLends:v=>LS.set('cvr_lends',v),
  saveHistory:v=>LS.set('cvr_history',v),
};

// ---- Seed demo data once ----
(function seed(){
  if(!localStorage.getItem('cvr_seeded')){
    DATA.saveSells([
      {id:Date.now()+1, name:'Data Structures Textbook', category:'Books', price:350, seller:'Aarav S.'},
      {id:Date.now()+2, name:'Scientific Calculator', category:'Electronics', price:600, seller:'Meera K.'},
      {id:Date.now()+3, name:'Lab Coat (Size M)', category:'Lab Equipment', price:250, seller:'Ravi T.'},
    ]);
    DATA.saveLends([
      {id:Date.now()+4, name:'Arduino Uno Kit', category:'Electronics', days:7, lender:'Neha P.'},
      {id:Date.now()+5, name:'Drafting Table Set', category:'Accessories', days:3, lender:'Karan M.'},
      {id:Date.now()+6, name:'DBMS Reference Book', category:'Books', days:5, lender:'Anjali R.'},
    ]);
    localStorage.setItem('cvr_seeded','1');
  }
})();

// ---- Resource card renderer ----
function buyCard(item){
  return `
    <div class="res-card">
      <span class="tag">${item.category}</span>
      <h3>${item.name}</h3>
      <div class="meta">Seller: ${item.seller}</div>
      <div class="price">₹${item.price}</div>
      <div class="actions">
        <a class="btn btn-outline" href="resource.html?type=buy&id=${item.id}">View Details</a>
        <button class="btn btn-primary" onclick="buyNow(${item.id})">Buy Now</button>
      </div>
    </div>`;
}
function borrowCard(item){
  return `
    <div class="res-card">
      <span class="tag">${item.category}</span>
      <h3>${item.name}</h3>
      <div class="meta">Lender: ${item.lender}</div>
      <div class="price">${item.days} days</div>
      <div class="actions">
        <a class="btn btn-outline" href="resource.html?type=borrow&id=${item.id}">View Details</a>
        <button class="btn btn-primary" onclick="borrowNow(${item.id})">Borrow</button>
      </div>
    </div>`;
}

function buyNow(id){
  const items = DATA.sells();
  const it = items.find(x=>x.id===id); if(!it) return;
  const h = DATA.history();
  h.bought.push({...it, date:new Date().toLocaleDateString()});
  DATA.saveHistory(h);
  DATA.saveSells(items.filter(x=>x.id!==id));
  toast(`Purchased "${it.name}" successfully`);
  setTimeout(()=>location.reload(),700);
}
function borrowNow(id){
  const items = DATA.lends();
  const it = items.find(x=>x.id===id); if(!it) return;
  const h = DATA.history();
  h.borrowed.push({...it, date:new Date().toLocaleDateString()});
  DATA.saveHistory(h);
  DATA.saveLends(items.filter(x=>x.id!==id));
  toast(`Borrow request for "${it.name}" sent`);
  setTimeout(()=>location.reload(),700);
}
