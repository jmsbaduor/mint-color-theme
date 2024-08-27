/**
 * Dark Mode Toggle 2
 * Copyright 2024 by James Baduor
 * Released on: August 27, 2024
 * 
 * Multiple theme toggle options:
 *    - Separate controls for system preference, light mode, and dark mode
 *    - Visual indication of active mode
 *    - Seamless integration with existing color variable system
 *
 * Usage:
 * - Add `class="theme-asset"` to images that should change based on theme
 * - Use `data-light-src` for the light mode image source
 * - Use `data-dark-src` for the dark mode image source
 * - Add `tr-color-system` attribute to the system preference toggle element
 * - Add `tr-color-light` attribute to the light mode toggle element
 * - Add `tr-color-dark` attribute to the dark mode toggle element
 * 
 * Example:
 * <img class="theme-asset" 
 *      data-light-src="/path/to/light-image.jpg" 
 *      data-dark-src="/path/to/dark-image.jpg" 
 *      alt="Theme-aware image">
 * <button tr-color-system>System</button>
 * <button tr-color-light>Light</button>
 * <button tr-color-dark>Dark</button>
 */

f(function() {
    const htmlElement = document.documentElement;
    const scriptTag = document.querySelector("[tr-color-vars]");
    const cssVariables = scriptTag ? scriptTag.getAttribute("tr-color-vars").split(",") : [];
    let lightColors = {};
    let darkColors = {};

    // Capture initial color values
    cssVariables.forEach(item => {
        const lightValue = getComputedStyle(htmlElement).getPropertyValue(`--color--${item}`);
        const darkValue = getComputedStyle(htmlElement).getPropertyValue(`--dark--${item}`) || lightValue;
        lightColors[`--color--${item}`] = lightValue;
        darkColors[`--color--${item}`] = darkValue;
    });

    function setColors(colorObject) {
        Object.keys(colorObject).forEach(key => {
            htmlElement.style.setProperty(key, colorObject[key]);
        });
    }

    function switchAssets(isDark) {
        document.querySelectorAll('.theme-asset').forEach(asset => {
            const lightSrc = asset.getAttribute('data-light-src');
            const darkSrc = asset.getAttribute('data-dark-src');
            if (isDark && darkSrc) {
                asset.src = darkSrc;
            } else if (!isDark && lightSrc) {
                asset.src = lightSrc;
            }
        });
    }

    function setTheme(mode) {
        const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia("(prefers-color-scheme: dark)").matches);
        localStorage.setItem("color-mode", mode);
        htmlElement.classList.toggle("dark-mode", isDark);
        setColors(isDark ? darkColors : lightColors);
        switchAssets(isDark);
        updateToggleStates(mode);
    }

    function updateToggleStates(activeMode) {
        ['system', 'light', 'dark'].forEach(mode => {
            const el = document.querySelector(`[tr-color-${mode}]`);
            if (el) el.classList.toggle('active', activeMode === mode);
        });
    }

    function initializeTheme() {
        const storedMode = localStorage.getItem("color-mode") || 'system';
        setTheme(storedMode);

        window.matchMedia("(prefers-color-scheme: dark)").addListener(() => {
            if (localStorage.getItem("color-mode") === 'system') {
                setTheme('system');
            }
        });
    }

    function setupToggles() {
        ['system', 'light', 'dark'].forEach(mode => {
            const el = document.querySelector(`[tr-color-${mode}]`);
            if (el) el.addEventListener("click", () => setTheme(mode));
        });
    }

    // Preload correct assets
    function preloadCorrectAssets() {
        const currentMode = localStorage.getItem("color-mode") || 'system';
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = currentMode === 'dark' || (currentMode === 'system' && systemDark);
        switchAssets(isDark);
    }

    // Run preload immediately
    preloadCorrectAssets();

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeTheme();
            setupToggles();
        });
    } else {
        initializeTheme();
        setupToggles();
    }
})();