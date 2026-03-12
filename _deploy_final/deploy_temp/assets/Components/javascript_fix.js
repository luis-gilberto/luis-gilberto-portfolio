<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Fix</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        body {
            background: #0f0f0f;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
        }
        
        .code-block {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1rem 0;
            overflow-x: auto;
        }
        
        .code-block pre {
            color: #e5e5e5;
            font-size: 0.875rem;
            line-height: 1.5;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .copy-btn {
            background: #F96F6E;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 0.875rem;
            margin-top: 1rem;
        }
        
        .copy-btn:hover {
            background: #e55a59;
        }
    </style>
</head>
<body class="min-h-screen p-6">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-4 text-center">
            <i class="fas fa-code text-yellow-400 mr-3"></i>
            JavaScript Fix
        </h1>
        
        <div class="bg-gray-900 p-6 rounded-lg mb-6">
            <h2 class="text-xl font-bold mb-3 text-green-400">
                <i class="fas fa-info-circle mr-2"></i>
                Instructions for Trae
            </h2>
            <p class="text-gray-300 mb-2">
                <strong>Location:</strong> Find the existing JavaScript section around line 700 in myexperience.html
            </p>
            <p class="text-gray-300 mb-2">
                <strong>Action:</strong> Replace the entire JavaScript block with the code below
            </p>
            <p class="text-gray-300">
                <strong>What it fixes:</strong> Removes annoying animations, improves tab functionality, enables URL linking
            </p>
        </div>
        
        <div class="code-block">
            <h3 class="text-lg font-semibold mb-3 text-blue-400">
                <i class="fas fa-file-code mr-2"></i>
                Replacement JavaScript Code
            </h3>
            
            <pre id="jsCode">document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Remove the annoying scroll indicator
    const scrollIndicator = document.querySelector('.animate-bounce');
    if (scrollIndicator) {
        scrollIndicator.remove();
    }
    
    function switchToTab(index) {
        // Remove active class from all buttons and contents
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        // Add active class to target button and corresponding content
        const targetBtn = tabBtns[index];
        const targetTab = targetBtn.getAttribute('data-tab');
        
        targetBtn.classList.add('active');
        
        const targetContent = document.getElementById(targetTab + '-tab');
        
        if (targetContent) {
            targetContent.style.display = 'block';
            targetContent.classList.add('active');
            
            // Smooth scroll to content
            setTimeout(() => {
                const offsetTop = targetContent.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }, 200);
        }
    }
    
    // Tab switching with click handlers
    tabBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            switchToTab(index);
        });
        
        // Hover effects
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active')) {
                btn.style.transform = 'translateY(-3px)';
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('active')) {
                btn.style.transform = '';
            }
        });
    });
    
    // Handle URL parameters for direct linking
    function getInitialTab() {
        const hash = window.location.hash.substring(1);
        if (hash === 'stories' || hash === 'blog') {
            return 1;
        } else if (hash === 'cv' || hash === 'resume') {
            return 2;
        } else if (hash === 'numbers' || hash === 'sum') {
            return 0;
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam === 'stories' || tabParam === 'blog') {
            return 1;
        } else if (tabParam === 'cv' || tabParam === 'resume') {
            return 2;
        } else if (tabParam === 'numbers' || tabParam === 'sum') {
            return 0;
        }
        
        return null;
    }
    
    // Initialize tab if URL parameter exists
    const initialTab = getInitialTab();
    if (initialTab !== null) {
        switchToTab(initialTab);
    } else {
        // Hide all sections by default
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
    }
});</pre>
            
            <button class="copy-btn" onclick="copyToClipboard()">
                <i class="fas fa-copy mr-2"></i>
                Copy JavaScript Code
            </button>
        </div>
        
        <div class="bg-green-900 p-4 rounded-lg mt-6 border border-green-600">
            <h3 class="text-green-300 font-semibold mb-2">
                <i class="fas fa-check-circle mr-2"></i>
                What This Fixes
            </h3>
            <ul class="text-green-200 space-y-1 text-sm">
                <li>✓ Removes the annoying pulsating scroll indicator</li>
                <li>✓ Improves tab switching functionality</li>
                <li>✓ Enables direct URL linking to specific sections</li>
                <li>✓ Adds smooth hover effects</li>
                <li>✓ Hides content until user clicks a tab</li>
            </ul>
        </div>
    </div>
    
    <script>
        function copyToClipboard() {
            const codeText = document.getElementById('jsCode').textContent;
            navigator.clipboard.writeText(codeText).then(function() {
                const btn = document.querySelector('.copy-btn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
                btn.style.background = '#10b981';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '#F96F6E';
                }, 2000);
            });
        }
    </script>
</body>
</html>
    <script id="html_badge_script1">
        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDoBeCbJmKT1iSZk3AJT3g1WxPl7G0StCElogVLpoPrXfy517cAbeoy1lK0nl73j5iKwqNDPnOAHAmtUy0ZhrCzRIHLjvqKM91PxxKkZCOiyeZIU8a%2FRDkG%2FJiszsu5XQvpdJoyUULM7j%2Bb9jJhvPDw4CizysOGGxV8PM4AjpWIbMdg2OChV5c0Y5Sj0%2BBd2%2Bxjq4CCJk5G%2FwejUSsaINB9wwksYxp8JYeBx84ggkdw2Li6KvVwUqFNhKQfiZkIaXGndAVFK%2Bbw4p5JXPWrQG3IRELP6p2qR1UXRZZxCptlfPrCHmIn7B8stL9e7k1UzFh6xv4JO55TYnvFtTiWDCX9xpMhWD%2F%2FJQuwyiHSH1a9whi1FWYsbRRNXcXie24zOwzSEgOwICLcc7y0Kj6QUAulsCYnir04XxFMmJD647Fg7TQy0bby9gpvqK8u148DMPTIkpjWtOvAofXHhHb37NDiMpw1OoE7er16p7x3DmtlWJsDsy5Tj6nryYGsSrCFChfg%3D%3D";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDoBeCbJmKT1iSZk3AJT3g1WxPl7G0StCElogVLpoPrXfy517cAbeoy1lK0nl73j5iKwqNDPnOAHAmtUy0ZhrCzRIHLjvqKM91PxxKkZCOiyeZIU8a/RDkG/Jiszsu5XQvpdJoyUULM7j+b9jJhvPDw4CizysOGGxV8PM4AjpWIbMdg2OChV5c0Y5Sj0+Bd2+xjq4CCJk5G/wejUSsaINB9wwksYxp8JYeBx84ggkdw2Li6KvVwUqFNhKQfiZkIaXGndAVFK+bw4p5JXPWrQG3IRELP6p2qR1UXRZZxCptlfPrCHmIn7B8stL9e7k1UzFh6xv4JO55TYnvFtTiWDCX9xpMhWD//JQuwyiHSH1a9whi1FWYsbRRNXcXie24zOwzSEgOwICLcc7y0Kj6QUAulsCYnir04XxFMmJD647Fg7TQy0bby9gpvqK8u148DMPTIkpjWtOvAofXHhHb37NDiMpw1OoE7er16p7x3DmtlWJsDsy5Tj6nryYGsSrCFChfg==";
    </script>
    
    <script id="html_notice_dialog_script" src="https://www.genspark.ai/notice_dialog.js"></script>
    