// Register
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.onsubmit = async (e) => {
        e.preventDefault();

        const data = {
            username: regForm.username.value,
            email: regForm.email.value,
            password: regForm.password.value,
            mobile: regForm.mobile.value,
            address: regForm.address.value,
            pincode: regForm.pincode.value
        };

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.success ? "Registered!" : result.message);
        if (result.success) {
            window.location.href = 'login.html';
        }
    };
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.onsubmit = async (e) => {
        e.preventDefault();

        const data = {
            email: loginForm.email.value,
            password: loginForm.password.value
        };

        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.success ? "Login successful!" : result.message);
        if (result.success) {
            window.location.href = 'index.html';
        }
    };
}
