// IMPORTANT: These are sample listings and sample prices. Replace with your own artwork and actual prices.
const WHATSAPP_NUMBER = ""; // Add your business WhatsApp number with country code, digits only, e.g. 919876543210.
const CONTACT_EMAIL = "";   // Optional: add a customer support email.
const products = [
  {id:"ember",name:"Crimson Horizon",category:"cinema",tag:"CINEMATIC SERIES",artTitle:"CRIMSON\nHORIZON",sub:"01 / THE AFTERGLOW",color:"#a9162b",a4:199,a3:299,description:"A dramatic original cinematic-style art print. Replace this sample artwork with your own design."},
  {id:"orbit",name:"Beyond the Orbit",category:"minimal",tag:"SPACE COLLECTION",artTitle:"BEYOND\nTHE ORBIT",sub:"02 / FIND YOUR WAY",color:"#28516d",a4:199,a3:299,description:"A moody space-inspired art print for your room, studio, or desk."},
  {id:"wildfire",name:"Wildfire Spirit",category:"anime",tag:"ANIME-INSPIRED",artTitle:"WILDFIRE\nSPIRIT",sub:"03 / UNBREAKABLE",color:"#b54a20",a4:199,a3:299,description:"An original anime-inspired poster concept. Use licensed or original artwork for products you sell."},
  {id:"noir",name:"Midnight Noir",category:"cinema",tag:"NOIR COLLECTION",artTitle:"MIDNIGHT\nNOIR",sub:"04 / AFTER DARK",color:"#5b2639",a4:199,a3:299,description:"A bold, shadowy cinematic art print."},
  {id:"still",name:"Still Motion",category:"minimal",tag:"MINIMAL SERIES",artTitle:"STILL\nMOTION",sub:"05 / LESS IS MORE",color:"#50604d",a4:179,a3:279,description:"A clean, minimal poster for a calm aesthetic space."},
  {id:"nova",name:"Nova Breaker",category:"anime",tag:"ORIGINAL SERIES",artTitle:"NOVA\nBREAKER",sub:"06 / IGNITE YOUR WORLD",color:"#452b8a",a4:199,a3:299,description:"A vibrant original anime-inspired art print."},
  {id:"redline",name:"Redline 07",category:"cinema",tag:"ACTION COLLECTION",artTitle:"REDLINE\n07",sub:"07 / NO TURNING BACK",color:"#8f1723",a4:199,a3:299,description:"A high-energy graphic poster concept."},
  {id:"bluehour",name:"The Blue Hour",category:"minimal",tag:"ATMOSPHERE SERIES",artTitle:"THE BLUE\nHOUR",sub:"08 / BETWEEN WORLDS",color:"#25516d",a4:179,a3:279,description:"A cool-toned atmospheric print."}
];
const $ = s => document.querySelector(s);
const money = n => "₹" + n;
let cart = [];
let selectedProduct = null;
let selectedFilter = "all";

function artMarkup(p, extra="") {
  return `<div class="poster-art ${extra}" style="--a:${p.color}"><span class="poster-sub">${p.tag}</span><span class="poster-number">XP / ${String(p.id.length).padStart(2,"0")}</span><span class="poster-title">${p.artTitle}</span></div>`;
}
function renderProducts() {
  const shown = products.filter(p => selectedFilter === "all" || p.category === selectedFilter);
  $("#product-grid").innerHTML = shown.map(p => `
    <article class="product-card">
      ${artMarkup(p)}
      <div class="card-info">
        <h3 class="card-title">${p.name}</h3>
        <div class="card-meta"><span>A4 / A3 PRINT</span><span>MADE TO ORDER</span></div>
        <div class="card-bottom"><span class="price">${money(p.a4)}+</span><button class="quick-view" data-view="${p.id}">VIEW / ADD +</button></div>
      </div>
    </article>`).join("");
  document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => openProduct(b.dataset.view)));
}
function openProduct(id) {
  selectedProduct = products.find(p => p.id === id);
  $("#dialog-art").innerHTML = artMarkup(selectedProduct);
  $("#dialog-title").textContent = selectedProduct.name;
  $("#dialog-description").textContent = selectedProduct.description;
  $("#size-select").value = "A4";
  updateDialogPrice();
  $("#product-dialog").showModal();
}
function updateDialogPrice() {
  if (!selectedProduct) return;
  const size = $("#size-select").value;
  $("#dialog-price").textContent = `${money(selectedProduct[size.toLowerCase()])} · ${size}`;
}
function addToCart(id, size) {
  const p = products.find(x => x.id === id);
  const key = `${id}-${size}`;
  const existing = cart.find(x => x.key === key);
  if (existing) existing.qty++;
  else cart.push({key,id,size,qty:1,price:p[size.toLowerCase()]});
  renderCart();
}
function renderCart() {
  $("#cart-count").textContent = cart.reduce((sum,x)=>sum+x.qty,0);
  $("#cart-items").innerHTML = cart.length ? cart.map(item => {
    const p = products.find(x => x.id === item.id);
    return `<div class="cart-row"><div class="cart-thumb">${artMarkup(p)}</div><div><h3>${p.name}</h3><p>${item.size} · ${money(item.price)} each</p><div class="qty-controls"><button data-qty="${item.key}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${item.key}" data-delta="1" aria-label="Increase quantity">+</button></div><button class="remove" data-remove="${item.key}">Remove</button></div><strong>${money(item.price*item.qty)}</strong></div>`;
  }).join("") : `<div class="empty">Your cart is empty. Find a poster you love.</div>`;
  const total = cart.reduce((sum,x)=>sum+x.price*x.qty,0);
  $("#cart-total").textContent = money(total);
  document.querySelectorAll("[data-qty]").forEach(b=>b.addEventListener("click",()=>{const i=cart.find(x=>x.key===b.dataset.qty);if(i){i.qty+=Number(b.dataset.delta);if(i.qty<=0)cart=cart.filter(x=>x!==i);renderCart();}}));
  document.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{cart=cart.filter(x=>x.key!==b.dataset.remove);renderCart();}));
}
function openCart(){ $("#backdrop").hidden=false; $("#cart-drawer").classList.add("open"); $("#cart-drawer").setAttribute("aria-hidden","false"); }
function closeCart(){ $("#backdrop").hidden=true; $("#cart-drawer").classList.remove("open"); $("#cart-drawer").setAttribute("aria-hidden","true"); }
function checkout() {
  if (!cart.length) { alert("Your cart is empty. Add a poster first."); return; }
  const lines = cart.map(item=>{const p=products.find(x=>x.id===item.id);return `• ${p.name} — ${item.size} — Qty ${item.qty} — ${money(item.price*item.qty)}`;});
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const message=`Hi XAVIERPOSTERIZE! I'd like to place an order:\n\n${lines.join("\n")}\n\nSubtotal: ${money(total)}\n\nPlease confirm availability, shipping cost, payment method, and delivery estimate.\nName:\nPhone:\nFull delivery address:`;
  if (!WHATSAPP_NUMBER) {
    alert("Store demo: add your business WhatsApp number in script.js to enable WhatsApp checkout. No order has been sent or paid.");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");
}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{selectedFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();}));
$("#open-cart").addEventListener("click",openCart);
$("#close-cart").addEventListener("click",closeCart);
$("#backdrop").addEventListener("click",closeCart);
$("#close-product").addEventListener("click",()=>$("#product-dialog").close());
$("#size-select").addEventListener("change",updateDialogPrice);
$("#add-selected").addEventListener("click",()=>{if(selectedProduct)addToCart(selectedProduct.id,$("#size-select").value);$("#product-dialog").close();openCart();});
$("#checkout").addEventListener("click",checkout);
$("#custom-link").href=WHATSAPP_NUMBER?`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi XAVIERPOSTERIZE, I'd like to request a custom poster.")}`:"#";
$("#custom-link").addEventListener("click",e=>{if(!WHATSAPP_NUMBER){e.preventDefault();alert("Add your business WhatsApp number in script.js to enable custom requests.");}});
$("#contact-link").href=CONTACT_EMAIL?`mailto:${CONTACT_EMAIL}`:"#";
$("#contact-link").addEventListener("click",e=>{if(!CONTACT_EMAIL){e.preventDefault();alert("Add your support email in script.js to enable contact.");}});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();
