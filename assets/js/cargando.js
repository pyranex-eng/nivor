// Configuración
        const totalSeconds = 5;
        let seconds = totalSeconds;
        const timerElement = document.getElementById('timer');
        const progressBar = document.getElementById('progressBar');
        const skipBtn = document.getElementById('skipBtn');
        const particlesContainer = document.getElementById('hologramParticles');
        const mainContainer = document.getElementById('mainContainer');
        const hologramPyramid = document.querySelector('.hologram-pyramid');
        let audioContext;
        let oscillator;
        
        // Crear partículas orbitantes para el holograma
        function createHologramParticles() {
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('hologram-particle');
                
                // Tamaño aleatorio
                const size = Math.random() * 5 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Color aleatorio en tonos cian/azul
                const hue = 180 + Math.random() * 40;
                particle.style.background = `hsl(${hue}, 100%, 70%)`;
                particle.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, 100%, 70%)`;
                
                // Animación con delay aleatorio
                const orbitDuration = 3 + Math.random() * 4;
                const delay = Math.random() * 5;
                particle.style.animation = `particleOrbit ${orbitDuration}s infinite linear ${delay}s`;
                
                particlesContainer.appendChild(particle);
            }
        }
        
        // Crear partículas de fondo interactivas
        function createBackgroundParticles() {
            const canvas = document.getElementById('particle-background');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            let particlesArray = [];
            const numberOfParticles = 150;
            
            // Medir el movimiento del mouse
            let mouse = {
                x: null,
                y: null,
                radius: 150
            };
            
            window.addEventListener('mousemove', function(event) {
                mouse.x = event.x;
                mouse.y = event.y;
            });
            
            // Crear partículas
            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 3 + 1;
                    this.baseX = this.x;
                    this.baseY = this.y;
                    this.density = (Math.random() * 30) + 1;
                    this.hue = 190 + Math.random() * 20;
                    this.color = `hsla(${this.hue}, 100%, ${Math.random() * 30 + 50}%, 0.7)`;
                    this.speed = 0.5 + Math.random() * 2;
                    this.angle = Math.random() * Math.PI * 2;
                }
                
                draw() {
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                }
                
                update() {
                    // Movimiento natural
                    this.angle += 0.01;
                    this.baseX += Math.cos(this.angle) * this.speed;
                    this.baseY += Math.sin(this.angle) * this.speed;
                    
                    // Comprobar la posición del mouse
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Máxima distancia para el efecto
                    const maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
                    
                    // Si la fuerza es negativa, no hacer nada
                    if (force < 0) force = 0;
                    
                    let directionX = dx / distance * force * this.density;
                    let directionY = dy / distance * force * this.density;
                    
                    if (distance < mouse.radius) {
                        this.x -= directionX;
                        this.y -= directionY;
                    } else {
                        if (this.x !== this.baseX) {
                            let dx = this.x - this.baseX;
                            this.x -= dx / 10;
                        }
                        if (this.y !== this.baseY) {
                            let dy = this.y - this.baseY;
                            this.y -= dy / 10;
                        }
                    }
                    
                    // Mantener partículas dentro del canvas
                    if (this.x < 0) this.x = 0;
                    if (this.x > canvas.width) this.x = canvas.width;
                    if (this.y < 0) this.y = 0;
                    if (this.y > canvas.height) this.y = canvas.height;
                    
                    this.draw();
                }
            }
            
            function init() {
                particlesArray = [];
                for (let i = 0; i < numberOfParticles; i++) {
                    particlesArray.push(new Particle());
                }
            }
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Fondo con degradado sutil
                const gradient = ctx.createRadialGradient(
                    canvas.width / 2,
                    canvas.height / 2,
                    0,
                    canvas.width / 2,
                    canvas.height / 2,
                    canvas.width
                );
                gradient.addColorStop(0, "rgba(0, 20, 30, 0.2)");
                gradient.addColorStop(1, "rgba(0, 0, 10, 0.5)");
                
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                for (let i = 0; i < particlesArray.length; i++) {
                    particlesArray[i].update();
                }
                
                requestAnimationFrame(animate);
            }
            
            init();
            animate();
            
            // Reajustar cuando se cambia el tamaño de la ventana
            window.addEventListener('resize', function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                init();
            });
        }
        
        // Iniciar la cuenta regresiva
        function startCountdown() {
            const countdownInterval = setInterval(() => {
                seconds--;
                timerElement.textContent = seconds;
                
                // Actualizar barra de progreso
                const progressPercentage = 100 - (seconds / totalSeconds * 100);
                progressBar.style.width = `${progressPercentage}%`;
                
                // Efecto visual en los últimos segundos
                if (seconds <= 3) {
                    timerElement.style.animation = 'blink 0.5s infinite';
                    
                    // Intensificar animación del holograma
                    document.querySelector('.hologram-core').style.animation = 'pulseCore 0.5s infinite alternate';
                    
                    // Aumentar intensidad de partículas
                    const particles = document.querySelectorAll('.hologram-particle');
                    particles.forEach(particle => {
                        particle.style.boxShadow = '0 0 15px #0ef';
                    });
                }
                
                if (seconds <= 0) {
                    clearInterval(countdownInterval);
                    redirectToMain();
                }
            }, 1000);
            
            return countdownInterval;
        }
        
        // Iniciar efectos de sonido (solo después de interacción del usuario)
        function initAudio() {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // Crear oscilador para sonido ambiental
                oscillator = audioContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
                
                // Crear ganancia para controlar volumen
                const gainNode = audioContext.createGain();
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                
                // Conectar y empezar
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Solo iniciar el audio después de una interacción del usuario
                document.body.addEventListener('click', function initAudioOnClick() {
                    if (audioContext.state === 'suspended') {
                        audioContext.resume();
                    }
                    oscillator.start();
                    document.body.removeEventListener('click', initAudioOnClick);
                }, { once: true });
            } catch (e) {
                console.log('El audio no está soportado en este navegador');
            }
        }
        
        // Función de redirección
        function redirectToMain() {
            // Efecto visual antes de redirigir
            mainContainer.style.opacity = '0.9';
            mainContainer.style.transform = 'scale(1.05)';
            mainContainer.style.transition = 'all 0.8s ease';
            
            document.querySelector('.hologram-pyramid').style.animation = 'none';
            document.querySelector('.hologram-pyramid').style.transform = 'scale(1.8)';
            document.querySelector('.hologram-pyramid').style.opacity = '0.7';
            document.querySelector('.hologram-pyramid').style.transition = 'all 0.8s ease';
            
            document.querySelector('.hologram-core').style.animation = 'none';
            document.querySelector('.hologram-core').style.transform = 'scale(2)';
            document.querySelector('.hologram-core').style.opacity = '0.5';
            document.querySelector('.hologram-core').style.transition = 'all 0.8s ease';
            
            // Detener sonido si está activo
            if (oscillator) {
                oscillator.stop();
            }
            
            // Redirigir después del efecto
            setTimeout(() => {
                window.location.href = "inicio.html";
            }, 800);
        }
        
        // Custom cursor
        function initCustomCursor() {
            const cursor = document.querySelector('.cursor');
            const cursorFollower = document.querySelector('.cursor-follower');
            
            document.addEventListener('mousemove', function(e) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                
                // Suavizar el movimiento del follower
                setTimeout(() => {
                    cursorFollower.style.left = e.clientX + 'px';
                    cursorFollower.style.top = e.clientY + 'px';
                }, 50);
            });
            
            // Efecto hover en elementos interactivos
            const interactiveElements = document.querySelectorAll('button, a, .skip-btn');
            
            interactiveElements.forEach(elem => {
                elem.addEventListener('mouseenter', () => {
                    cursor.classList.add('hover');
                    cursorFollower.classList.add('hover');
                });
                
                elem.addEventListener('mouseleave', () => {
                    cursor.classList.remove('hover');
                    cursorFollower.classList.remove('hover');
                });
            });
        }
        
        // Efecto de movimiento con el mouse para el cubo
        function initCubeMouseMoveEffects() {
            document.addEventListener('mousemove', function(e) {
                const x = (window.innerWidth / 2 - e.clientX) / 25;
                const y = (window.innerHeight / 2 - e.clientY) / 25;
                
                // Aplicar rotación al cubo holográfico basado en la posición del mouse
                hologramPyramid.style.transform = `rotateY(${x * 2}deg) rotateX(${y * 2}deg)`;
                
                // Aplicar transformación a los elementos
                mainContainer.style.transform = `translate3d(${x * 0.5}px, ${y * 0.5}px, 0)`;
            });
        }
        
        // Inicializar
        function init() {
            createHologramParticles();
            createBackgroundParticles();
            initCustomCursor();
            initCubeMouseMoveEffects();
            initAudio();
            
            let countdownInterval = startCountdown();
            
            // Botón para saltar la espera
            skipBtn.addEventListener('click', () => {
                clearInterval(countdownInterval);
                redirectToMain();
            });
        }
        
        // Iniciar cuando el documento esté listo
        document.addEventListener('DOMContentLoaded', init);