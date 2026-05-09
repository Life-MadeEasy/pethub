let cart = JSON.parse(localStorage.getItem("cart")) || [];

// CART LOGIC
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

  // UPDATED DELIVERY LOGIC
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
  
  // Update Delivery Charge Display
  const deliveryEl = document.getElementById("deliveryDisplay");
  const nudgeEl = document.getElementById("regNudge");
  
  if (isRegistered) {
      deliveryEl.innerText = "FREE";
      deliveryEl.style.color = "var(--primary)";
      if (nudgeEl) nudgeEl.style.display = "none";
  } else {
      deliveryEl.innerText = "₹50";
      deliveryEl.style.color = "inherit";
      if (nudgeEl) nudgeEl.style.display = "block";
  }

  // Calculate Final Total
  const finalTotal = subtotal > 0 ? (subtotal + deliveryCharge) : 0;
  document.getElementById("totalDisplay").innerText = "₹" + finalTotal;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateUI();
}

// REGISTRATION LOGIC
function savePetDetails() {
  const petName = document.getElementById("petNameInput").value;
  const parentName = document.getElementById("parentName").value;
  const type = document.getElementById("petType").value;
  const whatsapp = document.getElementById("whatsappNum").value;
  const role = document.querySelector('input[name="parentRole"]:checked').value;

  const addr1 = document.getElementById("regAddr1").value;
  const addr2 = document.getElementById("regAddr2").value;
  const landmark = document.getElementById("regLandmark").value;
  const pincode = document.getElementById("regPincode").value;

  if (petName && parentName && whatsapp) {
    localStorage.setItem("petName", petName);
    localStorage.setItem("parentName", parentName);
    localStorage.setItem("petType", type);
    localStorage.setItem("whatsappNum", whatsapp);
    localStorage.setItem("parentRole", role);

    // Store specific address parts for auto-fill
    localStorage.setItem("userAddressPart1", addr1);
    localStorage.setItem("userAddressPart2", addr2);
    localStorage.setItem("userLandmark", landmark);
    localStorage.setItem("userPincode", pincode);
    
    alert(`Registration Successful for ${petName}!`);
    location.reload();
  } else {
    alert("Please fill Pet Name, Parent Name and WhatsApp Number.");
  }
}

// TOGGLE VIEW ALL LOGIC
function toggleAllProducts() {
  const hiddenItems = document.querySelectorAll('.hidden-product');
  const btn = document.getElementById('viewAllBtn');
  const isHidden = window.getComputedStyle(hiddenItems[0]).display === 'none';

  hiddenItems.forEach(item => {
    item.style.display = isHidden ? 'flex' : 'none';
  });
  btn.innerText = isHidden ? 'Show less ←' : 'View all products →';
}

// ORDER LOGIC WITH EXPLICIT PINCODE VALIDATION
function placeOrder() {
  const parentNameInput = document.getElementById("cartParentName").value;
  const addressInput = document.getElementById("cartAddress").value;
  const pincodeInput = document.getElementById("cartPincode").value;

  if (!parentNameInput || !addressInput || !pincodeInput || cart.length === 0) {
    return alert("Please check all delivery fields and your cart!");
  }

  // List of approved pincodes within 15km of Vaikom
  const allowedPincodes = ["515401", "614806", "621003", "621004", "621007", "621009", "637503", "639116", "639118", "639119", "639201", "671532", "685601", "685602", "685603", "685604", "685605", "685606", "685607", "685608", "685609", "686601", "686602", "686604", "686605", "686606", "686607", "686609"];
  
  // Explicitly validate the separate pincode field
  const pincode = pincodeInput.trim();
  
  if (!/^\d{6}$/.test(pincode)) {
    return alert("Please provide a valid 6-digit Pincode.");
  }

  if (!allowedPincodes.includes(pincode)) {
    return alert("Currently no delivery to pincode " + pincode + ". We only deliver within 15km of Vaikom.");
  }

  const petName = localStorage.getItem("petName") || "Pet";
  const role = localStorage.getItem("parentRole") || "";
  const isRegistered = localStorage.getItem("petName") !== null;
  
  let message = `*NEW ORDER: PETHUB* 🐾\n---\n`;
  message += `👤 *Parent:* ${parentNameInput} (${role})\n`;
  message += `🐶 *Pet Name:* ${petName}\n`;
  message += `📍 *Address:* ${addressInput}\n`;
  message += `📮 *Pincode:* ${pincode}\n\n`;
  
  let subtotal = 0;
  cart.forEach(item => { 
      message += `• ${item.name} x${item.qty} = ₹${item.price * item.qty}\n`; 
      subtotal += (item.price * item.qty);
  });
  
  const delivery = isRegistered ? 0 : 50;
  message += `\n*Subtotal: ₹${subtotal}*`;
  message += `\n*Delivery: ${isRegistered ? "FREE" : "₹50"}*`;
  message += `\n*Total: ₹${subtotal + delivery}*`;

  window.location.href = `https://wa.me/918304848805?text=${encodeURIComponent(message)}`;
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  const storedPet = localStorage.getItem("petName");
  const storedParent = localStorage.getItem("parentName");
  const storedRole = localStorage.getItem("parentRole");
  
  // Address Parts
  const addr1 = localStorage.getItem("userAddressPart1") || "";
  const addr2 = localStorage.getItem("userAddressPart2") || "";
  const landmark = localStorage.getItem("userLandmark") || "";
  const pincode = localStorage.getItem("userPincode") || "";

  if (storedPet) {
    document.getElementById("greeting").innerText = `Hi, ${storedPet} ${storedRole} 👋`;
    document.getElementById("regHeading").innerText = "Register another pet?";
    const regSubText = document.getElementById("regSubText");
    if (regSubText) regSubText.style.display = "none";
  }
  
  // Auto-populate cart fields
  if (storedParent) {
    document.getElementById("cartParentName").value = storedParent;
  }
  
  if (addr1 || addr2 || landmark) {
    let combinedAddr = [addr1, addr2, landmark].filter(part => part !== "").join(", ");
    document.getElementById("cartAddress").value = combinedAddr;
  }

  if (pincode) {
    document.getElementById("cartPincode").value = pincode;
  }
});
