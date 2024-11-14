/* index.js */

class Particles {
  constructor(container, options = {}) {
    this.container = container;
    this.canvas = container.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    this.options = {
      quantity: options.quantity || 100,
      staticity: options.staticity || 30,
      ease: options.ease || 30
    };

    this.mouse = { x: 0, y: 0 };
    this.circles = [];
    this.canvasSize = { w: 0, h: 0 };

    this.initCanvas();
    this.bindEvents();
    this.animate();
  }

  initCanvas() {
    this.resizeCanvas();
    this.drawParticles();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.initCanvas());
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  resizeCanvas() {
    this.circles = [];
    this.canvasSize.w = this.container.offsetWidth;
    this.canvasSize.h = this.container.offsetHeight;
    this.canvas.width = this.canvasSize.w * this.dpr;
    this.canvas.height = this.canvasSize.h * this.dpr;
    this.canvas.style.width = `${this.canvasSize.w}px`;
    this.canvas.style.height = `${this.canvasSize.h}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const { w, h } = this.canvasSize;
    const x = e.clientX - rect.left - w / 2;
    const y = e.clientY - rect.top - h / 2;
    const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
    if(inside) {
      this.mouse.x = x;
      this.mouse.y = y;
    }
  }

  circleParams() {
    return {
      x: Math.floor(Math.random() * this.canvasSize.w),
      y: Math.floor(Math.random() * this.canvasSize.h),
      translateX: 0,
      translateY: 0,
      size: Math.floor(Math.random() * 2) + 0.1,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      magnetism: 0.1 + Math.random() * 4
    };
  }

  drawCircle(circle, update = false) {
    const { x, y, translateX, translateY, size, alpha } = circle;
    this.ctx.translate(translateX, translateY);
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, 2 * Math.PI);
    this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    this.ctx.fill();
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if(!update) {
      this.circles.push(circle);
    }
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
    for(let i = 0; i < this.options.quantity; i++) {
      this.drawCircle(this.circleParams());
    }
  }

  remapValue(value, start1, end1, start2, end2) {
    const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
    this.circles.forEach((circle, i) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        this.canvasSize.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        this.canvasSize.h - circle.y - circle.translateY - circle.size
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(this.remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
    
      if(remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if(circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
    
      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX += (this.mouse.x / (this.options.staticity / circle.magnetism) - circle.translateX) / this.options.ease;
      circle.translateY += (this.mouse.y / (this.options.staticity / circle.magnetism) - circle.translateY) / this.options.ease;

      if (
        circle.x < -circle.size ||
        circle.x > this.canvasSize.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > this.canvasSize.h + circle.size
      ) {
        this.circles.splice(i, 1);
        const newCircle = this.circleParams();
        this.drawCircle(newCircle);
      } else {
        this.drawCircle (
          {
            ...circle,
            x: circle.x,
            y: circle.y,
            translateX: circle.translateX,
            translateY: circle.translateY,
            alpha: circle.alpha
          },
          true
        );
      }
    });
  
    window.requestAnimationFrame(() => this.animate());
  }
}

setTimeout(() => {
  new Particles(document.getElementById('particles-container'), {
    quantity: 100,
    staticity: 30,
    ease: 30
  });
}, 200);

setTimeout(() => {
  document.getElementById('myImage').style.display = "";
  document.getElementById('connectBtn').style.display = "flex";
}, 1300);