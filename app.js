// 3D Scene Setup
const setupHero3D = () => {
    try {
        const canvas = document.createElement('canvas');
        const container = document.getElementById('hero3D');
        if (!container) {
            console.error('Hero 3D container not found');
            return;
        }
        container.appendChild(canvas);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth / 2, window.innerHeight);
        camera.position.z = 5;

        // Create multiple geometric shapes
        const shapes = [];
        
        // TorusKnot
        const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const torusKnotMaterial = new THREE.MeshNormalMaterial();
        const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
        torusKnot.position.x = -2;
        shapes.push(torusKnot);
        scene.add(torusKnot);

        // Icosahedron
        const icosahedronGeometry = new THREE.IcosahedronGeometry(0.75, 0);
        const icosahedronMaterial = new THREE.MeshNormalMaterial();
        const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
        icosahedron.position.x = 2;
        shapes.push(icosahedron);
        scene.add(icosahedron);

        // Octahedron
        const octahedronGeometry = new THREE.OctahedronGeometry(0.75);
        const octahedronMaterial = new THREE.MeshNormalMaterial();
        const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
        octahedron.position.y = 2;
        shapes.push(octahedron);
        scene.add(octahedron);

        const animate = () => {
            requestAnimationFrame(animate);
            
            shapes.forEach((shape, index) => {
                shape.rotation.x += 0.01 * (index + 1);
                shape.rotation.y += 0.01 * (index + 1);
            });

            renderer.render(scene, camera);
        };

        animate();

        // Add mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            
            shapes.forEach((shape) => {
                shape.rotation.x += mouseY * 0.01;
                shape.rotation.y += mouseX * 0.01;
            });
        });

        window.addEventListener('resize', () => {
            const width = window.innerWidth / 2;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
    } catch (error) {
        console.error('Error setting up 3D scene:', error);
    }
};

// Chatbot Implementation
class WikipediaChatbot {
    constructor() {
        this.apiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
        this.setupEventListeners();
        this.addMessage("Hello! I'm your Wikipedia-powered assistant. Ask me anything, and I'll fetch information for you!", false);
    }

    async fetchSummary(query) {
        if (!query || !query.trim()) {
            return "Please enter a valid query.";
        }

        const url = `${this.apiUrl}${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();

                if (data.extract) {
                    return `<b>${data.title}</b><br>${data.extract}<br><a href='${data.content_urls.desktop.page}' target='_blank'>Read more on Wikipedia</a>`;
                } else {
                    return "I couldn't find any information on that topic.";
                }
            } else {
                return "I'm having trouble fetching data right now. Please try again later.";
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
            return "An error occurred while fetching the data. Please try again.";
        }
    }

    addMessage(message, isUser = false) {
        if (!message) return;

        try {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
            messageDiv.innerHTML = message;

            const chatMessages = document.getElementById('chatMessages');
            if (!chatMessages) {
                throw new Error('Chat messages container not found');
            }

            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } catch (error) {
            console.error('Error adding message:', error);
        }
    }

    setupEventListeners() {
        try {
            const sendButton = document.getElementById('sendMessage');
            const input = document.getElementById('userInput');
            const toggleButton = document.getElementById('toggleChat');
            const chatbot = document.getElementById('chatbot');

            if (!sendButton || !input || !toggleButton || !chatbot) {
                throw new Error('Required chatbot elements not found');
            }

            const handleSendMessage = async () => {
                const userMessage = input.value.trim();
                if (userMessage) {
                    this.addMessage(userMessage, true);
                    input.value = '';

                    const botResponse = await this.fetchSummary(userMessage);
                    this.addMessage(botResponse, false);
                }
            };

            sendButton.addEventListener('click', handleSendMessage);

            input.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    await handleSendMessage();
                }
            });

            toggleButton.addEventListener('click', () => {
                chatbot.classList.toggle('minimized');
            });
        } catch (error) {
            console.error('Error setting up chatbot event listeners:', error);
        }
    }
}

// Smooth Scroll Implementation
const setupSmoothScroll = () => {
    try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href')?.slice(1);
                if (targetId) {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error setting up smooth scroll:', error);
    }
};

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        setupHero3D();
        setupSmoothScroll();
        
        const chatbot = new WikipediaChatbot();

        // Add intersection observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        });

        document.querySelectorAll('.card').forEach((el) => observer.observe(el));
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});
