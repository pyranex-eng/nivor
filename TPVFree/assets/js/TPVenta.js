// Polyfills para mejor compatibilidad
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

// Polyfill para Object.entries
if (!Object.entries) {
    Object.entries = function(obj) {
        var ownProps = Object.keys(obj),
            i = ownProps.length,
            resArray = new Array(i);
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        
        return resArray;
    };
}

// Función para descargar plantilla de importación
function downloadImportTemplate() {
    const templateData = [
        ['Nombre', 'Categoria', 'Cantidad', 'Precio', 'Costo', 'CodigoBarras', 'Marca', 'Modelo', 'Ubicacion', 'StockMinimo', 'StockMaximo'],
        ['Ejemplo Producto', 'Categoria Ejemplo', '10', '100.00', '50.00', '123456789', 'Marca Ejemplo', 'Modelo Ejemplo', 'Ubicación', '5', '100']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Plantilla");
    
    XLSX.writeFile(wb, "plantilla_importacion_nivor.xlsx");
    showNotification('Plantilla descargada correctamente', 'success');
}

        // Array para almacenar los productos
        let products = JSON.parse(localStorage.getItem('inventory')) || [];
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let editingIndex = -1;
        let saleHistory = JSON.parse(localStorage.getItem('sales')) || [];
        
        // Elementos del DOM
        const productForm = document.getElementById('product-form');
        const inventoryBody = document.getElementById('inventory-body');
        const alertBox = document.getElementById('alert-box');
        const submitBtn = document.getElementById('submit-btn');
        const searchInput = document.getElementById('search');
        const productSelect = document.getElementById('product-select');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const saleReceipt = document.getElementById('sale-receipt');
        const receiptContent = document.getElementById('receipt-content');
        const mobileTabs = document.querySelectorAll('.mobile-tab');
        const sections = document.querySelectorAll('.form-section, .inventory-section, .sales-section, .history-section');
        const collapseToggles = document.querySelectorAll('.collapse-toggle');
        const barcodeSearchInput = document.getElementById('barcode-search');
        const categorySelect = document.getElementById('category');
        const excelFileInput = document.getElementById('excel-file');
        
        // Elementos para estadísticas
        const totalProductsElement = document.getElementById('total-products');
        const totalInventoryValueElement = document.getElementById('total-inventory-value');
        const lowStockCountElement = document.getElementById('low-stock-count');
        const totalSalesElement = document.getElementById('total-sales');
        const totalRevenueElement = document.getElementById('total-revenue');
        const averageSaleElement = document.getElementById('average-sale');
        const productsCountElement = document.getElementById('products-count');
        const storageUsedElement = document.getElementById('storage-used');
        
        // Inicializar la aplicación
        initializeApp();
        // Agrega esto después de initializeApp() para verificar que todo esté funcionando
console.log('Input de Excel:', document.getElementById('excel-file'));
console.log('Función handleExcelImport:', typeof handleExcelImport);
        function initializeApp() {
            updateCategoryOptions();
            renderInventory();
            updateProductSelect();
            renderCart();
            renderSalesHistory();
            updateStatistics();
            setupMobileNavigation();
            setupCollapseToggles();
            renderCharts();
            setupBarcodeSearch();
            updateStorageInfo();
            initParticles();
            initMatrix();
            setupExcelImport();
        }
        
        // =============================================
        // FUNCIONALIDADES DEL SISTEMA DE INVENTARIO
        // =============================================
        
        // Actualizar opciones de categoria
        function updateCategoryOptions() {
            // Obtener categorías únicas de los productos existentes
            const existingCategories = [...new Set(products.map(p => p.category))];
            
            // Categorías base del Excel
            const baseCategories = ["", "", ""];
            
            // Combinar y eliminar duplicados
            const allCategories = [...new Set([...baseCategories, ...existingCategories])];
            
            // Limpiar select
            categorySelect.innerHTML = '<option value="">Seleccione una categoría</option>';
            
            // Agregar opciones
            allCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        }
        
        // Configurar importación desde Excel
        function setupExcelImport() {
    const fileInput = document.getElementById('excel-file');
    if (fileInput) {
        fileInput.addEventListener('change', handleExcelImport);
        console.log('Input de Excel configurado correctamente');
    } else {
        console.error('No se encontró el input de archivo Excel');
        // Reintentar después de un breve periodo si el DOM no está listo
        setTimeout(setupExcelImport, 100);
    }
    }

// Función para manejar la importación desde Excel
function handleExcelImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    const validExtensions = ['.xlsx', '.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const fileType = file.type;
    
    if (!validExtensions.includes(fileExtension) && !validExtensions.includes(fileType)) {
        showNotification('Formato de archivo no válido. Por favor use un archivo Excel (.xlsx o .xls)', 'error');
        event.target.value = ''; // Limpiar input
        return;
    }
    
    // Mostrar barra de progreso
    const exportProgress = document.getElementById('export-progress');
    exportProgress.style.display = 'block';
    updateProgress(10);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            updateProgress(30);
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Verificar que el libro tenga hojas
            if (workbook.SheetNames.length === 0) {
                throw new Error('El archivo Excel no contiene hojas');
            }
            
            // Obtener la primera hoja
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // Convertir a JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            console.log('Datos importados:', jsonData);
            updateProgress(70);
            
            // Procesar los datos
            if (jsonData && jsonData.length > 0) {
                processExcelData(jsonData);
                updateProgress(100);
            } else {
                showNotification('El archivo Excel está vacío o no tiene formato válido', 'error');
                exportProgress.style.display = 'none';
            }
        } catch (error) {
            console.error('Error al procesar el archivo:', error);
            showNotification('Error al procesar el archivo Excel: ' + error.message, 'error');
            exportProgress.style.display = 'none';
        }
    };
    
    reader.onerror = function() {
        showNotification('Error al leer el archivo', 'error');
        exportProgress.style.display = 'none';
    };
    
    reader.readAsArrayBuffer(file);
}
        
        // Mover showNotification fuera de initializeApp
function showNotification(message, type = '') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    
    if (!notification || !messageElement) return;
    
    messageElement.textContent = message;
    notification.className = 'notification';
    
    if (type) {
        notification.classList.add(type);
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
        // Limpiar input de archivo
            document.getElementById('excel-file').value = '';
        

// Función para actualizar la barra de progreso
function updateProgress(percentage) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill && progressText) {
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
    }
}
        
        // Mostrar alerta
        function showAlert(message, type) {
            alertBox.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
            setTimeout(() => {
                alertBox.innerHTML = '';
            }, 5000);
        }
        
        // Actualizar información de almacenamiento
        function updateStorageInfo() {
            const productsCount = products.length;
            const storageSize = new Blob([JSON.stringify(products)]).size;
            
            productsCountElement.textContent = productsCount;
            storageUsedElement.textContent = `${(storageSize / 1024).toFixed(2)} KB`;
        }
        
        // =============================================
        // FUNCIONALIDADES EXISTENTES DEL SISTEMA
        // =============================================
        
        // Configurar búsqueda por código de barras
        function setupBarcodeSearch() {
            barcodeSearchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchByBarcode();
                }
            });
        }
        
        // Buscar por código de barras
        function searchByBarcode() {
            const barcode = barcodeSearchInput.value.trim();
            if (!barcode) return;
            
            const product = products.find(p => p.barcode === barcode);
            if (product) {
                // Seleccionar el producto en el menú desplegable
                productSelect.value = product.id;
                // Enfocar en la cantidad
                document.getElementById('sale-quantity').focus();
                showAlert(`Producto encontrado: ${product.name}`, 'success');
            } else {
                showAlert('No se encontró ningún producto con ese código de barras', 'error');
            }
        }
        
        // Configurar navegación móvil
        function setupMobileNavigation() {
            mobileTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.getAttribute('data-target');
                    
                    // Actualizar pestañas activas
                    mobileTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Mostrar sección correspondiente
                    sections.forEach(section => {
                        if (section.id === target) {
                            section.classList.add('active');
                        } else {
                            section.classList.remove('active');
                        }
                    });
                });
            });
        }
        
        // Configurar botones de colapso
        function setupCollapseToggles() {
            collapseToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const section = toggle.closest('section');
                    const content = section.querySelector('.section-content');
                    
                    if (content.style.display === 'none') {
                        content.style.display = 'block';
                        toggle.textContent = '−';
                    } else {
                        content.style.display = 'none';
                        toggle.textContent = '+';
                    }
                });
            });
        }
        
        // Inicializar partículas para el fondo
        function initParticles() {
            const canvas = document.getElementById('particle-canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const particles = [];
            const particleCount = 100;
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: `rgba(${100 + Math.floor(Math.random() * 155)}, ${100 + Math.floor(Math.random() * 155)}, 255, ${0.5 + Math.random() * 0.5})`
                });
            }
            
            function drawParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                particles.forEach(particle => {
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                    ctx.fillStyle = particle.color;
                    ctx.fill();
                    
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    
                    if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                    if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                });
                
                requestAnimationFrame(drawParticles);
            }
            
            drawParticles();
            
            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }
        
        // Inicializar efecto Matrix para el fondo
        function initMatrix() {
            const canvas = document.getElementById('matrix-canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz0123456789$#@%&!?$#@%&!?';
            const fontSize = 12;
            const columns = canvas.width / fontSize;
            
            const drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = 1;
            }
            
            function drawMatrix() {
                ctx.fillStyle = 'rgba(10, 15, 30, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#0f0';
                ctx.font = `${fontSize}px monospace`;
                
                for (let i = 0; i < drops.length; i++) {
                    const text = letters[Math.floor(Math.random() * letters.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    
                    drops[i]++;
                }
                
                setTimeout(drawMatrix, 50);
            }
            
            drawMatrix();
            
            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }
        
        // Renderizar inventario
        function renderInventory() {
            inventoryBody.innerHTML = '';
            
            if (products.length === 0) {
                inventoryBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay productos en el inventario</td></tr>';
                return;
            }
            
            products.forEach((product, index) => {
                const row = document.createElement('tr');
                
                // Resaltar productos con stock bajo
                const isLowStock = product.quantity <= (product.minStock || 5);
                const stockClass = isLowStock ? 'low-stock' : '';
                
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td class="${stockClass}">${product.quantity}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td class="actions">
                        <button class="btn-edit" onclick="editProduct(${index})">Editar</button>
                        <button class="btn-delete" onclick="deleteProduct(${index})">Eliminar</button>
                    </td>
                `;
                
                inventoryBody.appendChild(row);
            });
        }
        
        // Actualizar selector de productos para ventas
        function updateProductSelect() {
            productSelect.innerHTML = '<option value="">Seleccione un producto</option>';
            
            products.forEach(product => {
                if (product.quantity > 0) {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.textContent = `${product.name} - $${product.price.toFixed(2)} (Stock: ${product.quantity})`;
                    productSelect.appendChild(option);
                }
            });
        }
        
        // Agregar producto al carrito
function addToCart() {
    const productId = productSelect.value; // Mantener como string
    const quantityInput = document.getElementById('sale-quantity');
    const quantity = parseInt(quantityInput.value) || 1;

    // Validación básica
    if (!productId) {
        showAlert('Por favor seleccione un producto', 'error');
        return;
    }

    if (quantity <= 0) {
        showAlert('La cantidad debe ser mayor a 0', 'error');
        return;
    }

    // Buscar el producto usando comparación de strings para evitar problemas de precisión
    const productIndex = products.findIndex(p => p.id.toString() === productId);
    
    if (productIndex === -1) {
        console.log('Producto no encontrado. ID buscado:', productId);
        console.log('IDs disponibles:', products.map(p => p.id.toString()));
        showAlert('Producto no encontrado', 'error');
        return;
    }
    
    const product = products[productIndex];
    
    // Verificar que el producto no esté agotado
    if (product.quantity === 0) {
        showAlert('Este producto está agotado', 'error');
        return;
    }
    
    if (quantity > product.quantity) {
        showAlert(`No hay suficiente stock. Solo hay ${product.quantity} disponibles.`, 'error');
        return;
    }
    
    // Verificar si el producto ya está en el carrito
    const cartItemIndex = cart.findIndex(item => item.id === productId);
    
    if (cartItemIndex !== -1) {
        // Actualizar cantidad si ya está en el carrito
        const newQuantity = cart[cartItemIndex].quantity + quantity;
        
        if (newQuantity > product.quantity) {
            showAlert(`No hay suficiente stock. Solo hay ${product.quantity} disponibles.`, 'error');
            return;
        }
        
        cart[cartItemIndex].quantity = newQuantity;
    } else {
        // Agregar nuevo item al carrito
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }
    
    // Guardar carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar vista del carrito
    renderCart();
    
    // Limpiar selección
    productSelect.value = '';
    quantityInput.value = '1';
    
    showAlert('Producto agregado al carrito', 'success');
}
        
        // Renderizar carrito
        function renderCart() {
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                cartTotal.textContent = 'Total: $0.00';
                return;
            }
            
            emptyCartMessage.style.display = 'none';
            
            let total = 0;
            
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div>
                        <strong>${item.name}</strong>
                        <div>$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</div>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartItemQuantity(${index}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, ${item.quantity + 1})">+</button>
                        <button class="btn-delete" onclick="removeFromCart(${index})">Eliminar</button>
                    </div>
                `;
                
                cartItems.appendChild(itemElement);
            });
            
            cartTotal.textContent = `Total: $${total.toFixed(2)}`;
        }
        
        // Actualizar cantidad de item en carrito
        function updateCartItemQuantity(index, newQuantity) {
            const productId = cart[index].id;
            const product = products.find(p => p.id.toString() === productId.toString());
            
            if (!product) {
                showAlert('Producto no encontrado', 'error');
                return;
            }
            
            if (newQuantity < 1) {
                removeFromCart(index);
                return;
            }
            
            if (newQuantity > product.quantity) {
                showAlert(`No hay suficiente stock. Solo hay ${product.quantity} disponibles.`, 'error');
                return;
            }
            
            cart[index].quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
        
        // Eliminar item del carrito
        function removeFromCart(index) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
        
        // Procesar venta
    function processSale() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }
    
    // Verificar stock antes de mostrar el modal de pago
    for (const item of cart) {
        const product = products.find(p => p.id.toString() === item.id.toString());
        if (!product) {
            showNotification(`El producto "${item.name}" ya no existe`, 'error');
            return;
        }
        
        if (item.quantity > product.quantity) {
            showNotification(`Stock insuficiente de "${item.name}"`, 'error');
            return;
        }
    }
    
    // Calcular total y mostrar modal
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showPaymentModal(total);
    }

// Función para mostrar el modal de pago
function showPaymentModal(total) {
    const modal = document.getElementById('payment-modal');
    const paymentTotal = document.getElementById('payment-total-amount');
    const amountReceived = document.getElementById('amount-received');
    const changeAmount = document.getElementById('change-amount');
    
    paymentTotal.textContent = `$${total.toFixed(2)}`;
    amountReceived.value = '';
    changeAmount.textContent = '$0.00';
    
    // Mostrar modal
    modal.style.display = 'flex';
    
    // Enfocar en el input de cantidad recibida
    setTimeout(() => {
        amountReceived.focus();
    }, 100);
    
    // Calcular cambio en tiempo real
    amountReceived.addEventListener('input', function() {
        const received = parseFloat(this.value) || 0;
        const change = received - total;
        
        if (change >= 0) {
            changeAmount.textContent = `$${change.toFixed(2)}`;
            changeAmount.style.color = '#7eb3ff';
        } else {
            changeAmount.textContent = `-$${Math.abs(change).toFixed(2)}`;
            changeAmount.style.color = '#ff4757';
        }
    });
}

// Función para cerrar el modal de pago
function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
}

// Función para confirmar el pago y procesar la venta
function confirmPayment() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const amountReceived = parseFloat(document.getElementById('amount-received').value);
    
    if (isNaN(amountReceived)) {
        showAlert('Por favor ingrese una cantidad válida', 'error');
        return;
    }
    
    if (amountReceived < total) {
        showAlert('La cantidad recibida es menor al total a pagar', 'error');
        return;
    }
    
    const paymentMethod = document.getElementById('payment-method').value;
    const change = amountReceived - total;
    
    // Cerrar modal
    closePaymentModal();
    
    // Verificar stock antes de procesar la venta
    for (const item of cart) {
        const productIndex = products.findIndex(p => p.id.toString() === item.id.toString());
        
        if (productIndex === -1) {
            showAlert(`El producto "${item.name}" ya no existe en el inventario`, 'error');
            return;
        }
        
        if (item.quantity > products[productIndex].quantity) {
            showAlert(`No hay suficiente stock de "${item.name}". Solo hay ${products[productIndex].quantity} disponibles.`, 'error');
            return;
        }
    }
    
    // Actualizar inventario y registrar venta
    const saleItems = [];
    
    for (const item of cart) {
        const productIndex = products.findIndex(p => p.id.toString() === item.id.toString());
        
        // Reducir stock
        products[productIndex].quantity -= item.quantity;
        
        // Agregar a items de venta
        saleItems.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        });
    }
    
    // Registrar venta con información de pago
    const sale = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: saleItems,
        total: total,
        paymentMethod: paymentMethod,
        amountReceived: amountReceived,
        change: change
    };
    
    saleHistory.unshift(sale);
    localStorage.setItem('sales', JSON.stringify(saleHistory));
    
    // Guardar inventario actualizado
    localStorage.setItem('inventory', JSON.stringify(products));
    
    // Limpiar carrito
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar vistas
    renderCart();
    renderInventory();
    updateProductSelect();
    renderSalesHistory();
    updateStatistics();
    renderCharts();
    
    // Mostrar recibo con información de pago
    showReceipt(sale);
    
    showAlert(`Venta procesada exitosamente. Cambio: $${change.toFixed(2)}`, 'success');
}

// Modificar la función showReceipt para incluir información de pago
function showReceipt(sale) {
    receiptContent.innerHTML = `
        <p><strong>ID de Venta:</strong> ${sale.id}</p>
        <p><strong>Fecha:</strong> ${new Date(sale.date).toLocaleString()}</p>
        <p><strong>Método de Pago:</strong> ${sale.paymentMethod}</p>
        ${sale.amountReceived ? `<p><strong>Recibido:</strong> $${sale.amountReceived.toFixed(2)}</p>` : ''}
        ${sale.change !== undefined ? `<p><strong>Cambio:</strong> $${sale.change.toFixed(2)}</p>` : ''}
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${sale.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p><strong>Total: $${sale.total.toFixed(2)}</strong></p>
    `;
    
    saleReceipt.style.display = 'block';
}
        
        // Renderizar historial de ventas
        function renderSalesHistory() {
            const salesBody = document.getElementById('sales-body');
            salesBody.innerHTML = '';
            
            if (saleHistory.length === 0) {
                salesBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay ventas registradas</td></tr>';
                return;
            }
            
            saleHistory.forEach(sale => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sale.id}</td>
                    <td>${new Date(sale.date).toLocaleString()}</td>
                    <td>${sale.items.length} productos</td>
                    <td>$${sale.total.toFixed(2)}</td>
                    <td>${sale.paymentMethod}</td>
                `;
                
                salesBody.appendChild(row);
            });
        }
        
        // Actualizar estadísticas
        function updateStatistics() {
            // Estadísticas de inventario
            totalProductsElement.textContent = products.length;
            
            const totalInventoryValue = products.reduce((sum, product) => {
                return sum + (product.cost * product.quantity);
            }, 0);
            
            totalInventoryValueElement.textContent = `$${totalInventoryValue.toFixed(2)}`;
            
            const lowStockCount = products.filter(product => {
                return product.quantity <= (product.minStock || 5);
            }).length;
            
            lowStockCountElement.textContent = lowStockCount;
            
            // Estadísticas de ventas
            totalSalesElement.textContent = saleHistory.length;
            
            const totalRevenue = saleHistory.reduce((sum, sale) => sum + sale.total, 0);
            totalRevenueElement.textContent = `$${totalRevenue.toFixed(2)}`;
            
            const averageSale = saleHistory.length > 0 ? totalRevenue / saleHistory.length : 0;
            averageSaleElement.textContent = `$${averageSale.toFixed(2)}`;
        }
        
        // Renderizar gráficas
        function renderCharts() {
            renderCategoryChart();
            renderDailySalesChart();
        }
        
        // Gráfica de ventas por categoria
        function renderCategoryChart() {
            const categorySales = {};
            
            saleHistory.forEach(sale => {
                sale.items.forEach(item => {
                    const product = products.find(p => p.id === item.id);
                    if (product) {
                        const category = product.category;
                        if (!categorySales[category]) {
                            categorySales[category] = 0;
                        }
                        categorySales[category] += item.quantity;
                    }
                });
            });
            
            const ctx = document.getElementById('categoryChart').getContext('2d');
            
            if (window.categoryChartInstance) {
                window.categoryChartInstance.destroy();
            }
            
            if (Object.keys(categorySales).length === 0) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.font = '14px Arial';
                ctx.fillStyle = '#e0e0ff';
                ctx.textAlign = 'center';
                ctx.fillText('No hay datos de ventas por categoría', ctx.canvas.width / 2, ctx.canvas.height / 2);
                return;
            }
            
            window.categoryChartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(categorySales),
                    datasets: [{
                        data: Object.values(categorySales),
                        backgroundColor: [
                            'rgba(106, 17, 203, 0.8)',
                            'rgba(37, 117, 252, 0.8)',
                            'rgba(255, 159, 67, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(153, 102, 255, 0.8)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#e0e0ff'
                            }
                        },
                        title: {
                            display: false
                        }
                    }
                }
            });
        }
        
        // Gráfica de ventas por día
        function renderDailySalesChart() {
            const dailySales = {};
            
            saleHistory.forEach(sale => {
                const date = new Date(sale.date).toLocaleDateString();
                if (!dailySales[date]) {
                    dailySales[date] = 0;
                }
                dailySales[date] += sale.total;
            });
            
            const ctx = document.getElementById('dailySalesChart').getContext('2d');
            
            if (window.dailySalesChartInstance) {
                window.dailySalesChartInstance.destroy();
            }
            
            if (Object.keys(dailySales).length === 0) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.font = '14px Arial';
                ctx.fillStyle = '#e0e0ff';
                ctx.textAlign = 'center';
                ctx.fillText('No hay datos de ventas diarias', ctx.canvas.width / 2, ctx.canvas.height / 2);
                return;
            }
            
            // Ordenar fechas
            const sortedDates = Object.keys(dailySales).sort((a, b) => {
                return new Date(a) - new Date(b);
            });
            
            const sortedSales = sortedDates.map(date => dailySales[date]);
            
            window.dailySalesChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: sortedDates,
                    datasets: [{
                        label: 'Ventas por Día',
                        data: sortedSales,
                        borderColor: 'rgba(37, 117, 252, 1)',
                        backgroundColor: 'rgba(37, 117, 252, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#e0e0ff'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#e0e0ff'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#e0e0ff'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
        }
        
        // Buscar productos
        function searchProducts() {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length < 2) {
        showNotification('Ingrese al menos 2 caracteres para buscar', 'info');
        renderInventory(); // Mostrar todos los productos si la búsqueda es muy corta
        return;
        }
            
            if (!query) {
                renderInventory();
                return;
            }
            
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query) || 
                product.category.toLowerCase().includes(query) ||
                (product.barcode && product.barcode.toLowerCase().includes(query)) ||
                (product.brand && product.brand.toLowerCase().includes(query)) ||
                (product.model && product.model.toLowerCase().includes(query))
            );
            
            inventoryBody.innerHTML = '';
            
            if (filteredProducts.length === 0) {
                inventoryBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No se encontraron productos</td></tr>';
                return;
            }
            
            filteredProducts.forEach((product, index) => {
                const originalIndex = products.findIndex(p => p.id === product.id);
                const isLowStock = product.quantity <= (product.minStock || 5);
                const stockClass = isLowStock ? 'low-stock' : '';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td class="${stockClass}">${product.quantity}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td class="actions">
                        <button class="btn-edit" onclick="editProduct(${originalIndex})">Editar</button>
                        <button class="btn-delete" onclick="deleteProduct(${originalIndex})">Eliminar</button>
                    </td>
                `;
                
                inventoryBody.appendChild(row);
            });
        }
        
        // Buscar en ventas
        function searchSales() {
    const query = document.getElementById('search-sales').value.toLowerCase();
    const salesBody = document.getElementById('sales-body');
    
    if (!query) {
        renderSalesHistory();
        return;
    }
    
    // Filtrar ventas según la consulta
    const filteredSales = saleHistory.filter(sale => {
        return sale.id.toString().includes(query) ||
               new Date(sale.date).toLocaleString().toLowerCase().includes(query) ||
               sale.total.toString().includes(query) ||
               sale.paymentMethod.toLowerCase().includes(query);
    });
    
    salesBody.innerHTML = '';
    
    if (filteredSales.length === 0) {
        salesBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No se encontraron ventas</td></tr>';
        return;
    }
    
    filteredSales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${new Date(sale.date).toLocaleString()}</td>
            <td>${sale.items.length} productos</td>
            <td>$${sale.total.toFixed(2)}</td>
            <td>${sale.paymentMethod}</td>
        `;
        
        salesBody.appendChild(row);
    });
}
        
        // Editar producto
        function editProduct(index) {
            const product = products[index];
            
            document.getElementById('name').value = product.name;
            document.getElementById('category').value = product.category;
            document.getElementById('quantity').value = product.quantity;
            document.getElementById('price').value = product.price;
            document.getElementById('cost').value = product.cost;
            document.getElementById('barcode').value = product.barcode || '';
            document.getElementById('brand').value = product.brand || '';
            document.getElementById('model').value = product.model || '';
            document.getElementById('location').value = product.location || '';
            document.getElementById('min-stock').value = product.minStock || 5;
            document.getElementById('max-stock').value = product.maxStock || 9999;
            
            editingIndex = index;
            submitBtn.textContent = 'Actualizar Producto';
            
            // Scroll to form
            document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
            
            // Activar la pestaña de productos en móviles
            if (window.innerWidth <= 768) {
                mobileTabs.forEach(tab => tab.classList.remove('active'));
                document.querySelector(`.mobile-tab[data-target="form-section"]`).classList.add('active');
                
                sections.forEach(section => section.classList.remove('active'));
                document.getElementById('form-section').classList.add('active');
            }
        }
        
        // Eliminar producto
        function deleteProduct(index) {
            if (confirm('¿Está seguro de que desea eliminar este producto?')) {
                products.splice(index, 1);
                localStorage.setItem('inventory', JSON.stringify(products));
                renderInventory();
                updateProductSelect();
                updateStatistics();
                updateStorageInfo();
                showAlert('Producto eliminado', 'success');
            }
        }
        
        // Limpiar historial de ventas
        function clearSalesHistory() {
            if (confirm('¿Está seguro de que desea limpiar todo el historial de ventas? Esta acción no se puede deshacer.')) {
                saleHistory = [];
                localStorage.setItem('sales', JSON.stringify(saleHistory));
                renderSalesHistory();
                updateStatistics();
                renderCharts();
                showAlert('Historial de ventas limpiado', 'success');
            }
        }
        
       // Exportar datos de ventas - VERSIÓN CORREGIDA
function exportSalesData() {
    if (saleHistory.length === 0) {
        showAlert('No hay datos de ventas para exportar', 'error');
        return;
    }
    
    // Crear datos en formato CSV con formato mejorado
    let csvContent = "ID Venta,Fecha,Total,Método de Pago,Recibido,Cambio,Productos\n";
    
    saleHistory.forEach(sale => {
        const date = new Date(sale.date).toLocaleString().replace(/,/g, '');
        const total = sale.total.toFixed(2);
        const received = sale.amountReceived ? sale.amountReceived.toFixed(2) : '0.00';
        const change = sale.change !== undefined ? sale.change.toFixed(2) : '0.00';
        
        const productsList = sale.items.map(item => 
        `${item.name.replace(/"/g, '""')} (x${item.quantity})`
        ).join('; ');
        
        // Asegurar que campos con comas estén entre comillas
        csvContent += `${sale.id},${date},${total},${sale.paymentMethod},${received},${change},"${productsList}"\n`;
    });
    
    // Crear blob para mejor compatibilidad
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "ventas_nivor.csv");
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('Datos de ventas exportados correctamente', 'success');
}
        
        // Manejar envío del formulario
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const category = document.getElementById('category').value;
            const quantity = parseInt(document.getElementById('quantity').value);
            const price = parseFloat(document.getElementById('price').value);
            const cost = parseFloat(document.getElementById('cost').value);
            const barcode = document.getElementById('barcode').value;
            const brand = document.getElementById('brand').value;
            const model = document.getElementById('model').value;
            const location = document.getElementById('location').value;
            const minStock = parseInt(document.getElementById('min-stock').value) || 5;
            const maxStock = parseInt(document.getElementById('max-stock').value) || 9999;
            
            if (editingIndex === -1) {
                // Agregar nuevo producto
                const newProduct = {
                    id: Date.now(),
                    name: name,
                    category: category,
                    quantity: quantity,
                    price: price,
                    cost: cost,
                    barcode: barcode,
                    brand: brand || 'NIVOR',
                    model: model,
                    location: location || 'Servicio Digital',
                    minStock: minStock,
                    maxStock: maxStock,
                    dateAdded: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                };
                
                products.push(newProduct);
                showAlert('Producto agregado exitosamente', 'success');
            } else {
                // Actualizar producto existente
                products[editingIndex] = {
                    ...products[editingIndex],
                    name: name,
                    category: category,
                    quantity: quantity,
                    price: price,
                    cost: cost,
                    barcode: barcode,
                    brand: brand,
                    model: model,
                    location: location,
                    minStock: minStock,
                    maxStock: maxStock,
                    lastUpdated: new Date().toISOString()
                };
                
                showAlert('Producto actualizado exitosamente', 'success');
                editingIndex = -1;
                submitBtn.textContent = 'Agregar Producto';
            }
            
            // Guardar en localStorage
            localStorage.setItem('inventory', JSON.stringify(products));
            
            // Actualizar la interfaz
            updateCategoryOptions();
            renderInventory();
            updateProductSelect();
            updateStatistics();
            updateStorageInfo();
            
            // Limpiar formulario
            productForm.reset();
        });
        
        // Event listeners para búsquedas
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
        
        document.getElementById('search-sales').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchSales();
            }
        });
        
        // Inicializar tooltips para elementos con título
        document.addEventListener('DOMContentLoaded', function() {
            const elementsWithTitle = document.querySelectorAll('[title]');
            elementsWithTitle.forEach(element => {
                element.addEventListener('mouseenter', function(e) {
                    const title = this.getAttribute('title');
                    if (title) {
                        const tooltip = document.createElement('div');
                        tooltip.className = 'tooltip';
                        tooltip.textContent = title;
                        tooltip.style.position = 'absolute';
                        tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
                        tooltip.style.color = 'white';
                        tooltip.style.padding = '5px 10px';
                        tooltip.style.borderRadius = '4px';
                        tooltip.style.zIndex = '1000';
                        tooltip.style.left = e.pageX + 'px';
                        tooltip.style.top = (e.pageY - 30) + 'px';
                        
                        document.body.appendChild(tooltip);
                        
                        this.addEventListener('mouseleave', function() {
                            document.body.removeChild(tooltip);
                        });
                    }
                });
            });
        });
        // Agregar estas funciones al código JavaScript existente

// Función para mostrar opciones de exportación
function showExportOptions() {
    // Establecer fechas por defecto (últimos 30 días)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    document.getElementById('export-start-date').value = startDate.toISOString().split('T')[0];
    document.getElementById('export-end-date').value = endDate.toISOString().split('T')[0];
    
    // Mostrar modal
    document.getElementById('export-options-modal').style.display = 'flex';
}

// Función para cerrar el modal de opciones de exportación
function closeExportOptions() {
    document.getElementById('export-options-modal').style.display = 'none';
}

// Función para exportar con opciones seleccionadas
    function exportWithOptions() {
    const startDateStr = document.getElementById('export-start-date').value;
    const endDateStr = document.getElementById('export-end-date').value;
    
    // Validar que se seleccionaron ambas fechas
    if (!startDateStr || !endDateStr) {
        showAlert('Por favor seleccione un rango de fechas válido', 'error');
        return;
    }
    // Mejorar el manejo de zonas horarias
    const startDate = new Date(startDateStr + 'T00:00:00.000Z');
    const endDate = new Date(endDateStr + 'T23:59:59.999Z');

    // Ajustar a la zona horaria local
    const localStartDate = new Date(startDate.getTime() + startDate.getTimezoneOffset() * 60000);
    const localEndDate = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000);
        
    const exportFormat = document.getElementById('export-format').value;
    const includeProducts = document.getElementById('include-products').checked;
    const includePayments = document.getElementById('include-payments').checked;
    const includeCustomer = document.getElementById('include-customer').checked;
    const includeCosts = document.getElementById('include-costs').checked;
    
    // Filtrar ventas por rango de fechas
    const filteredSales = saleHistory.filter(sale => {
    const saleDate = new Date(sale.date);
    return saleDate >= new Date(startDateStr + 'T00:00:00') && 
           saleDate <= new Date(endDateStr + 'T23:59:59');
    });
    
    if (filteredSales.length === 0) {
        showAlert('No hay ventas en el rango de fechas seleccionado', 'error');
        return;
    }
    
    // Mostrar barra de progreso
    const exportProgress = document.getElementById('export-progress');
    exportProgress.style.display = 'block';
    updateProgress(0);
    
    // Usar setTimeout para permitir que la UI se actualice antes del procesamiento pesado
    setTimeout(() => {
        try {
            if (exportFormat === 'xlsx') {
                exportSalesToXLSX(filteredSales, includeProducts, includePayments, includeCustomer, includeCosts);
            } else {
                exportSalesToCSV(filteredSales, includeProducts, includePayments, includeCustomer, includeCosts);
            }
            
            updateProgress(100);
            showNotification('Datos exportados correctamente', 'success');
        } catch (error) {
            console.error('Error en exportación:', error);
            showNotification('Error al exportar los datos', 'error');
        }
        
        // Ocultar barra de progreso después de un breve momento
        setTimeout(() => {
            exportProgress.style.display = 'none';
            closeExportOptions();
        }, 1000);
    }, 500);
}

// Función para exportar a XLSX con opciones
function exportSalesToXLSX(sales, includeProducts, includePayments, includeCustomer, includeCosts) {
    // Crear un libro de trabajo
    const wb = XLSX.utils.book_new();
    
    // Hoja de resumen
    const summaryData = [
        ['Reporte de Ventas', '', '', ''],
        ['Fecha de generación', new Date().toLocaleString(), '', ''],
        ['Total de ventas', sales.length, '', ''],
        ['Ingresos totales', `$${sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}`, '', ''],
        ['', '', '', ''],
        ['ID Venta', 'Fecha', 'Total', 'Método de Pago']
    ];
    
    // Agregar datos de ventas
    sales.forEach(sale => {
        summaryData.push([
            sale.id,
            new Date(sale.date).toLocaleString(),
            sale.total,
            sale.paymentMethod
        ]);
    });
    
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Resumen");
    
    // Hoja de detalles si se solicita
    if (includeProducts) {
        const detailsData = [
            ['ID Venta', 'Producto', 'Cantidad', 'Precio Unitario', 'Total', 'Costo Unitario', 'Utilidad']
        ];
        
        sales.forEach(sale => {
            sale.items.forEach(item => {
                const product = products.find(p => p.id === item.id);
                const cost = product ? product.cost : 0;
                const profit = (item.price - cost) * item.quantity;
                
                detailsData.push([
                    sale.id,
                    item.name,
                    item.quantity,
                    item.price,
                    item.price * item.quantity,
                    cost,
                    profit
                ]);
            });
        });
        
        const detailsWs = XLSX.utils.aoa_to_sheet(detailsData);
        XLSX.utils.book_append_sheet(wb, detailsWs, "Detalles");
    }
    
    // Generar y descargar el archivo
    XLSX.writeFile(wb, `ventas_nivor_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// Función para exportar a CSV con opciones (para mantener compatibilidad)
function exportSalesToCSV(sales, includeProducts, includePayments, includeCustomer, includeCosts) {
    let csvContent = "ID Venta,Fecha,Total,Método de Pago,Recibido,Cambio,Productos\n";
    
    sales.forEach(sale => {
        const date = new Date(sale.date).toLocaleString();
        const total = sale.total.toFixed(2);
        const received = sale.amountReceived ? sale.amountReceived.toFixed(2) : '0.00';
        const change = sale.change !== undefined ? sale.change.toFixed(2) : '0.00';
        
        // Escapar comillas en los valores
        const productsList = sale.items.map(item => 
            `${item.name.replace(/"/g, '""')} (x${item.quantity})`
        ).join('; ');
        
        const escapedDate = `"${date.replace(/"/g, '""')}"`;
        const escapedProducts = `"${productsList.replace(/"/g, '""')}"`;
        
        csvContent += `${sale.id},${escapedDate},${total},${sale.paymentMethod},${received},${change},${escapedProducts}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `ventas_nivor_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Función para generar reporte detallado
function generateDetailedReport() {
    // Mostrar sección de reportes avanzados
    document.getElementById('advanced-reports-section').style.display = 'block';
    
    // Calcular métricas avanzadas
    calculateAdvancedMetrics();
    renderAdvancedCharts();
}

// Calcular métricas avanzadas
function calculateAdvancedMetrics() {
    // Calcular utilidad bruta
    let totalCost = 0;
    let totalRevenue = 0;
    
    saleHistory.forEach(sale => {
        sale.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                totalCost += product.cost * item.quantity;
                totalRevenue += item.price * item.quantity;
            }
        });
    });
    
    const grossProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    
    document.getElementById('gross-profit').textContent = `$${grossProfit.toFixed(2)}`;
    document.getElementById('profit-margin').textContent = `${profitMargin.toFixed(2)}%`;
    
    // Encontrar producto más vendido
    const productSales = {};
    saleHistory.forEach(sale => {
        sale.items.forEach(item => {
            if (!productSales[item.name]) {
                productSales[item.name] = 0;
            }
            productSales[item.name] += item.quantity;
        });
    });
    
    let bestSeller = '';
    let maxSales = 0;
    
    for (const [product, sales] of Object.entries(productSales)) {
        if (sales > maxSales) {
            maxSales = sales;
            bestSeller = product;
        }
    }
    
    document.getElementById('best-selling-product').textContent = bestSeller || '-';
}

// Renderizar gráficas avanzadas
function renderAdvancedCharts() {
    renderSalesCostsChart();
    renderPaymentMethodsChart();
}

// Gráfica de ventas vs costos
function renderSalesCostsChart() {
    const monthlyData = {};
    
    saleHistory.forEach(sale => {
        const date = new Date(sale.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                sales: 0,
                costs: 0,
                label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
            };
        }
        
        monthlyData[monthKey].sales += sale.total;
        
        // Calcular costos
        sale.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                monthlyData[monthKey].costs += product.cost * item.quantity;
            }
        });
    });
    
    const sortedMonths = Object.keys(monthlyData).sort();
    const labels = sortedMonths.map(key => monthlyData[key].label);
    const salesData = sortedMonths.map(key => monthlyData[key].sales);
    const costsData = sortedMonths.map(key => monthlyData[key].costs);
    
    const ctx = document.getElementById('salesCostsChart').getContext('2d');
    
    if (window.salesCostsChartInstance) {
        window.salesCostsChartInstance.destroy();
    }
    
    window.salesCostsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Ventas',
                    data: salesData,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Costos',
                    data: costsData,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0ff'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#e0e0ff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#e0e0ff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Gráfica de métodos de pago
function renderPaymentMethodsChart() {
    const paymentMethods = {};
    
    saleHistory.forEach(sale => {
        if (!paymentMethods[sale.paymentMethod]) {
            paymentMethods[sale.paymentMethod] = 0;
        }
        paymentMethods[sale.paymentMethod] += sale.total;
    });
    
    const ctx = document.getElementById('paymentMethodsChart').getContext('2d');
    
    if (window.paymentMethodsChartInstance) {
        window.paymentMethodsChartInstance.destroy();
    }
    
    window.paymentMethodsChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(paymentMethods),
            datasets: [{
                data: Object.values(paymentMethods),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e0e0ff'
                    }
                }
            }
        }
    });
}

// Función para exportar reporte financiero
function exportFinancialReport() {
    const wb = XLSX.utils.book_new();
    
    // Resumen financiero
    const financialData = [
        ['Reporte Financiero - NIVOR', '', '', ''],
        ['Fecha de generación', new Date().toLocaleString(), '', ''],
        ['', '', '', ''],
        ['Métrica', 'Valor', '', ''],
        ['Ventas Totales', saleHistory.length, '', ''],
        ['Ingresos Totales', `$${saleHistory.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}`, '', ''],
        ['Costos Totales', `$${calculateTotalCosts().toFixed(2)}`, '', ''],
        ['Utilidad Bruta', `$${calculateGrossProfit().toFixed(2)}`, '', ''],
        ['Margen de Utilidad', `${calculateProfitMargin().toFixed(2)}%`, '', ''],
        ['', '', '', ''],
        ['Venta Promedio', `$${calculateAverageSale().toFixed(2)}`, '', '']
    ];
    
    const financialWs = XLSX.utils.aoa_to_sheet(financialData);
    XLSX.utils.book_append_sheet(wb, financialWs, "Resumen Financiero");
    
    // Ventas por mes
    const monthlyData = [['Mes', 'Ventas', 'Ingresos', 'Costos', 'Utilidad']];
    
    const monthlySales = {};
    saleHistory.forEach(sale => {
        const date = new Date(sale.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!monthlySales[monthKey]) {
            monthlySales[monthKey] = {
                sales: 0,
                revenue: 0,
                costs: 0,
                label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
            };
        }
        
        monthlySales[monthKey].sales += 1;
        monthlySales[monthKey].revenue += sale.total;
        
        sale.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                monthlySales[monthKey].costs += product.cost * item.quantity;
            }
        });
    });
    
    Object.keys(monthlySales).sort().forEach(key => {
        const data = monthlySales[key];
        const profit = data.revenue - data.costs;
        monthlyData.push([data.label, data.sales, data.revenue, data.costs, profit]);
    });
    
    const monthlyWs = XLSX.utils.aoa_to_sheet(monthlyData);
    XLSX.utils.book_append_sheet(wb, monthlyWs, "Ventas por Mes");
    
    XLSX.writeFile(wb, `reporte_financiero_nivor_${new Date().toISOString().split('T')[0]}.xlsx`);
    showAlert('Reporte financiero exportado correctamente', 'success');
}

// Función para exportar reporte de inventario
function exportInventoryReport() {
    const wb = XLSX.utils.book_new();
    
    // Resumen de inventario
    const inventoryData = [
        ['Reporte de Inventario - NIVOR', '', '', '', ''],
        ['Fecha de generación', new Date().toLocaleString(), '', '', ''],
        ['', '', '', '', ''],
        ['Producto', 'Categoria', 'Stock', 'Precio', 'Valor de Inventario']
    ];
    
    let totalValue = 0;
    
    products.forEach(product => {
        const value = product.cost * product.quantity;
        totalValue += value;
        
        inventoryData.push([
            product.name,
            product.category,
            product.quantity,
            product.price,
            value
        ]);
    });
    
    inventoryData.push(['', '', '', 'Total', totalValue]);
    
    const inventoryWs = XLSX.utils.aoa_to_sheet(inventoryData);
    XLSX.utils.book_append_sheet(wb, inventoryWs, "Inventario");
    
    // Productos con stock bajo
    const lowStockData = [
        ['Productos con Stock Bajo', '', '', ''],
        ['Producto', 'Stock Actual', 'Stock Mínimo', 'Diferencia']
    ];
    
    products.forEach(product => {
        const minStock = product.minStock || 5;
        if (product.quantity <= minStock) {
            lowStockData.push([
                product.name,
                product.quantity,
                minStock,
                minStock - product.quantity
            ]);
        }
    });
    
    const lowStockWs = XLSX.utils.aoa_to_sheet(lowStockData);
    XLSX.utils.book_append_sheet(wb, lowStockWs, "Stock Bajo");
    
    XLSX.writeFile(wb, `reporte_inventario_nivor_${new Date().toISOString().split('T')[0]}.xlsx`);
    showAlert('Reporte de inventario exportado correctamente', 'success');
}

// Funciones auxiliares para cálculos
function calculateTotalCosts() {
    let totalCosts = 0;
    
    saleHistory.forEach(sale => {
        sale.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                totalCosts += product.cost * item.quantity;
            }
        });
    });
    
    return totalCosts;
}

function calculateGrossProfit() {
    const totalRevenue = saleHistory.reduce((sum, sale) => sum + sale.total, 0);
    return totalRevenue - calculateTotalCosts();
}

function calculateProfitMargin() {
    const totalRevenue = saleHistory.reduce((sum, sale) => sum + sale.total, 0);
    return totalRevenue > 0 ? (calculateGrossProfit() / totalRevenue) * 100 : 0;
}

function calculateAverageSale() {
    return saleHistory.length > 0 ? 
        saleHistory.reduce((sum, sale) => sum + sale.total, 0) / saleHistory.length : 0;
}

// Función para procesar datos de Excel - VERSIÓN MEJORADA PARA NIVOR
function processExcelData(data) {
    let importedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    const errors = [];
    
    console.log('=== INICIO DE IMPORTACIÓN NIVOR ===');
    console.log('Datos recibidos del Excel:', data);
    console.log('Número de filas:', data.length);
    
    // Mostrar barra de progreso
    const exportProgress = document.getElementById('export-progress');
    if (exportProgress) {
        exportProgress.style.display = 'block';
    }
    
    // Verificar que data sea un array
    if (!Array.isArray(data)) {
        console.error('Los datos no son un array válido');
        showNotification('Error: Formato de datos inválido', 'error');
        return;
    }
    
    data.forEach((row, index) => {
        try {
            if (exportProgress) {
                updateProgress(30 + Math.floor((index / data.length) * 50));
            }
            
            // Debug: Mostrar la fila completa
            console.log(`\n--- Procesando Fila ${index + 2} ---`);
            console.log('Fila completa:', row);
            console.log('Claves disponibles:', Object.keys(row));
            
            // Verificar que row sea un objeto válido
            if (!row || typeof row !== 'object') {
                console.log('Fila no válida, saltando...');
                return;
            }
            
            // Mapear las columnas del Excel a las propiedades del producto
            // Usar los nombres exactos de tu Excel
            const productData = {
                name: row.Nombre || '',
                category: row.Categoria || '',
                quantity: parseInt(row.Cantidad) || 0,
                price: parseFloat(row.Precio) || 0,
                cost: parseFloat(row.Costo) || 0,
                barcode: (row.CodigoBarras || '').toString(),
                brand: row.Marca || 'NIVOR',
                model: row.Modelo || '',
                location: row.Ubicacion || 'Servicio Digital',
                minStock: parseInt(row.StockMinimo) || 5,
                maxStock: parseInt(row.StockMaximo) || 9999
            };
            
            console.log('Datos mapeados:', productData);
            
            // Verificar que los datos no estén vacíos
            if (!productData.name || productData.name.trim() === '') {
                console.log('Fila vacía o sin nombre, saltando...');
                return;
            }
            
            // Validar campos obligatorios
            if (!productData.name || !productData.category || isNaN(productData.quantity) || 
                isNaN(productData.price) || isNaN(productData.cost)) {
                errorCount++;
                const errorMsg = `Fila ${index + 2}: Faltan campos requeridos o tienen formato incorrecto`;
                errors.push(errorMsg);
                console.error(errorMsg);
                return;
            }
            
            // Crear el nuevo producto
            const newProduct = {
                id: Date.now() + index + Math.random(), // ID único
                name: productData.name.trim(),
                category: productData.category.trim(),
                quantity: productData.quantity,
                price: productData.price,
                cost: productData.cost,
                barcode: productData.barcode,
                brand: productData.brand,
                model: productData.model,
                location: productData.location,
                minStock: productData.minStock,
                maxStock: productData.maxStock,
                dateAdded: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            console.log('Producto creado:', newProduct);
            
            // Verificar si ya existe un producto con el mismo nombre
            const existingIndex = products.findIndex(p => 
                p.name.toLowerCase() === newProduct.name.toLowerCase()
            );
            
            if (existingIndex !== -1) {
                // Actualizar producto existente
                products[existingIndex] = { ...products[existingIndex], ...newProduct };
                updatedCount++;
                console.log(`Producto actualizado: ${newProduct.name}`);
            } else {
                // Agregar nuevo producto
                products.push(newProduct);
                importedCount++;
                console.log(`Producto importado: ${newProduct.name}`);
            }
        } catch (error) {
            errorCount++;
            const errorMsg = `Fila ${index + 2}: ${error.message}`;
            errors.push(errorMsg);
            console.error(errorMsg);
        }
    });
    
    console.log(`Importación completada: ${importedCount} nuevos, ${updatedCount} actualizados, ${errorCount} errores`);
    
    // Finalizar la importación
    finishImport(importedCount, updatedCount, errorCount, errors);
}

// Función para finalizar la importación
function finishImport(importedCount, updatedCount, errorCount, errors) {
    // Guardar en localStorage
    localStorage.setItem('inventory', JSON.stringify(products));
    
    // Actualizar la interfaz
    updateCategoryOptions();
    renderInventory();
    updateProductSelect();
    updateStatistics();
    updateStorageInfo();
    
    // Mostrar resumen de importación (solo si los elementos existen)
    const importSummary = document.getElementById('import-summary');
    const summaryContent = document.getElementById('import-summary-content');
    
    if (importSummary && summaryContent) {
        let summaryHTML = `
            <p>Productos importados: <strong>${importedCount}</strong></p>
            <p>Productos actualizados: <strong>${updatedCount}</strong></p>
            <p>Errores: <strong>${errorCount}</strong></p>
        `;
        
        if (errors.length > 0) {
            summaryHTML += `<p>Detalles de errores:</p><ul>`;
            errors.slice(0, 5).forEach(error => {
                summaryHTML += `<li>${error}</li>`;
            });
            
            if (errors.length > 5) {
                summaryHTML += `<li>...y ${errors.length - 5} errores más</li>`;
            }
            
            summaryHTML += `</ul>`;
        }
        
        summaryContent.innerHTML = summaryHTML;
        importSummary.style.display = 'block';
    }
    
    // Ocultar barra de progreso
    const exportProgress = document.getElementById('export-progress');
    if (exportProgress) {
        exportProgress.style.display = 'none';
    }
    
    // Mostrar notificación
    if (errorCount === 0) {
        showNotification(`Importación completada: ${importedCount} nuevos, ${updatedCount} actualizados`, 'success');
    } else {
        showNotification(`Importación completada con ${errorCount} errores`, 'error');
    }
    
    // Limpiar input de archivo
    const excelFileInput = document.getElementById('excel-file');
    if (excelFileInput) {
        excelFileInput.value = '';
    }
}

// Inicializar la aplicación con las nuevas funcionalidades
// Asegurarse de que todas las funciones estén disponibles globalmente
window.downloadImportTemplate = downloadImportTemplate;
window.showExportOptions = showExportOptions;
window.closeExportOptions = closeExportOptions;
window.exportWithOptions = exportWithOptions;
window.generateDetailedReport = generateDetailedReport;
window.exportFinancialReport = exportFinancialReport;
window.exportInventoryReport = exportInventoryReport;

// Funciones del carrito y ventas
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.processSale = processSale;
window.confirmPayment = confirmPayment;
window.closePaymentModal = closePaymentModal;
window.showPaymentModal = showPaymentModal;
window.showReceipt = showReceipt;

// Funciones de productos
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.searchProducts = searchProducts;
window.searchSales = searchSales;
window.clearSalesHistory = clearSalesHistory;
window.exportSalesData = exportSalesData;

// Funciones de búsqueda
window.searchByBarcode = searchByBarcode;


// =============================================
// CALCULADORA MODAL - VERSIÓN CORREGIDA
// =============================================

// Variables para la calculadora
let calcCurrentInput = '0';
let calcPreviousInput = '';
let calcOperation = undefined;
let calcShouldResetScreen = false;

// Inicializar la calculadora
function initCalculator() {
    // Event listeners para abrir y cerrar la calculadora
    document.getElementById('openCalculator').addEventListener('click', () => {
        document.getElementById('calculatorModal').classList.add('active');
    });
    
    document.getElementById('closeCalculator').addEventListener('click', closeCalculator);
    
    // Cerrar al hacer clic fuera de la calculadora
    document.getElementById('calculatorModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('calculatorModal')) {
            closeCalculator();
        }
    });
    
    // Event listeners para los botones de la calculadora
    const calcButtons = document.querySelectorAll('.calculator-buttons-modal button');
    calcButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.dataset.number) {
                appendNumber(button.dataset.number);
            } else if (button.dataset.operator) {
                chooseOperation(button.dataset.operator);
            } else if (button.dataset.action) {
                handleAction(button.dataset.action);
            }
        });
    });
    
    // Soporte para teclado
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('calculatorModal').classList.contains('active')) {
            if (/[0-9]/.test(e.key)) {
                appendNumber(e.key);
            } else if (e.key === '.') {
                appendNumber('.');
            } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                chooseOperation(
                    e.key === '*' ? '×' : 
                    e.key === '/' ? '÷' : e.key
                );
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                compute();
            } else if (e.key === 'Backspace') {
                deleteNumber();
            } else if (e.key === 'Escape') {
                clearCalculator();
            }
        }
    });
}

function closeCalculator() {
    document.getElementById('calculatorModal').classList.remove('active');
}

function updateCalcDisplay() {
    document.getElementById('calcDisplay').textContent = calcCurrentInput;
}

function appendNumber(number) {
    if (calcShouldResetScreen) {
        calcCurrentInput = '';
        calcShouldResetScreen = false;
    }
    
    if (number === '.' && calcCurrentInput.includes('.')) return;
    if (calcCurrentInput === '0' && number !== '.') {
        calcCurrentInput = number;
    } else {
        calcCurrentInput += number;
    }
    
    updateCalcDisplay();
}

function chooseOperation(operation) {
    if (calcCurrentInput === '') return;
    if (calcPreviousInput !== '') {
        compute();
    }
    
    calcOperation = operation;
    calcPreviousInput = calcCurrentInput;
    calcShouldResetScreen = true;
}

function compute() {
    let computation;
    const prev = parseFloat(calcPreviousInput);
    const current = parseFloat(calcCurrentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (calcOperation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                computation = 'Error';
            } else {
                computation = prev / current;
            }
            break;
        default:
            return;
    }
    
    calcCurrentInput = computation.toString();
    calcOperation = undefined;
    calcPreviousInput = '';
    calcShouldResetScreen = true;
    
    updateCalcDisplay();
}

function handleAction(action) {
    switch(action) {
        case 'clear':
            clearCalculator();
            break;
        case 'delete':
            deleteNumber();
            break;
        case 'equals':
            compute();
            break;
    }
}

function clearCalculator() {
    calcCurrentInput = '0';
    calcPreviousInput = '';
    calcOperation = undefined;
    updateCalcDisplay();
}

function deleteNumber() {
    if (calcCurrentInput.length === 1) {
        calcCurrentInput = '0';
    } else {
        calcCurrentInput = calcCurrentInput.slice(0, -1);
    }
    updateCalcDisplay();
}

// Función para redirigir a la calculadora
function goToCalculator() {
    document.getElementById('calculatorModal').classList.add('active');
}

// Inicializar la calculadora cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    initCalculator();
});

// Función para validar datos de importación
function validateImportedProduct(productData) {
    const errors = [];
    
    if (!productData.Nombre || typeof productData.Nombre !== 'string') {
        errors.push('Nombre es requerido y debe ser texto');
    }
    
    if (!productData.Categoria || typeof productData.Categoria !== 'string') {
        errors.push('Categoría es requerida y debe ser texto');
    }
    
    if (isNaN(parseInt(productData.Cantidad))) {
        errors.push('Cantidad debe ser un número válido');
    }
    
    if (isNaN(parseFloat(productData.Precio))) {
        errors.push('Precio debe ser un número válido');
    }
    
    if (isNaN(parseFloat(productData.Costo))) {
        errors.push('Costo debe ser un número válido');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Función para validar formulario de productos
function validateProductForm() {
    const name = document.getElementById('name').value.trim();
    const category = document.getElementById('category').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const cost = parseFloat(document.getElementById('cost').value);
    
    // Validaciones
    if (name.length < 2) {
        showAlert('El nombre del producto debe tener al menos 2 caracteres', 'error');
        return false;
    }
    
    if (!category) {
        showAlert('Por favor, seleccione una categoría', 'error');
        return false;
    }
    
    if (isNaN(quantity) || quantity < 0) {
        showAlert('La cantidad debe ser un número válido mayor o igual a 0', 'error');
        return false;
    }
    
    if (isNaN(price) || price <= 0) {
        showAlert('El precio debe ser un número válido mayor a 0', 'error');
        return false;
    }
    
    if (isNaN(cost) || cost < 0) {
        showAlert('El costo debe ser un número válido mayor o igual a 0', 'error');
        return false;
    }
    
    if (cost > price) {
        showAlert('El costo no puede ser mayor que el precio', 'error');
        return false;
    }
    
    const minStock = parseInt(document.getElementById('min-stock').value) || 0;
    const maxStock = parseInt(document.getElementById('max-stock').value) || 9999;
    
    if (minStock > maxStock) {
        showAlert('El stock mínimo no puede ser mayor que el stock máximo', 'error');
        return false;
    }
    
    return true;
}

// Modificar el event listener del formulario para usar validación
productForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateProductForm()) {
        return;
    }
    
    const name = document.getElementById('name').value;
    const category = document.getElementById('category').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const cost = parseFloat(document.getElementById('cost').value);
    const barcode = document.getElementById('barcode').value;
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const location = document.getElementById('location').value;
    const minStock = parseInt(document.getElementById('min-stock').value) || 5;
    const maxStock = parseInt(document.getElementById('max-stock').value) || 9999;
    
    if (editingIndex === -1) {
        // Agregar nuevo producto
        const newProduct = {
            id: Date.now(),
            name: name,
            category: category,
            quantity: quantity,
            price: price,
            cost: cost,
            barcode: barcode,
            brand: brand || 'NIVOR',
            model: model,
            location: location || 'Servicio Digital',
            minStock: minStock,
            maxStock: maxStock,
            dateAdded: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        products.push(newProduct);
        showAlert('Producto agregado exitosamente', 'success');
    } else {
        // Actualizar producto existente
        products[editingIndex] = {
            ...products[editingIndex],
            name: name,
            category: category,
            quantity: quantity,
            price: price,
            cost: cost,
            barcode: barcode,
            brand: brand,
            model: model,
            location: location,
            minStock: minStock,
            maxStock: maxStock,
            lastUpdated: new Date().toISOString()
        };
        
        showAlert('Producto actualizado exitosamente', 'success');
        editingIndex = -1;
        submitBtn.textContent = 'Agregar Producto';
    }
    
    // Guardar en localStorage
    localStorage.setItem('inventory', JSON.stringify(products));
    
    // Actualizar la interfaz
    updateCategoryOptions();
    renderInventory();
    updateProductSelect();
    updateStatistics();
    updateStorageInfo();
    
    // Limpiar formulario
    productForm.reset();
});