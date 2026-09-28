/**
 * electron/main.js
 * Quản lý vòng đời ứng dụng Desktop, Khay hệ thống (System Tray) và Giám sát thời gian nhàn rỗi (Idle Screensaver)
 */

const { app, BrowserWindow, Tray, Menu, powerMonitor, ipcMain, globalShortcut } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

// Cấu hình Screensaver mặc định
let screensaverConfig = {
  enabled: true,
  idleThresholdSeconds: 180, // 3 phút
  dismissOnInput: true,
  isScreensaverActive: false
};

let lastMousePosition = { x: 0, y: 0 };
let idleCheckInterval = null;

// Khóa chỉ cho phép 1 instance ứng dụng chạy duy nhất (Single Instance Lock)
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      showScreensaver();
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    show: false, // Ban đầu ẩn để chạy ngầm dưới khay
    frame: false, // Không viền để đạt chuẩn màn hình chờ
    fullscreenable: true,
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  mainWindow.on('close', (event) => {
    // Không đóng ứng dụng mà chỉ thu nhỏ về System Tray
    if (!app.isQuitting) {
      event.preventDefault();
      hideScreensaver();
    }
  });

  // Đăng ký phím tắt khi cửa sổ đang mở
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      hideScreensaver();
      event.preventDefault();
    }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../assets/tray-icon.png');
  tray = new Tray(iconPath);
  tray.setToolTip('Càn Khôn Bát Quái 3D - Screensaver');

  updateTrayMenu();

  // Bấm đúp vào icon khay để bật màn hình chờ
  tray.on('double-click', () => {
    if (mainWindow.isVisible()) {
      hideScreensaver();
    } else {
      showScreensaver();
    }
  });
}

function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '☯ Bật Màn hình Bát Quái (Fullscreen)',
      click: () => showScreensaver()
    },
    {
      label: '🗔 Xem dạng cửa sổ',
      click: () => showWindowed()
    },
    { type: 'separator' },
    {
      label: '⚙ Tự động kích hoạt khi nghỉ (Idle Screensaver)',
      type: 'checkbox',
      checked: screensaverConfig.enabled,
      click: (item) => {
        screensaverConfig.enabled = item.checked;
      }
    },
    {
      label: '⏱ Thời gian chờ',
      submenu: [
        {
          label: '1 phút (Thử nghiệm)',
          type: 'radio',
          checked: screensaverConfig.idleThresholdSeconds === 60,
          click: () => { screensaverConfig.idleThresholdSeconds = 60; }
        },
        {
          label: '3 phút (Khuyên dùng)',
          type: 'radio',
          checked: screensaverConfig.idleThresholdSeconds === 180,
          click: () => { screensaverConfig.idleThresholdSeconds = 180; }
        },
        {
          label: '5 phút',
          type: 'radio',
          checked: screensaverConfig.idleThresholdSeconds === 300,
          click: () => { screensaverConfig.idleThresholdSeconds = 300; }
        },
        {
          label: '10 phút',
          type: 'radio',
          checked: screensaverConfig.idleThresholdSeconds === 600,
          click: () => { screensaverConfig.idleThresholdSeconds = 600; }
        }
      ]
    },
    {
      label: '✖ Tự ẩn khi di chuyển chuột',
      type: 'checkbox',
      checked: screensaverConfig.dismissOnInput,
      click: (item) => {
        screensaverConfig.dismissOnInput = item.checked;
      }
    },
    { type: 'separator' },
    {
      label: '❌ Thoát hoàn toàn',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
}

function showScreensaver() {
  if (!mainWindow) return;
  screensaverConfig.isScreensaverActive = true;
  mainWindow.setFullScreen(true);
  mainWindow.show();
  mainWindow.focus();
}

function showWindowed() {
  if (!mainWindow) return;
  screensaverConfig.isScreensaverActive = false;
  mainWindow.setFullScreen(false);
  mainWindow.show();
  mainWindow.focus();
}

function hideScreensaver() {
  if (!mainWindow) return;
  screensaverConfig.isScreensaverActive = false;
  mainWindow.setFullScreen(false);
  mainWindow.hide();
}

/**
 * Giám sát thời gian nhàn rỗi của hệ thống Windows
 */
function startIdleMonitor() {
  idleCheckInterval = setInterval(() => {
    if (!screensaverConfig.enabled || screensaverConfig.isScreensaverActive) {
      return;
    }

    const idleTime = powerMonitor.getSystemIdleTime(); // Trả về số giây nhàn rỗi
    if (idleTime >= screensaverConfig.idleThresholdSeconds) {
      showScreensaver();
    }
  }, 2000);
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  startIdleMonitor();

  // Đăng ký phím tắt toàn hệ thống: Ctrl+Shift+B để mở nhanh Bát Quái
  globalShortcut.register('CommandOrControl+Shift+B', () => {
    if (mainWindow.isVisible()) {
      hideScreensaver();
    } else {
      showScreensaver();
    }
  });

  // Hiển thị thông báo nhỏ ở khay
  tray.displayBalloon && tray.displayBalloon({
    title: 'Càn Khôn Bát Quái 3D',
    content: 'Ứng dụng đang chạy ngầm trong khay hệ thống. Bấm đúp hoặc nhấn Ctrl+Shift+B để mở.'
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (idleCheckInterval) clearInterval(idleCheckInterval);
});

app.on('window-all-closed', () => {
  // Không thoát khi đóng cửa sổ trên Windows để duy trì icon khay
});

