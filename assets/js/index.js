
        // Variables globales
        const enterButton = document.getElementById('enterButton');
        const services = [
            document.getElementById('service1'),
            document.getElementById('service2'),
            document.getElementById('service3')
        ];
        const serviceLinks = [
            document.getElementById('service1-link'),
            document.getElementById('service2-link'),
            document.getElementById('service3-link')
        ];
        const connectionsContainer = document.getElementById('connections');
        const spotlight = document.getElementById('spotlight');
        
        // Detectar si es un dispositivo táctil
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        
        // Configurar partículas con más densidad y efectos
        particlesJS('particles-js', {
            particles: {
                number: { 
                    value: isTouchDevice ? 80 : 120, 
                    density: { enable: true, value_area: 800 } 
                },
                color: { value: "#20DEFF" },
                shape: { 
                    type: "circle",
                    stroke: { width: 0, color: "#000000" },
                },
                opacity: { 
                    value: 0.7, 
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false }
                },
                size: { 
                    value: isTouchDevice ? 3 : 4, 
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 1, sync: false }
                },
                line_linked: {
                    enable: true,
                    distance: isTouchDevice ? 150 : 130,
                    color: "#20DEFF",
                    opacity: 0.4,
                    width: 1.5,
                    shadow: {
                        enable: true,
                        color: "#20DEFF",
                        blur: 5
                    }
                },
                move: {
                    enable: true,
                    speed: isTouchDevice ? 1.5 : 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: { enable: true, rotateX: 600, rotateY: 1200 }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { 
                        enable: true, 
                        mode: isTouchDevice ? "bubble" : "grab",
                        parallax: { enable: true, force: 60, smooth: 10 }
                    },
                    onclick: { 
                        enable: true, 
                        mode: "push",
                        push: { particles_nb: 4 }
                    },
                    resize: true
                },
                modes: {
                    grab: { distance: 200, line_linked: { opacity: 1 } },
                    bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
        
        // Crear conexiones entre servicios
        function createConnections() {
            // Limpiar conexiones existentes
            connectionsContainer.innerHTML = '';
            
            // Solo crear conexiones en pantallas grandes
            if (window.innerWidth < 900) return;
            
            // Crear conexiones entre servicios
            for (let i = 0; i < services.length; i++) {
                for (let j = i + 1; j < services.length; j++) {
                    const service1 = services[i];
                    const service2 = services[j];
                    
                    const rect1 = service1.getBoundingClientRect();
                    const rect2 = service2.getBoundingClientRect();
                    
                    const x1 = rect1.left + rect1.width / 2;
                    const y1 = rect1.top + rect1.height / 2;
                    const x2 = rect2.left + rect2.width / 2;
                    const y2 = rect2.top + rect2.height / 2;
                    
                    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                    
                    const connection = document.createElement('div');
                    connection.classList.add('connection');
                    
                    connection.style.width = `${distance}px`;
                    connection.style.height = '2px';
                    connection.style.left = `${x1}px`;
                    connection.style.top = `${y1}px`;
                    connection.style.transform = `rotate(${angle}deg)`;
                    connection.style.opacity = '0.3';
                    
                    connectionsContainer.appendChild(connection);
                }
            }
        }
        
        // Efecto de spotlight que sigue el mouse/touch
        function updateSpotlightPosition(x, y) {
            spotlight.style.left = `${x - 100}px`;
            spotlight.style.top = `${y - 100}px`;
            spotlight.style.opacity = '0.6';
        }
        
        if (isTouchDevice) {
            // Para dispositivos táctiles
            document.addEventListener('touchmove', (e) => {
                const touch = e.touches[0];
                updateSpotlightPosition(touch.clientX, touch.clientY);
            });
            
            document.addEventListener('touchend', () => {
                spotlight.style.opacity = '0';
            });
        } else {
            // Para dispositivos con mouse
            document.addEventListener('mousemove', (e) => {
                updateSpotlightPosition(e.clientX, e.clientY);
            });
            
            document.addEventListener('mouseleave', () => {
                spotlight.style.opacity = '0';
            });
        }
        
        // Efectos táctiles para servicios
        serviceLinks.forEach(serviceLink => {
            if (isTouchDevice) {
                serviceLink.addEventListener('touchstart', () => {
                    const service = serviceLink.querySelector('.service');
                    service.style.transform = 'translateY(-15px) scale(1.03)';
                    service.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 40px rgba(32, 222, 255, 0.5)';
                });
                
                serviceLink.addEventListener('touchend', () => {
                    const service = serviceLink.querySelector('.service');
                    service.style.transform = 'translateY(0) scale(1)';
                    service.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(32, 222, 255, 0.3)';
                });
            }
        });
        
        // Actualizar conexiones al redimensionar
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(createConnections, 250);
        });
        
        // Función de redirección con efecto
        function redirectToMain() {
            // Efecto visual antes de redirigir
            document.querySelector('.logo').style.opacity = '0.5';
            enterButton.style.opacity = '0';
            
            services.forEach(service => {
                service.style.transform = 'translateY(50px)';
                service.style.opacity = '0';
            });
            
            // Ocultar elementos flotantes
            document.querySelector('.floating-elements').style.opacity = '0';
            
            // Efecto de desvanecimiento de partículas
            const canvas = document.querySelector('#particles-js canvas');
            if (canvas) {
                canvas.style.transition = 'opacity 1s';
                canvas.style.opacity = '0';
            }
            
            // Redirigir después del efecto
            setTimeout(() => {
                window.location.href = "inicio/cargando.html";
            }, 1000);
        }
        
        // Inicializar
        createConnections();
        
        // Botón para entrar
        enterButton.addEventListener('click', redirectToMain);
        
        // Efecto de aparición escalonada para servicios
        services.forEach((service, index) => {
            service.style.opacity = '0';
            service.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                service.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                service.style.opacity = '1';
                service.style.transform = 'translateY(0)';
                
                // Recrear conexiones después de que los servicios aparezcan
                setTimeout(createConnections, 800);
            }, 300 + (index * 300));
        });
        
        // Efecto de parpadeo aleatorio para elementos flotantes
        const floatingElements = document.querySelectorAll('.floating-element');
        setInterval(() => {
            const randomElement = floatingElements[Math.floor(Math.random() * floatingElements.length)];
            randomElement.style.animation = 'none';
            setTimeout(() => {
                randomElement.style.animation = '';
            }, 10);
        }, 3000);
