
        function checkAccess() {
            const input = document.getElementById('accessCode');
            const errorMessage = document.getElementById('errorMessage');
            const overlay = document.getElementById('gatewayOverlay');
            const mainContent = document.getElementById('mainContent');

            if (input.value.toUpperCase() === 'LG100') {
                overlay.classList.add('hidden');
                mainContent.classList.remove('hidden');
                
                // Initialize evolving text animations
                initializeAnimations();
            } else {
                errorMessage.classList.remove('hidden');
                input.value = '';
                input.focus();
            }
        }

        function initializeAnimations() {
            // Enhanced evolving text effect on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const letters = entry.target.querySelectorAll('.letter');
                        letters.forEach((letter, index) => {
                            letter.style.animationDelay = `${index * 0.1}s`;
                            letter.style.animationDuration = '2s';
                        });
                    }
                });
            }, observerOptions);

            // Observe all evolving text elements
            document.querySelectorAll('.evolving-text').forEach(el => {
                observer.observe(el);
            });
        }

        // Allow Enter key to submit access code
        document.getElementById('accessCode').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAccess();
            }
        });

        // Focus on input when page loads
        document.getElementById('accessCode').focus();
    


        window.__genspark_remove_badge_link = "https://www.genspark.ai/api/html_badge/" +
            "remove_badge?token=To%2FBnjzloZ3UfQdcSaYfDqJDh%2BQY8yle%2FQhhGVzXLSQuxfPww7xSpTd82Rz58kyNcWx3LX4Bvjb82RSy%2B2UvYSBr8l9bsYDdBH%2B5VgRLde2DKFgHW4iYq%2FdmUTBQCvJeBFJE8v5phFWYViwubyDoprNsonIP2iMhjLV7y5s8u3dwrpCAp7sW63hJtL2DbBcAj4ry8TWUCb9JzeFy1QX6nAnCg%2BupSa0mXYmUSNNUjLZKdZ1bRb%2B6MGHHlKM302e2cAtf%2BVpPv57RufPZmp4XGq19pTZYzYFEbQnguosqnEhPTwXPfIjpy%2FKmxrCpEoHmwWRk4%2FaxC%2FJxXtfrECBsOJ7BIhP9MkQ1TxO%2BWVWMghrDYI6b%2Fy4ckEsx2J%2FNfu3V5ICrAxq%2FPKjngppjxowRhBwgwZpZsPUsIexW73bX9K33HZ4SeaWQktqkBw%2FR2fVwntCpKMmM0C9YyFWRwUh1sGOkSDuE9vgkDX3N%2BJ7Diq748yeWkEYb4sQnV841DgLUlj5Mrba7v4IGm1ZzFmAD%2BUDa6aRSoUhiWQw1mLfcOHE%3D";
        window.__genspark_locale = "en-US";
        window.__genspark_token = "To/BnjzloZ3UfQdcSaYfDqJDh+QY8yle/QhhGVzXLSQuxfPww7xSpTd82Rz58kyNcWx3LX4Bvjb82RSy+2UvYSBr8l9bsYDdBH+5VgRLde2DKFgHW4iYq/dmUTBQCvJeBFJE8v5phFWYViwubyDoprNsonIP2iMhjLV7y5s8u3dwrpCAp7sW63hJtL2DbBcAj4ry8TWUCb9JzeFy1QX6nAnCg+upSa0mXYmUSNNUjLZKdZ1bRb+6MGHHlKM302e2cAtf+VpPv57RufPZmp4XGq19pTZYzYFEbQnguosqnEhPTwXPfIjpy/KmxrCpEoHmwWRk4/axC/JxXtfrECBsOJ7BIhP9MkQ1TxO+WVWMghrDYI6b/y4ckEsx2J/Nfu3V5ICrAxq/PKjngppjxowRhBwgwZpZsPUsIexW73bX9K33HZ4SeaWQktqkBw/R2fVwntCpKMmM0C9YyFWRwUh1sGOkSDuE9vgkDX3N+J7Diq748yeWkEYb4sQnV841DgLUlj5Mrba7v4IGm1ZzFmAD+UDa6aRSoUhiWQw1mLfcOHE=";
    