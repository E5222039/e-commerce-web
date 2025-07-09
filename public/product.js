async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  const res = await fetch('/api/products');
  const products = await res.json();
  const product = products.find(p => p.productId === productId);

  if (!product) {
    document.getElementById('product-detail').innerHTML = "<p>Product not found.</p>";
    return;
  }

  const imageList = Array.isArray(product.image) ? product.image : [product.image];
  const div = document.getElementById('product-detail');

  const benefitsHTML = product.benefits?.length
    ? `
      <div class="benefits">
        <h3>Benefits</h3>
        <ul>
          ${product.benefits.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `
    : '';

  div.innerHTML = `
    <div class="image-gallery">
      <div class="main-image">
        <img id="main-img" src="${imageList[0]}" alt="${product.name}" />
      </div>
      <div class="thumbnails">
        ${imageList.map((img, i) => `
          <img src="${img}" class="${i === 0 ? 'active' : ''}" data-index="${i}" />
        `).join('')}
      </div>
    </div>

    <div class="product-info">
      <h2>${product.name}</h2>
      <p class="price">₹${product.price}</p>
      <p>Description: ${product.description || "No description available."}</p>

      ${benefitsHTML}

      <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
    </div>
  `;

  // ✅ Thumbnail switching
  document.querySelectorAll(".thumbnails img").forEach(img => {
    img.addEventListener("click", function () {
      const index = this.dataset.index;
      document.getElementById("main-img").src = imageList[index];
      document.querySelectorAll(".thumbnails img").forEach(i => i.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

async function addToCart(name, price) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price })
  });

  if (res.status === 401) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  alert("Product added to cart");
}

loadProduct();
