// pagina de pontos e tiers

// formata numero com ponto (1000 -> 1.000)
function formatarNumero(n) {
    return n.toLocaleString('pt-BR');
}

// forca a pagina a "redesenhar" (truque pra animacao)
function reflow(el) {
    return el.offsetWidth;
}

// lista dos tiers
var TIERS = [
    { id: 1, nome: 'Bronze',   pts: 0,     cor: '#b05a1a', cor2: '#e08a40' },
    { id: 2, nome: 'Prata',    pts: 1000,  cor: '#556270', cor2: '#8395a7' },
    { id: 3, nome: 'Ouro',     pts: 2500,  cor: '#9a7d0a', cor2: '#d4af37' },
    { id: 4, nome: 'Diamond',  pts: 5000,  cor: '#0d47a1', cor2: '#42a5f5' },
    { id: 5, nome: 'Rubi',     pts: 10000, cor: '#9b1050', cor2: '#e84393' },
    { id: 6, nome: 'Lendário', pts: 25000, cor: '#5b21b6', cor2: '#a78bfa' }
];

// descobre em qual tier o usuario ta com base nos pontos
function descobrirTier(pontos) {
    for (var i = TIERS.length - 1; i >= 0; i--) {
        if (pontos >= TIERS[i].pts) return i;
    }
    return 0;
}

// muda o tema da pagina (cor)
function aplicarTema(tier) {
    document.body.dataset.tier = tier.id;
    document.documentElement.style.setProperty('--cor', tier.cor);
    document.documentElement.style.setProperty('--cor2', tier.cor2);
}

window.addEventListener('load', function() {

    // pega tudo da tela
    var ptsDisp = document.getElementById('ptsDisp');
    var ptsTotais = document.getElementById('ptsTotais');
    var ptsFaltam = document.getElementById('ptsFaltam');
    var barra = document.getElementById('progressFill');
    var labelAtual = document.getElementById('tierAtualLabel');
    var labelProx = document.getElementById('tierProxLabel');
    var imgTier = document.getElementById('tierBadge');
    var nomeTier = document.getElementById('tierNome');
    var subTier = document.getElementById('tierSub');

    // modal de subir de tier
    var modalUp = document.getElementById('tierUpModal');
    var imgUp = document.getElementById('tierUpImg');
    var nomeUp = document.getElementById('tierUpNome');
    var subUp = document.getElementById('tierUpSub');
    var particulasBox = document.getElementById('tierUpParticles');

    // pontos do usuario
    var pontosTotais = 0;
    var pontosDisp = 0;
    var tierAgora = 0;

    // atualiza a tela toda com os pontos atuais
    function atualizarTela() {
        var idx = descobrirTier(pontosTotais);
        var tier = TIERS[idx];
        var prox = TIERS[idx + 1];

        ptsDisp.textContent = formatarNumero(pontosDisp);
        ptsTotais.textContent = formatarNumero(pontosTotais);

        // tem proximo tier?
        if (prox) {
            var falta = prox.pts - pontosTotais;
            ptsFaltam.innerHTML = '<i class="bi bi-lightning-fill me-1"></i>Faltam ' + formatarNumero(falta) + ' pts';
            labelProx.textContent = formatarNumero(prox.pts) + ' pts → ' + prox.nome;
            subTier.textContent = 'Faltam ' + formatarNumero(falta) + ' pts para ' + prox.nome;

            // calcula a porcentagem da barra
            var pct = ((pontosTotais - tier.pts) / (prox.pts - tier.pts)) * 100;
            if (pct > 100) pct = 100;
            if (pct < 0) pct = 0;
            barra.style.width = pct + '%';
        } else {
            // ja esta no tier maximo
            ptsFaltam.innerHTML = '<i class="bi bi-trophy-fill me-1"></i>Tier máximo!';
            labelProx.textContent = 'Tier máximo!';
            subTier.textContent = 'Você alcançou o topo!';
            barra.style.width = '100%';
        }

        labelAtual.textContent = tier.nome;
        nomeTier.textContent = tier.nome;
        imgTier.src = '../assets/img/tiers/tier' + tier.id + '.png';

        // marca o tier atual no seletor de tiers
        var todos = document.querySelectorAll('.tier-ts');
        for (var i = 0; i < todos.length; i++) {
            if (parseInt(todos[i].dataset.t) === tier.id) {
                todos[i].classList.add('active');
            } else {
                todos[i].classList.remove('active');
            }
        }

        aplicarTema(tier);
    }

    // cria as bolinhas que voam pra todo lado quando sobe de tier
    function criarParticulas(coresEspeciais) {
        particulasBox.innerHTML = '';

        var cores;
        var quantidade;
        if (coresEspeciais) {
            cores = coresEspeciais;
            quantidade = 45;
        } else {
            cores = ['#fbbf24', '#f59e0b', '#22c55e', '#3b82f6', '#a78bfa', '#ec4899', '#ff6b6b'];
            quantidade = 30;
        }

        for (var i = 0; i < quantidade; i++) {
            var p = document.createElement('span');
            p.className = 'tierup-particle';

            // distribui em volta do centro
            var angulo = (Math.PI * 2 * i) / quantidade;
            var distancia = 80 + Math.random() * 120;

            p.style.setProperty('--px', Math.cos(angulo) * distancia + 'px');
            p.style.setProperty('--py', Math.sin(angulo) * distancia + 'px');
            p.style.left = '50%';
            p.style.top = '45%';
            p.style.background = cores[i % cores.length];

            var tamanho = (4 + Math.random() * 6) + 'px';
            p.style.width = tamanho;
            p.style.height = tamanho;
            p.style.animationDelay = (Math.random() * 0.4) + 's';

            // pra tiers altos: mistura quadrado e bolinha
            if (coresEspeciais) {
                if (Math.random() > 0.5) {
                    p.style.borderRadius = '50%';
                } else {
                    p.style.borderRadius = '2px';
                }
            }

            particulasBox.appendChild(p);
        }
    }

    // mostra o modal de "subiu de tier!"
    function mostrarTierUp(tier, prox) {
        imgUp.src = '../assets/img/tiers/tier' + tier.id + '.png';
        nomeUp.textContent = tier.nome;

        if (prox) {
            subUp.textContent = 'Próximo: ' + prox.nome + ' (' + formatarNumero(prox.pts) + ' pts)';
        } else {
            subUp.textContent = 'Parabéns, você é lendário!';
        }

        modalUp.className = 'tierup-modal';
        modalUp.classList.add('tier-' + tier.id);

        // cores especiais pros tiers mais altos
        var cores = null;
        if (tier.id === 6) {
            cores = ['#ff3b3b','#ff9500','#ffd60a','#34c759','#00c7be','#0a84ff','#5e5ce6','#bf5af2','#ff375f'];
        } else if (tier.id === 5) {
            cores = ['#e84393','#fbbf24','#ff6b6b','#ec4899','#f472b6','#db2777','#fcd34d'];
        } else if (tier.id === 4) {
            cores = ['#42a5f5','#0d47a1','#90caf9','#1e88e5','#bbdefb','#64b5f6','#fff'];
        }
        criarParticulas(cores);

        reflow(modalUp);
        modalUp.classList.add('show');
        modalUp.setAttribute('aria-hidden', 'false');

        // tier mais alto, modal fica mais tempo
        var tempo;
        if (tier.id >= 5) {
            tempo = 4500;
        } else if (tier.id === 4) {
            tempo = 4000;
        } else {
            tempo = 3500;
        }

        setTimeout(function() {
            modalUp.classList.remove('show');
            modalUp.setAttribute('aria-hidden', 'true');
        }, tempo);
    }

    // adiciona pontos e ve se subiu de tier
    function adicionarPontos(qtd) {
        pontosTotais = pontosTotais + qtd;
        pontosDisp = pontosDisp + qtd;

        var novoIdx = descobrirTier(pontosTotais);

        // subiu de tier?
        if (novoIdx > tierAgora) {
            tierAgora = novoIdx;
            atualizarTela();
            setTimeout(function() {
                mostrarTierUp(TIERS[novoIdx], TIERS[novoIdx + 1]);
            }, 200);
        } else {
            atualizarTela();
        }
    }

    // zera tudo
    function resetarPontos() {
        pontosTotais = 0;
        pontosDisp = 0;
        tierAgora = 0;
        atualizarTela();
    }

    // botoes de teste (debug)
    document.getElementById('btnDebug100').onclick = function() { adicionarPontos(100); };
    document.getElementById('btnDebug500').onclick = function() { adicionarPontos(500); };
    document.getElementById('btnDebug1000').onclick = function() { adicionarPontos(1000); };
    document.getElementById('btnDebugReset').onclick = resetarPontos;

    // modal de recompensa resgatada
    var modalReward = document.getElementById('rewardModal');
    var rewardSub = document.getElementById('rewardSub');
    var rewardPts = document.getElementById('rewardPts');

    function mostrarRewardModal(nome, custo) {
        if (!modalReward) return;
        rewardSub.textContent = nome;
        rewardPts.textContent = '-' + custo + ' pts';
        modalReward.classList.remove('show');
        reflow(modalReward);
        modalReward.classList.add('show');
        modalReward.setAttribute('aria-hidden', 'false');
        setTimeout(function() {
            modalReward.classList.remove('show');
            modalReward.setAttribute('aria-hidden', 'true');
        }, 4000);
    }

    // botoes de resgatar recompensa
    var botoes = document.querySelectorAll('.btn-resgatar');
    for (var i = 0; i < botoes.length; i++) {
        botoes[i].onclick = function() {
            var btn = this;
            if (btn.disabled) return;

            var card = btn.closest('.pg-recompensa');
            var nome = card ? card.dataset.nome : 'Recompensa';
            var custo = card ? card.dataset.custo : '0';
            var custoNum = parseInt(custo.replace(/\./g, ''), 10) || 0;

            // nao tem pontos suficientes
            if (pontosDisp < custoNum) {
                btn.textContent = 'Pontos insuficientes!';
                btn.classList.add('shake');
                setTimeout(function() {
                    btn.textContent = 'Resgatar';
                    btn.classList.remove('shake');
                }, 1500);
                return;
            }

            // tira os pontos
            pontosDisp = pontosDisp - custoNum;

            // animacao no card
            if (card) {
                card.classList.add('resgatando');
                setTimeout(function() {
                    card.classList.remove('resgatando');
                    card.classList.add('resgatado');
                }, 900);
            }

            // muda o botao
            btn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>Resgatado!';
            btn.classList.remove('primary');
            btn.classList.add('success');
            btn.disabled = true;

            atualizarTela();
            mostrarRewardModal(nome, custo);
        };
    }

    // botao "ver mais recompensas"
    var btnMais = document.getElementById('btnVerMais');
    var caixaExtras = document.getElementById('recExtras');
    if (btnMais && caixaExtras) {
        btnMais.onclick = function() {
            var aberto = caixaExtras.classList.toggle('show');
            if (aberto) {
                btnMais.classList.add('aberto');
                btnMais.querySelector('span').textContent = 'Ver menos';
            } else {
                btnMais.classList.remove('aberto');
                btnMais.querySelector('span').textContent = 'Ver mais recompensas';
            }
        };
    }

    // seletor manual de tier (clicar pra mudar tema)
    var tiersBtns = document.querySelectorAll('.tier-ts');
    for (var t = 0; t < tiersBtns.length; t++) {
        tiersBtns[t].onclick = function() {
            var n = parseInt(this.dataset.t);
            var todos = document.querySelectorAll('.tier-ts');
            for (var j = 0; j < todos.length; j++) {
                todos[j].classList.remove('active');
            }
            this.classList.add('active');
            imgTier.src = '../assets/img/tiers/tier' + n + '.png';
            nomeTier.textContent = this.dataset.nome;
            aplicarTema(TIERS[n - 1]);
        };
    }

    // painel de ajuda
    var btnAjuda = document.getElementById('btnHelp');
    var painel = document.getElementById('helpPanel');
    var fecharPainel = document.getElementById('helpPanelClose');
    if (btnAjuda && painel) {
        btnAjuda.onclick = function() {
            painel.classList.toggle('show');
        };
        fecharPainel.onclick = function() {
            painel.classList.remove('show');
        };
    }

    // mascote - troca a frase a cada 5 segundos
    var frases = ['Continue assim! 🐾', 'Resgate uma recompensa! 🎁', 'Consultas dão pontos! 🩺', 'Você está no top 5! 🏆'];
    var balao = document.getElementById('mascoteBalao');
    var idxFrase = 0;
    setInterval(function() {
        balao.classList.add('hidden');
        setTimeout(function() {
            idxFrase = idxFrase + 1;
            balao.textContent = frases[idxFrase % frases.length];
            balao.classList.remove('hidden');
        }, 300);
    }, 5000);

    // mascote arrastavel pelo mouse
    var mascote = document.getElementById('mascoteFloat');
    var arrastando = false;
    var ox = 0;
    var oy = 0;

    mascote.onmousedown = function(e) {
        arrastando = true;
        mascote.classList.add('dragging');
        var caixa = mascote.getBoundingClientRect();
        ox = e.clientX - caixa.left;
        oy = e.clientY - caixa.top;
        e.preventDefault();
    };

    document.addEventListener('mousemove', function(e) {
        if (!arrastando) return;

        // limita pra nao sair da tela
        var x = e.clientX - ox;
        var y = e.clientY - oy;
        if (x < 0) x = 0;
        if (x > window.innerWidth - mascote.offsetWidth) x = window.innerWidth - mascote.offsetWidth;
        if (y < 0) y = 0;
        if (y > window.innerHeight - mascote.offsetHeight) y = window.innerHeight - mascote.offsetHeight;

        mascote.style.left = x + 'px';
        mascote.style.top = y + 'px';
        mascote.style.right = 'auto';
        mascote.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', function() {
        arrastando = false;
        mascote.classList.remove('dragging');
    });

    // ja inicia a tela
    atualizarTela();
});
