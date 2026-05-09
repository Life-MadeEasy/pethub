let cart = JSON.parse(localStorage.getItem("cart")) || [];

// --- NAVBAR SCROLL LOGIC ---
// This script detects scroll and stops the floating effect after the search bar
window.onscroll = function() {
    const nav = document.getElementById("floatingNav");
    const searchBar = document.getElementById("searchBar");
    const searchBarPosition = searchBar.getBoundingClientRect().bottom + window.scrollY;

    if (window.scrollY > searchBarPosition - 50) {
        nav.style.position = "absolute";
        nav.style.top = (searchBarPosition - 70) + "px";
        nav.style.margin = "12px 15px";
    } else {
        nav.style.position = "sticky";
        nav.style.top = "10px";
    }
};

// --- CART FUNCTIONS ---
function addToCart(name, price) {
  let item = cart.find(i => i.name === name);
  if (item) { item.qty += 1; } 
  else { cart.push({ name, price, qty: 1 }); }
  updateUI();
}

function updateUI() {
  localStorage.setItem("cart", JSON.stringify(cart));
  const badge = document.getElementById("cart-badge");
  if(badge) badge.innerText = cart.reduce((sum, item) => sum + item.qty, 0);

  const cartDiv = document.getElementById("cartItems");
  if (!cartDiv) return;

  const isRegistered = localStorage.getItem("petName") !== null;
  const deliveryCharge = isRegistered ? 0 : 50;

  let subtotal = 0;
  cartDiv.innerHTML = "";
  cart.forEach((item, index) => {
    subtotal += (item.price * item.qty);
    cartDiv.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #f8f9fa; padding-bottom:10px;">
        <div style="font-size:13px;"><strong>${item.name}</strong><br><span style="color:#636e72">₹${item.price}</span></div>
        <div style="display:flex; align-items:center; gap:10px;">
          <button onclick="changeQty(${index}, -1)" style="border:1px solid #eee; background:white; width:25px; height:25px;">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)" style="border:1px solid #eee; background:white; width:25px; height:25px;">+</button>
        </div>
      </div>`;
  });

  document.getElementById("subtotal").innerText = "₹" + subtotal;
  const deliveryEl = document.getElementById("deliveryDisplay");
  if (isRegistered) {
      deliveryEl.innerText = "FREE";
      deliveryEl.style.color = "var(--primary)";
      if (document.getElementById("regNudge")) document.getElementById("regNudge").style.display = "none";
  } else {
      deliveryEl.innerText = "₹50";
      deliveryEl.style.color = "inherit";
  }

  const finalTotal = subtotal > 0 ? (subtotal + deliveryCharge) : 0;
  document.getElementById("totalDisplay").innerText = "₹" + finalTotal;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateUI();
}

// --- SEARCH ---
function filterProducts() {
    const input = document.getElementById('searchBar').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    const viewMoreBtn = document.getElementById('viewMoreBtn');

    productCards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(input) ? "flex" : "none";
    });

    if (input.length > 0) {
        if (viewMoreBtn) viewMoreBtn.style.display = 'none';
    } else {
        if (viewMoreBtn) viewMoreBtn.style.display = 'block';
        document.querySelectorAll('.hidden-product').forEach(p => p.style.display = "none");
    }
}

// --- REGISTRATION ---
function savePetDetails() {
  const petName = document.getElementById("petNameInput").value;
  const parentName = document.getElementById("parentName").value;
  const whatsapp = document.getElementById("whatsappNum").value;

  if (petName && parentName && whatsapp) {
    localStorage.setItem("petName", petName);
    localStorage.setItem("parentName", parentName);
    localStorage.setItem("petType", document.getElementById("petType").value);
    localStorage.setItem("whatsappNum", whatsapp);
    localStorage.setItem("parentRole", document.querySelector('input[name="parentRole"]:checked').value);
    localStorage.setItem("userAddressPart1", document.getElementById("regAddr1").value);
    localStorage.setItem("userAddressPart2", document.getElementById("regAddr2").value);
    localStorage.setItem("userLandmark", document.getElementById("regLandmark").value);
    localStorage.setItem("userPincode", document.getElementById("regPincode").value);
    alert(`Registration Successful for ${petName}!`);
    location.reload();
  } else {
    alert("Please fill Pet Name, Parent Name and WhatsApp Number.");
  }
}

function toggleRegForm() {
    const formFields = document.getElementById("regFormFields");
    const header = document.getElementById("regHeader");
    const isHidden = formFields.style.display === "none";
    formFields.style.display = isHidden ? "grid" : "none";
    if (isHidden) { header.classList.remove('shrunk'); } 
    else { header.classList.add('shrunk'); }
}

// --- NAVIGATION ---
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToCart() { document.getElementById("cartSection").scrollIntoView({ behavior: 'smooth' }); }
function openWhatsAppAccount() { window.location.href = "https://wa.me/918304848805?text=Hi PetHub, I need help with my account."; }

function scrollToSearch() {
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => searchBar.focus(), 500);
    }
}

function toggleAllProducts() {
  const hiddenItems = document.querySelectorAll('.hidden-product');
  hiddenItems.forEach(item => {
    item.style.display = 'flex';
    item.classList.remove('hidden-product');
  });
  document.getElementById('viewMoreBtn').style.display = 'none';
}

function placeOrder() {
  const parentNameInput = document.getElementById("cartParentName").value;
  const addressInput = document.getElementById("cartAddress").value;
  const pincodeInput = document.getElementById("cartPincode").value;

  if (!parentNameInput || !addressInput || !pincodeInput || cart.length === 0) {
    return alert("Please check all delivery fields and your cart!");
  }

  const petName = localStorage.getItem("petName") || "Pet";
  const role = localStorage.getItem("parentRole") || "";
  let message = `*NEW ORDER: PETHUB* 🐾\n---\n👤 *Parent:* ${parentNameInput} (${role})\n🐶 *Pet Name:* ${petName}\n📍 *Address:* ${addressInput}\n📮 *Pincode:* ${pincodeInput}\n\n`;
  
  let subtotal = 0;
  cart.forEach(item => { 
      message += `• ${item.name} x${item.qty} = ₹${item.price * item.qty}\n`; 
      subtotal += (item.price * item.qty);
  });
  
  const isRegistered = localStorage.getItem("petName") !== null;
  message += `\n*Total: ₹${subtotal + (isRegistered ? 0 : 50)}*`;
  window.location.href = `https://wa.me/918304848805?text=${encodeURIComponent(message)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  const storedPet = localStorage.getItem("petName");
  const storedRole = localStorage.getItem("parentRole");

  if (storedPet) {
    document.getElementById("greeting").innerText = `Hi, ${storedPet}'s ${storedRole} 👋`;
    document.getElementById("regHeader").classList.add('shrunk');
    document.getElementById("regHeading").innerHTML = `<button onclick="toggleRegForm()" class="view-more-btn" style="margin-top:10px; width:auto; padding:10px 25px;">Register another pet? +</button>`;
    document.getElementById("regSubText").style.display = "none";
    document.getElementById("regFormFields").style.display = "none";
  }
  
  if (localStorage.getItem("parentName")) document.getElementById("cartParentName").value = localStorage.getItem("parentName");
  const addr1 = localStorage.getItem("userAddressPart1") || "";
  const addr2 = localStorage.getItem("userAddressPart2") || "";
  const landmark = localStorage.getItem("userLandmark") || "";
  if (addr1 || addr2 || landmark) {
    document.getElementById("cartAddress").value = [addr1, addr2, landmark].filter(p => p !== "").join(", ");
  }
  if (localStorage.getItem("userPincode")) document.getElementById("cartPincode").value = localStorage.getItem("userPincode");
});
