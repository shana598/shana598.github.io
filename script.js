
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    const setTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        const nextTheme = theme === "dark" ? "light" : "dark";
        const label = `Switch to ${nextTheme} mode`;
        themeToggle.setAttribute("aria-label", label);
        themeToggle.title = label;

        try {
            localStorage.setItem("theme", theme);
        } catch {}
    };

    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    themeToggle.addEventListener("click", () => {
        setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    const submitButton = document.getElementById("submit-button");
    const submitButtonLabel = document.getElementById("submit-button-label");
    const formStatus = document.getElementById("form-status");
    const honeypot = contactForm.elements.namedItem("_gotcha");
    const validationFields = ["name", "email", "phone", "message"].map((fieldName) =>
        document.getElementById(fieldName),
    );
    let hasAttemptedSubmit = false;
    let isSubmitting = false;

    const setStatus = (message, state) => {
        formStatus.textContent = message;
        if (message) {
            formStatus.dataset.state = state;
        } else {
            delete formStatus.dataset.state;
        }
    };

    const validateField = (field) => {
        const value = field.value.trim();
        let message = "";

        if (field.id === "name" && value.length < 2) {
            message = value ? "Please enter at least 2 characters." : "Please enter your full name.";
        } else if (field.id === "email") {
            if (!value) {
                message = "Please enter your email address.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
                message = "Please enter a valid email address.";
            }
        } else if (field.id === "phone") {
            const digits = value.replace(/\D/g, "").length;
            if (!value) {
                message = "Please enter your phone number.";
            } else if (!/^\+?[\d\s().-]+$/.test(value) || digits < 7 || digits > 15) {
                message = "Please enter a valid phone number, including country code if needed.";
            }
        } else if (field.id === "message") {
            message = value.length < 10 ? "Please enter a message of at least 10 characters." : "";
        }

        const errorElement = document.getElementById(`${field.id}-error`);
        field.setAttribute("aria-invalid", String(Boolean(message)));
        errorElement.textContent = message;
        errorElement.classList.toggle("is-visible", Boolean(message));
        return !message;
    };

    validationFields.forEach((field) => {
        field.addEventListener("input", () => {
            if (hasAttemptedSubmit || field.getAttribute("aria-invalid") === "true") {
                validateField(field);
            }
            if (formStatus.textContent) {
                setStatus("", "");
            }
        });

        field.addEventListener("blur", () => {
            if (hasAttemptedSubmit) {
                validateField(field);
            }
        });
    });

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (isSubmitting || (honeypot && honeypot.value)) {
            return;
        }

        hasAttemptedSubmit = true;
        const invalidFields = validationFields.filter((field) => !validateField(field));
        if (invalidFields.length) {
            invalidFields[0].focus();
            return;
        }

        validationFields.forEach((field) => {
            field.value = field.value.trim();
        });
        document.getElementById("subject").value = document.getElementById("subject").value.trim();

        isSubmitting = true;
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
        submitButtonLabel.textContent = "Sending...";
        contactForm.setAttribute("aria-busy", "true");
        setStatus("", "");

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: { Accept: "application/json" },
            });

            if (!response.ok) {
                throw new Error("Form submission failed");
            }

            contactForm.reset();
            validationFields.forEach((field) => {
                field.setAttribute("aria-invalid", "false");
                const errorElement = document.getElementById(`${field.id}-error`);
                errorElement.textContent = "";
                errorElement.classList.remove("is-visible");
            });
            hasAttemptedSubmit = false;
            setStatus("Message sent successfully! I'll get back to you soon.", "success");
        } catch {
            setStatus("Something went wrong. Please try again or contact me directly.", "error");
        } finally {
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");
            submitButtonLabel.textContent = "Send Message";
            contactForm.removeAttribute("aria-busy");
        }
    });
}



// Create particle effect
        const particlesContainer = document.getElementById('particles-container');
        const particleCount = 80;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            createParticle();
        }
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size (small)
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Initial position
            resetParticle(particle);
            
            particlesContainer.appendChild(particle);
            
            // Animate
            animateParticle(particle);
        }
        
        function resetParticle(particle) {
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = '0';
            
            return {
                x: posX,
                y: posY
            };
        }
        
        function animateParticle(particle) {
            // Initial position
            const pos = resetParticle(particle);
            
            // Random animation properties
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            
            // Animate with GSAP-like timing
            setTimeout(() => {
                particle.style.transition = `all ${duration}s linear`;
                particle.style.opacity = Math.random() * 0.3 + 0.1;
                
                // Move in a slight direction
                const moveX = pos.x + (Math.random() * 20 - 10);
                const moveY = pos.y - Math.random() * 30; // Move upwards
                
                particle.style.left = `${moveX}%`;
                particle.style.top = `${moveY}%`;
                
                // Reset after animation completes
                setTimeout(() => {
                    animateParticle(particle);
                }, duration * 1000);
            }, delay * 1000);
        }
        
        // Mouse interaction
        document.addEventListener('mousemove', (e) => {
            // Create particles at mouse position
            const mouseX = (e.clientX / window.innerWidth) * 100;
            const mouseY = (e.clientY / window.innerHeight) * 100;
            
            // Create temporary particle
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Small size
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Position at mouse
            particle.style.left = `${mouseX}%`;
            particle.style.top = `${mouseY}%`;
            particle.style.opacity = '0.6';
            
            particlesContainer.appendChild(particle);
            
            // Animate outward
            setTimeout(() => {
                particle.style.transition = 'all 2s ease-out';
                particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
                particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
                particle.style.opacity = '0';
                
                // Remove after animation
                setTimeout(() => {
                    particle.remove();
                }, 2000);
            }, 10);
            
            // Subtle movement of gradient spheres
            const spheres = document.querySelectorAll('.gradient-sphere');
            const moveX = (e.clientX / window.innerWidth - 0.5) * 5;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 5;
            
            spheres.forEach(sphere => {
                const currentTransform = getComputedStyle(sphere).transform;
                sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });



            function openDesign(imgSrc) {
                document.getElementById("project-list-section").style.display = "none";

                const detailView = document.getElementById("full-design-view");
                detailView.style.display = "block";

                const designDisplayImg = document.getElementById("design-display-img");
                if (imgSrc === "./img/FOOD APP.svg") {
                    designDisplayImg.classList.add("food-app-preview");
                } else {
                    designDisplayImg.classList.remove("food-app-preview");
                }
                designDisplayImg.src = imgSrc;

                window.scrollTo(0, 0);
            }

            function closeDesign() {
                document.getElementById("full-design-view").style.display = "none";
                document.getElementById("design-display-img").classList.remove("food-app-preview");
                document.getElementById("project-list-section").style.display = "block";
            }




            const downloadBtn = document.getElementById('dl-btn');
            const btnText = downloadBtn.querySelector('.btn-text');

          downloadBtn.addEventListener('click', function(e) {
    // PDF open aakan swalpam thamasippikan class add cheyyunnu
    this.classList.add('active');
    btnText.innerText = "Downloading...";

    setTimeout(() => {
        btnText.innerText = "Done!";
        // 2.5 second kazhiyumpol animation reset aakan
        setTimeout(() => {
            this.classList.remove('active');
            btnText.innerText = "Download CV";
        }, 2000);
    }, 2000);
});
       