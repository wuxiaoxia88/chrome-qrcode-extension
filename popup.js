document.addEventListener('DOMContentLoaded', async () => {
  // 获取当前标签页信息
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // 设置网站标题
  const title = document.getElementById('title');
  title.textContent = tab.title.split(' - ')[0]; // 清理标题中的后缀
  
  // 设置网站图标
  const favicon = document.getElementById('favicon');
  favicon.src = tab.favIconUrl || 'icons/default-favicon.png';
  
  // 生成二维码
  const qrcode = new QRCode(document.getElementById('qrcode'), {
    text: tab.url,
    width: 200,
    height: 200,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}); 