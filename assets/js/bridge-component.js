/**
 * Insights Bridge Component
 * Injects the "From Insight to Action" section to connect editorial content to the ecosystem.
 */
(function() {
    // 1. Locate the hook
    const bridgeContainer = document.getElementById('insights-bridge');
    if (!bridgeContainer) {
        console.warn('Insights Bridge: #insights-bridge hook not found.');
        return;
    }

    // 2. Data Props (from brief)
    const data = {
        title: "From Insight to Action",
        body: "Ideas are powerful, but they only create progress when they become systems. The Hub connects strategic thinking with the tools to execute it.",
        cards: [
            { 
                title: "The Hub", 
                description: "Explore the strategic system behind the work.", 
                link: "/TheHub/" 
            },
            { 
                title: "StrategyIQ", 
                description: "Diagnose what to build before you build it.", 
                link: "/TheHub/strategy-iq/" 
            },
            { 
                title: "The Studio", 
                description: "See how strategy becomes real campaigns and products.", 
                link: "/TheHub/studio.html" 
            }
        ]
    };

    // 3. CSS Styles (Self-contained)
    const styles = `
        <style>
            /* Bridge Section Container */
            .bridge-section {
                padding: 10rem 0;
                background-color: var(--bg); /* Theme sync */
                color: var(--ink); /* Theme sync */
                border-top: 1px solid var(--rule);
            }

            .bridge-container {
                max-width: 1280px;
                margin: 0 auto;
                padding: 0 48px;
                display: grid;
                grid-template-columns: 1.5fr 1fr; /* ~60% / 40% */
                gap: 6rem;
                align-items: start;
            }

            /* Left Column: Text */
            .bridge-text-col {
                max-width: 640px;
            }

            .bridge-intro {
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: var(--coral);
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 32px;
            }
            .bridge-intro::before {
                content: '';
                display: block;
                width: 28px;
                height: 1px;
                background: var(--coral);
            }

            .bridge-title {
                font-family: 'Cormorant Garamond', serif; /* Insights Style */
                font-size: clamp(48px, 6vw, 64px); /* Responsive sizing */
                font-weight: 700;
                font-style: italic;
                line-height: 1.1;
                margin-bottom: 32px;
                color: var(--ink);
            }

            .bridge-body {
                font-family: 'Cormorant Garamond', serif;
                font-size: 20px;
                font-weight: 300;
                line-height: 1.6;
                color: var(--ink-soft);
            }

            /* Right Column: Cards */
            .bridge-cards-col {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .bridge-card {
                display: block;
                padding: 2rem;
                background: var(--card-bg);
                border: 1px solid var(--rule);
                border-radius: 4px;
                text-decoration: none;
                transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
                position: relative;
            }

            .bridge-card:hover {
                transform: translateY(-4px); /* Subtle Lift */
                border-color: var(--coral); /* Accent Border */
                box-shadow: 0 12px 32px rgba(0,0,0,0.08);
            }

            .bridge-card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.75rem;
            }

            .bridge-card-title {
                font-family: 'Inter', sans-serif;
                font-weight: 600;
                font-size: 14px;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: var(--ink);
            }
            
            .bridge-card-arrow {
                color: var(--coral);
                transition: transform 0.3s ease;
            }
            .bridge-card:hover .bridge-card-arrow {
                transform: translateX(4px);
            }

            .bridge-card-desc {
                font-family: 'Cormorant Garamond', serif;
                font-size: 18px;
                font-style: italic;
                color: var(--ink-soft);
                margin: 0;
                line-height: 1.4;
            }

            /* Responsive */
            @media (max-width: 1024px) {
                .bridge-container {
                    grid-template-columns: 1fr;
                    gap: 4rem;
                }
                .bridge-text-col {
                    max-width: 100%;
                }
            }

            @media (max-width: 768px) {
                .bridge-section {
                    padding: 6rem 0;
                }
                .bridge-container {
                    padding: 0 24px;
                }
                .bridge-title {
                    font-size: 42px;
                }
            }
        </style>
    `;

    // 4. HTML Construction
    const cardsHtml = data.cards.map(card => `
        <a href="${card.link}" class="bridge-card">
            <div class="bridge-card-header">
                <span class="bridge-card-title">${card.title}</span>
                <svg class="bridge-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </div>
            <p class="bridge-card-desc">${card.description}</p>
        </a>
    `).join('');

    const contentHtml = `
        <div class="bridge-section">
            <div class="bridge-container">
                <div class="bridge-text-col">
                    <div class="bridge-intro">See how ideas become action</div>
                    <h2 class="bridge-title">${data.title}</h2>
                    <p class="bridge-body">${data.body}</p>
                </div>
                <div class="bridge-cards-col">
                    ${cardsHtml}
                </div>
            </div>
        </div>
    `;

    // 5. Inject
    bridgeContainer.innerHTML = styles + contentHtml;
    console.log('Insights Bridge injected successfully.');

})();
