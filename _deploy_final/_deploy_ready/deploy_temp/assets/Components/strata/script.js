document.addEventListener('DOMContentLoaded', () => {
  // Enhanced smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Smooth scroll reveal with intersection observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
  });

  // Parallax effect on scroll
  let ticking = false;
  
  const parallaxScroll = () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-section');
    
    parallaxElements.forEach(element => {
      const speed = 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(parallaxScroll);
      ticking = true;
    }
  });

  // Admin Access Modal functionality
  const adminAccessButton = document.getElementById('admin-access-button');
  const adminModalOverlay = document.getElementById('admin-modal-overlay');
  const adminModalCloseButton = document.getElementById('admin-modal-close-button');
  const accessEngineButton = document.getElementById('access-engine-button');
  const cancelAccessButton = document.getElementById('cancel-access-button');
  const accessCodeInput = document.getElementById('access-code-input');

  if (adminAccessButton) {
    adminAccessButton.addEventListener('click', () => {
      adminModalOverlay.classList.add('open');
      accessCodeInput.value = ''; // Clear input on open
    });
  }

  if (adminModalCloseButton) {
    adminModalCloseButton.addEventListener('click', () => {
      adminModalOverlay.classList.remove('open');
    });
  }

  if (cancelAccessButton) {
    cancelAccessButton.addEventListener('click', () => {
      adminModalOverlay.classList.remove('open');
    });
  }

  if (accessEngineButton) {
    accessEngineButton.addEventListener('click', () => {
      const accessCode = accessCodeInput.value;
      // For demonstration, any non-empty code will "unlock"
      if (accessCode) {
        adminModalOverlay.classList.remove('open');
        document.body.classList.add('admin-unlocked'); // Add a class to body to show/hide admin content
        // Optionally, hide the admin access button
        if (adminAccessButton) {
          adminAccessButton.style.display = 'none';
        }
        // Show the assessment engine modal
        assessmentModalOverlay.classList.add('open');
        resetAssessment();
      } else {
        alert('Please enter an access code.');
      }
    });
  }

  // Assessment Engine Modal functionality
  const assessmentModalOverlay = document.getElementById('assessment-modal-overlay');
  const assessmentModalExitButton = document.getElementById('assessment-modal-exit-button');
  const assessmentOptionsGrid = document.getElementById('assessment-options-grid');
  const liveAssessmentView = document.getElementById('live-assessment-view');
  const reportView = document.getElementById('report-view');
  const assessmentProgressBarFill = document.getElementById('assessment-progress-bar-fill');
  const assessmentProgressText = document.getElementById('assessment-progress-text');
  const currentQuestionText = document.getElementById('current-question-text');
  const questionOptionsContainer = document.getElementById('question-options-container');
  const prevQuestionButton = document.getElementById('prev-question-button');
  const nextQuestionButton = document.getElementById('next-question-button');
  const reportOverallScore = document.getElementById('report-overall-score');
  const reportMarketPosition = document.getElementById('report-market-position');
  const reportCompetitiveEdge = document.getElementById('report-competitive-edge');
  const reportExecutionCapability = document.getElementById('report-execution-capability');
  const reportRecommendationsList = document.getElementById('report-recommendations-list');
  const newAssessmentButton = document.getElementById('new-assessment-button');

  let currentQuestionIndex = 0;
  let answers = {}; // Store answers for each question
  let selectedAssessmentArea = '';

  const questions = {
    'Go-to-Market Strategy': [
      {
        question: 'How well defined is your target market and customer segmentation?',
        options: ['Not defined', 'Partially defined', 'Well defined', 'Very well defined'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'What is the clarity of your value proposition and messaging?',
        options: ['Unclear', 'Somewhat clear', 'Clear', 'Very clear'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'How effective are your current customer acquisition channels?',
        options: ['Ineffective', 'Somewhat effective', 'Effective', 'Highly effective'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'To what extent do you track and analyze customer acquisition costs (CAC)?',
        options: ['Not at all', 'Limited tracking', 'Regularly tracked', 'Optimized tracking'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'How adaptable is your go-to-market strategy to market changes?',
        options: ['Rigid', 'Somewhat adaptable', 'Adaptable', 'Highly adaptable'],
        weights: [0, 0.25, 0.5, 1]
      }
    ],
    'Brand Strategy': [
      {
        question: 'How clearly is your brand positioned in the market?',
        options: ['Unclear', 'Somewhat clear', 'Clear', 'Very clear'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'How consistent is your brand messaging across all touchpoints?',
        options: ['Inconsistent', 'Somewhat consistent', 'Consistent', 'Highly consistent'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'How effectively does your brand differentiate from competitors?',
        options: ['Not differentiated', 'Slightly differentiated', 'Differentiated', 'Highly differentiated'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'What is the perceived strength and recognition of your brand?',
        options: ['Low', 'Moderate', 'Strong', 'Very strong'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'How well does your brand resonate with your target audience?',
        options: ['Poorly', 'Moderately', 'Well', 'Very well'],
        weights: [0, 0.25, 0.5, 1]
      }
    ],
    'Digital Transformation': [
      {
        question: 'How mature is your organization\'s digital strategy?',
        options: ['Nascent', 'Developing', 'Mature', 'Leading'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'To what extent have you integrated digital technologies into core business processes?',
        options: ['Minimal', 'Partial', 'Significant', 'Extensive'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'How effective are your digital capabilities in driving business outcomes?',
        options: ['Ineffective', 'Somewhat effective', 'Effective', 'Highly effective'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'What is the level of digital literacy and skills within your workforce?',
        options: ['Low', 'Moderate', 'High', 'Very high'],
        weights: [0, 0.25, 0.5, 1]
      },
      {
        question: 'How well do you leverage data and analytics for digital decision-making?',
        options: ['Not at all', 'Limited use', 'Regularly used', 'Data-driven'],
        weights: [0, 0.25, 0.5, 1]
      }
    ]
  };

  const recommendations = {
    'Go-to-Market Strategy': [
      'Refine target audience segmentation for precision marketing.',
      'Develop compelling value propositions tailored to each segment.',
      'Optimize digital marketing channels for improved customer acquisition.',
      'Implement advanced analytics to reduce customer acquisition costs.',
      'Establish agile frameworks for rapid strategy adaptation.'
    ],
    'Brand Strategy': [
      'Conduct a brand audit to clarify market positioning.',
      'Develop a comprehensive brand style guide for consistent messaging.',
      'Analyze competitor branding to identify unique differentiation points.',
      'Invest in brand awareness campaigns to boost recognition.',
      'Gather customer feedback to ensure brand resonance.'
    ],
    'Digital Transformation': [
      'Develop a clear digital transformation roadmap with measurable milestones.',
      'Invest in new digital technologies to streamline core business processes.',
      'Implement training programs to enhance digital literacy across the organization.',
      'Establish a data governance framework to maximize data leverage.',
      'Foster a culture of innovation and continuous digital improvement.'
    ]
  };

  function resetAssessment() {
    currentQuestionIndex = 0;
    answers = {};
    selectedAssessmentArea = '';
    assessmentOptionsGrid.style.display = 'grid';
    liveAssessmentView.style.display = 'none';
    reportView.style.display = 'none';
    assessmentProgressBarFill.style.width = '0%';
    assessmentProgressText.textContent = '0 of 0 questions';
    prevQuestionButton.disabled = true;
    nextQuestionButton.disabled = true;
  }

  function startAssessment(area) {
    selectedAssessmentArea = area;
    assessmentOptionsGrid.style.display = 'none';
    liveAssessmentView.style.display = 'block';
    loadQuestion();
  }

  function loadQuestion() {
    const currentQuestions = questions[selectedAssessmentArea];
    if (!currentQuestions || currentQuestionIndex >= currentQuestions.length) {
      generateReport();
      return;
    }

    const questionData = currentQuestions[currentQuestionIndex];
    currentQuestionText.textContent = questionData.question;
    questionOptionsContainer.innerHTML = '';

    questionData.options.forEach((option, index) => {
      const optionDiv = document.createElement('label');
      optionDiv.classList.add('live-assessment-option');
      optionDiv.innerHTML = `
        <input type="radio" name="question-${currentQuestionIndex}" value="${index}" />
        <span>${option}</span>
      `;
      const radioInput = optionDiv.querySelector('input');
      if (answers[currentQuestionIndex] === index) {
        radioInput.checked = true;
      }
      radioInput.addEventListener('change', (e) => {
        answers[currentQuestionIndex] = parseInt(e.target.value);
        updateNavigationButtons();
      });
      questionOptionsContainer.appendChild(optionDiv);
    });

    updateProgressBar();
    updateNavigationButtons();
  }

  function updateProgressBar() {
    const totalQuestions = questions[selectedAssessmentArea].length;
    const answeredQuestions = Object.keys(answers).length;
    const progress = (answeredQuestions / totalQuestions) * 100;
    assessmentProgressBarFill.style.width = `${progress}%`;
    assessmentProgressText.textContent = `${answeredQuestions} of ${totalQuestions} questions`;
  }

  function updateNavigationButtons() {
    const totalQuestions = questions[selectedAssessmentArea].length;
    prevQuestionButton.disabled = currentQuestionIndex === 0;
    nextQuestionButton.disabled = answers[currentQuestionIndex] === undefined;

    if (currentQuestionIndex === totalQuestions - 1 && answers[currentQuestionIndex] !== undefined) {
      nextQuestionButton.textContent = 'Submit Assessment';
      nextQuestionButton.classList.add('bg-gradient-cta');
      nextQuestionButton.classList.remove('bg-transparent');
    } else {
      nextQuestionButton.textContent = 'Next';
      nextQuestionButton.classList.remove('bg-gradient-cta');
      nextQuestionButton.classList.add('bg-transparent');
    }
  }

  function generateReport() {
    liveAssessmentView.style.display = 'none';
    reportView.style.display = 'block';

    const currentQuestions = questions[selectedAssessmentArea];
    let totalWeightedScore = 0;
    let maxPossibleScore = 0;

    Object.keys(answers).forEach(qIndex => {
      const questionData = currentQuestions[qIndex];
      const selectedOptionIndex = answers[qIndex];
      totalWeightedScore += questionData.weights[selectedOptionIndex];
      maxPossibleScore += 1; // Each question contributes a max of 1 to the score
    });

    const overallScore = maxPossibleScore > 0 ? Math.round((totalWeightedScore / maxPossibleScore) * 100) : 0;

    // Placeholder for specific scores, can be made more dynamic
    const marketPositionScore = Math.round(overallScore * 0.85);
    const competitiveEdgeScore = Math.round(overallScore * 0.92);
    const executionCapabilityScore = Math.round(overallScore * 0.78);

    reportOverallScore.textContent = overallScore;
    reportMarketPosition.textContent = `${marketPositionScore}%`;
    reportCompetitiveEdge.textContent = `${competitiveEdgeScore}%`;
    reportExecutionCapability.textContent = `${executionCapabilityScore}%`;

    reportRecommendationsList.innerHTML = '';
    recommendations[selectedAssessmentArea].forEach(rec => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fa-solid fa-check text-teal"></i><span>${rec}</span>`;
      reportRecommendationsList.appendChild(li);
    });
  }

  // Event listeners for assessment options
  document.querySelectorAll('.assessment-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const area = card.dataset.assessmentArea;
      startAssessment(area);
    });
  });

  if (assessmentModalExitButton) {
    assessmentModalExitButton.addEventListener('click', () => {
      assessmentModalOverlay.classList.remove('open');
      document.body.classList.remove('admin-unlocked');
      if (adminAccessButton) {
        adminAccessButton.style.display = 'flex'; // Show admin button again
      }
      resetAssessment();
    });
  }

  if (prevQuestionButton) {
    prevQuestionButton.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
      }
    });
  }

  if (nextQuestionButton) {
    nextQuestionButton.addEventListener('click', () => {
      const totalQuestions = questions[selectedAssessmentArea].length;
      if (answers[currentQuestionIndex] !== undefined) {
        if (currentQuestionIndex < totalQuestions - 1) {
          currentQuestionIndex++;
          loadQuestion();
        } else {
          // Last question, submit assessment
          generateReport();
        }
      }
    });
  }

  if (newAssessmentButton) {
    newAssessmentButton.addEventListener('click', () => {
      resetAssessment();
      assessmentModalOverlay.classList.remove('open');
      document.body.classList.remove('admin-unlocked');
      if (adminAccessButton) {
        adminAccessButton.style.display = 'flex';
      }
    });
  }

  // Timer functionality (placeholder, not fully implemented for actual countdown)
  const timerElement = document.getElementById('assessment-timer');
  let seconds = 0;
  let minutes = 0;
  let timerInterval;

  function startTimer() {
    timerInterval = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        seconds = 0;
        minutes++;
      }
      if (timerElement) {
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  // Start timer when assessment modal opens
  assessmentModalOverlay.addEventListener('transitionend', () => {
    if (assessmentModalOverlay.classList.contains('open')) {
      seconds = 0;
      minutes = 0;
      if (timerElement) {
        timerElement.textContent = '00:00';
      }
      startTimer();
    } else {
      stopTimer();
    }
  });
});
