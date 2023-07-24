const colorMap = {
  "#007bff": "Blue",
  "#0056b3": "Dark Blue",
  // Add more color mappings here as needed
};

const colorPalettes = {
  "Blue Theme": ["#007bff", "#0056b3", "#0d6efd"],
  "Red Theme": ["#dc3545", "#a80d25", "#f00"],
  "Green Theme": ["#28a745", "#19692c", "#5cbf49"],
  // Add more color palettes as needed
};

document.getElementById("changeColorButton").addEventListener("click", function() {
  changeBackgroundColor();
});

document.getElementById("copyHexCodeButton").addEventListener("click", function() {
  copyHexCodeToClipboard();
});

document.getElementById("colorPalettes").addEventListener("click", function(event) {
  if (event.target.matches(".paletteButton")) {
    applyPalette(event.target.dataset.palette);
  }
});

document.body.addEventListener("touchstart", handleTouchStart, false);
document.body.addEventListener("touchmove", handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(event) {
  const firstTouch = event.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(event) {
  if (!xDown || !yDown) {
    return;
  }

  const xUp = event.touches[0].clientX;
  const yUp = event.touches[0].clientY;

  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      /* right swipe */
    } else {
      /* left swipe */
    }
  } else {
    if (yDiff > 0) {
      /* down swipe */
      changeBackgroundColor();
    } else {
      /* up swipe */
    }
  }

  /* reset values */
  xDown = null;
  yDown = null;
}

function changeBackgroundColor() {
  var randomColor = getRandomColor();
  document.body.style.backgroundColor = randomColor;
  document.getElementById("colorHexCode").innerText = "Color Hex Code: " + randomColor;

  var colorName = getColorName(randomColor);
  document.getElementById("colorName").innerText = "Color Name: " + colorName;

  // Generate complementary and analogous colors
  var complementaryColor = getComplementaryColor(randomColor);
  var analogousColors = getAnalogousColors(randomColor, 5);

  // Display complementary and analogous colors in the palette
  displayColorPalette(complementaryColor, analogousColors);

  // Check color contrast and provide a status message
  checkColorContrast(randomColor);
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getColorName(color) {
  return colorMap[color] || "Unknown";
}

function copyHexCodeToClipboard() {
  var colorHexCode = document.getElementById("colorHexCode").innerText;
  colorHexCode = colorHexCode.replace("Color Hex Code: ", "");
  var tempInput = document.createElement("input");
  tempInput.value = colorHexCode;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

function applyPalette(palette) {
  var colors = palette.split(",");
  document.body.style.backgroundColor = colors[0];
  document.getElementById("colorHexCode").innerText = "Color Hex Code: " + colors[0];
  changeBackgroundColor(); // Update color palette and complementary colors

  // Additional logic to update color palette and complementary colors can be added here
}

function getComplementaryColor(color) {
  var tinyColor = tinycolor(color);
  return tinyColor.complement().toHexString();
}

function getAnalogousColors(color, count) {
  var tinyColor = tinycolor(color);
  var analogousColors = [];
  for (var i = 1; i <= count; i++) {
    var angle = 30 * i;
    analogousColors.push(tinyColor.spin(angle).toHexString());
  }
  return analogousColors;
}

function displayColorPalette(complementary, analogousColors) {
  var paletteContainer = document.getElementById("colorPalette");
  paletteContainer.innerHTML = ""; // Clear previous palette

  var paletteTitle = document.createElement("h2");
  paletteTitle.innerText = "Color Palette:";
  paletteContainer.appendChild(paletteTitle);

  // Display complementary color
  var complementaryColorDiv = createColorBox(complementary);
  paletteContainer.appendChild(complementaryColorDiv);

  // Display analogous colors
  for (var i = 0; i < analogousColors.length; i++) {
    var analogousColorDiv = createColorBox(analogousColors[i]);
    paletteContainer.appendChild(analogousColorDiv);
  }
}

function createColorBox(color) {
  var colorBox = document.createElement("div");
  colorBox.className = "colorBox";
  colorBox.style.backgroundColor = color;

  var hexCodeText = document.createElement("p");
  hexCodeText.innerText = color.toUpperCase();
  colorBox.appendChild(hexCodeText);

  return colorBox;
}

function checkColorContrast(color) {
  var textColor = getTextColor(color);
  var contrastRatio = tinycolor.readability(color, textColor);

  var colorContrastStatus = document.getElementById("colorContrastStatus");
  if (contrastRatio >= 4.5) {
    colorContrastStatus.innerText = "Contrast: Sufficient (WCAG AA)";
    colorContrastStatus.style.color = "green";
  } else if (contrastRatio >= 3) {
    colorContrastStatus.innerText = "Contrast: Moderate (WCAG AA)";
    colorContrastStatus.style.color = "orange";
  } else {
    colorContrastStatus.innerText = "Contrast: Insufficient (WCAG AA)";
    colorContrastStatus.style.color = "red";
  }
}

function getTextColor(bgColor) {
  var tinyColor = tinycolor(bgColor);
  return tinyColor.isLight() ? "#000000" : "#FFFFFF";
}
