const originalImg = document.getElementById("canvas");

originalImg.addEventListener('change', () => {

});

const imageInput = document.getElementById("imageInput");

imageInput.addEventListener('change', (e) => {
  if (e.target.files) {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = (e) => {
      const loadedImage = new Image();
      loadedImage.src = e.target.result;

      loadedImage.onload = () => {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const canvasChanged = document.getElementById("canvasChanged");
        const ctxChanged = canvasChanged.getContext("2d");

        canvas.width = loadedImage.width;
        canvas.height = loadedImage.height;
        ctx.drawImage(loadedImage, 0, 0);

        ctxChanged.canvas.width = canvas.width;
        ctxChanged.canvas.height = canvas.height;
        canvasChanged.width = canvas.width;
        canvasChanged.height = canvas.height;
        ctxChanged.drawImage(loadedImage, 0, 0);
      }
    } 
  }
});

const invertButton = document.getElementById("invert");

invertButton.addEventListener('click', () => {
  const canvas = document.getElementById("canvas");
  const canvasChanged = document.getElementById("canvasChanged");
  const ctxOriginal = canvas.getContext("2d");
  const ctxChanged = canvasChanged.getContext("2d");

  const imageData = ctxOriginal.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = ~pixels[i] & 0xFF; // red
    pixels[i + 1] = ~pixels[i + 1] & 0xFF; // green
    pixels[i + 2] = ~pixels[i + 2] & 0xFF; // blue
  }

  ctxChanged.canvas.width = canvas.width;
  ctxChanged.canvas.height = canvas.height;
  canvasChanged.width = canvas.width;
  canvasChanged.height = canvas.height;
  ctxChanged.putImageData(imageData, 0, 0);

  return canvasChanged;
})

const redButton = document.getElementById("red");

redButton.addEventListener('click', () => {
  const canvas = document.getElementById("canvas");
  const canvasChanged = document.getElementById("canvasChanged");
  const ctxOriginal = canvas.getContext("2d");
  const ctxChanged = canvasChanged.getContext("2d");

  const imageData = ctxOriginal.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i + 1] = pixels[i + 1] >> 8; // green
  }

  ctxChanged.canvas.width = canvas.width;
  ctxChanged.canvas.height = canvas.height;
  canvasChanged.width = canvas.width;
  canvasChanged.height = canvas.height;
  ctxChanged.putImageData(imageData, 0, 0);

  return canvasChanged;
});

const greenButton = document.getElementById("green");

greenButton.addEventListener('click', () => {
  const canvas = document.getElementById("canvas");
  const canvasChanged = document.getElementById("canvasChanged");
  const ctxOriginal = canvas.getContext("2d");
  const ctxChanged = canvasChanged.getContext("2d");

  const imageData = ctxOriginal.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = pixels[i] >> 8; // green
  }

  ctxChanged.canvas.width = canvas.width;
  ctxChanged.canvas.height = canvas.height;
  canvasChanged.width = canvas.width;
  canvasChanged.height = canvas.height;
  ctxChanged.putImageData(imageData, 0, 0);

  return canvasChanged;
});

const blueButton = document.getElementById("blue");

blueButton.addEventListener('click', () => {
  const canvas = document.getElementById("canvas");
  const canvasChanged = document.getElementById("canvasChanged");
  const ctxOriginal = canvas.getContext("2d");
  const ctxChanged = canvasChanged.getContext("2d");

  const imageData = ctxOriginal.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i + 2] = pixels[i + 2] << 8;
  }

  ctxChanged.canvas.width = canvas.width;
  ctxChanged.canvas.height = canvas.height;
  canvasChanged.width = canvas.width;
  canvasChanged.height = canvas.height;
  ctxChanged.putImageData(imageData, 0, 0);

  return canvasChanged;
});

const matrixButton = document.getElementById("matrix");

matrixButton.addEventListener('click', () => {
  const canvas = document.getElementById("canvas");
  const canvasChanged = document.getElementById("canvasChanged");
  const ctxOriginal = canvas.getContext("2d");
  const ctxChanged = canvasChanged.getContext("2d");

  const imageData = ctxOriginal.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  for (let i = 0; i < pixels.length; i += 4) {
    if (i % 8 === 0) {
      continue; // adds stripes effect
    } else {
      pixels[i] = pixels[i] >> 2;
      pixels[i + 1] = pixels[i + 1] << 7;
      pixels[i + 2] = pixels[i + 2] >> 5;
    }
  }

  ctxChanged.canvas.width = canvas.width;
  ctxChanged.canvas.height = canvas.height;
  canvasChanged.width = canvas.width;
  canvasChanged.height = canvas.height;
  ctxChanged.putImageData(imageData, 0, 0);

  return canvasChanged;
});


