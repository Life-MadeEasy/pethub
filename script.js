let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to Cart
function addToCart(name, price) {
  let existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Display Cart
function displayCart() {
  let cartDiv = document.getElementById("cartItems");
  let total = 0;

  cartDiv.innerHTML = "";

  cart.forEach((item, index) => {
    let subtotal = item.price * item.qty;
    total += subtotal;

    cartDiv.innerHTML += `
      <div>
        <p><b>${item.name}</b></p>
        <p>₹${item.price} x ${item.qty} = ₹${subtotal}</p>
        <div class="qty-controls">
          <button onclick="increaseQty(${index})">+</button>
          <button onclick="decreaseQty(${index})">-</button>
          <button onclick="removeItem(${index})">❌</button>
        </div>
      </div>
      <hr>
    `;
  });

  document.getElementById("total").innerText = "Total: ₹" + total;

  updateStickyBar();
}

// Increase Qty
function increaseQty(index) {
  cart[index].qty += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Decrease Qty
function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Remove Item
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Save Pet Name
function savePetName() {
  let petName = document.getElementById("petName").value.trim();

  if (!petName) {
    alert("Please enter pet name");
    return;
  }

  localStorage.setItem("petName", petName);
  updateGreeting();
}

// Greeting
function updateGreeting() {
  let petName = localStorage.getItem("petName");

  if (petName) {
    document.getElementById("greeting").innerText =
      `🐾 ${petName}'s Hub`;
  } else {
    document.getElementById("greeting").innerText = "PetHub";
  }
}

// Sticky Cart Update
function updateStickyBar() {
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  let bar = document.getElementById("stickyBar");

  if (count > 0) {
    bar.innerText = `View Cart (${count} items) - ₹${total}`;
  } else {
    bar.innerText = "Cart is empty";
  }
}

// Scroll to Cart
function scrollToCart() {
  document.getElementById("cartSection").scrollIntoView({
    behavior: "smooth"
  });
}

// Place Order
function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  let phone = "919876543210"; // replace
  let petName = localStorage.getItem("petName") || "My Pet";

  let message = "Hi, I’d like to place an order:\n\n";

  cart.forEach((item, i) => {
    message += `${i + 1}. ${item.name} - ₹${item.price} x ${item.qty} = ₹${item.price * item.qty}\n`;
  });

  let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  message += `\nTotal: ₹${total}`;
  message += `\nPet Name: ${petName}`;

  let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.location.href = url;
}

// Load
displayCart();
updateGreeting();