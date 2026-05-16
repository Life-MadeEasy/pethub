// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// --- 1. CONFIGURATION & WHITELIST ---
const PETHUB_WHITELIST = [
    "515401", "614806", "621003", "621004", "621007", "621009", 
    "637503", "639116", "639118", "639119", "639201", "671532", 
    "685601", "685602", "685603", "685604", "685605", "685606", 
    "685607", "685608", "685609", "686601", "686602", "686604", 
    "686605", "686606", "686607", "686609"
];

// --- NAVBAR SCROLL LOGIC ---
window.addEventListener('scroll', function () {
    const nav = document.getElementById("floatingNav");
    const searchBar = document.getElementById("searchBar");

    if (nav && searchBar) {
        const searchBarPosition = searchBar.getBoundingClientRect().bottom + window.scrollY;
        if (window.scrollY > searchBarPosition - 50) {
            nav.style.position = "absolute";
            nav.style.top = (searchBarPosition - 70) + "px";
        } else {
            nav.style.position = "sticky";
            nav.style.top = "8px";
        }
    }
});

// --- CART FUNCTIONS ---
function addToCart(name, price) {
    let item = cart.find(i => i.name === name);

    if (item) {
        item.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    updateUI();

    // Badge bounce — both nav and footer badges
    ['cart-badge', 'footer-cart-badge'].forEach(id => {
        const badge = document.getElementById(id);
        if (badge) {
            badge.style.transform = "scale(1.5)";
            setTimeout(() => badge.style.transform = "scale(1)", 280);
        }
    });

    // Toast notification
    const toast = document.getElementById("cartToast");
    const toastMsg = document.getElementById("cartToastMsg");
    if (toast && toastMsg) {
        const shortName = name.length > 28 ? name.substring(0, 28) + "…" : name;
        toastMsg.textContent = shortName + " added!";
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-50%) translateY(20px)";
        }, 2600);
    }
}

function updateUI() {
    localStorage.setItem("cart", JSON.stringify(cart));

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    // Update BOTH cart badges (nav + footer)
    ['cart-badge', 'footer-cart-badge'].forEach(id => {
        const badge = document.getElementById(id);
        if (badge) {
            badge.innerText = totalItems;
            badge.style.opacity = totalItems > 0 ? "1" : "0";
        }
    });

    const cartDiv = document.getElementById("cartItems");
    if (!cartDiv) return;

    const isRegistered = localStorage.getItem("petName") !== null;
    const deliveryCharge = isRegistered ? 0 : 50;

    let subtotal = 0;

    if (cart.length === 0) {
        cartDiv.innerHTML = `
            <div class="cart-empty-msg">
                <span class="empty-icon">🛒</span>
                Your cart is empty — go add something your fur baby will love!
            </div>`;
    } else {
        cartDiv.innerHTML = "";
        cart.forEach((item, index) => {
            subtotal += (item.price * item.qty);
            const row = document.createElement("div");
            row.className = "cart-item-row";
            row.innerHTML = `
                <div style="flex:1; min-width:0;">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} each</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>`;
            cartDiv.appendChild(row);
        });
    }

    if (document.getElementById("subtotal"))
        document.getElementById("subtotal").innerText = "₹" + subtotal;

    const deliveryEl = document.getElementById("deliveryDisplay");
    const nudge = document.getElementById("regNudge");

    if (deliveryEl) {
        if (isRegistered) {
            deliveryEl.innerHTML = '<span class="free-delivery-badge">FREE 🎉</span>';
            if (nudge) nudge.style.display = "none";
        } else {
            deliveryEl.innerText = "₹50";
            if (nudge) nudge.style.display = "block";
        }
    }

    const finalTotal = subtotal > 0 ? (subtotal + deliveryCharge) : 0;
    if (document.getElementById("totalDisplay"))
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
        // Show card if search matches, regardless of hidden-product class (when searching)
        if (input.length > 0) {
            card.style.display = title.includes(input) ? "flex" : "none";
        } else {
            // Restore: hide hidden-products again
            if (card.classList.contains('hidden-product')) {
                card.style.display = "none";
            } else {
                card.style.display = "flex";
            }
        }
    });

    if (viewMoreBtn) {
        viewMoreBtn.style.display = input.length > 0 ? 'none' : 'flex';
    }
}

// --- REGISTRATION ---
function savePetDetails() {
    const petName = document.getElementById("petNameInput").value.trim();
    const parentName = document.getElementById("parentName").value.trim();
    const whatsapp = document.getElementById("whatsappNum").value.trim();

    if (petName && parentName && whatsapp) {
        localStorage.setItem("petName", petName);
        localStorage.setItem("parentName", parentName);
        if (document.getElementById("petType"))
            localStorage.setItem("petType", document.getElementById("petType").value);
        localStorage.setItem("whatsappNum", whatsapp);
        const roleInput = document.querySelector('input[name="parentRole"]:checked');
        if (roleInput) localStorage.setItem("parentRole", roleInput.value);
        localStorage.setItem("userAddressPart1", document.getElementById("regAddr1").value);
        localStorage.setItem("userAddressPart2", document.getElementById("regAddr2").value);
        localStorage.setItem("userLandmark", document.getElementById("regLandmark").value);
        localStorage.setItem("userPincode", document.getElementById("regPincode").value);
        alert(`🐾 Welcome to PetHub, ${petName}'s family! You now get FREE delivery on every order.`);
        location.reload();
    } else {
        alert("Please fill in your Pet Name, Your Name, and WhatsApp Number to register.");
    }
}

function toggleRegForm() {
    const formFields = document.getElementById("regFormFields");
    const header = document.getElementById("regHeader");
    const isHidden = formFields.style.display === "none";
    formFields.style.display = isHidden ? "grid" : "none";
    if (isHidden) {
        header.classList.remove('shrunk');
    } else {
        header.classList.add('shrunk');
    }
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
    const btn = document.getElementById('viewMoreBtn');
    if (btn) btn.style.display = 'none';
}

// --- PLACE ORDER (WITH PINCODE VERIFICATION) ---
function placeOrder() {
    const parentNameInput = document.getElementById("cartParentName").value.trim();
    const addressInput = document.getElementById("cartAddress").value.trim();
    const pincodeInput = document.getElementById("cartPincode").value.trim();

    if (!parentNameInput || !addressInput || !pincodeInput || cart.length === 0) {
        return alert("Please fill in all delivery details and make sure your cart isn't empty!");
    }

    if (!PETHUB_WHITELIST.includes(pincodeInput)) {
        return alert("Sorry! 🐾 PetHub delivery is only available within our 15km service zone around Vaikom. Please check your pincode.");
    }

    const petName = localStorage.getItem("petName") || "your pet";
    const role = localStorage.getItem("parentRole") || "";

    let message = `*NEW ORDER: PETHUB* 🐾\n---\n`;
    message += `👤 *Parent:* ${parentNameInput}${role ? ` (${role})` : ''}\n`;
    message += `🐶 *Pet Name:* ${petName}\n`;
    message += `📍 *Address:* ${addressInput}\n`;
    message += `📮 *Pincode:* ${pincodeInput}\n\n`;
    message += `*Items Ordered:*\n`;

    let subtotal = 0;
    cart.forEach(item => {
        message += `• ${item.name} x${item.qty} = ₹${item.price * item.qty}\n`;
        subtotal += (item.price * item.qty);
    });

    const isRegistered = localStorage.getItem("petName") !== null;
    const delivery = isRegistered ? 0 : 50;
    message += `\n*Subtotal:* ₹${subtotal}`;
    message += `\n*Delivery:* ${delivery === 0 ? "FREE" : "₹" + delivery}`;
    message += `\n*TOTAL: ₹${subtotal + delivery}*`;

    window.location.href = `https://wa.me/918304848805?text=${encodeURIComponent(message)}`;
}

// --- INITIALIZE ON LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    updateUI();

    const storedPet = localStorage.getItem("petName");
    const storedRole = localStorage.getItem("parentRole");

    if (storedPet) {
        const greeting = document.getElementById("greeting");
        if (greeting) greeting.innerText = `Hi, ${storedPet}'s ${storedRole || "Parent"} 👋`;

        const regHeader = document.getElementById("regHeader");
        if (regHeader) regHeader.classList.add('shrunk');

        const regHeading = document.getElementById("regHeading");
        if (regHeading) regHeading.innerHTML = `
            <button onclick="toggleRegForm()" class="view-more-btn" style="margin-top:10px; width:auto; padding:10px 24px; font-size:13px;">
                + Register another pet?
            </button>`;

        const regSubText = document.getElementById("regSubText");
        if (regSubText) regSubText.style.display = "none";

        const regFormFields = document.getElementById("regFormFields");
        if (regFormFields) regFormFields.style.display = "none";
    }

    // Pre-fill cart delivery details from registration
    const storedParentName = localStorage.getItem("parentName");
    if (storedParentName) {
        const cartParentName = document.getElementById("cartParentName");
        if (cartParentName) cartParentName.value = storedParentName;
    }

    const addr1 = localStorage.getItem("userAddressPart1") || "";
    const addr2 = localStorage.getItem("userAddressPart2") || "";
    const landmark = localStorage.getItem("userLandmark") || "";
    if (addr1 || addr2 || landmark) {
        const cartAddress = document.getElementById("cartAddress");
        if (cartAddress)
            cartAddress.value = [addr1, addr2, landmark].filter(p => p !== "").join(", ");
    }

    const storedPincode = localStorage.getItem("userPincode");
    if (storedPincode) {
        const cartPincode = document.getElementById("cartPincode");
        if (cartPincode) cartPincode.value = storedPincode;
    }
});
