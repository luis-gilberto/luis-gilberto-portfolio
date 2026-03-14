const erasData = {
  genesis: {
    title: 'Genesis',
    years: '2000–2003',
    quote: 'Every journey begins with a single step into the unknown.',
    description: 'Arrived in the U.S. on a scholarship. Earned my degree. Learned to navigate a new culture while building the foundation for everything that followed.',
    achievements: [
      'Completed undergraduate degree on full scholarship',
      'Adapted to new cultural and professional environment',
      'Built foundational skills in communication and strategy',
      'Established work ethic and resilience that defined my career'
    ]
  },
  emergence: {
    title: 'Emergence',
    years: '2003–2007',
    quote: 'In chaos, I found my rhythm.',
    description: 'Joined startups in mobile entertainment. Wore every hat imaginable - from content creation to business development. Learned to move fast and think strategically.',
    achievements: [
      'Pioneered mobile entertainment content strategies',
      'Managed cross-functional projects in fast-paced startup environments',
      'Developed versatility across creative and business functions',
      'Built network in emerging tech industry'
    ]
  },
  convergence: {
    title: 'Convergence',
    years: '2007–2012',
    quote: 'When opportunity knocked, I answered with everything I had.',
    description: 'Microsoft came calling. Scaled from startup scrappiness to corporate precision. Learned to create campaigns that moved millions while maintaining creative integrity.',
    achievements: [
      'Joined Microsoft as Marketing Manager',
      'Led global campaigns reaching millions of users',
      'Bridged creative vision with corporate strategy',
      'Established reputation for high-impact marketing execution'
    ]
  },
  foundations: {
    title: 'Foundations',
    years: '2012–2014',
    quote: 'I found my voice by writing through the noise.',
    description: 'Built editorial muscle through relentless content creation. Established early brand partnerships. Learned that consistency compounds.',
    achievements: [
      'Developed strong editorial voice and content strategy',
      'Secured early brand partnerships and collaborations',
      'Built consistent publishing rhythm and audience',
      'Refined storytelling craft through daily practice'
    ]
  },
  ascent: {
    title: 'Ascent',
    years: '2014–2016',
    quote: 'Mastery is earned through deliberate practice.',
    description: 'Refined my craft. Scaled my impact. Deepened my expertise in integrated marketing and creative strategy.',
    achievements: [
      'Led major integrated marketing campaigns',
      'Expanded skill set across digital and traditional channels',
      'Mentored junior team members',
      'Achieved measurable business results through creative excellence'
    ]
  },
  expansion: {
    title: 'Expansion',
    years: '2016–2018',
    quote: 'Growth happens at the edge of comfort.',
    description: 'Pushed creative and technical boundaries. Explored new mediums. Grew as both strategist and maker.',
    achievements: [
      'Expanded into new creative mediums and technologies',
      'Led innovation initiatives within marketing organization',
      'Built cross-disciplinary expertise',
      'Delivered award-worthy campaign work'
    ]
  },
  disruption: {
    title: 'Disruption',
    years: '2019–2020',
    quote: 'Sometimes you have to break to rebuild stronger.',
    description: 'Faced professional setbacks. Questioned everything. Used the pause to regenerate my approach and clarify my values.',
    achievements: [
      'Navigated career transition with resilience',
      'Reassessed professional priorities and values',
      'Developed new strategic frameworks',
      'Emerged with clearer sense of purpose'
    ]
  },
  reinvention: {
    title: 'Reinvention',
    years: '2020–2022',
    quote: 'Identity is not found - it is forged.',
    description: 'Integrated new identity. Clarified my values. Built systems that reflected who I had become, not who I was.',
    achievements: [
      'Launched independent consulting practice',
      'Developed proprietary frameworks and methodologies',
      'Built personal brand ecosystem',
      'Established thought leadership in strategic design'
    ]
  },
  integration: {
    title: 'Integration',
    years: '2022–Present',
    quote: 'The future is built by those who show up with intention.',
    description: 'Merged 25 years of experience with clear intention. Building AI-powered tools. Consulting with purpose. Creating with impact.',
    achievements: [
      'Integrated AI into consulting practice',
      'Launched The Hub (productized consulting tools)',
      'Established Insights (editorial platform)',
      'Built comprehensive portfolio ecosystem'
    ]
  }
};

function initTheme() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
  
  document.querySelectorAll('.theme-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  });
}

function initParticles() {
  const container = document.getElementById('particleContainer');
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 3}s`;
    container.appendChild(particle);
  }
}

function initFilmstrip() {
  const container = document.getElementById('cardsContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressBar = document.getElementById('progressBar');
  const cards = document.querySelectorAll('.fs-card');
  
  let currentIndex = 0;
  const cardWidth = 320;
  const gap = 24;
  const totalCards = cards.length;
  
  function updateFilmstrip() {
    const offset = currentIndex * (cardWidth + gap);
    container.style.transform = `translateX(-${offset}px)`;
    progressBar.style.width = `${((currentIndex + 1) / totalCards) * 100}%`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalCards - 1;
  }
  
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateFilmstrip();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalCards - 1) {
      currentIndex++;
      updateFilmstrip();
    }
  });
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      openModal(card.dataset.era);
    });
  });
  
  updateFilmstrip();
}

function initMobileStack() {
  const mobileStack = document.getElementById('mobileStack');
  const cards = document.querySelectorAll('.fs-card');
  
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.addEventListener('click', () => {
      openModal(clone.dataset.era);
    });
    mobileStack.appendChild(clone);
  });
}

function openModal(era) {
  const modal = document.getElementById('timelineModal');
  const data = erasData[era];
  
  if (!data) return;
  
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalQuote').textContent = `"${data.quote}"`;
  document.getElementById('modalDescription').textContent = data.description;
  
  const achievementsList = document.getElementById('achievementsList');
  achievementsList.innerHTML = '';
  data.achievements.forEach(achievement => {
    const li = document.createElement('li');
    li.textContent = achievement;
    achievementsList.appendChild(li);
  });
  
  const heroMedia = document.getElementById('modalHeroMedia');
  const originalCard = document.querySelector(`[data-era="${era}"]`);
  const originalMedia = originalCard.querySelector('.fs-media');
  heroMedia.innerHTML = originalMedia.innerHTML;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('timelineModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function initModal() {
  document.getElementById('modalOverlay').addEventListener('click', closeModal);
  document.getElementById('modalClose').addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticles();
  initFilmstrip();
  initMobileStack();
  initModal();
});
