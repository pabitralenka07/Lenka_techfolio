/**
 * FolderFloat - Pure Vanilla JS + CSS / Matter.js implementation
 * Adapted from React Bits (FolderFloat)
 */

const PAD = 28;
const CHAR = 6.8;
const GAP = 12;
const ROW = 52;
const DRAG_MIN = 4;
const ZONE_PAD = 8;

const jitter = i => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

const layout = (list, spread, lift, tilt, sizes) => {
  const rows = [];
  let row = [];
  let width = 0;
  list.forEach((item, i) => {
    const pw = sizes[i]?.w ?? PAD + item.label.length * CHAR;
    if (row.length && width + GAP + pw > spread * 2) {
      rows.push({ items: row, width });
      row = [];
      width = 0;
    }
    row.push({ i, pw });
    width += (row.length > 1 ? GAP : 0) + pw;
  });
  if (row.length) rows.push({ items: row, width });
  const pos = [];
  rows.forEach((r, ri) => {
    let x = -r.width / 2;
    const shift = (ri % 2 ? 1 : -1) * Math.min(16, spread * 0.1);
    r.items.forEach(({ i, pw }) => {
      const j = jitter(i);
      pos[i] = {
        x: x + pw / 2 + shift + (j - 0.5) * 6,
        y: -lift - ri * ROW - j * 6,
        r: tilt * (j * 2 - 1)
      };
      x += pw + GAP;
    });
  });
  return pos;
};

export function initFolderFloat(container, options = {}) {
  const target = typeof container === 'string' ? document.querySelector(container) : container;
  if (!target) return null;

  const {
    items = [
      'AI/ML Specialist · Mind Brain',
      'Web Developer · Internpy',
      'B.Tech in Computer Science',
      'Python & Cloud Architecture',
      'Data Science & Analytics',
      'Creative Photography'
    ],
    label = 'Certificates & Awards',
    sublabel = '',
    trigger = 'hover',
    defaultOpen = false,
    closeOnSelect = true,
    physics = true,
    drift = 0.5,
    onSelect = null,
    onOpenChange = null,
    folderColor = '#262323',
    frontColor = '#353131',
    paperColor = '#ded8d2',
    itemColor = '#f4efe9',
    itemTextColor = '#1a1818',
    labelColor = '#e8e4e0',
    width = 200,
    height = 148,
    radius = 14,
    spread = 180,
    lift = 26,
    tilt = 8,
    flapAngle = 34,
    restAngle = 16,
    openDuration = 520,
    stagger = 45,
    bounce = 0.3,
    className = ''
  } = options;

  const defaultSpread = Math.min(spread, Math.max(120, Math.floor((window.innerWidth - 40) / 2)));
  const effectiveSpread = defaultSpread;

  const list = items.map(item => (typeof item === 'string' ? { label: item, value: item } : item));
  const n = list.length;
  const sub = sublabel || `${n} ${n === 1 ? 'badge' : 'badges'}`;

  let open = defaultOpen;
  let sizes = [];
  let pos = layout(list, effectiveSpread, lift, tilt, sizes);

  const world = {
    engine: null,
    bodies: [],
    sizes: [],
    raf: 0,
    last: 0,
    t0: 0,
    drag: null,
    zone: null,
    live: false
  };

  let popTimer = null;
  let liveTimer = null;
  let reducedMotion = false;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion = mq.matches;
  mq.addEventListener('change', e => {
    reducedMotion = e.matches;
  });

  // Root element
  const root = document.createElement('div');
  root.className = `folder-float${className ? ` ${className}` : ''}`;
  if (open) root.setAttribute('data-open', '');
  if (physics) root.setAttribute('data-physics', '');
  root.setAttribute('data-trigger', trigger);

  // Set CSS Custom Properties
  root.style.setProperty('--ff-w', `${width}px`);
  root.style.setProperty('--ff-h', `${height}px`);
  root.style.setProperty('--ff-r', `${radius}px`);
  root.style.setProperty('--ff-back', folderColor);
  root.style.setProperty('--ff-front', frontColor);
  root.style.setProperty('--ff-paper', paperColor);
  root.style.setProperty('--ff-item', itemColor);
  root.style.setProperty('--ff-item-ink', itemTextColor);
  root.style.setProperty('--ff-label', labelColor);
  root.style.setProperty('--ff-spread', `${effectiveSpread}px`);
  root.style.setProperty('--ff-lift', `${lift}px`);
  root.style.setProperty('--ff-angle', `${flapAngle}deg`);
  root.style.setProperty('--ff-rest', `${restAngle}deg`);
  root.style.setProperty('--ff-open', `${openDuration}ms`);
  root.style.setProperty('--ff-close', `${Math.round(openDuration * 0.6)}ms`);
  root.style.setProperty('--ff-stagger', `${stagger}ms`);
  root.style.setProperty('--ff-n', n);
  root.style.setProperty('--ff-spring', `cubic-bezier(0.34, ${(1 + bounce * 1.9).toFixed(2)}, 0.64, 1)`);

  // Items container
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'folder-float__items';

  const pillButtons = [];
  list.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'folder-float__item';
    btn.tabIndex = open ? 0 : -1;
    btn.setAttribute('aria-hidden', (!open).toString());
    btn.style.setProperty('--i', i);

    const span = document.createElement('span');
    span.className = 'folder-float__drift';
    span.textContent = item.label;
    btn.appendChild(span);

    itemsContainer.appendChild(btn);
    pillButtons.push(btn);
  });

  // Folder geometry
  const folderBox = document.createElement('div');
  folderBox.className = 'folder-float__folder';

  const back = document.createElement('span');
  back.className = 'folder-float__back';
  back.setAttribute('aria-hidden', 'true');

  const paper = document.createElement('span');
  paper.className = 'folder-float__paper';
  paper.setAttribute('aria-hidden', 'true');

  const front = document.createElement('span');
  front.className = 'folder-float__front';
  front.setAttribute('aria-hidden', 'true');

  const labelEl = document.createElement('span');
  labelEl.className = 'folder-float__label';
  labelEl.textContent = label;

  const subEl = document.createElement('span');
  subEl.className = 'folder-float__sub';
  subEl.textContent = sub;

  front.appendChild(labelEl);
  front.appendChild(subEl);

  const triggerBtn = document.createElement('button');
  triggerBtn.type = 'button';
  triggerBtn.className = 'folder-float__trigger';
  triggerBtn.setAttribute('aria-expanded', open.toString());
  triggerBtn.setAttribute('aria-label', `${label}, ${sub}`);

  folderBox.appendChild(back);
  folderBox.appendChild(paper);
  folderBox.appendChild(front);
  folderBox.appendChild(triggerBtn);

  root.appendChild(itemsContainer);
  root.appendChild(folderBox);

  target.innerHTML = '';
  target.appendChild(root);

  // Measure sizes & calculate layout
  const measure = () => {
    const next = pillButtons.map(el => (el ? { w: el.offsetWidth, h: el.offsetHeight } : null));
    if (next.some(s => !s || s.w === 0)) return;
    sizes = next;
    pos = layout(list, effectiveSpread, lift, tilt, sizes);
    pillButtons.forEach((btn, i) => {
      const p = pos[i];
      if (p) {
        btn.style.setProperty('--x', `${p.x.toFixed(1)}px`);
        btn.style.setProperty('--y', `${p.y.toFixed(1)}px`);
        btn.style.setProperty('--r', `${p.r.toFixed(2)}deg`);
      }
    });
  };

  requestAnimationFrame(() => {
    measure();
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
  });

  // Physics management
  const stopPhysics = () => {
    clearTimeout(liveTimer);
    cancelAnimationFrame(world.raf);
    world.raf = 0;
    const Matter = window.Matter;
    if (world.engine && Matter) {
      world.bodies.forEach((b, i) => {
        const el = pillButtons[i];
        if (!el) return;
        el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
        el.style.setProperty('--y', `${(b.position.y - world.sizes[i].h / 2).toFixed(1)}px`);
      });
      Matter.Composite.clear(world.engine.world, false, true);
      Matter.Engine.clear(world.engine);
      world.engine = null;
    }
    world.bodies = [];
    world.drag = null;
    world.live = false;
    root.removeAttribute('data-live');
  };

  const startPhysics = () => {
    const Matter = window.Matter;
    if (!Matter || world.engine) return;
    const { Bodies, Body, Composite, Engine } = Matter;

    const els = pillButtons.slice(0, n);
    if (els.some(el => !el || el.offsetWidth === 0)) return;

    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    engine.enableSleeping = false;
    world.engine = engine;
    world.sizes = els.map(el => ({ w: el.offsetWidth, h: el.offsetHeight }));

    const ys = pos.map(p => p.y);
    const zone = {
      left: -effectiveSpread - ZONE_PAD,
      right: effectiveSpread + ZONE_PAD,
      top: Math.min(...ys) - ZONE_PAD,
      bottom: -lift + Math.max(...world.sizes.map(s => s.h))
    };
    world.zone = zone;

    world.bodies = els.map((el, i) => {
      const { w: bw, h: bh } = world.sizes[i];
      const b = Bodies.rectangle(pos[i].x, pos[i].y + bh / 2, bw, bh, {
        chamfer: { radius: Math.min(bh / 2 - 1, 16) },
        restitution: 0.55,
        friction: 0,
        frictionAir: 0.08,
        inertia: Infinity
      });
      b.plugin = { phase: jitter(i) * Math.PI * 2 };
      return b;
    });

    const T = 80;
    const walls = [
      Bodies.rectangle((zone.left + zone.right) / 2, zone.top - T / 2, zone.right - zone.left + 2 * T, T, {
        isStatic: true
      }),
      Bodies.rectangle((zone.left + zone.right) / 2, zone.bottom + T / 2, zone.right - zone.left + 2 * T, T, {
        isStatic: true
      }),
      Bodies.rectangle(zone.left - T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, {
        isStatic: true
      }),
      Bodies.rectangle(zone.right + T / 2, (zone.top + zone.bottom) / 2, T, zone.bottom - zone.top + 2 * T, {
        isStatic: true
      })
    ];

    Composite.add(engine.world, [...world.bodies, ...walls]);
    world.live = true;
    world.last = 0;
    world.t0 = performance.now();
    root.setAttribute('data-live', '');

    const tick = now => {
      if (!world.engine) return;
      const dt = world.last ? Math.min(32, now - world.last) : 16;
      world.last = now;
      const t = (now - world.t0) / 1000;
      const k = drift * 0.00005 * Math.min(1, t / 2);

      world.bodies.forEach((b, i) => {
        if (world.drag && world.drag.i === i) return;
        const ph = b.plugin.phase;
        Body.applyForce(b, b.position, {
          x: Math.sin(t * 0.9 + ph) * k * b.mass,
          y: Math.cos(t * 1.3 + ph * 1.7) * k * b.mass
        });
      });

      Engine.update(world.engine, dt);

      world.bodies.forEach((b, i) => {
        const el = pillButtons[i];
        if (!el) return;
        el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
        el.style.setProperty('--y', `${(b.position.y - world.sizes[i].h / 2).toFixed(1)}px`);
      });

      world.raf = requestAnimationFrame(tick);
    };

    world.raf = requestAnimationFrame(tick);
  };

  const setOpen = next => {
    if (open === next) return;
    open = next;
    if (open) {
      root.setAttribute('data-open', '');
      triggerBtn.setAttribute('aria-expanded', 'true');
      pillButtons.forEach(btn => {
        btn.tabIndex = 0;
        btn.setAttribute('aria-hidden', 'false');
      });
      if (physics && !reducedMotion) {
        clearTimeout(liveTimer);
        liveTimer = setTimeout(startPhysics, openDuration + (n - 1) * stagger + 80);
      }
    } else {
      root.removeAttribute('data-open');
      triggerBtn.setAttribute('aria-expanded', 'false');
      pillButtons.forEach(btn => {
        btn.tabIndex = -1;
        btn.setAttribute('aria-hidden', 'true');
      });
      stopPhysics();
    }
    if (typeof onOpenChange === 'function') onOpenChange(open);
  };

  const pick = (item, i) => {
    if (typeof onSelect === 'function') onSelect(item.value, i);
    clearTimeout(popTimer);
    const btn = pillButtons[i];
    if (btn) {
      btn.setAttribute('data-pop', '');
      popTimer = setTimeout(() => btn.removeAttribute('data-pop'), 320);
    }
    if (closeOnSelect) setOpen(false);
  };

  // Pointer interactions for dragging and throwing
  const pointerAt = e => {
    const r = itemsContainer.getBoundingClientRect();
    return r ? { x: e.clientX - r.left, y: e.clientY - r.top } : { x: 0, y: 0 };
  };

  pillButtons.forEach((btn, i) => {
    const item = list[i];

    btn.addEventListener('pointerdown', e => {
      if (!world.live || e.button !== 0) return;
      const b = world.bodies[i];
      if (!b) return;
      const p = pointerAt(e);
      world.drag = {
        i,
        id: e.pointerId,
        dx: b.position.x - p.x,
        dy: b.position.y - p.y,
        sx: e.clientX,
        sy: e.clientY,
        moved: false
      };
      try {
        btn.setPointerCapture(e.pointerId);
      } catch {}
    });

    btn.addEventListener('pointermove', e => {
      const d = world.drag;
      if (!d || d.i !== i || d.id !== e.pointerId) return;
      if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) >= DRAG_MIN) {
        d.moved = true;
        btn.setAttribute('data-drag', '');
      }
      if (!d.moved) return;

      const Matter = window.Matter;
      if (!Matter) return;
      const { Body } = Matter;

      const b = world.bodies[i];
      const { w: bw, h: bh } = world.sizes[i];
      const z = world.zone;
      const p = pointerAt(e);
      const x = Math.min(z.right - bw / 2, Math.max(z.left + bw / 2, p.x + d.dx));
      const y = Math.min(z.bottom - bh / 2, Math.max(z.top + bh / 2, p.y + d.dy));
      Body.setVelocity(b, { x: (x - b.position.x) * 0.6, y: (y - b.position.y) * 0.6 });
      Body.setPosition(b, { x, y });
    });

    const onUp = e => {
      const d = world.drag;
      if (!d || d.i !== i || d.id !== e.pointerId) return;
      world.drag = null;
      btn.removeAttribute('data-drag');
      try {
        btn.releasePointerCapture(e.pointerId);
      } catch {}
      if (!d.moved && e.type === 'pointerup') {
        pick(item, i);
      }
    };

    btn.addEventListener('pointerup', onUp);
    btn.addEventListener('pointercancel', onUp);

    btn.addEventListener('click', e => {
      if (!world.live || e.detail === 0) pick(item, i);
    });
  });

  // Trigger handlers
  triggerBtn.addEventListener('click', () => setOpen(!open));

  if (trigger === 'hover') {
    root.addEventListener('pointerenter', () => setOpen(true));
    root.addEventListener('pointerleave', () => {
      if (!world.drag) setOpen(false);
    });
  }

  root.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
    }
  });

  return {
    setOpen,
    open: () => open,
    destroy: () => {
      clearTimeout(liveTimer);
      clearTimeout(popTimer);
      stopPhysics();
      target.innerHTML = '';
    }
  };
}

if (typeof window !== 'undefined') {
  window.initFolderFloat = initFolderFloat;
}

export default initFolderFloat;
