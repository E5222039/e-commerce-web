async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';

  products.forEach(p => {
    const imageSrc = Array.isArray(p.image) ? p.image[0] : p.image;

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="product.html?id=${p.productId}">
        <img src="${imageSrc}" alt="${p.name}" class="product-img" />
        <h2>${p.name}</h2>
      </a>
      <p>₹${p.price}</p>
      <button onclick="addToCart('${p.name}', ${p.price})">Add to Cart</button>
    `;

    grid.appendChild(card);
  });
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

  updateCartCount();
}

async function updateCartCount() {
  const res = await fetch('/api/cart');
  const data = await res.json();
  const count = data.items.reduce((sum, i) => sum + (i.quantity || 1), 0); // default 1 if quantity missing
  document.getElementById('cart').innerText = `🛒 Cart (${count})`;
}

async function checkLoginStatus() {
  const res = await fetch('/api/user');
  const data = await res.json();
  const div = document.getElementById('user-info');

  if (data.loggedIn) {
    div.innerHTML = `
      <span>Welcome, ${data.username || 'User'}</span>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    div.innerHTML = `
      <a href="login.html">Login</a> |
      <a href="register.html">Register</a>
    `;
  }
}

async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  location.reload();
}

loadProducts();
updateCartCount();
checkLoginStatus();
