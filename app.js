/**
 * PROTOCOLO 72H - Motor Lógico do Progressive Web App
 * Aplicação Tática de Prontidão e Emergência Familiar
 */

// Estado global persistido
const STORAGE_KEY = 'PROTOCOLO_72H_STATE_V1';

const defaultState = {
  activeTab: 'inicio',
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
  }
};

let appState = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(defaultState));
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed };
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
    alert('Áudio não suportado no seu navegador.');
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
    if (btn) btn.textContent = 'Desativar Estroboscópio';
  } else {
    isStrobeActive = false;
    overlay.classList.add('hidden');
    overlay.classList.remove('strobe-active');
    if (btn) btn.textContent = 'Ativar Estroboscópio Visual SOS';
  }
}

// Navegação entre abas
function switchTab(targetTab) {
  triggerHaptic(20);
  appState.activeTab = targetTab;
  saveState();

  // Esconder todas as telas
  const views = ['inicio', 'calculadora', 'checklists', 'plano-familiar', 'feed'];
  views.forEach((v) => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.add('hidden');
  });

  // Mostrar tela alvo
  const targetEl = document.getElementById(`view-${targetTab}`);
  if (targetEl) {
    targetEl.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Atualizar visual da barra de navegação inferior
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach((tab) => {
    const path = tab.getAttribute('data-path');
    if (path === targetTab) {
      tab.classList.add('active', 'text-primary-container');
      tab.classList.remove('text-on-surface-variant');
      tab.setAttribute('aria-current', 'page');
    } else {
      tab.classList.remove('active', 'text-primary-container');
      tab.classList.add('text-on-surface-variant');
      tab.removeAttribute('aria-current');
    }
  });

  // Atualizar subtítulo do cabeçalho
  const subtitleMap = {
    inicio: 'Início',
    calculadora: 'Calculadora',
    checklists: 'Checklists',
    'plano-familiar': 'Plano Familiar',
    feed: 'Feed'
  };
  const subEl = document.getElementById('header-breadcrumb');
  if (subEl) subEl.textContent = subtitleMap[targetTab] || 'Prontidão';

  // Se for início ou calculadora, recomputar métricas
  if (targetTab === 'inicio') {
    updateDashboardMetrics();
  } else if (targetTab === 'calculadora') {
    recalculateSupplies();
  } else if (targetTab === 'checklists') {
    renderChecklists();
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
  triggerHaptic(20);
  appState.checklists.activeSubTab = type;
  saveState();

  const tabBob = document.getElementById('tab-bob');
  const tabHome = document.getElementById('tab-home');

  if (type === 'bob') {
    tabBob.className = 'py-2.5 px-3 rounded-lg font-headline-sm text-headline-sm uppercase text-center transition-all bg-primary-container text-on-primary-container shadow-md flex items-center justify-center gap-1.5 min-h-[48px]';
    tabHome.className = 'py-2.5 px-3 rounded-lg font-headline-sm text-headline-sm uppercase text-center transition-all text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1.5 min-h-[48px]';
  } else {
    tabHome.className = 'py-2.5 px-3 rounded-lg font-headline-sm text-headline-sm uppercase text-center transition-all bg-primary-container text-on-primary-container shadow-md flex items-center justify-center gap-1.5 min-h-[48px]';
    tabBob.className = 'py-2.5 px-3 rounded-lg font-headline-sm text-headline-sm uppercase text-center transition-all text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1.5 min-h-[48px]';
  }

  renderChecklists();
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
  const name = prompt('Nome do suprimento ou equipamento a adicionar:');
  if (!name || name.trim() === '') return;

  const tag = prompt('Categoria (ex: Hidratação, Ferramenta, Saúde, Energia):') || 'Geral';
  const detail = prompt('Detalhes/peso (ex: 200g, 1 un, estanque):') || 'Contingência';
  const priorityStr = prompt('Prioridade (1 = Crítico, 2 = Básico, 3 = Conforto):') || '2';
  const priority = parseInt(priorityStr, 10) || 2;

  const isBob = appState.checklists.activeSubTab === 'bob';
  const newItem = {
    id: 'custom_' + Date.now(),
    title: name.trim(),
    tag: tag.trim(),
    detail: detail.trim(),
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
  showToast(`Item "${newItem.title}" cadastrado com sucesso!`);
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
  const name = prompt('Nome completo e parentesco (ex: João - Filho 12 anos):');
  if (!name || name.trim() === '') return;

  const blood = prompt('Tipo Sanguíneo (ex: O+, A-, AB+, B-):') || 'Desconhecido';
  const note = prompt('Medicamentos contínuos, alergias ou cuidados vitais:') || 'Sem restrições relatadas.';

  const newMember = {
    id: Date.now(),
    name: name.trim(),
    blood: blood.trim(),
    note: note.trim()
  };

  appState.familyPlan.members.push(newMember);
  saveState();
  renderFamilyMembers();
  showToast(`Membro ${newMember.name} registrado no plano!`);
}

function removeFamilyMember(id) {
  triggerHaptic(25);
  appState.familyPlan.members = appState.familyPlan.members.filter((m) => m.id !== id);
  saveState();
  renderFamilyMembers();
}

function sharePlanViaWhatsApp() {
  triggerHaptic(30);
  saveFamilyPlanInputs();

  const plan = appState.familyPlan;
  const calc = appState.calculator;

  const membersText = plan.members
    .map((m) => `• *${m.name}* (${m.blood}): ${m.note}`)
    .join('\n');

  const message =
    `🚨 *PROTOCOLO 72H - NOSSO PLANO FAMILIAR DE PRONTIDÃO*\n\n` +
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
  const bobItems = appState.checklists.bobItems;
  const bobTotal = bobItems.length;
  const bobChecked = bobItems.filter((i) => i.checked).length;
  const bobPercent = bobTotal > 0 ? (bobChecked / bobTotal) : 0;

  // Cálculo da prontidão geral
  const readiness = Math.round(bobPercent * 100);

  // Gauge circular SVG
  const gaugePercentEl = document.getElementById('dash-gauge-percent');
  const gaugeCircleEl = document.getElementById('dash-gauge-circle');
  if (gaugePercentEl) gaugePercentEl.textContent = `${readiness}%`;
  if (gaugeCircleEl) {
    // 2 * PI * 30 ≈ 188.4
    const offset = 188.4 * (1 - readiness / 100);
    gaugeCircleEl.style.strokeDashoffset = offset;
  }

  // Valores de água na bento card
  const dashWaterEl = document.getElementById('dash-water-metric');
  const dashWaterBar = document.getElementById('dash-water-bar');
  const calc = appState.calculator;
  const totalWater = ((calc.adults * 3.5 + calc.children * 2.5 + calc.elderly * 3.0) * (calc.days || 3) * (calc.heatWave ? 1.3 : 1)).toFixed(0);
  const reservedEstimate = Math.min(totalWater, Math.round(totalWater * (bobChecked / bobTotal)));

  if (dashWaterEl) dashWaterEl.textContent = `${reservedEstimate}L / ${totalWater}L`;
  if (dashWaterBar) {
    const wPct = totalWater > 0 ? Math.min(100, Math.round((reservedEstimate / totalWater) * 100)) : 100;
    dashWaterBar.style.width = `${wPct}%`;
  }

  // BOB Itens
  const dashBobEl = document.getElementById('dash-bob-metric');
  const dashBobBar = document.getElementById('dash-bob-bar');
  if (dashBobEl) dashBobEl.textContent = `${bobChecked} / ${bobTotal} itens`;
  if (dashBobBar) dashBobBar.style.width = `${readiness}%`;

  // Pendências
  const pendingEl = document.getElementById('dash-pending-count');
  const pendingCount = bobTotal - bobChecked;
  if (pendingEl) {
    pendingEl.textContent = pendingCount > 0 ? `${pendingCount} itens pendentes para 72h` : 'Todos os itens conferidos!';
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
  }
};

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
  }
}

function closeGuideModal() {
  triggerHaptic(15);
  const modal = document.getElementById('guide-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// ==========================================
// MÓDULO 6: MODAL SOS IMEDIATO
// ==========================================
function openSOSModal() {
  triggerHaptic(50);
  const modal = document.getElementById('sos-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeSOSModal() {
  triggerHaptic(20);
  stopWhistle();
  const modal = document.getElementById('sos-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
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

function installPWA() {
  triggerHaptic(30);
  if (!deferredPrompt) {
    alert('Para instalar o Protocolo 72H: Toque no menu do navegador (três pontinhos ou botão de compartilhar) e selecione "Adicionar à tela de início" ou "Instalar aplicativo".');
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
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Configurar listeners de navegação
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const path = tab.getAttribute('data-path');
      if (path) switchTab(path);
    });
  });

  // Checar parâmetro de URL (ex: ?tab=sos ou ?tab=calculadora)
  const urlParams = new URLSearchParams(window.location.search);
  const paramTab = urlParams.get('tab');
  if (paramTab === 'sos') {
    switchTab('inicio');
    openSOSModal();
  } else if (paramTab && ['inicio', 'calculadora', 'checklists', 'plano-familiar', 'feed'].includes(paramTab)) {
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
  renderChecklists();
  renderFamilyMembers();
  recalculateSupplies();
  updateDashboardMetrics();
  updateNetworkStatus();
});

