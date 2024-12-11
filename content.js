// 添加日志函数
function log(msg) {
  console.log('[网页二维码]:', msg);
}

// 创建悬浮favicon
function createFloatingFavicon() {
  log('开始创建悬浮图标');
  
  // 检查是否已存在
  if (document.querySelector('.floating-favicon')) {
    log('悬浮图标已存在');
    return;
  }

  const favicon = document.createElement('div');
  favicon.className = 'floating-favicon';
  
  // 获取网站favicon
  const faviconUrl = document.querySelector('link[rel="icon"]')?.href || 
                     document.querySelector('link[rel="shortcut icon"]')?.href ||
                     `${window.location.origin}/favicon.ico`;
  
  log('获取到favicon:', faviconUrl);
  
  favicon.innerHTML = `<img src="${faviconUrl}" alt="网站图标" onerror="this.src='${chrome.runtime.getURL('icons/icon48.png')}'">`;
  document.body.appendChild(favicon);
  
  // 点击显示二维码
  favicon.addEventListener('click', showQRCode);
  
  log('悬浮图标创建完成');
}

// 创建二维码弹窗
function showQRCode() {
  log('开始创建二维码弹窗');
  
  const modal = document.createElement('div');
  modal.className = 'qr-modal';
  
  const container = document.createElement('div');
  container.className = 'qr-container';
  
  const title = document.querySelector('title')?.textContent || window.location.hostname;
  const faviconUrl = document.querySelector('link[rel="icon"]')?.href || 
                     document.querySelector('link[rel="shortcut icon"]')?.href ||
                     `${window.location.origin}/favicon.ico`;
  
  container.innerHTML = `
    <div class="qrcode-wrapper">
      <div id="qrcode">
        <div class="qr-loading"></div>
      </div>
      <img class="favicon" src="${faviconUrl}" alt="网站图标" onerror="this.src='${chrome.runtime.getURL('icons/icon48.png')}'">
    </div>
    <h2 class="title">${title}</h2>
    <button class="close-btn">关闭</button>
  `;
  
  modal.appendChild(container);
  document.body.appendChild(modal);
  
  // 加载qrcode.js
  loadQRCode();
  
  // 点击关闭
  modal.querySelector('.close-btn').addEventListener('click', () => {
    modal.remove();
  });
  
  // 点击外部关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  log('二维码弹窗创建完成');
}

// 加载并初始化二维码
async function loadQRCode() {
  try {
    log('开始生成二维码');
    
    const qrcodeEl = document.getElementById('qrcode');
    if (!qrcodeEl) {
      throw new Error('找不到二维码容器元素');
    }
    
    qrcodeEl.innerHTML = ''; // 清除加载动画
    
    // QRCode对象应该已经可用，因为qrcode.min.js在content.js之前加载
    if (typeof QRCode === 'undefined') {
      throw new Error('QRCode对象未定义，请检查qrcode.min.js是否正确加载');
    }
    
    new QRCode(qrcodeEl, {
      text: window.location.href,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    
    log('二维码生成完成');
    
  } catch (err) {
    log('生成二维码失败:', err);
    const qrcodeEl = document.getElementById('qrcode');
    if (qrcodeEl) {
      qrcodeEl.innerHTML = `
        <div style="color: red; text-align: center; padding: 10px;">
          二维码生成失败<br>
          <small style="color: #666;">${err.message}</small>
        </div>
      `;
    }
  }
}

// 生成二维码
function generateQR() {
  const qrcodeEl = document.getElementById('qrcode');
  if (!qrcodeEl) {
    log('找不到二维码容器元素');
    return;
  }
  
  try {
    qrcodeEl.innerHTML = ''; // 清除加载动画
    
    new QRCode(qrcodeEl, {
      text: window.location.href,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    
    log('二维码生成完成');
  } catch (err) {
    log('生成二维码失败:', err);
    qrcodeEl.innerHTML = `
      <div style="color: red; text-align: center; padding: 10px;">
        生成二维码失败<br>
        <small style="color: #666;">${err.message}</small>
      </div>
    `;
  }
}

// 初始化函数
function init() {
  log('扩展开始初始化');
  createFloatingFavicon();
}

// 使用多种方式确保代码执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 监听页面变化，处理单页应用
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList' && !document.querySelector('.floating-favicon')) {
      log('检测到页面变化，重新创建图标');
      createFloatingFavicon();
      break;
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

log('content script 已加载'); 