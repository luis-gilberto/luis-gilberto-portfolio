/* LG Studio · Project Intake */
(function () {
  'use strict';

  var FORMSPREE = 'https://formspree.io/f/xblkwyan';
  var FOCUS_MAP = {
    web: 'New website',
    brand: 'Brand / visual identity',
    campaign: 'Marketing / campaign support'
  };

  var root = document.getElementById('lg-intake');
  var form = document.getElementById('intake-form');
  if (!root || !form) return;

  var panels = {
    intro: root.querySelector('[data-panel="intro"]'),
    1: root.querySelector('[data-panel="1"]'),
    2: root.querySelector('[data-panel="2"]'),
    3: root.querySelector('[data-panel="3"]'),
    4: root.querySelector('[data-panel="4"]'),
    done: root.querySelector('[data-panel="done"]')
  };

  var progress = document.getElementById('intake-progress');
  var stepPos = document.getElementById('intake-step-pos');
  var trackFill = document.getElementById('intake-track-fill');
  var formError = document.getElementById('intake-form-error');
  var submitBtn = document.getElementById('intake-submit');

  var state = {
    view: 'intro',
    areas: [],
    processStage: '',
    timing: '',
    submitting: false,
    submitted: false,
    started: false
  };

  function params() {
    try {
      return new URLSearchParams(window.location.search || '');
    } catch (e) {
      return new URLSearchParams();
    }
  }

  function track(eventName, props) {
    try {
      if (typeof window.plausible === 'function') {
        if (props) window.plausible(eventName, { props: props });
        else window.plausible(eventName);
      }
    } catch (e) { /* ignore */ }
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function showView(view) {
    state.view = view;
    Object.keys(panels).forEach(function (key) {
      var el = panels[key];
      if (!el) return;
      var active = String(key) === String(view);
      el.classList.toggle('is-active', active);
      if (active) el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    });

    var stepNum = Number(view);
    var onSteps = stepNum >= 1 && stepNum <= 4;
    if (progress) {
      if (onSteps) progress.removeAttribute('hidden');
      else progress.setAttribute('hidden', '');
    }
    if (onSteps && stepPos && trackFill) {
      stepPos.innerHTML = '<span class="lg-intake__step-n">' + pad(stepNum) + '</span> / 04';
      trackFill.style.width = (stepNum / 4) * 100 + '%';
    }

    var focusTarget = null;
    if (view === 'intro') focusTarget = root.querySelector('[data-action="start"]');
    else if (view === 'done') focusTarget = panels.done;
    else if (view === 1) focusTarget = document.getElementById('full_name');
    else if (view === 2) focusTarget = document.getElementById('why_now');
    else if (view === 3) focusTarget = document.getElementById('desired_change');
    else if (view === 4) focusTarget = document.getElementById('conversation_priority');
    if (focusTarget) {
      try { focusTarget.focus({ preventScroll: true }); } catch (e) { focusTarget.focus(); }
    }

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }

  function clearFieldError(id) {
    var input = document.getElementById(id);
    var err = document.getElementById('err-' + id);
    if (input) {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
    if (err) {
      err.textContent = '';
      err.setAttribute('hidden', '');
    }
  }

  function setFieldError(id, message) {
    var input = document.getElementById(id);
    var err = document.getElementById('err-' + id);
    if (input) {
      input.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      if (err) input.setAttribute('aria-describedby', err.id);
    }
    if (err) {
      err.textContent = message;
      err.removeAttribute('hidden');
    }
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? String(el.value || '').trim() : '';
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function normalizeWebsite(v) {
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    if (/^[\w.-]+\.[a-z]{2,}/i.test(v)) return 'https://' + v;
    return v;
  }

  function validateStep(step) {
    var ok = true;
    var firstInvalid = null;

    if (step === 1) {
      clearFieldError('full_name');
      clearFieldError('email');
      if (!val('full_name')) {
        setFieldError('full_name', 'Please add your name.');
        ok = false;
        firstInvalid = firstInvalid || document.getElementById('full_name');
      }
      var email = val('email');
      if (!email) {
        setFieldError('email', 'Please add your email.');
        ok = false;
        firstInvalid = firstInvalid || document.getElementById('email');
      } else if (!isEmail(email)) {
        setFieldError('email', 'Please enter a valid email address.');
        ok = false;
        firstInvalid = firstInvalid || document.getElementById('email');
      }
      var site = val('website');
      if (site) {
        var normalized = normalizeWebsite(site);
        document.getElementById('website').value = normalized;
      }
    }

    if (step === 2) {
      clearFieldError('why_now');
      if (!val('why_now')) {
        setFieldError('why_now', 'A short note on what’s prompting this helps.');
        ok = false;
        firstInvalid = firstInvalid || document.getElementById('why_now');
      }
    }

    if (step === 3) {
      clearFieldError('desired_change');
      if (!val('desired_change')) {
        setFieldError('desired_change', 'Share what you’d like to be different.');
        ok = false;
        firstInvalid = firstInvalid || document.getElementById('desired_change');
      }
    }

    if (firstInvalid) firstInvalid.focus();
    return ok;
  }

  function syncHiddenFields() {
    document.getElementById('field-areas').value = state.areas.join(', ');
    document.getElementById('field-process-stage').value = state.processStage;
    document.getElementById('field-timing').value = state.timing;
    document.getElementById('field-submitted-at').value = new Date().toISOString();
  }

  function setArea(label, on) {
    var idx = state.areas.indexOf(label);
    if (on && idx === -1) state.areas.push(label);
    if (!on && idx !== -1) state.areas.splice(idx, 1);
    root.querySelectorAll('.lg-intake__chip').forEach(function (c) {
      if (c.getAttribute('data-area') === label) {
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    });
  }

  function selectChoice(groupId, value) {
    var group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll('.lg-intake__choice').forEach(function (btn) {
      var match = btn.getAttribute('data-value') === value;
      btn.setAttribute('aria-checked', match ? 'true' : 'false');
    });
    if (groupId === 'stage-group') state.processStage = value;
    if (groupId === 'timing-group') {
      state.timing = value;
      var reveal = document.getElementById('timing-details');
      if (reveal) {
        if (value === 'Specific date / event') reveal.removeAttribute('hidden');
        else reveal.setAttribute('hidden', '');
      }
    }
  }

  function initAttribution() {
    var q = params();
    var ref = (q.get('ref') || '').trim().toLowerCase();
    var focus = (q.get('focus') || '').trim().toLowerCase();
    document.getElementById('field-referral-source').value = ref;
    document.getElementById('field-focus-source').value = focus;

    if (FOCUS_MAP[focus]) {
      setArea(FOCUS_MAP[focus], true);
    }
  }

  function goNext() {
    var view = state.view;
    if (view === 'intro') {
      if (!state.started) {
        state.started = true;
        track('intake_started', attributionProps());
      }
      showView(1);
      return;
    }
    var step = Number(view);
    if (!validateStep(step)) return;
    if (step === 1) {
      showView(2);
      track('intake_step_2', attributionProps());
    } else if (step === 2) {
      showView(3);
      track('intake_step_3', attributionProps());
    } else if (step === 3) {
      showView(4);
      track('intake_step_4', attributionProps());
    }
  }

  function goBack() {
    var view = state.view;
    if (view === 1) showView('intro');
    else if (view === 2) showView(1);
    else if (view === 3) showView(2);
    else if (view === 4) showView(3);
  }

  function attributionProps() {
    var props = {};
    var ref = document.getElementById('field-referral-source').value;
    var focus = document.getElementById('field-focus-source').value;
    if (ref) props.referral_source = ref;
    if (focus) props.focus_source = focus;
    return Object.keys(props).length ? props : undefined;
  }

  async function submitForm(e) {
    e.preventDefault();
    if (state.submitting || state.submitted) return;
    if (!validateStep(1)) { showView(1); return; }
    if (!validateStep(2)) { showView(2); return; }
    if (!validateStep(3)) { showView(3); return; }

    state.submitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }
    if (formError) {
      formError.setAttribute('hidden', '');
      formError.textContent = '';
    }

    syncHiddenFields();
    var site = document.getElementById('website');
    if (site && site.value) site.value = normalizeWebsite(site.value.trim());

    try {
      var res = await fetch(FORMSPREE, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });

      if (res.ok) {
        state.submitted = true;
        track('intake_submitted', attributionProps());
        form.setAttribute('hidden', '');
        showView('done');
        return;
      }

      var msg = 'Something went wrong sending this. Please try again, or email me directly.';
      try {
        var data = await res.json();
        if (data && data.error) msg = data.error;
      } catch (err) { /* ignore */ }
      if (formError) {
        formError.textContent = msg;
        formError.removeAttribute('hidden');
      }
    } catch (err) {
      if (formError) {
        formError.textContent = 'Network error. Check your connection and try again.';
        formError.removeAttribute('hidden');
      }
    } finally {
      state.submitting = false;
      if (submitBtn && !state.submitted) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send context';
      }
    }
  }

  /* Events */
  root.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    if (btn) {
      var action = btn.getAttribute('data-action');
      if (action === 'start' || action === 'continue') goNext();
      if (action === 'back') goBack();
      return;
    }

    var chip = e.target.closest('.lg-intake__chip');
    if (chip) {
      var area = chip.getAttribute('data-area');
      var on = chip.getAttribute('aria-pressed') !== 'true';
      setArea(area, on);
      return;
    }

    var choice = e.target.closest('.lg-intake__choice');
    if (choice) {
      var group = choice.closest('[id$="-group"]');
      if (group) selectChoice(group.id, choice.getAttribute('data-value'));
    }
  });

  form.addEventListener('submit', submitForm);

  ['full_name', 'email', 'why_now', 'desired_change'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () { clearFieldError(id); });
  });

  /* Keyboard for radiogroups */
  root.querySelectorAll('[role="radiogroup"]').forEach(function (group) {
    group.addEventListener('keydown', function (e) {
      var choices = Array.prototype.slice.call(group.querySelectorAll('.lg-intake__choice'));
      var i = choices.indexOf(document.activeElement);
      if (i < 0) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        var next = choices[(i + 1) % choices.length];
        next.focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var prev = choices[(i - 1 + choices.length) % choices.length];
        prev.focus();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        selectChoice(group.id, document.activeElement.getAttribute('data-value'));
      }
    });
  });

  initAttribution();
  showView('intro');
})();
