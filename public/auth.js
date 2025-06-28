// Register
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.onsubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData(regForm);
        const res = await fetch('/api/register', {
            method: 'POST',
            body: new URLSearchParams(formData)
        });
        const result = await res.json();
        alert(result.success ? "Registered!" : result.message);
        if (result.success) window.location.href = 'login.html';
    };
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.onsubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const res = await fetch('/api/login', {
            method: 'POST',
            body: new URLSearchParams(formData)
        });
        const result = await res.json();
        alert(result.success ? "Login successful" : result.message);
        if (result.success) window.location.href = 'index.html';
    };
}