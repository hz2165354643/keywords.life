// main.js
// 实现图片上传、压缩、预览、文件大小显示和下载功能
// 所有代码均有详细中文注释，便于初学者理解

// 获取页面元素
const fileInput = document.getElementById('fileInput');
const qualityRange = document.getElementById('qualityRange');
const qualityValue = document.getElementById('qualityValue');
const originalImg = document.getElementById('originalImg');
const compressedImg = document.getElementById('compressedImg');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const downloadBtn = document.getElementById('downloadBtn');

// 用于存储压缩后的图片数据
let compressedBlob = null;

// 工具函数：格式化文件大小（字节转 KB/MB）
function formatSize(size) {
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  return (size / 1024 / 1024).toFixed(2) + ' MB';
}

// 监听压缩比例滑块，实时显示数值
qualityRange.addEventListener('input', function () {
  qualityValue.textContent = qualityRange.value + '%';
  // 如果已经有图片，自动重新压缩
  if (originalImg.src) {
    compressImage();
  }
});

// 监听文件上传
fileInput.addEventListener('change', function () {
  const file = fileInput.files[0];
  if (!file) return;
  // 只允许 PNG/JPG/JPEG
  if (!/^image\/(png|jpe?g)$/.test(file.type)) {
    alert('只支持 PNG、JPG 格式图片！');
    return;
  }
  // 显示原图预览
  const reader = new FileReader();
  reader.onload = function (e) {
    originalImg.src = e.target.result;
    originalImg.onload = function () {
      // 显示原图大小
      originalSize.textContent = formatSize(file.size);
      // 压缩图片
      compressImage();
    };
  };
  reader.readAsDataURL(file);
});

// 图片压缩函数
function compressImage() {
  // 获取原图
  const img = originalImg;
  if (!img.src) return;
  // 创建 canvas
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  // 绘制原图到 canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  // 获取压缩比例
  const quality = parseInt(qualityRange.value, 10) / 100;
  // 判断图片类型
  let mimeType = 'image/jpeg';
  if (img.src.startsWith('data:image/png')) {
    mimeType = 'image/png';
  }
  // 导出压缩图片
  canvas.toBlob(function (blob) {
    compressedBlob = blob;
    // 显示压缩后图片
    const url = URL.createObjectURL(blob);
    compressedImg.src = url;
    // 显示压缩后大小
    compressedSize.textContent = formatSize(blob.size);
    // 启用下载按钮
    downloadBtn.disabled = false;
  }, mimeType, quality);
}

// 下载压缩后图片
downloadBtn.addEventListener('click', function () {
  if (!compressedBlob) return;
  const a = document.createElement('a');
  a.href = URL.createObjectURL(compressedBlob);
  a.download = 'compressed-image.' + (compressedBlob.type === 'image/png' ? 'png' : 'jpg');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}); 