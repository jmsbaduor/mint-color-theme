/**
 * Dark Mode Toggle 2
 * Copyright 2024 by James Baduor
 * Released under the MIT License
 * Released on: August 26, 2024
 * 
 * Forked from: https://github.com/timothydesign/scripts/blob/main/dark-mode-toggle.js
 * Original Copyright 2023 by Timothy Ricks
 * Released under the MIT License
 * Released on: November 28, 2023
 *
 * This script provides advanced dark mode functionality, including:
 * - Persistent theme preference storage
 * - Automatic theme switching based on system preferences
 * - Dynamic asset switching for different theme modes
 * - SEO-friendly image handling for theme-specific assets
 *
 * Key features:
 * 1. Theme-aware image switching:
 *    - Automatically switches image sources based on the current theme
 *    - Supports different image assets for light and dark modes
 *    - Enhances user experience by providing theme-appropriate visuals
 *
 * 2. SEO optimization for images:
 *    - Utilizes the `data-light-src` and `data-dark-src` attributes for theme-specific images
 *    - Allows search engines to index both light and dark mode images
 *    - Improves accessibility and SEO performance
 *
 * Usage:
 * - Add `class="theme-asset"` to images that should change based on theme
 * - Use `data-light-src` for the light mode image source
 * - Use `data-dark-src` for the dark mode image source
 * 
 * Example:
 * <img class="theme-asset" 
 *      data-light-src="/path/to/light-image.jpg" 
 *      data-dark-src="/path/to/dark-image.jpg" 
 *      alt="Theme-aware image">
 */
