---
name: Tactical 72H Readiness
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393e'
  surface-container-lowest: '#0c0e12'
  surface-container-low: '#1a1c20'
  surface-container: '#1e2024'
  surface-container-high: '#282a2e'
  surface-container-highest: '#333539'
  on-surface: '#e2e2e8'
  on-surface-variant: '#d8c3ad'
  inverse-surface: '#e2e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#a08e7a'
  outline-variant: '#534434'
  surface-tint: '#ffb95f'
  primary: '#ffc174'
  on-primary: '#472a00'
  primary-container: '#f59e0b'
  on-primary-container: '#613b00'
  inverse-primary: '#855300'
  secondary: '#ffb4ab'
  on-secondary: '#690005'
  secondary-container: '#bb0112'
  on-secondary-container: '#ffc8c1'
  tertiary: '#9fd1ff'
  on-tertiary: '#003351'
  tertiary-container: '#5bb8fe'
  on-tertiary-container: '#00476e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb8'
  primary-fixed-dim: '#ffb95f'
  on-primary-fixed: '#2a1700'
  on-primary-fixed-variant: '#653e00'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#93000b'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#111317'
  on-background: '#e2e2e8'
  surface-variant: '#333539'
typography:
  headline-xl:
    fontFamily: Oswald
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: 0.02em
  headline-xl-mobile:
    fontFamily: Oswald
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Oswald
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.01em
  headline-md:
    fontFamily: Oswald
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Oswald
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
  display-code:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.25rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

O design system estabelece uma linguagem visual utilitária, tática e orientada à ação sob estresse para aplicações móveis e PWAs de sobrevivência, defesa civil e prontidão emergencial familiar. Em situações críticas — como enchentes, secas severas, apagões ou evacuações imediatas —, a cognição humana é reduzida pela sobrecarga emocional. Portanto, a estética abandona ornamentos vazios e adota princípios do **design funcional militar e de resgate**: altíssimo contraste, hierarquia tipográfica assertiva e separação cromática funcional.

O tom evoca prontidão serena, preparo técnico e confiabilidade institucional acessível para a família. A identidade equilibra o rigor técnico de consoles de missão com a facilidade ergonômica de toque em dispositivos portáteis operados com uma só mão ou em condições adversas de iluminação (sol pleno ou escuridão total).

## Colors

A arquitetura de cores opera prioritariamente em modo escuro profundo, reduzindo o consumo de bateria em telas OLED durante apagões e prevenindo ofuscamento noturno. Cada cor cumpre uma função tática inequívoca:

- **Surface & Backgrounds (`#0F1115`, `#181B20`, `#22262E`):** Tons neutros escuros de carbono e grafite tático criam camadas sólidas e acolhedoras para leitura contínua.
- **Alerta & Prontidão Primária (`#F59E0B` / `#EAB308`):** Amarelo tático de alta visibilidade, utilizado para estados de atenção, contadores regressivos de 72h, botões de ação principal e cabeçalhos de destaque.
- **Emergência & Ação Crítica (`#DC2626`):** Vermelho resgate com alto índice de urgência, reservado para botões SOS, checklists vitais incompletos, rotas de fuga e evacuação imediata.
- **Suprimento & Hidratação (`#0284C7`):** Ciano técnico dedicado à gestão de água potável, saneamento, telecomunicação e recursos estáveis.
- **Sucesso Operacional (`#10B981`):** Verde tático indicador de item checado, abrigo seguro validado ou recurso suficiente.
- **Texto e Elementos Frontais (`#F9FAFB` e `#9CA3AF`):** Branco puro para títulos capitulares e cinza neutro para metadados secundários com contraste ratio superior a 7:1 (compatível com WCAG AAA).

## Typography

A tipografia combina a imposição compacta e urgente do **Oswald** em títulos e indicadores de prontidão com a precisão neutra e ergonômica do **Inter** para conteúdo operacional, instruções de purificação de água e contagens numéricas.

- **Títulos e Comandos (Oswald):** Usados preferencialmente em caixa-alta (`uppercase`) para categorias de risco, contadores horários e seções primárias. Essa densidade vertical canaliza o espírito dos manuais técnicos militares e de manuais de emergência física, acelerando a decodificação rápida.
- **Leitura Contínua e Instruções (Inter):** Altura-x generosa e abertura de caracteres projetadas para preservar a legibilidade em baixa densidade de luz, telas danificadas ou durante movimentação física rápida.
- **Rótulos e Badges (Inter Uppercase SemiBold/Bold):** Todos os rótulos de prioridade, status de inventário e coordenadas empregam rastreamento levemente expandido (`letterSpacing: 0.05em` a `0.08em`) para legibilidade instantânea.

## Layout & Spacing

O sistema de layout é moldado pelo paradigma **Mobile-First / PWA**, assumindo operação via toque sob trepidação ou pressa:

- **Grid:** Layout fluido de 4 colunas em dispositivos móveis (`margin: 1rem`, `gutter: 0.75rem`), expandindo para 8 colunas em tablets e 12 colunas em telas amplas.
- **Zona de Toque Tática:** Qualquer componente interativo (checkboxes de checklist, botões de socorro, toggles de kit) possui área de toque mínima inviolável de **48x48px**.
- **Ritmo Vertical:** Base modular de 4px/8px para condensar densidade de informação sem gerar sensação de desordem claustrofóbica. Listas de itens vitais utilizam `space-sm` internamente e `space-md` como separador de grupos temáticos.

## Elevation & Depth

Em um contexto tático escuro, sombras convencionais de iluminação difusa tornam-se ineficazes. O design system baseia a profundidade em **camadas de superfície (Tonal Surface Layering)** e **linhas de contorno de precisão (Precision Keylines)**:

1. **Plano Base (Background):** `#0F1115` — O nível mais profundo da tela.
2. **Plano de Conteinerização (Surface Card):** `#181B20` com borda sutil de 1px em `#2A2F3A` (opacidade de 60%). Oferece separação física sem depender de sombra.
3. **Plano Ativo / Elevado (Interactive & Dialog):** `#22262E` com realce luminoso pontual de 1px nas bordas superiores (`border-t: rgba(255,255,255,0.08)`).
4. **Alerta Elevado (Floating SOS / Action Bar):** Sombra ambiente tática `0px 4px 20px rgba(0, 0, 0, 0.65)` combinada com halos coloridos de baixa intensidade (`box-shadow: 0 0 16px rgba(245, 158, 11, 0.2)` para itens críticos em amarelo).

## Shapes

O sistema utiliza a classificação de curvatura **2 (Rounded)**:
- Elementos regulares recebem `0.5rem` (8px).
- Elementos amplos como cards de módulo e modais recebem `1rem` (16px).
- Badges e seletores compactos recebem cantos moderados (`4px` a `8px`) mantendo um formato técnico e estruturado, evitando bordas circulares completas (estilo pill) que diluem o rigor visual tático.

Essa proporção suaviza o impacto de telas densas no PWA sem perder a robustez geométrica característica de equipamentos utilitários como rádios comunicadores, lanternas e estojos herméticos de primeiros socorros.

## Components

### 1. Botões de Ação Tática
- **Primário (Alerta 72H):** Fundo `#F59E0B`, texto `#0F1115` em peso 700 tipografia Oswald uppercase. Feedback tátil forte ao pressionar (`active: scale(0.98)`).
- **Crítico / SOS:** Fundo `#DC2626`, texto `#FFFFFF`, borda sutil `#EF4444`. Pulsante em momentos de alerta máximo.
- **Secundário / Utilitário:** Fundo `#1F242D`, borda de 1px `#374151`, texto `#F9FAFB`.

### 2. Cards de Inventário e Módulo (Água, Comida, Primeiros Socorros)
- Fundo estruturado em `#181B20`, cantos de 8px a 16px, cabeçalho interno com micro-etiqueta temática (ex.: faixa ciano superior para Água, faixa amarela para Despensa).
- Métricas em destaque com contadores em Oswald (ex.: `4.5L / 12L RESTANTES`).

### 3. Checklists de Sobrevivência
- Caixas de marcação com área ativa de toque ampliada (mínimo 48px).
- Estado desmarcado: borda `#4B5563` sobre fundo transparente.
- Estado marcado: fundo `#10B981` com ícone de confirmação em `#FFFFFF`, riscando sutilmente o texto com opacidade reduzida a 60%.

### 4. Badges de Status e Criticidade
- Micro-conteineres compactos com cantos de 4px, texto em `label-sm` Inter uppercase:
  - *Crítico / Imediato:* Fundo `rgba(220, 38, 38, 0.15)`, borda e texto `#EF4444`.
  - *Atenção / 72 Horas:* Fundo `rgba(245, 158, 11, 0.15)`, borda e texto `#F59E0B`.
  - *Estável / Potável:* Fundo `rgba(2, 132, 199, 0.15)`, borda e texto `#38BDF8`.

### 5. Barra Inferior Persistente (PWA Navigation)
- Fixada na base da viewport com `backdrop-filter: blur(12px)` e fundo `#0F1115` a 90% de opacidade.
- 4 ou 5 destinos táticos essenciais: *Manual*, *Mochila 72h*, *Água*, *Família/Rotas*, *SOS*.
- Ícones com traço técnico de 2px, com o indicador ativo realçado pelo amarelo `#F59E0B`.

### 6. Controles de Entrada (Inputs de Ração, Validade e Litros)
- Fundo `#12151B`, contorno regular `#2E3440`. Ao focar, contorno transita para `#F59E0B` com leve anel de emissão tática (`ring: 2px rgba(245,158,11,0.2)`).