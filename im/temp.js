// Import photos
document.getElementById('importPhotos').addEventListener('click', function () {
    if (!currentLayout) {
        alert('Please select a layout first!');
        return;
    }

    const photoCount = parseInt(document.getElementById('photoCount').value);
    const imageSize = parseInt(document.getElementById('imageSize').value);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = (event) => {
        const files = Array.from(event.target.files).slice(0, photoCount);

        if (files.length > 0) {
            placeholder.style.display = 'none';
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'image';

                // Set initial size based on user input
                img.style.width = `${imageSize}px`;
                img.style.height = `${imageSize}px`;

                if (currentLayout === 'freestyle' || currentLayout === 'themed') {
                    img.style.position = 'absolute';
                    img.style.left = Math.random() * (collageCanvas.offsetWidth - imageSize) + 'px';
                    img.style.top = Math.random() * (collageCanvas.offsetHeight - imageSize) + 'px';
                    makeImageDraggable(img);
                }

                img.addEventListener('click', function () {
                    // Remove 'selected' class from all images
                    document.querySelectorAll('.image').forEach(i => i.classList.remove('selected'));
                    // Add 'selected' class to clicked image
                    this.classList.add('selected');

                    // Update tool values based on selected image
                    updateToolValues(this);
                });

                collageCanvas.appendChild(img);

                if (currentTemplate) {
                    applyTemplateStyle(currentTemplate);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    input.click();
});
// Image import and resize functionality
document.getElementById('importPhotos').addEventListener('click', function () {
    if (!currentLayout) {
        alert('Please select a layout first!');
        return;
    }

    const photoCount = parseInt(document.getElementById('photoCount').value);
    const imageSize = parseInt(document.getElementById('imageSize').value);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = (event) => {
        const files = Array.from(event.target.files).slice(0, photoCount);

        if (files.length > 0) {
            placeholder.style.display = 'none';
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'image';

                // Set initial size based on user input
                img.style.width = `${imageSize}px`;
                img.style.height = `${imageSize}px`;

                if (currentLayout === 'freestyle' || currentLayout === 'themed') {
                    img.style.position = 'absolute';
                    img.style.left = Math.random() * (collageCanvas.offsetWidth - imageSize) + 'px';
                    img.style.top = Math.random() * (collageCanvas.offsetHeight - imageSize) + 'px';
                    makeImageDraggable(img);
                }

                img.addEventListener('click', function () {
                    // Remove 'selected' class from all images
                    document.querySelectorAll('.image').forEach(i => i.classList.remove('selected'));
                    // Add 'selected' class to clicked image
                    this.classList.add('selected');

                    // Update tool values based on selected image
                    updateToolValues(this);
                });

                collageCanvas.appendChild(img);

                if (currentTemplate) {
                    applyTemplateStyle(currentTemplate);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    input.click();
});