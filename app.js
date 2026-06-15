document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. MOUSE PARALLAX EFFECT FOR BACKGROUND
  // -------------------------------------------------------------
  const bgWrapper = document.getElementById('bg-wrapper');
  
  if (bgWrapper) {
    document.addEventListener('mousemove', (e) => {
      const xOffset = (window.innerWidth / 2 - e.clientX) * 0.02; // sensitivity
      const yOffset = (window.innerHeight / 2 - e.clientY) * 0.02;
      bgWrapper.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
  }

  // -------------------------------------------------------------
  // 2. SCROLL REVEAL (INTERSECTION OBSERVER)
  // -------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Once revealed, no need to track again
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // viewport
    threshold: 0.15, // trigger when 15% is visible
    rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly earlier
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // -------------------------------------------------------------
  // 3. FAQ ACCORDION LOGIC
  // -------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items first
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // -------------------------------------------------------------
  // 4. INTERACTIVE WIDGET (TRAININGS-FOKUS FINDER)
  // -------------------------------------------------------------
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const stepResult = document.getElementById('step-result');
  
  const btnNext = document.getElementById('btn-next');
  const btnPrev = document.getElementById('btn-prev');
  const btnRestart = document.getElementById('btn-restart');
  
  const goalOptions = document.querySelectorAll('.goal-option');
  const expOptions = document.querySelectorAll('.exp-option');
  
  const resultTitle = document.getElementById('result-title');
  const resultDescription = document.getElementById('result-description');
  const resultDetails = document.getElementById('result-details');
  const resultContactSelect = document.getElementById('contact-subject');

  let selectedGoal = null;
  let selectedExperience = null;

  // Step 1: Goal selection
  goalOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      goalOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedGoal = opt.getAttribute('data-goal');
      btnNext.removeAttribute('disabled');
    });
  });

  // Step 2: Experience selection
  expOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      expOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedExperience = opt.getAttribute('data-exp');
      btnNext.removeAttribute('disabled');
    });
  });

  // Navigation handlers
  let currentStep = 1;

  btnNext.addEventListener('click', () => {
    if (currentStep === 1 && selectedGoal) {
      // Transition Step 1 -> Step 2
      step1.classList.remove('active');
      step2.classList.add('active');
      btnPrev.style.display = 'inline-flex';
      btnNext.setAttribute('disabled', 'true');
      btnNext.textContent = 'Ergebnis anzeigen';
      currentStep = 2;
    } else if (currentStep === 2 && selectedExperience) {
      // Transition Step 2 -> Results
      step2.classList.remove('active');
      stepResult.classList.add('active');
      btnPrev.style.display = 'none';
      btnNext.style.display = 'none';
      btnRestart.style.display = 'inline-flex';
      generateResult();
      currentStep = 3;
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentStep === 2) {
      step2.classList.remove('active');
      step1.classList.add('active');
      btnPrev.style.display = 'none';
      btnNext.textContent = 'Weiter';
      btnNext.removeAttribute('disabled'); // Since a goal must already be selected
      currentStep = 1;
    }
  });

  btnRestart.addEventListener('click', () => {
    // Reset selections
    selectedGoal = null;
    selectedExperience = null;
    goalOptions.forEach(o => o.classList.remove('selected'));
    expOptions.forEach(o => o.classList.remove('selected'));
    
    // Reset UI state
    stepResult.classList.remove('active');
    step1.classList.add('active');
    btnRestart.style.display = 'none';
    btnNext.style.display = 'inline-flex';
    btnNext.textContent = 'Weiter';
    btnNext.setAttribute('disabled', 'true');
    currentStep = 1;
  });

  // Dynamic Results Builder
  function generateResult() {
    const data = {
      kraft: {
        title: "Individuelles Kraft- & Muskelaufbautraining",
        desc: `Basierend auf deiner Auswahl empfiehlt Marvin Hak ein wissenschaftlich fundiertes Hypertrophie- und Maximalkraftprogramm. Mit 15+ Jahren Erfahrung wird sichergestellt, dass jede Wiederholung perfekt ausgeführt wird.`,
        bullets: {
          anf: [
            "Erlernen der fundamentalen Bewegungsmuster (Kniebeuge, Kreuzheben, Drücken)",
            "Gelenkschonender Kraftaufbau zur langfristigen Belastungstoleranz",
            "Periodisierter Trainingsplan für 2 Trainingseinheiten pro Woche"
          ],
          fort: [
            "Optimierung der Hebelverhältnisse und Biomechanik bei schweren Lifts",
            "Spezifische Techniken zur Überwindung von Leistungsplateaus",
            "Intensiv-Betreuung mit Videoanalyse deiner Ausführung"
          ]
        },
        formValue: "krafttraining"
      },
      reha: {
        title: "Rehabilitation & Funktioneller Wiederaufbau",
        desc: `Als akademischer Sporttherapeut und Trainer konzipiert Marvin Hak ein sicheres Programm zur Schmerzfreiheit und Wiederherstellung deiner vollen Leistungsfähigkeit nach Verletzungen.`,
        bullets: {
          anf: [
            "Sanfte Mobilisierung und Stabilisierung betroffener Gelenkstrukturen",
            "Schmerzfreie Bewegungsamplituden finden und schrittweise erweitern",
            "Enge Abstimmung auf ärztliche Befunde oder physiotherapeutische Vorgaben"
          ],
          fort: [
            "Return-to-Sport-Protokoll zur Rückkehr in dein reguläres Sportprogramm",
            "Ausgleich muskulärer Dysbalanzen, die zur Verletzung geführt haben",
            "Reaktives Krafttraining zur Stärkung von Sehnen und Bändern"
          ]
        },
        formValue: "reha"
      },
      abnehmen: {
        title: "Natürliche Körperfettreduktion",
        desc: `Abnehmen ohne radikalen Verzicht. Wir kombinieren kalorienoptimiertes Kraft- und Ausdauertraining mit einer alltagstauglichen Ernährungsstrategie, die deinen Stoffwechsel ankurbelt.`,
        bullets: {
          anf: [
            "Aufbau von stoffwechselaktiver Muskelmasse zur Erhöhung des Grundumsatzes",
            "Schrittweise Ernährungsumstellung ohne strikte Verbote",
            "Alltagsbewegung steigern (NEAT-Optimierung)"
          ],
          fort: [
            "Feinabstimmung der Makronährstoffverteilung für maximale Definition",
            "Kombination aus Kraft- und hochintensivem Intervalltraining (HIIT)",
            "Messung von Umfang und Körperzusammensetzung zur Plateau-Prävention"
          ]
        },
        formValue: "abnehmen"
      },
      alter: {
        title: "Vitalität & funktionelle Kraft im Alter",
        desc: `Krafttraining im Alter ist die beste Medizin für Unabhängigkeit und Lebensqualität. Marvin Hak leitet dich sicher an, um Muskelabbau (Sarkopenie) entgegenzuwirken.`,
        bullets: {
          anf: [
            "Erhöhung der Knochendichte und Gelenksicherheit zur Sturzprophylaxe",
            "Funktionelles Training für Alltagshandlungen (Heben, Aufstehen, Tragen)",
            "Angemessene Intensität und viel Freude an gesunder Bewegung"
          ],
          fort: [
            "Erhalt und Ausbau der Explosivkraft zur schnellen Reaktion im Alltag",
            "Komplexes Koordinationstraining gepaart mit moderaten Gewichten",
            "Gezielte Dehnung und Mobilisierung der Wirbelsäule und Hüften"
          ]
        },
        formValue: "alter"
      },
      ausdauer: {
        title: "Ausdauer- & Herz-Kreislauf-Konditionierung",
        desc: `Stärkung deines wichtigsten Muskels: des Herzens. Optimiertes Ausdauertraining verbessert deine Regeneration, erhöht dein Energielevel und senkt Stressparameter.`,
        bullets: {
          anf: [
            "Grundlagenausdauertraining im aeroben Bereich (Zone 2)",
            "Schonende Belastungsformen wie Radfahren, Rudern oder flüssiges Walken",
            "Regelmäßige Pulskontrolle zur Steuerung der Trainingsbereiche"
          ],
          fort: [
            "Leistungsdiagnostik-basierte Trainingssteuerung",
            "Intervallmethoden zur Erhöhung der maximalen Sauerstoffaufnahme (VO2max)",
            "Spezifische Trainingspläne für Lauf- oder Radsportevents"
          ]
        },
        formValue: "ausdauer"
      }
    };

    const goalData = data[selectedGoal];
    const bulletList = selectedExperience === 'anf' ? goalData.bullets.anf : goalData.bullets.fort;
    
    // Update Result UI
    resultTitle.textContent = goalData.title;
    resultDescription.textContent = goalData.desc;
    
    resultDetails.innerHTML = '';
    bulletList.forEach(bullet => {
      const li = document.createElement('li');
      li.textContent = bullet;
      resultDetails.appendChild(li);
    });

    // Auto-select dropdown in contact form
    if (resultContactSelect) {
      resultContactSelect.value = goalData.formValue;
    }
  }

  // -------------------------------------------------------------
  // 5. CONTACT FORM VALIDATION & SUBMISSION
  // -------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const userFirstname = document.getElementById('user-firstname');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Stop page reload
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      let isValid = true;

      // Reset previous error classes
      [nameInput, emailInput, messageInput].forEach(input => {
        if (input) input.style.borderColor = '';
      });

      // Validation
      if (!nameInput.value.trim()) {
        nameInput.style.borderColor = 'red';
        isValid = false;
      }
      if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
        emailInput.style.borderColor = 'red';
        isValid = false;
      }
      if (!messageInput.value.trim()) {
        messageInput.style.borderColor = 'red';
        isValid = false;
      }

      if (isValid) {
        // Form is valid! Show custom Glassmorphism Success screen
        const firstName = nameInput.value.trim().split(' ')[0];
        if (userFirstname) {
          userFirstname.textContent = firstName;
        }

        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display = 'block';
        }
      }
    });
  }

  // -------------------------------------------------------------
  // 6. MOBILE NAVIGATION TOGGLE
  // -------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = '';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(7, 10, 19, 0.95)';
        navLinks.style.backdropFilter = 'blur(15px)';
        navLinks.style.padding = '20px';
        navLinks.style.borderBottom = '1px solid var(--glass-border)';
        navLinks.style.gap = '20px';
      }
    });
  }
});
