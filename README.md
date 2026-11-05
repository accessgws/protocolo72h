# 🛡️ Protocolo 72H - PWA Tático de Prontidão Familiar

Aplicativo Progressivo (**PWA - Progressive Web App**) de sobrevivência e prontidão civil familiar para contingências de 72 horas (desastres climáticos, apagões, enchentes e evacuações). Baseado nas diretrizes da Defesa Civil e nos layouts do design system *Tactical 72H Readiness*.

---

## 🚀 Como Executar e Testar

### Método Rápido (Node.js integrado)
Na raiz deste projeto, execute no terminal:
```bash
npm start
```
ou diretamente:
```bash
node server.cjs
```
Abra o navegador em: [http://localhost:8080](http://localhost:8080)

---

## 📱 Instalação como App (PWA)
- **No Google Chrome / Edge (Desktop/Android):** Clique no ícone de instalar na barra de endereços ou no banner que surge no topo: *"Instalar Aplicativo"*.
- **No Safari (iOS / iPhone):** Toque no botão **Compartilhar** e selecione **"Adicionar à Tela de Início"**.
- Uma vez instalado, o aplicativo roda como app nativo com janela própria, sem barra de navegação do browser, e funciona **100% offline**.

---

## 🧩 Telas e Recursos Integrados

1. **Painel Principal (`view-inicio`)**:
   - Medidor de Prontidão Familiar dinâmico (SVG Gauge) atualizado em tempo real.
   - Banner de acesso imediato ao **Modo SOS**.
   - Resumo dinâmico de reserva hídrica e itens pendentes da mochila.
   - Acesso com leitor modal integrado aos **4 Manuais Oficiais**:
     - *Kit Emergência 72h*
     - *Guia Completo de Água & Purificação*
     - *Tabela de Validade & Rotação de Alimentos*
     - *Plano Regional de Riscos Climáticos (Brasil / Alertas 40199)*

2. **Calculadora de Autonomia 72H (`view-calculadora`)**:
   - Dimensionamento de pessoas: Adultos, Crianças, Idosos e Pets.
   - Modificadores ambientais: Clima Quente/Seca (+30% água) e Cuidados Médicos (+20%).
   - Cálculo dinâmico em tempo real de litros de água, calorias e refeições.
   - Sincronização automática com os indicadores do Painel Principal.

3. **Checklists Interativos (`view-checklists`)**:
   - Abas táticas: **Mochila de Fuga (BOB)** e **Estoque Domiciliar (Shelter-in-Place)**.
   - Separação por níveis de criticidade (Prioridade 1, 2 e 3).
   - Marcação com persistência no `localStorage`.
   - Adição e remoção de itens personalizados.
   - Botão para imprimir/gerar PDF do checklist para conferência física.

4. **Plano Familiar 72H (`view-plano-familiar`)**:
   - Cronograma Tático Interativo: Fases 0-2h (Decisão), 24h (Isolamento), 48h (Racionamento) e 72h (Resgate).
   - Ficha com Pontos de Encontro 1 e 2 e Contato Pivô fora da cidade.
   - Ficha médica resumida (tipos sanguíneos, medicamentos e alergias).
   - Botão para formatar e compartilhar todo o plano de emergência via **WhatsApp**.

5. **Feed Tático & Comunicados (`view-feed`)**:
   - Alertas em tempo real da Defesa Civil (Boletins Meteorológicos com orientações de prevenção).
   - Filtros dinâmicos por categoria: *Todos*, *Alertas & Clima*, *Atualizações 72H*, *Equipamentos & Ofertas*, *Links Úteis*.
   - Ofertas e cupons homologados de equipamentos táticos (Lanterna 1200LM, Filtro Portátil) com cópia automática de cupom.
   - Aditivos e manuais em leitura offline integrada (ex: conservação de sementes e grãos em PET).
   - Links diretos com plataformas públicas de radar pluviométrico (CEMADEN / INMET).
   - Acesso ao Canal VIP de transmissão de emergência.

6. **Central de Resgate & Modo SOS Imediato**:
   - Discagem com 1 clique para serviços oficiais de emergência do Brasil:
     - **193** - Corpo de Bombeiros
     - **192** - SAMU
     - **190** - Polícia Militar
     - **199** - Defesa Civil
   - **Apito Tático de Emergência**: Sintetizador de áudio Web Audio API (frequência de 2850 Hz com alta penetração acústica sem necessidade de arquivos externos).
   - **Código Morse SOS Sonoro**: Sequência internacional `... --- ...` sintetizada.
   - **Estroboscópio Visual de Resgate**: Tela piscante de alto contraste para sinalização noturna.

---

## 📁 Estrutura de Arquivos

```text
├── index.html                   # Interface unificada SPA do PWA
├── app.js                       # Lógica reativa, estado e sintetizador de áudio
├── styles.css                   # Animações, estroboscópio e estilos de impressão
├── manifest.webmanifest         # Manifesto PWA com ícones e atalhos rápidos
├── sw.js                        # Service Worker para funcionamento 100% offline
├── server.cjs                   # Servidor HTTP local leve
├── package.json                 # Metadados do projeto e script "start"
├── icons/                       # Ícones SVG e PNG (192x192, 512x512, maskable)
└── stitch_guia_emerg_ncia_72h_pwa/ # Telas e assets originais exportados do Stitch
```

