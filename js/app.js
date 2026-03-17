const phases = [
  {
    num: 1, color: 'blue', title: 'Análise e entendimento da tarefa',
    tag: 'CTFL', tagClass: 'tag-ctfl',
    steps: [
      'Leia o ticket completo: descrição, critérios de aceite e anexos.',
      'Identifique o tipo de tarefa: novo recurso ou correção de bug.',
      'Compreenda o escopo — o que está dentro e o que está fora da mudança.',
      'Mapeie as dependências com outros módulos ou funcionalidades.',
      'Identifique os riscos e áreas de maior impacto (risk-based testing).',
    ],
    note: { text: 'CTFL: esta fase corresponde ao processo de "análise de teste" — entender o que testar antes de definir como testar.', cls: 'note-shared' },
  },
  {
    num: 2, color: 'teal', title: 'Planejamento dos testes',
    tag: 'CTFL', tagClass: 'tag-ctfl',
    steps: [
      'Defina a abordagem: quais tipos de teste aplicar (funcional, regressão, integração, etc.).',
      'Estime o esforço e o tempo necessário para os testes.',
      'Determine o ambiente de teste necessário (dados, usuário, configuração).',
      'Decida quais casos serão manuais e quais serão automatizados.',
      'Verifique se existem testes automatizados anteriores que precisam ser atualizados.',
    ],
    note: { text: 'Para bugs: foque nos testes de confirmação (confirmar a correção) e regressão (garantir que nada quebrou na área afetada).', cls: 'note-bug' },
  },
  {
    num: 3, color: 'amber', title: 'Criação dos casos de teste',
    tag: 'Ambos', tagClass: 'tag-both',
    steps: [
      'Escreva os casos de teste com: pré-condições, passos, dados de entrada e resultado esperado.',
      'Use técnicas de design: partição de equivalência, análise de valor limite, tabela de decisão.',
      'Cubra cenários positivos (happy path) e negativos (erros, limites, permissões).',
      'Para bugs: crie um caso de teste que reproduza exatamente o comportamento defeituoso.',
      'Para novos recursos: cubra todos os critérios de aceite do ticket.',
      'Documente no formato padrão da equipe (ex: Given/When/Then ou CT-01, CT-02...).',
    ],
    note: null,
  },
  {
    num: 4, color: 'purple', title: 'Execução dos testes manuais',
    tag: 'Manual', tagClass: 'tag-manual',
    steps: [
      'Prepare o ambiente e os dados de teste necessários.',
      'Execute cada caso de teste seguindo os passos documentados.',
      'Registre o resultado de cada caso: passou, falhou ou bloqueado.',
      'Capture evidências para todos os casos (print, vídeo, log).',
      'Para falhas: documente o comportamento real e compare com o esperado.',
      'Teste exploratório: após a execução formal, explore a funcionalidade livremente.',
    ],
    note: { text: 'Para bugs: execute o caso que reproduz o defeito antes de qualquer outro para confirmar a correção (teste de confirmação).', cls: 'note-bug' },
  },
  {
    num: 5, color: 'coral', title: 'Execução dos testes automatizados',
    tag: 'Auto', tagClass: 'tag-auto',
    steps: [
      'Execute a suíte de regressão automatizada existente.',
      'Para novos recursos: crie ou solicite scripts de automação para os cenários principais.',
      'Para bugs: verifique se já existe (ou crie) um teste automatizado que cubra o defeito corrigido.',
      'Analise os resultados: diferencie falhas reais de falhas de ambiente (flaky tests).',
      'Atualize scripts desatualizados que quebraram por mudanças legítimas na UI ou lógica.',
    ],
    note: { text: 'CTFL: testes de regressão são candidatos ideais para automação — executados repetidamente a cada deploy ou alteração.', cls: 'note-shared' },
  },
  {
    num: 6, color: 'green', title: 'Registro e comunicação dos resultados',
    tag: 'CTFL', tagClass: 'tag-ctfl',
    steps: [
      'Registre o resultado consolidado no ticket (passou / reprovado / parcial).',
      'Reporte novos defeitos encontrados com: passos para reproduzir, evidência e severidade.',
      'Inclua métricas básicas: total de casos, passaram, falharam, bloqueados.',
      'Comunique ao desenvolvedor os defeitos com informação suficiente para correção.',
      'Atualize o status do ticket conforme o fluxo da equipe (ex: "Em reteste", "Aprovado em QA").',
    ],
    note: { text: 'Para novos recursos aprovados: documente quais testes cobrirão esta funcionalidade no ciclo de regressão futuro.', cls: 'note-feature' },
  },
  {
    num: 7, color: 'blue', title: 'Reteste e regressão (se houver falhas)',
    tag: 'Ambos', tagClass: 'tag-both',
    steps: [
      'Após a correção do defeito, execute novamente os casos que falharam.',
      'Execute regressão na área afetada pela correção (escopo ampliado se necessário).',
      'Confirme que os critérios de aceite originais ainda são atendidos.',
      'Valide que a correção não introduziu novos defeitos (regressão).',
      'Repita o ciclo até que todos os casos estejam aprovados ou riscos estejam aceitos.',
    ],
    note: null,
  },
];

function renderPhase(p) {
  const num = String(p.num).padStart(2, '0');
  const steps = p.steps.map((s, i) => `
    <li id="step-${p.num}-${i}">
      <label>
        <input type="checkbox" onchange="toggleStep('step-${p.num}-${i}', this.checked)">
        <span>${s}</span>
      </label>
    </li>`).join('');

  const note = p.note
    ? `<div class="note ${p.note.cls}">${p.note.text}</div>`
    : '';

  return `
    <div class="phase" data-num="${p.num}">
      <div class="phase-header" onclick="togglePhase(${p.num})">
        <div class="phase-num num-${p.color}">${num}</div>
        <span class="phase-title">${p.title}</span>
        <span class="phase-tag ${p.tagClass}">${p.tag}</span>
        <button class="btn-clear-phase" onclick="clearPhase(${p.num}, event)">Limpar</button>
        <span class="chevron">▼</span>
      </div>
      <div class="phase-body" id="body-${p.num}">
        <div class="phase-body-inner">
          <ul class="steps">${steps}</ul>
          ${note}
        </div>
      </div>
    </div>`;
}

function render() {
  const list = document.getElementById('phase-list');
  list.innerHTML = phases.map(renderPhase).join('');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.phase').forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
    observer.observe(el);
  });
}

function updatePhaseState(phase) {
  const boxes = [...phase.querySelectorAll('.steps input[type="checkbox"]')];
  const anyChecked = boxes.some(cb => cb.checked);
  const allChecked = boxes.every(cb => cb.checked);
  phase.classList.toggle('has-checked', anyChecked);
  phase.classList.toggle('completed', allChecked);
}

function toggleStep(id, checked) {
  const li = document.getElementById(id);
  li.classList.toggle('done', checked);
  updatePhaseState(li.closest('.phase'));
}

function clearPhase(num, event) {
  event.stopPropagation();
  const phase = document.querySelector(`.phase[data-num="${num}"]`);
  phase.querySelectorAll('.steps input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
    cb.closest('li').classList.remove('done');
  });
  phase.classList.remove('has-checked', 'completed');
}

function clearAll() {
  document.querySelectorAll('.steps input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
    cb.closest('li').classList.remove('done');
  });
  document.querySelectorAll('.phase').forEach(p => p.classList.remove('has-checked', 'completed'));
}

function togglePhase(num) {
  const phase = document.querySelector(`.phase[data-num="${num}"]`);
  const body = document.getElementById('body-' + num);
  const isOpen = phase.classList.contains('open');
  phase.classList.toggle('open', !isOpen);
  body.style.maxHeight = isOpen ? '0' : body.scrollHeight + 'px';
}

render();
