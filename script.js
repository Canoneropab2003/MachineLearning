let originalImage = new Image();

document.getElementById("upload").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            originalImage.src = e.target.result;
            document.getElementById("original-img").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("apply-filter").addEventListener("click", function () {
    applyFilter();
});

document.getElementById("apply-grayscale").addEventListener("click", function () {
    applyFilter(true);
});

document.getElementById("apply-binary").addEventListener("click", function() {
    const canvas = document.getElementById("filtered-canvas");
    const ctx = canvas.getContext("2d");
    
    if (!originalImage.src) {
        alert("Please upload an image first.");
        return;
    }

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        let binaryColor = avg > 128 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = binaryColor;
    }
    
    ctx.putImageData(imageData, 0, 0);
});

document.getElementById("save").addEventListener("click", function () {
    const canvas = document.getElementById("filtered-canvas");
    const link = document.createElement("a");
    link.download = "filtered-image.png";
    link.href = canvas.toDataURL();
    link.click();
});

function applyFilter(grayscale = false) {
    if (!originalImage.src) {
        alert("Please upload an image first.");
        return;
    }

    const canvas = document.getElementById("filtered-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    ctx.drawImage(originalImage, 0, 0, originalImage.width, originalImage.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const mode = document.getElementById("filter-mode").value;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];

        if (grayscale) {
            let avg = (r + g + b) / 3;
            r = g = b = avg;
        } else {
            switch (mode) {
                case "sunset": r *= 1.2; g *= 0.8; break;
                case "lush": g *= 1.3; break;
                case "sepia": r *= 1.2; g *= 1.0; b *= 0.8; break;
                case "cool": b *= 1.3; break;
                case "neon": r *= 1.3; g *= 1.1; b *= 1.5; break;
            }
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);
}
