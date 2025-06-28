async function loadCart() {
    const res = await fetch('/api/cart');
    const data = await res.json();
    const items = data.items;

    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');

    let total = 0;

    if (items.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    container.innerHTML = '';

    items.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
        <p>${item.name} - $${item.price} × ${item.quantity}</p>
        <button onclick="removeItem(${index})">Remove</button>
      `;
        container.appendChild(div);
    });

    totalElement.innerText = `Total: $${total}`;
}

async function removeItem(index) {
    await fetch(`/api/cart/remove/${index}`, { method: 'DELETE' });
    loadCart(); // reload after removal
}

loadCart();