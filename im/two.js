let currentTemplate = '';
let currentLayout = '';
const collageCanvas = document.getElementById('collageCanvas');
const placeholder = document.getElementById('placeholder');

// Layout selection
document.querySelectorAll('.layout-option').forEach(option => {
    option.addEventListener('click', function () {
        const layout = this.dataset.layout;

        // Update layout options UI
        document.querySelectorAll('.layout-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');

        // Show/hide appropriate template containers
        document.querySelectorAll('.template-container').forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById(`${layout}-templates`).classList.add('active');

        currentLayout = layout;

        // Apply layout to canvas
        collageCanvas.className = layout;

        // Reset canvas when changing layouts
        clearCanvas();
    });
});

// Template selection
document.querySelectorAll('.template-option').forEach(option => {
    option.addEventListener('click', function () {
        currentTemplate = this.dataset.template;

        // Update visual feedback
        document.querySelectorAll('.template-option').forEach(opt =>
            opt.style.border = '2px solid #ccc'
        );
        this.style.border = '2px solid #333';

        // Apply template to canvas
        applyTemplate(currentTemplate);
    });
});


// Make images draggable
function makeImageDraggable(img) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    img.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === img) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, img);
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}

function applyTemplate(template) {
    // Remove previous template classes
    collageCanvas.className = currentLayout;

    // Add template-specific class
    collageCanvas.classList.add(template);

    // Apply template-specific styles
    applyTemplateStyle(template);
}

function applyTemplateStyle(template) {
    const images = collageCanvas.querySelectorAll('.image');

    // Reset all images to default style
    images.forEach(img => {
        img.style = '';
        if (img.parentElement.classList.contains('polaroid-wrapper')) {
            img.parentElement.replaceWith(img);
        }
    });

    switch (template) {
        case 'grid-2x2':
            collageCanvas.style.gridTemplateColumns = 'repeat(2, 1fr)';
            break;
        case 'grid-3x3':
            collageCanvas.style.gridTemplateColumns = 'repeat(3, 1fr)';
            break;
        case 'love-theme':
            images.forEach(img => {
                img.style.borderRadius = '50%';
                img.style.border = '5px solid #ffcccc';
            });
            break;
        case 'polaroid':
            images.forEach(img => {
                const wrapper = document.createElement('div');
                wrapper.className = 'polaroid-wrapper';
                wrapper.style.padding = '10px';
                wrapper.style.background = 'white';
                wrapper.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
                wrapper.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
            });
            break;
        case 'travel':
            images.forEach(img => {
                img.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
                img.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
            });
            break;
    }
}

function clearCanvas() {
    while (collageCanvas.lastElementChild) {
        collageCanvas.removeChild(collageCanvas.lastElementChild);
    }
    placeholder.style.display = 'block';
    collageCanvas.className = currentLayout;
    collageCanvas.style = '';
}

// Clear canvas button
document.getElementById('clearCanvas').addEventListener('click', clearCanvas);

const history = {
    states: [],
    currentIndex: -1,
    maxStates: 10
};



// Editing tools functionality
document.getElementById('resize').addEventListener('input', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    if (selectedImage) {
        selectedImage.style.transform = `rotate(${e.target.value}deg)`;
    }
});

document.getElementById('brightness').addEventListener('input', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    if (selectedImage) {
        selectedImage.style.filter = `brightness(${100 + parseInt(e.target.value)}%)`;
    }
});
document.getElementById('zoomLevel').addEventListener('input', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    const zoom = this.value / 100;
    selectedImage.style.transform = `scale(${zoom})`;
    zoomValue.textContent = this.value + '%';

})

document.getElementById('contrast').addEventListener('input', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    if (selectedImage) {
        selectedImage.style.filter = `contrast(${100 + parseInt(e.target.value)}%)`;
    }
});

document.getElementById('border-color').addEventListener('input', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    if (selectedImage) {
        selectedImage.style.borderColor = e.target.value;
    }
});

document.getElementById('border-width').addEventListener('input', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    if (selectedImage) {
        selectedImage.style.borderWidth = `${e.target.value}px`;
        selectedImage.style.borderStyle = e.target.value === '0' ? 'none' : 'solid';
    }
});

// Stickers functionality
document.getElementById('stickers').addEventListener('change', function (e) {
    if (e.target.value) {
        const sticker = document.createElement('div');
        sticker.className = 'sticker';
        sticker.textContent = e.target.value;
        sticker.style.left = '50%';
        sticker.style.top = '50%';
        makeElementDraggable(sticker);
        collageCanvas.appendChild(sticker);
        saveState();
    }
});

// Text overlay functionality
document.getElementById('addText').addEventListener('click', function () {
    const text = document.getElementById('textOverlay').value.trim();
    if (text) {
        const textElement = document.createElement('div');
        textElement.className = 'text-overlay';
        textElement.textContent = text;
        textElement.style.left = '50%';
        textElement.style.top = '50%';
        makeElementDraggable(textElement);
        collageCanvas.appendChild(textElement);
        saveState();
    }
});

// Drawing functionality

// Make elements draggable
function makeElementDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        saveState();
    }
}

// Undo/Redo functionality
function saveState() {
    const state = collageCanvas.innerHTML;
    history.states = history.states.slice(0, history.currentIndex + 1);
    history.states.push(state);
    if (history.states.length > history.maxStates) {
        history.states.shift();
    } else {
        history.currentIndex++;
    }
    updateUndoRedoButtons();
}

document.getElementById('undo').addEventListener('click', function () {
    if (history.currentIndex > 0) {
        history.currentIndex--;
        collageCanvas.innerHTML = history.states[history.currentIndex];
        updateUndoRedoButtons();
    }
});

document.getElementById('redo').addEventListener('click', function () {
    if (history.currentIndex < history.states.length - 1) {
        history.currentIndex++;
        collageCanvas.innerHTML = history.states[history.currentIndex];
        updateUndoRedoButtons();
    }
});

function updateUndoRedoButtons() {
    document.getElementById('undo').disabled = history.currentIndex <= 0;
    document.getElementById('redo').disabled = history.currentIndex >= history.states.length - 1;
}

// Export functionality
document.getElementById('saveJPG').addEventListener('click', function () {
    exportCollage('image/jpeg');
});

document.getElementById('savePNG').addEventListener('click', function () {
    exportCollage('image/png');
});

function exportCollage(type) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match collage
    canvas.width = collageCanvas.offsetWidth;
    canvas.height = collageCanvas.offsetHeight;

    // Draw background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw collage content
    html2canvas(collageCanvas).then(function (renderedCanvas) {
        ctx.drawImage(renderedCanvas, 0, 0);

        // Trigger download
        const link = document.createElement('a');
        link.download = `collage.${type.split('/')[1]}`;
        link.href = canvas.toDataURL(type);
        link.click();
    });
}

// Help functionality
document.getElementById('viewTutorials').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Tutorials would open here');
});

document.getElementById('viewFAQ').addEventListener('click', function (e) {
    e.preventDefault();
    alert('FAQs would open here');
});

document.getElementById('contactSupport').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Support contact form would open here');
});

// Initialize
function initializeEditor() {
    // Set drawing layer size
    function updateDrawingLayerSize() {
        collageCanvas.width = collageCanvas.offsetWidth;
        collageCanvas.height = collageCanvas.offsetHeight;
    }
    updateDrawingLayerSize();
    window.addEventListener('resize', updateDrawingLayerSize);

    // Save initial state
    saveState();
}

initializeEditor();

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

                // Calculate aspect ratio of the image
                const imageAspectRatio = img.naturalWidth / img.naturalHeight;

                // Determine which dimension needs scaling based on imageAspectRatio
                let width, height;
                if (imageAspectRatio > 1) { // Wider than tall
                    width = imageSize;
                    height = imageSize / imageAspectRatio;
                } else { // Taller than wide or square
                    width = imageSize * imageAspectRatio;
                    height = imageSize;
                }

                // Set image size using calculated width and height
                img.style.width = `${width}px`;
                img.style.height = `${height}px`;

                // Ensure image fits within size while maintaining aspect ratio
                img.style.objectFit = 'contain';

                if (currentLayout === 'freestyle' || currentLayout === 'themed') {
                    img.style.position = 'absolute';
                    img.style.left = Math.random() * (collageCanvas.offsetWidth - width) + 'px';
                    img.style.top = Math.random() * (collageCanvas.offsetHeight - height) + 'px';
                    makeImageDraggable(img);
                }

                img.addEventListener('click', function () {
                    document.querySelectorAll('.image').forEach(i => i.classList.remove('selected'));
                    this.classList.add('selected');
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


// Function to update tool values based on selected image
function updateToolValues(img) {
    // Get computed styles
    const computedStyle = window.getComputedStyle(img);

    // Update resize value
    const currentWidth = parseInt(computedStyle.width);
    document.getElementById('resize').value = currentWidth;

    // Update rotate value
    const transform = computedStyle.transform;
    let rotation = 0.0;
    if (transform !== 'none') {
        const values = transform.split('(')[1].split(')')[0].split(',');
        rotation = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
        document.getElementById('rotate').value = rotation;
    }


    // Update other tool values
    document.getElementById('border-width').value = parseInt(computedStyle.borderWidth) || 0;
    document.getElementById('border-color').value = rgbToHex(computedStyle.borderColor);

    // Parse filter values
    const filters = computedStyle.filter.split(' ');
    filters.forEach(filter => {
        if (filter.includes('brightness')) {
            const brightnessValue = parseInt(filter.match(/\d+/)[0]);
            document.getElementById('brightness').value = brightnessValue - 100;
        }
        if (filter.includes('contrast')) {
            const contrastValue = parseInt(filter.match(/\d+/)[0]);
            document.getElementById('contrast').value = contrastValue - 100;
        }
    });
}

// Convert RGB to Hex for color input
function rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    const rgbArray = rgb.match(/\d+/g);
    if (!rgbArray) return '#000000';
    return '#' + rgbArray.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
}

// Resize functionality
document.getElementById('resize').addEventListener('input', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    if (selectedImage) {
        const newSize = e.target.value;
        selectedImage.style.width = `${newSize}px`;
        selectedImage.style.height = `${newSize}px`;
    }
});

// Rotate functionality
const rotateOptions = document.getElementById('rotate');
rotateOptions.addEventListener('change', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    if (selectedImage) {
        selectedImage.style.transform = `rotate(${e.target.value}deg)`;
    }
});

// Brightness functionality
document.getElementById('brightness').addEventListener('input', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    if (selectedImage) {
        const brightnessValue = 100 + parseInt(e.target.value);
        const currentFilters = selectedImage.style.filter.split(' ').filter(f => !f.includes('brightness'));
        currentFilters.push(`brightness(${brightnessValue}%)`);
        selectedImage.style.filter = currentFilters.join(' ');
    }
});

// Contrast functionality
document.getElementById('contrast').addEventListener('input', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    if (selectedImage) {
        const contrastValue = 100 + parseInt(e.target.value);
        const currentFilters = selectedImage.style.filter.split(' ').filter(f => !f.includes('contrast'));
        currentFilters.push(`contrast(${contrastValue}%)`);
        selectedImage.style.filter = currentFilters.join(' ');
    }
});

// Border functionality
document.getElementById('border-color').addEventListener('input', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    if (selectedImage) {
        selectedImage.style.borderColor = e.target.value;
    }
});

document.getElementById('border-width').addEventListener('input', function (e) {
    const selectedImage = collageCanvas.querySelector('.selected');
    if (selectedImage) {
        const width = e.target.value;
        selectedImage.style.borderWidth = `${width}px`;
        selectedImage.style.borderStyle = width === '0' ? 'none' : 'solid';
    }
});

// Export functionality
document.getElementById('saveJPG').addEventListener('click', () => saveCollage('image/jpeg'));
document.getElementById('savePNG').addEventListener('click', () => saveCollage('image/png'));

function saveCollage(type) {
    html2canvas(collageCanvas, {
        backgroundColor: '#ffffff', // Ensures background is white
        scale: 2 // Higher scale for better resolution
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `collage.${type.split('/')[1]}`;
        link.href = canvas.toDataURL(type, 1.0);
        link.click();
    });
}



// Social media sharing
document.getElementById('shareCollage').addEventListener('click', function () {
    html2canvas(collageCanvas).then(canvas => {
        canvas.toBlob(function (blob) {
            const filesArray = [
                new File(
                    [blob],
                    'collage.png',
                    { type: 'image/png', lastModified: new Date().getTime() }
                )
            ];

            if (navigator.share && navigator.canShare({ files: filesArray })) {
                navigator.share({
                    files: filesArray,
                    title: 'My Collage',
                    text: 'Check out my collage!'
                }).then(() => console.log('Share was successful.'))
                    .catch((error) => console.log('Sharing failed', error));
            } else {
                // Fallback for browsers that don't support Web Share API
                const shareDialog = document.createElement('div');
                shareDialog.className = 'share-dialog';
                shareDialog.innerHTML = `
                <h3>Share on Social Media</h3>
                <p>Right-click the image below and choose "Save image" to download, then share on your preferred platform:</p>
                <img src="${canvas.toDataURL()}" alt="Collage" style="max-width: 100%;">
                <button onclick="this.parentElement.remove()">Close</button>
            `;
                document.body.appendChild(shareDialog);
            }
        });
    });
})

document.addEventListener('DOMContentLoaded', function () {
    const collageCanvas = document.getElementById('collageCanvas');
    const previewCanvas = document.getElementById('previewCanvas');
    const previewCtx = previewCanvas.getContext('2d');

    // Initialize drawing layer


    // Image size control
    // Select the DOM elements
    function initializeImageHandling() {
        // Global variable to track selected image
        let selectedImage = null;

        // Add click handler to all images
        document.addEventListener('click', function (e) {
            if (e.target.classList.contains('image')) {
                // Remove selection from all images
                document.querySelectorAll('.image').forEach(img => img.classList.remove('selected'));
                // Select clicked image
                e.target.classList.add('selected');
                selectedImage = e.target;
                updateToolValues(selectedImage);
            }
        });

        // Image size slider
        const imageSizeSlider = document.getElementById('imageSize');
        const imageSizeValue = document.getElementById('imageSizeValue');

        imageSizeSlider.addEventListener('input', function () {
            if (selectedImage) {
                const size = this.value;
                selectedImage.style.width = `${size}px`;
                selectedImage.style.height = `${size}px`;
                imageSizeValue.textContent = `${size}px`;
                updatePreview();
            }
        });
        //function to select image
        function selectImage(img) {
            if (selectedImage) {
                selectedImage.classList.remove('selected');
            }
            selectedImage = img;
            selectedImage.classList.add('selected');
        }
        // Zoom slider
        const zoomSlider = document.getElementById('zoomLevel');
        const zoomValue = document.getElementById('zoomValue');

        // zoomSlider.addEventListener('input', function () {
        //     if (selectedImage) {
        //         const zoom = this.value / 100;
        //         // Preserve any existing rotation
        //         const currentRotation = selectedImage.style.transform.match(/rotate\(([^)]+)\)/) || ['', '0deg'];
        //         selectedImage.style.transform = `scale(${zoom}) ${currentRotation[0]}`;
        //         zoomValue.textContent = `${this.value}%`;
        //         updatePreview();
        //     }
        // });
        zoomSlider.addEventListener('input', function () {
            if (selectedImage) {
                const zoom = this.value / 100;
                selectedImage.style.transform = `scale(${zoom})`;
                zoomValue.textContent = this.value + '%';
            }
        });
    }

    // Fix for save functionality
    document.getElementById('saveJPG').addEventListener('click', () => saveCollage('image/jpeg'));
    document.getElementById('savePNG').addEventListener('click', () => saveCollage('image/png'));

    function saveCollage(type) {
        const collageCanvas = document.getElementById('collageCanvas'); // Make sure this is correctly defined

        if (!collageCanvas) {
            console.error('Collage canvas not found!');
            return;
        }

        html2canvas(collageCanvas, {
            backgroundColor: '#ffffff',


        }).then((canvas) => {
            const link = document.createElement('a');
            link.download = `collage.${type.split('/')[1]}`;
            link.href = canvas.toDataURL(type, 1.0);
            document.body.appendChild(link); // Append to body for Firefox compatibility
            link.click();
            alert(link);
            document.body.removeChild(link); // Clean up after clicking
        }).catch((error) => {
            console.error('Error capturing collage:', error);
        });
    }


    // Fix for real-time preview
    function initializePreview() {
        const previewCanvas = document.getElementById('previewCanvas');
        const collageCanvas = document.getElementById('collageCanvas');

        function updatePreview() {
            // Set preview canvas size to match collage canvas
            previewCanvas.width = collageCanvas.offsetWidth;
            previewCanvas.height = collageCanvas.offsetHeight;

            html2canvas(collageCanvas, {
                backgroundColor: '#ffffff',
                scale: 1,
                logging: false,
                useCORS: true
            }).then(canvas => {
                const ctx = previewCanvas.getContext('2d');
                ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
                ctx.drawImage(canvas, 0, 0);
            }).catch(error => {
                console.error('Error updating preview:', error);
            });
        }

        // Create observer for real-time updates
        const observer = new MutationObserver(updatePreview);
        observer.observe(collageCanvas, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        });

        // Make updatePreview available globally
        window.updatePreview = updatePreview;

        // Initial preview
        updatePreview();
    }

    // Initialize everything when the DOM is loaded
    document.addEventListener('DOMContentLoaded', function () {
        initializeImageHandling();
        initializeSaveButtons();
        initializePreview();
    });


    // Initialize canvas sizes
    function initializeCanvases() {
        const updateCanvasSizes = () => {
            drawingLayer.width = collageCanvas.offsetWidth;
            drawingLayer.height = collageCanvas.offsetHeight;
            previewCanvas.width = collageCanvas.offsetWidth;
            previewCanvas.height = collageCanvas.offsetHeight;
        };

        updateCanvasSizes();
        window.addEventListener('resize', updateCanvasSizes);
    }

    initializeCanvases();
    updatePreview();

    // Update preview when images are added or modified
    const observer = new MutationObserver(updatePreview);
    observer.observe(collageCanvas, {
        childList: true,
        subtree: true,
        attributes: true
    });
});