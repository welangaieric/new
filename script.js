// Global variables
let currentTestimonialIndex = 0;
const testimonials = document.querySelectorAll(".testimonial-card");
const testimonialDots = document.querySelectorAll(".testimonial-dots .dot");
let locations = [];
const serverURL = "https://server.konnektsmartlife.com";

async function getLocations() {
  try {
    const res = await fetch(`${serverURL}/api/locations`);
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    const data = await res.json();
    locations = data;
    // console.log(locations);
    return data;
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
}

locations = getLocations().then((data) => populateLocations(data));
// console.log("Locations", locations);
function populateLocations(data) {
  const locationsDisplay = document.querySelector(".coverage-areas");
  if (locationsDisplay) {
    let filtered = data.slice(0, 18);
    filtered.forEach((location) => {
      // console.log(location);
      const template = `  <div class="area-item">
                <div class="area-dot"></div>
                <span>${location.name}</span>
              </div>`;
      locationsDisplay.innerHTML += template;
    });
  }
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
  setupNavigation();
  setupScrollAnimations();
  setupCounters();
  setupTabs();
  setupTestimonials();
  setupForms();
  setupScrollToTop();
  setupModals();
  setupFAQ();
  // initThreeNetwork() // Three.js is now initialized directly from three-network.js
}

// Navigation functionality
function setupNavigation() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Smooth scrolling for navigation links
  // navLinks.forEach((link) => {
  //   link.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     const targetId = link.getAttribute("href");
  //     const targetSection = document.querySelector(targetId);
  //     if (targetSection) {
  //       targetSection.scrollIntoView({
  //         behavior: "smooth",
  //         block: "start",
  //       });
  //     }
  //   });
  // });
}

// Scroll animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll(
    ".fade-in-up, .fade-in-left, .fade-in-right, .animate-on-scroll"
  );
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
}

// Animated counters
function setupCounters() {
  const counters = document.querySelectorAll(".stat-number");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
}

function animateCounter(element) {
  const target = Number.parseFloat(element.getAttribute("data-target"));
  const duration = 2000;
  const isDecimal = element.textContent.includes("."); // Check if it's a decimal number like 99.9%
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = isDecimal
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString();
  }, 16);
}

// Tabs functionality
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      document.getElementById(targetTab + "-tab").classList.add("active");
    });
  });
}

// Testimonials slider
function setupTestimonials() {
  if (testimonials.length === 0) return;

  // Auto-rotate testimonials
  setInterval(() => {
    currentTestimonialIndex =
      (currentTestimonialIndex + 1) % testimonials.length;
    showTestimonial(currentTestimonialIndex);
  }, 5000);
}

function currentTestimonial(index) {
  currentTestimonialIndex = index - 1;
  showTestimonial(currentTestimonialIndex);
}

function showTestimonial(index) {
  // Hide all testimonials
  testimonials.forEach((testimonial) => {
    testimonial.classList.remove("active");
  });

  // Remove active class from all dots
  testimonialDots.forEach((dot) => {
    dot.classList.remove("active");
  });

  // Show current testimonial
  if (testimonials[index]) {
    testimonials[index].classList.add("active");
  }

  // Activate current dot
  if (testimonialDots[index]) {
    testimonialDots[index].classList.add("active");
  }
}

// Form handling
function setupForms() {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", handleFormSubmit);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  // Validate form
  if (!validateForm(form)) {
    return;
  }

  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.classList.add("loading");
  submitButton.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    // Hide loading state
    submitButton.classList.remove("loading");
    submitButton.disabled = false;

    // Show success message
    showMessage(
      "success",
      "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours."
    );

    // Reset form
    form.reset();
    clearFormErrors(form);

    // Close modal if form is in modal
    const modal = form.closest(".modal");
    if (modal) {
      closeModal(modal.id);
    }
  }, 2000);
}

function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll("[required]");

  // Clear previous errors
  clearFormErrors(form);

  requiredFields.forEach((field) => {
    const value = field.value.trim();
    const fieldGroup = field.closest(".form-group");
    const errorMessage = fieldGroup.querySelector(".error-message");

    if (!value) {
      showFieldError(fieldGroup, errorMessage, "This field is required");
      isValid = false;
    } else if (field.type === "email" && !isValidEmail(value)) {
      showFieldError(
        fieldGroup,
        errorMessage,
        "Please enter a valid email address"
      );
      isValid = false;
    } else if (field.type === "tel" && !isValidPhone(value)) {
      showFieldError(
        fieldGroup,
        errorMessage,
        "Please enter a valid phone number"
      );
      isValid = false;
    } else if (field.type === "date" && new Date(value) < new Date()) {
      showFieldError(fieldGroup, errorMessage, "Please select a future date");
      isValid = false;
    }
  });

  return isValid;
}

function showFieldError(fieldGroup, errorMessage, message) {
  fieldGroup.classList.add("error");
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
}

function clearFormErrors(form) {
  const errorGroups = form.querySelectorAll(".form-group.error");
  const errorMessages = form.querySelectorAll(".error-message.show");

  errorGroups.forEach((group) => group.classList.remove("error"));
  errorMessages.forEach((message) => {
    message.classList.remove("show");
    message.textContent = "";
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[+]?[0-9\s\-$$$$]{10,}$/;
  return phoneRegex.test(phone);
}

// Scroll to top functionality
function setupScrollToTop() {
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Modal functionality
function setupModals() {
  const modals = document.querySelectorAll(".modal");

  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModal = document.querySelector(".modal.show");
      if (openModal) {
        closeModal(openModal.id);
      }
    }
  });
}

function openModal(modalId, ...args) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Populate modal content based on type
  if (modalId === "package-modal" && args.length >= 2) {
    populatePackageModal(args[0], args[1]);
  } else if (modalId === "service-modal" && args.length >= 1) {
    populateServiceModal(args[0]);
  }

  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove("show");
  document.body.style.overflow = "";
}

function populatePackageModal(packageName, packagePrice) {
  document.getElementById("package-name").textContent = packageName;
  document.getElementById("package-price").textContent = packagePrice;
  document.getElementById(
    "package-modal-title"
  ).textContent = `${packageName} - Application`;
}

function populateServiceModal(serviceName) {
  const serviceDetails = document.getElementById("service-details");
  const serviceInfo = getServiceInfo(serviceName);

  serviceDetails.innerHTML = `
        <h4>${serviceName}</h4>
        <p>${serviceInfo.description}</p>
        <div class="service-features-modal">
            ${serviceInfo.features
              .map(
                (feature) => `
                <div>
                    <i class="fas fa-check"></i>
                    <span>${feature}</span>
                </div>
            `
              )
              .join("")}
        </div>
        <p><strong>Starting from:</strong> ${serviceInfo.price}</p>
    `;
}

function getServiceInfo(serviceName) {
  const services = {
    "Billing System": {
      description:
        "Complete automated billing solution with multiple payment gateways, recurring billing, and detailed reporting. Perfect for businesses of all sizes.",
      features: [
        "M-Pesa Integration",
        "Automated Invoicing",
        "Payment Reminders",
        "Detailed Reports",
        "Multi-currency Support",
        "API Integration",
      ],
      price: "KSh 15,000/month",
    },
    "Bulk SMS": {
      description:
        "Reliable bulk SMS platform with high delivery rates, scheduling capabilities, and comprehensive analytics. Reach thousands of customers instantly.",
      features: [
        "99% Delivery Rate",
        "Message Scheduling",
        "Contact Management",
        "Delivery Reports",
        "API Access",
        "Custom Sender ID",
      ],
      price: "KSh 2/SMS",
    },
    "Hotspot Solutions": {
      description:
        "Complete WiFi hotspot management system for hotels, restaurants, and public spaces. Control access, monitor usage, and generate revenue.",
      features: [
        "User Authentication",
        "Bandwidth Management",
        "Usage Monitoring",
        "Payment Integration",
        "Custom Branding",
        "Analytics Dashboard",
      ],
      price: "KSh 25,000 setup + KSh 5,000/month",
    },
  };

  return (
    services[serviceName] || {
      description: "Contact us for more information about this service.",
      features: [
        "Professional Service",
        "Expert Support",
        "Competitive Pricing",
      ],
      price: "Contact for Quote",
    }
  );
}

// FAQ functionality
function setupFAQ() {
  const faqQuestions = document.querySelectorAll(".faq-item");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      console.log($(this))
      toggleFAQ(question);
    });
  });
}

function toggleFAQ(questionElement) {

  const faqItem = questionElement.closest(".faq-item");
  const isActive = faqItem.classList.contains("active");
    faqItem.classList.add("active");

  // Close all FAQ items
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Open clicked item if it wasn't active
  if (!isActive) {
    faqItem.classList.add("active");
  }
}

// Utility functions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

function showMessage(type, message) {
  // Create message element
  const messageEl = document.createElement("div");
  messageEl.className = `message ${type}`;
  messageEl.textContent = message;

  // Add to page
  document.body.appendChild(messageEl);

  // Show message
  setTimeout(() => {
    messageEl.classList.add("show");
  }, 100);

  // Remove message after 5 seconds
  setTimeout(() => {
    messageEl.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(messageEl);
    }, 300);
  }, 5000);
}

// Service worker registration (for PWA capabilities)
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/sw.js")
//       .then((registration) => {
//         console.log("SW registered: ", registration);
//       })
//       .catch((registrationError) => {
//         console.log("SW registration failed: ", registrationError);
//       });
//   });
// }

// Performance optimization
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener("DOMContentLoaded", lazyLoadImages);

// Error handling
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
  // You could send this to an error reporting service
});

// Unhandled promise rejection handling
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
  // You could send this to an error reporting service
});
