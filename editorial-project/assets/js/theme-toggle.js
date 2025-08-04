/**
 * Theme Toggle Functionality
 * Author: Luis Gilberto
 * Version: 1.0
 * 
 * Provides sophisticated light/dark mode switching with:
 * - localStorage persistence
 * - Smooth transitions
 * - Keyboard accessibility
 * - Visual feedback
 */

(function() {
  'use strict';
  
  // DOM elements
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const body = document.body;
  
  // Check for saved theme preference or default to 'dark'
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  /**
   * Apply theme to the document
   * @param {string} theme - 'light' or 'dark'
   */
  function applyTheme(theme) {
    if (theme === 'light') {
      body.setAttribute('data-theme', 'light');
      themeIcon.className = 'fas fa-moon';
    } else {
      body.removeAttribute('data-theme');
      themeIcon.className = 'fas fa-sun';
    }
  }
  
  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const isLight = body.getAttribute('data-theme') === 'light';
    
    if (isLight) {
      // Switch to dark
      body.removeAttribute('data-theme');
      themeIcon.className = 'fas fa-sun';
      localStorage.setItem('theme', 'dark');
    } else {
      // Switch to light
      body.setAttribute('data-theme', 'light');
      themeIcon.className = 'fas fa-moon';
      localStorage.setItem('theme', 'light');
    }
  }
  
  /**
   * Handle keyboard navigation for accessibility
   * @param {KeyboardEvent} e - The keyboard event
   */
  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  }
  
  // Initialize theme on page load
  applyTheme(currentTheme);
  
  // Event listeners
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.addEventListener('keydown', handleKeydown);
  }
  
  // Expose theme functions globally for potential external use
  window.ThemeManager = {
    toggle: toggleTheme,
    apply: applyTheme,
    getCurrent: () => body.getAttribute('data-theme') || 'dark'
  };
  
})();