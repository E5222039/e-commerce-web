// Load all products on page
async function loadProducts() {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();

        const grid = document.getElementById('product-grid');
        grid.innerHTML = ''; // clear before re-render

        products.forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}" width="100%">
                <h2>${p.name}</h2>
                <p>$${p.price}</p>
                <button onclick="addToCart(${index})">Add to Cart</button>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error('Error loading products:', err);
    }
}

// Add product to cart using index from product list
async function addToCart(index) {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        const product = products[index];

        const addRes = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: index,
                name: product.name,
                price: product.price
            })
        });

        if (addRes.status === 401) {
            alert("Please login to add items to your cart.");
            return;
        }

        const result = await addRes.json();
        alert(result.message || "Added to cart!");

        updateCartCount();
    } catch (err) {
        console.error('Error adding to cart:', err);
    }
}

// Update cart count in header
async function updateCartCount() {
    try {
        const res = await fetch('/api/cart');
        if (res.status !== 200) return;

        const data = await res.json();
        const totalQty = data.items.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart').innerText = `🛒 Cart (${totalQty})`;
    } catch (err) {
        console.error('Error updating c
