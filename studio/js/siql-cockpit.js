(function () {
  'use strict';

  document.documentElement.classList.add('js-enabled');

  var INK = '#18242F';
  var CORAL = '#BC6044';

  var CALIBRATION_MAP = {
    friction: {
      pattern: 'Decision Friction Loop',
      patternSub: '· clarity-lock subtype',
      readHeadline: 'The work keeps reopening the same choices.',
      readBody: 'Every channel looks active, but nothing closes. The team is busy interpreting what you meant instead of executing what was decided.',
      whyBody: 'Your dials show high activity with low closure. Decision Friction is the lowest signal · meaning the constraint is not capacity, it is unresolved priority.',
      constraintBody: 'The constraint is decision drag, not effort. Standards live in conversation instead of on the page. Until one rule is written, every new request reopens the same fork.',
      priorityHeadline: 'One decision written and owned.',
      priorityBody: 'Not the whole strategy. One rule with limits · applied once by someone else this week.',
      moves: [
        { head: 'Name the recurring fork.', sub: '(the decision that keeps reopening)' },
        { head: 'Write the rule with limits.', sub: '(what is theirs to decide · what is not)' },
        { head: 'Assign one owner for the week.', sub: '(no routing back through you)' },
        { head: 'Review against the rule on Friday.', sub: '(gaps become the next write-down)' }
      ],
      signal: 'Read from a direct signal: decisions reopening after they were made.',
      avoid: [
        'More meetings add interpretation, not closure.',
        'Another deck reframes the fork without closing it.',
        'Hiring adds reviewers, not decision owners.',
        'Do not take the decision back · fix the written rule.'
      ]
    },
    leak: {
      pattern: 'Capacity Leak Pattern',
      patternSub: '· throughput-loss subtype',
      readHeadline: 'Effort is high · movement is low.',
      readBody: 'The team is producing, but the work does not compound. Output disappears into rework, handoffs, and tools that do not connect.',
      whyBody: 'Capacity Leak is your lowest dial · effort is converting to motion slower than it should. The build exists, but the system around it leaks throughput.',
      constraintBody: 'The constraint is structural loss, not headcount. Work enters the pipeline but exits without a map. Fixing one surface will not stop the leak until the handoff is defined.',
      priorityHeadline: 'One handoff made explicit.',
      priorityBody: 'Map where work enters · where it exits · and who owns the step between.',
      moves: [
        { head: 'Draw the current handoff.', sub: '(where work stalls between roles)' },
        { head: 'Define the exit standard.', sub: '(what done means at that step)' },
        { head: 'Test with one live item.', sub: '(one project through the new gate)' },
        { head: 'Measure cycle time after.', sub: '(did movement increase without more hours)' }
      ],
      signal: 'Read from a direct signal: high output with flat throughput.',
      avoid: [
        'Adding tools before mapping the handoff.',
        'More hours make the leak faster, not smaller.',
        'Hiring into a broken pipeline multiplies the leak.',
        'Do not optimize the surface · fix the handoff.'
      ]
    },
    clarity: {
      pattern: 'Signal Clarity Gap',
      patternSub: '· message-drift subtype',
      readHeadline: 'The offer is real · the signal is not.',
      readBody: 'People encounter the work but cannot repeat what it is for. The story shifts by channel, audience, and meeting.',
      whyBody: 'Signal Clarity is the lowest dial · the idea is viable but the message does not hold. Audiences cannot self-select because the promise is not stable.',
      constraintBody: 'The constraint is message drift, not channel count. More distribution amplifies confusion. Until one promise is locked, every touchpoint invents a new version.',
      priorityHeadline: 'One promise · one audience.',
      priorityBody: 'Write the sentence a stranger could repeat. Test it before adding another channel.',
      moves: [
        { head: 'Write the one-sentence promise.', sub: '(what changes for whom)' },
        { head: 'Cut every line that contradicts it.', sub: '(site · deck · outreach)' },
        { head: 'Publish on one surface first.', sub: '(one place the promise lives)' },
        { head: 'Listen for repeat-back.', sub: '(can they say it without you)' }
      ],
      signal: 'Read from a direct signal: audiences cannot repeat the offer.',
      avoid: [
        'A rebrand before the promise is locked.',
        'More content adds noise, not clarity.',
        'Paid reach amplifies an unclear signal.',
        'Do not polish the surface · lock the promise.'
      ]
    }
  };

  var ActionPathMap = {
    friction: [
      { day: 'Day 1', text: 'Audit the last 5 reopened decisions · name the fork each one revisited.' },
      { day: 'Day 2', text: 'Define a decision-gate · what must be true before this choice opens again.' },
      { day: 'Day 3', text: 'Write the rule with limits · <span class="accent-text">what is theirs to decide · what is not</span>.' },
      { day: 'Day 4', text: 'Assign one owner for the week · <span class="accent-text">no routing back through you</span>.' },
      { day: 'Day 5', text: 'Run one live decision through the gate · document where it held.' },
      { day: 'Day 6', text: 'Cut one meeting that only reopens closed choices.' },
      { day: 'Day 7', text: 'Lock the floor · review against the rule · <span class="accent-text">gaps become the next write-down</span>.' }
    ],
    leak: [
      { day: 'Day 1', text: 'Identify the $0/hr tasks · work that burns time without moving the map.' },
      { day: 'Day 2', text: 'The Kill List · stop · delegate · or delete <span class="accent-text">three recurring drains</span>.' },
      { day: 'Day 3', text: 'Map the handoff where work stalls between roles.' },
      { day: 'Day 4', text: 'Define exit standard · <span class="accent-text">what done means at that step</span>.' },
      { day: 'Day 5', text: 'Protect the high-leverage block · one 90-minute window · no meetings inside it.' },
      { day: 'Day 6', text: 'Test one live item through the new gate.' },
      { day: 'Day 7', text: 'Measure cycle time · did movement increase <span class="accent-text">without more hours</span>.' }
    ],
    clarity: [
      { day: 'Day 1', text: 'Write down the 5 competing priorities · all of them · on one page.' },
      { day: 'Day 2', text: 'Star only one · <span class="accent-text">the promise everything else must serve</span>.' },
      { day: 'Day 3', text: 'Cut every line that contradicts it · site · deck · outreach.' },
      { day: 'Day 4', text: 'Ignore the others for the week · no new channels · no side bets.' },
      { day: 'Day 5', text: 'Publish the promise on <span class="accent-text">one surface first</span>.' },
      { day: 'Day 6', text: 'Ask one outsider to repeat it back · without your explanation.' },
      { day: 'Day 7', text: 'Log where repeat-back failed · <span class="accent-text">that gap is the next edit</span>.' }
    ]
  };

  function renderActionPath(axisKey) {
    var list = document.getElementById('siql-action-path');
    var path = ActionPathMap[axisKey];
    if (!list || !path) return;

    list.innerHTML = path.map(function (entry) {
      return '<li><span class="ed-mono ed-readout-day">' + entry.day + '</span><p>' + entry.text + '</p></li>';
    }).join('');
  }

  function initCalibration() {
    var friction = document.getElementById('sFriction');
    var leak = document.getElementById('sLeak');
    var clarity = document.getElementById('sClarity');
    if (!friction || !leak || !clarity) return;

    var sliders = [
      { el: friction, val: document.getElementById('valFriction'), key: 'friction' },
      { el: leak, val: document.getElementById('valLeak'), key: 'leak' },
      { el: clarity, val: document.getElementById('valClarity'), key: 'clarity' }
    ];

    function setText(id, html) {
      var node = document.getElementById(id);
      if (node) node.innerHTML = html;
    }

    function render() {
      var values = sliders.map(function (s) {
        return { key: s.key, value: +s.el.value };
      });

      values.forEach(function (item, i) {
        sliders[i].val.textContent = item.value;
        sliders[i].el.style.setProperty('--siql-fill', item.value + '%');
      });

      var lowest = values.reduce(function (min, item) {
        return item.value < min.value ? item : min;
      }, values[0]);

      var map = CALIBRATION_MAP[lowest.key];
      if (!map) return;

      var avg = Math.round(values.reduce(function (sum, item) { return sum + item.value; }, 0) / values.length);
      var confidence = avg >= 60 ? 'High' : avg >= 35 ? 'Moderate' : 'Low';

      setText('siql-pattern-title', map.pattern + ' <span class="ed-readout-pattern-sub">' + map.patternSub + '</span>');
      setText('siql-read-headline', map.readHeadline);
      setText('siql-read-body', map.readBody);
      setText('siql-why-body', map.whyBody);
      setText('siql-constraint-body', map.constraintBody);
      setText('siql-priority-headline', map.priorityHeadline);
      setText('siql-priority-body', map.priorityBody);
      setText('siql-signal-body', map.signal);

      map.moves.forEach(function (move, index) {
        var n = index + 1;
        setText('siql-move-' + n + '-head', move.head);
        setText('siql-move-' + n + '-sub', move.sub);
      });

      map.avoid.forEach(function (line, index) {
        setText('siql-avoid-' + (index + 1), line);
      });

      renderActionPath(lowest.key);

      setText('siql-readiness', 'Readiness · <span class="accent-text">' + avg + '</span>');
      setText('siql-confidence', confidence);
      setText('siql-index-score', avg + '<span>/100</span>');

      var constraintLabel = document.getElementById('siql-constraint-label');
      if (constraintLabel) {
        var labels = { friction: 'Decision Friction', leak: 'Capacity Leak', clarity: 'Signal Clarity' };
        constraintLabel.textContent = '03 · Constraint · ' + labels[lowest.key];
      }
    }

    sliders.forEach(function (s) {
      s.el.addEventListener('input', render);
    });

    render();
  }

  function initAperture() {
    var canvas = document.getElementById('aperture');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var W = canvas.width;
    var H = canvas.height;
    var apX = W * 0.5;
    var apH = H * 0.16;
    var particles = [];
    var COLORS = {
      noise: 'rgba(24, 36, 47, 0.14)',
      signal: CORAL,
      decision: INK
    };

    function spawn() {
      particles.push({
        x: -10,
        y: Math.random() * H,
        vx: 1.4 + Math.random() * 1.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: 1.5 + Math.random() * 2.2,
        state: 'noise',
        passed: false
      });
    }

    function step() {
      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(24, 36, 47, 0.22)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(apX, 0);
      ctx.lineTo(apX, H / 2 - apH / 2);
      ctx.moveTo(apX, H / 2 + apH / 2);
      ctx.lineTo(apX, H);
      ctx.stroke();

      ctx.fillStyle = CORAL;
      ctx.fillRect(apX - 1, H / 2 - apH / 2 - 6, 3, 6);
      ctx.fillRect(apX - 1, H / 2 + apH / 2, 3, 6);

      if (Math.random() < 0.55) spawn();

      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];

        if (!p.passed && p.x < apX) {
          var pull = (H / 2 - p.y) * 0.012 * (1 - (apX - p.x) / apX);
          p.vy += pull;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.96;

        if (!p.passed && p.x >= apX) {
          var withinGap = Math.abs(p.y - H / 2) < apH / 2;
          if (withinGap) {
            p.passed = true;
            p.state = Math.random() < 0.5 ? 'signal' : 'decision';
            p.vx = 2.2 + Math.random() * 1.5;
            p.vy = (Math.random() - 0.5) * 1.2;
            p.r = p.state === 'decision' ? 3 : 2.4;
          } else {
            p.vx *= -0.4;
            p.x = apX - 2;
            p.vy += p.y < H / 2 ? -0.5 : 0.5;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[p.state];
        ctx.fill();

        if (p.x > W + 12 || p.y < -12 || p.y > H + 12) particles.splice(i, 1);
      }

      if (particles.length > 420) particles.splice(0, particles.length - 420);
      requestAnimationFrame(step);
    }

    step();
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.ed-siql-reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.ed-siql-reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initMapRail() {
    var rail = document.querySelector('[data-strategyiq-rail]');
    if (!rail) return;

    var links = rail.querySelectorAll('[data-strategyiq-rail-link]');
    var sections = document.querySelectorAll('[data-strategyiq-section]');
    if (!links.length || !sections.length) return;

    function setActive(id) {
      links.forEach(function (link) {
        var li = link.closest('li');
        var isActive = link.getAttribute('data-strategyiq-rail-link') === id;
        if (li) li.classList.toggle('is-active', isActive);
        link.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var id = link.getAttribute('data-strategyiq-rail-link');
        var target = document.querySelector('[data-strategyiq-section="' + id + '"]');
        if (target) {
          setActive(id);
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (entry) { return entry.isIntersecting; });
        if (!visible.length) return;
        visible.sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        setActive(visible[0].target.getAttribute('data-strategyiq-section'));
      }, {
        root: null,
        rootMargin: '-18% 0px -52% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      });

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }
  }

  function init() {
    initCalibration();
    initAperture();
    initReveal();
    initMapRail();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
