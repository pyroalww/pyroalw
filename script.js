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
function submitContactForm() {
    // reCAPTCHA doğrulamasını yap
    const recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
        alert("Please complete the CAPTCHA verification.");
        return;
    }

    // Forma ilişkin diğer işlemleri gerçekleştir

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


    toggleContactForm();


}
function toggleNav() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
    document.body.classList.toggle('nav-active');
}
function toggleCustomRatForm() {
    const customRatForm = document.getElementById("custom-rat-form");
    customRatForm.style.display = customRatForm.style.display === "none" ? "block" : "none";
}

function submitCustomRatOrder() {
    const ratName = document.getElementById("rat-name").value;
    const ratIconUrl = document.getElementById("rat-icon-url").value;
    const startupDialogs = document.getElementById("startup-dialogs").value;
    const ratImitation = document.getElementById("rat-imitation").value;
    const webhookAddress = document.getElementById("webhook-address").value;
    const customWebsite = document.getElementById("custom-website").checked;
    const emailAddress = document.getElementById("email-address").value;
    const optionalRequests = document.getElementById("optional-requests").value;
    const discordNickname = document.getElementById("discord-nickname").value;

    // Özet bilgileri oluştur
    const summary = `
        **Custom RAT Order Summary**
        1. RAT Name: ${ratName}
        2. RAT Icon URL: ${ratIconUrl}
        3. Optional Startup Dialogs: ${startupDialogs}
        4. What Does This RAT Imitate? ${ratImitation}
        5. Optional Private Discord Webhook Address: ${webhookAddress}
        6. Custom and Realistic Website: ${customWebsite ? 'Yes' : 'No'}
        7. Email Address for Final Version: ${emailAddress}
        8. Optional Requests: ${optionalRequests}
        9. Discord Nickname: ${discordNickname}
    `;

    // Discord Webhook'a gönder
    sendToDiscordWebhook(summary);

    // E-posta gönder
    sendEmail(emailAddress, "Custom RAT Order Summary", summary);

    // Sipariş formunu kapat
    toggleCustomRatForm();
    alert("Your order has been received. Information forwarded to pyro. If the situation is urgent and needs to be fast, you can take a screenshot of the form and send it to pyro's instagram account. (Located in the Socials tab) We wish you a good day.")
}

function sendToDiscordWebhook(message) {
    const webhookURL = "https://discord.com/api/webhooks/1202897805421576242/ChFcoUZKpolWG8urJZjq1qroLsvP4m4Z3_C6WdE8R321cZka4853ErBhJoyV4lnUuLVS";

    const payload = {
        content: message
    };

    fetch(webhookURL, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => console.log(response))
    .catch(error => console.error(error));
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
