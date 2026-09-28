/**
 * particles.js
 * Hệ thống Hạt Bụi Vũ Trụ, Sương Mù Hỗn Độn (Primordial Chaos Nebula) & Vụ Nổ Khai Thiên (Big Bang)
 */

class BaguaParticles {
  constructor(scene, count = 2600, theme = BAGUA_DATA.themes.celestial) {
    this.scene = scene;
    this.count = count;
    this.theme = theme;

    this.points = null;
    this.positions = null;
    this.velocities = null;
    this.originalRadii = null;
    this.chaosRadii = null;
    this.originalZ = null;
    this.angles = null;

    // Lớp sương mù Hỗn Độn (Mông lung bụi vũ trụ thời kỳ đầu)
    this.nebulaPoints = null;
    this.nebulaCount = 160;
    this.nebulaPositions = null;
    this.nebulaBaseRadii = null;
    this.nebulaAngles = null;

    // Điểm Kỳ Dị trung tâm (Singularity) & Sóng xung kích Big Bang (Shockwave)
    this.singularitySprite = null;
    this.shockwaveMesh = null;

    // Trạng thái vũ trụ: 'normal' | 'chaos' | 'converge' | 'explode'
    this.cosmicState = 'normal';
    this.stateProgress = 0;

    this.init();
  }

  init() {
    // 1. HẠT TINH TRẦN & NGUYÊN TỐ VŨ TRỤ
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const colors = new Float32Array(this.count * 3);
    const sizes = new Float32Array(this.count);

    this.velocities = [];
    this.angles = [];
    this.originalRadii = [];
    this.chaosRadii = [];
    this.originalZ = [];

    const colorPrimary = new THREE.Color(this.theme.primary);
    const colorAccent = new THREE.Color(this.theme.accent);
    const colorSecondary = new THREE.Color(this.theme.secondary);

    // Điểm xuyết thêm sắc màu Ngũ Hành (Kim-Mộc-Thủy-Hỏa-Thổ) trong bụi vũ trụ
    const elementalColors = [
      new THREE.Color('#ffd700'), // Kim
      new THREE.Color('#38ef7d'), // Mộc
      new THREE.Color('#00d2ff'), // Thủy
      new THREE.Color('#ff4b2b'), // Hỏa
      new THREE.Color('#e6a145')  // Thổ
    ];

    for (let i = 0; i < this.count; i++) {
      const radius = 120 + Math.pow(Math.random(), 1.45) * 1350;
      const chaosR = 25 + Math.pow(Math.random(), 0.9) * 520;
      const angle = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 480;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = z;

      this.angles.push(angle);
      this.originalRadii.push(radius);
      this.chaosRadii.push(chaosR);
      this.originalZ.push(z);

      this.velocities.push({
        orbitSpeed: (0.0003 + Math.random() * 0.0009) * (Math.random() > 0.35 ? 1 : -1),
        zSpeed: (Math.random() - 0.5) * 0.32,
        pulseSpeed: 0.01 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2
      });

      const mixRatio = Math.random();
      let pColor;
      if (mixRatio < 0.45) {
        pColor = colorPrimary.clone().lerp(colorAccent, mixRatio * 2.2);
      } else if (mixRatio < 0.82) {
        pColor = colorPrimary.clone().lerp(colorSecondary, (mixRatio - 0.45) * 2.5);
      } else {
        // 18% hạt mang sắc thái nguyên tố ngũ hành lấp lánh
        pColor = elementalColors[i % elementalColors.length].clone().lerp(colorAccent, 0.35);
      }

      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;

      sizes[i] = 2.5 + Math.random() * 5.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleTexture = this.createRadialGlowTexture(64, [
      [0, 'rgba(255, 255, 255, 1)'],
      [0.28, 'rgba(255, 250, 225, 0.85)'],
      [0.62, 'rgba(255, 215, 140, 0.25)'],
      [1, 'rgba(255, 255, 255, 0)']
    ]);

    const material = new THREE.PointsMaterial({
      size: 8.5,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(geometry, material);
    this.positions = positions;
    this.scene.add(this.points);

    // 2. LỚP SƯƠNG MÙ HỖN ĐỘN (MÔNG MÔNG BỤI VŨ TRỤ)
    const nebGeo = new THREE.BufferGeometry();
    const nebPos = new Float32Array(this.nebulaCount * 3);
    const nebCol = new Float32Array(this.nebulaCount * 3);

    this.nebulaBaseRadii = [];
    this.nebulaAngles = [];

    for (let i = 0; i < this.nebulaCount; i++) {
      const r = 40 + Math.random() * 580;
      const a = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 260;

      nebPos[i * 3] = Math.cos(a) * r;
      nebPos[i * 3 + 1] = Math.sin(a) * r;
      nebPos[i * 3 + 2] = z;

      this.nebulaBaseRadii.push(r);
      this.nebulaAngles.push(a);

      const c = colorPrimary.clone().lerp(colorSecondary, Math.random() * 0.7);
      nebCol[i * 3] = c.r;
      nebCol[i * 3 + 1] = c.g;
      nebCol[i * 3 + 2] = c.b;
    }

    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3));
    nebGeo.setAttribute('color', new THREE.BufferAttribute(nebCol, 3));

    const nebulaTexture = this.createRadialGlowTexture(128, [
      [0, 'rgba(255, 240, 200, 0.38)'],
      [0.4, 'rgba(210, 160, 80, 0.16)'],
      [0.75, 'rgba(120, 80, 35, 0.05)'],
      [1, 'rgba(0, 0, 0, 0)']
    ]);

    const nebMat = new THREE.PointsMaterial({
      size: 135.0,
      map: nebulaTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.nebulaPoints = new THREE.Points(nebGeo, nebMat);
    this.nebulaPositions = nebPos;
    this.scene.add(this.nebulaPoints);

    // 3. ĐIỂM KỲ DỊ (SINGULARITY CORE) & SÓNG XUNG KÍCH BIG BANG (SHOCKWAVE)
    const coreTex = this.createRadialGlowTexture(256, [
      [0, 'rgba(255, 255, 255, 1.0)'],
      [0.2, 'rgba(255, 235, 165, 0.92)'],
      [0.5, 'rgba(255, 175, 50, 0.42)'],
      [1, 'rgba(0, 0, 0, 0)']
    ]);
    const coreMat = new THREE.SpriteMaterial({
      map: coreTex,
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.singularitySprite = new THREE.Sprite(coreMat);
    this.singularitySprite.scale.set(220, 220, 1);
    this.scene.add(this.singularitySprite);

    const shockGeo = new THREE.RingGeometry(110, 155, 64);
    const shockMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.theme.accent),
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.shockwaveMesh = new THREE.Mesh(shockGeo, shockMat);
    this.scene.add(this.shockwaveMesh);
  }

  createRadialGlowTexture(size, stops) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const half = size / 2;
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    stops.forEach(([offset, color]) => grad.addColorStop(offset, color));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Thiết lập trạng thái Hỗn Độn / Big Bang cho kịch bản mở đầu
   * @param {'normal'|'chaos'|'converge'|'explode'} state
   * @param {number} progress (0.0 -> 1.0)
   */
  setCosmicState(state, progress = 0) {
    this.cosmicState = state;
    this.stateProgress = Math.max(0, Math.min(1, progress));
  }

  update(time) {
    if (!this.positions) return;

    const state = this.cosmicState;
    const p = this.stateProgress;

    if (state === 'chaos') {
      // GIAI ĐOẠN 1: HỖN ĐỘN SƠ KHAI - Mông mông bụi sương vũ trụ chưa phân định
      if (this.nebulaPoints) {
        this.nebulaPoints.material.opacity = 0.68;
        this.nebulaPoints.material.size = 175.0;
      }
      if (this.singularitySprite) {
        this.singularitySprite.material.opacity = 0.18 + Math.sin(time * 4.0) * 0.06;
        const s = 160 + Math.sin(time * 3.0) * 25;
        this.singularitySprite.scale.set(s, s, 1);
      }
      if (this.shockwaveMesh) {
        this.shockwaveMesh.material.opacity = 0;
      }

      for (let i = 0; i < this.count; i++) {
        const v = this.velocities[i];
        this.angles[i] += v.orbitSpeed * 3.5;
        const drift = Math.sin(time * 1.8 + v.phase) * 38;
        const r = this.chaosRadii[i] + drift;
        const zWave = Math.cos(time * 1.4 + v.phase) * 140;

        this.positions[i * 3] = Math.cos(this.angles[i]) * r;
        this.positions[i * 3 + 1] = Math.sin(this.angles[i]) * r;
        this.positions[i * 3 + 2] = zWave;
      }

      for (let i = 0; i < this.nebulaCount; i++) {
        this.nebulaAngles[i] += 0.0025 * (i % 2 === 0 ? 1 : -1);
        const r = this.nebulaBaseRadii[i] * 0.85 + Math.sin(time * 1.2 + i) * 30;
        this.nebulaPositions[i * 3] = Math.cos(this.nebulaAngles[i]) * r;
        this.nebulaPositions[i * 3 + 1] = Math.sin(this.nebulaAngles[i]) * r;
      }

    } else if (state === 'converge') {
      // GIAI ĐOẠN 2: HỒNG MÔNG TỤ KHÍ - Bụi vũ trụ xoáy hút mạnh về Điểm Kỳ Dị trung tâm
      const collapse = Math.pow(1 - p, 2.25); // Thu hẹp bán kính về 0
      const vortexSpin = 0.015 + p * 0.095;

      if (this.nebulaPoints) {
        this.nebulaPoints.material.opacity = 0.68 * (1 - p * 0.45);
        this.nebulaPoints.material.size = 175.0 * (0.45 + 0.55 * collapse);
      }
      if (this.singularitySprite) {
        this.singularitySprite.material.opacity = 0.25 + p * 0.75;
        const coreScale = 140 + Math.pow(p, 2) * 320 + Math.sin(time * 18) * 18;
        this.singularitySprite.scale.set(coreScale, coreScale, 1);
      }
      if (this.shockwaveMesh) {
        this.shockwaveMesh.material.opacity = 0;
      }

      for (let i = 0; i < this.count; i++) {
        const v = this.velocities[i];
        this.angles[i] += vortexSpin * (0.7 + (i % 5) * 0.15);
        const r = Math.max(4, this.chaosRadii[i] * collapse);
        const z = this.originalZ[i] * 0.35 * collapse;

        this.positions[i * 3] = Math.cos(this.angles[i]) * r;
        this.positions[i * 3 + 1] = Math.sin(this.angles[i]) * r;
        this.positions[i * 3 + 2] = z;
      }

      for (let i = 0; i < this.nebulaCount; i++) {
        this.nebulaAngles[i] += vortexSpin * 0.6;
        const r = this.nebulaBaseRadii[i] * collapse;
        this.nebulaPositions[i * 3] = Math.cos(this.nebulaAngles[i]) * r;
        this.nebulaPositions[i * 3 + 1] = Math.sin(this.nebulaAngles[i]) * r;
        this.nebulaPositions[i * 3 + 2] *= collapse;
      }

    } else if (state === 'explode') {
      // GIAI ĐOẠN 3: KHAI THIÊN TÍCH ĐỊA (BIG BANG) - Phát nổ sinh ra Âm Dương & Không Gian
      const burstEase = 1 - Math.pow(1 - p, 3.0);

      if (this.nebulaPoints) {
        this.nebulaPoints.material.opacity = 0.38 - burstEase * 0.18;
        this.nebulaPoints.material.size = 135.0;
      }
      if (this.singularitySprite) {
        // Chớp sáng cực đại lúc mới nổ rồi dịu dần nhường chỗ cho Nhật Nguyệt
        this.singularitySprite.material.opacity = Math.max(0, (1 - p * 1.15) * 1.0);
        const flashScale = 480 + burstEase * 420;
        this.singularitySprite.scale.set(flashScale, flashScale, 1);
      }
      if (this.shockwaveMesh) {
        const waveScale = 0.2 + burstEase * 11.5;
        this.shockwaveMesh.scale.set(waveScale, waveScale, 1);
        this.shockwaveMesh.material.opacity = Math.max(0, (1 - p) * 0.85);
      }

      for (let i = 0; i < this.count; i++) {
        const v = this.velocities[i];
        this.angles[i] += v.orbitSpeed * (4.5 - burstEase * 3.5);
        const r = 12 + this.originalRadii[i] * burstEase;
        const z = this.originalZ[i] * burstEase;

        this.positions[i * 3] = Math.cos(this.angles[i]) * r;
        this.positions[i * 3 + 1] = Math.sin(this.angles[i]) * r;
        this.positions[i * 3 + 2] = z;
      }

      for (let i = 0; i < this.nebulaCount; i++) {
        this.nebulaAngles[i] += 0.003;
        const r = this.nebulaBaseRadii[i] * (0.15 + burstEase * 1.15);
        this.nebulaPositions[i * 3] = Math.cos(this.nebulaAngles[i]) * r;
        this.nebulaPositions[i * 3 + 1] = Math.sin(this.nebulaAngles[i]) * r;
      }

    } else {
      // GIAI ĐOẠN 4: VŨ TRỤ VẬN HÀNH BÌNH THƯỜNG
      if (this.nebulaPoints) {
        this.nebulaPoints.material.opacity = 0.2;
      }
      if (this.singularitySprite) {
        this.singularitySprite.material.opacity = 0;
      }
      if (this.shockwaveMesh) {
        this.shockwaveMesh.material.opacity = 0;
      }

      for (let i = 0; i < this.count; i++) {
        const v = this.velocities[i];
        this.angles[i] += v.orbitSpeed;

        const r = this.originalRadii[i] + Math.sin(time * v.pulseSpeed + v.phase) * 25;
        this.positions[i * 3] = Math.cos(this.angles[i]) * r;
        this.positions[i * 3 + 1] = Math.sin(this.angles[i]) * r;
        this.positions[i * 3 + 2] += v.zSpeed;

        if (Math.abs(this.positions[i * 3 + 2]) > 250) {
          this.positions[i * 3 + 2] = -Math.sign(this.positions[i * 3 + 2]) * 240;
        }
      }

      for (let i = 0; i < this.nebulaCount; i++) {
        this.nebulaAngles[i] += 0.0005 * (i % 2 === 0 ? 1 : -1);
        const r = this.nebulaBaseRadii[i] * 1.25;
        this.nebulaPositions[i * 3] = Math.cos(this.nebulaAngles[i]) * r;
        this.nebulaPositions[i * 3 + 1] = Math.sin(this.nebulaAngles[i]) * r;
      }
    }

    this.points.geometry.attributes.position.needsUpdate = true;
    if (this.nebulaPoints) {
      this.nebulaPoints.geometry.attributes.position.needsUpdate = true;
    }
  }

  updateTheme(theme) {
    this.theme = theme;
    const colors = this.points.geometry.attributes.color.array;
    const colorPrimary = new THREE.Color(theme.primary);
    const colorAccent = new THREE.Color(theme.accent);
    const colorSecondary = new THREE.Color(theme.secondary);
    const elementalColors = [
      new THREE.Color('#ffd700'),
      new THREE.Color('#38ef7d'),
      new THREE.Color('#00d2ff'),
      new THREE.Color('#ff4b2b'),
      new THREE.Color('#e6a145')
    ];

    for (let i = 0; i < this.count; i++) {
      const mixRatio = Math.random();
      let pColor;
      if (mixRatio < 0.45) {
        pColor = colorPrimary.clone().lerp(colorAccent, mixRatio * 2.2);
      } else if (mixRatio < 0.82) {
        pColor = colorPrimary.clone().lerp(colorSecondary, (mixRatio - 0.45) * 2.5);
      } else {
        pColor = elementalColors[i % elementalColors.length].clone().lerp(colorAccent, 0.35);
      }

      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;
    }

    this.points.geometry.attributes.color.needsUpdate = true;

    if (this.shockwaveMesh) {
      this.shockwaveMesh.material.color.set(theme.accent);
    }
  }
}
