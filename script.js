const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.6 + 0.2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 120; i++) {
    particles.push(new Particle());
}

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
}
animate();

// ==========================================
// 赛博传送门 (含 XSS 制裁与 JS 强制物理动画)
// ==========================================
const jumpBtn = document.getElementById('jumpBtn');

// 【物理外挂】监听手指按下，强行加上动画类，100%触发！
jumpBtn.addEventListener('touchstart', function(e) {
    this.classList.add('btn-pressed');
}, { passive: true });

// 【物理外挂】监听手指抬起或滑走，强行移除动画类
jumpBtn.addEventListener('touchend', function(e) {
    this.classList.remove('btn-pressed');
}, { passive: true });
jumpBtn.addEventListener('touchcancel', function(e) {
    this.classList.remove('btn-pressed');
}, { passive: true });

// 核心点击逻辑
jumpBtn.addEventListener('click', function(e) {
    this.blur(); 
    this.classList.remove('btn-pressed'); // 防止偶尔卡住

    let url = document.getElementById('targetUrl').value.trim();
    
    if (url === '') {
        alert('你连个网址都不输，我怎么带你飞？');
        return;
    }

    const lowerUrl = url.toLowerCase();

    if (lowerUrl.startsWith('javascript:') || 
        lowerUrl.startsWith('data:') || 
        lowerUrl.startsWith('vbscript:')) {
        
        alert('想黑我的白子？接受制裁吧！');
        window.location.href = 'Never.mp4'; 
        return;
    }

    if (lowerUrl.startsWith('http://')) {
        alert('什么年代了还在用 HTTP 明文裸奔？老子不支持！');
        return; 
    }

    let finalUrl = url;
    if (!/^https:\/\//i.test(url)) {
        finalUrl = 'https://' + url;
    }

    if (!/^https:\/\//i.test(finalUrl)) {
        window.location.href = 'Never.mp4';
        return;
    }

    window.open(finalUrl, '_blank', 'noopener,noreferrer');
});

// 回车键触发
document.getElementById('targetUrl').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        this.blur(); 
        jumpBtn.click(); 
    }
});