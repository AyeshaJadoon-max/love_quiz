/**
 * Just For You ❤️ – Romantic Love Quiz Website
 * Redesigned with 7 Distinct Visual Question Styles, 3D Envelope Opening,
 * Quiz Intro, Interactive 3D Surprise Gift Box, Web Audio Synthesis & Confetti
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. EXACT QUIZ DATA (10 Questions, Options & 7 Unique Visual Styles)
     ========================================================================== */
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      style: "heart-card",
      styleName: "Heart Card 💖",
      question: "Who fell in love first?",
      options: [
        "You ❤️",
        "Me 🥰",
        "Both at the same time 😂"
      ],
      soundType: "chime"
    },
    {
      id: 2,
      style: "love-letter",
      styleName: "Love Letter 💌",
      question: "Who is more cute?",
      options: [
        "You 😎",
        "Me, obviously! 💅",
        "Both 💗"
      ],
      soundType: "fountain-pen"
    },
    {
      id: 3,
      style: "polaroid",
      styleName: "Polaroid Photo 📸",
      question: "Who gets angry over silly things?",
      options: [
        "You",
        "Me",
        "Both of us 🤣"
      ],
      soundType: "shutter"
    },
    {
      id: 4,
      style: "floating-bubbles",
      styleName: "Floating Bubbles 🫧",
      question: "If I get upset, how will you convince me?",
      options: [
        "Cute messages 💌",
        "Chocolate 🍫",
        "A long hug 🤗",
        "All of these ❤️"
      ],
      soundType: "bubble"
    },
    {
      id: 5,
      style: "scrapbook",
      styleName: "Scrapbook Memory 🌸",
      question: "What's your favourite thing about me?",
      options: [
        "My smile 😊",
        "My nature 💕",
        "My craziness 😂",
        "Everything about me 🥹"
      ],
      soundType: "stamp"
    },
    {
      id: 6,
      style: "gameshow",
      styleName: "Love Match Show 🎮",
      question: "Who misses the other person more?",
      options: [
        "Me ❤️",
        "You 🥺",
        "Both equally 💗"
      ],
      soundType: "buzzer"
    },
    {
      id: 7,
      style: "giftbox",
      styleName: "Surprise Gift Box 🎁",
      question: "Where would you take me on a surprise date?",
      options: [
        "A beautiful restaurant 🍽️",
        "A peaceful place 🌸",
        "A long drive 🚗",
        "Anywhere with you ❤️"
      ],
      soundType: "unravel"
    },
    {
      id: 8,
      style: "cinema-scrapbook",
      styleName: "Drama Theater 🎬",
      question: "Who is more dramatic?",
      options: [
        "You",
        "Me",
        "We're both drama queens 🤣"
      ],
      soundType: "fanfare-short"
    },
    {
      id: 9,
      style: "royal-scroll",
      styleName: "Royal Love Scroll 👑",
      question: "What nickname would you give me?",
      options: [
        "Princess 👑",
        "Cutie 🧸",
        "Trouble maker 😂",
        "My favourite person ❤️"
      ],
      soundType: "harp"
    },
    {
      id: 10,
      style: "promise-jewel",
      styleName: "Forever Promise 💍",
      question: "What's one promise you want to make to me?",
      options: [
        "Always make you smile 🥰",
        "Always respect you ❤️",
        "Always support you 🤝",
        "All of these 💍"
      ],
      soundType: "angelic"
    }
  ];

  /* ==========================================================================
     2. APPLICATION STATE
     ========================================================================== */
  const state = {
    currentIndex: 0,
    userAnswers: new Array(QUIZ_QUESTIONS.length).fill(null),
    soundEnabled: true,
    confettiRunning: false,
    envelopeOpened: false
  };

  /* ==========================================================================
     3. DOM ELEMENTS CACHE
     ========================================================================== */
  const elements = {
    // Screens
    welcomeScreen: document.getElementById('welcome-screen'),
    introScreen: document.getElementById('intro-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultScreen: document.getElementById('result-screen'),

    // Envelope & Welcome Controls
    envelopeShowcase: document.getElementById('envelope-showcase'),
    loveEnvelope: document.getElementById('love-envelope'),
    envelopeLetter: document.getElementById('envelope-letter'),
    envelopeFlap: document.getElementById('envelope-flap'),
    openHeartBtn: document.getElementById('open-heart-btn'),

    // Intro Screen Controls
    beginQuizBtn: document.getElementById('begin-quiz-btn'),

    // Sound Toggle
    soundBtn: document.getElementById('sound-btn'),
    soundIcon: document.getElementById('sound-icon'),

    // Quiz Header
    currentQNum: document.getElementById('current-q-num'),
    currentStyleBadge: document.getElementById('current-style-badge'),
    progressPercentPill: document.getElementById('progress-percent-pill'),
    progressBar: document.getElementById('quiz-progress-bar'),
    progressFill: document.getElementById('progress-fill'),

    // Quiz Dynamic Container & Footer
    questionContainer: document.getElementById('question-container'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    nextBtnText: document.getElementById('next-btn-text'),
    nextBtnIcon: document.getElementById('next-btn-icon'),
    selectionHint: document.getElementById('selection-hint'),

    // Result Screen Elements
    surpriseGiftBox: document.getElementById('surprise-gift-box'),
    summaryList: document.getElementById('summary-list'),
    restartBtn: document.getElementById('restart-btn'),
    copySummaryBtn: document.getElementById('copy-summary-btn'),
    copyLabel: document.getElementById('copy-label'),
    copyIcon: document.getElementById('copy-icon'),

    // Background Canvas & Tap Hearts
    heartsCanvas: document.getElementById('hearts-canvas'),
    tapHeartsContainer: document.getElementById('tap-hearts-container')
  };

  /* ==========================================================================
     4. SYNTHESIZED ROMANTIC SOUND EFFECTS (Web Audio API)
     ========================================================================== */
  class SoundManager {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(frequency, type = 'sine', duration = 0.15, gainValue = 0.08) {
      if (!state.soundEnabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (err) {
        // Fallback gracefully on audio restrictions
      }
    }

    playSelectChime() {
      if (!state.soundEnabled) return;
      // Soft gentle two-tone chime (E5 -> G#5)
      this.playTone(659.25, 'sine', 0.18, 0.08);
      setTimeout(() => {
        this.playTone(830.61, 'sine', 0.25, 0.09);
      }, 70);
    }

    playBubblePop() {
      if (!state.soundEnabled) return;
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      } catch (e) {}
    }

    playBuzzer() {
      if (!state.soundEnabled) return;
      // Cheerful retro arcade synth sparkle
      this.playTone(587.33, 'triangle', 0.1, 0.07);
      setTimeout(() => this.playTone(880, 'sine', 0.18, 0.09), 60);
      setTimeout(() => this.playTone(1174.66, 'sine', 0.22, 0.08), 120);
    }

    playCameraShutter() {
      if (!state.soundEnabled) return;
      this.playTone(700, 'triangle', 0.04, 0.06);
      setTimeout(() => this.playTone(550, 'sine', 0.08, 0.07), 40);
    }

    playEnvelopeOpen() {
      if (!state.soundEnabled) return;
      // Magical romantic harp-like glissando
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sine', 0.28, 0.06);
        }, idx * 60);
      });
    }

    playVictory() {
      if (!state.soundEnabled) return;
      // Romantic celebratory arpeggio: C5, E5, G5, B5, C6, E6
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 'sine', 0.38, 0.09);
        }, i * 110);
      });
    }

    playPop() {
      if (!state.soundEnabled) return;
      this.playTone(523.25, 'triangle', 0.1, 0.07);
    }

    playPrevious() {
      if (!state.soundEnabled) return;
      this.playTone(440, 'sine', 0.1, 0.05);
    }

    playByStyle(soundType) {
      if (soundType === 'bubble') this.playBubblePop();
      else if (soundType === 'buzzer') this.playBuzzer();
      else if (soundType === 'shutter') this.playCameraShutter();
      else this.playSelectChime();
    }
  }

  const sound = new SoundManager();

  /* ==========================================================================
     5. FLOATING BACKGROUND HEARTS (CANVAS)
     ========================================================================== */
  class HeartsBackground {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.hearts = [];
      this.maxHearts = 28;
      this.animationFrame = null;
      this.resize = this.resize.bind(this);
      this.loop = this.loop.bind(this);

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', this.resize);

      for (let i = 0; i < this.maxHearts; i++) {
        this.hearts.push(this.createHeart(true));
      }

      this.loop();
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    createHeart(initialRandomY = false) {
      const colors = [
        'rgba(255, 117, 140, ',
        'rgba(255, 77, 121, ',
        'rgba(255, 182, 193, ',
        'rgba(255, 154, 162, ',
        'rgba(247, 143, 179, '
      ];
      return {
        x: Math.random() * this.width,
        y: initialRandomY ? Math.random() * this.height : this.height + 30,
        size: Math.random() * 16 + 10,
        speedY: Math.random() * 0.8 + 0.35,
        speedX: Math.sin(Math.random() * Math.PI * 2) * 0.4,
        oscillationSpeed: Math.random() * 0.02 + 0.01,
        angle: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.4,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.35 + 0.18
      };
    }

    drawHeart(x, y, size, rotation, fillStyle) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(size / 30, size / 30);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-15, -15, -28, 5, 0, 26);
      ctx.bezierCurveTo(28, 5, 15, -15, 0, 0);
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.restore();
    }

    loop() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.hearts.length; i++) {
        const h = this.hearts[i];
        h.y -= h.speedY;
        h.angle += h.oscillationSpeed;
        h.x += Math.sin(h.angle) * 0.5 + h.speedX;

        this.drawHeart(h.x, h.y, h.size, h.rotation + Math.sin(h.angle) * 0.1, `${h.colorBase}${h.opacity})`);

        if (h.y < -40 || h.x < -40 || h.x > this.width + 40) {
          this.hearts[i] = this.createHeart(false);
        }
      }

      this.animationFrame = requestAnimationFrame(this.loop);
    }
  }

  // Initialize Canvas Hearts Background
  let heartsBg = null;
  if (elements.heartsCanvas) {
    heartsBg = new HeartsBackground(elements.heartsCanvas);
  }

  /* ==========================================================================
     6. CELEBRATION CONFETTI (CANVAS BASED HEARTS & SPARKLES)
     ========================================================================== */
  function triggerCelebrationConfetti() {
    state.confettiRunning = true;
    const confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'celebration-confetti-canvas';
    confettiCanvas.style.position = 'fixed';
    confettiCanvas.style.top = '0';
    confettiCanvas.style.left = '0';
    confettiCanvas.style.width = '100vw';
    confettiCanvas.style.height = '100vh';
    confettiCanvas.style.pointerEvents = 'none';
    confettiCanvas.style.zIndex = '999';
    document.body.appendChild(confettiCanvas);

    const ctx = confettiCanvas.getContext('2d');
    let width = (confettiCanvas.width = window.innerWidth);
    let height = (confettiCanvas.height = window.innerHeight);

    const particles = [];
    const particleCount = 95;
    const symbols = ['💖', '💕', '💗', '✨', '🌸', '❤️', '🥰', '🌹', '💍'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 180,
        y: height * 0.42 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 15,
        vy: -Math.random() * 14 - 5,
        gravity: 0.28,
        friction: 0.985,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        size: Math.random() * 20 + 16,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 7,
        alpha: 1,
        fadeSpeed: Math.random() * 0.007 + 0.004
      });
    }

    let startTime = Date.now();
    function animateConfetti() {
      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.fadeSpeed;

        if (p.alpha > 0 && p.y < height + 60) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.font = `${p.size}px 'Outfit', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.symbol, 0, 0);
          ctx.restore();
        }
      }

      if (aliveCount > 0 && Date.now() - startTime < 6000) {
        requestAnimationFrame(animateConfetti);
      } else {
        confettiCanvas.remove();
        state.confettiRunning = false;
      }
    }

    requestAnimationFrame(animateConfetti);
  }

  /* ==========================================================================
     7. TAP / CLICK FLOATING HEART PARTICLES
     ========================================================================== */
  function spawnTapHeart(x, y) {
    if (!elements.tapHeartsContainer) return;
    const icons = ['💖', '💕', '💗', '💓', '✨', '🌸', '🥰'];
    const heart = document.createElement('span');
    heart.className = 'tap-heart-particle';
    heart.innerText = icons[Math.floor(Math.random() * icons.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    const randomRot = (Math.random() - 0.5) * 60;
    heart.style.setProperty('--rot', `${randomRot}deg`);

    elements.tapHeartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1250);
  }

  window.addEventListener('pointerdown', (e) => {
    const target = e.target;
    if (target && (target.tagName === 'BUTTON' || target.closest('button'))) {
      return;
    }
    spawnTapHeart(e.clientX, e.clientY);
  });

  /* ==========================================================================
     8. SCREEN SWITCHING WITH SMOOTH TRANSITIONS
     ========================================================================== */
  function switchScreen(fromScreen, toScreen, callback) {
    if (fromScreen) {
      fromScreen.classList.remove('active');
    }

    setTimeout(() => {
      if (fromScreen) fromScreen.style.display = 'none';
      toScreen.style.display = 'block';

      // Trigger reflow for clean CSS transition
      void toScreen.offsetWidth;
      toScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (typeof callback === 'function') {
        callback();
      }
    }, 280);
  }

  /* ==========================================================================
     9. ENVELOPE OPENING ANIMATION SEQUENCE
     ========================================================================== */
  function handleOpenEnvelope() {
    if (state.envelopeOpened) return;
    state.envelopeOpened = true;

    // Trigger romantic harp glissando
    sound.playEnvelopeOpen();

    // Add open class to envelope to trigger 3D flap rotation and letter slide
    elements.loveEnvelope.classList.add('opened');

    // Spawn burst of hearts around the envelope
    const rect = elements.loveEnvelope.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        spawnTapHeart(
          centerX + (Math.random() - 0.5) * 160,
          centerY + (Math.random() - 0.5) * 100
        );
      }, i * 90);
    }

    // Disable button to prevent multi-clicks
    elements.openHeartBtn.disabled = true;
    elements.openHeartBtn.style.opacity = '0.6';

    // Transition smoothly to Quiz Introduction Screen after the love note reveals
    setTimeout(() => {
      switchScreen(elements.welcomeScreen, elements.introScreen);
    }, 2000);
  }

  /* ==========================================================================
     10. DYNAMIC QUESTION RENDERING (7 VISUAL DESIGN STYLES)
     ========================================================================== */
  function updateProgressBar() {
    const total = QUIZ_QUESTIONS.length;
    const current = state.currentIndex + 1;
    const percentage = Math.round((current / total) * 100);

    const formattedNum = String(current).padStart(2, '0');
    elements.currentQNum.textContent = formattedNum;
    elements.progressPercentPill.textContent = `${percentage}%`;
    elements.progressFill.style.width = `${percentage}%`;
    elements.progressBar.setAttribute('aria-valuenow', percentage);
  }

  /**
   * Generates custom HTML structure for each of the 7 visual question styles
   */
  function buildQuestionCardMarkup(qData, index) {
    const formattedNum = String(index + 1).padStart(2, '0');
    const selectedAnswer = state.userAnswers[index];

    let customDecorations = '';
    let cardWrapperClass = `visual-card style-${qData.style}`;

    switch (qData.style) {
      case 'heart-card':
        customDecorations = `
          <div class="heart-shape-silhouette" aria-hidden="true">
            <span class="heart-corner c-tl">💖</span>
            <span class="heart-corner c-tr">💖</span>
          </div>
          <div class="style-badge-tag">
            <span class="tag-icon">💘</span>
            <span>Cupid's Question</span>
          </div>
        `;
        break;

      case 'love-letter':
        customDecorations = `
          <div class="postage-stamp-wrapper" aria-hidden="true">
            <div class="postage-stamp">
              <span class="stamp-icon">💌</span>
              <span class="stamp-text">LOVE 1st CLASS</span>
            </div>
            <div class="postal-mark">PAR AVION</div>
          </div>
          <div class="wax-seal-badge" aria-hidden="true">
            <span class="wax-icon">❤️</span>
          </div>
          <div class="letter-stationery-header">
            <span class="handwritten-meta">From my heart to yours...</span>
          </div>
        `;
        break;

      case 'polaroid':
        customDecorations = `
          <div class="washi-tape-pin" aria-hidden="true"></div>
          <div class="polaroid-header-meta">
            <span class="polaroid-camera-icon">📸</span>
            <span class="polaroid-caption-small">Sweet Memory • Question ${formattedNum}</span>
          </div>
        `;
        break;

      case 'floating-bubbles':
        customDecorations = `
          <div class="bubble-backdrop" aria-hidden="true">
            <span class="glass-orb orb-1"></span>
            <span class="glass-orb orb-2"></span>
            <span class="glass-orb orb-3"></span>
            <span class="glass-orb orb-4"></span>
          </div>
          <div class="style-badge-tag bubble-pill">
            <span class="tag-icon">🫧</span>
            <span>Floating Thoughts</span>
          </div>
        `;
        break;

      case 'scrapbook':
        customDecorations = `
          <div class="scrapbook-tape tape-tl" aria-hidden="true"></div>
          <div class="scrapbook-tape tape-br" aria-hidden="true"></div>
          <div class="scrapbook-paperclip" aria-hidden="true">📎</div>
          <div class="scrapbook-pressed-flower" aria-hidden="true">🌸</div>
          <div class="scrapbook-header">
            <span class="scrapbook-tag">Chapter 05 • Precious Notes</span>
          </div>
        `;
        break;

      case 'gameshow':
        customDecorations = `
          <div class="gameshow-marquee-lights" aria-hidden="true">
            <span class="light-bulb"></span>
            <span class="light-bulb"></span>
            <span class="light-bulb"></span>
            <span class="light-bulb"></span>
            <span class="light-bulb"></span>
            <span class="light-bulb"></span>
          </div>
          <div class="gameshow-banner">
            <span class="gameshow-badge">ROUND 06: THE LOVE MATCH SHOW</span>
            <span class="heart-o-meter">❤️ ❤️ ❤️</span>
          </div>
        `;
        break;

      case 'giftbox':
        customDecorations = `
          <div class="giftbox-ribbon-horizontal" aria-hidden="true"></div>
          <div class="giftbox-ribbon-vertical" aria-hidden="true"></div>
          <div class="giftbox-bow-accent" aria-hidden="true">
            <span class="bow-petal b-left"></span>
            <span class="bow-petal b-right"></span>
            <span class="bow-knot">🎀</span>
          </div>
          <div class="giftbox-tag-label" aria-hidden="true">
            <span>🏷️ Date Night Mystery</span>
          </div>
        `;
        break;

      case 'cinema-scrapbook':
        customDecorations = `
          <div class="filmstrip-border top" aria-hidden="true"></div>
          <div class="style-badge-tag cinema-badge">
            <span class="tag-icon">🎬</span>
            <span>The Drama Awards</span>
            <span class="star-sparkle">⭐</span>
          </div>
          <div class="cinema-popcorn" aria-hidden="true">🍿</div>
        `;
        break;

      case 'royal-scroll':
        customDecorations = `
          <div class="scroll-crest" aria-hidden="true">
            <span class="crest-crown">👑</span>
          </div>
          <div class="royal-seal" aria-hidden="true">
            <span>⚜️</span>
          </div>
          <div class="royal-heading-tag">
            <span>Royal Love Proclamation</span>
          </div>
        `;
        break;

      case 'promise-jewel':
        customDecorations = `
          <div class="jewel-halo-ring r1" aria-hidden="true"></div>
          <div class="jewel-halo-ring r2" aria-hidden="true"></div>
          <div class="style-badge-tag jewel-badge">
            <span class="tag-icon">💍</span>
            <span>The Grand Finale Promise</span>
            <span class="tag-icon">💎</span>
          </div>
        `;
        break;

      default:
        customDecorations = '';
    }

    // Build options HTML
    let optionsHtml = '';
    qData.options.forEach((optText, optIndex) => {
      const isSelected = selectedAnswer === optText;
      const letter = String.fromCharCode(65 + optIndex);

      optionsHtml += `
        <button 
          type="button" 
          class="custom-option-btn ${isSelected ? 'selected' : ''}" 
          role="radio" 
          aria-checked="${isSelected ? 'true' : 'false'}"
          data-option-index="${optIndex}"
          data-option-text="${encodeURIComponent(optText)}"
        >
          <span class="opt-left">
            <span class="opt-bullet">${letter}</span>
            <span class="opt-text">${optText}</span>
          </span>
          <span class="opt-check-indicator" aria-hidden="true">✓</span>
        </button>
      `;
    });

    return `
      <div class="${cardWrapperClass}">
        ${customDecorations}
        <div class="question-header-row">
          <span class="q-badge-mini">Question ${formattedNum}</span>
          <span class="q-style-label">${qData.styleName}</span>
        </div>
        <h2 class="dynamic-question-title" id="question-text">${qData.question}</h2>
        <div class="custom-options-group" role="radiogroup" aria-labelledby="question-text">
          ${optionsHtml}
        </div>
      </div>
    `;
  }

  function renderQuestion(index) {
    const qData = QUIZ_QUESTIONS[index];
    if (!qData) return;

    // Update style badge in header
    elements.currentStyleBadge.textContent = qData.styleName;

    // Render custom card HTML
    elements.questionContainer.innerHTML = buildQuestionCardMarkup(qData, index);

    // Attach listeners to freshly rendered option buttons
    const optionButtons = elements.questionContainer.querySelectorAll('.custom-option-btn');
    optionButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const optText = decodeURIComponent(btn.getAttribute('data-option-text'));
        handleOptionSelect(optText, btn, qData.soundType, e);
      });
    });

    updateNavButtons();
    updateProgressBar();
  }

  function handleOptionSelect(selectedOption, clickedBtn, soundType, event) {
    // Save answer to session state
    state.userAnswers[state.currentIndex] = selectedOption;

    // Update visual selection on all buttons in current question
    const allButtons = elements.questionContainer.querySelectorAll('.custom-option-btn');
    allButtons.forEach((b) => {
      b.classList.remove('selected');
      b.setAttribute('aria-checked', 'false');
    });

    clickedBtn.classList.add('selected');
    clickedBtn.setAttribute('aria-checked', 'true');

    // Spawn hearts at click position
    if (event) {
      spawnTapHeart(event.clientX, event.clientY);
    }

    // Play specific sound for this style
    sound.playByStyle(soundType);

    // Update navigation state
    updateNavButtons();
  }

  function updateNavButtons() {
    const isFirstQuestion = state.currentIndex === 0;
    const isLastQuestion = state.currentIndex === QUIZ_QUESTIONS.length - 1;
    const hasAnsweredCurrent = state.userAnswers[state.currentIndex] !== null;

    // Previous Button
    if (isFirstQuestion) {
      elements.prevBtn.disabled = true;
      elements.prevBtn.style.opacity = '0.35';
      elements.prevBtn.style.pointerEvents = 'none';
    } else {
      elements.prevBtn.disabled = false;
      elements.prevBtn.style.opacity = '1';
      elements.prevBtn.style.pointerEvents = 'auto';
    }

    // Next Button Text and Icon
    if (isLastQuestion) {
      elements.nextBtnText.textContent = "See My Surprise";
      elements.nextBtnIcon.textContent = "🎁";
    } else {
      elements.nextBtnText.textContent = "Next";
      elements.nextBtnIcon.textContent = "→";
    }

    // Next Button Reveal Rule: "Next button should appear after selecting an answer."
    if (hasAnsweredCurrent) {
      elements.nextBtn.classList.remove('hidden');
      elements.selectionHint.classList.add('fade');
    } else {
      elements.nextBtn.classList.add('hidden');
      elements.selectionHint.classList.remove('fade');
    }
  }

  function goToNextQuestion() {
    // Strictly prevent advancing without an answer
    if (state.userAnswers[state.currentIndex] === null) {
      return;
    }

    sound.playPop();

    if (state.currentIndex < QUIZ_QUESTIONS.length - 1) {
      state.currentIndex++;
      transitionQuestion();
    } else {
      showFinalSurprise();
    }
  }

  function goToPreviousQuestion() {
    if (state.currentIndex > 0) {
      sound.playPrevious();
      state.currentIndex--;
      transitionQuestion();
    }
  }

  function transitionQuestion() {
    const container = elements.questionContainer;
    container.classList.add('card-transition-out');

    setTimeout(() => {
      renderQuestion(state.currentIndex);
      container.classList.remove('card-transition-out');
      container.classList.add('card-transition-in');

      setTimeout(() => {
        container.classList.remove('card-transition-in');
      }, 300);
    }, 200);
  }

  /* ==========================================================================
     11. FINAL SURPRISE SCREEN & SUMMARY GENERATION
     ========================================================================== */
  function showFinalSurprise() {
    // Build summary list of all 10 questions and selected answers
    elements.summaryList.innerHTML = '';

    QUIZ_QUESTIONS.forEach((q, idx) => {
      const selectedAnswer = state.userAnswers[idx] || "None selected";
      const item = document.createElement('div');
      item.className = 'summary-item';
      item.innerHTML = `
        <div class="summary-q-header">
          <span class="summary-q-num">#${idx + 1}</span>
          <span class="summary-q-title">${q.question}</span>
        </div>
        <div class="summary-answer-pill">
          <span class="summary-pill-style">${q.styleName}</span>
          <span class="summary-pill-text">👉 ${selectedAnswer}</span>
        </div>
      `;
      elements.summaryList.appendChild(item);
    });

    // Switch to Result Screen
    switchScreen(elements.quizScreen, elements.resultScreen, () => {
      // Open 3D Gift Box
      setTimeout(() => {
        if (elements.surpriseGiftBox) {
          elements.surpriseGiftBox.classList.add('opened');
        }
        sound.playVictory();
        triggerCelebrationConfetti();
      }, 350);
    });
  }

  /* ==========================================================================
     12. PLAY AGAIN / RESTART QUIZ
     ========================================================================== */
  function restartQuiz() {
    sound.playPop();
    state.currentIndex = 0;
    state.userAnswers.fill(null);
    state.envelopeOpened = false;

    // Reset envelope classes
    if (elements.loveEnvelope) {
      elements.loveEnvelope.classList.remove('opened');
    }
    if (elements.openHeartBtn) {
      elements.openHeartBtn.disabled = false;
      elements.openHeartBtn.style.opacity = '1';
    }
    if (elements.surpriseGiftBox) {
      elements.surpriseGiftBox.classList.remove('opened');
    }

    // Switch back to Welcome Screen cleanly
    switchScreen(elements.resultScreen, elements.welcomeScreen);
  }

  /* ==========================================================================
     13. COPY LOVE NOTE & SUMMARY TO CLIPBOARD
     ========================================================================== */
  function copyLoveNote() {
    sound.playPop();

    let textToCopy = `✨ Just For You ❤️ ✨\n\n`;
    textToCopy += `“You are my favourite person. No matter how many questions I ask, you will always be my favourite answer. 🥹❤️”\n\n`;
    textToCopy += `Our Romantic Love Quiz Answers:\n`;
    textToCopy += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    QUIZ_QUESTIONS.forEach((q, i) => {
      textToCopy += `${i + 1}. ${q.question}\n`;
      textToCopy += `   👉 Answer: ${state.userAnswers[i] || '—'}\n\n`;
    });

    textToCopy += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    textToCopy += `Made with lots of love, just for you 💗\n`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showCopySuccess();
      }).catch(() => {
        fallbackCopyText(textToCopy);
      });
    } else {
      fallbackCopyText(textToCopy);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showCopySuccess();
    } catch (err) {
      elements.copyLabel.textContent = "Failed to copy";
    }
    document.body.removeChild(textArea);
  }

  function showCopySuccess() {
    elements.copyLabel.textContent = "Copied to Clipboard! 💌";
    elements.copyIcon.textContent = "✓";
    elements.copySummaryBtn.style.borderColor = "var(--primary-pink)";

    setTimeout(() => {
      elements.copyLabel.textContent = "Copy Love Note";
      elements.copyIcon.textContent = "📋";
      elements.copySummaryBtn.style.borderColor = "";
    }, 2800);
  }

  /* ==========================================================================
     14. SOUND TOGGLE BUTTON
     ========================================================================== */
  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      elements.soundBtn.classList.remove('muted');
      elements.soundIcon.textContent = '🔔';
      elements.soundBtn.querySelector('.sound-label').textContent = 'Sound On';
      sound.playPop();
    } else {
      elements.soundBtn.classList.add('muted');
      elements.soundIcon.textContent = '🔕';
      elements.soundBtn.querySelector('.sound-label').textContent = 'Muted';
    }
  }

  /* ==========================================================================
     15. ATTACH ALL EVENT LISTENERS
     ========================================================================== */
  function bindEvents() {
    // 1. Welcome Screen Envelope interactions
    if (elements.openHeartBtn) {
      elements.openHeartBtn.addEventListener('click', handleOpenEnvelope);
    }
    if (elements.loveEnvelope) {
      elements.loveEnvelope.addEventListener('click', handleOpenEnvelope);
      elements.loveEnvelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenEnvelope();
        }
      });
    }

    // 2. Intro Screen Start Button
    if (elements.beginQuizBtn) {
      elements.beginQuizBtn.addEventListener('click', () => {
        sound.playPop();
        state.currentIndex = 0;
        renderQuestion(0);
        switchScreen(elements.introScreen, elements.quizScreen);
      });
    }

    // 3. Quiz Navigation
    if (elements.nextBtn) {
      elements.nextBtn.addEventListener('click', goToNextQuestion);
    }
    if (elements.prevBtn) {
      elements.prevBtn.addEventListener('click', goToPreviousQuestion);
    }

    // 4. Keyboard Arrow Key Navigation
    window.addEventListener('keydown', (e) => {
      if (!elements.quizScreen.classList.contains('active')) return;
      if (e.key === 'ArrowRight' && !elements.nextBtn.classList.contains('hidden')) {
        goToNextQuestion();
      } else if (e.key === 'ArrowLeft' && !elements.prevBtn.disabled) {
        goToPreviousQuestion();
      }
    });

    // 5. Result Actions
    if (elements.restartBtn) {
      elements.restartBtn.addEventListener('click', restartQuiz);
    }
    if (elements.copySummaryBtn) {
      elements.copySummaryBtn.addEventListener('click', copyLoveNote);
    }

    // 6. Sound Toggle
    if (elements.soundBtn) {
      elements.soundBtn.addEventListener('click', toggleSound);
    }
  }

  // Self Initialization on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindEvents);
  } else {
    bindEvents();
  }

})();
