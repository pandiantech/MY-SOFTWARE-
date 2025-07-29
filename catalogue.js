




// --- Create and append modal HTML dynamically ---
(function createEditProductModal() {
  const modalHtml = `
  <div id="editProductModal" class="modal-overlay" style="
      display:none; position:fixed; top:0; left:0; width:100vw; height:100vh;
      background: rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:9999;">
    <div class="modal-content" style="
        background:#fff; padding:20px; border-radius:8px; width:320px; max-width:90vw;
        box-shadow:0 2px 10px rgba(0,0,0,0.3);">
      <h2>Edit Product</h2>
      <form id="editProductForm">
        <label>Name:<br><input type="text" id="editName" required style="width:100%; padding:6px; margin-top:4px;"/></label><br><br>
        <label>Stock:<br><input type="number" id="editStock" min="0" required style="width:100%; padding:6px; margin-top:4px;"/></label><br><br>
        <label>Billing Price:<br><input type="number" id="editBillingPrice" min="0" step="0.01" required sty546786341le="width:100%; padding:6px; margin-top:4px;"/></label><br><br>
        <label>Purchase Price:<br><input type="number" id="editPurchasePrice" min="0" step="0.01" required style="width:100%; padding:6px; margin-top:4px;"/></label><br><br>
        <label>Image:<br><input type="file" id="editImage" accept="image/*" style="width:100%; margin-top:4px;"/></label><br><br>
        <img id="editImagePreview" src="" alt="Image Preview" style="
            width:100%; max-height:150px; object-fit:contain; border:1px solid #ccc;
            margin-bottom:12px; border-radius:4px;"/><br>
        <button type="submit" style="
            background:#28a745; color:#fff; border:none; padding:10px 15px;
            border-radius:4px; cursor:pointer;">Save</button>
        <button type="button" id="editCancelBtn" style="
            margin-left:10px; background:#dc3545; color:#fff; border:none; padding:10px 15px;
            border-radius:4px; cursor:pointer;">Cancel</button>
      </form>
    </div>
  </div>`;

  const div = document.createElement('div');
  div.innerHTML = modalHtml;
  document.body.appendChild(div.firstElementChild);
})();

// --- Get modal elements after creation ---
const modal = document.getElementById('editProductModal');
const form = document.getElementById('editProductForm');
const inputName = document.getElementById('editName');
const inputStock = document.getElementById('editStock');
const inputBillingPrice = document.getElementById('editBillingPrice');
const inputPurchasePrice = document.getElementById('editPurchasePrice');
const inputImage = document.getElementById('editImage');
const imagePreview = document.getElementById('editImagePreview');
const cancelBtn = document.getElementById('editCancelBtn');

let editingCategory = null;
let editingProductIndex = null;

// --- Open modal and populate with product data ---
function openEditProductModal(category, productIndex) {
  editingCategory = category;
  editingProductIndex = productIndex;

  const product = categories[category][productIndex];

  inputName.value = product.name;
  inputStock.value = product.stock;
  inputBillingPrice.value = product.billingPrice;
  inputPurchasePrice.value = product.purchasePrice || '';
  imagePreview.src = product.image || 'https://via.placeholder.com/150?text=No+Image';
  inputImage.value = ''; // clear file input

  modal.style.display = 'flex';
}

// --- Close modal ---
function closeEditProductModal() {
  modal.style.display = 'none';
}

// --- Image preview update on file select ---
inputImage.addEventListener('change', () => {
  const file = inputImage.files[0];
  if (!file) {
    imagePreview.src = categories[editingCategory][editingProductIndex].image || 'https://via.placeholder.com/150?text=No+Image';
    return;
  }
  const reader = new FileReader();
  reader.onload = e => imagePreview.src = e.target.result;
  reader.readAsDataURL(file);
});

// --- Save edited product on form submit ---
form.addEventListener('submit', e => {
  e.preventDefault();

  const product = categories[editingCategory][editingProductIndex];

  product.name = inputName.value.trim();
  product.stock = parseInt(inputStock.value) || 0;
  product.billingPrice = parseFloat(inputBillingPrice.value) || 0;
  product.purchasePrice = parseFloat(inputPurchasePrice.value) || 0;

  if (inputImage.files.length > 0) {
    const reader = new FileReader();
    reader.onload = e => {
      product.image = e.target.result;
      saveCategories();
      renderProducts();
      closeEditProductModal();
    };
    reader.readAsDataURL(inputImage.files[0]);
  } else {
    saveCategories();
    renderProducts();
    closeEditProductModal();
  }
});

// --- Cancel button closes modal without saving ---
cancelBtn.onclick = closeEditProductModal;

// --- Clicking outside modal content closes modal ---
modal.onclick = e => {
  if (e.target === modal) closeEditProductModal();
};

// --- Example renderProducts function with Edit button calling modal ---
function renderProducts() {
  const productContainer = document.getElementById('product-cards');
  productContainer.innerHTML = '';

  const products = selectedCategory ? categories[selectedCategory] : Object.values(categories).flat();

  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.position = 'relative';

    if (selectedCategory) {
      card.appendChild(createRemoveButton(selectedCategory, index));
    }

    // Image or placeholder
    const img = document.createElement('img');
    img.src = product.image || 'https://via.placeholder.com/150?text=No+Image';
    img.alt = product.name;
    card.appendChild(img);

    // Product name
    const title = document.createElement('h3');
    title.textContent = product.name;
    card.appendChild(title);

    // Prices and stock
    const info = document.createElement('p');
    info.textContent = `Stock: ${product.stock}, Price: ₹${product.billingPrice}`;
    card.appendChild(info);

    // Edit button opens modal with added CSS class for styling
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');  // <-- Add this line to style the button
    editBtn.onclick = () => openEditProductModal(selectedCategory, index);
    card.appendChild(editBtn);

    productContainer.appendChild(card);
  });
}


// Make sure you have saveCategories() defined somewhere, e.g.:
function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}
// Universal search function for product cards on both pages
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

// Auto-detect which container to use based on the page
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('billing-product-cards')) {
    attachProductSearch('billing-product-cards');
  } else if (document.getElementById('product-cards')) {
    attachProductSearch('product-cards');
  }
});
// Add-on: Reset selectedCategory to null (All Products) on page load for catalogue
window.addEventListener('DOMContentLoaded', () => {
  selectedCategory = null;  // Set to null means 'All Products'
  renderCategories();       // Re-render categories to reflect no selection or highlight 'All Products'
  renderProducts();         // Render all products (from all categories)
});
// ✅ Add Product Functionality (non-intrusive)
document.getElementById('product-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!selectedCategory) {
    alert("Please select a category before adding a product.");
    return;
  }

  const name = document.getElementById('product-name').value.trim();
  const stock = parseInt(document.getElementById('product-stock').value);
  const billingPrice = parseFloat(document.getElementById('billing-price').value);
  const purchasePrice = parseFloat(document.getElementById('purchase-price').value);
  const imageInput = document.getElementById('product-image');
  const imageFile = imageInput.files[0];

  if (!name || isNaN(stock) || isNaN(billingPrice) || isNaN(purchasePrice) || !imageFile) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const newProduct = {
      name,
      stock,
      billingPrice,
      purchasePrice,
      image: e.target.result
    };

    categories[selectedCategory] = categories[selectedCategory] || [];
    categories[selectedCategory].push(newProduct);

    saveCategories();      // Persist to localStorage
    renderProducts();      // Refresh view
    this.reset();          // Clear form
    imageInput.value = ''; // Reset file input manually
  };

  reader.readAsDataURL(imageFile);
});
// ✅ Remove Product Functionality
function createRemoveButton(categoryName, productIndex) {
  const btn = document.createElement("button");
  btn.textContent = "✖";  // <-- Add visible cross symbol
  btn.classList.add("remove-btn");
  btn.style.position = "absolute";
  btn.style.top = "5px";
  btn.style.right = "5px";
  btn.style.background = "red";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "50%";
  btn.style.cursor = "pointer";
  btn.style.width = "24px";
  btn.style.height = "24px";
  btn.style.fontSize = "14px";
  btn.style.lineHeight = "24px";
  btn.style.textAlign = "center";
  btn.style.fontWeight = "bold";
  btn.title = "Remove this product";

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this product?")) {
      categories[categoryName].splice(productIndex, 1);
      saveCategories();
      renderProducts();
    }
  });

  return btn;
}
function styleEditButtons() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (btn.textContent.includes('Edit')) {
      btn.style.background = '#ffc107'; // Yellow
      btn.style.color = '#000';
      btn.style.border = 'none';
      btn.style.padding = '6px 12px';
      btn.style.borderRadius = '20px';
      btn.style.cursor = 'pointer';
      btn.style.fontWeight = 'bold';
      btn.style.fontSize = '14px';
      btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
      btn.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      btn.style.marginTop = '10px';

      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.05)';
        btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
      });
    }
  });
}
