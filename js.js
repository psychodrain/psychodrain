// ===== ДАННЫЕ =====
const products = [
    { id: 1, name: "Хлопок голубой", category: "cotton", categoryName: "Хлопок", price: 450, unit: "руб/кг",
      desc: "Мягкий натуральный хлопок, идеален для детской одежды",
      fullDesc: "Этот нежный голубой хлопок — отличный выбор для создания детской одежды, пелёнок и постельного белья.",
      image: "https://image.qwenlm.ai/public_source/76bb5dd4-4f72-4671-b805-d03a52364dad/113179300-6f1d-481e-97a2-69c5d976b55f.png",
      specs: { "Состав": "100% хлопок", "Плотность": "130 г/м²", "Ширина": "150 см" },
      care: ["Стирка при 40°C", "Не отбеливать"]
    },
    { id: 2, name: "Лён натуральный", category: "linen", categoryName: "Лён", price: 680, unit: "руб/кг",
      desc: "Экологичный натуральный лён для летней одежды",
      fullDesc: "Натуральный лён высшего качества — дышащий, гипоаллергенный и невероятно прочный.",
      image: "https://image.qwenlm.ai/public_source/76bb5dd4-4f72-4671-b805-d03a52364dad/192becfc4-eb89-4cb0-af92-988c3c1f3855.png",
      specs: { "Состав": "100% лён", "Плотность": "170 г/м²", "Ширина": "140 см" },
      care: ["Стирка при 60°C", "Гладить горячим утюгом"]
    },
    { id: 3, name: "Шёлк бордовый", category: "silk", categoryName: "Шёлк", price: 1200, unit: "руб/кг",
      desc: "Элегантный шёлк с мягким блеском",
      fullDesc: "Роскошный шёлк глубокого бордового цвета с благородным блеском.",
      image: "https://image.qwenlm.ai/public_source/76bb5dd4-4f72-4671-b805-d03a52364dad/11058c96f-22a0-439d-9d36-4c94b66c6fcc.png",
      specs: { "Состав": "100% шёлк", "Плотность": "80 г/м²", "Ширина": "140 см" },
      care: ["Ручная стирка", "Температура до 30°C"]
    },
    { id: 4, name: "Бархат изумрудный", category: "velvet", categoryName: "Бархат", price: 950, unit: "руб/кг",
      desc: "Роскошный бархат глубокого зелёного цвета",
      fullDesc: "Великолепный бархат насыщенного изумрудного оттенка.",
      image: "https://image.qwenlm.ai/public_source/76bb5dd4-4f72-4671-b805-d03a52364dad/1b2f8ef85-13d9-4acf-ac6c-529961460d18.png",
      specs: { "Состав": "Полиэстер/Вискоза", "Плотность": "280 г/м²", "Ширина": "150 см" },
      care: ["Химчистка", "Не гладить по ворсу"]
    },
    { id: 5, name: "Хлопок жёлтый", category: "cotton", categoryName: "Хлопок", price: 420, unit: "руб/кг",
      desc: "Яркий хлопковый текстиль для пэчворка",
      fullDesc: "Солнечный жёлтый хлопок — идеальная основа для пэчворка.",
      image: "https://image.qwenlm.ai/public_source/76bb5dd4-4f72-4671-b805-d03a52364dad/189633bff-286e-4432-a1c3-f9885fc41b17.png",
      specs: { "Состав": "100% хлопок", "Плотность": "120 г/м²", "Ширина": "110 см" },
      care: ["Стирка при 40°C", "Не отбеливать"]
    }
];

const categories = [
    { id: 'all', name: 'Все ткани' },
    { id: 'cotton', name: 'Хлопок' },
    { id: 'linen', name: 'Лён' },
    { id: 'silk', name: 'Шёлк' },
    { id: 'velvet', name: 'Бархат' }
];

let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentCategory = 'all';
let currentProduct = null;

// запуск
window.onload = function() {
    if (!localStorage.getItem('orders')) localStorage.setItem('orders', '[]');
    if (document.getElementById('productsGrid')) {
        showCategories();
        showProducts();
    }
    updateCartCount();
};

// ===== КАТЕГОРИИ =====
function showCategories() {
    const container = document.getElementById('categories');
    if (!container) return;
    container.innerHTML = categories.map(cat => 
        `<button class="category-btn ${cat.id === currentCategory ? 'active' : ''}" onclick="filterBy('${cat.id}')">${cat.name}</button>`
    ).join('');
}

function filterBy(catId) {
    currentCategory = catId;
    showCategories();
    showProducts();
}

//товары
function showProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    let filtered = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);
    
    if (filtered.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:20px;">Товаров нет</p>';
        return;
    }
    
    container.innerHTML = filtered.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
            <div class="product-info">
                <div class="product-category">${p.categoryName}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-desc">${p.desc}</div>
                <div class="product-footer">
                    <div class="product-price">${p.price} ₽ <small>/кг</small></div>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${p.id})">+ В корзину</button>
                </div>
            </div>
        </div>
    `).join('');
}

// окна товаров
function openModal(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;
    
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    document.getElementById('modalProductTitle').textContent = currentProduct.name;
    document.getElementById('modalProductBody').innerHTML = `
        <div class="pd-grid">
            <div>
                <img src="${currentProduct.image}" alt="${currentProduct.name}" style="width:100%;border-radius:8px;">
            </div>
            <div class="pd-info">
                <span class="pd-category">${currentProduct.categoryName}</span>
                <h2 class="pd-name">${currentProduct.name}</h2>
                <div class="pd-price-block">
                    <span class="pd-price">${currentProduct.price} ₽</span>
                    <span class="pd-price-unit">за 1 кг</span>
                </div>
                <p class="pd-desc">${currentProduct.fullDesc}</p>
                
                <div class="pd-weight-selector">
                    <label>Вес (кг):</label>
                    <input type="number" id="pdWeight" value="0.5" min="0.1" max="50" step="0.1" style="width:80px;">
                    <span id="pdWeightTotal">${(currentProduct.price * 0.5).toFixed(0)} ₽</span>
                </div>
                
                <button class="pd-add-btn" onclick="addFromModal()">Добавить в корзину</button>
                
                <details>
                    <summary>Характеристики</summary>
                    <ul>${Object.entries(currentProduct.specs).map(([k,v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('')}</ul>
                </details>
                <details>
                    <summary>Уход</summary>
                    <ul>${currentProduct.care.map(item => `<li>${item}</li>`).join('')}</ul>
                </details>
            </div>
        </div>
    `;
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Обновление цены при изменении веса
    document.getElementById('pdWeight').oninput = function() {
        const w = parseFloat(this.value) || 0.1;
        document.getElementById('pdWeightTotal').textContent = (currentProduct.price * w).toFixed(0) + ' ₽';
    };
}

function closeModal() {
    const m = document.getElementById('productModal');
    if (m) {
        m.classList.remove('open');
        document.body.style.overflow = '';
        currentProduct = null;
    }
}

function addFromModal() {
    if (!currentProduct) return;
    const weight = parseFloat(document.getElementById('pdWeight').value) || 0.5;
    
    const existing = cart.find(item => item.id === currentProduct.id);
    if (existing) {
        existing.qty += weight;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image,
            qty: weight
        });
    }
    
    saveCart();
    updateCartCount();
    showToast(`${currentProduct.name} добавлен!`);
    closeModal();
}

// корзина
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.qty += 0.5;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 0.5
        });
    }
    
    saveCart();
    updateCartCount();
    showToast(`${product.name} в корзине`);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    if (count > 0) {
        badge.style.display = 'flex';
        badge.textContent = count.toFixed(1);
    } else {
        badge.style.display = 'none';
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (!sidebar) return;
    
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay?.classList.remove('open');
        document.body.style.overflow = '';
    } else {
        renderCart();
        sidebar.classList.add('open');
        overlay?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function renderCart() {
    const container = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');
    const totalEl = document.getElementById('cartTotal');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Корзина пуста</p>';
        if (footer) footer.style.display = 'none';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${(item.price * item.qty).toFixed(0)} ₽</div>
                <div>
                    <button onclick="changeQty(${item.id}, -0.1)">−</button>
                    <span>${item.qty.toFixed(1)} кг</span>
                    <button onclick="changeQty(${item.id}, 0.1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background:none;border:none;font-size:18px;cursor:pointer;">✕</button>
        </div>
    `).join('');
    
    if (footer) {
        footer.style.display = 'block';
        totalEl.textContent = cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(0) + ' ₽';
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    renderCart();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty = Math.max(0.1, parseFloat((item.qty + delta).toFixed(1)));
        if (item.qty <= 0.1) removeFromCart(id);
        else {
            saveCart();
            renderCart();
            updateCartCount();
        }
    }
}

//заказ
function openCheckout() {
    if (cart.length === 0) return;
    toggleCart();
    
    setTimeout(() => {
        const summary = document.getElementById('orderSummary');
        if (summary) {
            summary.innerHTML = `
                <h4>Ваш заказ:</h4>
                ${cart.map(i => `<div>${i.name} × ${i.qty.toFixed(1)} кг — ${(i.price*i.qty).toFixed(0)} ₽</div>`).join('')}
                <div style="margin-top:10px;font-weight:bold;">Итого: ${cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(0)} ₽</div>
            `;
        }
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }, 200);
}

function closeCheckout() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        document.getElementById('orderForm')?.reset();
    }
}

function submitOrder(e) {
    e.preventDefault();
    
    const order = {
        id: Date.now(),
        date: new Date().toLocaleString('ru-RU'),
        customer: {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value,
            city: document.getElementById('customerCity').value,
            address: document.getElementById('customerAddress').value,
            comment: document.getElementById('customerComment').value
        },
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
        status: 'new'
    };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    const body = document.getElementById('checkoutBody');
    if (body) {
        body.innerHTML = `
            <div style="text-align:center;padding:20px;">
                <div style="font-size:40px;margin-bottom:10px;">✓</div>
                <h3>Заказ оформлен!</h3>
                <p>Номер: #${String(order.id).slice(-6)}</p>
                <button class="btn-primary" style="margin-top:20px;" onclick="closeCheckout();location.reload();">Отлично!</button>
            </div>
        `;
    }
    
    cart = [];
    saveCart();
    updateCartCount();
    showToast('Спасибо за заказ!');
}

// админ
function handleAdminLogin(e) {
    e.preventDefault();
    const login = document.getElementById('loginUsername').value;
    const pass = document.getElementById('loginPassword').value;
    
    if (login === 'admin' && pass === 'admin123') {
        document.getElementById('authModal')?.classList.remove('open');
        window.location.href = 'admin.html';
    } else {
        alert('Неверный логин или пароль');
    }
}

function renderAdminPanel() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Статистика
    const stats = document.getElementById('adminStats');
    if (stats) {
        const total = orders.reduce((sum, o) => sum + o.total, 0);
        const newCount = orders.filter(o => o.status === 'new').length;
        stats.innerHTML = `
            <div class="admin-stat-card"><div>Заказов</div><div>${orders.length}</div></div>
            <div class="admin-stat-card"><div>Новых</div><div style="color:green">${newCount}</div></div>
            <div class="admin-stat-card"><div>Сумма</div><div>${total.toLocaleString('ru-RU')} ₽</div></div>
        `;
    }
    
    // Таблица заказов
    const tbody = document.getElementById('ordersBody');
    const table = document.getElementById('ordersTable');
    const noOrders = document.getElementById('noOrders');
    
    if (!tbody || !table) return;
    
    if (orders.length === 0) {
        table.style.display = 'none';
        if (noOrders) noOrders.style.display = 'block';
        return;
    }
    
    if (noOrders) noOrders.style.display = 'none';
    table.style.display = '';
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${String(order.id).slice(-6)}</td>
            <td>${order.date}</td>
            <td>${order.customer.name}</td>
            <td>${order.customer.phone}</td>
            <td>${order.items.map(i => i.name).join(', ')}</td>
            <td><strong>${order.total.toLocaleString('ru-RU')} ₽</strong></td>
            <td>
                <select onchange="updateStatus(${order.id}, this.value)" style="padding:4px;">
                    <option value="new" ${order.status==='new'?'selected':''}>Новый</option>
                    <option value="processing" ${order.status==='processing'?'selected':''}>В работе</option>
                    <option value="completed" ${order.status==='completed'?'selected':''}>Завершён</option>
                </select>
            </td>
            <td><button onclick="if(confirm('Удалить?')) deleteOrder(${order.id})">✕</button></td>
        </tr>
    `).join('');
}

function updateStatus(id, status) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        showToast('Статус обновлён');
    }
}

function deleteOrder(id) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem('orders', JSON.stringify(orders));
    renderAdminPanel();
    showToast('Заказ удалён');
}

function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// Закрытие
document.addEventListener('click', (e) => {
    if (e.target.id === 'productModal') closeModal();
    if (e.target.id === 'checkoutModal') closeCheckout();
    if (e.target.id === 'authModal') {
        document.getElementById('authModal')?.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// Закрытие
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeCheckout();
        document.getElementById('authModal')?.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// маска для телефона
document.addEventListener('DOMContentLoaded', () => {
    const phone = document.getElementById('customerPhone');
    if (phone) {
        phone.addEventListener('input', function() {
            let v = this.value.replace(/\D/g, '').slice(0, 11);
            if (v.startsWith('8')) v = '7' + v.slice(1);
            if (!v.startsWith('7')) v = '7' + v;
            
            let formatted = '+7';
            if (v.length > 1) formatted += ' (' + v.slice(1, 4);
            if (v.length >= 4) formatted += ') ' + v.slice(4, 7);
            if (v.length >= 7) formatted += '-' + v.slice(7, 9);
            if (v.length >= 9) formatted += '-' + v.slice(9, 11);
            
            this.value = formatted;
        });
    }
});
