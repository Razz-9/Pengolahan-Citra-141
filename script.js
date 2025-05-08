// Inisialisasi gambar asli
let originalImage = null;

// Event listener saat gambar dimuat
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            drawImageToCanvas(img, 'originalCanvas');
            drawImageToCanvas(img, 'resultCanvas');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Gambar ke canvas
function drawImageToCanvas(image, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
}

// Reset gambar ke kondisi awal
function resetImage() {
    if (originalImage) {
        drawImageToCanvas(originalImage, 'resultCanvas');
        document.getElementById('brightnessSlider').value = 0;
        document.getElementById('contrastSlider').value = 0;
        updateBrightnessValue(0);
        updateContrastValue(0);
    }
}

function updateBrightnessValue(val) {
    document.getElementById('brightnessValue').textContent = val;
}
function updateContrastValue(val) {
    document.getElementById('contrastValue').textContent = val;
}

// Grayscale
function convertToGrayscale() {
    if (!originalImage) return;
    const src = cv.imread('originalCanvas');
    const dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow('resultCanvas', dst);
    src.delete(); dst.delete();
}

// Deteksi tepi (Canny)
function applyCanny() {
    if (!originalImage) return;
    const src = cv.imread('originalCanvas');
    const gray = new cv.Mat();
    const dst = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.Canny(gray, dst, 50, 150);
    cv.imshow('resultCanvas', dst);
    src.delete(); gray.delete(); dst.delete();
}

// Thresholding Biner (Otsu)
function applyThreshold() {
    if (!originalImage) return;
    const src = cv.imread('originalCanvas');
    const gray = new cv.Mat();
    const dst = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.threshold(gray, dst, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
    cv.imshow('resultCanvas', dst);
    src.delete(); gray.delete(); dst.delete();
}

// Histogram Equalization
function equalizeHistogram() {
    if (!originalImage) return;
    const src = cv.imread('originalCanvas');
    const gray = new cv.Mat();
    const dst = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.equalizeHist(gray, dst);
    cv.imshow('resultCanvas', dst);
    src.delete(); gray.delete(); dst.delete();
}

// Rotasi Gambar 90 derajat
function rotateImage() {
    if (!originalImage) return;
    const src = cv.imread('originalCanvas');
    const dst = new cv.Mat();
    cv.rotate(src, dst, cv.ROTATE_90_CLOCKWISE);
    cv.imshow('resultCanvas', dst);
    src.delete(); dst.delete();
}

// Brightness & Contrast
function applyBrightnessContrast() {
    if (!originalImage) return;
    const brightness = parseInt(document.getElementById('brightnessSlider').value);
    const contrast = parseInt(document.getElementById('contrastSlider').value);
    const canvas = document.getElementById('resultCanvas');
    const ctx = canvas.getContext('2d');
    drawImageToCanvas(originalImage, 'resultCanvas');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128 + brightness;
        data[i+1] = factor * (data[i+1] - 128) + 128 + brightness;
        data[i+2] = factor * (data[i+2] - 128) + 128 + brightness;
    }

    ctx.putImageData(imageData, 0, 0);
}