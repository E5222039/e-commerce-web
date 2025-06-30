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

  const div = document.getElementById('product-detail');
  div.innerHTML = `
    <img src="${product.image}" alt="${product.name}" width="200" />
    <h2>${product.name}</h2>
    <p>Price: ₹${product.price}</p>
    <p>Description: ${product.description || "No description available."}</p>
    <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
  `;
}

async function addToCart(name, price) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price })
  });

  if (res.status === 401) {
    alert("Login first");
    window.location.href = "login.html";
    return;
  }

  alert("Product added to cart");
}

loadProduct();
