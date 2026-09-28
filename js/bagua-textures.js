/**
 * bagua-textures.js
 * Tạo các Texture độ phân giải cao 2K cho cả 2 Đại Trận Pháp:
 * 1. Càn Khôn Bát Quái Truyền Thống
 * 2. Hỗn Độn Ngũ Hành & Tinh Đồ Chòm Sao (Video nguyen_thien_su.mp4)
 */

const BaguaTextureGenerator = {
  SIZE: 2048,

  createBaseCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this.SIZE;
    canvas.height = this.SIZE;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    return { canvas, ctx, center: this.SIZE / 2 };
  },

  // =========================================================================
  // PHẦN A: CÁC TEXTURE CỦA HỆ HỖN ĐỘN NGŨ HÀNH & TINH ĐỒ (MẪU MỚI)
  // =========================================================================

  /**
   * A1. Tâm Nhật Nguyệt Tinh Luân (Âm Mặt Trăng ☾ & Dương Mặt Trời ☀ + Bánh Xe Xoáy)
   */
  createSunMoonCoreTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const R = 165;

    ctx.save();
    ctx.translate(center, center);

    // 1. Hào quang Nhật Nguyệt giao hòa
    const auraGrad = ctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R * 1.4);
    auraGrad.addColorStop(0, 'rgba(255, 240, 190, 0.85)');
    auraGrad.addColorStop(0.5, theme.glow);
    auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // 2. Vòng tròn kép viền cổ
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 4;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.arc(0, 0, R - 16, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Bánh xe xoáy 8 cánh ở tâm (Giống video nguyen_thien_su.mp4)
    const blades = 8;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3.5;
    for (let i = 0; i < blades; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / blades);
      ctx.beginPath();
      ctx.arc(0, -R * 0.35, R * 0.38, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Biểu tượng Dương (Mặt Trời ☀ - Nửa trên rực rỡ)
    ctx.save();
    ctx.translate(0, -R * 0.42);
    ctx.fillStyle = '#ffdf70';
    ctx.shadowColor = '#ff9900';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();
    // Tia mặt trời
    ctx.strokeStyle = '#fff3b0';
    ctx.lineWidth = 2.5;
    for (let ray = 0; ray < 12; ray++) {
      const a = (ray * Math.PI * 2) / 12;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 28, Math.sin(a) * 28);
      ctx.lineTo(Math.cos(a) * 38, Math.sin(a) * 38);
      ctx.stroke();
    }
    ctx.font = 'bold 20px "Noto Serif SC", serif';
    ctx.fillStyle = '#1a0f00';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('日', 0, 1);
    ctx.restore();

    // 5. Biểu tượng Âm (Mặt Trăng ☾ - Nửa dưới huyền ảo)
    ctx.save();
    ctx.translate(0, R * 0.42);
    ctx.fillStyle = '#b3f0ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0.2 * Math.PI, 1.8 * Math.PI, false);
    ctx.arc(10, 0, 20, 1.7 * Math.PI, 0.3 * Math.PI, true);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 19px "Noto Serif SC", serif';
    ctx.fillStyle = '#e0ffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('月', -12, 0);
    ctx.restore();

    // 6. Hạt nhân trung tâm
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = theme.accent;
    ctx.shadowBlur = 25;
    ctx.fill();

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  },

  /**
   * A2. Tầng Ngũ Hành Bản Nguyên (Kim - Mộc - Thủy - Hỏa - Thổ + Ngũ Giác Tinh)
   */
  createFiveElementsRingTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const elements = BAGUA_DATA.fiveElements;
    const R = 285;

    ctx.save();
    ctx.translate(center, center);

    // Vòng tròn viền kép
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 3;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, R - 48, 0, Math.PI * 2);
    ctx.arc(0, 0, R + 48, 0, Math.PI * 2);
    ctx.stroke();

    // Vẽ ngôi sao Ngũ Giác Tinh (Pentagram) nối 5 hành tương sinh tương khắc
    ctx.strokeStyle = theme.secondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const idx1 = (i * 2) % 5;
      const idx2 = ((i + 1) * 2) % 5;
      const a1 = (idx1 * 2 * Math.PI) / 5 - Math.PI / 2;
      const a2 = (idx2 * 2 * Math.PI) / 5 - Math.PI / 2;
      if (i === 0) ctx.moveTo(Math.cos(a1) * (R - 45), Math.sin(a1) * (R - 45));
      ctx.lineTo(Math.cos(a2) * (R - 45), Math.sin(a2) * (R - 45));
    }
    ctx.closePath();
    ctx.stroke();

    // Vẽ 5 cung Ngũ Hành: Kim, Mộc, Thủy, Hỏa, Thổ
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const el = elements[i];

      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -R);

      // Vòng pháp trận nhỏ bao quanh từng nguyên tố
      ctx.beginPath();
      ctx.arc(0, 0, 38, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(8, 12, 20, 0.85)';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = el.color;
      ctx.shadowColor = el.glow;
      ctx.shadowBlur = 16;
      ctx.stroke();

      // Chữ Hán Ngũ Hành
      ctx.font = 'bold 42px "Noto Serif SC", "Kaiti", serif';
      ctx.fillStyle = el.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.char, 0, -2);

      // Tên tiếng Việt
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(el.name, 0, 26);

      ctx.restore();
    }

    // Hoa văn cổ giữa 5 hành
    for (let i = 0; i < 5; i++) {
      const midAngle = ((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
      ctx.save();
      ctx.rotate(midAngle);
      ctx.translate(0, -R);
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-25, 0);
      ctx.lineTo(25, 0);
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  },

  /**
   * A3. Tầng Bát Đại Pháp Tắc (Phong - Vũ - Lôi - Điện - Quang - Ám - Băng - Viêm)
   */
  createElementalForcesTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const forces = BAGUA_DATA.naturalForces;
    const count = forces.length; // 8
    const R = 390;

    ctx.save();
    ctx.translate(center, center);

    // Vòng viền kép
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, R - 40, 0, Math.PI * 2);
    ctx.arc(0, 0, R + 40, 0, Math.PI * 2);
    ctx.stroke();

    // Vẽ 8 nguyên tố dị tượng
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      const f = forces[i];

      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -R);

      // Khung thoi ma trận
      ctx.strokeStyle = f.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = f.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, -34);
      ctx.lineTo(34, 0);
      ctx.lineTo(0, 34);
      ctx.lineTo(-34, 0);
      ctx.closePath();
      ctx.stroke();

      // Chữ Hán nguyên tố
      ctx.font = 'bold 38px "Noto Serif SC", "Kaiti", serif';
      ctx.fillStyle = f.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(f.char, 0, -3);

      // Nhãn phụ
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = theme.accent;
      ctx.fillText(f.name, 0, 22);

      ctx.restore();
    }

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  },

  /**
   * A4. Tầng Chòm Sao Tinh Đồ Nối Dây (Connected Star Constellations - Giống video nguyen_thien_su.mp4)
   */
  createConstellationRingTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const constellations = BAGUA_DATA.constellations;
    const count = constellations.length; // 12 chòm sao lớn
    const R = 820;

    ctx.save();
    ctx.translate(center, center);

    // 1. Vòng tròn lớn viền tinh đồ (Giống vòng ngoài cùng của nguyen_thien_su.mp4)
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 3;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, 0, R - 42, 0, Math.PI * 2);
    ctx.arc(0, 0, R + 42, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Vạch chia 12 cung tinh tú
    for (let i = 0; i < count; i++) {
      const divAngle = ((i + 0.5) * 2 * Math.PI) / count - Math.PI / 2;
      ctx.strokeStyle = theme.secondary;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(divAngle) * (R - 42), Math.sin(divAngle) * (R - 42));
      ctx.lineTo(Math.cos(divAngle) * (R + 42), Math.sin(divAngle) * (R + 42));
      ctx.stroke();
    }

    // 3. Vẽ từng chòm sao nối dây (Constellation lines + Glowing Star Dots)
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      const constel = constellations[i];

      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -R);

      // Vẽ dây nối giữa các ngôi sao
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = 10;
      constel.links.forEach(([idx1, idx2]) => {
        const s1 = constel.stars[idx1];
        const s2 = constel.stars[idx2];
        if (s1 && s2) {
          ctx.beginPath();
          ctx.moveTo(s1[0] * 1.4, s1[1] * 1.4);
          ctx.lineTo(s2[0] * 1.4, s2[1] * 1.4);
          ctx.stroke();
        }
      });

      // Vẽ các điểm sao sáng lấp lánh
      constel.stars.forEach(([sx, sy], sIdx) => {
        const x = sx * 1.4;
        const y = sy * 1.4;
        const starR = (sIdx === 0 || sIdx === 2) ? 5.5 : 4.0;

        ctx.beginPath();
        ctx.arc(x, y, starR, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = theme.primary;
        ctx.shadowBlur = 12;
        ctx.fill();

        // Tia chữ thập ngôi sao lớn
        if (starR > 5) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x - 9, y); ctx.lineTo(x + 9, y);
          ctx.moveTo(x, y - 9); ctx.lineTo(x, y + 9);
          ctx.stroke();
        }
      });

      ctx.restore();
    }

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  },

  // =========================================================================
  // PHẦN B: CÁC TEXTURE CỦA HỆ BÁT QUÁI TRUYỀN THỐNG
  // =========================================================================

  /**
   * B1. Tâm Thái Cực (Taijitu ☯)
   */
  createTaijiTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const R = 150;

    ctx.save();
    ctx.translate(center, center);

    const auraGrad = ctx.createRadialGradient(0, 0, R * 0.7, 0, 0, R * 1.35);
    auraGrad.addColorStop(0, theme.glow);
    auraGrad.addColorStop(0.6, theme.darkGlow);
    auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, R * 1.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.fillStyle = '#05070c';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, R, -Math.PI / 2, Math.PI / 2, false);
    ctx.arc(0, R / 2, R / 2, Math.PI / 2, -Math.PI / 2, true);
    ctx.arc(0, -R / 2, R / 2, Math.PI / 2, -Math.PI / 2, false);
    ctx.fillStyle = theme.accent;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(0, R / 2, R / 2, -Math.PI / 2, Math.PI / 2, false);
    ctx.fillStyle = '#05070c';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, -R / 2, R / 6.5, 0, Math.PI * 2);
    ctx.fillStyle = '#05070c';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, R / 2, R / 6.5, 0, Math.PI * 2);
    ctx.fillStyle = theme.accent;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 5;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 15;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, R + 14, 0, Math.PI * 2);
    ctx.strokeStyle = theme.secondary;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  },

  /**
   * B2. Tầng Hào Bát Quái (Trigram Lines)
   */
  createTrigramLinesTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const trigrams = BAGUA_DATA.trigrams;
    const count = trigrams.length;
    const baseR = 265;
    const lineSpacing = 24;
    const lineWidth = 125;
    const lineHeight = 10;
    const gap = 20;

    ctx.save();
    ctx.translate(center, center);

    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, baseR - 28, 0, Math.PI * 2);
    ctx.arc(0, 0, baseR + lineSpacing * 2 + 32, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      const trigram = trigrams[i];

      ctx.save();
      ctx.rotate(angle);

      for (let l = 0; l < 3; l++) {
        const r = baseR + l * lineSpacing;
        const isSolid = trigram.lines[l] === 1;

        ctx.fillStyle = theme.primary;
        ctx.shadowColor = theme.glow;
        ctx.shadowBlur = 10;

        if (isSolid) {
          ctx.beginPath();
          ctx.roundRect(-lineWidth / 2, -r - lineHeight / 2, lineWidth, lineHeight, 3);
          ctx.fill();
        } else {
          const segWidth = (lineWidth - gap) / 2;
          ctx.beginPath();
          ctx.roundRect(-lineWidth / 2, -r - lineHeight / 2, segWidth, lineHeight, 3);
          ctx.roundRect(gap / 2, -r - lineHeight / 2, segWidth, lineHeight, 3);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  },

  /**
   * B3. Tầng Bát Quái Hán Tự
   */
  createTrigramNamesTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const trigrams = BAGUA_DATA.trigrams;
    const count = trigrams.length;
    const R = 380;

    ctx.save();
    ctx.translate(center, center);

    ctx.strokeStyle = theme.secondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, R - 40, 0, Math.PI * 2);
    ctx.arc(0, 0, R + 40, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = theme.accent;
    for (let j = 0; j < 32; j++) {
      const dotA = (j * 2 * Math.PI) / 32;
      ctx.beginPath();
      ctx.arc(Math.cos(dotA) * (R - 40), Math.sin(dotA) * (R - 40), 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = 'bold 54px "Noto Serif SC", "Kaiti", "STKaiti", "SimSun", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      const trigram = trigrams[i];

      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -R);

      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = 14;
      ctx.fillStyle = theme.accent;
      ctx.fillText(trigram.char, 0, 0);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = theme.secondary;
      ctx.fillText(trigram.name.toUpperCase(), 0, 32);

      ctx.restore();
    }

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  },

  /**
   * B4. Tầng 12 Địa Chi
   */
  createBranchesTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const branches = BAGUA_DATA.earthlyBranches;
    const count = branches.length;
    const R = 490;

    ctx.save();
    ctx.translate(center, center);

    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, R - 42, 0, Math.PI * 2);
    ctx.arc(0, 0, R + 42, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = theme.darkGlow;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < count; i++) {
      const sepAngle = (i * 2 * Math.PI) / count;
      ctx.beginPath();
      ctx.moveTo(Math.cos(sepAngle) * (R - 42), Math.sin(sepAngle) * (R - 42));
      ctx.lineTo(Math.cos(sepAngle) * (R + 42), Math.sin(sepAngle) * (R + 42));
      ctx.stroke();
    }

    ctx.font = 'bold 44px "Noto Serif SC", "Kaiti", "STKaiti", "SimSun", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      const branch = branches[i];

      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -R);

      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = 12;
      ctx.fillStyle = theme.primary;
      ctx.fillText(branch.char, 0, 0);

      ctx.restore();
    }

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  },

  /**
   * B5. Tầng Nhị Thập Tứ Sơn
   */
  createTwentyFourMountainsTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const mountains = BAGUA_DATA.twentyFourMountains;
    const count = mountains.length;
    const R = 600;

    ctx.save();
    ctx.translate(center, center);

    ctx.strokeStyle = theme.secondary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, R - 36, 0, Math.PI * 2);
    ctx.arc(0, 0, R + 36, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < count; i++) {
      const sepAngle = (i * 2 * Math.PI) / count;
      ctx.beginPath();
      ctx.moveTo(Math.cos(sepAngle) * (R - 36), Math.sin(sepAngle) * (R - 36));
      ctx.lineTo(Math.cos(sepAngle) * (R + 36), Math.sin(sepAngle) * (R + 36));
      ctx.stroke();
    }

    ctx.font = 'bold 32px "Noto Serif SC", "Kaiti", "STKaiti", "SimSun", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;

      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -R);

      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = 8;
      ctx.fillStyle = (i % 2 === 0) ? theme.accent : theme.primary;
      ctx.fillText(mountains[i], 0, 0);

      ctx.restore();
    }

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  },

  /**
   * B6. Tầng Cửu Tinh Trận Pháp
   */
  createNineStarsTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const stars = BAGUA_DATA.nineStars;
    const count = 18;
    const R = 710;

    ctx.save();
    ctx.translate(center, center);

    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, R - 40, 0, Math.PI * 2);
    ctx.arc(0, 0, R + 40, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = 'bold 28px "Noto Serif SC", "Kaiti", "STKaiti", "SimSun", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      const starText = stars[i % stars.length];

      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -R);

      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = 10;
      ctx.fillStyle = theme.accent;
      ctx.fillText(starText, 0, 0);

      ctx.restore();
    }

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  },

  /**
   * B7. Tầng Nhị Thập Bát Tú
   */
  createMansionsTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const mansions = BAGUA_DATA.twentyEightMansions;
    const count = mansions.length;
    const R = 820;

    ctx.save();
    ctx.translate(center, center);

    ctx.strokeStyle = theme.secondary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, R - 34, 0, Math.PI * 2);
    ctx.arc(0, 0, R + 34, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < count; i++) {
      const sepAngle = (i * 2 * Math.PI) / count;
      ctx.beginPath();
      ctx.moveTo(Math.cos(sepAngle) * (R - 34), Math.sin(sepAngle) * (R - 34));
      ctx.lineTo(Math.cos(sepAngle) * (R + 34), Math.sin(sepAngle) * (R + 34));
      ctx.stroke();
    }

    ctx.font = 'bold 26px "Noto Serif SC", "Kaiti", "STKaiti", "SimSun", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;

      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -R);

      ctx.shadowColor = theme.glow;
      ctx.shadowBlur = 6;
      ctx.fillStyle = theme.primary;
      ctx.fillText(mansions[i], 0, 0);

      ctx.restore();
    }

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  },

  /**
   * B8. Vành Độ La Kinh Ngoài Cùng
   */
  createOuterRingTexture(theme) {
    const { canvas, ctx, center } = this.createBaseCanvas();
    const R = 930;

    ctx.save();
    ctx.translate(center, center);

    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 4;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, R + 55, 0, Math.PI * 2);
    ctx.arc(0, 0, R - 40, 0, Math.PI * 2);
    ctx.stroke();

    for (let deg = 0; deg < 360; deg++) {
      const angle = (deg * Math.PI) / 180;
      const isMajor = deg % 10 === 0;
      const isMedium = deg % 5 === 0 && !isMajor;

      const innerOffset = isMajor ? -36 : (isMedium ? -24 : -12);
      ctx.strokeStyle = isMajor ? theme.accent : (isMedium ? theme.primary : 'rgba(255,255,255,0.3)');
      ctx.lineWidth = isMajor ? 2.5 : (isMedium ? 1.5 : 1);

      const r1 = R + innerOffset;
      const r2 = R;

      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
      ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
      ctx.stroke();

      if (deg % 30 === 0) {
        ctx.save();
        ctx.rotate(angle - Math.PI / 2);
        ctx.translate(0, -(R + 25));
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = theme.accent;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${deg}°`, 0, 0);
        ctx.restore();
      }
    }

    const jewelCount = 72;
    ctx.fillStyle = theme.accent;
    ctx.shadowColor = theme.glow;
    ctx.shadowBlur = 10;
    for (let j = 0; j < jewelCount; j++) {
      const jAngle = (j * 2 * Math.PI) / jewelCount;
      const jR = R + 44;
      ctx.beginPath();
      ctx.arc(Math.cos(jAngle) * jR, Math.sin(jAngle) * jR, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    return new THREE.CanvasTexture(canvas);
  }
};
