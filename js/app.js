/**
 * app.js
 * Quản lý Scene Three.js, Camera 3D, Quỹ Đạo Nguyên Tử, Điều phối Thời Gian (Tuần tự/Ngẫu nhiên/Cố định),
 * Hỗ trợ 2 Hệ Trận Pháp:
 *  1. "wuxing" (Hỗn Độn Ngũ Hành Tinh Đồ - lấy cảm hứng từ nguyen_thien_su.mp4):
 *     Hỗn Độn Sơ Khai (Bụi vũ trụ) -> Tụ Khí -> Big Bang -> Âm (Mặt Trăng) Dương (Mặt Trời) -> Ngũ Hành (Kim Mộc Thủy Hỏa Thổ) -> Phong Vũ Lôi Điện Quang Ám -> Tinh Đồ Vạn Vật.
 *  2. "bagua" (Càn Khôn Bát Quái Cổ Đồ):
 *     Thái Cực sinh Lưỡng Nghi -> Tứ Tượng -> Bát Quái -> Vạn Tượng Chu Thiên.
 */

class BaguaApp {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.bgImageLayer = document.getElementById('bg-image-layer');
    this.introBanner = document.getElementById('intro-banner');
    this.introChinese = document.getElementById('intro-chinese');
    this.introVietnamese = document.getElementById('intro-vietnamese');
    this.btnSkipIntro = document.getElementById('btn-skip-intro');

    // Mặc định sử dụng hệ "Hỗn Độn Ngũ Hành Tinh Đồ" và sắc màu "Thiên Sư Tinh Đồ (Celestial Gold)"
    this.matrixSystem = 'wuxing'; // 'wuxing' | 'bagua'
    this.currentThemeKey = 'celestial';
    this.theme = BAGUA_DATA.themes[this.currentThemeKey] || BAGUA_DATA.themes.cyan;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.baguaGroup = null;
    this.particles = null;
    this.codeBg = null;

    // Danh sách các tầng đĩa
    this.rings = [];
    this.speedMultiplier = 1.0;
    this.isPaused = false;

    // Phân cảnh Mở Đầu (Intro Sequence)
    this.isIntroPlaying = true;
    this.introTime = 0;
    this.introDuration = 12.0; // 12.0s cho Hỗn Độn Ngũ Hành, 9.8s cho Bát Quái

    // Quản lý Thời Gian & Hình Chiếu
    this.sequenceMode = 'sequential';
    this.fixedTarget = 'atomic';
    this.transitionInterval = 12.0;
    this.cycleTimer = 0;
    this.targetForm = 'atomic';

    // Độ xòe đan chéo quỹ đạo
    this.orbitSpread = 1.0;
    this.targetOrbitSpread = 1.0;

    // Thu Phóng Camera (Zoom)
    this.wheelZoomEnabled = true;
    this.autoZoomEnabled = true;
    this.baseZoom = 1420;
    this.currentZoom = 720;
    this.targetZoom = 720;
    this.userInteractingZoomTimer = 0;

    // Tương Tác Chuột & Góc Nghiêng
    this.mouseTrackingEnabled = true;
    this.normMouseX = 0;
    this.normMouseY = 0;
    this.currentRotX = 0.32;
    this.currentRotY = 0;

    // Chế độ màn hình chờ (Idle Screensaver)
    this.idleTimer = null;
    this.isIdle = false;
    this.idleTimeout = 3000;

    this.lastFrameTime = performance.now() * 0.001;

    this.init();
  }

  init() {
    this.applyThemeCSS();
    this.setupCodeBackground();
    this.setupThree();
    this.createBaguaDiscs();
    this.setupParticles();
    this.setupEventListeners();
    this.setupUI();
    this.loadSavedCustomBackground();
    this.resetIdleTimer();

    // Khởi chạy phân cảnh mở đầu
    this.playIntro();

    this.animate();
  }

  applyThemeCSS() {
    document.documentElement.style.setProperty('--primary-color', this.theme.primary);
    document.documentElement.style.setProperty('--glow-color', this.theme.glow);
    document.documentElement.style.setProperty('--accent-color', this.theme.accent);
  }

  setupCodeBackground() {
    this.codeBg = new CodeBackground('bg-code-canvas');
  }

  setupThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020408, 0.00035);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(52, aspect, 10, 6000);
    this.camera.position.set(0, 0, this.currentZoom);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x020408, 0.7);
    this.container.appendChild(this.renderer.domElement);

    this.baguaGroup = new THREE.Group();
    this.baguaGroup.rotation.x = this.currentRotX;
    this.scene.add(this.baguaGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(this.theme.primary, 2.0, 1600);
    pointLight.position.set(0, 0, 400);
    this.pointLight = pointLight;
    this.scene.add(pointLight);

    const backLight = new THREE.PointLight(this.theme.secondary, 1.2, 1600);
    backLight.position.set(0, 0, -400);
    this.backLight = backLight;
    this.scene.add(backLight);
  }

  createHollowRingGeometry(innerR, outerR, segments = 96) {
    let geo;
    const MAX_CANVAS_R = 1024;

    if (innerR === 0) {
      geo = new THREE.CircleGeometry(outerR, segments);
    } else {
      geo = new THREE.RingGeometry(innerR, outerR, segments);
    }

    const pos = geo.attributes.position;
    const uvs = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      uvs.setXY(i, (x / MAX_CANVAS_R) * 0.5 + 0.5, (y / MAX_CANVAS_R) * 0.5 + 0.5);
    }
    uvs.needsUpdate = true;
    return geo;
  }

  createBaguaDiscs() {
    while (this.baguaGroup.children.length > 0) {
      const obj = this.baguaGroup.children[0];
      this.baguaGroup.remove(obj);
      obj.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      });
    }
    this.rings = [];

    let ringConfigs;

    if (this.matrixSystem === 'wuxing') {
      // HỆ 1: HỖN ĐỘN NGŨ HÀNH TINH ĐỒ (Nhật Nguyệt -> Ngũ Hành -> Phong Vũ Lôi Điện Quang Ám -> Chòm Sao Tinh Đồ)
      ringConfigs = [
        {
          name: 'Nhật Nguyệt Âm Dương Luân (Mặt Trời & Mặt Trăng)',
          innerR: 0,
          outerR: 180,
          textureFn: () => BaguaTextureGenerator.createSunMoonCoreTexture(this.theme),
          spinSpeed: 0.0085,
          tiltX: 0, tiltY: 0, tiltZ: 0,
          precessSpeed: 0.0003,
          spawnTime: 2.75 // Nở ra ngay khoảnh khắc Big Bang phát nổ (t = 2.75s)
        },
        {
          name: 'Tầng 1: Ngũ Hành Tương Sinh (Kim Mộc Thủy Hỏa Thổ)',
          innerR: 225,
          outerR: 350,
          textureFn: () => BaguaTextureGenerator.createFiveElementsRingTexture(this.theme),
          spinSpeed: -0.0048,
          tiltX: 0.45, tiltY: 0.15, tiltZ: 0.2,
          precessSpeed: -0.0008,
          spawnTime: 4.1 // Âm Dương sinh Ngũ Hành
        },
        {
          name: 'Tầng 2: Bát Đại Pháp Tắc (Phong Vũ Lôi Điện Quang Ám)',
          innerR: 345,
          outerR: 435,
          textureFn: () => BaguaTextureGenerator.createElementalForcesTexture(this.theme),
          spinSpeed: 0.0038,
          tiltX: -0.55, tiltY: 0.65, tiltZ: -0.3,
          precessSpeed: 0.001,
          spawnTime: 5.3 // Sinh ra các nguyên tố dị tượng tự nhiên
        },
        {
          name: 'Tầng 3: Thập Nhị Thời Không Địa Chi',
          innerR: 440,
          outerR: 545,
          textureFn: () => BaguaTextureGenerator.createBranchesTexture(this.theme),
          spinSpeed: -0.0032,
          tiltX: 0.75, tiltY: -0.55, tiltZ: 0.5,
          precessSpeed: -0.0012,
          spawnTime: 6.3
        },
        {
          name: 'Tầng 4: Nhị Thập Tứ Phương Vị Không Gian',
          innerR: 550,
          outerR: 650,
          textureFn: () => BaguaTextureGenerator.createTwentyFourMountainsTexture(this.theme),
          spinSpeed: 0.0026,
          tiltX: -0.85, tiltY: 0.8, tiltZ: -0.6,
          precessSpeed: 0.0009,
          spawnTime: 7.1
        },
        {
          name: 'Tầng 5: Cửu Diệu Tinh Quân Trận Pháp',
          innerR: 660,
          outerR: 765,
          textureFn: () => BaguaTextureGenerator.createNineStarsTexture(this.theme),
          spinSpeed: -0.002,
          tiltX: 0.6, tiltY: -0.95, tiltZ: 0.7,
          precessSpeed: -0.0007,
          spawnTime: 7.9
        },
        {
          name: 'Tầng 6: Thập Nhị Tinh Đồ Chòm Sao Nối Dây',
          innerR: 775,
          outerR: 870,
          textureFn: () => BaguaTextureGenerator.createConstellationRingTexture(this.theme),
          spinSpeed: 0.0015,
          tiltX: -0.7, tiltY: 0.35, tiltZ: -0.8,
          precessSpeed: 0.0006,
          spawnTime: 8.6 // Tinh đồ chòm sao nối dây rực rỡ
        },
        {
          name: 'Tầng 7: Chu Thiên Hoàn Vũ Tinh Độ',
          innerR: 880,
          outerR: 1005,
          textureFn: () => BaguaTextureGenerator.createOuterRingTexture(this.theme),
          spinSpeed: -0.0009,
          tiltX: 0.3, tiltY: 1.05, tiltZ: 0.4,
          precessSpeed: -0.0005,
          spawnTime: 9.3
        }
      ];
    } else {
      // HỆ 2: CÀN KHÔN BÁT QUÁI CỔ ĐỒ (Thái Cực -> Lưỡng Nghi -> Tứ Tượng -> Bát Quái)
      ringConfigs = [
        {
          name: 'Tâm Thái Cực (Hạt Nhân)',
          innerR: 0,
          outerR: 180,
          textureFn: () => BaguaTextureGenerator.createTaijiTexture(this.theme),
          spinSpeed: 0.008,
          tiltX: 0, tiltY: 0, tiltZ: 0,
          precessSpeed: 0.0003,
          spawnTime: 0.0
        },
        {
          name: 'Tầng 1: Hào Bát Quái',
          innerR: 225,
          outerR: 350,
          textureFn: () => BaguaTextureGenerator.createTrigramLinesTexture(this.theme),
          spinSpeed: -0.0045,
          tiltX: 0.45, tiltY: 0.15, tiltZ: 0.2,
          precessSpeed: -0.0008,
          spawnTime: 1.6
        },
        {
          name: 'Tầng 2: Bát Quái Hán Tự',
          innerR: 345,
          outerR: 435,
          textureFn: () => BaguaTextureGenerator.createTrigramNamesTexture(this.theme),
          spinSpeed: 0.0038,
          tiltX: -0.55, tiltY: 0.65, tiltZ: -0.3,
          precessSpeed: 0.001,
          spawnTime: 2.7
        },
        {
          name: 'Tầng 3: Thập Nhị Địa Chi',
          innerR: 440,
          outerR: 545,
          textureFn: () => BaguaTextureGenerator.createBranchesTexture(this.theme),
          spinSpeed: -0.0032,
          tiltX: 0.75, tiltY: -0.55, tiltZ: 0.5,
          precessSpeed: -0.0012,
          spawnTime: 3.8
        },
        {
          name: 'Tầng 4: Nhị Thập Tứ Sơn',
          innerR: 550,
          outerR: 650,
          textureFn: () => BaguaTextureGenerator.createTwentyFourMountainsTexture(this.theme),
          spinSpeed: 0.0026,
          tiltX: -0.85, tiltY: 0.8, tiltZ: -0.6,
          precessSpeed: 0.0009,
          spawnTime: 4.8
        },
        {
          name: 'Tầng 5: Cửu Tinh Trận Pháp',
          innerR: 660,
          outerR: 765,
          textureFn: () => BaguaTextureGenerator.createNineStarsTexture(this.theme),
          spinSpeed: -0.002,
          tiltX: 0.6, tiltY: -0.95, tiltZ: 0.7,
          precessSpeed: -0.0007,
          spawnTime: 5.7
        },
        {
          name: 'Tầng 6: Nhị Thập Bát Tú',
          innerR: 775,
          outerR: 870,
          textureFn: () => BaguaTextureGenerator.createMansionsTexture(this.theme),
          spinSpeed: 0.0015,
          tiltX: -0.7, tiltY: 0.35, tiltZ: -0.8,
          precessSpeed: 0.0006,
          spawnTime: 6.5
        },
        {
          name: 'Tầng 7: Vành Độ La Kinh Ngoài Cùng',
          innerR: 880,
          outerR: 1005,
          textureFn: () => BaguaTextureGenerator.createOuterRingTexture(this.theme),
          spinSpeed: -0.0009,
          tiltX: 0.3, tiltY: 1.05, tiltZ: 0.4,
          precessSpeed: -0.0005,
          spawnTime: 7.2
        }
      ];
    }

    ringConfigs.forEach((cfg) => {
      const orbitGroup = new THREE.Group();
      const geo = this.createHollowRingGeometry(cfg.innerR, cfg.outerR);
      const texture = cfg.textureFn();
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const mesh = new THREE.Mesh(geo, mat);
      orbitGroup.add(mesh);
      this.baguaGroup.add(orbitGroup);

      this.rings.push({
        name: cfg.name,
        orbitGroup: orbitGroup,
        mesh: mesh,
        spinSpeed: cfg.spinSpeed,
        spinAngle: 0,
        targetTiltX: cfg.tiltX,
        targetTiltY: cfg.tiltY,
        targetTiltZ: cfg.tiltZ,
        precessSpeed: cfg.precessSpeed,
        precessAngle: 0,
        spawnTime: cfg.spawnTime,
        currentScale: 0.0,
        currentOpacity: 0.0
      });
    });
  }

  setupParticles() {
    this.particles = new BaguaParticles(this.scene, 2600, this.theme);
  }

  setMatrixSystem(systemKey) {
    if (systemKey !== 'wuxing' && systemKey !== 'bagua') return;
    this.matrixSystem = systemKey;
    const sysSelect = document.getElementById('system-select');
    if (sysSelect) sysSelect.value = systemKey;

    this.createBaguaDiscs();
    this.playIntro();
  }

  playIntro() {
    this.isIntroPlaying = true;
    this.introTime = 0;
    this.introDuration = (this.matrixSystem === 'wuxing') ? 12.0 : 9.8;

    if (this.matrixSystem === 'wuxing') {
      // Hỗn Độn Sơ Khai bắt đầu ở góc nhìn bao quát đám mây bụi sương mù vũ trụ
      this.currentZoom = 720;
      this.targetZoom = 720;
      if (this.particles) this.particles.setCosmicState('chaos', 0);
    } else {
      this.currentZoom = 450;
      this.targetZoom = 450;
      if (this.particles) this.particles.setCosmicState('normal', 1);
    }

    // Khởi tạo các tầng thu nhỏ về 0
    this.rings.forEach(ring => {
      ring.mesh.scale.set(0, 0, 0);
      ring.mesh.material.opacity = 0;
      ring.currentScale = 0;
      ring.currentOpacity = 0;
    });

    if (this.btnSkipIntro) this.btnSkipIntro.style.display = 'block';
    if (this.introBanner) this.introBanner.classList.add('active');
  }

  skipIntro() {
    this.isIntroPlaying = false;
    this.introTime = this.introDuration;

    this.rings.forEach(ring => {
      ring.mesh.scale.set(1, 1, 1);
      ring.mesh.material.opacity = 0.95;
      ring.currentScale = 1;
      ring.currentOpacity = 0.95;
    });

    if (this.particles) {
      this.particles.setCosmicState('normal', 1);
    }

    this.speedMultiplier = 1.0;
    this.targetZoom = this.baseZoom;
    if (this.pointLight) this.pointLight.intensity = 2.0;

    if (this.introBanner) this.introBanner.classList.remove('active');
    if (this.btnSkipIntro) this.btnSkipIntro.style.display = 'none';
  }

  /**
   * Tính toán khoảng cách Camera (Zoom) khớp với từng giai đoạn xuất hiện:
   */
  getIntroTargetZoom(t) {
    let milestones;

    if (this.matrixSystem === 'wuxing') {
      milestones = [
        { t: 0.0,  z: 720 },  // Hỗn Độn Sơ Khai (mông lung sương bụi vũ trụ)
        { t: 1.5,  z: 680 },  // Bắt đầu Hồng Mông Tụ Khí
        { t: 2.75, z: 430 },  // Hút tụ về Điểm Kỳ Dị trung tâm -> Phát nổ sinh ra Mặt Trăng & Mặt Trời (cận cảnh)
        { t: 3.9,  z: 460 },  // Nhật Nguyệt xoay ở trung tâm
        { t: 4.9,  z: 780 },  // Tầng 1: Ngũ Hành (Kim Mộc Thủy Hỏa Thổ) xuất hiện -> thu nhỏ lại vừa màn hình
        { t: 6.0,  z: 1020 }, // Tầng 2: Bát Đại Nguyên Tố (Phong Vũ Lôi Điện Quang Ám) xuất hiện
        { t: 7.0,  z: 1250 }, // Tầng 3: Thập Nhị Thời Không xuất hiện
        { t: 7.8,  z: 1480 }, // Tầng 4: 24 Phương Vị Không Gian xuất hiện
        { t: 8.5,  z: 1720 }, // Tầng 5: Cửu Diệu Tinh Quân xuất hiện
        { t: 9.2,  z: 1960 }, // Tầng 6: Tinh Đồ Chòm Sao Nối Dây xuất hiện
        { t: 10.0, z: 2180 }, // Tầng 7: Chu Thiên Tinh Độ hoàn tất -> toàn cảnh đại trận
        { t: 11.0, z: 2180 }, // Giữ toàn cảnh trong giai đoạn xoay cao trào
        { t: 12.0, z: this.baseZoom } // Chuyển mượt về baseZoom
      ];
    } else {
      milestones = [
        { t: 0.0, z: 450 },
        { t: 1.5, z: 460 },
        { t: 2.6, z: 760 },
        { t: 3.7, z: 980 },
        { t: 4.7, z: 1200 },
        { t: 5.6, z: 1420 },
        { t: 6.4, z: 1650 },
        { t: 7.1, z: 1880 },
        { t: 7.8, z: 2160 },
        { t: 8.8, z: 2160 },
        { t: 9.8, z: this.baseZoom }
      ];
    }

    if (t <= milestones[0].t) return milestones[0].z;
    if (t >= milestones[milestones.length - 1].t) return milestones[milestones.length - 1].z;

    for (let i = 0; i < milestones.length - 1; i++) {
      const m0 = milestones[i];
      const m1 = milestones[i + 1];
      if (t >= m0.t && t <= m1.t) {
        const p = (t - m0.t) / (m1.t - m0.t);
        const ease = p * p * (3 - 2 * p);
        return m0.z + (m1.z - m0.z) * ease;
      }
    }
    return this.baseZoom;
  }

  /**
   * Cập nhật kịch bản Mở đầu điện ảnh
   */
  updateIntro(delta) {
    this.introTime += delta;
    const t = this.introTime;

    if (this.matrixSystem === 'wuxing') {
      // KỊCH BẢN 1: HỖN ĐỘN KHAI THIÊN -> ÂM DƯƠNG (NHẬT NGUYỆT) -> NGŨ HÀNH -> VẠN VẬT
      if (t < 1.5) {
        this.introChinese.textContent = "混沌初開 · 鴻濛未判";
        //this.introVietnamese.textContent = "Thuở Sơ Khai Vũ Trụ Hỗn Độn, Mông Lung Bụi Sương Chưa Phân Định";
        if (this.particles) this.particles.setCosmicState('chaos', t / 1.5);
      } else if (t < 2.75) {
        this.introChinese.textContent = "鴻濛聚氣 · 萬象歸一";
       // this.introVietnamese.textContent = "Hồng Mông Tụ Khí, Bụi Vũ Trụ Xoáy Hút Về Điểm Kỳ Dị";
        if (this.particles) this.particles.setCosmicState('converge', (t - 1.5) / 1.25);
      } else if (t < 4.1) {
        this.introChinese.textContent = "開天闢地 · 化生陰陽（日月）";
        //this.introVietnamese.textContent = "Khai Thiên Tích Địa! Bụi Tinh Hà Phát Nổ Sinh Ra Mặt Trăng (Âm) & Mặt Trời (Dương)";
        if (this.particles) this.particles.setCosmicState('explode', Math.min(1.0, (t - 2.75) / 1.25));
      } else if (t < 5.3) {
        this.introChinese.textContent = "陰陽交泰 · 化生五行";
        //this.introVietnamese.textContent = "Âm Dương Giao Hòa Sinh Ngũ Hành: Kim · Mộc · Thủy · Hỏa · Thổ";
        if (this.particles) this.particles.setCosmicState('normal', 1.0);
      } else if (t < 7.0) {
        this.introChinese.textContent = "五行演繹 · 風雨雷電 · 光暗冰炎";
       // this.introVietnamese.textContent = "Ngũ Hành Hóa Sinh Nguyên Tố: Phong · Vũ · Lôi · Điện · Quang · Ám";
        if (this.particles) this.particles.setCosmicState('normal', 1.0);
      } else if (t < 9.4) {
        this.introChinese.textContent = "五行生萬物 · 星圖定蒼穹";
        //this.introVietnamese.textContent = "Ngũ Hành Sinh Vạn Vật, Tinh Đồ Chòm Sao Kiến Tạo Không Gian Vũ Trụ";
        if (this.particles) this.particles.setCosmicState('normal', 1.0);
      } else if (t < 11.0) {
        this.introChinese.textContent = "乾坤萬象 · 陣法大成";
        //this.introVietnamese.textContent = "Nhật Nguyệt Tinh Thần Giao Hòa, Vũ Trụ Đại Trận Viên Mãn!";
        if (this.particles) this.particles.setCosmicState('normal', 1.0);
      }
    } else {
      // KỊCH BẢN 2: THÁI CỰC -> LƯỠNG NGHI -> TỨ TƯỢNG -> BÁT QUÁI
      if (t < 1.6) {
        this.introChinese.textContent = "太極生兩儀";
        //this.introVietnamese.textContent = "Thái Cực sinh Lưỡng Nghi";
      } else if (t < 2.7) {
        this.introChinese.textContent = "兩儀生四象";
        //this.introVietnamese.textContent = "Lưỡng Nghi sinh Tứ Tượng";
      } else if (t < 4.4) {
        this.introChinese.textContent = "四象生八卦";
       // this.introVietnamese.textContent = "Tứ Tượng sinh Bát Quái";
      } else if (t < 7.2) {
        this.introChinese.textContent = "八卦定乾坤";
       // this.introVietnamese.textContent = "Bát Quái định Càn Khôn, Vạn Tượng Chu Thiên";
      } else if (t < 8.8) {
        this.introChinese.textContent = "陣法大成";
        //this.introVietnamese.textContent = "Càn Khôn Hóa Sinh, Trận Pháp Đại Thành!";
      }
    }

    // CAMERA TỰ ĐỘNG THU NHỎ (ZOOM OUT) TƯƠNG ỨNG VỚI TỪNG VÒNG MỚI XUẤT HIỆN
    this.targetZoom = this.getIntroTargetZoom(t);

    // TỪNG TẦNG VÒNG XUẤT HIỆN TUẦN TỰ TỪ TRONG RA NGOÀI
    this.rings.forEach(ring => {
      if (t >= ring.spawnTime) {
        const timeSinceSpawn = t - ring.spawnTime;
        const appearProgress = Math.min(1.0, timeSinceSpawn / 0.85);
        const easeScale = Math.sin(appearProgress * Math.PI * 0.5);

        ring.currentScale = Math.min(1.0, easeScale);
        ring.currentOpacity = Math.min(0.95, appearProgress * 0.95);

        ring.mesh.scale.set(ring.currentScale, ring.currentScale, ring.currentScale);
        ring.mesh.material.opacity = ring.currentOpacity;
      }
    });

    // CAO TRÀO TĂNG TỐC KHI ĐỦ CÁC TẦNG
    const surgeStart = (this.matrixSystem === 'wuxing') ? 9.4 : 7.2;
    const surgeEnd = (this.matrixSystem === 'wuxing') ? 11.0 : 8.8;

    if (t >= surgeStart && t < surgeEnd) {
      const surgeT = (t - surgeStart) / (surgeEnd - surgeStart);
      const surgeMultiplier = 1.0 + Math.sin(surgeT * Math.PI) * 3.8;
      this.speedMultiplier = surgeMultiplier;

      if (this.pointLight) {
        this.pointLight.intensity = 2.0 + Math.sin(surgeT * Math.PI) * 2.4;
      }
    } else if (t >= surgeEnd && t < this.introDuration) {
      const slowT = (t - surgeEnd) / (this.introDuration - surgeEnd);
      this.speedMultiplier = 1.0 + (1 - slowT) * 0.5;
      if (this.pointLight) this.pointLight.intensity = 2.0;

      if (this.introBanner) this.introBanner.classList.remove('active');
    } else if (t >= this.introDuration) {
      this.skipIntro();
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());

    window.addEventListener('mousemove', (e) => {
      this.resetIdleTimer();
      this.normMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.normMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    window.addEventListener('wheel', (e) => {
      if (e.target && e.target.closest && e.target.closest('#controls-panel')) {
        return;
      }

      if (!this.wheelZoomEnabled) return;

      this.resetIdleTimer();

      const zoomDirection = Math.sign(e.deltaY);
      const step = 85;

      this.baseZoom += zoomDirection * step;
      this.baseZoom = Math.max(750, Math.min(2500, this.baseZoom));
      this.targetZoom = this.baseZoom;

      this.userInteractingZoomTimer = 4.0;
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      this.resetIdleTimer();
      switch (e.key.toLowerCase()) {
        case 'r':
          this.playIntro();
          break;
        case 'f':
          this.toggleFullscreen();
          break;
        case ' ':
          if (this.isIntroPlaying) {
            this.skipIntro();
          } else {
            this.isPaused = !this.isPaused;
          }
          break;
        case 'c':
          this.cycleTheme();
          break;
        case 't':
          this.toggleMouseTracking();
          break;
        case 'm':
          this.cycleSequenceMode();
          break;
        case 'h':
          this.toggleUI();
          break;
        case 'escape':
          if (this.isIntroPlaying) {
            this.skipIntro();
          } else if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    });

    ['mousedown', 'touchstart', 'keydown'].forEach(evt => {
      window.addEventListener(evt, () => this.resetIdleTimer());
    });
  }

  onWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  resetIdleTimer() {
    if (this.isIdle) {
      this.isIdle = false;
      document.body.classList.remove('screensaver-active');
      const controls = document.getElementById('controls-panel');
      if (controls) controls.classList.remove('idle-fade');
      const clock = document.getElementById('clock-display');
      if (clock) clock.classList.remove('idle-clock-grow');
    }

    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.isIdle = true;
      document.body.classList.add('screensaver-active');
      const controls = document.getElementById('controls-panel');
      if (controls) controls.classList.add('idle-fade');
      const clock = document.getElementById('clock-display');
      if (clock) clock.classList.add('idle-clock-grow');
    }, this.idleTimeout);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Lỗi bật Fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  cycleTheme() {
    const keys = Object.keys(BAGUA_DATA.themes);
    const currentIndex = keys.indexOf(this.currentThemeKey);
    const nextKey = keys[(currentIndex + 1) % keys.length];
    this.setTheme(nextKey);
  }

  setTheme(themeKey) {
    if (!BAGUA_DATA.themes[themeKey]) return;
    this.currentThemeKey = themeKey;
    this.theme = BAGUA_DATA.themes[themeKey];

    if (this.pointLight) this.pointLight.color.set(this.theme.primary);
    if (this.backLight) this.backLight.color.set(this.theme.secondary);

    this.createBaguaDiscs();
    if (!this.isIntroPlaying) {
      // Nếu không đang chạy intro, giữ các đĩa hiển thị đầy đủ
      this.rings.forEach(ring => {
        ring.mesh.scale.set(1, 1, 1);
        ring.mesh.material.opacity = 0.95;
        ring.currentScale = 1;
        ring.currentOpacity = 0.95;
      });
    }
    this.particles.updateTheme(this.theme);

    this.applyThemeCSS();

    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) themeSelect.value = themeKey;
  }

  toggleMouseTracking() {
    this.mouseTrackingEnabled = !this.mouseTrackingEnabled;
    const chk = document.getElementById('chk-mouse-tracking');
    if (chk) chk.checked = this.mouseTrackingEnabled;
  }

  cycleSequenceMode() {
    const modes = ['sequential', 'random', 'fixed-atomic', 'fixed-planar', 'custom'];
    let currentKey = this.sequenceMode;
    if (this.sequenceMode === 'fixed') {
      currentKey = `fixed-${this.fixedTarget}`;
    }
    const nextIdx = (modes.indexOf(currentKey) + 1) % modes.length;
    this.setSequenceMode(modes[nextIdx]);
  }

  setSequenceMode(modeVal) {
    const modeSelect = document.getElementById('sequence-select');
    const spreadSlider = document.getElementById('spread-slider');
    const spreadValue = document.getElementById('spread-value');

    if (modeVal === 'fixed-atomic') {
      this.sequenceMode = 'fixed';
      this.fixedTarget = 'atomic';
      this.targetOrbitSpread = 1.0;
      if (spreadSlider) spreadSlider.value = '1.0';
      if (spreadValue) spreadValue.textContent = '100%';
    } else if (modeVal === 'fixed-planar') {
      this.sequenceMode = 'fixed';
      this.fixedTarget = 'planar';
      this.targetOrbitSpread = 0.0;
      if (spreadSlider) spreadSlider.value = '0.0';
      if (spreadValue) spreadValue.textContent = '0%';
    } else if (modeVal === 'custom') {
      this.sequenceMode = 'custom';
    } else {
      this.sequenceMode = modeVal;
      this.cycleTimer = 0;
    }

    if (modeSelect) modeSelect.value = modeVal;
  }

  updateTimingAndSequencing(delta) {
    if (this.sequenceMode === 'custom') {
      return;
    }

    if (this.sequenceMode === 'fixed') {
      this.targetOrbitSpread = (this.fixedTarget === 'atomic') ? 1.0 : 0.0;
      return;
    }

    this.cycleTimer += delta;

    if (this.cycleTimer >= this.transitionInterval) {
      this.cycleTimer = 0;

      if (this.sequenceMode === 'sequential') {
        this.targetForm = (this.targetForm === 'atomic') ? 'planar' : 'atomic';
      } else if (this.sequenceMode === 'random') {
        const rand = Math.random();
        this.targetForm = (rand < 0.5) ? 'atomic' : 'planar';
      }

      this.targetOrbitSpread = (this.targetForm === 'atomic') ? 1.0 : 0.0;
    }

    const spreadSlider = document.getElementById('spread-slider');
    const spreadValue = document.getElementById('spread-value');
    if (spreadSlider) {
      spreadSlider.value = this.orbitSpread.toFixed(2);
      if (spreadValue) spreadValue.textContent = `${Math.round(this.orbitSpread * 100)}%`;
    }
  }

  updateCinematicCamera(delta, time) {
    if (this.isIntroPlaying) return;

    if (this.userInteractingZoomTimer > 0) {
      this.userInteractingZoomTimer -= delta;
      return;
    }

    if (!this.autoZoomEnabled) {
      this.targetZoom = this.baseZoom;
      return;
    }

    const isPlanar = this.orbitSpread < 0.3;

    if (isPlanar) {
      const breathing = Math.sin(time * 0.4) * 25;
      this.targetZoom = this.baseZoom + breathing;
    } else {
      const dynamicCycle = Math.sin(time * 0.3);
      this.targetZoom = this.baseZoom + dynamicCycle * 160;
    }
  }

  setupUI() {
    // Nút Bỏ qua Intro
    if (this.btnSkipIntro) {
      this.btnSkipIntro.addEventListener('click', () => this.skipIntro());
    }

    // Nút Tái hiện Khởi Nguyên Trận Pháp
    const btnReplayIntro = document.getElementById('btn-replay-intro');
    if (btnReplayIntro) {
      btnReplayIntro.addEventListener('click', () => this.playIntro());
    }

    // 0. Chọn Hệ Trận Pháp (Hỗn Độn Ngũ Hành vs Càn Khôn Bát Quái)
    const sysSelect = document.getElementById('system-select');
    if (sysSelect) {
      sysSelect.value = this.matrixSystem;
      sysSelect.addEventListener('change', (e) => this.setMatrixSystem(e.target.value));
    }

    // 1. Chế độ trình diễn
    const seqSelect = document.getElementById('sequence-select');
    if (seqSelect) {
      seqSelect.addEventListener('change', (e) => this.setSequenceMode(e.target.value));
    }

    // 2. Thời gian chu kỳ
    const intervalSlider = document.getElementById('interval-slider');
    const intervalValue = document.getElementById('interval-value');
    if (intervalSlider) {
      intervalSlider.addEventListener('input', (e) => {
        this.transitionInterval = parseFloat(e.target.value);
        if (intervalValue) intervalValue.textContent = `${this.transitionInterval}s`;
      });
    }

    // 3. Tự động thu phóng Camera
    const chkAutoZoom = document.getElementById('chk-auto-zoom');
    if (chkAutoZoom) {
      chkAutoZoom.addEventListener('change', (e) => {
        this.autoZoomEnabled = e.target.checked;
        if (!this.autoZoomEnabled) {
          this.targetZoom = this.baseZoom;
        }
      });
    }

    // 4. Bật/Tắt cuộn chuột để Zoom
    const chkWheelZoom = document.getElementById('chk-wheel-zoom');
    if (chkWheelZoom) {
      chkWheelZoom.checked = this.wheelZoomEnabled;
      chkWheelZoom.addEventListener('change', (e) => {
        this.wheelZoomEnabled = e.target.checked;
      });
    }

    // 5. Bật/Tắt xoay theo chuột
    const chkMouse = document.getElementById('chk-mouse-tracking');
    if (chkMouse) {
      chkMouse.addEventListener('change', (e) => {
        this.mouseTrackingEnabled = e.target.checked;
      });
    }

    // 6. Thanh trượt Độ đan chéo quỹ đạo thủ công
    const spreadSlider = document.getElementById('spread-slider');
    const spreadValue = document.getElementById('spread-value');
    if (spreadSlider) {
      spreadSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.targetOrbitSpread = val;
        this.sequenceMode = 'custom';
        if (seqSelect) seqSelect.value = 'custom';
        if (spreadValue) spreadValue.textContent = `${Math.round(val * 100)}%`;
      });
    }

    // 7. Mã script chạy nền
    const chkCodeBg = document.getElementById('chk-code-bg');
    if (chkCodeBg && this.codeBg) {
      chkCodeBg.addEventListener('change', (e) => {
        this.codeBg.setEnabled(e.target.checked);
      });
    }

    const codeOpacitySlider = document.getElementById('code-opacity-slider');
    if (codeOpacitySlider && this.codeBg) {
      codeOpacitySlider.addEventListener('input', (e) => {
        this.codeBg.setOpacity(e.target.value);
      });
    }

    // 8. Tải ảnh nền
    const bgFileInput = document.getElementById('bg-file-input');
    const btnClearBg = document.getElementById('btn-clear-bg');
    if (bgFileInput) {
      bgFileInput.addEventListener('change', (e) => this.handleCustomBackgroundUpload(e));
    }
    if (btnClearBg) {
      btnClearBg.addEventListener('click', () => this.clearCustomBackground());
    }

    // 9. Chọn Theme
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      themeSelect.value = this.currentThemeKey;
      themeSelect.addEventListener('change', (e) => this.setTheme(e.target.value));
    }

    // 10. Tốc độ quay
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    if (speedSlider) {
      speedSlider.addEventListener('input', (e) => {
        this.speedMultiplier = parseFloat(e.target.value);
        if (speedValue) speedValue.textContent = `${this.speedMultiplier.toFixed(1)}x`;
      });
    }

    // 11. Fullscreen & Pause
    const fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) fsBtn.addEventListener('click', () => this.toggleFullscreen());

    const pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.isPaused = !this.isPaused;
        pauseBtn.innerHTML = this.isPaused ? '▶ Tiếp tục' : '⏸ Tạm dừng';
      });
    }

    // 12. Đồng hồ
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  handleCustomBackgroundUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      this.applyCustomBackground(dataUrl);
      try {
        localStorage.setItem('bagua_custom_bg', dataUrl);
      } catch (err) {
        console.warn('Ảnh quá lớn để lưu localStorage:', err);
      }
    };
    reader.readAsDataURL(file);
  }

  applyCustomBackground(url) {
    if (this.bgImageLayer) {
      this.bgImageLayer.style.backgroundImage = `url('${url}')`;
      this.bgImageLayer.style.display = 'block';
    }
    const btnClearBg = document.getElementById('btn-clear-bg');
    if (btnClearBg) btnClearBg.style.display = 'inline-block';
  }

  clearCustomBackground() {
    if (this.bgImageLayer) {
      this.bgImageLayer.style.backgroundImage = 'none';
      this.bgImageLayer.style.display = 'none';
    }
    try {
      localStorage.removeItem('bagua_custom_bg');
    } catch (e) {}
    const bgFileInput = document.getElementById('bg-file-input');
    if (bgFileInput) bgFileInput.value = '';
    const btnClearBg = document.getElementById('btn-clear-bg');
    if (btnClearBg) btnClearBg.style.display = 'none';
  }

  loadSavedCustomBackground() {
    try {
      const savedBg = localStorage.getItem('bagua_custom_bg');
      if (savedBg) {
        this.applyCustomBackground(savedBg);
      }
    } catch (e) {}
  }

  updateClock() {
    const now = new Date();
    const timeEl = document.getElementById('clock-time');
    const dateEl = document.getElementById('clock-date');
    const branchEl = document.getElementById('clock-branch');

    if (timeEl) timeEl.textContent = now.toTimeString().split(' ')[0];
    if (dateEl) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateEl.textContent = now.toLocaleDateString('vi-VN', options);
    }
    if (branchEl) {
      const hour = now.getHours();
      const branches = ['Tý (23h-1h)', 'Sửu (1h-3h)', 'Dần (3h-5h)', 'Mão (5h-7h)', 'Thìn (7h-9h)', 'Tị (9h-11h)', 
                        'Ngọ (11h-13h)', 'Mùi (13h-15h)', 'Thân (15h-17h)', 'Dậu (17h-19h)', 'Tuất (19h-21h)', 'Hợi (21h-23h)'];
      const branchIndex = Math.floor(((hour + 1) % 24) / 2);
      branchEl.textContent = `Giờ: ${branches[branchIndex]}`;
    }
  }

  toggleUI() {
    const panel = document.getElementById('controls-panel');
    if (panel) panel.classList.toggle('ui-hidden');
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const currentTime = performance.now() * 0.001;
    const delta = Math.min(currentTime - this.lastFrameTime, 0.1);
    this.lastFrameTime = currentTime;

    // 0. CẬP NHẬT PHÂN CẢNH MỞ ĐẦU ĐIỆN ẢNH (NẾU ĐANG CHẠY)
    if (this.isIntroPlaying) {
      this.updateIntro(delta);
    } else {
      // 1. Quản lý chuyển cảnh thời gian bình thường
      this.updateTimingAndSequencing(delta);
    }

    // 2. Nội suy độ xòe quỹ đạo (Smooth Easing)
    this.orbitSpread += (this.targetOrbitSpread - this.orbitSpread) * 0.05;

    // 3. Cập nhật Thu phóng Camera
    this.updateCinematicCamera(delta, currentTime);

    // 4. Tính toán góc nghiêng hồi quy 2D phẳng chuẩn xác
    const tiltFactor = Math.pow(this.orbitSpread, 1.4);

    let targetX = 0;
    let targetY = 0;

    if (this.mouseTrackingEnabled) {
      targetX = (0.32 - this.normMouseY * 0.5) * tiltFactor;
      targetY = (this.normMouseX * 0.6) * tiltFactor;
    } else {
      targetX = 0.32 * tiltFactor;
      targetY = 0.0;
    }

    const autoSwayX = Math.sin(currentTime * 0.35) * 0.06 * tiltFactor;
    const autoSwayY = Math.cos(currentTime * 0.28) * 0.06 * tiltFactor;

    this.currentRotX += (targetX + autoSwayX - this.currentRotX) * 0.05;
    this.currentRotY += (targetY + autoSwayY - this.currentRotY) * 0.05;
    this.currentZoom += (this.targetZoom - this.currentZoom) * 0.06;

    if (this.baguaGroup) {
      this.baguaGroup.rotation.x = this.currentRotX;
      this.baguaGroup.rotation.y = this.currentRotY;
      this.baguaGroup.position.z = Math.sin(currentTime * 0.7) * 18 * tiltFactor;
    }

    if (this.camera) {
      this.camera.position.z = this.currentZoom;
    }

    // 5. Quay các tầng đĩa (Kể cả khi đang xuất hiện vẫn xoay nhịp nhàng)
    if (!this.isPaused) {
      this.rings.forEach(ring => {
        ring.spinAngle += ring.spinSpeed * this.speedMultiplier;
        ring.mesh.rotation.z = ring.spinAngle;

        ring.precessAngle += ring.precessSpeed * this.speedMultiplier;

        const spread = this.orbitSpread;
        ring.orbitGroup.rotation.x = (ring.targetTiltX + Math.sin(ring.precessAngle) * 0.08) * spread;
        ring.orbitGroup.rotation.y = (ring.targetTiltY + Math.cos(ring.precessAngle) * 0.08) * spread;
        ring.orbitGroup.rotation.z = ring.targetTiltZ * spread;
      });
    }

    // 6. Cập nhật hạt bụi sao / Hỗn Độn
    if (this.particles) {
      this.particles.update(currentTime);
    }

    // 7. Cập nhật mã script chạy nền
    if (this.codeBg) {
      this.codeBg.update(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new BaguaApp();
});
