const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let maxParticles = 120; 

// Exact Google Core Colors
const colors = [
  '#4285F4', // Blue
  '#EA4335', // Red
  '#FBBC05', // Yellow
  '#34A853'  // Green
];

let mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

let time = 0;

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY + window.scrollY; // Adjust for scroll
});

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  const heroSection = document.querySelector('.hero');
  canvas.height = heroSection ? heroSection.offsetHeight : window.innerHeight;
}

class Particle {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    // slow drift to bases
    this.dx = (Math.random() - 0.5) * 0.5;
    this.dy = (Math.random() - 0.5) * 0.5;
    this.size = size;
    this.baseSize = size;
    this.color = color;
  }

  draw() {
    if(this.size <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    // Add soft glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.shadowBlur = 0; // reset
  }

  update() {
    // slow drift
    this.baseX += this.dx;
    this.baseY += this.dy;

    if (this.baseX > canvas.width || this.baseX < 0) this.dx = -this.dx;
    if (this.baseY > canvas.height || this.baseY < 0) this.dy = -this.dy;

    // Apply 3D puddle wipe from mouse
    let dx = this.baseX - mouse.x;
    let dy = this.baseY - mouse.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // 30% screen width constraint
    let radiusThreshold = window.innerWidth * 0.3;

    // Only configure size/alpha and draw if within the restricted radius
    if (distance <= radiusThreshold) {
        let waveLength = 40; 
        let speed = 0.05;    
        let amplitude = 40;  

        let wave = Math.sin(distance / waveLength - time * speed) * amplitude;
        
        // dampen the wave
        let dampen = Math.max(0, 1 - distance / radiusThreshold);
        let displacement = wave * (dampen * dampen);

        // Perspective effect: shift points towards/away from mouse epicenter
        if (distance > 0) {
          let dirX = dx / distance;
          let dirY = dy / distance;
          this.x = this.baseX + dirX * displacement;
          this.y = this.baseY + dirY * displacement;
        } else {
          this.x = this.baseX;
          this.y = this.baseY;
        }

        // Adjust size based on wave
        let sizeOffset = (displacement / amplitude) * 1.5; 
        this.size = Math.max(0, this.baseSize + sizeOffset);

        // Smooth fade out towards the radius edge so it looks like a soft circle mask
        let alpha = 1 - Math.pow(distance / radiusThreshold, 2);
        ctx.globalAlpha = Math.max(0, alpha);
        this.draw();
        ctx.globalAlpha = 1.0;
    }
  }
}

function initParticles() {
  particles = [];
  maxParticles = window.innerWidth < 768 ? 60 : 180; // adjusted for smaller dot count visibility
  
  for (let i = 0; i < maxParticles; i++) {
    // Smaller particles: radius between 1 and 3
    let size = (Math.random() * 2) + 1; 
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
    let color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(new Particle(x, y, size, color));
  }
}

function animate() {
  time++;
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }
}

setTimeout(() => {
  resizeCanvas();
  initParticles();
  animate();
}, 100);
