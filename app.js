/**
 * PROTOCOLO 72H - Motor Lógico do Progressive Web App
 * Aplicação Tática de Prontidão e Emergência Familiar
 */

// Estado global persistido
const STORAGE_KEY = 'PROTOCOLO_72H_STATE_V1';

const defaultState = {
  activeTab: 'inicio',
  blackoutMode: false,
  lastGPS: null,
  calculator: {
    adults: 2,
    children: 1,
    elderly: 0,
    pets: 1,
    heatWave: false,
    medical: false,
    days: 3
  },
  checklists: {
    activeSubTab: 'bob', // 'bob' ou 'home'
    lastInspectedAt: null,
    bobItems: [
      { id: 'b1', title: 'Água potável (garrafas resistentes)', tag: 'Hidratação', detail: '3x 1.5L • 4.5kg', icon: 'water_drop', checked: true, priority: 1 },
      { id: 'b2', title: 'Lanterna tática LED + baterias extras', tag: 'Iluminação', detail: '320g • 800 Lumens', icon: 'flashlight_on', checked: true, priority: 1 },
      { id: 'b3', title: 'Rádio AM/FM emergência (pilha/manivela)', tag: 'Comunicação', detail: '280g • Alerta Civil', icon: 'radio', checked: false, priority: 1 },
      { id: 'b4', title: 'Kit Primeiros Socorros completo', tag: 'Socorro', detail: '450g • Torniquete + Gaze', icon: 'medical_services', checked: true, priority: 1 },
      { id: 'b5', title: 'Documentos protegidos em saco estanque', tag: 'Identificação', detail: '150g • Cópias + PenDrive', icon: 'folder_zip', checked: false, priority: 1 },
      { id: 'b6', title: 'Alimentos calóricos de pronto consumo', tag: 'Nutrição', detail: '1.1kg • Barras + Latas', icon: 'lunch_dining', checked: true, priority: 2 },
      { id: 'b7', title: 'Canivete multiuso & Fita Silver Tape', tag: 'Ferramenta', detail: '380g • 14 Funções', icon: 'home_repair_service', checked: true, priority: 2 },
      { id: 'b8', title: 'Manta térmica aluminizada (2 un)', tag: 'Proteção', detail: '110g • Retém 90% calor', icon: 'ac_unit', checked: true, priority: 2 },
      { id: 'b9', title: 'Apito de resgate & fósforos anti-vento', tag: 'Sinalização', detail: '60g • 120 dB', icon: 'campaign', checked: false, priority: 2 },
      { id: 'b10', title: 'Muda de roupa leve e meias grossas', tag: 'Vestuário', detail: '420g • Secagem Rápida', icon: 'checkroom', checked: true, priority: 3 },
      { id: 'b11', title: 'Lenços umedecidos + sabão + álcool gel', tag: 'Sanitário', detail: '250g • Previne infecções', icon: 'sanitizer', checked: false, priority: 3 },
      { id: 'b12', title: 'Capa de chuva reforçada + luvas', tag: 'Proteção', detail: '190g • Vinil Tático', icon: 'umbrella', checked: true, priority: 3 }
    ],
    homeItems: [
      { id: 'h1', title: 'Galões de água potável lacrados (mín. 40L)', tag: 'Hidratação', detail: 'Galões de 20L em local seco e escuro', icon: 'water_drop', checked: true, priority: 1 },
      { id: 'h2', title: 'Fogareiro portátil a gás / botijão reserva', tag: 'Preparo', detail: 'Com válvula e acendedor estanque', icon: 'propane_tank', checked: false, priority: 1 },
      { id: 'h3', title: 'Despensa de enlatados e grãos para 7 dias', tag: 'Nutrição', detail: 'Arroz, atum, sardinha, feijão pré-cozido', icon: 'inventory_2', checked: true, priority: 1 },
      { id: 'h4', title: 'Powerbank de 20.000mAh carregado + cabos', tag: 'Energia', detail: 'Recarregado mensalmente', icon: 'battery_charging_full', checked: true, priority: 1 },
      { id: 'h5', title: 'Hipoclorito de sódio a 2,5% (sem fragrância)', tag: 'Tratamento', detail: 'Para desinfecção de água de caixa pluvial', icon: 'science', checked: false, priority: 2 },
      { id: 'h6', title: 'Extintor de incêndio ABC inspecionado', tag: 'Segurança', detail: 'Carga dentro da validade', icon: 'fire_extinguisher', checked: true, priority: 2 },
      { id: 'h7', title: 'Chave inglesa para registro geral (gás e água)', tag: 'Contenção', detail: 'Fácil acesso na entrada da residência', icon: 'build', checked: true, priority: 2 },
      { id: 'h8', title: 'Reserva em dinheiro em espécie (notas pequenas)', tag: 'Economia', detail: 'Sistemas bancários e Pix caem em apagões', icon: 'payments', checked: true, priority: 2 }
    ]
  },
  familyPlan: {
    riskScenario: 'enchente',
    pe1: 'Praça da Matriz - Ao lado do Coreto',
    pe2: 'Estádio Municipal / Ginásio de Esportes Norte',
    outCity: 'Tia Marta - (19) 98765-4321 (Campinas-SP)',
    members: [
      { id: 1, name: 'Lucas (Pai)', blood: 'O+', note: 'Hipertensão. Losartana 50mg no bolso frontal da mochila. Alergia a Dipirona.' },
      { id: 2, name: 'Mariana (Mãe)', blood: 'A+', note: 'Responsável pelo kit infantil e cópias de certidões. Sem restrições severas.' },
      { id: 3, name: 'Enzo (Filho - 8 anos)', blood: 'O+', note: 'Asma moderada. Bombinha Salbutamol reserva estanque na bolsa. Vacinas em dia.' }
    ],
    vulnerable: {
      childWhistle: true,
      childKit: true,
      elderMeds: true,
      elderCane: false,
      petBox: true,
      petFood: true
    }
  },
  admin: {
    pin: '7272',
    authenticated: false,
    posts: [
      {
        id: 'adm_demo_1',
        type: 'alerta',
        title: 'Boletim Meteorológico #182 - Ciclone Extratropical',
        desc: 'Rajadas de vento de até 85 km/h previstas nas próximas 24 horas. Evitem áreas baixas, encostas e mantenham powerbanks carregados.',
        link: 'sms:40199?body=Cadastrar',
        coupon: '',
        price: '',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrzy_3mS0R8jALras9v7s9V3yKWfuxLz_OZUIncjHGfGJ5TBqffPAi0UlhI1YfXlo09cyHk5YRVkkBjiMPs_DjZh9vJoLb98Y-h8ovRSKMsVF_PvIAJDNwHPEkrvdQ2keNYHt_ZEVMGVKb-T8U0BmkLO0M4tRRpYmRbgSyxhfc78cgjBX7NoOZhoYtM-v7LrbYiemcVmzaRpwL-H3cYx8pvqBqBM25-vrarhZMoZP3eX4_ZwutB2phqQ',
        urgency: 'imediata',
        status: 'active',
        createdAt: 'Hoje • 10:45',
        views: 1412,
        clicks: 86
      },
      {
        id: 'adm_demo_2',
        type: 'oferta',
        title: 'Lanterna Tática 1200 Lumens IP68',
        desc: 'Autonomia contínua de 18 horas em modo econômico, zoom focal ajustável, estanque à prova d\'água e bateria 18650 recarregável.',
        link: 'https://amzn.to/3lanterna',
        coupon: 'PROT15',
        price: 'R$ 149,90',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdiAOfIegNlFu5yLcS_Xl_OgoxN6adkom5_KmBNE9cX4GvQYtvOXhV2zW-EiG0lX2bXDwZja7R1hcezE3Jx9wFovL42FjMM6V2_kKMF-6qtbsuXZ95cN_sH6IVd0yigReQKqViIVBgc-dhHEATafWOpQ1wEuH3gzlFKRPFkE1tegcRLAsSnHJEgrPE1KMqxV1FRgcVvvxcurcYor9pzHB4Q-JwEzFTZb36q01jA1Lu',
        urgency: 'atencao',
        status: 'active',
        createdAt: 'Ontem • 18:20',
        views: 682,
        clicks: 215
      }
    ]
  }
};

let appState = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(defaultState));
    const parsed = JSON.parse(raw);
    const merged = { ...defaultState, ...parsed };
    merged.calculator = { ...defaultState.calculator, ...(parsed.calculator || {}) };
    merged.checklists = { ...defaultState.checklists, ...(parsed.checklists || {}) };
    merged.familyPlan = {
      ...defaultState.familyPlan,
      ...(parsed.familyPlan || {}),
      vulnerable: {
        ...defaultState.familyPlan.vulnerable,
        ...(parsed.familyPlan?.vulnerable || {})
      }
    };
    // Garantir que a estrutura do admin existe
    if (!merged.admin) {
      merged.admin = JSON.parse(JSON.stringify(defaultState.admin));
    } else if (!Array.isArray(merged.admin.posts) || merged.admin.posts.length === 0) {
      merged.admin.posts = JSON.parse(JSON.stringify(defaultState.admin.posts));
    }
    if (!merged.admin.manuals) merged.admin.manuals = {};
    // Sempre reiniciar autenticação ao carregar
    merged.admin.authenticated = false;
    return merged;
  } catch (e) {
    console.error('Erro ao ler estado do LocalStorage:', e);
    return JSON.parse(JSON.stringify(defaultState));
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Erro ao salvar estado:', e);
  }
}

// Utilitários de feedback tátil e áudio
function triggerHaptic(duration = 25) {
  if (window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(duration);
    } catch (e) {}
  }
}

// Síntese de áudio (Apito Tático & Código Morse SOS)
let audioCtx = null;
let currentOscillator = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, durationMs) {
  const ctx = getAudioContext();
  if (!ctx) return Promise.resolve();

  return new Promise((resolve) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Envelope de ataque e decaimento
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.02);
    gain.gain.setValueAtTime(0.8, ctx.currentTime + (durationMs - 30) / 1000);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
    osc.onended = () => resolve();
  });
}

let isWhistlePlaying = false;
let whistleOsc = null;

function toggleWhistle() {
  triggerHaptic(50);
  const btn = document.getElementById('btn-whistle-toggle');
  const ctx = getAudioContext();
  if (!ctx) {
    showToast('Áudio não suportado neste navegador.');
    return;
  }

  if (isWhistlePlaying) {
    stopWhistle();
    if (btn) {
      btn.classList.remove('bg-error-container', 'text-white');
      btn.classList.add('bg-surface-container');
      btn.querySelector('span:last-child').textContent = 'Apito Contínuo';
    }
  } else {
    isWhistlePlaying = true;
    whistleOsc = ctx.createOscillator();
    const gain = ctx.createGain();

    // 2800 Hz é o ponto de maior penetração acústica de apitos de socorro
    whistleOsc.type = 'sine';
    whistleOsc.frequency.setValueAtTime(2850, ctx.currentTime);

    gain.gain.setValueAtTime(0.7, ctx.currentTime);
    whistleOsc.connect(gain);
    gain.connect(ctx.destination);

    whistleOsc.start();

    if (btn) {
      btn.classList.remove('bg-surface-container');
      btn.classList.add('bg-error-container', 'text-white');
      btn.querySelector('span:last-child').textContent = 'PARAR APITO';
    }
  }
}

function stopWhistle() {
  if (whistleOsc) {
    try {
      whistleOsc.stop();
      whistleOsc.disconnect();
    } catch (e) {}
    whistleOsc = null;
  }
  isWhistlePlaying = false;
}

let isMorsePlaying = false;

async function playMorseSOS() {
  if (isMorsePlaying) return;
  isMorsePlaying = true;
  triggerHaptic(60);

  const btn = document.getElementById('btn-morse-audio');
  if (btn) {
    btn.classList.add('bg-primary-container', 'text-on-primary-container');
  }

  const dotTime = 120;
  const dashTime = 360;
  const intraSymbolGap = 100;
  const letterGap = 350;

  const sequence = [
    // S (...)
    dotTime, intraSymbolGap, dotTime, intraSymbolGap, dotTime,
    letterGap,
    // O (---)
    dashTime, intraSymbolGap, dashTime, intraSymbolGap, dashTime,
    letterGap,
    // S (...)
    dotTime, intraSymbolGap, dotTime, intraSymbolGap, dotTime
  ];

  for (let i = 0; i < sequence.length; i++) {
    if (!isMorsePlaying) break;
    const dur = sequence[i];
    if (i % 2 === 0) {
      await playTone(2800, dur);
    } else {
      await new Promise((r) => setTimeout(r, dur));
    }
  }

  isMorsePlaying = false;
  if (btn) {
    btn.classList.remove('bg-primary-container', 'text-on-primary-container');
  }
}

// Lanterna estroboscópica visual (Tela)
let isStrobeActive = false;

function toggleScreenStrobe() {
  triggerHaptic(40);
  const overlay = document.getElementById('strobe-overlay');
  const btn = document.getElementById('btn-strobe-toggle');

  if (!isStrobeActive) {
    isStrobeActive = true;
    overlay.classList.remove('hidden');
    overlay.classList.add('strobe-active');
    const lbl = btn?.querySelector('span:last-child');
    if (lbl) lbl.textContent = 'Desativar Estroboscópio';
    requestScreenWakeLock();
  } else {
    isStrobeActive = false;
    overlay.classList.add('hidden');
    overlay.classList.remove('strobe-active');
    const lbl = btn?.querySelector('span:last-child');
    if (lbl) lbl.textContent = 'Ativar Estroboscópio Visual SOS';
    releaseScreenWakeLock();
  }
}

// Sub-abas da tela Preparo (Calculadora + Checklists)
function switchPreparoSubTab(subTab) {
  triggerHaptic(12);

  const tabCalculo = document.getElementById('preparo-tab-calculo');
  const tabBob = document.getElementById('preparo-tab-bob');
  const tabHome = document.getElementById('preparo-tab-home');

  const contentCalculo = document.getElementById('preparo-view-calculo');
  const contentChecklists = document.getElementById('preparo-view-checklists');

  const bannerTitle = document.getElementById('checklist-banner-title');
  const bannerBadge = document.getElementById('checklist-banner-badge');
  const bannerDesc = document.getElementById('checklist-banner-desc');
  const bannerImg = document.getElementById('checklist-banner-img');

  const inactiveBtnClass = 'py-2.5 px-1.5 rounded-lg font-headline-sm text-headline-sm uppercase text-center transition-all text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1 min-h-[44px]';
  const activeBtnClass = 'py-2.5 px-1.5 rounded-lg font-headline-sm text-headline-sm uppercase text-center transition-all bg-primary-container text-on-primary-container shadow-md flex items-center justify-center gap-1 min-h-[44px]';

  [tabCalculo, tabBob, tabHome].forEach((btn) => {
    if (btn) btn.className = inactiveBtnClass;
  });

  if (subTab === 'calculo') {
    if (tabCalculo) tabCalculo.className = activeBtnClass;
    if (contentCalculo) contentCalculo.classList.remove('hidden');
    if (contentChecklists) contentChecklists.classList.add('hidden');
    recalculateSupplies();
  } else if (subTab === 'bob') {
    if (tabBob) tabBob.className = activeBtnClass;
    if (contentCalculo) contentCalculo.classList.add('hidden');
    if (contentChecklists) contentChecklists.classList.remove('hidden');
    if (bannerTitle) bannerTitle.textContent = 'Mochila Rápida (BOB)';
    if (bannerBadge) bannerBadge.textContent = 'PESO ALVO: < 9 KG';
    if (bannerDesc) bannerDesc.textContent = 'Pronta para evacuação em até 5 minutos';
    if (bannerImg) bannerImg.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQPA47O63C7oVGDiEO3_A2aObIjPcqJc_bRQWQlv5Syb1jIlg3pypmDm1TUCXqdyJjIh86VjVjSJkbPB63GhhFCZuyqgL98fKksFYgA83Qk1zjFsQk9oJXq4vx-AWa8uWuOWsDM1V-_OQHT4hfK3CXY1U2dil_0m3ejqn4DO7xY_2rlL5OkUyJpMf9HCaRInP9UK-aOzTCkAWSc3PTpFJC4dovWnzjWDyTW5mlkmtj';
    appState.checklists.activeSubTab = 'bob';
    saveState();
    renderChecklists();
  } else if (subTab === 'home') {
    if (tabHome) tabHome.className = activeBtnClass;
    if (contentCalculo) contentCalculo.classList.add('hidden');
    if (contentChecklists) contentChecklists.classList.remove('hidden');
    if (bannerTitle) bannerTitle.textContent = 'Estoque Residencial 72H';
    if (bannerBadge) bannerBadge.textContent = 'ABRIGO NO LOCAL';
    if (bannerDesc) bannerDesc.textContent = 'Suprimentos vitais para isolamento domiciliar';
    if (bannerImg) bannerImg.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKfrWPA1hwV5xWdjWtZWH3xCsDDFzdcaKn6u3SvN77ko245dpuzNeY89yBGCXq3uflQrMigFBkB42NuUm8Y_Fu6DgL9O_FvtvBJGOLfyJWHJqP7unC1p8A9UyF1AV4M5m0riBPjrESqmC0gtdgVVfw5UtWBaBCKj3K9toTccmv7TPv4h1LiLSoH4iK5Fd49Z10jkww82reqg56TLuhaxVKkejFTc6iYzMG0UoqfEwX';
    appState.checklists.activeSubTab = 'home';
    saveState();
    renderChecklists();
  }
}

// Navegação entre abas
function switchTab(targetTab) {
  triggerHaptic(12);

  // Redirecionamento de compatibilidade
  if (targetTab === 'calculadora') {
    switchTab('preparo');
    setTimeout(() => switchPreparoSubTab('calculo'), 10);
    return;
  }
  if (targetTab === 'checklists') {
    switchTab('preparo');
    setTimeout(() => switchPreparoSubTab('bob'), 10);
    return;
  }

  // Proteção do Painel Admin
  if (targetTab === 'admin' && !appState.admin?.authenticated) {
    openAdminPinModal();
    return;
  }

  appState.activeTab = targetTab;
  saveState();

  // Esconder todas as telas e resetar classe de animação
  const views = ['inicio', 'preparo', 'plano-familiar', 'feed', 'admin'];
  views.forEach((v) => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('view-enter');
    }
  });

  // Mostrar tela alvo com transição nativa fluida
  const targetEl = document.getElementById(`view-${targetTab}`);
  if (targetEl) {
    targetEl.classList.remove('hidden');
    void targetEl.offsetWidth; // Reflow para disparar keyframe
    targetEl.classList.add('view-enter');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Atualizar visual da barra de navegação inferior (4 abas)
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach((tab) => {
    const path = tab.getAttribute('data-path');
    if (path === targetTab) {
      tab.classList.add('active', 'text-primary');
      tab.classList.remove('text-on-surface-variant');
      tab.setAttribute('aria-current', 'page');
    } else {
      tab.classList.remove('active', 'text-primary', 'text-primary-container');
      tab.classList.add('text-on-surface-variant');
      tab.removeAttribute('aria-current');
    }
  });

  // Atualizar subtítulo do cabeçalho
  const subtitleMap = {
    inicio: 'Início',
    preparo: 'Preparo 72h',
    'plano-familiar': 'Plano Familiar',
    feed: 'Feed',
    admin: 'Painel do Criador'
  };
  const subEl = document.getElementById('header-breadcrumb');
  if (subEl) subEl.textContent = subtitleMap[targetTab] || 'Prontidão';

  // Se for início ou preparo, recomputar métricas
  if (targetTab === 'inicio') {
    updateDashboardMetrics();
  } else if (targetTab === 'preparo') {
    recalculateSupplies();
    renderChecklists();
  } else if (targetTab === 'admin') {
    renderAdminPostsList();
  } else if (targetTab === 'feed') {
    renderDynamicFeedCards();
  }
}

// ==========================================
// MÓDULO 1: CALCULADORA DE AUTONOMIA 72H
// ==========================================
function updateDemographicCount(target, delta) {
  triggerHaptic(15);
  const current = appState.calculator[target] || 0;
  const next = Math.max(0, Math.min(15, current + delta));
  appState.calculator[target] = next;
  saveState();

  const countEl = document.getElementById(`count-${target}`);
  if (countEl) countEl.textContent = next;

  recalculateSupplies();
}

function toggleModifier(key, checked) {
  triggerHaptic(15);
  appState.calculator[key] = checked;
  saveState();
  recalculateSupplies();
}

function recalculateSupplies() {
  const calc = appState.calculator;
  const days = calc.days || 3;

  // Parâmetros de consumo diário
  const adultWaterDay = 3.5;
  const childWaterDay = 2.5;
  const elderWaterDay = 3.0;
  const petWaterDay = 1.0;

  let baseHumanWater = (calc.adults * adultWaterDay + calc.children * childWaterDay + calc.elderly * elderWaterDay) * days;
  let basePetWater = calc.pets * petWaterDay * days;

  // Modificadores
  let factor = 1.0;
  if (calc.heatWave) factor += 0.3; // +30% em seca/onda de calor
  if (calc.medical) factor += 0.2; // +20% necessidades médicas

  const totalWater = baseHumanWater * factor + basePetWater;
  const drinkPortion = (baseHumanWater * factor) * 0.67;
  const prepPortion = (baseHumanWater * factor) * 0.33;

  // Calorias e refeições
  const adultCal = 2000;
  const childCal = 1500;
  const elderCal = 1700;
  const totalCal = (calc.adults * adultCal + calc.children * childCal + calc.elderly * elderCal) * days;
  const totalMeals = (calc.adults + calc.children + calc.elderly) * 3 * days;

  // Comida de pets
  const petFoodKg = (calc.pets * 0.3 * days).toFixed(1);

  // Atualizar DOM da Calculadora
  const outTotalWater = document.getElementById('out-total-water');
  const outDrinkWater = document.getElementById('out-drink-water');
  const outPrepWater = document.getElementById('out-prep-water');
  const outTotalMeals = document.getElementById('out-total-meals');
  const outCalories = document.getElementById('out-calories');
  const outPetDetails = document.getElementById('out-pet-details');

  if (outTotalWater) outTotalWater.textContent = totalWater.toFixed(1);
  if (outDrinkWater) outDrinkWater.textContent = drinkPortion.toFixed(1) + ' L';
  if (outPrepWater) outPrepWater.textContent = prepPortion.toFixed(1) + ' L';
  if (outTotalMeals) outTotalMeals.textContent = totalMeals;
  if (outCalories) outCalories.textContent = Math.round(totalCal).toLocaleString('pt-BR') + ' kcal';
  if (outPetDetails) {
    if (calc.pets > 0) {
      outPetDetails.textContent = `${petFoodKg} kg ração + ${basePetWater.toFixed(1)} L água`;
    } else {
      outPetDetails.textContent = 'Nenhum animal cadastrado';
    }
  }

  // Atualizar também o Painel Principal
  updateDashboardMetrics();
}

// ==========================================
// MÓDULO 2: CHECKLISTS INTERATIVOS
// ==========================================
function switchChecklistSubTab(type) {
  switchPreparoSubTab(type);
}

function toggleChecklistItem(id, listType) {
  triggerHaptic(25);
  const items = listType === 'bob' ? appState.checklists.bobItems : appState.checklists.homeItems;
  const item = items.find((it) => it.id === id);
  if (item) {
    item.checked = !item.checked;
    saveState();
    renderChecklists();
    updateDashboardMetrics();
  }
}

function renderChecklists() {
  const isBob = appState.checklists.activeSubTab === 'bob';
  const items = isBob ? appState.checklists.bobItems : appState.checklists.homeItems;
  const listType = isBob ? 'bob' : 'home';

  // Métricas
  const total = items.length;
  const checked = items.filter((i) => i.checked).length;
  const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

  const metricEl = document.getElementById('progress-metric');
  const pBar = document.getElementById('progress-bar');
  if (metricEl) metricEl.innerHTML = `${checked} / ${total} <span class="font-body-sm text-body-sm text-on-surface-variant">(${percent}%)</span>`;
  if (pBar) pBar.style.width = `${percent}%`;

  // Renderizar por prioridade (1, 2, 3)
  const container = document.getElementById('checklist-items-container');
  if (!container) return;

  const priorities = [
    { num: 1, title: 'CRÍTICO / VIDA', badge: 'PRIORIDADE 1', badgeClass: 'bg-error-container text-on-error-container', rightText: 'IMEDIATO' },
    { num: 2, title: 'SOBREVIVÊNCIA BÁSICA', badge: 'PRIORIDADE 2', badgeClass: 'bg-primary-container/20 text-primary-container', rightText: 'SUSTENTO' },
    { num: 3, title: 'CONFORTO & HIGIENE', badge: 'PRIORIDADE 3', badgeClass: 'bg-tertiary/20 text-tertiary', rightText: 'ESTABILIZAÇÃO' }
  ];

  let html = '';
  priorities.forEach((p) => {
    const groupItems = items.filter((it) => it.priority === p.num);
    if (groupItems.length === 0) return;

    html += `
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded font-label-sm text-label-sm uppercase tracking-wider ${p.badgeClass}">
              ${p.badge}
            </span>
            <span class="font-headline-sm text-headline-sm uppercase text-on-surface">${p.title}</span>
          </div>
          <span class="font-display-code text-display-code text-on-surface-variant">${p.rightText}</span>
        </div>
        <div class="flex flex-col gap-2">
    `;

    groupItems.forEach((it) => {
      const isChecked = it.checked;
      const boxClass = isChecked ? 'bg-emerald-600 text-white' : 'bg-surface-container-highest text-transparent';
      const textClass = isChecked ? 'line-through opacity-70' : '';

      html += `
        <div class="checklist-item flex items-center justify-between p-3 rounded-xl bg-surface-container hover:bg-surface-container-high active:scale-[0.99] transition-all cursor-pointer select-none" onclick="toggleChecklistItem('${it.id}', '${listType}')">
          <div class="flex items-center gap-3 min-w-0">
            <div class="checkbox-box w-7 h-7 rounded-lg ${boxClass} flex items-center justify-center flex-shrink-0 transition-colors">
              <span class="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="item-title font-body-lg text-body-lg text-on-surface font-semibold truncate ${textClass}">
                ${it.title}
              </span>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="px-1.5 py-0.2 rounded bg-surface-bright text-primary font-label-sm text-label-sm uppercase">${it.tag}</span>
                <span class="font-display-code text-display-code text-on-surface-variant">${it.detail}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1 flex-shrink-0 ml-2">
            <span class="material-symbols-outlined text-on-surface-variant text-[20px]">${it.icon || 'inventory'}</span>
            ${it.custom ? `<button onclick="event.stopPropagation(); removeCustomItem('${it.id}', '${listType}')" class="p-1 hover:text-error text-on-surface-variant"><span class="material-symbols-outlined text-[18px]">delete</span></button>` : ''}
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function addCustomItemPrompt() {
  triggerHaptic(20);
  const modal = document.getElementById('custom-item-modal');
  const label = document.getElementById('custom-item-target-label');
  const nameInput = document.getElementById('custom-item-name');
  const detailInput = document.getElementById('custom-item-detail');
  const tagSelect = document.getElementById('custom-item-tag');
  const isBob = appState.checklists.activeSubTab === 'bob';

  if (label) {
    label.textContent = isBob ? 'Destino: Mochila Rápida (BOB)' : 'Destino: Estoque Residencial 72H';
  }
  if (nameInput) nameInput.value = '';
  if (detailInput) detailInput.value = '';
  if (tagSelect) tagSelect.value = 'Geral';
  selectCustomItemPriority(2);

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => nameInput?.focus(), 60);
  }
}

function closeCustomItemModal() {
  triggerHaptic(12);
  const modal = document.getElementById('custom-item-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

function selectCustomItemPriority(priority) {
  triggerHaptic(10);
  const input = document.getElementById('custom-item-priority');
  if (input) input.value = String(priority);

  document.querySelectorAll('.custom-prio-btn').forEach((btn) => {
    const p = Number(btn.getAttribute('data-priority'));
    if (p === Number(priority)) {
      btn.className = 'custom-prio-btn py-2 px-2 rounded-lg bg-primary-container text-on-primary-container border border-primary font-label-sm text-label-sm uppercase font-bold';
    } else {
      btn.className = 'custom-prio-btn py-2 px-2 rounded-lg bg-surface-container-lowest border border-surface-container-high font-label-sm text-label-sm uppercase text-on-surface-variant';
    }
  });
}

function submitCustomItemModal() {
  triggerHaptic(25);
  const nameEl = document.getElementById('custom-item-name');
  const tagEl = document.getElementById('custom-item-tag');
  const detailEl = document.getElementById('custom-item-detail');
  const prioEl = document.getElementById('custom-item-priority');

  const name = nameEl?.value?.trim();
  if (!name) {
    showToast('Informe o nome do item antes de salvar.');
    nameEl?.focus();
    return;
  }

  const tag = tagEl?.value?.trim() || 'Geral';
  const detail = detailEl?.value?.trim() || 'Contingência';
  const priority = parseInt(prioEl?.value || '2', 10) || 2;

  const isBob = appState.checklists.activeSubTab === 'bob';
  const newItem = {
    id: 'custom_' + Date.now(),
    title: name,
    tag: tag,
    detail: detail,
    icon: 'star',
    checked: true,
    priority: Math.min(3, Math.max(1, priority)),
    custom: true
  };

  if (isBob) {
    appState.checklists.bobItems.push(newItem);
  } else {
    appState.checklists.homeItems.push(newItem);
  }

  saveState();
  renderChecklists();
  updateDashboardMetrics();
  closeCustomItemModal();
  showToast(`Item "${newItem.title}" cadastrado com sucesso!`);
}

function validateKitNow() {
  triggerHaptic(35);
  appState.checklists.lastInspectedAt = new Date().toISOString();
  saveState();
  renderKitReviewStatus();
  updateDashboardMetrics();
  showToast('✓ Kit 72H validado! Próxima revisão trimestral em 90 dias.');
}

function renderKitReviewStatus() {
  const statusEl = document.getElementById('checklist-review-status');
  const daysEl = document.getElementById('checklist-review-days');
  if (!statusEl || !daysEl) return;

  const lastISO = appState.checklists?.lastInspectedAt;
  if (!lastISO) {
    statusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0"></span><span class="truncate">AGUARDANDO 1ª VALIDAÇÃO</span>`;
    daysEl.textContent = 'CICLO 90 DIAS';
    daysEl.className = 'text-amber-400 flex-shrink-0 font-bold';
    return;
  }

  const lastDate = new Date(lastISO);
  const diffDays = Math.max(0, Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)));
  const remaining = 90 - diffDays;

  if (remaining <= 0) {
    statusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-error animate-ping flex-shrink-0"></span><span class="truncate text-error font-bold">REVISÃO VENCIDA (+${Math.abs(remaining)}d)</span>`;
    daysEl.textContent = 'REVISAR VALIDADES';
    daysEl.className = 'text-error flex-shrink-0 font-bold';
  } else if (remaining <= 15) {
    statusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0"></span><span class="truncate text-amber-400">VALIDADO HÁ ${diffDays}d</span>`;
    daysEl.textContent = `VENCE EM ${remaining}d`;
    daysEl.className = 'text-amber-400 flex-shrink-0 font-bold';
  } else {
    statusEl.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span><span class="truncate text-emerald-400">VALIDADO HÁ ${diffDays} DIA(S)</span>`;
    daysEl.textContent = `PRÓX. EM ${remaining}d`;
    daysEl.className = 'text-tertiary flex-shrink-0';
  }
}

function removeCustomItem(id, listType) {
  triggerHaptic(25);
  const list = listType === 'bob' ? appState.checklists.bobItems : appState.checklists.homeItems;
  const idx = list.findIndex((i) => i.id === id);
  if (idx !== -1) {
    list.splice(idx, 1);
    saveState();
    renderChecklists();
    updateDashboardMetrics();
  }
}

// ==========================================
// MÓDULO 3: PLANO FAMILIAR
// ==========================================
const riskScenariosData = {
  enchente: {
    label: 'Enchente / Alagamento',
    badge: 'Risco Hidrológico',
    colorClass: 'text-tertiary',
    actions: [
      'Desligar o disjuntor geral antes que a água atinja tomadas ou piso.',
      'Elevar documentos, eletrônicos e medicamentos para prateleiras acima de 1,5m.',
      'Nunca atravessar ruas alagadas a pé ou de carro — 15cm de correnteza derrubam um adulto.'
    ]
  },
  deslizamento: {
    label: 'Deslizamento / Encosta',
    badge: 'Risco Geológico',
    colorClass: 'text-secondary',
    actions: [
      'Observar rachaduras em paredes, portas emperradas, água barrenta brotando e postes inclinados.',
      'Ao menor sinal ou sirene da Defesa Civil, evacuar imediatamente sem retornar para buscar bens.',
      'Dirigir-se ao Ponto de Encontro 2 fora da zona de encosta/talude.'
    ]
  },
  apagao: {
    label: 'Apagão Prolongado',
    badge: 'Colapso Elétrico',
    colorClass: 'text-primary',
    actions: [
      'Ativar Modo Apagão no app e modo avião/economia no celular (ou desligar celulares extras).',
      'Não abrir a geladeira/freezer desnecessariamente — mantém temperatura por até 24h se fechada.',
      'Evitar velas sem recipiente anti-chamas e nunca usar gerador/fogareiro em ambiente fechado.'
    ]
  },
  vendaval: {
    label: 'Vendaval / Ciclone',
    badge: 'Risco Eólico',
    colorClass: 'text-primary-fixed',
    actions: [
      'Afastar-se de janelas envidraçadas, varandas e árvores de grande porte.',
      'Ficar em cômodo central da casa (corredor ou banheiro sem janelas) durante rajadas extremas.',
      'Se fios caírem na rua, manter distância mínima de 10m e acionar Bombeiros (193) / concessionária.'
    ]
  }
};

function selectRiskScenario(key) {
  triggerHaptic(15);
  const scenario = riskScenariosData[key] || riskScenariosData.enchente;
  if (!appState.familyPlan) appState.familyPlan = {};
  appState.familyPlan.riskScenario = key;
  saveState();

  document.querySelectorAll('.risk-scenario-btn').forEach((btn) => {
    const isMatch = btn.getAttribute('data-risk') === key;
    btn.className = isMatch
      ? 'risk-scenario-btn py-2.5 px-2.5 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md uppercase font-bold flex items-center justify-center gap-1.5 border border-primary/40 transition-all active:scale-95'
      : 'risk-scenario-btn py-2.5 px-2.5 rounded-xl bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase flex items-center justify-center gap-1.5 border border-surface-container-high transition-all active:scale-95';
  });

  const badgeEl = document.getElementById('risk-scenario-badge');
  if (badgeEl) badgeEl.textContent = scenario.badge;

  const panelEl = document.getElementById('risk-scenario-panel');
  if (panelEl) {
    panelEl.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="font-headline-sm text-headline-sm uppercase ${scenario.colorClass}">${scenario.label}</span>
        <span class="font-label-sm text-[10px] uppercase text-on-surface-variant">Ação 0-2h</span>
      </div>
      <div class="flex flex-col gap-1.5">
        ${scenario.actions.map((act, idx) => `
          <div class="flex items-start gap-2 text-body-sm font-body-sm text-on-surface">
            <span class="font-display-code text-xs text-primary font-bold mt-0.5">${idx + 1}.</span>
            <span>${act}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}

const timelineData = [
  {
    period: "0h - 2h: Alerta & Decisão",
    badge: "Fase Crítica Imediata",
    badgeClass: "bg-error-container text-on-error-container",
    icon: "crisis_alert",
    desc: "Momento de maior estresse cognitivo. Avalie a rota de risco imediato e determine se o procedimento seguro é <strong class='text-primary font-label-lg'>Evacuação Relâmpago</strong> ou <strong class='text-tertiary font-label-lg'>Abrigo no Local (Shelter-in-place)</strong>.",
    actions: [
      "Pegar Mochila 72h e documentos impermeabilizados de todos os membros.",
      "Corte preventivo do registro geral de gás e disjuntor principal caso haja água subindo.",
      "Ativar Ponto de Encontro 1 e notificar o Contato Fora da Cidade via SMS/WhatsApp."
    ]
  },
  {
    period: "24h: Isolamento & Segurança",
    badge: "Proteção Perimetral",
    badgeClass: "bg-primary-container/20 text-primary",
    icon: "lock",
    desc: "Primeiro dia de colapso de serviços convencionais (rede elétrica ou água encanada). Foco em contenção domiciliar, higiene mínima e guarda de provisões.",
    actions: [
      "Lacrar ralos, vasos sanitários e portas se houver refluxo pluvial na rua.",
      "Inventário das garrafas de água potável (mínimo 2L por adulto / 1L criança por dia).",
      "Ligar rádio a pilha/manivela a cada 3 horas para escutar informativos da Defesa Civil."
    ]
  },
  {
    period: "48h: Racionamento & Monitoramento",
    badge: "Gestão de Escassez",
    badgeClass: "bg-tertiary/20 text-tertiary",
    icon: "water_drop",
    desc: "Baterias móveis em esgotamento e água tratada sob escassez severa. É hora de aplicar pastilhas de cloro/fervura e estrita disciplina de calorias.",
    actions: [
      "Iniciar consumo estrito de alimentos perecíveis antes das rações secas lacradas.",
      "Filtragem e desinfecção de água de chuva coletada (2 gotas de hipoclorito a 2,5% por litro).",
      "Reduzir gasto de iluminação tática e evitar circulação externa noturna desnecessária."
    ]
  },
  {
    period: "72h: Estabilização ou Resgate",
    badge: "Extração & Sinalização",
    badgeClass: "bg-secondary-container/30 text-secondary",
    icon: "sos",
    desc: "Atingimento da janela de autonomia crítica. Preparo para extração por equipes de socorro oficiais ou restabelecimento gradual da infraestrutura municipal.",
    actions: [
      "Posicionar sinal visual no telhado/janela: pano vermelho/laranja para resgate médico urgente, pano branco para auxílio comum.",
      "Concentrar toda a família munida de calçados fechados e kits de identificação.",
      "Ao visualizar aeronave ou barco de resgate, erguer ambos os braços em formato 'V'."
    ]
  }
];

function switchTimelineStep(index) {
  triggerHaptic(20);
  const tabs = document.querySelectorAll('.timeline-tab');
  tabs.forEach((tab, i) => {
    if (i === index) {
      tab.classList.remove('bg-surface-container-high', 'text-on-surface');
      tab.classList.add('bg-primary-container', 'text-on-primary-container');
    } else {
      tab.classList.remove('bg-primary-container', 'text-on-primary-container');
      tab.classList.add('bg-surface-container-high', 'text-on-surface');
    }
  });

  const data = timelineData[index];
  const badgeEl = document.getElementById('timeline-badge');
  if (badgeEl) {
    badgeEl.className = 'px-2 py-0.5 rounded font-label-sm text-label-sm uppercase ' + data.badgeClass;
    badgeEl.innerText = data.badge;
  }

  const periodEl = document.getElementById('timeline-period');
  if (periodEl) periodEl.innerText = data.period;

  const iconEl = document.getElementById('timeline-icon');
  if (iconEl) iconEl.innerText = data.icon;

  const descEl = document.getElementById('timeline-desc');
  if (descEl) descEl.innerHTML = data.desc;

  const actionsContainer = document.getElementById('timeline-actions');
  if (actionsContainer) {
    actionsContainer.innerHTML = '';
    data.actions.forEach((action) => {
      const item = document.createElement('div');
      item.className = 'flex items-start gap-2.5 bg-surface-container-high p-2.5 rounded-lg';
      item.innerHTML = `
        <span class="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
        <span class="font-body-sm text-body-sm text-on-surface">${action}</span>
      `;
      actionsContainer.appendChild(item);
    });
  }
}

function saveFamilyPlanInputs() {
  const pe1 = document.getElementById('pe1-input')?.value || '';
  const pe2 = document.getElementById('pe2-input')?.value || '';
  const outCity = document.getElementById('out-city-input')?.value || '';

  appState.familyPlan.pe1 = pe1;
  appState.familyPlan.pe2 = pe2;
  appState.familyPlan.outCity = outCity;
  saveState();
  updateDashboardMetrics();
}

function toggleVulnerableCheck(key, checked) {
  triggerHaptic(15);
  if (!appState.familyPlan.vulnerable) {
    appState.familyPlan.vulnerable = {};
  }
  appState.familyPlan.vulnerable[key] = !!checked;
  saveState();
  updateVulnerableBadges();
  updateDashboardMetrics();
}

function updateVulnerableBadges() {
  const v = appState.familyPlan?.vulnerable || {};
  const groups = [
    { badgeId: 'vuln-badge-child', keys: ['childWhistle', 'childKit'] },
    { badgeId: 'vuln-badge-elder', keys: ['elderMeds', 'elderCane'] },
    { badgeId: 'vuln-badge-pet', keys: ['petBox', 'petFood'] }
  ];
  groups.forEach((g) => {
    const el = document.getElementById(g.badgeId);
    if (!el) return;
    const done = g.keys.filter((k) => !!v[k]).length;
    el.textContent = done === g.keys.length ? `${done}/${g.keys.length} OK` : `${done}/${g.keys.length} Ativo`;
    el.className = done === g.keys.length
      ? 'px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-label-sm text-label-sm uppercase'
      : 'px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase';
  });
}

function syncVulnerableUI() {
  const v = appState.familyPlan?.vulnerable || {};
  Object.keys(v).forEach((key) => {
    const cb = document.getElementById(`vuln-${key}`);
    if (cb) cb.checked = !!v[key];
  });
  updateVulnerableBadges();
}

function renderFamilyMembers() {
  const list = document.getElementById('family-medical-list');
  if (!list) return;

  const members = appState.familyPlan.members || [];
  let html = '';

  members.forEach((m) => {
    html += `
      <div class="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1.5 relative group">
        <div class="flex items-center justify-between">
          <span class="font-headline-sm text-headline-sm uppercase text-on-surface">${m.name} - ${m.blood}</span>
          <div class="flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm uppercase">Ativo</span>
            <button onclick="removeFamilyMember(${m.id})" class="text-on-surface-variant hover:text-error p-1">
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${m.note}</p>
      </div>
    `;
  });

  list.innerHTML = html;

  const completionEl = document.getElementById('plan-completion');
  if (completionEl) {
    completionEl.textContent = `${members.length} Cadastrado(s)`;
  }
}

function addFamilyMemberPrompt() {
  triggerHaptic(20);
  const modal = document.getElementById('family-member-modal');
  const nameInput = document.getElementById('family-member-name');
  const bloodSelect = document.getElementById('family-member-blood');
  const noteInput = document.getElementById('family-member-note');

  if (nameInput) nameInput.value = '';
  if (bloodSelect) bloodSelect.value = 'O+';
  if (noteInput) noteInput.value = '';

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => nameInput?.focus(), 60);
  }
}

function closeFamilyMemberModal() {
  triggerHaptic(12);
  const modal = document.getElementById('family-member-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

function submitFamilyMemberModal() {
  triggerHaptic(25);
  const nameEl = document.getElementById('family-member-name');
  const bloodEl = document.getElementById('family-member-blood');
  const noteEl = document.getElementById('family-member-note');

  const name = nameEl?.value?.trim();
  if (!name) {
    showToast('Informe o nome do familiar antes de salvar.');
    nameEl?.focus();
    return;
  }

  const blood = bloodEl?.value?.trim() || 'Desconhecido';
  const note = noteEl?.value?.trim() || 'Sem restrições relatadas.';

  const newMember = {
    id: Date.now(),
    name: name,
    blood: blood,
    note: note
  };

  appState.familyPlan.members.push(newMember);
  saveState();
  renderFamilyMembers();
  updateDashboardMetrics();
  closeFamilyMemberModal();
  showToast(`Membro ${newMember.name} registrado no plano!`);
}

function removeFamilyMember(id) {
  triggerHaptic(25);
  appState.familyPlan.members = appState.familyPlan.members.filter((m) => m.id !== id);
  saveState();
  renderFamilyMembers();
  updateDashboardMetrics();
}

function sharePlanViaWhatsApp() {
  triggerHaptic(30);
  saveFamilyPlanInputs();

  const plan = appState.familyPlan;
  const calc = appState.calculator;

  const membersText = plan.members
    .map((m) => `• *${m.name}* (${m.blood}): ${m.note}`)
    .join('\n');

  const scenarioInfo = riskScenariosData[plan.riskScenario] || riskScenariosData.enchente;

  const message =
    `🚨 *PROTOCOLO 72H - NOSSO PLANO FAMILIAR DE PRONTIDÃO*\n` +
    `⚠️ *Risco Prioritário:* ${scenarioInfo.label}\n\n` +
    `📍 *Ponto de Encontro 1 (Bairro):* ${plan.pe1}\n` +
    `📍 *Ponto de Encontro 2 (Evacuação Geral):* ${plan.pe2}\n` +
    `📞 *Contato Pivô Fora da Cidade:* ${plan.outCity}\n\n` +
    `👥 *EQUIPE FAMILIAR & SAÚDE:*\n${membersText}\n\n` +
    `💧 *Autonomia Mínima 72h:* Água e mantimentos dimensionados pelo Protocolo 72h.\n` +
    `📻 *Em emergência extrema:* Desliguem registro geral de água e gás, sintonizem Defesa Civil e aguardem instruções.`;

  const encoded = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(message).then(() => {
      showToast('Plano copiado! Redirecionando ao WhatsApp...');
    });
  } else {
    showToast('Abrindo WhatsApp...');
  }

  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 600);
}

function downloadOfflineSummary() {
  triggerHaptic(30);
  saveFamilyPlanInputs();
  // Disparar impressão do cartão tático
  window.print();
}

// ==========================================
// MÓDULO 4: PAINEL PRINCIPAL & MÉTRICAS
// ==========================================
function updateDashboardMetrics() {
  const bobItems = appState.checklists.bobItems || [];
  const homeItems = appState.checklists.homeItems || [];
  const bobTotal = bobItems.length;
  const bobChecked = bobItems.filter((i) => i.checked).length;
  const bobRatio = bobTotal > 0 ? (bobChecked / bobTotal) : 0;

  const homeTotal = homeItems.length;
  const homeChecked = homeItems.filter((i) => i.checked).length;
  const homeRatio = homeTotal > 0 ? (homeChecked / homeTotal) : 0;

  // Pontuação do Plano Familiar (PE1, PE2, Contato externo, Membros e Grupos Vulneráveis)
  const plan = appState.familyPlan || {};
  const hasPe1 = !!(plan.pe1 && plan.pe1.trim().length > 2);
  const hasPe2 = !!(plan.pe2 && plan.pe2.trim().length > 2);
  const hasOutCity = !!(plan.outCity && plan.outCity.trim().length > 2);
  const hasMembers = Array.isArray(plan.members) && plan.members.length > 0;
  const vulnObj = plan.vulnerable || {};
  const vulnKeys = Object.keys(vulnObj);
  const vulnDone = vulnKeys.filter((k) => !!vulnObj[k]).length;
  const vulnRatio = vulnKeys.length > 0 ? (vulnDone / vulnKeys.length) : 1;
  const planRatio = (
    (hasPe1 ? 0.25 : 0) +
    (hasPe2 ? 0.2 : 0) +
    (hasOutCity ? 0.2 : 0) +
    (hasMembers ? 0.15 : 0) +
    (vulnRatio * 0.2)
  );

  // Cálculo ponderado real da prontidão geral (50% BOB + 30% Estoque 72h + 20% Plano)
  const readiness = Math.round((bobRatio * 0.5 + homeRatio * 0.3 + planRatio * 0.2) * 100);
  const bobPercent = Math.round(bobRatio * 100);

  // Gauge circular SVG
  const gaugePercentEl = document.getElementById('dash-gauge-percent');
  const gaugeCircleEl = document.getElementById('dash-gauge-circle');
  if (gaugePercentEl) gaugePercentEl.textContent = `${readiness}%`;
  if (gaugeCircleEl) {
    // 2 * PI * 30 ≈ 188.4
    const offset = 188.4 * (1 - readiness / 100);
    gaugeCircleEl.style.strokeDashoffset = offset;
  }

  // Valores de água na bento card (combinando itens hídricos da Mochila e Estoque)
  const dashWaterEl = document.getElementById('dash-water-metric');
  const dashWaterBar = document.getElementById('dash-water-bar');
  const calc = appState.calculator;
  const totalWaterNum = Math.round((calc.adults * 3.5 + calc.children * 2.5 + calc.elderly * 3.0 + calc.pets * 1.0) * (calc.days || 3) * (calc.heatWave ? 1.3 : 1) * (calc.medical ? 1.2 : 1));
  const hasBobWater = bobItems.find((i) => i.id === 'b1')?.checked ? 1 : 0;
  const hasHomeWater = homeItems.find((i) => i.id === 'h1')?.checked ? 1 : 0;
  const waterChecklistRatio = (hasBobWater * 0.35) + (hasHomeWater * 0.65);
  const reservedEstimate = Math.min(totalWaterNum, Math.round(totalWaterNum * waterChecklistRatio));

  if (dashWaterEl) dashWaterEl.textContent = `${reservedEstimate}L / ${totalWaterNum}L`;
  if (dashWaterBar) {
    const wPct = totalWaterNum > 0 ? Math.min(100, Math.round((reservedEstimate / totalWaterNum) * 100)) : 100;
    dashWaterBar.style.width = `${wPct}%`;
  }

  // BOB Itens
  const dashBobEl = document.getElementById('dash-bob-metric');
  const dashBobBar = document.getElementById('dash-bob-bar');
  if (dashBobEl) dashBobEl.textContent = `${bobChecked} / ${bobTotal} itens`;
  if (dashBobBar) dashBobBar.style.width = `${bobPercent}%`;

  // Pendências combinadas (BOB + Estoque)
  const pendingEl = document.getElementById('dash-pending-count');
  const pendingCount = (bobTotal - bobChecked) + (homeTotal - homeChecked);
  if (pendingEl) {
    pendingEl.textContent = pendingCount > 0 ? `${pendingCount} itens pendentes (BOB + Estoque)` : 'Kit 72H 100% conferido!';
  }
}

// ==========================================
// MÓDULO 5: MODAL DE GUIAS OFICIAIS
// ==========================================
const guidesData = {
  bob: {
    title: 'Manual da Mochila de Emergência 72H (BOB)',
    category: 'Checklist + Ação Tática',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFK2q5m62yUkIDrFqY_kdbF4dgoWW2t5vy3KC7MOIS4Urigq7GSQt57dJg44s4rP5tFKcQdZi8cpN-vdncx0oMMn-O5-F9XwzFE0kHQZuHXMfjsDjJv6oEsdMFtY56Na1OPn3ybPY3SXkRbIc6rmMkx6JdoeH8KPDD0YoykH8R-DbnoaQ_dSJdgwzByor66TKuX145S37jNWFqdVSSZVCHViDCBFh032Sh3f3DXHU-bPHWfN7RlCdMGg',
    content: `
      <h3 class="text-primary font-headline-sm uppercase mb-2">1. O Conceito da Mochila BOB (Bug-Out Bag)</h3>
      <p class="font-body-md text-on-surface mb-3">A Mochila de Evacuação Rápida é projetada para manter você e seus dependentes vivos e operacionais pelas primeiras 72 horas após um colapso repentino de moradia ou infraestrutura (enchentes, deslizamentos, incêndios florestais ou evacuações forçadas pela Defesa Civil).</p>

      <h3 class="text-primary font-headline-sm uppercase mb-2">2. Regra dos 10% a 15% do Peso Corporal</h3>
      <p class="font-body-md text-on-surface mb-3">Uma mochila de adulto não deve exceder 15% do seu peso (ex.: pessoa de 70kg deve carregar entre 7kg e 10.5kg no máximo). O erro mais comum em emergências é sobrecarregar a mochila com roupas desnecessárias e faltar água potável ou ferramentas de corte.</p>

      <h3 class="text-primary font-headline-sm uppercase mb-2">3. Distribuição do Peso na Mochila</h3>
      <ul class="list-disc list-inside font-body-md text-on-surface-variant space-y-1 mb-4">
        <li><strong>Fundo da mochila:</strong> Saco de dormir, manta térmica aluminizada e roupas leves de troca.</li>
        <li><strong>Centro (junto à coluna):</strong> Objetos mais densos e pesados (garrafas de água de 1.5L e rações em lata).</li>
        <li><strong>Topo e bolsos externos:</strong> Kit de primeiros socorros com torniquete, lanterna tática LED e capa de chuva impermeável.</li>
      </ul>

      <h3 class="text-primary font-headline-sm uppercase mb-2">4. Documentação Impermeável</h3>
      <p class="font-body-md text-on-surface">Digitalize certidões de nascimento, escrituras, laudos médicos e apólices em um PenDrive encriptado colocado em saco estanque ziploc duplo, junto com R$ 200 a R$ 500 em notas de pequeno valor.</p>
    `
  },
  water: {
    title: 'Guia Completo de Segurança Hídrica',
    category: 'Recurso Vital & Saneamento',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCamRG5TJZgXwGeGuUZ6p9Kv-j4JCVyesx8tC1wHwCDIVLOuyF-Lu4OT3kCHj-soMDlzcWINjE1tWBzfuPBHc0uZHwj741KNPFv2IbpczF4Ht4nMpgdv6Y9b8r5hqD0VIUf9ZQxcxTL-r_TAFhId-Jt74aY0Q3zG9fBDqdduLvSpzybMBZo7ozNZ6n3gpPhdJIb_cciktOWOU1x56v8TurNQbfafwpW7IQMme9ag0ZNi76wJ7AaL37ogA',
    content: `
      <h3 class="text-tertiary font-headline-sm uppercase mb-2">1. Consumo Mínimo Vital</h3>
      <p class="font-body-md text-on-surface mb-3">A regra humanitária internacional (Manual Esfera) prevê no mínimo <strong>3.5 litros de água por pessoa/dia</strong> (2 litros para consumo direto e 1.5 litro para higiene e preparo sumário). Em caso de calor superior a 32°C ou febre, acrescente 1 litro extra por indivíduo.</p>

      <h3 class="text-tertiary font-headline-sm uppercase mb-2">2. Desinfecção com Hipoclorito de Sódio (Água Sanitária)</h3>
      <p class="font-body-md text-on-surface mb-2">Utilize apenas água sanitária comum com concentração entre <strong>2.0% e 2.5% de cloro ativo</strong>, SEM fragrâncias ou alvejantes:</p>
      <div class="p-3 bg-surface-container-high rounded-lg mb-4">
        <p class="font-headline-sm text-primary uppercase mb-1">💧 Água Clara / Límpida:</p>
        <p class="font-body-sm text-on-surface mb-2"><strong>2 gotas por litro de água</strong>. Misture bem e aguarde <strong>30 minutos</strong> antes de ingerir.</p>
        <p class="font-headline-sm text-secondary uppercase mb-1">🌊 Água Turva ou Coletada de Chuva:</p>
        <p class="font-body-sm text-on-surface">Filtre antes através de pano de algodão limpo ou filtro de café. Adicione <strong>4 gotas por litro</strong> e aguarde 30 minutos.</p>
      </div>

      <h3 class="text-tertiary font-headline-sm uppercase mb-2">3. Fervura Segura</h3>
      <p class="font-body-md text-on-surface">A fervura contínua por <strong>3 a 5 minutos</strong> em borbulhamento vigoroso elimina 100% dos protozoários, bactérias e vírus patogênicos. Para devolver o oxigênio e melhorar o sabor, mexa a água fervida de um copo a outro várias vezes após esfriar.</p>
    `
  },
  food: {
    title: 'Tabela de Validade e Despensa de Emergência',
    category: 'Nutrição Sem Eletricidade',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATSF0dptTs6vsfiUz6TAbSaO6iyQwQDIZo3bbAqbTtiB9yf8oU6aHUBPT-rgKjmDtsWfUETpBIMnS1vtGstVzHkuV0QdVs7gExjtfOAC5irdyHQVqs0weZSLfEqsYEld9jqjwIPbliRj2WbQDMqMPOU6FX4YOxHysT28iN0pKHlkPXEYm9K4pKCRAMfhuWpWr7bZidmCIzVBOXyD8q6yOzQfXNXpjs5eL9e1Jy_nHCUDZpRDH6orlCIw',
    content: `
      <h3 class="text-primary font-headline-sm uppercase mb-2">1. Princípio FIFO (Primeiro que Entra, Primeiro que Sai)</h3>
      <p class="font-body-md text-on-surface mb-3">Organize os suprimentos com a validade mais próxima virada para a frente. A cada 6 meses, consuma os itens no dia a dia familiar e reponha com novos lotes frescos.</p>

      <h3 class="text-primary font-headline-sm uppercase mb-2">2. Alimentos de Prioridade 1 (Sem Demanda de Cozimento)</h3>
      <ul class="list-disc list-inside font-body-md text-on-surface-variant space-y-1 mb-4">
        <li><strong>Enlatados em óleo/água:</strong> Atum, sardinha, milho, ervilha e feijão pronto em lata com aba de fácil abertura.</li>
        <li><strong>Calorias densas imediatas:</strong> Castanhas do Pará, nozes, amendoim torrado, barras proteicas e mel silvestre.</li>
        <li><strong>Glicose rápida:</strong> Rapadura fracionada, goiabada cascão e frutas secas (uva passa, ameixa).</li>
      </ul>

      <h3 class="text-primary font-headline-sm uppercase mb-2">3. Conservação de Grãos a Longo Prazo</h3>
      <p class="font-body-md text-on-surface">Arroz cru e feijão podem ser acondicionados em garrafas PET de 2L bem secas com 2 folhas de louro e 1 dente de alho seco por garrafa, fechadas com fita isolante. Durabilidade testada de mais de 3 anos sem carunchos.</p>
    `
  },
  regional: {
    title: 'Plano Regional de Riscos Climáticos (Brasil)',
    category: 'Defesa Civil & Clima',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrzy_3mS0R8jALras9v7s9V3yKWfuxLz_OZUIncjHGfGJ5TBqffPAi0UlhI1YfXlo09cyHk5YRVkkBjiMPs_DjZh9vJoLb98Y-h8ovRSKMsVF_PvIAJDNwHPEkrvdQ2keNYHt_ZEVMGVKb-T8U0BmkLO0M4tRRpYmRbgSyxhfc78cgjBX7NoOZhoYtM-v7LrbYiemcVmzaRpwL-H3cYx8pvqBqBM25-vrarhZMoZP3eX4_ZwutB2phqQ',
    content: `
      <h3 class="text-secondary font-headline-sm uppercase mb-2">1. Alertas SMS Gratuitos da Defesa Civil (40199)</h3>
      <p class="font-body-md text-on-surface mb-2">Envie um SMS gratuito para o número <strong>40199</strong> contendo apenas o seu CEP (ex: <em>01001000</em>). Você passará a receber avisos antecipados de temporais, ressacas e frentes frias severas da Defesa Civil do seu estado.</p>
      <a href="sms:40199?body=Cadastrar" class="inline-flex items-center gap-2 mb-4 px-3.5 py-2 rounded-lg bg-secondary-container text-white font-label-md uppercase font-bold active:scale-95 transition-transform shadow-md">
        <span class="material-symbols-outlined text-[18px]">sms</span>
        <span>Abrir SMS e Enviar para 40199</span>
      </a>

      <h3 class="text-secondary font-headline-sm uppercase mb-2">2. Inundações e Enchentes Repentinas (Sul / Sudeste)</h3>
      <ul class="list-disc list-inside font-body-md text-on-surface-variant space-y-1 mb-4">
        <li>Nunca atravesse ruas com água acima do tornozelo: 15 cm de correnteza derrubam um adulto; 30 cm arrastam veículos compactos.</li>
        <li>Desconecte o registro geral de energia antes que a água atinja as tomadas baixas da residência.</li>
      </ul>

      <h3 class="text-secondary font-headline-sm uppercase mb-2">3. Deslizamentos de Encostas</h3>
      <p class="font-body-md text-on-surface mb-3">Observe sinais preliminares: árvores e postes inclinados, portas emperrando sem motivo, rachaduras novas nas paredes e água barrenta brotando do chão. Evacue imediatamente.</p>

      <h3 class="text-secondary font-headline-sm uppercase mb-2">4. Secas Extremas & Queimadas (Norte / Centro-Oeste / Nordeste)</h3>
      <p class="font-body-md text-on-surface">Umidifique o ambiente com bacias de água e toalhas úmidas. Use máscaras N95/PFF2 se houver fuligem suspensa no ar para proteger crianças e idosos.</p>
    `
  },
  sementes: {
    title: 'Conservação de Sementes e Grãos em Garrafas PET',
    category: 'Módulo Aditivo 72H - Despensa de Longo Prazo',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXbVwG2iEKN7nkZi58o87YgOkKCDls7Ob9ihAfBdxbqxKvS9Rf4bTqVAiZOopxtgQE47-Dv_aQbQJ55rscDLGJPfb4xHfoi1E6x9gycAc14Pi5o5-scBKTk9546nHQe9HgK3CpwjSPH5-Yr5Jp-eJlQmjLxH_aK-nTjy53CoM4wHYpBudx2lkWKY6aZHo4KHYYRpZ4ngdoKxiob00cJeVFHOf8OxjqnR0YNnqBhhJZ',
    content: `
      <h3 class="text-primary font-headline-sm uppercase mb-2">1. O Método Tático de Purga de Oxigênio</h3>
      <p class="font-body-md text-on-surface mb-3">Grãos armazenados em garrafas PET transparentes e higienizadas podem durar até <strong>5 anos</strong> sem perda de nutrientes ou infestação por carunchos, desde que o oxigênio interno seja consumido e a garrafa seja vedada a vácuo caseiro.</p>

      <h3 class="text-primary font-headline-sm uppercase mb-2">2. Passo a Passo de Preparo</h3>
      <ul class="list-disc list-inside font-body-md text-on-surface-variant space-y-1 mb-4">
        <li><strong>Higienização:</strong> Lave bem garrafas PET (refrigerante ou água), deixe secar 100% ao sol. A mínima umidade estragará o lote.</li>
        <li><strong>Camadas de Grãos:</strong> Preencha com arroz, feijão ou milho, batendo o fundo da garrafa no chão com um pano para compactar ao máximo.</li>
        <li><strong>Repelente Natural:</strong> A cada terço da garrafa, adicione 1 a 2 folhas secas de louro e 1 dente de alho com casca seco.</li>
      </ul>

      <h3 class="text-primary font-headline-sm uppercase mb-2">3. O Truque do Algodão e Álcool (Queima do Oxigênio)</h3>
      <p class="font-body-md text-on-surface mb-3">No topo da garrafa (deixe 2cm livres), coloque um pedacinho de papel alumínio como prato. Em cima, ponha uma bolinha de algodão embebida em álcool 70% ou 92%. Ateie fogo ao algodão e rosqueie a tampa <em>imediatamente e com força</em>. O fogo consome todo o oxigênio residual e apaga sozinho em 2 segundos, criando vácuo natural!</p>

      <h3 class="text-primary font-headline-sm uppercase mb-2">4. Vedação Final com Vela ou Fita Isolante</h3>
      <p class="font-body-md text-on-surface">Passe fita isolante de alta aderência ao redor da tampa ou mergulhe o gargalo em parafina de vela derretida. Rotule com a data de embalagem e armazene em local escuro e arejado.</p>
    `
  },
  alerta_clima: {
    title: 'Orientações - Boletim Meteorológico Integrado #182',
    category: 'Defesa Civil - Alerta Nível Amarelo',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrzy_3mS0R8jALras9v7s9V3yKWfuxLz_OZUIncjHGfGJ5TBqffPAi0UlhI1YfXlo09cyHk5YRVkkBjiMPs_DjZh9vJoLb98Y-h8ovRSKMsVF_PvIAJDNwHPEkrvdQ2keNYHt_ZEVMGVKb-T8U0BmkLO0M4tRRpYmRbgSyxhfc78cgjBX7NoOZhoYtM-v7LrbYiemcVmzaRpwL-H3cYx8pvqBqBM25-vrarhZMoZP3eX4_ZwutB2phqQ',
    content: `
      <h3 class="text-secondary font-headline-sm uppercase mb-2">1. Frente Fria Severa e Chuvas Convectivas</h3>
      <p class="font-body-md text-on-surface mb-3">O boletim alerta para rajadas de vento acima de 60 km/h e precipitação acumulada de até 90mm em 48h. Ações preventivas imediatas:</p>
      <ul class="list-disc list-inside font-body-md text-on-surface-variant space-y-1 mb-4">
        <li>Carregue todos os powerbanks, celulares e rádios transmissores enquanto a rede elétrica estiver operando.</li>
        <li>Limpe calhas, ralos e grelhas externas para evitar refluxo de esgoto pluvial.</li>
        <li>Garanta ao menos 10L de água potável reservada em galões limpos para caso a estação de tratamento municipal interrompa a distribuição por turbidez.</li>
      </ul>

      <h3 class="text-secondary font-headline-sm uppercase mb-2">2. Em Caso de Alagamento Imediato</h3>
      <p class="font-body-md text-on-surface mb-3">Corte o disjuntor principal antes de pisar em água acumulada. Mantenha crianças, idosos e animais nos pontos mais altos da residência ou inicie a evacuação antecipada com a Mochila BOB.</p>
    `
  },
  cell_broadcast: {
    title: 'Defesa Civil Alerta (Cell Broadcast) & Anti-Boato',
    category: 'Verificação Oficial Brasil',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrzy_3mS0R8jALras9v7s9V3yKWfuxLz_OZUIncjHGfGJ5TBqffPAi0UlhI1YfXlo09cyHk5YRVkkBjiMPs_DjZh9vJoLb98Y-h8ovRSKMsVF_PvIAJDNwHPEkrvdQ2keNYHt_ZEVMGVKb-T8U0BmkLO0M4tRRpYmRbgSyxhfc78cgjBX7NoOZhoYtM-v7LrbYiemcVmzaRpwL-H3cYx8pvqBqBM25-vrarhZMoZP3eX4_ZwutB2phqQ',
    content: `
      <h3 class="text-primary font-headline-sm uppercase mb-2">1. Como funciona o Defesa Civil Alerta?</h3>
      <p class="font-body-md text-on-surface mb-3">Opera via tecnologia <strong>Cell Broadcast</strong> nas antenas 4G/5G em todo o Brasil, sem precisar de cadastro prévio. Em alertas severos ou extremos, aparece um pop-up que sobrepõe a tela com sirene sonora, mesmo no silencioso.</p>

      <h3 class="text-secondary font-headline-sm uppercase mb-2">2. Como Identificar Boatos e Alertas Falsos</h3>
      <ul class="list-disc list-inside font-body-md text-on-surface-variant space-y-1 mb-4">
        <li><strong>Nunca clique em links suspeitos:</strong> Alertas oficiais via Cell Broadcast não pedem senhas, PIX nem downloads de aplicativos desconhecidos.</li>
        <li><strong>Mensagens desconexas ou "Apagão Mundial":</strong> Caso receba correntes alarmistas ou um disparo atípico com texto incoerente, confirme imediatamente nos canais oficiais antes de repassar.</li>
        <li><strong>Kit 72h é prevenção padrão:</strong> A recomendação da Defesa Civil de ter suprimentos para 72h visa autonomia em chuvas severas, quedas de energia ou isolamento temporário — não significa colapso imediato.</li>
      </ul>

      <h3 class="text-tertiary font-headline-sm uppercase mb-2">3. Canais Oficiais para Confirmação Rápida</h3>
      <ul class="list-disc list-inside font-body-md text-on-surface-variant space-y-1">
        <li><strong>SMS Gratuito:</strong> Envie seu CEP para <strong>40199</strong>.</li>
        <li><strong>WhatsApp Oficial Gov:</strong> Salve <strong>(61) 2034-4611</strong> e envie "Oi" para cadastrar seus CEPs.</li>
        <li><strong>Telegram Oficial:</strong> Busque por <strong>Defesa Civil Alertas</strong>.</li>
      </ul>
    `
  },
  apagao: {
    title: 'Protocolo de Apagão Prolongado & Calor Extremo',
    category: 'Autonomia Energética 72H',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdiAOfIegNlFu5yLcS_Xl_OgoxN6adkom5_KmBNE9cX4GvQYtvOXhV2zW-EiG0lX2bXDwZja7R1hcezE3Jx9wFovL42FjMM6V2_kKMF-6qtbsuXZ95cN_sH6IVd0yigReQKqViIVBgc-dhHEATafWOpQ1wEuH3gzlFKRPFkE1tegcRLAsSnHJEgrPE1KMqxV1FRgcVvvxcurcYor9pzHB4Q-JwEzFTZb36q01jA1Lu',
    content: `
      <h3 class="text-primary font-headline-sm uppercase mb-2">1. Protegendo Bateria e Comunicação</h3>
      <ul class="list-disc list-inside font-body-md text-on-surface-variant space-y-1 mb-4">
        <li>Ative o <strong>Modo Apagão</strong> no topo deste app (tela preta OLED sem animações) e reduza o brilho ao mínimo.</li>
        <li>Coloque o celular em <strong>Modo Avião</strong> se não houver sinal — ficar buscando torre drena a bateria rapidamente.</li>
        <li>Use rádio portátil AM/FM para boletins oficiais sem gastar a bateria do smartphone.</li>
      </ul>

      <h3 class="text-tertiary font-headline-sm uppercase mb-2">2. Alimentos e Medicamentos Termolábeis</h3>
      <p class="font-body-md text-on-surface mb-3">Mantenha geladeira e freezer fechados (conservam o frio por 4h na geladeira e até 24h-48h no freezer cheio). Medicamentos como insulina podem ficar em bolsa térmica com gelo reciclável fora da luz direta.</p>

      <h3 class="text-secondary font-headline-sm uppercase mb-2">3. Riscos Invisíveis no Escuro</h3>
      <ul class="list-disc list-inside font-body-md text-on-surface-variant space-y-1">
        <li><strong>Monóxido de Carbono:</strong> Nunca ligue geradores a gasolina ou fogareiros a carvão dentro de casa, garagem ou banheiros fechados.</li>
        <li><strong>Incêndios:</strong> Prefira lanternas LED em vez de velas próximas a cortinas, colchões ou crianças.</li>
        <li><strong>Dinheiro em Espécie:</strong> Maquininhas e Pix param sem rede elétrica/internet — mantenha notas trocadas na carteira.</li>
      </ul>
    `
  }
};

let wakeLockSentinel = null;

async function requestScreenWakeLock() {
  if (!('wakeLock' in navigator)) return;
  try {
    if (!wakeLockSentinel) {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      wakeLockSentinel.addEventListener('release', () => {
        wakeLockSentinel = null;
      });
    }
  } catch (e) {
    // Dispositivo ou modo de energia pode recusar wakeLock silenciosamente
  }
}

function releaseScreenWakeLock() {
  if (wakeLockSentinel) {
    wakeLockSentinel.release().catch(() => {});
    wakeLockSentinel = null;
  }
}

function openGuideModal(guideKey) {
  triggerHaptic(20);
  const data = guidesData[guideKey];
  if (!data) return;

  const modal = document.getElementById('guide-modal');
  const modalTitle = document.getElementById('guide-modal-title');
  const modalCategory = document.getElementById('guide-modal-category');
  const modalCover = document.getElementById('guide-modal-cover');
  const modalBody = document.getElementById('guide-modal-body');

  if (modalTitle) modalTitle.textContent = data.title;
  if (modalCategory) modalCategory.textContent = data.category;
  if (modalCover) modalCover.src = data.cover;
  if (modalBody) modalBody.innerHTML = data.content;

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestScreenWakeLock();
  }
}

function closeGuideModal() {
  triggerHaptic(15);
  const modal = document.getElementById('guide-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    releaseScreenWakeLock();
  }
}

// ==========================================
// MÓDULO 6: MODAL SOS IMEDIATO, GPS OFFLINE & MODO APAGÃO
// ==========================================
function openSOSModal() {
  triggerHaptic(50);
  const modal = document.getElementById('sos-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderSavedGPS();
    initBatteryMonitor();
    requestScreenWakeLock();
  }
}

function closeSOSModal() {
  triggerHaptic(20);
  stopWhistle();
  const modal = document.getElementById('sos-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    releaseScreenWakeLock();
  }
}

function toggleBlackoutMode() {
  triggerHaptic(25);
  appState.blackoutMode = !appState.blackoutMode;
  saveState();
  applyBlackoutMode();
  showToast(appState.blackoutMode
    ? 'Modo Apagão ativado: tela OLED preta e animações reduzidas.'
    : 'Modo Apagão desativado.'
  );
}

function applyBlackoutMode() {
  const active = !!appState.blackoutMode;
  document.body.classList.toggle('blackout-mode', active);

  const headerBtn = document.getElementById('btn-blackout-mode');
  if (headerBtn) {
    headerBtn.className = active
      ? 'w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center border border-primary active:scale-95 transition-all'
      : 'w-9 h-9 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface-variant flex items-center justify-center border border-surface-container-highest/60 active:scale-95 transition-all';
  }

  const sosBtn = document.getElementById('sos-blackout-btn');
  if (sosBtn) {
    sosBtn.className = active
      ? 'px-2.5 py-1 rounded-lg bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase font-bold border border-primary active:scale-95 transition-all flex items-center gap-1 flex-shrink-0'
      : 'px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase border border-surface-container-highest active:scale-95 transition-all flex items-center gap-1 flex-shrink-0';
  }
}

let batteryManagerRef = null;

function updateBatteryLabel(battery) {
  const el = document.getElementById('sos-battery-status');
  if (!el || !battery) return;
  const pct = Math.round((battery.level || 0) * 100);
  const chargingText = battery.charging ? ' • Carregando' : '';
  el.textContent = `Bateria: ${pct}%${chargingText}`;
  el.className = pct <= 20 && !battery.charging
    ? 'font-display-code text-xs text-error font-bold truncate'
    : 'font-display-code text-xs text-on-surface truncate';
}

function initBatteryMonitor() {
  const el = document.getElementById('sos-battery-status');
  if (!navigator.getBattery) {
    if (el) el.textContent = 'Economia: OLED Disponível';
    return;
  }
  if (batteryManagerRef) {
    updateBatteryLabel(batteryManagerRef);
    return;
  }
  navigator.getBattery().then((battery) => {
    batteryManagerRef = battery;
    updateBatteryLabel(battery);
    battery.addEventListener('levelchange', () => updateBatteryLabel(battery));
    battery.addEventListener('chargingchange', () => updateBatteryLabel(battery));
  }).catch(() => {
    if (el) el.textContent = 'Economia: OLED Disponível';
  });
}

function renderSavedGPS() {
  const coordsEl = document.getElementById('sos-gps-coords');
  const accEl = document.getElementById('sos-gps-accuracy');
  const timeEl = document.getElementById('sos-gps-time');
  const gps = appState.lastGPS;

  if (!gps || !coordsEl) return;
  coordsEl.textContent = `${gps.lat.toFixed(6)}, ${gps.lon.toFixed(6)}`;
  if (accEl) accEl.textContent = `Precisão ±${Math.round(gps.accuracy || 0)}m • Última leitura salva`;
  if (timeEl) timeEl.textContent = gps.timeLabel || 'Salvo';
}

function fetchOfflineGPS() {
  triggerHaptic(25);
  const coordsEl = document.getElementById('sos-gps-coords');
  const accEl = document.getElementById('sos-gps-accuracy');
  const timeEl = document.getElementById('sos-gps-time');

  if (!navigator.geolocation) {
    showToast('GPS não suportado neste dispositivo.');
    return;
  }

  if (coordsEl) coordsEl.textContent = 'Buscando sinal de satélite...';
  if (accEl) accEl.textContent = 'Aproxime-se de janela ou área aberta';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const now = new Date();
      const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      appState.lastGPS = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        timeLabel: `Hoje ${timeLabel}`
      };
      saveState();
      renderSavedGPS();
      if (timeEl) timeEl.textContent = `Hoje ${timeLabel}`;
      showToast('Coordenadas GPS capturadas e salvas offline!');
    },
    (err) => {
      const msg = err.code === 1
        ? 'Permissão de localização negada.'
        : 'Sinal GPS indisponível no momento.';
      if (coordsEl && !appState.lastGPS) coordsEl.textContent = msg;
      else renderSavedGPS();
      showToast(msg);
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
  );
}

function copyGPSCoords() {
  triggerHaptic(20);
  const gps = appState.lastGPS;
  if (!gps) {
    showToast('Capture a posição GPS primeiro.');
    return;
  }
  const text = `SOS Coordenadas GPS: ${gps.lat.toFixed(6)}, ${gps.lon.toFixed(6)} (https://maps.google.com/?q=${gps.lat.toFixed(6)},${gps.lon.toFixed(6)})`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Coordenadas GPS copiadas!');
    }).catch(() => showToast(text));
  } else {
    showToast(text);
  }
}

function sendSOSSMS() {
  triggerHaptic(35);
  const gps = appState.lastGPS;
  const coordsText = gps
    ? `Minha localizacao GPS: ${gps.lat.toFixed(6)}, ${gps.lon.toFixed(6)} - https://maps.google.com/?q=${gps.lat.toFixed(6)},${gps.lon.toFixed(6)}`
    : 'Estou em situacao de emergencia e preciso de ajuda.';
  const body = encodeURIComponent(`SOS EMERGENCIA (Protocolo 72H): ${coordsText}`);
  window.location.href = `sms:?body=${body}`;
}

// Toast de feedback
function showToast(message) {
  const toast = document.getElementById('toast-feedback');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.remove('opacity-0'), 10);
  setTimeout(() => {
    toast.classList.add('opacity-0');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 3500);
}

// ==========================================
// MÓDULO 7: PWA INSTALL & OFFLINE RESILIENCE
// ==========================================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBanner = document.getElementById('pwa-install-banner');
  if (installBanner) installBanner.classList.remove('hidden');
});

// Modal Tático Reutilizável (substitui alert, prompt e confirm nativos)
let tacticalDialogConfirmHandler = null;

function openTacticalDialog(options = {}) {
  triggerHaptic(15);
  const modal = document.getElementById('tactical-dialog-modal');
  const iconEl = document.getElementById('tactical-dialog-icon');
  const iconWrap = document.getElementById('tactical-dialog-icon-wrap');
  const titleEl = document.getElementById('tactical-dialog-title');
  const subtitleEl = document.getElementById('tactical-dialog-subtitle');
  const msgEl = document.getElementById('tactical-dialog-message');
  const inputWrap = document.getElementById('tactical-dialog-input-wrap');
  const inputEl = document.getElementById('tactical-dialog-input');
  const cancelBtn = document.getElementById('tactical-dialog-cancel');
  const confirmBtn = document.getElementById('tactical-dialog-confirm');
  const actionsWrap = document.getElementById('tactical-dialog-actions');

  if (!modal) return;

  const isDanger = options.tone === 'danger';
  if (iconEl) iconEl.textContent = options.icon || (isDanger ? 'warning' : 'info');
  if (iconWrap) {
    iconWrap.className = isDanger
      ? 'w-9 h-9 rounded-lg bg-secondary-container text-white flex items-center justify-center flex-shrink-0'
      : 'w-9 h-9 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center flex-shrink-0';
  }
  if (titleEl) {
    titleEl.textContent = options.title || 'Comunicado Tático';
    titleEl.className = isDanger
      ? 'font-headline-sm text-headline-sm uppercase text-secondary tracking-wide truncate'
      : 'font-headline-sm text-headline-sm uppercase text-primary tracking-wide truncate';
  }
  if (subtitleEl) subtitleEl.textContent = options.subtitle || 'Protocolo 72H';
  if (msgEl) msgEl.textContent = options.message || '';

  if (options.showInput) {
    inputWrap?.classList.remove('hidden');
    if (inputEl) {
      inputEl.value = options.inputValue || '';
      inputEl.placeholder = options.inputPlaceholder || 'https://...';
    }
  } else {
    inputWrap?.classList.add('hidden');
  }

  const showCancel = options.showCancel !== false;
  if (cancelBtn) {
    cancelBtn.classList.toggle('hidden', !showCancel);
    cancelBtn.textContent = options.cancelLabel || 'Cancelar';
  }
  if (actionsWrap) {
    actionsWrap.className = showCancel
      ? 'grid grid-cols-2 gap-2 pt-2 border-t border-surface-container-high'
      : 'grid grid-cols-1 gap-2 pt-2 border-t border-surface-container-high';
  }
  if (confirmBtn) {
    confirmBtn.textContent = options.confirmLabel || 'Confirmar';
    confirmBtn.className = isDanger
      ? 'py-2.5 px-3 rounded-lg bg-secondary-container text-white font-headline-sm text-headline-sm uppercase tracking-wide flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all'
      : 'py-2.5 px-3 rounded-lg bg-primary-container text-on-primary-container font-headline-sm text-headline-sm uppercase tracking-wide flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all';
  }

  tacticalDialogConfirmHandler = () => {
    const val = inputEl?.value?.trim() || '';
    closeTacticalDialog();
    if (typeof options.onConfirm === 'function') {
      options.onConfirm(val);
    }
  };
  if (confirmBtn) confirmBtn.onclick = tacticalDialogConfirmHandler;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (options.showInput) setTimeout(() => inputEl?.focus(), 60);
}

function closeTacticalDialog() {
  const modal = document.getElementById('tactical-dialog-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
  tacticalDialogConfirmHandler = null;
}

function openRadioModal() {
  openTacticalDialog({
    icon: 'radio',
    title: 'Rádio de Emergência AM/FM',
    subtitle: 'Comunicação sem Internet',
    message: 'Em caso de apagão de telefonia ou internet, sintonize seu rádio a pilhas ou manivela na faixa AM 820 kHz ou FM 95.7 MHz (e emissoras públicas locais) para comunicados da Defesa Civil.',
    showCancel: false,
    confirmLabel: 'Entendido'
  });
}

function openFeedPostDetail(postId) {
  const post = (appState.admin?.posts || []).find((p) => p.id === postId);
  if (!post) return;
  openTacticalDialog({
    icon: post.type === 'alerta' ? 'warning' : 'menu_book',
    tone: post.type === 'alerta' ? 'danger' : 'primary',
    title: post.title,
    subtitle: post.type === 'alerta' ? 'Alerta Tático' : 'Comunicado / Guia',
    message: post.desc || 'Sem detalhes adicionais registrados.',
    showCancel: false,
    confirmLabel: 'Fechar'
  });
}

function installPWA() {
  triggerHaptic(30);
  if (!deferredPrompt) {
    openTacticalDialog({
      icon: 'install_mobile',
      title: 'Instalar Protocolo 72H',
      subtitle: 'Acesso 100% Offline',
      message: 'Toque no menu do navegador (três pontinhos no Android ou botão Compartilhar no iPhone) e selecione "Adicionar à tela de início" ou "Instalar aplicativo".',
      showCancel: false,
      confirmLabel: 'Entendido'
    });
    return;
  }
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
      console.log('PWA instalado pelo usuário!');
    }
    deferredPrompt = null;
    const installBanner = document.getElementById('pwa-install-banner');
    if (installBanner) installBanner.classList.add('hidden');
  });
}

// Monitoramento de Rede Online / Offline
function updateNetworkStatus() {
  const isOnline = navigator.onLine;
  const dot = document.getElementById('net-dot');
  const status = document.getElementById('net-status');

  if (isOnline) {
    if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse';
    if (status) {
      status.textContent = 'ONLINE PRONTO';
      status.className = 'font-label-sm text-label-sm text-emerald-400 uppercase tracking-wider';
    }
  } else {
    if (dot) dot.className = 'w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping';
    if (status) {
      status.textContent = 'OFFLINE ATIVO';
      status.className = 'font-label-sm text-label-sm text-amber-400 uppercase tracking-wider';
    }
    showToast('Você está offline. Todas as funções do Protocolo 72H continuam 100% disponíveis!');
  }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// Registro do Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registrado com sucesso no escopo:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Falha ao registrar Service Worker:', err);
      });
  });
}

// ==========================================
// MÓDULO 7: FEED TÁTICO & COMUNICADOS
// ==========================================
function filterFeed(category, element) {
  triggerHaptic(15);
  const buttons = document.querySelectorAll('.feed-filter-btn');
  buttons.forEach((btn) => {
    btn.classList.remove('bg-primary-container', 'text-on-primary', 'shadow-sm');
    btn.classList.add('bg-surface-container', 'text-on-surface-variant');
  });

  if (element) {
    element.classList.remove('bg-surface-container', 'text-on-surface-variant');
    element.classList.add('bg-primary-container', 'text-on-primary', 'shadow-sm');
  }

  const cards = document.querySelectorAll('.feed-card');
  cards.forEach((card) => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function claimOffer(couponCode, itemName) {
  triggerHaptic(30);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(couponCode).then(() => {
      showToast(`Cupom ${couponCode} copiado! Desconto aplicado.`);
    }).catch(() => {
      showToast(`Cupom: ${couponCode} (${itemName})`);
    });
  } else {
    showToast(`Cupom: ${couponCode} (${itemName})`);
  }
}

function joinVIPChannel() {
  triggerHaptic(20);
  showToast('Canal VIP: link do canal copiado para transmissão direta!');
}

// ==========================================
// MÓDULO 8: RELÓGIO TÁTICO OPERACIONAL (DATA & HORA)
// ==========================================
function initTacticalClock() {
  function updateClock() {
    const now = new Date();

    // Formato de hora: HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeFull = `${hours}:${minutes}:${seconds}`;
    const timeShort = `${hours}:${minutes}`;

    // Formato de data tática: QUA, 04 NOV 2026
    const dias = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const diaSemana = dias[now.getDay()];
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = meses[now.getMonth()];
    const ano = now.getFullYear();
    const dateFormatted = `${diaSemana}, ${dia} ${mes} ${ano}`;

    const clockFull = document.getElementById('tactical-full-time');
    const dateFull = document.getElementById('tactical-full-date');
    const clockHeader = document.getElementById('header-live-clock');

    if (clockFull) clockFull.textContent = timeFull;
    if (dateFull) dateFull.textContent = dateFormatted;
    if (clockHeader) clockHeader.textContent = timeShort;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

// ==========================================
// MÓDULO 9: PAINEL ADMINISTRATIVO TÁTICO & GESTÃO DO FEED
// ==========================================
let logoTapCount = 0;
let logoTapTimer = null;

function handleLogoTap() {
  logoTapCount++;
  triggerHaptic(15);

  if (logoTapTimer) clearTimeout(logoTapTimer);

  if (logoTapCount >= 5) {
    logoTapCount = 0;
    triggerHaptic(60);
    openAdminPinModal();
    return;
  }

  logoTapTimer = setTimeout(() => {
    // Se foi apenas 1 clique simples, navega para o início
    if (logoTapCount === 1) {
      switchTab('inicio');
    }
    logoTapCount = 0;
  }, 2000);
}

function openAdminPinModal() {
  triggerHaptic(20);
  const modal = document.getElementById('admin-pin-modal');
  const input = document.getElementById('admin-pin-input');
  const error = document.getElementById('admin-pin-error');
  if (error) error.classList.add('hidden');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 150);
  }
  if (modal) modal.classList.remove('hidden');
}

function closeAdminPinModal() {
  triggerHaptic(15);
  const modal = document.getElementById('admin-pin-modal');
  if (modal) modal.classList.add('hidden');
}

function verifyAdminPIN() {
  const input = document.getElementById('admin-pin-input');
  const error = document.getElementById('admin-pin-error');
  const enteredPin = input ? input.value.trim() : '';

  const correctPin = appState.admin?.pin || '7272';

  if (enteredPin === correctPin) {
    triggerHaptic(40);
    if (!appState.admin) appState.admin = {};
    appState.admin.authenticated = true;
    closeAdminPinModal();
    switchTab('admin');
    triggerAdminToast('Acesso autorizado! Bem-vindo ao Painel do Criador.');
  } else {
    triggerHaptic(80);
    if (error) error.classList.remove('hidden');
    if (input) {
      input.classList.add('border-error');
      setTimeout(() => input.classList.remove('border-error'), 1000);
    }
  }
}

function logoutAdmin() {
  triggerHaptic(20);
  if (appState.admin) {
    appState.admin.authenticated = false;
  }
  switchTab('inicio');
  showToast('Sessão administrativa encerrada.');
}

function selectAdminType(type) {
  triggerHaptic(15);
  const hiddenInput = document.getElementById('admin-post-type');
  if (hiddenInput) hiddenInput.value = type;

  const buttons = document.querySelectorAll('.admin-type-btn');
  buttons.forEach((btn) => {
    if (btn.getAttribute('data-target') === type) {
      btn.className = 'admin-type-btn py-2 px-1 text-center rounded font-label-sm text-label-sm uppercase transition-colors bg-primary-container text-on-primary-container font-bold';
    } else {
      btn.className = 'admin-type-btn py-2 px-1 text-center rounded font-label-sm text-label-sm uppercase transition-colors text-on-surface-variant hover:text-on-surface';
    }
  });
}

function setAdminFormMode(mode) {
  selectAdminType(mode);
  const formSection = document.getElementById('action-form-section');
  if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
}

function handleAdminImageUpload(event) {
  const file = event.target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const preview = document.getElementById('admin-img-preview');
    const hiddenData = document.getElementById('admin-post-image-data');
    const nameLabel = document.getElementById('admin-img-name');

    if (preview) preview.src = dataUrl;
    if (hiddenData) hiddenData.value = dataUrl;
    if (nameLabel) nameLabel.textContent = file.name;
    triggerHaptic(20);
    showToast('Imagem carregada com sucesso!');
  };
  reader.readAsDataURL(file);
}

function updateAdminImageFromUrl(url) {
  if (!url || !url.startsWith('http')) return;
  const preview = document.getElementById('admin-img-preview');
  const hiddenData = document.getElementById('admin-post-image-data');
  const nameLabel = document.getElementById('admin-img-name');

  if (preview) preview.src = url;
  if (hiddenData) hiddenData.value = url;
  if (nameLabel) nameLabel.textContent = 'Imagem via URL Externa';
}

function handleAdminPublish() {
  triggerHaptic(30);

  const titleInput = document.getElementById('admin-post-title');
  const descInput = document.getElementById('admin-post-desc');
  const linkInput = document.getElementById('admin-post-link');
  const couponInput = document.getElementById('admin-post-coupon');
  const priceInput = document.getElementById('admin-post-price');
  const typeInput = document.getElementById('admin-post-type');
  const editingIdInput = document.getElementById('admin-editing-id');
  const imgDataInput = document.getElementById('admin-post-image-data');
  const urgencyRadios = document.getElementsByName('admin-urgency');

  const title = titleInput?.value?.trim();
  const desc = descInput?.value?.trim();

  if (!title) {
    triggerAdminToast('Informe o título do comunicado ou produto antes de publicar.');
    titleInput?.focus();
    return;
  }

  let urgency = 'atencao';
  urgencyRadios.forEach((r) => {
    if (r.checked) urgency = r.value;
  });

  const editingId = editingIdInput?.value;
  const defaultFallbackImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDshZjJJ_n6VY0a3_J3F648i-BNXF0jR7AQ31lHbHJpg76gr9bN7Lx_n7rHzr6l1icjeMnzrcgbBYdLK4uKkqJFTflnmwwWG-OgavZhXZ9h3bfZJ8SX1Hcu0B1DIANHt7SwqMWmlVCqlGjC_IZi3mdoCAK5gcpexjmuHyAZMYB7HiQVFWhV_KsdEzrtQcufJsvavFKCh_CmO3vqXIkF3IN-rxmrigkfWxwlcS3Xyv_J';

  if (!appState.admin.posts) appState.admin.posts = [];

  if (editingId) {
    const post = appState.admin.posts.find((p) => p.id === editingId);
    if (post) {
      post.type = typeInput?.value || 'alerta';
      post.title = title;
      post.desc = desc || '';
      post.link = linkInput?.value?.trim() || '';
      post.coupon = couponInput?.value?.trim() || '';
      post.price = priceInput?.value?.trim() || '';
      if (imgDataInput?.value) post.imageUrl = imgDataInput.value;
      post.urgency = urgency;
      triggerAdminToast('Publicação atualizada com sucesso!');
    }
  } else {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const newPost = {
      id: 'post_' + Date.now(),
      type: typeInput?.value || 'alerta',
      title: title,
      desc: desc || '',
      link: linkInput?.value?.trim() || '',
      coupon: couponInput?.value?.trim() || '',
      price: priceInput?.value?.trim() || '',
      imageUrl: imgDataInput?.value || defaultFallbackImg,
      urgency: urgency,
      status: 'active',
      createdAt: `Hoje • ${hours}:${minutes}`,
      views: 1,
      clicks: 0
    };
    appState.admin.posts.unshift(newPost);
    triggerAdminToast('Publicação gravada e push transmitido para 2.840 membros.');
  }

  saveState();
  cancelAdminEdit();
  renderAdminPostsList();
  renderDynamicFeedCards();
}

function cancelAdminEdit() {
  const titleInput = document.getElementById('admin-post-title');
  const descInput = document.getElementById('admin-post-desc');
  const linkInput = document.getElementById('admin-post-link');
  const couponInput = document.getElementById('admin-post-coupon');
  const priceInput = document.getElementById('admin-post-price');
  const editingIdInput = document.getElementById('admin-editing-id');
  const cancelBtn = document.getElementById('btn-admin-cancel-edit');
  const heading = document.getElementById('admin-form-heading');
  const publishLabel = document.getElementById('btn-admin-publish-label');

  if (titleInput) titleInput.value = '';
  if (descInput) descInput.value = '';
  if (linkInput) linkInput.value = '';
  if (couponInput) couponInput.value = '';
  if (priceInput) priceInput.value = '';
  if (editingIdInput) editingIdInput.value = '';

  if (cancelBtn) cancelBtn.classList.add('hidden');
  if (heading) heading.textContent = 'Publicar no Feed & Home';
  if (publishLabel) publishLabel.textContent = 'PUBLICAR NO FEED AGORA';
}

function editAdminPost(id) {
  triggerHaptic(20);
  const post = appState.admin?.posts?.find((p) => p.id === id);
  if (!post) return;

  selectAdminType(post.type || 'alerta');

  const titleInput = document.getElementById('admin-post-title');
  const descInput = document.getElementById('admin-post-desc');
  const linkInput = document.getElementById('admin-post-link');
  const couponInput = document.getElementById('admin-post-coupon');
  const priceInput = document.getElementById('admin-post-price');
  const editingIdInput = document.getElementById('admin-editing-id');
  const cancelBtn = document.getElementById('btn-admin-cancel-edit');
  const heading = document.getElementById('admin-form-heading');
  const publishLabel = document.getElementById('btn-admin-publish-label');
  const preview = document.getElementById('admin-img-preview');
  const hiddenData = document.getElementById('admin-post-image-data');

  if (titleInput) titleInput.value = post.title || '';
  if (descInput) descInput.value = post.desc || '';
  if (linkInput) linkInput.value = post.link || '';
  if (couponInput) couponInput.value = post.coupon || '';
  if (priceInput) priceInput.value = post.price || '';
  if (editingIdInput) editingIdInput.value = post.id;
  if (preview && post.imageUrl) preview.src = post.imageUrl;
  if (hiddenData && post.imageUrl) hiddenData.value = post.imageUrl;

  if (cancelBtn) cancelBtn.classList.remove('hidden');
  if (heading) heading.textContent = 'Editar Publicação';
  if (publishLabel) publishLabel.textContent = 'SALVAR ALTERAÇÕES';

  const formSection = document.getElementById('action-form-section');
  if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
}

function toggleAdminPostStatus(id) {
  triggerHaptic(20);
  const post = appState.admin?.posts?.find((p) => p.id === id);
  if (post) {
    post.status = post.status === 'active' ? 'paused' : 'active';
    saveState();
    renderAdminPostsList();
    renderDynamicFeedCards();
    triggerAdminToast(post.status === 'active' ? 'Post reativado no feed.' : 'Post pausado temporariamente.');
  }
}

function deleteAdminPost(id) {
  triggerHaptic(30);
  const post = appState.admin?.posts?.find((p) => p.id === id);
  openTacticalDialog({
    icon: 'delete_forever',
    tone: 'danger',
    title: 'Excluir Comunicado',
    subtitle: 'Ação Permanente',
    message: `Deseja realmente excluir "${post?.title || 'este comunicado'}" do Feed e do painel?`,
    confirmLabel: 'Excluir',
    cancelLabel: 'Manter',
    onConfirm: () => {
      appState.admin.posts = appState.admin.posts.filter((p) => p.id !== id);
      saveState();
      renderAdminPostsList();
      renderDynamicFeedCards();
      triggerAdminToast('Comunicado removido com sucesso.');
    }
  });
}

function promptUpdateManual(manualTitle) {
  triggerHaptic(20);
  const currentLink = appState.admin?.manuals?.[manualTitle] || '';
  openTacticalDialog({
    icon: 'picture_as_pdf',
    title: 'Atualizar Manual PDF',
    subtitle: manualTitle,
    message: `Cole o novo link direto ou URL do arquivo PDF para "${manualTitle}":`,
    showInput: true,
    inputValue: currentLink,
    inputPlaceholder: 'https://seusite.com/manuais/guia-72h.pdf',
    confirmLabel: 'Salvar Link',
    onConfirm: (newLink) => {
      if (!newLink) return;
      if (!appState.admin.manuals) appState.admin.manuals = {};
      appState.admin.manuals[manualTitle] = newLink;
      saveState();
      triggerAdminToast(`Manual "${manualTitle}" atualizado! Link registrado com sucesso.`);
    }
  });
}

function triggerAdminBroadcast() {
  triggerHaptic(40);
  triggerAdminToast('Alerta de transmissão imediata (Push) transmitido com sucesso!');
}

function triggerAdminToast(message) {
  const toast = document.getElementById('toast-admin');
  if (!toast) return;
  const label = toast.querySelector('.toast-admin-text');
  if (label && message) label.textContent = message;

  toast.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('translate-y-32', 'opacity-0', 'pointer-events-none');
  }, 3200);
}

function renderAdminPostsList() {
  const container = document.getElementById('admin-posts-container');
  const countBadge = document.getElementById('admin-posts-count-badge');
  if (!container) return;

  const posts = appState.admin?.posts || [];
  if (countBadge) countBadge.textContent = `${posts.length} PUBLICADOS`;

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center rounded-xl bg-surface-container border border-surface-container-high/60 text-on-surface-variant font-body-sm">
        Nenhum comunicado criado ainda. Use o formulário acima para publicar alertas, ofertas ou manuais no Feed.
      </div>
    `;
    return;
  }

  let html = '';
  posts.forEach((p) => {
    const isPaused = p.status === 'paused';
    const typeLabel = p.type === 'alerta' ? 'ALERTA RISCO' : p.type === 'oferta' ? 'OFERTA AFILIADA' : 'CONTEÚDO GUIA';
    const badgeBg = p.type === 'alerta' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-highest text-primary';

    html += `
      <div class="flex flex-col p-space-md rounded-xl bg-surface-container shadow-sm gap-space-xs border border-surface-container-high ${isPaused ? 'opacity-65' : ''}">
        <div class="flex items-center justify-between">
          <span class="px-2 py-0.5 rounded font-label-sm text-label-sm uppercase font-bold flex items-center gap-1 ${isPaused ? 'bg-surface-container-highest text-outline' : badgeBg}">
            ${isPaused ? '<span class="material-symbols-outlined text-[14px]">pause_circle</span> PAUSADO' : typeLabel}
          </span>
          <span class="font-display-code text-[11px] text-tertiary flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">visibility</span>
            ${p.views || 0} visualizações
          </span>
        </div>
        <div class="flex items-center gap-space-sm">
          ${p.imageUrl ? `<img class="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-surface-container-high" src="${p.imageUrl}" alt="Capa"/>` : ''}
          <div class="flex flex-col min-w-0">
            <span class="font-label-lg text-label-lg text-on-surface font-bold truncate ${isPaused ? 'line-through' : ''}">${p.title}</span>
            <span class="font-body-sm text-body-sm text-on-surface-variant truncate">${p.desc || p.createdAt || 'Sem descrição'}</span>
          </div>
        </div>
        <div class="flex items-center justify-end gap-space-xs pt-1 border-t border-surface-container-high/50 mt-1">
          <button onclick="toggleAdminPostStatus('${p.id}')" class="px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface font-label-sm text-label-sm uppercase hover:bg-surface-bright transition-colors">
            ${isPaused ? 'Reativar' : 'Pausar'}
          </button>
          <button onclick="editAdminPost('${p.id}')" class="px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface font-label-sm text-label-sm uppercase hover:bg-surface-bright transition-colors">
            Editar
          </button>
          <button onclick="deleteAdminPost('${p.id}')" class="px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase hover:opacity-80 transition-colors">
            Excluir
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderDynamicFeedCards() {
  const container = document.getElementById('dynamic-feed-cards');
  if (!container) return;

  const posts = (appState.admin?.posts || []).filter((p) => p.status === 'active');

  // Atualizar contador da pílula "Todos (N)"
  const allBtn = document.getElementById('feed-filter-all');
  if (allBtn) {
    const baseStaticCount = 4; // Boletim, Lanterna, Sementes, CEMADEN, Filtro => 5 cards estáticos ou dinâmicos
    const totalCards = document.querySelectorAll('#view-feed .feed-card:not([data-dynamic="true"])').length + posts.length;
    allBtn.textContent = `Todos (${totalCards || (baseStaticCount + posts.length)})`;
  }

  if (posts.length === 0) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  posts.forEach((p) => {
    const isAlerta = p.type === 'alerta';
    const isOferta = p.type === 'oferta';
    const categoryAttr = isAlerta ? 'alerta' : isOferta ? 'ofertas' : (p.link ? 'links' : 'protocolo');

    let badgeHtml = '';
    if (isAlerta) {
      badgeHtml = `
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary-container text-white font-label-sm text-label-sm uppercase tracking-wide font-bold">
          <span class="material-symbols-outlined text-[14px]">warning</span>
          ALERTA TÁTICO
        </span>
      `;
    } else if (isOferta) {
      badgeHtml = `
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wide font-bold">
          <span class="material-symbols-outlined text-[14px]">local_offer</span>
          OFERTA AFILIADA
        </span>
      `;
    } else {
      badgeHtml = `
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm uppercase tracking-wide font-bold">
          <span class="material-symbols-outlined text-[14px]">menu_book</span>
          MANUAL / GUIA
        </span>
      `;
    }

    let actionButtonHtml = '';
    if (isOferta) {
      actionButtonHtml = `
        <div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-high mt-1">
          <div class="flex flex-col">
            <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Valor Ref.</span>
            <span class="font-headline-sm text-headline-sm text-primary font-bold">${p.price || 'Sob Consulta'}</span>
          </div>
          ${p.coupon ? `<span class="px-2 py-1 rounded bg-surface-container font-label-sm text-label-sm text-primary uppercase font-bold border border-primary/30">Cupom: ${p.coupon}</span>` : ''}
        </div>
        <button onclick="${p.link ? `window.open('${p.link}', '_blank')` : `claimOffer('${p.coupon || 'PROT15'}', '${(p.title || '').replace(/'/g, '')}')`}" class="w-full py-3 px-4 rounded-lg bg-primary-container text-on-primary font-headline-sm text-headline-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-md">
          <span>${p.link ? 'ACESSAR PRODUTO NO PARCEIRO' : 'PEGAR CUPOM DE DESCONTO'}</span>
          <span class="material-symbols-outlined text-[18px]">open_in_new</span>
        </button>
      `;
    } else if (isAlerta) {
      actionButtonHtml = `
        <button onclick="${p.link ? `window.open('${p.link}', '_blank')` : `openFeedPostDetail('${p.id}')`}" class="w-full py-3 px-4 rounded-lg bg-secondary-container text-white font-headline-sm text-headline-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-md">
          <span>${p.link ? 'VER DETALHES DO AVISO' : 'CIENTE DO ALERTA'}</span>
          <span class="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      `;
    } else {
      actionButtonHtml = `
        <button onclick="${p.link ? `window.open('${p.link}', '_blank')` : `openFeedPostDetail('${p.id}')`}" class="w-full py-3 px-4 rounded-lg bg-surface-bright text-on-surface font-headline-sm text-headline-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-transform hover:bg-surface-container-highest border border-surface-variant">
          <span>${p.link ? 'ACESSAR MANUAL / PDF' : 'LER PROTOCOLO'}</span>
          <span class="material-symbols-outlined text-[18px]">menu_book</span>
        </button>
      `;
    }

    html += `
      <div class="feed-card bg-surface-container rounded-xl overflow-hidden shadow-sm flex flex-col border border-surface-container-high" data-category="${categoryAttr}" data-dynamic="true">
        ${p.imageUrl ? `
          <div class="relative h-44 w-full bg-surface-container-high overflow-hidden">
            <img class="w-full h-full object-cover" alt="${p.title}" src="${p.imageUrl}" loading="lazy"/>
            <div class="absolute top-3 left-3">
              ${badgeHtml}
            </div>
          </div>
        ` : ''}
        <div class="p-space-md flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <h4 class="font-headline-sm text-headline-sm uppercase text-on-surface leading-snug">${p.title}</h4>
            <p class="font-body-sm text-body-sm text-on-surface-variant">${p.desc}</p>
          </div>
          ${actionButtonHtml}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ==========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Iniciar relógio tático operacional
  initTacticalClock();

  // Configurar listeners de navegação
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const path = tab.getAttribute('data-path');
      if (path) switchTab(path);
    });
  });

  // Checar parâmetro de URL (ex: ?tab=sos ou ?tab=calculadora ou ?tab=admin)
  const urlParams = new URLSearchParams(window.location.search);
  const paramTab = urlParams.get('tab');
  if (paramTab === 'sos') {
    switchTab('inicio');
    openSOSModal();
  } else if (paramTab === 'admin') {
    switchTab('inicio');
    openAdminPinModal();
  } else if (paramTab && ['inicio', 'preparo', 'calculadora', 'checklists', 'plano-familiar', 'feed'].includes(paramTab)) {
    switchTab(paramTab);
  } else {
    switchTab('inicio');
  }

  // Preencher valores da Calculadora
  const calc = appState.calculator;
  const countAdults = document.getElementById('count-adults');
  const countChildren = document.getElementById('count-children');
  const countElderly = document.getElementById('count-elderly');
  const countPets = document.getElementById('count-pets');
  const toggleHeat = document.getElementById('toggle-heat');
  const toggleMedical = document.getElementById('toggle-medical');

  if (countAdults) countAdults.textContent = calc.adults;
  if (countChildren) countChildren.textContent = calc.children;
  if (countElderly) countElderly.textContent = calc.elderly;
  if (countPets) countPets.textContent = calc.pets;
  if (toggleHeat) toggleHeat.checked = !!calc.heatWave;
  if (toggleMedical) toggleMedical.checked = !!calc.medical;

  // Preencher valores do Plano Familiar
  const plan = appState.familyPlan;
  const pe1 = document.getElementById('pe1-input');
  const pe2 = document.getElementById('pe2-input');
  const outCity = document.getElementById('out-city-input');

  if (pe1) pe1.value = plan.pe1 || '';
  if (pe2) pe2.value = plan.pe2 || '';
  if (outCity) outCity.value = plan.outCity || '';

  // Ouvintes de input para salvar plano familiar automaticamente
  [pe1, pe2, outCity].forEach((input) => {
    if (input) {
      input.addEventListener('input', saveFamilyPlanInputs);
    }
  });

  // Renderizar componentes
  applyBlackoutMode();
  initBatteryMonitor();
  renderChecklists();
  renderKitReviewStatus();
  renderFamilyMembers();
  syncVulnerableUI();
  selectRiskScenario(appState.familyPlan?.riskScenario || 'enchente');
  recalculateSupplies();
  updateDashboardMetrics();
  updateNetworkStatus();
  renderDynamicFeedCards();
});

