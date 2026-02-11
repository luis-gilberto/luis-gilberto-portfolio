<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced JavaScript for Tab Functionality</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            background-color: #1a1a1a;
            color: #ffffff;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: #2a2a2a;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
        h1 {
            color: #FF6B6B;
            text-align: center;
            margin-bottom: 30px;
        }
        .instruction {
            background-color: #3a3a3a;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #FF6B6B;
        }
        .code-block {
            background-color: #0d1117;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 20px;
            overflow-x: auto;
            white-space: pre-wrap;
            font-size: 14px;
            line-height: 1.45;
        }
        .comment {
            color: #7d8590;
        }
        .keyword {
            color: #ff7b72;
        }
        .string {
            color: #a5d6ff;
        }
        .function {
            color: #d2a8ff;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Enhanced JavaScript for Tab Functionality</h1>
        
        <div class="instruction">
            <strong>INSTRUCTIONS FOR TRAE:</strong><br>
            1. Open your <code>myexperience-experimental.html</code> file<br>
            2. Find the existing tab functionality script (usually near the bottom of the file)<br>
            3. Replace the entire existing script with the code below<br>
            4. Save the file and test the functionality
        </div>

        <div class="code-block">
<script>
// REPLACE THE EXISTING TAB FUNCTIONALITY SCRIPT WITH THIS
// Find the existing tab script in myexperience-experimental.html and replace it

document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const scrollIndicator = document.getElementById('scrollIndicator');
    
    // Function to switch to a specific tab
    function switchToTab(index) {
        // Remove active class from all buttons and contents
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.transform = 'translateY(20px)';
            content.style.opacity = '0';
        });
        
        // Add active class to target button and corresponding content
        const targetBtn = tabBtns[index];
        const targetTab = targetBtn.getAttribute('data-tab');
        
        targetBtn.classList.add('active');
        
        const targetContent = document.getElementById(targetTab + '-tab');
        
        setTimeout(() => {
            targetContent.classList.add('active');
            targetContent.style.transform = 'translateY(0)';
            targetContent.style.opacity = '1';
        }, 150);
        
        // Enhanced smooth scroll to tab content container with better offset
        setTimeout(() => {
            const tabContentContainer = document.querySelector('.tab-content-container');
            if (tabContentContainer) {
                const offsetTop = tabContentContainer.offsetTop - 120; // Adjusted offset
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 200);
        
        // Hide scroll indicator after first interaction
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
                if (scrollIndicator.style.display !== 'none') {
                    scrollIndicator.style.display = 'none';
                }
            }, 500);
        }
    }
    
    // Enhanced tab switching with click handlers
    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            switchToTab(index);
        });
        
        // Enhanced hover effects
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active')) {
                btn.style.transform = 'translateY(-3px) scale(1.02)';
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('active')) {
                btn.style.transform = '';
            }
        });
    });
    
    // Initialize with first tab active
    switchToTab(0);
    
    // Optional: Hide scroll indicator when user scrolls manually
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollIndicator && scrollIndicator.style.display !== 'none') {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                if (window.scrollY > 200) {
                    scrollIndicator.style.opacity = '0';
                    setTimeout(() => scrollIndicator.style.display = 'none', 500);
                }
            }, 100);
        }
    });
});
</script>
        </div>
        
        <div class="instruction">
            <strong>KEY IMPROVEMENTS IN THIS SCRIPT:</strong><br>
            • Fixed smooth scrolling with better offset calculation<br>
            • Enhanced hover effects for better user feedback<br>
            • Improved scroll indicator management<br>
            • Better tab transition animations<br>
            • Automatic scroll indicator hiding after user interaction
        </div>
    </div>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDtserhFmWqV%2F5c2Jc0rpRNPqJaLbT%2FgGc05CdbyS012sauVsMynfz9mbVoaih%2FKvGShd9KJy8GdxxtCY7CJ28PX3WPKq36uFMpOVQF8nNR5UNaoDEmM6M8ZrJsF4aYoHE%2FNa9iHE4nTJUGdrmss8efl73493JeK15J%2FqgfAus5ZnjDT25Otchnx1XU5%2BN6tbOE26CnfXUblKfTYDI1zKiL%2FEd6dPysyLT9fLg%2BGt8B1okKfbLWudUCinLQKFL50XINI%2FufrgzlTFipQ9utpQhCKF1N0lIK02Id22oyx31ueRduRKLJV%2FJ6FcDcPW7DDoMLKH1In6MhlCrGlfFUJmoT%2B6Zd0Hy09ML2Is7tbsPYdvobFwCI8JKixhiRyxu%2FuB10LPsOmwc85yFhTrHEFJ9aGKSXbci%2BQik%2FfmDP0hLb67YOXy7n%2BuGfKNq2onD8PQITecBuYam8tSM1hELMtPQd2f6bcBilUxfKLhazm%2FJaLRIuGFkh1BJOD9rzdAbFNn0A%3D%3D";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDtserhFmWqV/5c2Jc0rpRNPqJaLbT/gGc05CdbyS012sauVsMynfz9mbVoaih/KvGShd9KJy8GdxxtCY7CJ28PX3WPKq36uFMpOVQF8nNR5UNaoDEmM6M8ZrJsF4aYoHE/Na9iHE4nTJUGdrmss8efl73493JeK15J/qgfAus5ZnjDT25Otchnx1XU5+N6tbOE26CnfXUblKfTYDI1zKiL/Ed6dPysyLT9fLg+Gt8B1okKfbLWudUCinLQKFL50XINI/ufrgzlTFipQ9utpQhCKF1N0lIK02Id22oyx31ueRduRKLJV/J6FcDcPW7DDoMLKH1In6MhlCrGlfFUJmoT+6Zd0Hy09ML2Is7tbsPYdvobFwCI8JKixhiRyxu/uB10LPsOmwc85yFhTrHEFJ9aGKSXbci+Qik/fmDP0hLb67YOXy7n+uGfKNq2onD8PQITecBuYam8tSM1hELMtPQd2f6bcBilUxfKLhazm/JaLRIuGFkh1BJOD9rzdAbFNn0A==";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    