document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("productSearch");
  if (!searchInput) return;

  // Detect which product container is present on the page
  // Catalogue page container id: "product-cards"
  // Billing page container id: "billing-product-cards"
  let productContainer = document.getElementById("product-cards") || 
                         document.getElementById("billing-product-cards");

  if (!productContainer) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    const productCards = productContainer.querySelectorAll(".product-card");

    productCards.forEach(card => {
      // Find product name element inside the card
      // Assumes product name is inside an element with class "product-name"
      const nameEl = card.querySelector(".product-name");
      const productName = nameEl ? nameEl.textContent.toLowerCase() : "";

      if (productName.includes(query)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
});
