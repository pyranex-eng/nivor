// Inicialización de Particles.js
        document.addEventListener('DOMContentLoaded', function() {
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
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
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
            
            // Efecto de spotlight que sigue el cursor
            const spotlight = document.getElementById('spotlight');
            document.addEventListener('mousemove', function(e) {
                spotlight.style.left = e.pageX - 100 + 'px';
                spotlight.style.top = e.pageY - 100 + 'px';
                spotlight.style.opacity = '1';
            });
            
            document.addEventListener('mouseleave', function() {
                spotlight.style.opacity = '0';
            });
            
            // Animación de elementos al hacer scroll
            const animatedElements = document.querySelectorAll('.header, .stats-container, .project-card, .comments-section, .footer');
            
            function checkScroll() {
                animatedElements.forEach(element => {
                    const elementPosition = element.getBoundingClientRect().top;
                    const screenPosition = window.innerHeight / 1.3;
                    
                    if (elementPosition < screenPosition) {
                        element.classList.add('visible');
                    }
                });
            }
            
            // Ejecutar al cargar y al hacer scroll
            window.addEventListener('load', checkScroll);
            window.addEventListener('scroll', checkScroll);
            
            // Inicializar contador de visitas
            let visits = localStorage.getItem('pageVisits');
            if (!visits) {
                visits = 1587;
            } else {
                visits = parseInt(visits) + 1;
            }
            localStorage.setItem('pageVisits', visits);
            document.getElementById('total-visits').textContent = visits.toLocaleString();
            
            // Filtrado de proyectos por categoría
            const filterButtons = document.querySelectorAll('.categoria-btn');
            const projectCards = document.querySelectorAll('.project-card');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Quitar clase active de todos los botones
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Añadir clase active al botón clickeado
                    button.classList.add('active');
                    
                    // Obtener la categoría a filtrar
                    const filter = button.getAttribute('data-categoria');
                    
                    // Mostrar u ocultar proyectos según la categoría
                    projectCards.forEach(card => {
                        if (filter === 'todos' || card.getAttribute('data-categoria') === filter) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
            
            // Sistema de valoración con estrellas
            const stars = document.querySelectorAll('.rating-star');
            let currentRating = 0;
            
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    const value = parseInt(star.getAttribute('data-value'));
                    currentRating = value;
                    
                    stars.forEach(s => {
                        const starValue = parseInt(s.getAttribute('data-value'));
                        if (starValue <= value) {
                            s.innerHTML = '<i class="fas fa-star"></i>';
                            s.classList.add('active');
                        } else {
                            s.innerHTML = '<i class="far fa-star"></i>';
                            s.classList.remove('active');
                        }
                    });
                });
                
                star.addEventListener('mouseover', () => {
                    const value = parseInt(star.getAttribute('data-value'));
                    
                    stars.forEach(s => {
                        const starValue = parseInt(s.getAttribute('data-value'));
                        if (starValue <= value) {
                            s.innerHTML = '<i class="fas fa-star"></i>';
                        } else {
                            s.innerHTML = '<i class="far fa-star"></i>';
                        }
                    });
                });
                
                star.addEventListener('mouseout', () => {
                    stars.forEach(s => {
                        const starValue = parseInt(s.getAttribute('data-value'));
                        if (starValue <= currentRating) {
                            s.innerHTML = '<i class="fas fa-star"></i>';
                        } else {
                            s.innerHTML = '<i class="far fa-star"></i>';
                        }
                    });
                });
            });
            
            // Formulario de comentarios
            const commentForm = document.getElementById('new-comment-form');
            commentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('¡Gracias por tu comentario! Será revisado antes de publicarse.');
                commentForm.reset();
                
                // Resetear estrellas
                stars.forEach(s => {
                    s.innerHTML = '<i class="far fa-star"></i>';
                    s.classList.remove('active');
                });
                currentRating = 0;
            });
            
            // Funcionalidad para el botón de WhatsApp
            const whatsappButton = document.getElementById('whatsapp-button');
            const whatsappPopup = document.getElementById('whatsapp-popup');
            
            whatsappButton.addEventListener('click', function(e) {
                e.preventDefault();
                whatsappPopup.classList.toggle('show');
            });
            
            // Cerrar popup al hacer clic fuera
            document.addEventListener('click', function(e) {
                if (!whatsappButton.contains(e.target) && !whatsappPopup.contains(e.target)) {
                    whatsappPopup.classList.remove('show');
                }
            });
        });