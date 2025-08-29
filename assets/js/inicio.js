
        // Animación de carga mejorada
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const loaderText = document.querySelector('.loader-text');
    
    // Animación de texto
    let dots = 0;
    const dotAnimation = setInterval(() => {
        dots = (dots + 1) % 4;
        loaderText.textContent = 'Cargando NIVOR' + '.'.repeat(dots);
    }, 500);
    
    setTimeout(() => {
        clearInterval(dotAnimation);
        loader.classList.add('hidden');
        
        // Iniciar animaciones después de la carga
        setTimeout(() => {
            checkScroll();
        }, 100);
    }, 180);
});
        // Efecto Matrix
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        let letters = '01ABCDEFGHIJKLMNÑOPQESTVWXYZabcdefghijklmnñopqrstvwxyz123456789NIVOR';
        letters = letters.split('');
        
        const fontSize = 12;
        const columns = canvas.width / fontSize;
        
        const drops = [];
        for(let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#20DEFF';
            ctx.font = `${fontSize}px arial`;
            
            for(let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                drops[i]++;
            }
        }
        
        setInterval(drawMatrix, 33);
        
        // Efecto de partículas
        const particlesCanvas = document.getElementById('particles');
        const pctx = particlesCanvas.getContext('2d');
        
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
        
        let particlesArray;
        
        class Particle {
            constructor() {
                this.x = Math.random() * particlesCanvas.width;
                this.y = Math.random() * particlesCanvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
                this.color = `rgba(32, 222, 255, ${Math.random() * 0.5})`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if(this.x > particlesCanvas.width || this.x < 0) {
                    this.speedX = -this.speedX;
                }
                if(this.y > particlesCanvas.height || this.y < 0) {
                    this.speedY = -this.speedY;
                }
            }
            
            draw() {
                pctx.fillStyle = this.color;
                pctx.beginPath();
                pctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                pctx.fill();
            }
        }
        
        function initParticles() {
            particlesArray = [];
            const numberOfParticles = (particlesCanvas.height * particlesCanvas.width) / 9000;
            
            for(let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        function animateParticles() {
            pctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            
            for(let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        
        function connectParticles() {
            const maxDistance = 100;
            for(let a = 0; a < particlesArray.length; a++) {
                for(let b = a; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if(distance < maxDistance) {
                        pctx.strokeStyle = `rgba(32, 222, 255, ${1 - distance/maxDistance})`;
                        pctx.lineWidth = 1;
                        pctx.beginPath();
                        pctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        pctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        pctx.stroke();
                    }
                }
            }
        }
        
        // Cursor personalizado
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });
        
        document.querySelectorAll('a, button, .servicio-card, .paso, .testimonio-card, .tech-item, .faq-question').forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });


        // Función para animar los contadores - VERSIÓN MEJORADA
function animateCounter(element, target, duration) {
    let startTime = null;
    
    function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.floor(progress * target);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Para elementos que deben mostrar el signo +
            if (target > 0) {
                element.textContent = target;
                // El signo + se mostrará mediante CSS
            }
        }
    }
    
    requestAnimationFrame(updateCounter);
}

       // Función para verificar si los elementos están en el viewport - MODIFICADA
function checkScroll() {
    // Animación para todos los elementos con clase de animación
    const elements = document.querySelectorAll('.banner_title, .banner_img, .stat-item, .servicios h2, .servicio-card, .proceso h2, .paso, .tech-item, .testimonio-card, .nosotros h2, .nosotros-text, .nosotros-img, .cliente-logo, .clientes h2, .contacto-info, .contacto-form, .slide-in-left, .slide-in-right, .zoom-in, .rotate-in');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if(elementPosition < screenPosition) {
            element.classList.add('visible');
            
            // Animación adicional para elementos con datos de retraso
            const delay = element.getAttribute('data-delay') || 0;
            element.style.transitionDelay = delay + 'ms';
        }
    });
    
    // Animación especial para stats (contadores) - VERSIÓN MEJORADA
    const statsSection = document.querySelector('.stats');
    if(statsSection) {
        const statsPosition = statsSection.getBoundingClientRect();
        const screenPosition = window.innerHeight / 1.3;
        
        // Si la sección está visible
        if(statsPosition.top < screenPosition && statsPosition.bottom > 0) {
            statsSection.classList.add('animated');
            
            const statItems = document.querySelectorAll('.stat-item');
            const statNumbers = document.querySelectorAll('.stat-number');
            const values = [750, 550, 12, 0]; // Tus valores objetivo
            
            statItems.forEach((item, index) => {
                item.classList.add('visible');
                
                // Solo animar los contadores numéricos (no el 24/7)
                if (index < 3) {
                    // Solo animar si aún no se ha animado
                    if (statNumbers[index].textContent === '0' || statNumbers[index].textContent === '0+') {
                        animateCounter(statNumbers[index], values[index], 8000);
                    }
                }
            });
        }
    }
}
        
        // FAQ interactivo
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isOpen = answer.classList.contains('open');
                
                // Cerrar todas las respuestas
                document.querySelectorAll('.faq-answer').forEach(ans => {
                    ans.classList.remove('open');
                });
                
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.classList.remove('active');
                });
                
                // Abrir la respuesta clickeada si no estaba abierta
                if(!isOpen) {
                    answer.classList.add('open');
                    question.classList.add('active');
                }
            });
        });
        
        // Navegación fija al hacer scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header_nav');
            if(window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            checkScroll();
        });
        
        // Inicialización
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;
            initParticles();
        });
        
        // Iniciar efectos
        initParticles();
        animateParticles();
        checkScroll();
        
        // Efecto de escritura en el banner
        document.addEventListener('DOMContentLoaded', () => {
            const bannerTitle = document.querySelector('.banner_title');
            const bannerImg = document.querySelector('.banner_img');
            
            setTimeout(() => {
                bannerTitle.classList.add('visible');
            }, 500);
            
            setTimeout(() => {
                bannerImg.classList.add('visible');
            }, 1000);
        });

// Contador de visitas
function updateVisitCounter() {
    // Verificar si ya tenemos un contador en localStorage
    let visitCount = localStorage.getItem('pageVisitCount');
    
    // Si no existe, inicializarlo
    if (!visitCount) {
        visitCount = 0;
    }
    
    // Incrementar el contador
    visitCount++;
    
    // Guardar en localStorage
    localStorage.setItem('pageVisitCount', visitCount);
    
    // Actualizar en la interfaz - CORREGIDO para el nuevo contador
    const contadorElement = document.querySelector('.contador-visitas');
    if (contadorElement) {
        contadorElement.textContent = visitCount;
        
        // Animación cuando se actualiza el contador
        contadorElement.style.transform = 'scale(1.5)';
        setTimeout(() => {
            contadorElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    return visitCount;
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(updateVisitCounter, 1000);
});

// Efecto de texto escribiéndose (Typed.js) - MEJORADO PARA MÓVIL
document.addEventListener('DOMContentLoaded', function() {
    // Detectar si es dispositivo móvil
    const isMobile = window.innerWidth <= 768;
    
    // Para el título principal
    new Typed('#typed-text', {
        strings: isMobile ? [
            "NIVOR Soluciones",
            "Innovación Digital", 
            "Diseño Web Profesional",
            "Desarrollo",
            "Marketing Digital"
        ] : [
            "NIVOR Soluciones Digitales",
            "Innovación y Tecnología", 
            "Diseño Web Profesional",
            "Desarrollo a Medida",
            "Marketing Digital Efectivo"
        ],
        typeSpeed: isMobile ? 70 : 60,
        backSpeed: isMobile ? 50 : 40,
        backDelay: isMobile ? 2000 : 2500,
        startDelay: 800,
        loop: true,
        showCursor: !isMobile,  // Ocultar cursor en móviles
        cursorChar: '|'
    });
    
    // Para el texto descriptivo (más lento)
    new Typed('#typed-subtext', {
        strings: isMobile ? [
            "Impulsamos tu presencia digital con servicios de alta calidad.",
            "Transformamos ideas en soluciones digitales impactantes.",
            "Expertos en crear experiencias digitales efectivas.",
            "Llevamos tu negocio al siguiente nivel digital."
        ] : [
            "Impulsamos tu presencia digital con servicios de alta calidad, diseño web innovador y soporte técnico.",
            "Transformamos ideas en soluciones digitales impactantes que generan resultados tangibles.",
            "Expertos en crear experiencias digitales que conectan con tu audiencia y convierten visitantes en clientes.",
            "Combinamos creatividad, tecnología y estrategia para llevar tu negocio al siguiente nivel digital."
        ],
        typeSpeed: isMobile ? 50 : 40,
        backSpeed: isMobile ? 30 : 25,
        backDelay: isMobile ? 3000 : 3500,
        startDelay: 2000,
        loop: true,
        showCursor: !isMobile,  // Ocultar cursor en móviles
        cursorChar: '|'
    });
});
// Contador de likes
function updateLikeCounter() {
    let likeCount = localStorage.getItem('pageLikeCount') || 0;
    
    // Actualizar en la interfaz
    const contadorElement = document.querySelector('.contador-likes');
    if (contadorElement) {
        contadorElement.textContent = likeCount;
    }
    
    return likeCount;
}

// Función para dar like (se puede llamar al hacer clic en el corazón)
function addLike() {
    let likeCount = localStorage.getItem('pageLikeCount') || 0;
    likeCount++;
    localStorage.setItem('pageLikeCount', likeCount);
    
    // Animación cuando se da like
    const heartIcon = document.querySelector('.fa-heart');
    heartIcon.style.color = '#ff3366';
    heartIcon.style.transform = 'scale(1.3)';
    
    setTimeout(() => {
        heartIcon.style.color = '#20DEFF';
        heartIcon.style.transform = 'scale(1)';
    }, 300);
    
    updateLikeCounter();
}

// Hacer el corazón clickeable
document.addEventListener('DOMContentLoaded', () => {
    const heartIcon = document.querySelector('.social-stats-float .fa-heart');
    if (heartIcon) {
        heartIcon.style.cursor = 'pointer';
        heartIcon.addEventListener('click', addLike);
    }
    
    // Inicializar contadores
    setTimeout(() => {
        updateVisitCounter();
        updateLikeCounter();
    }, 1000);
});

// Efecto de sonido al hacer hover
document.querySelectorAll('a, button, .servicio-card, .contact-btn, .servicio-btn, .submit-btn, .whatsapp-float, .social-header a, nav a').forEach(element => {
    element.addEventListener('mouseenter', () => {
        // Solo crear el efecto de sonido si el usuario no ha desactivado sonidos
        if (localStorage.getItem('soundEffects') !== 'disabled') {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.value = 523.25; // Nota Do
                gainNode.gain.value = 0.1;
                
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.2);
                
                setTimeout(() => {
                    oscillator.stop();
                }, 200);
            } catch (e) {
                console.log('El efecto de sonido no es compatible con este navegador');
            }
        }
    });
});

// Control para activar/desactivar efectos de sonido
function toggleSoundEffects() {
    if (localStorage.getItem('soundEffects') === 'disabled') {
        localStorage.setItem('soundEffects', 'enabled');
        showNotification('Efectos de sonido activados');
    } else {
        localStorage.setItem('soundEffects', 'disabled');
        showNotification('Efectos de sonido desactivados');
    }
}

// Mostrar notificación temporal
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(32, 222, 255, 0.9)';
    notification.style.color = '#000';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '30px';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 4px 12px rgba(32, 222, 255, 0.4)';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 4000);
}

// Botón para control de sonido (agregar al DOM)
function addSoundControl() {
    const soundControl = document.createElement('div');
    soundControl.innerHTML = '<i class="fas fa-volume-up"></i>';
    soundControl.style.position = 'fixed';
    soundControl.style.bottom = '100px';
    soundControl.style.right = '30px';
    soundControl.style.width = '50px';
    soundControl.style.height = '50px';
    soundControl.style.backgroundColor = 'rgba(32, 222, 255, 0.2)';
    soundControl.style.color = '#20DEFF';
    soundControl.style.borderRadius = '50%';
    soundControl.style.display = 'flex';
    soundControl.style.alignItems = 'center';
    soundControl.style.justifyContent = 'center';
    soundControl.style.fontSize = '1.5rem';
    soundControl.style.cursor = 'pointer';
    soundControl.style.zIndex = '100';
    soundControl.style.boxShadow = '0 0 15px rgba(32, 222, 255, 0.3)';
    soundControl.style.transition = 'all 0.3s ease';
    
    // Verificar estado inicial
    if (localStorage.getItem('soundEffects') === 'disabled') {
        soundControl.innerHTML = '<i class="fas fa-volume-mute"></i>';
        soundControl.style.backgroundColor = 'rgba(255, 100, 100, 0.2)';
        soundControl.style.color = '#ff6464';
    }
    
    soundControl.addEventListener('mouseenter', () => {
        soundControl.style.transform = 'scale(1.1)';
    });
    
    soundControl.addEventListener('mouseleave', () => {
        soundControl.style.transform = 'scale(1)';
    });
    
    soundControl.addEventListener('click', toggleSoundEffects);
    
    document.body.appendChild(soundControl);
}

// Inicializar control de sonido cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(addSoundControl, 3000);
});
// Función para animar los contadores - VERSIÓN MEJORADA
function animateCounter(element, target, duration) {
    let startTime = null;
    
    function updateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentValue = Math.floor(progress * target);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Agregar el signo + después de completar la animación
            if (element.nextElementSibling && element.nextElementSibling.classList.contains('plus-sign')) {
                element.textContent = target + '+';
            } else {
                element.textContent = target;
            }
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Inicialización
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    initParticles();
});

// Iniciar efectos
initParticles();
animateParticles();
checkScroll(); // Asegúrate de que esta línea esté presente

// Efecto de escritura en el banner
document.addEventListener('DOMContentLoaded', () => {
    const bannerTitle = document.querySelector('.banner_title');
    const bannerImg = document.querySelector('.banner_img');
    
    setTimeout(() => {
        bannerTitle.classList.add('visible');
    }, 500);
    
    setTimeout(() => {
        bannerImg.classList.add('visible');
    }, 1000);
});
// Menú Hamburguesa para móviles
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('main-nav');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        // Prevenir scroll cuando el menú está abierto
        if (mainNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        const isClickInsideNav = mainNav.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Ajustar menú al redimensionar la ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});