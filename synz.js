let categories = {};
let selectedCategory = null;

// Load categories from localStorage
function reloadCategories() {
  categories = JSON.parse(localStorage.getItem('categories')) || {};
}

// Save categories to localStorage
function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

// Get products based on selected category or all
function getCurrentProducts() {
  if (selectedCategory && categories[selectedCategory]) {
    return categories[selectedCategory];
  } else {
    return Object.values(categories).flat();
  }
}

// Load immediately on script import
reloadCategories();
