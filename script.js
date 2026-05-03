let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  let item = cart.find(i => i.name === name);
  if (item) { item.qty += 1; } 
  else { cart.push({ name, price, qty: 1 }); }
  updateUI();
}

function updateUI() {
  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Update Cart Badge
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cart-badge").innerText = count;

  // Update Cart List
  const cartDiv = document.getElementById("cartItems");
  let total = 0;
  cartDiv.innerHTML = "";

  cart.forEach((item, index) => {
    total += (item.price * item.qty);
    cartDiv.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #f8f9fa; padding-bottom:10px;">
        <div style="font-size:13px;">
          <strong>${item.name}</strong><br>
          <span style="color:var(--text-light)">₹${item.price}</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <button onclick="changeQty(${index}, -1)" style="border:1px solid #eee; background:white; width:25px; height:25px; border-radius:5px;">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)" style="border:1px solid #eee; background:white; width:25px; height:25px; border-radius:5px;">+</button>
        </div>
      </div>
    `;
  });

  document.getElementById("subtotal").innerText = "₹" + total;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateUI();
}

function savePetName() {
  const name = document.getElementById("petNameInput").value;
  if (name) {
    localStorage.setItem("petName", name);
    location.reload(); // Refresh to update greeting
  }
}

function placeOrder() {
  const address = document.getElementById("address").value;
  if (!address) return alert("Please enter delivery address");
  if (cart.length === 0) return alert("Cart is empty");

  const petName = localStorage.getItem("petName") || "Pet";
  let message = `*NEW ORDER: PETHUB* 🐾\n---\n`;
  message += `👤 *Parent of:* ${petName}\n`;
  message += `📍 *Address:* ${address}\n\n`;
  
  cart.forEach(item => {
    message += `• ${item.name} x${item.qty} = ₹${item.price * item.qty}\n`;
  });
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  message += `\n*Total Amount: ₹${total}*`;

  window.location.href = `https://wa.me/918304848805?text=${encodeURIComponent(message)}`;
}

// Init
updateUI();
const storedName = localStorage.getItem("petName");
if (storedName) document.getElementById("greeting").innerText = `Hi ${storedName}'s Parent 👋`;
