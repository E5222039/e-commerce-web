document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  document.getElementById("category-title").textContent = category.toUpperCase();

  try {
    const res = await fetch('/api/products');
    const allProducts = await res.json();
    const filtered = allProducts.filter(p => p.category === category);

    const container = document.getElementById("product-list");
    container.innerHTML = "";

   filtered.forEach(product => {
  const card = document.createElement("div");
  card.className = "product-card";

  const imageSrc = Array.isArray(product.image) ? product.image[0] : product.image;

  card.innerHTML = `
    <img src="${imageSrc}" alt="${product.name}" />
    <h3>${product.name}</h3>
    <p>₹${product.price}</p>
  `;

      card.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
       window.location.href = `product.html?id=${product.productId}`;

      });
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching products", error);
  }
});
