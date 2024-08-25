function colorModeToggle() {
    const htmlElement = document.documentElement;
    const computed = getComputedStyle(htmlElement);
    let toggleEl;
    let togglePressed = "false";
    const scriptTag = document.querySelector("[tr-color-vars]");
    if (!scriptTag) {
        console.warn("Script tag with tr-color-vars attribute not found");
        return;
    }
    const cssVariables = scriptTag.getAttribute("tr-color-vars");
    if (!cssVariables.length) {
        console.warn("Value of tr-color-vars attribute not found");
        return;
    }
    let lightColors = {};
    let darkColors = {};
    cssVariables.split(",").forEach(function (item) {
        let lightValue = computed.getPropertyValue(`--color--${item}`);
        let darkValue = computed.getPropertyValue(`--dark--${item}`);
        if (lightValue.length) {
            if (!darkValue.length) darkValue = lightValue;
            lightColors[`--color--${item}`] = lightValue;
            darkColors[`--color--${item}`] = darkValue;
        }
    });
    if (!Object.keys(lightColors).length) {
        console.warn("No variables found matching tr-color-vars attribute value");
        return;
    }
    function setColors(colorObject) {
        Object.keys(colorObject).forEach(function (key) {
            htmlElement.style.setProperty(key, colorObject[key]);
        });
    }

    function switchAssets(isDark) {
        const themeAssets = document.querySelectorAll('.theme-asset');
        themeAssets.forEach(asset => {
            const lightSrc = asset.getAttribute('data-light-src');
            const darkSrc = asset.getAttribute('data-dark-src');
            asset.src = isDark ? darkSrc : lightSrc;
        });
    }

    function goDark(dark) {
        if (dark) {
            localStorage.setItem("dark-mode", "true");
            htmlElement.classList.add("dark-mode");
            setColors(darkColors);
            togglePressed = "true";
            switchAssets(true);
        } else {
            localStorage.setItem("dark-mode", "false");
            htmlElement.classList.remove("dark-mode");
            setColors(lightColors);
            togglePressed = "false";
            switchAssets(false);
        }
        if (typeof toggleEl !== "undefined") {
            toggleEl.forEach(function (element) {
                element.setAttribute("aria-pressed", togglePressed);
            });
        }
    }

    function checkPreference(e) {
        goDark(e.matches);
    }

    function initializeTheme() {
        const colorPreference = window.matchMedia("(prefers-color-scheme: dark)");
        let storagePreference = localStorage.getItem("dark-mode");
        
        if (storagePreference !== null) {
            goDark(storagePreference === "true");
        } else {
            goDark(colorPreference.matches);
        }

        colorPreference.addEventListener("change", (e) => {
            if (localStorage.getItem("dark-mode") === null) {
                checkPreference(e);
            }
        });
    }

    // Initialize theme immediately
    initializeTheme();

    // Set initial asset state before page load
    document.addEventListener("DOMContentLoaded", (event) => {
        const isDark = htmlElement.classList.contains("dark-mode");
        switchAssets(isDark);

        toggleEl = document.querySelectorAll("[tr-color-toggle]");
        toggleEl.forEach(function (element) {
            element.setAttribute("aria-label", "Toggle Dark Mode");
            element.setAttribute("role", "button");
            element.setAttribute("aria-pressed", togglePressed);
        });
        toggleEl.forEach(function (element) {
            element.addEventListener("click", function () {
                let darkClass = htmlElement.classList.contains("dark-mode");
                darkClass ? goDark(false) : goDark(true);
            });
        });
    });
}

// Execute immediately to set theme before page load
colorModeToggle();