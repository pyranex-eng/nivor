// Configuración de partículas
        document.addEventListener('DOMContentLoaded', function() {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#1ed5f5" },
                    shape: { type: "circle" },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#1ed5f5",
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
                        onhover: { enable: true, mode: "grab" },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    },
                    modes: {
                        grab: { distance: 140, line_linked: { opacity: 1 } },
                        push: { particles_nb: 4 }
                    }
                },
                retina_detect: true
            });
            
            // Animación de aparición de elementos
            const elements = document.querySelectorAll('.fade-in');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeIn 1s ease forwards';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            elements.forEach(element => {
                observer.observe(element);
            });
            
            // FAQ interactivo
            const faqQuestions = document.querySelectorAll('.faq-question');
            faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    const answer = question.nextElementSibling;
                    const icon = question.querySelector('i');
                    
                    if (answer.style.display === 'block') {
                        answer.style.display = 'none';
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    } else {
                        answer.style.display = 'block';
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                });
            });
            
            // Formulario de contacto para WhatsApp
            const contactForm = document.getElementById('contact-form');
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Obtener valores del formulario
                const nombre = document.getElementById('nombre').value;
                const email = document.getElementById('email').value;
                const paquete = document.getElementById('paquete').value;
                const mensaje = document.getElementById('mensaje').value;
                
                // Número de WhatsApp (cambiar por tu número real después)
                const phoneNumber = "5551234567"; // Número de ejemplo
                
                // Crear mensaje para WhatsApp
                const whatsappMessage = `Hola, estoy interesado en los servicios de NIVOR.%0A%0A*Nombre:* ${nombre}%0A*Email:* ${email}%0A*Paquete de interés:* ${paquete}%0A*Mensaje:* ${mensaje}`;
                
                // Abrir WhatsApp con el mensaje
                window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, '_blank');
                
                // Opcional: resetear el formulario
                contactForm.reset();
            });
        });