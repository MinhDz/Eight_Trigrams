/**
 * code-background.js
 * Tạo tầng mô phỏng mã scripts/GLSL/cổ văn chạy nền mờ ảo dưới đáy (giống video mẫu TikTok)
 */

class CodeBackground {
  constructor(canvasId = 'bg-code-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      document.body.prepend(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.enabled = true;
    this.opacity = 0.42; // Tăng độ nét mặc định theo yêu cầu (bớt mờ)

    this.codeLines = [
      "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN'>",
      "<!-- ☯ CÀN KHÔN BÁT QUÁI MA TRẬN NGUYÊN TỬ 3D -->",
      "<script id='shader-fs' type='x-shader/x-fragment'>",
      "  precision highp float;",
      "  uniform vec4 u_glowColor;",
      "  void main(void) {",
      "    gl_FragColor = vec4(0.0, 0.94, 1.0, 1.0) * u_glowColor;",
      "  }",
      "</script>",
      "<script id='shader-vs' type='x-shader/x-vertex'>",
      "  attribute vec3 vertexPosition;",
      "  uniform mat4 modelViewMatrix;",
      "  uniform mat4 perspectiveMatrix;",
      "  void main(void) {",
      "    gl_Position = perspectiveMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);",
      "  }",
      "</script>",
      "// Specify which function to use for depth buffer comparisons:",
      "// GL_LESS, GL_EQUAL, GL_LEQUAL, GL_ALWAYS",
      "gl.enable(gl.DEPTH_TEST);",
      "gl.depthFunc(gl.LEQUAL);",
      "gl.clearColor(0.0, 0.0, 0.0, 1.0);",
      "gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);",
      "",
      "// Khởi tạo ma trận Bát Quái Càn Khôn:",
      "const YIN_YANG_CORE = { state: 'TAIJI_SPIN', momentum: 0.008 };",
      "const TRIGRAMS = ['☰ Càn', '☱ Đoài', '☲ Ly', '☳ Chấn', '☴ Tốn', '☵ Khảm', '☶ Cấn', '☷ Khôn'];",
      "const BRANCHES = ['子 Tý', '丑 Sửu', '寅 Dần', '卯 Mão', '辰 Thìn', '巳 Tị', '午 Ngọ', '未 Mùi'];",
      "const MOUNTAINS_24 = ['壬', '子', '癸', '丑', '艮', '寅', '甲', '卯', '乙', '辰', '巽', '巳'];",
      "const NINE_STARS = ['Tham Lang', 'Cự Môn', 'Lộc Tồn', 'Văn Khúc', 'Liêm Trinh', 'Vũ Khúc', 'Phá Quân'];",
      "",
      "function initAtomicOrbits(radius, tiltAngles) {",
      "  let orbitGroup = new THREE.Group();",
      "  orbitGroup.rotation.x = tiltAngles.x;",
      "  orbitGroup.rotation.y = tiltAngles.y;",
      "  orbitGroup.rotation.z = tiltAngles.z;",
      "  return orbitGroup.add(createHollowRing(radius));",
      "}",
      "",
      "// Bind vertex buffer object",
      "gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);",
      "gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);",
      "gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);",
      "gl.enableVertexAttribArray(vertexPosition);",
      "",
      "// Orbital precession update loop:",
      "for (let i = 0; i < rings.length; i++) {",
      "  rings[i].spinAngle += rings[i].spinSpeed * delta;",
      "  rings[i].orbitPrecession = Math.sin(time * 0.05 + i * 0.4);",
      "}",
      "requestAnimationFrame(renderBaguaMatrix);"
    ];

    this.scrollOffsetY = 0;
    this.lineHeight = 24;
    this.fontSize = 15;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  update(delta = 0.016) {
    if (!this.enabled || this.opacity <= 0) return;

    this.scrollOffsetY += 16 * delta;
    const totalContentHeight = this.codeLines.length * this.lineHeight;
    if (this.scrollOffsetY > totalContentHeight) {
      this.scrollOffsetY = 0;
    }

    this.render();
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.font = `500 ${this.fontSize}px "Consolas", "Courier New", monospace`;
    ctx.textBaseline = 'top';

    const startY = -this.scrollOffsetY;
    const totalLines = this.codeLines.length;
    const repeatCount = Math.ceil(this.height / (totalLines * this.lineHeight)) + 2;

    for (let r = 0; r < repeatCount; r++) {
      const blockY = startY + r * totalLines * this.lineHeight;

      for (let i = 0; i < totalLines; i++) {
        const y = blockY + i * this.lineHeight;
        if (y < -30 || y > this.height + 30) continue;

        const line = this.codeLines[i];
        const lineNum = String(i + 1).padStart(3, ' ');

        // Màu số dòng sáng rõ hơn
        ctx.fillStyle = '#5577aa';
        ctx.fillText(lineNum + ' | ', 25, y);

        // Màu cú pháp sáng đẹp rõ nét
        if (line.trim().startsWith('//') || line.trim().startsWith('<!--')) {
          ctx.fillStyle = '#6ab370'; // Comment xanh lá tươi
        } else if (line.includes('function') || line.includes('const') || line.includes('let') || line.includes('var')) {
          ctx.fillStyle = '#6db5ff'; // Từ khóa xanh dương sáng
        } else if (line.includes('gl.') || line.includes('THREE.')) {
          ctx.fillStyle = '#5cead6'; // Đối tượng cyan phát quang
        } else if (line.includes('return') || line.includes('if') || line.includes('for')) {
          ctx.fillStyle = '#e29bf0'; // Điều kiện tím sáng
        } else {
          ctx.fillStyle = '#cbe6ff'; // Biến và code thông thường
        }

        ctx.fillText(line, 85, y);
      }
    }

    ctx.restore();
  }

  setEnabled(val) {
    this.enabled = val;
    if (!val) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  setOpacity(val) {
    this.opacity = parseFloat(val);
  }
}
