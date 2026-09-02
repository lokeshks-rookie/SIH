/**
 * SimEngine — Core Quantum Simulation Engine
 * Handles high-DPI canvas setup, delta-time rendering loop,
 * bloom/glow management, particle pools, and wave-packet rendering.
 */

export function rand(a, b) {
  return a + Math.random() * (b - a);
}

export function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export function gaussian(x, mu, sigma) {
  return Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma));
}

export function setGlow(ctx, color, blur = 10) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
}

export function clearGlow(ctx) {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

/**
 * FlashSystem — Signature amber measurement pulse with radiant bloom
 */
export class FlashSystem {
  constructor() {
    this.flashes = [];
  }

  spawn(x, y, color = '#FFD166') {
    this.flashes.push({ x, y, r: 2, life: 1, color });
  }

  updateAndDraw(ctx, dt = 0.016) {
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i];
      ctx.save();
      setGlow(ctx, f.color, 14 * f.life);
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 209, 102, ${Math.max(0, f.life)})`;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Inner flash center
      ctx.beginPath();
      ctx.arc(f.x, f.y, Math.max(1, f.r * 0.35), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 240, 180, ${Math.max(0, f.life * 0.8)})`;
      ctx.fill();

      clearGlow(ctx);
      ctx.restore();

      f.r += 140 * dt;
      f.life -= 2.0 * dt;
      if (f.life <= 0) {
        this.flashes.splice(i, 1);
      }
    }
  }

  clear() {
    this.flashes = [];
  }
}

/**
 * ParticleSystem — General purpose particle pool with delta-time updates
 */
export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawn(props) {
    this.particles.push({ ...props, life: props.life ?? 1 });
  }

  update(dt, updater) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      const keep = updater(p, dt, i);
      if (!keep) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx, drawer) {
    for (let i = 0; i < this.particles.length; i++) {
      drawer(ctx, this.particles[i]);
    }
  }

  clear() {
    this.particles = [];
  }

  get count() {
    return this.particles.length;
  }
}

/**
 * drawWavePacket — Generalized wave-packet with glow and envelope shading
 */
export function drawWavePacket(ctx, {
  centerX,
  amplitude = 1,
  sigma = 34,
  wavelengthFactor = 0.35,
  midY,
  width,
  color = '#7BE0D9',
  step = 3,
  fillAlpha = '33',
  glow = true
}) {
  if (amplitude <= 0.02) return;

  ctx.save();
  if (glow) {
    setGlow(ctx, color, 10 * amplitude);
  }

  // Stroke wave oscillating carrier
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  for (let x = 0; x <= width; x += step) {
    const env = gaussian(x, centerX, sigma) * amplitude;
    const y = midY - env * 90 * Math.sin((x - centerX) * wavelengthFactor);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  clearGlow(ctx);

  // Shaded envelope (|ψ|²)
  ctx.beginPath();
  const fill = color.startsWith('#') && color.length === 7 ? `${color}${fillAlpha}` : 'rgba(123, 224, 217, 0.2)';
  ctx.fillStyle = fill;
  for (let x = 0; x <= width; x += step) {
    const env = gaussian(x, centerX, sigma) * amplitude;
    const y = midY - env * 90;
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  for (let x = width; x >= 0; x -= step) {
    const env = gaussian(x, centerX, sigma) * amplitude;
    const y = midY + env * 90;
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * SimEngine — Canvas lifecycle, high-DPI scaling, and delta-time loop manager
 */
export class SimEngine {
  constructor(canvas, {
    logicalWidth = 860,
    logicalHeight = 380,
    onTick,
    backgroundClear = 'rgba(18, 21, 31, 0.25)' // Stage 2: Soft motion trails
  } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.logicalWidth = logicalWidth;
    this.logicalHeight = logicalHeight;
    this.onTick = onTick;
    this.backgroundClear = backgroundClear;

    this.flashes = new FlashSystem();
    this.particles = new ParticleSystem();

    this.running = false;
    this.lastTime = 0;
    this.animationFrameId = null;

    this.setupDPI();
  }

  setupDPI() {
    const dpr = window.devicePixelRatio || 1;
    this.dpr = dpr;

    this.canvas.style.aspectRatio = `${this.logicalWidth} / ${this.logicalHeight}`;
    this.canvas.style.width = '100%';
    this.canvas.style.height = 'auto';

    this.canvas.width = this.logicalWidth * dpr;
    this.canvas.height = this.logicalHeight * dpr;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();

    const loop = (now) => {
      if (!this.running) return;

      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;

      // Soft motion trail fill
      if (this.backgroundClear) {
        this.ctx.save();
        this.ctx.fillStyle = this.backgroundClear;
        this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);
        this.ctx.restore();
      } else {
        this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
      }

      // Frame tick
      if (this.onTick) {
        this.onTick({
          ctx: this.ctx,
          dt,
          width: this.logicalWidth,
          height: this.logicalHeight,
          flashes: this.flashes,
          particles: this.particles
        });
      }

      // Draw measurement flashes with amber pulse
      this.flashes.updateAndDraw(this.ctx, dt);

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  destroy() {
    this.stop();
    this.flashes.clear();
    this.particles.clear();
  }
}
