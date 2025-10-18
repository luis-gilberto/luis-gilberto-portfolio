// Planning Hub Assessment Logic

class PartnershipAssessment {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.questions = [
            {
                id: 'partnership_stage',
                question: 'What stage is your marketing strategy currently in?',
                options: [
                    { value: 'exploring', text: 'Exploring partnership opportunities', weight: 1 },
                    { value: 'planning', text: 'Planning specific partnership initiatives', weight: 2 },
                    { value: 'implementing', text: 'Implementing active partnerships', weight: 3 },
                    { value: 'optimizing', text: 'Optimizing existing partnership performance', weight: 4 }
                ]
            },
            {
                id: 'business_focus',
                question: 'What is your primary business focus area?',
                options: [
                    { value: 'b2b_tech', text: 'B2B Technology Solutions', weight: 4 },
                    { value: 'enterprise_ai', text: 'Enterprise AI Implementation', weight: 4 },
                    { value: 'digital_transformation', text: 'Digital Transformation', weight: 3 },
                    { value: 'other_tech', text: 'Other Technology Sector', weight: 2 }
                ]
            },
            {
                id: 'partnership_goals',
                question: 'What are your primary partnership goals?',
                options: [
                    { value: 'market_expansion', text: 'Market expansion and reach', weight: 3 },
                    { value: 'expertise_complement', text: 'Complementary expertise access', weight: 4 },
                    { value: 'cost_efficiency', text: 'Cost efficiency and resource optimization', weight: 2 },
                    { value: 'innovation_acceleration', text: 'Innovation and product development acceleration', weight: 4 }
                ]
            },
            {
                id: 'current_challenges',
                question: 'What is your biggest partnership challenge?',
                options: [
                    { value: 'finding_partners', text: 'Finding the right strategic partners', weight: 2 },
                    { value: 'alignment_strategy', text: 'Aligning marketing strategy with business goals', weight: 4 },
                    { value: 'execution_management', text: 'Partnership execution and management', weight: 3 },
                    { value: 'measuring_success', text: 'Measuring partnership success and ROI', weight: 3 }
                ]
            },
            {
                id: 'timeline_urgency',
                question: 'What is your timeline for partnership implementation?',
                options: [
                    { value: 'immediate', text: 'Immediate (within 1-3 months)', weight: 4 },
                    { value: 'short_term', text: 'Short-term (3-6 months)', weight: 3 },
                    { value: 'medium_term', text: 'Medium-term (6-12 months)', weight: 2 },
                    { value: 'long_term', text: 'Long-term planning (12+ months)', weight: 1 }
                ]
            }
        ];
        this.init();
    }

    init() {
        this.renderQuestion();
        this.updateProgress();
    }

    renderQuestion() {
        const container = document.getElementById('question-container');
        const question = this.questions[this.currentQuestion];
        
        container.innerHTML = `
            <div class="question-container">
                <h3 class="text-xl font-bold text-white mb-6">${question.question}</h3>
                <div class="options-container">
                    ${question.options.map(option => `
                        <button class="option-button" data-value="${option.value}" data-weight="${option.weight}">
                            ${option.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add event listeners
        container.querySelectorAll('.option-button').forEach(button => {
            button.addEventListener('click', (e) => this.selectOption(e));
        });
    }

    selectOption(event) {
        const button = event.target;
        const questionId = this.questions[this.currentQuestion].id;
        
        // Remove previous selection
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked button
        button.classList.add('selected');
        
        // Store answer
        this.answers[questionId] = {
            value: button.dataset.value,
            weight: parseInt(button.dataset.weight),
            text: button.textContent
        };
        
        // Auto-advance after selection
        setTimeout(() => {
            this.nextQuestion();
        }, 500);
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
            this.updateProgress();
        } else {
            this.showResults();
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
    }

    calculateScore() {
        let totalScore = 0;
        let maxScore = 0;
        
        Object.values(this.answers).forEach(answer => {
            totalScore += answer.weight;
        });
        
        // Maximum possible score
        this.questions.forEach(question => {
            maxScore += Math.max(...question.options.map(opt => opt.weight));
        });
        
        return {
            score: totalScore,
            maxScore: maxScore,
            percentage: Math.round((totalScore / maxScore) * 100)
        };
    }

    generateRecommendations(scoreData) {
        const { percentage } = scoreData;
        
        if (percentage >= 80) {
            return {
                level: 'Strategic Partnership Ready',
                description: 'You demonstrate high partnership readiness with clear strategic focus.',
                recommendations: [
                    'Access our Strategic Partnership Toolkit for advanced frameworks',
                    'Schedule a strategic alignment consultation',
                    'Explore our Enterprise AI Partnership Accelerator program'
                ],
                nextSteps: [
                    { action: 'Access Toolkit', url: '/IMCServices/toolkit', priority: 'high' },
                    { action: 'Book Consultation', url: 'mailto:luis@luis-gilberto.com?subject=Strategic Partnership Consultation', priority: 'high' }
                ]
            };
        } else if (percentage >= 60) {
            return {
                level: 'Partnership Development Needed',
                description: 'Good foundation with opportunities for strategic enhancement.',
                recommendations: [
                    'Review our Marketing Strategy Framework',
                    'Assess current partnership alignment gaps',
                    'Consider strategic planning consultation'
                ],
                nextSteps: [
                    { action: 'Download Framework', url: '/IMCServices/toolkit', priority: 'medium' },
                    { action: 'Schedule Planning Call', url: 'mailto:luis@luis-gilberto.com?subject=Marketing Strategy Planning', priority: 'medium' }
                ]
            };
        } else {
            return {
                level: 'Foundation Building Required',
                description: 'Significant opportunities to strengthen marketing strategy foundation.',
                recommendations: [
                    'Start with Partnership Readiness Assessment',
                    'Develop clear partnership objectives and criteria',
                    'Build internal partnership capabilities'
                ],
                nextSteps: [
                    { action: 'Get Started Guide', url: '/IMCServices/toolkit', priority: 'low' },
                    { action: 'Explore Resources', url: '#strategic-intelligence', priority: 'low' }
                ]
            };
        }
    }

    showResults() {
        const scoreData = this.calculateScore();
        const recommendations = this.generateRecommendations(scoreData);
        
        // Track assessment completion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'assessment_completed', {
                event_category: 'Partnership Hub',
                event_label: recommendations.level,
                value: scoreData.percentage
            });
        }
        
        const container = document.getElementById('question-container');
        container.innerHTML = `
            <div class="results-container">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold coral-accent mb-4">Assessment Complete</h2>
                    <div class="text-6xl font-bold text-white mb-2">${scoreData.percentage}%</div>
                    <div class="text-xl text-gray-300 mb-4">${recommendations.level}</div>
                    <p class="text-gray-400">${recommendations.description}</p>
                </div>
                
                <div class="recommendation-card">
                    <h3 class="text-xl font-bold text-white mb-4">Recommended Actions</h3>
                    <ul class="text-gray-300 space-y-2 mb-6">
                        ${recommendations.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
                    </ul>
                    
                    <div class="space-y-4">
                        ${recommendations.nextSteps.map(step => `
                            <a href="${step.url}" class="btn-hub-${step.priority === 'high' ? 'primary' : 'secondary'} w-full block text-center" 
                               onclick="trackLeadCapture('assessment_${step.action.toLowerCase().replace(' ', '_')}')">
                                ${step.action}
                            </a>
                        `).join('')}
                    </div>
                </div>
                
                <div class="text-center mt-8">
                    <button onclick="assessment.restart()" class="btn-hub-secondary">
                        Take Assessment Again
                    </button>
                </div>
            </div>
        `;
        
        // Hide progress bar
        document.getElementById('progress-container').style.display = 'none';
    }

    restart() {
        this.currentQuestion = 0;
        this.answers = {};
        document.getElementById('progress-container').style.display = 'block';
        this.init();
    }
}

// Initialize assessment when page loads
let assessment;
document.addEventListener('DOMContentLoaded', function() {
    assessment = new PartnershipAssessment();
});

// Make assessment globally available
window.assessment = assessment;