// *** NOTE: You need to manually update this array with your image filenames ***
// Example: ['32D.jpg', 'another_image.png', 'yet_another.gif']
const imageFiles = ['28B.png', '30C.png', '32D.png', '34E.png', '36F.png', '38G.png']; // Add your image filenames here

const buttonPanel = document.getElementById('button-panel');
const mainImage = document.getElementById('main-image');
let currentImage = null;

// Add an event listener to remove the giggle class after the animation ends
mainImage.addEventListener('animationend', () => {
    mainImage.classList.remove('giggle');
});

// Function to display an image
function displayImage(filename) {
    if (currentImage === filename) {
        return; // Do nothing if the same image is clicked
    }

    // Remove giggle class before changing src to allow animation to re-trigger
    mainImage.classList.remove('giggle');

    // Set the new image source
    mainImage.src = `imgs/${filename}`;
    currentImage = filename;

    // Preload the image before triggering the animation
    const img = new Image();
    img.src = `imgs/${filename}`;
    img.onload = () => {
        mainImage.classList.add('giggle');
        // Update page title for better mobile experience
        document.title = `${filename.split('.')[0]} - Image Viewer`;
    };

    // Handle potential error loading image
    mainImage.onerror = () => {
        console.error(`Error loading image: imgs/${filename}`);
        mainImage.alt = 'Error loading image';
        document.title = 'Error - Image Viewer';
    };

    // Update active button
    const buttons = buttonPanel.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.getAttribute('data-filename') === filename) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Function to create buttons with improved touch handling
function createButtons() {
    buttonPanel.innerHTML = ''; // Clear existing buttons

    imageFiles.forEach(filename => {
        const button = document.createElement('button');
        const imageName = filename.split('.')[0];
        button.textContent = imageName;
        button.setAttribute('data-filename', filename);
        
        // Add touch events for better mobile interaction
        button.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent double-firing on mobile devices
            displayImage(filename);
        }, { passive: false });
        
        button.addEventListener('click', (e) => {
            if (e.pointerType !== 'touch') { // Only handle non-touch clicks
                displayImage(filename);
            }
        });
        
        buttonPanel.appendChild(button);
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    createButtons();

    // Display the default image (32D.jpg) if it exists in the list
    if (imageFiles.includes('32D.png')) {
        displayImage('32D.png');
    } else if (imageFiles.length > 0) {
        // Display the first image if 32D.jpg is not found
        displayImage(imageFiles[0]);
    } else {
        // Handle case with no images
        mainImage.src = ''; // Clear image source
        mainImage.alt = 'No images found.';
        buttonPanel.innerHTML = '<p>No images available.</p>';
    }
});