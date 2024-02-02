function addToCart(productName, price) {

    window.location.href = `mailto:shop@pyroalw.xyz?subject=Product Order&body=Product: ${productName}%0D%0APrice: $${price}`;
}
function openProjectLink(link) {
    window.location.href = "https://github.com/pyroalww";
}
document.addEventListener("DOMContentLoaded", function() {
    showSection("who-am-i"); 
});

function redirectToInstagram() {
    window.location.href = "https://www.instagram.com/c4gwn";
}

function activateCode() {
    const activationCode = document.getElementById("activation-code").value;
    const loadingOverlay = document.getElementById("loading-overlay");


    loadingOverlay.style.display = "flex";

  
    setTimeout(() => {

        loadingOverlay.style.display = "none";


        if (isValidCode(activationCode)) {
            window.location.href = "https://github.com/pyroalww";
        } else {

            alert("Invalid activation code. Please try again.");
        }
    }, 2000);
}
function fillProjects() {



    const projectsContainer = document.getElementById("projects");
    projectsContainer.innerHTML = "";

    projects.forEach(project => {
        const projectElement = document.createElement("div");
        projectElement.classList.add("project");
        projectElement.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        `;
        projectElement.addEventListener("click", () => openProjectLink(project.link));

        projectsContainer.appendChild(projectElement);
    });
}
function isValidCode(code) {

    return code === "O3EJL-64H26-8P1CW-J3N00";
}
function toggleContactForm() {
    const contactForm = document.getElementById("contact-form");
    contactForm.style.display = contactForm.style.display === "block" ? "none" : "block";
}

function sendDiscordMessage() {
    const message = document.querySelector("#contact-form textarea").value;
    const name = document.querySelector("#contact-form input:nth-of-type(1)").value;
    const surname = document.querySelector("#contact-form input:nth-of-type(2)").value;

    const webhookURL = "https://discord.com/api/webhooks/1202897805421576242/ChFcoUZKpolWG8urJZjq1qroLsvP4m4Z3_C6WdE8R321cZka4853ErBhJoyV4lnUuLVS";

    const payload = {
        content: `${name} ${surname} sent a message:\n${message}`
    };

    fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    // Mesaj gönderildikten sonra formu kapat
    toggleContactForm();
}
function showSection(sectionId) {
    const sections = document.querySelectorAll(".content-section");
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = "translateY(20px)";
        section.style.display = "none";
    });

    const currentSection = document.getElementById(sectionId);
    currentSection.style.display = "block";


    setTimeout(() => {
        currentSection.style.opacity = 1;
        currentSection.style.transform = "translateY(0)";
    }, 50);


    updateColors(sectionId);
}
function updateColors(sectionId) {
    const body = document.body;
    const header = document.querySelector("header");

    switch (sectionId) {
        case "who-am-i":
            body.style.backgroundColor = "#35424a";
            header.style.backgroundColor = "#282c34";
            break;
        case "projects":
            body.style.backgroundColor = "#4a525a";
            header.style.backgroundColor = "#3c424a";
            break;
        case "shop":
            body.style.backgroundColor = "#2d3a4d";
            header.style.backgroundColor = "#1f2a3a";
            break;
        case "socials":
            body.style.backgroundColor = "#424242";
            header.style.backgroundColor = "#353535";
            break;
        case "contact":
            body.style.backgroundColor = "#333333";
            header.style.backgroundColor = "#282828";
            break;
        case "code-activation":
            body.style.backgroundColor = "#161b22";
            header.style.backgroundColor = "#12171d";
            break;
        default:
            break;
    }
}