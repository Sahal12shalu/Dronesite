import { animate, scroll, inView } from "https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm";

// --- 1. Starfield Particles ---
const starsContainer = document.getElementById("stars-container");
for (let i = 0; i < 150; i++) {
  const star = document.createElement("div");
  const size = Math.random() * 3;
  star.style.position = "absolute";
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.background = "white";
  star.style.left = `${Math.random() * 100}vw`;
  star.style.top = `${Math.random() * 200}vh`; // span the entire 200vh height
  star.style.borderRadius = "50%";
  star.style.opacity = Math.random();
  starsContainer.appendChild(star);
}

// Parallax the stars slightly on scroll via Framer Motion
scroll(
  animate(starsContainer, { y: ["0vh", "-30vh"] }),
  { target: document.getElementById("hero"), offset: ["start start", "end start"] }
);

// --- 2. Canvas Image Sequence Loader (Apple Style) ---
const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

// Set canvas bounds to FHD, CSS object-fit scales it perfectly
canvas.width = 1920;  
canvas.height = 1080;

const frameCount = 240;
const images = [];
let imagesLoaded = 0;

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  const indexStr = i.toString().padStart(3, '0');
  img.src = `images/drone/ezgif-frame-${indexStr}.png`;
  
  img.onload = () => {
    imagesLoaded++;
    // Draw the very first frame reliably
    if (i === 1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };
  
  images.push(img);
}

// Scrub logic: Calculate manual scroll progress to paint canvas
window.addEventListener("scroll", () => {
  const hero = document.getElementById("hero");
  // Calculate how far we've scrolled inside the 200vh hero
  const maxScroll = hero.offsetHeight - window.innerHeight;
  const currentScroll = window.scrollY - hero.offsetTop;
  
  let progress = currentScroll / maxScroll;
  if (progress < 0) progress = 0;
  if (progress > 1) progress = 1;
  
  const frameIndex = Math.floor(progress * (frameCount - 1));
  
  if (images[frameIndex] && images[frameIndex].complete) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
  }
});


// --- 3. Framer Motion Scroll Texts (Hero) ---
// Sequence 1: 0% to 33% (Fades out)
scroll(
  animate("#screen-1", { 
    opacity: [1, 1, 0],
    y: [0, -50, -100] // subtle upward float as it fades
  }),
  { target: document.getElementById("hero"), offset: ["start start", "33% start"] }
);

// Sequence 2: internal split view (fades in at 33%, out at 66%)
scroll(
  animate("#screen-2", { 
    opacity: [0, 1, 1, 0],
    scale: [0.9, 1, 1, 1.1]
  }),
  { target: document.getElementById("hero"), offset: ["20% start", "80% start"] }
);

// Sequence 3: reassemble view (fades in at 66%)
scroll(
  animate("#screen-3", { 
    opacity: [0, 1, 1],
    y: [50, 0, 0]
  }),
  { target: document.getElementById("hero"), offset: ["66% start", "end start"] }
);


// --- 4. Framer Motion Element Reveal Animations ---

// Slide left features
inView(".fm-slide-left", (info) => {
  animate(info.target, { 
    x: [-100, 0], 
    opacity: [0, 1] 
  }, { 
    duration: 0.8, 
    easing: "easeOut" 
  });
});

// Fade Up blocks
document.querySelectorAll(".fm-fade-up").forEach((el, i) => {
  inView(el, (info) => {
    animate(info.target, { 
      y: [60, 0], 
      opacity: [0, 1] 
    }, { 
      duration: 0.8, 
      delay: i * 0.1, // staggering
      easing: "easeOut" 
    });
  });
});

// Zoom In features
inView(".fm-zoom-in", (info) => {
  animate(info.target, { 
    scale: [0.8, 1], 
    opacity: [0, 1] 
  }, { 
    duration: 0.8, 
    easing: "easeOut" 
  });
});

// Continual Float
document.querySelectorAll(".fm-float").forEach(el => {
  animate(el, {
    y: [-15, 15]
  }, {
    duration: 2.5,
    repeat: Infinity,
    direction: "alternate",
    easing: "easeInOut"
  });
});
