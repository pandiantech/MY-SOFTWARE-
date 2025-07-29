// ---------- Local Storage Initialization ----------
let categories = JSON.parse(localStorage.getItem('categories')) || {};
let selectedCategory = null;

const categoryList = document.getElementById('category-list');

// ---------- Render All Categories ----------
function renderCategories() {
  categoryList.innerHTML = '';
  Object.keys(categories).forEach(category => {
    const li = document.createElement('li');
    li.textContent = category;
    li.className = (selectedCategory === category) ? 'active' : '';
    li.onclick = () => {
      selectedCategory = category;
      renderCategories();
      renderProducts();
    };
    categoryList.appendChild(li);
  });
}

// ---------- Add New Category ----------
function addCategory() {
  const name = prompt("Enter new category name:");
  if (!name) return;
  if (categories[name]) {
    alert("Category already exists!");
    return;
  }
  categories[name] = [];
  selectedCategory = name;
  saveCategories();
  renderCategories();
  renderProducts();
}

// ---------- Remove Selected Category ----------
function removeSelectedCategory() {
  if (!selectedCategory) {
    alert("No category selected.");
    return;
  }
  if (!confirm(`Delete category "${selectedCategory}"?`)) return;

  delete categories[selectedCategory];
  selectedCategory = null;
  saveCategories();
  renderCategories();
  renderProducts();
}

// ---------- Show All Products ----------
function showAllProducts() {
  selectedCategory = null;
  renderCategories();
  renderProducts();
}

// ---------- Save to Local Storage ----------
function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

// ---------- Utility: Get Current Products ----------
function getCurrentProducts() {
  if (selectedCategory && categories[selectedCategory]) {
    return categories[selectedCategory];
  } else {
    // All products
    return Object.values(categories).flat();
  }
}

// ---------- Call on Page Load ----------
window.addEventListener('DOMContentLoaded', () => {
  renderCategories();
});


