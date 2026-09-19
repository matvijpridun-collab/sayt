/* =========================================================
   DENTA — PREMIUM DENTAL CLINIC
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       ELEMENTS
       ========================================================= */

    const body = document.body;
    const header = document.querySelector(".header");
    const menuButton = document.querySelector(".menu-button");
    const navigation = document.querySelector(".navigation");
    const preloader = document.querySelector(".preloader");
    const appointmentForm = document.querySelector(".appointment-form");

    /* =========================================================
       PRELOADER
       ========================================================= */

    const hidePreloader = () => {
        if (!preloader) return;

        preloader.classList.add("loaded");

        window.setTimeout(() => {
            preloader.setAttribute("aria-hidden", "true");
        }, 700);
    };

    if (document.readyState === "complete") {
        window.setTimeout(hidePreloader, 350);
    } else {
        window.addEventListener("load", () => {
            window.setTimeout(hidePreloader, 350);
        }, { once: true });
    }

    /* =========================================================
       HEADER ON SCROLL
       ========================================================= */

    const updateHeader = () => {
        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    /* =========================================================
       MOBILE MENU
       ========================================================= */

    const closeMenu = () => {
        if (!menuButton || !navigation) return;

        menuButton.classList.remove("active");
        navigation.classList.remove("active");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Відкрити меню");
        body.classList.remove("menu-open");
    };

    const openMenu = () => {
        if (!menuButton || !navigation) return;

        menuButton.classList.add("active");
        navigation.classList.add("active");

        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Закрити меню");
        body.classList.add("menu-open");
    };

    if (menuButton && navigation) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Відкрити меню");

        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.contains("active");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        const navigationLinks = navigation.querySelectorAll("a");

        navigationLinks.forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        document.addEventListener("click", (event) => {
            if (!navigation.classList.contains("active")) return;

            const clickedInsideMenu =
                navigation.contains(event.target) ||
                menuButton.contains(event.target);

            if (!clickedInsideMenu) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }

    /* =========================================================
       SMOOTH SCROLL
       ========================================================= */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            window.history.pushState(
                null,
                "",
                targetId
            );
        });
    });

    /* =========================================================
       REVEAL ANIMATIONS
       ========================================================= */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }

    /* =========================================================
       STAGGERED SERVICE CARDS
       ========================================================= */

    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card, index) => {
        card.style.setProperty(
            "--card-delay",
            `${index * 80}ms`
        );
    });

    /* =========================================================
       FAQ
       ========================================================= */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const summary = item.querySelector("summary");

        if (!summary) return;

        summary.addEventListener("click", () => {
            faqItems.forEach((otherItem) => {
                if (
                    otherItem !== item &&
                    otherItem.hasAttribute("open")
                ) {
                    otherItem.removeAttribute("open");
                }
            });
        });
    });

    /* =========================================================
       APPOINTMENT FORM
       ========================================================= */

    if (appointmentForm) {
        appointmentForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(appointmentForm);

            const name = String(
                formData.get("name") || ""
            ).trim();

            const phone = String(
                formData.get("phone") || ""
            ).trim();

            const service = String(
                formData.get("service") || ""
            ).trim();

            if (!name || !phone) {
                showFormMessage(
                    "Будь ласка, заповніть ім’я та номер телефону.",
                    "error"
                );

                return;
            }

            const submitButton =
                appointmentForm.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add("is-loading");

                const originalText =
                    submitButton.textContent;

                submitButton.textContent = "Відправляємо...";

                window.setTimeout(() => {
                    showFormMessage(
                        `Дякуємо, ${name}! Ми отримали вашу заявку${
                            service
                                ? ` на послугу «${service}»`
                                : ""
                        }. Найближчим часом з вами зв’яжуться.`,
                        "success"
                    );

                    appointmentForm.reset();

                    submitButton.disabled = false;
                    submitButton.classList.remove(
                        "is-loading"
                    );

                    submitButton.textContent =
                        originalText;
                }, 900);
            } else {
                showFormMessage(
                    `Дякуємо, ${name}! Вашу заявку отримано.`,
                    "success"
                );

                appointmentForm.reset();
            }
        });
    }

    /* =========================================================
       FORM MESSAGE
       ========================================================= */

    function showFormMessage(message, type) {
        let messageElement =
            appointmentForm?.querySelector(
                ".form-message"
            );

        if (!appointmentForm) return;

        if (!messageElement) {
            messageElement =
                document.createElement("div");

            messageElement.className =
                "form-message";

            appointmentForm.appendChild(
                messageElement
            );
        }

        messageElement.textContent = message;
        messageElement.className =
            `form-message ${type}`;

        window.clearTimeout(
            showFormMessage.timeout
        );

        showFormMessage.timeout =
            window.setTimeout(() => {
                if (messageElement) {
                    messageElement.classList.add(
                        "is-hidden"
                    );
                }
            }, 7000);
    }

    /* =========================================================
       PHONE INPUT
       ========================================================= */

    const phoneInputs = document.querySelectorAll(
        'input[type="tel"]'
    );

    phoneInputs.forEach((input) => {
        input.addEventListener("input", () => {
            input.value = input.value.replace(
                /[^\d+\-()\s]/g,
                ""
            );
        });
    });

    /* =========================================================
       BUTTON RIPPLE EFFECT
       ========================================================= */

    const buttons = document.querySelectorAll(
        ".button--primary, .button--secondary, .button--light, .header__button"
    );

    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const rect =
                button.getBoundingClientRect();

            const ripple =
                document.createElement("span");

            ripple.className = "button-ripple";

            const size = Math.max(
                rect.width,
                rect.height
            );

            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;

            ripple.style.left =
                `${event.clientX - rect.left - size / 2}px`;

            ripple.style.top =
                `${event.clientY - rect.top - size / 2}px`;

            button.appendChild(ripple);

            window.setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    /* =========================================================
       ACTIVE NAVIGATION LINK
       ========================================================= */

    const sections = document.querySelectorAll(
        "section[id]"
    );

    const navLinks = document.querySelectorAll(
        '.navigation a[href^="#"]'
    );

    if (
        sections.length > 0 &&
        navLinks.length > 0 &&
        "IntersectionObserver" in window
    ) {
        const sectionObserver =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        const id =
                            entry.target.getAttribute(
                                "id"
                            );

                        navLinks.forEach((link) => {
                            const isActive =
                                link.getAttribute(
                                    "href"
                                ) === `#${id}`;

                            link.classList.toggle(
                                "active",
                                isActive
                            );
                        });
                    });
                },
                {
                    threshold: 0.25,
                    rootMargin: "-20% 0px -60% 0px"
                }
            );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    /* =========================================================
       DYNAMIC YEAR
       ========================================================= */

    const yearElements =
        document.querySelectorAll("[data-year]");

    yearElements.forEach((element) => {
        element.textContent =
            new Date().getFullYear();
    });

    /* =========================================================
       PARALLAX EFFECT
       ========================================================= */

    const heroOrbs =
        document.querySelectorAll(".hero__orb");

    if (
        heroOrbs.length > 0 &&
        !window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;

            heroOrbs.forEach((orb, index) => {
                const speed =
                    index === 0 ? 0.08 : -0.05;

                orb.style.transform =
                    `translate3d(0, ${scrollY * speed}px, 0)`;
            });

            ticking = false;
        };

        window.addEventListener(
            "scroll",
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(
                        updateParallax
                    );

                    ticking = true;
                }
            },
            {
                passive: true
            }
        );
    }

    /* =========================================================
       KEYBOARD ACCESSIBILITY
       ========================================================= */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
            body.classList.add("keyboard-user");
        }
    });

    document.addEventListener("mousedown", () => {
        body.classList.remove("keyboard-user");
    });

    /* =========================================================
       PREVENT EMPTY LINK JUMPS
       ========================================================= */

    const emptyLinks =
        document.querySelectorAll('a[href="#"]');

    emptyLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
        });
    });

    /* =========================================================
       CONSOLE MESSAGE
       ========================================================= */

    console.log(
        "%c DENTA ",
        "font-size: 22px; font-weight: 800; color: #d9f99d;"
    );

    console.log(
        "%c Premium Dental Clinic Template",
        "font-size: 13px; color: #999;"
    );
});