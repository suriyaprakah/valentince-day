// --- 3D SCENE SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#webgl'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); // White Background

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xff4d6d, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Create 3D Heart Shape
const x = 0, y = 0;
const heartShape = new THREE.Shape();
heartShape.moveTo( x + 5, y + 5 );
heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

const geometry = new THREE.ExtrudeGeometry(heartShape, { depth: 2, bevelEnabled: true, bevelThickness: 1, bevelSize: 1 });
const material = new THREE.MeshStandardMaterial({ color: 0xff4d6d, roughness: 0.1, metalness: 0.5 });
const heartMesh = new THREE.Mesh(geometry, material);
heartMesh.scale.set(0.1, 0.1, 0.1);
heartMesh.rotation.z = Math.PI; // Flip heart correctly
scene.add(heartMesh);

camera.position.z = 5;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    heartMesh.rotation.y += 0.01;
    // Beating Effect
    const scale = 0.1 + Math.sin(Date.now() * 0.005) * 0.01;
    heartMesh.scale.set(scale, scale, scale);
    renderer.render(scene, camera);
}
animate();

// --- INTERACTIVE LOGIC ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(heartMesh);

    if (intersects.length > 0) {
        gsap.to(heartMesh.position, { y: 10, duration: 1 }); // Heart flies up
        document.getElementById('intro-text').style.display = 'none';
        goToEpisode(1);
        toggleMusic(); // Play music on interaction
    }
});

function goToEpisode(nr) {
    gsap.to(".card", { opacity: 0, y: 20, display: "none", duration: 0.5 });
    setTimeout(() => {
        const activeCard = document.getElementById('ep' + nr);
        activeCard.style.display = "block";
        gsap.to(activeCard, { opacity: 1, y: 0, duration: 0.8 });
        
        if (nr === 1) typeWriter("our love started at july-8-2023,Since the day our first met at feb-10-2024,and more our first trip at jun-7-2024. You are the piece I never knew I was missing, لستِ حبي الأول، لكنكِ ستكونين حبي الأخير.", "type-1");
    }, 600);
}

function typeWriter(text, id) {
    let i = 0;
    const el = document.getElementById(id);
    el.innerHTML = "";
    function type() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    type();
}

function runAway() {
    const btn = document.getElementById('no');
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    btn.style.position = 'fixed';
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
}

function celebrate() {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    document.getElementById('ep3').innerHTML = "<h1 class='title'>I Love You! ❤️</h1><p>Best Valentine's Day Ever!</p>";
}

function toggleMusic() {
    const music = document.getElementById('bgMusic');
    if (music.paused) music.play();
    else music.pause();
}