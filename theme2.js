/**
# Theme Switching Script Changelog

## Version 1.1.0 (Current)

### Added
- New functionality to handle `.dark-asset` and `.light-asset` classes:
  - Elements with `.dark-asset` will only be visible in dark mode
  - Elements with `.light-asset` will only be visible in light mode
  - This feature allows for theme-specific UI elements without relying on data attributes

### Changed
- Updated `switchAssets` function to include the new asset visibility toggling

## Existing Functionalities Summary

1. **Theme Management:**
   - Supports three modes: system, light, and dark
   - Stores user preference in local storage
   - Automatically adjusts to system preference when in system mode

2. **Color Variable Handling:**
   - Dynamically sets CSS color variables based on the active theme
   - Supports custom color variables defined in the HTML

3. **Asset Switching:**
   - Switches image sources based on the active theme using `data-light-src` and `data-dark-src` attributes
   - Handles different asset types: images, picture elements, and Lottie animations

4. **Theme Toggles:**
   - Provides functionality for theme toggle buttons
   - Updates toggle states based on the active theme

5. **Initialization and Preloading:**
   - Initializes the correct theme on page load
   - Preloads the correct assets based on the initial theme

6. **Responsive to System Changes:**
   - Listens for changes in system color scheme preference

7. **Performance Optimization:**
   - Uses event listeners to ensure proper initialization after DOM content is loaded

To use the new `.dark-asset` and `.light-asset` functionality, simply add these classes to elements you want to show or hide based on the active theme. The script will automatically handle their visibility.

Example:
```html
<div class="light-asset">Visible only in light mode</div>
<div class="dark-asset">Visible only in dark mode</div>
```

Note: Ensure you have a `.hidden` class in your CSS to properly hide elements:
```css
.hidden {
    display: none !important;
}
```

This update enhances the flexibility of theme-based content management, allowing for more dynamic and theme-specific UI elements without modifying the existing functionality.
 */
(function() {
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

    function switchImageSource(element, isDark) {
        const lightSrc = element.getAttribute('data-light-src');
        const darkSrc = element.getAttribute('data-dark-src');
        const lightSrcset = element.getAttribute('data-light-srcset');
        const darkSrcset = element.getAttribute('data-dark-srcset');

        if (isDark) {
            if (darkSrc) element.src = darkSrc;
            if (darkSrcset) element.srcset = darkSrcset;
        } else {
            if (lightSrc) element.src = lightSrc;
            if (lightSrcset) element.srcset = lightSrcset;
        }
    }

    function switchAssets(isDark) {
        document.querySelectorAll('.theme-asset').forEach(asset => {
            if (asset.tagName.toLowerCase() === 'lottie-player') {
                const lightSrc = asset.getAttribute('data-light-src');
                const darkSrc = asset.getAttribute('data-dark-src');
                const newSrc = isDark && darkSrc ? darkSrc : lightSrc;
                if (newSrc && asset.getAttribute('src') !== newSrc) {
                    asset.stop();
                    asset.load(newSrc);
                    asset.play();
                }
            } else if (asset.tagName.toLowerCase() === 'picture') {
                asset.querySelectorAll('source, img').forEach(element => {
                    switchImageSource(element, isDark);
                });
            } else if (asset.tagName.toLowerCase() === 'img') {
                switchImageSource(asset, isDark);
            }
        });

        // New functionality for .dark-asset and .light-asset
        document.querySelectorAll('.dark-asset, .light-asset').forEach(asset => {
            if (isDark) {
                asset.classList.toggle('hidden', asset.classList.contains('light-asset'));
                asset.classList.toggle('hidden', !asset.classList.contains('dark-asset'));
            } else {
                asset.classList.toggle('hidden', asset.classList.contains('dark-asset'));
                asset.classList.toggle('hidden', !asset.classList.contains('light-asset'));
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

    function preloadCorrectAssets() {
        const currentMode = localStorage.getItem("color-mode") || 'system';
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = currentMode === 'dark' || (currentMode === 'system' && systemDark);
        switchAssets(isDark);
    }

    preloadCorrectAssets();

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