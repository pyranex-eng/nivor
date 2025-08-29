// Efecto Matrix mejorado
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        let letters = '01ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz1234567890';
        letters = letters.split('');
        
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        
        const drops = [];
        for(let i = 0; i < columns; i++) {
            drops[i] = Math.random() * 100;
        }
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#20DEFF';
            ctx.font = `${fontSize}px monospace`;
            
            for(let i = 0; i < drops.length; i++) {
                const text = letters[Math.floor(Math.random() * letters.length)];
                
                // Efecto de desvanecimiento
                const opacity = Math.random() * 0.5 + 0.5;
                ctx.globalAlpha = opacity;
                
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                drops[i]++;
            }
            
            ctx.globalAlpha = 1;
        }
        
        setInterval(drawMatrix, 33);
        
        // Efecto de partículas mejorado
        const particlesContainer = document.getElementById('particles');
        const particleCount = 80;
        
        for(let i = 0; i < particleCount; i++) {
            createParticle();
        }
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            
            // Animación personalizada para cada partícula
            particle.style.animation = `
                float ${duration}s ease-in-out ${delay}s infinite alternate
            `;
            
            particlesContainer.appendChild(particle);
            
            // Recrear partículas periódicamente para un efecto más dinámico
            setTimeout(() => {
                particle.remove();
                createParticle();
            }, (duration + delay) * 1000);
        }
        
        // Definir keyframes para la animación de partículas
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0.2;
                }
                50% {
                    opacity: 0.7;
                }
                100% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                    opacity: 0.2;
                }
            }
            
            .progress-bar {
                height: 6px;
                background: rgba(32, 222, 255, 0.1);
                border-radius: 3px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: #20DEFF;
                border-radius: 3px;
                box-shadow: 0 0 5px rgba(32, 222, 255, 0.5);
                animation: progressAnimation 1.5s ease-in-out;
            }
            
            @keyframes progressAnimation {
                0% { width: 0%; }
                100% { width: attr(style); }
            }
        `;
        document.head.appendChild(style);
        
        // Cursor personalizado
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            setTimeout(() => {
                cursorFollower.style.left = `${e.clientX}px`;
                cursorFollower.style.top = `${e.clientY}px`;
            }, 100);
        });
        
        document.querySelectorAll('a, .btn, .whatsapp-float, .skill-tag, .achievement').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
        
        // Efecto de revelado al hacer scroll mejorado
        function revealElements() {
            const reveals = document.querySelectorAll('.reveal');
            
            for(let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = reveals[i].getBoundingClientRect().top;
                const elementVisible = 150;
                
                if(elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add('active');
                }
            }
        }
        
        window.addEventListener('scroll', revealElements);
        revealElements();
        
        // Ajustar canvas al redimensionar ventana
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        // Efectos adicionales para las tarjetas
        document.querySelectorAll('.card, .profile-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.style.transform = `perspective(1000px) rotateX(${(y - rect.height/2) / 20}deg) rotateY(${(x - rect.width/2) / 20}deg)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
            
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'transform 0.3s ease';
            });
        });