/**
 * bagua-data.js
 * Dữ liệu học thuật cổ phong:
 * 1. Hệ Bát Quái Truyền Thống (8 Quẻ, Can Chi, 24 Sơn, Cửu Tinh, 28 Tú)
 * 2. Hệ Hỗn Độn Ngũ Hành & Nguyên Tố Vạn Tượng (Nhật Nguyệt, Ngũ Hành, Phong Vũ Lôi Điện Quang Ám, Chòm Sao)
 */

const BAGUA_DATA = {
  // 8 Quẻ Bát Quái (Tiên Thiên Bát Quái)
  trigrams: [
    { name: 'Càn', char: '乾', symbol: '☰', lines: [1, 1, 1], nature: 'Thiên (Trời)', element: 'Kim' },
    { name: 'Đoài', char: '兑', symbol: '☱', lines: [1, 1, 0], nature: 'Trạch (Đầm)', element: 'Kim' },
    { name: 'Ly', char: '离', symbol: '☲', lines: [1, 0, 1], nature: 'Hỏa (Lửa)', element: 'Hỏa' },
    { name: 'Chấn', char: '震', symbol: '☳', lines: [1, 0, 0], nature: 'Lôi (Sấm)', element: 'Mộc' },
    { name: 'Tốn', char: '巽', symbol: '☴', lines: [0, 1, 1], nature: 'Phong (Gió)', element: 'Mộc' },
    { name: 'Khảm', char: '坎', symbol: '☵', lines: [0, 1, 0], nature: 'Thủy (Nước)', element: 'Thủy' },
    { name: 'Cấn', char: '艮', symbol: '☶', lines: [0, 0, 1], nature: 'Sơn (Núi)', element: 'Thổ' },
    { name: 'Khôn', char: '坤', symbol: '☷', lines: [0, 0, 0], nature: 'Địa (Đất)', element: 'Thổ' }
  ],

  // Ngũ Hành Bản Nguyên (5 Elements)
  fiveElements: [
    { char: '金', name: 'KIM', sub: 'Bạch Kim Sắc Bén', color: '#ffe89e', glow: '#ffcc33' },
    { char: '木', name: 'MỘC', sub: 'Thanh Mộc Sinh Cơ', color: '#7dffb3', glow: '#00e676' },
    { char: '水', name: 'THỦY', sub: 'Huyền Thủy Hàn Băng', color: '#80e5ff', glow: '#00b0ff' },
    { char: '火', name: 'HỎA', sub: 'Xích Hỏa Liệt Diễm', color: '#ff8a80', glow: '#ff3d00' },
    { char: '土', name: 'THỔ', sub: 'Hoàng Thổ Hậu Đức', color: '#ffd180', glow: '#ff9100' }
  ],

  // Bát Đại Pháp Tắc Nguyên Tố (Phong Vũ Lôi Điện Quang Ám Băng Viêm)
  naturalForces: [
    { char: '風', name: 'PHONG', desc: 'Cuồng Phong', color: '#a7ffeb' },
    { char: '雨', name: 'VŨ', desc: 'Huyền Vũ', color: '#82b1ff' },
    { char: '雷', name: 'LÔI', desc: 'Thiên Lôi', color: '#b388ff' },
    { char: '電', name: 'ĐIỆN', desc: 'Tử Điện', color: '#ea80fc' },
    { char: '光', name: 'QUANG', desc: 'Thánh Quang', color: '#fff9c4' },
    { char: '暗', name: 'ÁM', desc: 'Hắc Ám', color: '#90a4ae' },
    { char: '冰', name: 'BĂNG', desc: 'Hàn Băng', color: '#84ffff' },
    { char: '炎', name: 'VIÊM', desc: 'Phần Viêm', color: '#ff9e80' }
  ],

  // 12 Chòm Sao Tinh Đồ (Constellation Patterns giống video nguyen_thien_su.mp4)
  // Mỗi chòm sao gồm danh sách các điểm (dx, dy) tương đối và các cặp nối dây
  constellations: [
    {
      name: 'Thanh Long Giác',
      stars: [[-28, -10], [-12, -4], [0, 4], [14, -6], [28, 8]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4]]
    },
    {
      name: 'Bắc Đẩu Thất Tinh',
      stars: [[-32, -8], [-18, -12], [-6, -6], [4, 2], [16, 12], [28, 8], [24, -6]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]]
    },
    {
      name: 'Bạch Hổ Khuê',
      stars: [[-25, 0], [-10, -12], [10, -10], [25, 0], [8, 12], [-12, 10]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
    },
    {
      name: 'Chu Tước Dực',
      stars: [[-30, 8], [-12, 0], [0, -14], [0, 12], [12, 0], [30, 8]],
      links: [[0, 1], [1, 2], [1, 3], [1, 4], [4, 2], [4, 5]]
    },
    {
      name: 'Huyền Vũ Đẩu',
      stars: [[-24, -10], [-8, -10], [6, 0], [20, -8], [26, 8], [6, 14]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2]]
    },
    {
      name: 'Thiên Lang Tinh',
      stars: [[-26, 6], [-8, -8], [0, 8], [12, -8], [28, 4]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 3]]
    },
    {
      name: 'Hiên Viên Tinh',
      stars: [[-28, -6], [-14, 8], [0, -8], [14, 8], [28, -6]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4]]
    },
    {
      name: 'Tử Vi Đế Tinh',
      stars: [[-24, 10], [-12, -6], [0, -14], [12, -6], [24, 10], [0, 4]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [3, 5]]
    },
    {
      name: 'Thiên Cơ Tinh',
      stars: [[-26, -8], [-8, 0], [8, 0], [26, 8], [0, -14], [0, 14]],
      links: [[0, 1], [1, 2], [2, 3], [4, 1], [2, 5]]
    },
    {
      name: 'Thất Sát Tinh',
      stars: [[-28, 0], [-10, -12], [6, 0], [24, -10], [18, 12]],
      links: [[0, 1], [1, 2], [2, 3], [2, 4]]
    },
    {
      name: 'Phá Quân Tinh',
      stars: [[-26, 8], [-12, -10], [4, -4], [18, -12], [26, 6], [4, 12]],
      links: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5]]
    },
    {
      name: 'Tham Lang Tinh',
      stars: [[-24, -6], [-8, -12], [8, -4], [24, -8], [12, 10], [-8, 10]],
      links: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [5, 1]]
    }
  ],

  // 12 Địa Chi
  earthlyBranches: [
    { char: '子', name: 'Tý', animal: 'Chuột' },
    { char: '丑', name: 'Sửu', animal: 'Trâu' },
    { char: '寅', name: 'Dần', animal: 'Hổ' },
    { char: '卯', name: 'Mão', animal: 'Mèo/Thỏ' },
    { char: '辰', name: 'Thìn', animal: 'Rồng' },
    { char: '巳', name: 'Tị', animal: 'Rắn' },
    { char: '午', name: 'Ngọ', animal: 'Ngựa' },
    { char: '未', name: 'Mùi', animal: 'Dê' },
    { char: '申', name: 'Thân', animal: 'Khỉ' },
    { char: '酉', name: 'Dậu', animal: 'Gà' },
    { char: '戌', name: 'Tuất', animal: 'Chó' },
    { char: '亥', name: 'Hợi', animal: 'Lợn' }
  ],

  // 10 Thiên Can
  heavenlyStems: [
    { char: '甲', name: 'Giáp' },
    { char: '乙', name: 'Ất' },
    { char: '丙', name: 'Bính' },
    { char: '丁', name: 'Đinh' },
    { char: '戊', name: 'Mậu' },
    { char: '己', name: 'Kỷ' },
    { char: '庚', name: 'Canh' },
    { char: '辛', name: 'Tân' },
    { char: '壬', name: 'Nhâm' },
    { char: '癸', name: 'Quý' }
  ],

  // 24 Sơn Hướng Chuẩn La Kinh Bát Quái
  twentyFourMountains: [
    '壬', '子', '癸', '丑', '艮', '寅', 
    '甲', '卯', '乙', '辰', '巽', '巳', 
    '丙', '午', '丁', '未', '坤', '申', 
    '庚', '酉', '辛', '戌', '乾', '亥'
  ],

  // Cửu Tinh
  nineStars: [
    '贪狼', '巨门', '禄存', '文曲', 
    '廉贞', '武曲', '破军', '左辅', '右弼'
  ],

  // Nhị Thập Bát Tú
  twentyEightMansions: [
    '角', '亢', '氐', '房', '心', '尾', '箕',
    '斗', '牛', '女', '虚', '危', '室', '壁',
    '奎', '娄', '胃', '昴', '毕', '觜', '参',
    '井', '鬼', '柳', '星', '张', '翼', '轸'
  ],

  // Phối màu trận pháp (Themes)
  themes: {
    celestial: {
      name: 'Thiên Sư Tinh Đồ (Celestial Gold - Mẫu Mới)',
      primary: '#ffdfa0',
      secondary: '#d89b48',
      accent: '#fff8e7',
      glow: 'rgba(255, 215, 140, 0.75)',
      darkGlow: 'rgba(180, 120, 40, 0.3)',
      bgCenter: '#140f08',
      particle: '#ffe6b0'
    },
    cyan: {
      name: 'Thanh Long Hàn Băng (Cyan Cyber)',
      primary: '#00f0ff',
      secondary: '#0088ff',
      accent: '#80ffff',
      glow: 'rgba(0, 240, 255, 0.65)',
      darkGlow: 'rgba(0, 100, 255, 0.25)',
      bgCenter: '#031020',
      particle: '#60e0ff'
    },
    gold: {
      name: 'Hoàng Kim Đế Vương (Imperial Gold)',
      primary: '#ffcc33',
      secondary: '#ff9900',
      accent: '#fff2a8',
      glow: 'rgba(255, 204, 51, 0.7)',
      darkGlow: 'rgba(200, 120, 0, 0.3)',
      bgCenter: '#1a1202',
      particle: '#ffe885'
    },
    emerald: {
      name: 'Bích Ngọc U Linh (Mystic Jade)',
      primary: '#10f5a0',
      secondary: '#00aa66',
      accent: '#8affd0',
      glow: 'rgba(16, 245, 160, 0.65)',
      darkGlow: 'rgba(0, 120, 60, 0.25)',
      bgCenter: '#02150e',
      particle: '#70ffc5'
    },
    crimson: {
      name: 'Huyết Chu Sa (Crimson Rune)',
      primary: '#ff3344',
      secondary: '#cc0022',
      accent: '#ff8899',
      glow: 'rgba(255, 51, 68, 0.7)',
      darkGlow: 'rgba(150, 0, 20, 0.3)',
      bgCenter: '#180205',
      particle: '#ff7788'
    },
    silver: {
      name: 'Bạch Ngân Hàn Sương (Silver Star)',
      primary: '#e8f0fe',
      secondary: '#9ab0d3',
      accent: '#ffffff',
      glow: 'rgba(230, 240, 255, 0.65)',
      darkGlow: 'rgba(100, 120, 160, 0.25)',
      bgCenter: '#080a12',
      particle: '#d0e0ff'
    }
  }
};
