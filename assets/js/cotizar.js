// Datos de servicios con precios al público
        const servicios = [
            { id: 1, categoria: "diseno", nombre: "Diseño de Logotipo Básico", precio: 500, descripcion: "Creación de identidad visual con 2 propuestas creativas diferentes" },
            { id: 2, categoria: "diseno", nombre: "Diseño de Logotipo Premium", precio: 1200, descripcion: "Solución integral de identidad corporativa con manual básico" },
            { id: 3, categoria: "diseno", nombre: "Rediseño de Logotipo", precio: 800, descripcion: "Modernización de logotipo existente manteniendo la esencia de tu marca" },
            { id: 4, categoria: "diseno", nombre: "Diseño de Flyer Digital", precio: 400, descripcion: "Flyers impactantes optimizados para entornos digitales" },
            { id: 5, categoria: "diseno", nombre: "Diseño de Menú Digital", precio: 700, descripcion: "Menús digitales atractivos y funcionales que realzan tus platillos" },
            { id: 6, categoria: "diseno", nombre: "Portada para Redes Sociales", precio: 350, descripcion: "Diseños de portada optimizados para cada plataforma social" },
            { id: 7, categoria: "diseno", nombre: "Paquete Identidad Visual", precio: 2000, descripcion: "Solución completa de branding con manual de identidad corporativa" },
            { id: 8, categoria: "soporte", nombre: "Soporte Técnico PC Básico", precio: 500, descripcion: "Diagnóstico completo, limpieza y optimización básica del sistema" },
            { id: 9, categoria: "soporte", nombre: "Soporte Técnico Avanzado", precio: 850, descripcion: "Solución de problemas complejos y optimización avanzada" },
            { id: 10, categoria: "soporte", nombre: "Instalación de Programas", precio: 150, descripcion: "Instalación y configuración profesional de software" },
            { id: 11, categoria: "soporte", nombre: "Formateo y Optimización", precio: 450, descripcion: "Formateo completo e instalación limpia del sistema operativo" },
            { id: 12, categoria: "soporte", nombre: "Actualización de Windows", precio: 400, descripcion: "Actualización y optimización del sistema operativo Windows" },
            { id: 13, categoria: "soporte", nombre: "Limpieza de Hardware PC", precio: 500, descripcion: "Limpieza física profunda de componentes internos" },
            { id: 14, categoria: "web", nombre: "Página Web Landing Page (GitHub)", precio: 5500, descripcion: "Página de aterrizaje atractiva y efectiva con hosting en GitHub" },
            { id: 15, categoria: "web", nombre: "Página Web Corporativa (GitHub)", precio: 12000, descripcion: "Sitio web profesional con múltiples secciones y hosting en GitHub" }
        ];

        // Variables globales
        let serviciosSeleccionados = [];
        const servicesContainer = document.getElementById('services-container');
        const resumenItems = document.getElementById('resumen-items');
        const totalAmount = document.getElementById('total-amount');
        const finalizarBtn = document.getElementById('finalizar-btn');
        const limpiarBtn = document.getElementById('limpiar-btn');
        const categoriaBtns = document.querySelectorAll('.categoria-btn');
        const resumenContainer = document.getElementById('resumen-container');
        
        // Elementos de WhatsApp
        const whatsappBtn = document.getElementById('whatsapp-btn');
        const whatsappModal = document.getElementById('whatsapp-modal');
        const modalClose = document.getElementById('modal-close');
        const modalCancel = document.getElementById('modal-cancel');
        const whatsappPreview = document.getElementById('whatsapp-preview');
        const whatsappLink = document.getElementById('whatsapp-link');
        
        // Número de WhatsApp (reemplaza con el número real)
        const whatsappNumber = "1234567890"; // Ejemplo: número sin espacios ni caracteres especiales

        // Cargar servicios en la página
        function cargarServicios(categoria = 'todos') {
            servicesContainer.innerHTML = '';
            
            const serviciosFiltrados = servicios.filter(servicio => {
                return categoria === 'todos' || servicio.categoria === categoria;
            });
            
            serviciosFiltrados.forEach((servicio, index) => {
                const isSelected = serviciosSeleccionados.some(s => s.id === servicio.id);
                
                const serviceElement = document.createElement('div');
                serviceElement.className = `service-item reveal`;
                serviceElement.dataset.id = servicio.id;
                
                serviceElement.innerHTML = `
                    <div class="service-header">
                        <h3 class="service-title">${servicio.nombre}</h3>
                        <div class="service-price">$${servicio.precio.toLocaleString()}</div>
                    </div>
                    <p class="service-description">${servicio.descripcion}</p>
                    <div class="service-select">
                        <label class="checkbox-container">
                            <input type="checkbox" ${isSelected ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            <span class="checkbox-label">Seleccionar servicio</span>
                        </label>
                    </div>
                `;
                
                servicesContainer.appendChild(serviceElement);
                
                // Agregar evento al checkbox
                const checkbox = serviceElement.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', () => {
                    toggleServicio(servicio);
                    serviceElement.classList.toggle('selected', checkbox.checked);
                });
                
                // Aplicar animación con retraso escalonado
                setTimeout(() => {
                    serviceElement.classList.add('animate');
                }, 100 + (index * 100));
            });
            
            // Activar animaciones de reveal
            setTimeout(() => {
                document.querySelectorAll('.reveal').forEach(el => {
                    if (isElementInViewport(el)) {
                        el.classList.add('active');
                    }
                });
            }, 300);
        }

        // Alternar servicio seleccionado
        function toggleServicio(servicio) {
            const index = serviciosSeleccionados.findIndex(s => s.id === servicio.id);
            
            if (index === -1) {
                serviciosSeleccionados.push(servicio);
            } else {
                serviciosSeleccionados.splice(index, 1);
            }
            
            actualizarResumen();
        }

        // Actualizar resumen de cotización
        function actualizarResumen() {
            resumenItems.innerHTML = '';
            
            if (serviciosSeleccionados.length === 0) {
                resumenItems.innerHTML = '<p style="text-align: center; color: #ccc;">Selecciona al menos un servicio para ver tu cotización</p>';
                totalAmount.textContent = '$0.00';
                resumenContainer.classList.remove('visible');
                return;
            }
            
            let total = 0;
            
            serviciosSeleccionados.forEach(servicio => {
                total += servicio.precio;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'resumen-item';
                itemElement.innerHTML = `
                    <div class="resumen-item-name">${servicio.nombre}</div>
                    <div class="resumen-item-price">$${servicio.precio.toLocaleString()}</div>
                `;
                
                resumenItems.appendChild(itemElement);
            });
            
            totalAmount.textContent = `$${total.toLocaleString()}`;
            resumenContainer.classList.add('visible');
        }

        // Verificar si un elemento está en el viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        // Efecto de spotlight con el mouse
        document.addEventListener('mousemove', (e) => {
            const spotlight = document.getElementById('spotlight');
            spotlight.style.left = `${e.pageX - 100}px`;
            spotlight.style.top = `${e.pageY - 100}px`;
            spotlight.style.opacity = '1';
        });

        // Inicializar partículas
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#20DEFF" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#20DEFF",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });

        // Event Listeners
        document.addEventListener('DOMContentLoaded', () => {
            // Cargar servicios iniciales
            cargarServicios();
            
            // Activar animaciones de reveal al cargar
            setTimeout(() => {
                document.querySelectorAll('.reveal').forEach(el => {
                    if (isElementInViewport(el)) {
                        el.classList.add('active');
                    }
                });
            }, 500);
            
            // Botones de categorías
            categoriaBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    categoriaBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    cargarServicios(btn.dataset.categoria);
                });
            });
            
            // Botón limpiar selección
            limpiarBtn.addEventListener('click', () => {
                serviciosSeleccionados = [];
                actualizarResumen();
                document.querySelectorAll('.service-item').forEach(item => {
                    item.classList.remove('selected');
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    checkbox.checked = false;
                });
            });
            
            // Botón finalizar cotización
            finalizarBtn.addEventListener('click', () => {
                if (serviciosSeleccionados.length === 0) {
                    alert('Por favor selecciona al menos un servicio para continuar.');
                    return;
                }
                
                // Abrir modal de WhatsApp
                abrirModalWhatsApp();
            });
            
            // Eventos para el modal de WhatsApp
            whatsappBtn.addEventListener('click', () => {
                if (serviciosSeleccionados.length === 0) {
                    alert('Por favor selecciona al menos un servicio para continuar.');
                    return;
                }
                
                abrirModalWhatsApp();
            });
            
            modalClose.addEventListener('click', () => {
                whatsappModal.style.display = 'none';
            });
            
            modalCancel.addEventListener('click', () => {
                whatsappModal.style.display = 'none';
            });
            
            // Cerrar modal al hacer clic fuera
            window.addEventListener('click', (e) => {
                if (e.target === whatsappModal) {
                    whatsappModal.style.display = 'none';
                }
            });
            
            // Efecto de scroll para elementos reveal
            window.addEventListener('scroll', () => {
                document.querySelectorAll('.reveal').forEach(el => {
                    if (isElementInViewport(el)) {
                        el.classList.add('active');
                    }
                });
            });
        });

        // Abrir modal de WhatsApp
        function abrirModalWhatsApp() {
            // Generar el mensaje para WhatsApp
            let mensaje = "¡Hola! Me interesa solicitar una cotización para los siguientes servicios:%0A%0A";
            
            let total = 0;
            serviciosSeleccionados.forEach(servicio => {
                mensaje += `• ${servicio.nombre} - $${servicio.precio.toLocaleString()}%0A`;
                total += servicio.precio;
            });
            
            mensaje += `%0A*Total: $${total.toLocaleString()}*%0A%0A`;
            mensaje += "Por favor, contactarme para confirmar disponibilidad y concretar los detalles. ¡Gracias!";
            
            // Actualizar el enlace de WhatsApp
            whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${mensaje}`;
            
            // Actualizar la vista previa
            whatsappPreview.innerHTML = `
                <p><strong>Servicios seleccionados:</strong></p>
                <ul>
                    ${serviciosSeleccionados.map(s => `<li>${s.nombre} - $${s.precio.toLocaleString()}</li>`).join('')}
                </ul>
                <p><strong>Total: $${total.toLocaleString()}</strong></p>
            `;
            
            // Mostrar el modal
            whatsappModal.style.display = 'flex';
        }