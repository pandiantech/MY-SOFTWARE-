// Elements
const billingCategoryList = document.getElementById('billing-category-list');
const billingProductCards = document.getElementById('billing-product-cards');

let billingCart = []; // Store selected products

// -------- Render Billing Categories Sidebar --------
function renderBillingCategories() {
  billingCategoryList.innerHTML = '';

  const allBtn = document.createElement('li');
  allBtn.textContent = "All Products";
  allBtn.onclick = () => {
    selectedCategory = null;
    renderBillingCategories();
    renderBillingProducts();
  };
  billingCategoryList.appendChild(allBtn);

  Object.keys(categories).forEach(category => {
    const li = document.createElement('li');
    li.textContent = category;
    li.className = (selectedCategory === category) ? 'active' : '';
    li.onclick = () => {
      selectedCategory = category;
      renderBillingCategories();
      renderBillingProducts();
    };
    billingCategoryList.appendChild(li);
  });
}

// -------- Render Billing Products --------
function renderBillingProducts() {
  billingProductCards.innerHTML = '';

  let products = [];
  if (selectedCategory && categories[selectedCategory]) {
    products = categories[selectedCategory];
  } else {
    products = Object.values(categories).flat();
  }

  if (products.length === 0) {
    billingProductCards.innerHTML = "<p>No products available.</p>";
    return;
  }

  products.forEach((product, index) => {
    const existing = billingCart.find(item => item.name === product.name);
    const card = document.createElement('div');
    card.className = 'product-card';

    let actionButtonHTML = `
      <button onclick="addToCartDirect('${product.name}', ${product.billingPrice}, this)">Add to Bill</button>
    `;

    if (existing) {
      actionButtonHTML = `
        <div class="qty-control">
          <button onclick="decreaseQty('${product.name}')">-</button>
          <span>${existing.qty}</span>
          <button onclick="increaseQty('${product.name}', ${product.billingPrice})">+</button>
        </div>
      `;
    }

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width:100%; height:100px; object-fit:cover; border-radius:6px;" />
      <h4>${product.name}</h4>
      <p>Stock: ${product.stock}</p>
      <p>Billing: ₹${product.billingPrice}</p>
      <p>Purchase: ₹${product.purchasePrice}</p>
      ${actionButtonHTML}
    `;

    billingProductCards.appendChild(card);
  });
}

// -------- Add to Cart --------
function addToCartDirect(name, price) {
  const existing = billingCart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    billingCart.push({ name, price, qty: 1 });
  }
  updateCartPreview();
  renderBillingProducts(); // refresh button to show qty control
}

// -------- Increase Qty --------
function increaseQty(name, price) {
  const existing = billingCart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    billingCart.push({ name, price, qty: 1 });
  }
  updateCartPreview();
  renderBillingProducts();
}

// -------- Decrease Qty --------
function decreaseQty(name) {
  const index = billingCart.findIndex(item => item.name === name);
  if (index > -1) {
    billingCart[index].qty -= 1;
    if (billingCart[index].qty <= 0) {
      billingCart.splice(index, 1);
    }
  }
  updateCartPreview();
  renderBillingProducts();
}


// -------- Mini Cart Preview --------
function updateCartPreview() {
  const preview = document.getElementById("cart-preview");
  const itemsContainer = document.getElementById("cart-items");
  const totalSpan = document.getElementById("cart-total");

  if (!preview || !itemsContainer || !totalSpan) return;

  if (billingCart.length === 0) {
    preview.style.display = "none";
    return;
  }

  preview.style.display = "block";
  itemsContainer.innerHTML = billingCart.map(p => `
    <div>${p.name} x${p.qty} - ₹${(p.price * p.qty).toFixed(2)}</div>
  `).join("");

  const total = billingCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalSpan.textContent = total.toFixed(2);
}

// -------- Go to Cart Page --------
const cartBtn = document.getElementById("go-to-cart");
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    localStorage.setItem("billingCart", JSON.stringify(billingCart));
    window.location.href = "cart.html";
  });
}

// -------- Search Listener --------
function attachSearchListener() {
  const searchInput = document.getElementById("productSearch");
  if (!searchInput) return;

  searchInput.oninput = () => {
    const query = searchInput.value.toLowerCase();
    const cards = document.querySelectorAll("#billing-product-cards .product-card");
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? "block" : "none";
    });
  };
}

// -------- Universal Product Search --------
function attachProductSearch(productContainerId = 'product-cards') {
  const searchInput = document.getElementById('productSearch');
  if (!searchInput) return;

  searchInput.oninput = () => {
    const query = searchInput.value.toLowerCase();
    const container = document.getElementById(productContainerId);
    if (!container) return;

    const cards = container.querySelectorAll('.product-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? 'block' : 'none';
    });
  };
}

// -------- Load Data on Page Load --------
window.addEventListener('DOMContentLoaded', () => {
  reloadCategories();
  renderBillingCategories();
  renderBillingProducts();
  attachProductSearch('billing-product-cards');
});
