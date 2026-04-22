function reflow(el) { return el.offsetWidth; }

function fmt(n) { return n.toLocaleString('pt-BR'); }

var TIERS = [
    { id: 1, nome: 'Bronze',    pts: 0,     cor: '#b05a1a', cor2: '#e08a40' },
    { id: 2, nome: 'Prata',     pts: 1000,  cor: '#556270', cor2: '#8395a7' },
    { id: 3, nome: 'Ouro',      pts: 2500,  cor: '#9a7d0a', cor2: '#d4af37' },
    { id: 4, nome: 'Diamond',   pts: 5000,  cor: '#0d47a1', cor2: '#42a5f5' },
    { id: 5, nome: 'Rubi',      pts: 10000, cor: '#9b1050', cor2: '#e84393' },
    { id: 6, nome: 'Lendário',  pts: 25000, cor: '#5b21b6', cor2: '#a78bfa' }
];

function getTierIdx(pts) {
    for (var i = TIERS.length - 1; i >= 0; i--) {
        if (pts >= TIERS[i].pts) return i;
    }
    return 0;
}

function aplicarTema(tier) {
    document.body.dataset.tier = tier.id;
    document.documentElement.style.setProperty('--cor', tier.cor);
    document.documentElement.style.setProperty('--cor2', tier.cor2);
}

document.addEventListener('DOMContentLoaded', function() {
    var ptsDisp = document.getElementById('ptsDisp');
    var ptsTotais = document.getElementById('ptsTotais');
    var ptsFaltam = document.getElementById('ptsFaltam');
    var progressFill = document.getElementById('progressFill');
    var tierAtualLabel = document.getElementById('tierAtualLabel');
    var tierProxLabel = document.getElementById('tierProxLabel');
    var tierBadge = document.getElementById('tierBadge');
    var tierNome = document.getElementById('tierNome');
    var tierSub = document.getElementById('tierSub');
    var tierUpModal = document.getElementById('tierUpModal');
    var tierUpImg = document.getElementById('tierUpImg');
    var tierUpNome = document.getElementById('tierUpNome');
    var tierUpSub = document.getElementById('tierUpSub');
    var tierUpParts = document.getElementById('tierUpParticles');

    var pontosTotais = 0;
    var pontosDisp = 0;
    var tierAtualIdx = 0;

    function atualizarUI() {
        var idx = getTierIdx(pontosTotais);
        var tier = TIERS[idx];
        var prox = TIERS[idx + 1];

        ptsDisp.textContent = fmt(pontosDisp);
        ptsTotais.textContent = fmt(pontosTotais);

        if (prox) {
            var falta = prox.pts - pontosTotais;
            ptsFaltam.innerHTML = '<i class="bi bi-lightning-fill me-1"></i>Faltam ' + fmt(falta) + ' pts';
            tierProxLabel.textContent = fmt(prox.pts) + ' pts → ' + prox.nome;
            tierSub.textContent = 'Faltam ' + fmt(falta) + ' pts para ' + prox.nome;
            var progresso = ((pontosTotais - tier.pts) / (prox.pts - tier.pts)) * 100;
            progressFill.style.width = Math.min(100, Math.max(0, progresso)) + '%';
        } else {
            ptsFaltam.innerHTML = '<i class="bi bi-trophy-fill me-1"></i>Tier máximo!';
            tierProxLabel.textContent = 'Tier máximo!';
            tierSub.textContent = 'Você alcançou o topo!';
            progressFill.style.width = '100%';
        }

        tierAtualLabel.textContent = tier.nome;
        tierNome.textContent = tier.nome;
        tierBadge.src = '../assets/img/tiers/tier' + tier.id + '.png';

        var allTs = document.querySelectorAll('.tier-ts');
        for (var i = 0; i < allTs.length; i++) {
            if (parseInt(allTs[i].dataset.t) === tier.id) {
                allTs[i].classList.add('active');
            } else {
                allTs[i].classList.remove('active');
            }
        }

        aplicarTema(tier);
    }

    function criarParticulas(coresCustom) {
        tierUpParts.innerHTML = '';
        var cores;
        var qtd;
        if (coresCustom) {
            cores = coresCustom;
            qtd = 45;
        } else {
            cores = ['#fbbf24', '#f59e0b', '#22c55e', '#3b82f6', '#a78bfa', '#ec4899', '#ff6b6b'];
            qtd = 30;
        }

        for (var i = 0; i < qtd; i++) {
            var p = document.createElement('span');
            p.className = 'tierup-particle';
            var ang = (Math.PI * 2 * i) / qtd;
            var dist = 80 + Math.random() * 120;
            p.style.setProperty('--px', Math.cos(ang) * dist + 'px');
            p.style.setProperty('--py', Math.sin(ang) * dist + 'px');
            p.style.left = '50%';
            p.style.top = '45%';
            p.style.background = cores[i % cores.length];
            var size = (4 + Math.random() * 6) + 'px';
            p.style.width = size;
            p.style.height = size;
            p.style.animationDelay = (Math.random() * 0.4) + 's';
            if (coresCustom) {
                if (Math.random() > 0.5) {
                    p.style.borderRadius = '50%';
                } else {
                    p.style.borderRadius = '2px';
                }
            }
            tierUpParts.appendChild(p);
        }
    }

    function mostrarTierUp(tier, prox) {
        tierUpImg.src = '../assets/img/tiers/tier' + tier.id + '.png';
        tierUpNome.textContent = tier.nome;

        if (prox) {
            tierUpSub.textContent = 'Próximo: ' + prox.nome + ' (' + fmt(prox.pts) + ' pts)';
        } else {
            tierUpSub.textContent = 'Parabéns, você é lendário!';
        }

        tierUpModal.className = 'tierup-modal';
        tierUpModal.classList.add('tier-' + tier.id);

        var cores = null;
        if (tier.id === 6) {
            cores = ['#ff3b3b','#ff9500','#ffd60a','#34c759','#00c7be','#0a84ff','#5e5ce6','#bf5af2','#ff375f'];
        } else if (tier.id === 5) {
            cores = ['#e84393','#fbbf24','#ff6b6b','#ec4899','#f472b6','#db2777','#fcd34d'];
        } else if (tier.id === 4) {
            cores = ['#42a5f5','#0d47a1','#90caf9','#1e88e5','#bbdefb','#64b5f6','#fff'];
        }
        criarParticulas(cores);

        reflow(tierUpModal);
        tierUpModal.classList.add('show');
        tierUpModal.setAttribute('aria-hidden', 'false');

        var duracao;
        if (tier.id >= 5) {
            duracao = 4500;
        } else if (tier.id === 4) {
            duracao = 4000;
        } else {
            duracao = 3500;
        }

        setTimeout(function() {
            tierUpModal.classList.remove('show');
            tierUpModal.setAttribute('aria-hidden', 'true');
        }, duracao);
    }

    function adicionarPontos(qtd) {
        pontosTotais += qtd;
        pontosDisp += qtd;
        var novoIdx = getTierIdx(pontosTotais);

        if (novoIdx > tierAtualIdx) {
            tierAtualIdx = novoIdx;
            atualizarUI();
            setTimeout(function() {
                mostrarTierUp(TIERS[novoIdx], TIERS[novoIdx + 1]);
            }, 200);
        } else {
            atualizarUI();
        }
    }

    function resetPontos() {
        pontosTotais = 0;
        pontosDisp = 0;
        tierAtualIdx = 0;
        atualizarUI();
    }

    document.getElementById('btnDebug100').onclick = function() { adicionarPontos(100); };
    document.getElementById('btnDebug500').onclick = function() { adicionarPontos(500); };
    document.getElementById('btnDebug1000').onclick = function() { adicionarPontos(1000); };
    document.getElementById('btnDebugReset').onclick = resetPontos;

    // Resgate de recompensas
    var rewardModal = document.getElementById('rewardModal');
    var rewardSub = document.getElementById('rewardSub');
    var rewardPts = document.getElementById('rewardPts');

    function mostrarRewardModal(nome, custo) {
        if (!rewardModal) return;
        rewardSub.textContent = nome;
        rewardPts.textContent = '-' + custo + ' pts';
        rewardModal.classList.remove('show');
        reflow(rewardModal);
        rewardModal.classList.add('show');
        rewardModal.setAttribute('aria-hidden', 'false');
        setTimeout(function() {
            rewardModal.classList.remove('show');
            rewardModal.setAttribute('aria-hidden', 'true');
        }, 4000);
    }

    var botoesResgatar = document.querySelectorAll('.btn-resgatar');
    for (var i = 0; i < botoesResgatar.length; i++) {
        botoesResgatar[i].onclick = function() {
            var btn = this;
            if (btn.disabled) return;

            var card = btn.closest('.pg-recompensa');
            var nome = card ? card.dataset.nome : 'Recompensa';
            var custo = card ? card.dataset.custo : '0';
            var custoNum = parseInt(custo.replace(/\./g, ''), 10) || 0;

            if (pontosDisp < custoNum) {
                btn.textContent = 'Pontos insuficientes!';
                btn.classList.add('shake');
                setTimeout(function() {
                    btn.textContent = 'Resgatar';
                    btn.classList.remove('shake');
                }, 1500);
                return;
            }

            pontosDisp -= custoNum;

            if (card) {
                card.classList.add('resgatando');
                setTimeout(function() {
                    card.classList.remove('resgatando');
                    card.classList.add('resgatado');
                }, 900);
            }

            btn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>Resgatado!';
            btn.classList.remove('primary');
            btn.classList.add('success');
            btn.disabled = true;

            atualizarUI();
            mostrarRewardModal(nome, custo);
        };
    }

    // Ver mais recompensas
    var btnVerMais = document.getElementById('btnVerMais');
    var recExtras = document.getElementById('recExtras');
    if (btnVerMais && recExtras) {
        btnVerMais.onclick = function() {
            var aberto = recExtras.classList.toggle('show');
            if (aberto) {
                btnVerMais.classList.add('aberto');
                btnVerMais.querySelector('span').textContent = 'Ver menos';
            } else {
                btnVerMais.classList.remove('aberto');
                btnVerMais.querySelector('span').textContent = 'Ver mais recompensas';
            }
        };
    }

    // Tier selector manual
    var tierTsAll = document.querySelectorAll('.tier-ts');
    for (var t = 0; t < tierTsAll.length; t++) {
        tierTsAll[t].onclick = function() {
            var n = parseInt(this.dataset.t);
            var todosTs = document.querySelectorAll('.tier-ts');
            for (var j = 0; j < todosTs.length; j++) {
                todosTs[j].classList.remove('active');
            }
            this.classList.add('active');
            tierBadge.src = '../assets/img/tiers/tier' + n + '.png';
            tierNome.textContent = this.dataset.nome;
            aplicarTema(TIERS[n - 1]);
        };
    }

    // Painel de ajuda
    var btnHelp = document.getElementById('btnHelp');
    var helpPanel = document.getElementById('helpPanel');
    var helpPanelClose = document.getElementById('helpPanelClose');
    if (btnHelp && helpPanel) {
        btnHelp.onclick = function() {
            helpPanel.classList.toggle('show');
        };
        helpPanelClose.onclick = function() {
            helpPanel.classList.remove('show');
        };
    }

    // Mascote frases
    var frases = ['Continue assim! 🐾', 'Resgate uma recompensa! 🎁', 'Consultas dão pontos! 🩺', 'Você está no top 5! 🏆'];
    var balao = document.getElementById('mascoteBalao');
    var fraseIdx = 0;
    setInterval(function() {
        balao.classList.add('hidden');
        setTimeout(function() {
            fraseIdx++;
            balao.textContent = frases[fraseIdx % frases.length];
            balao.classList.remove('hidden');
        }, 300);
    }, 5000);

    // Mascote drag
    var mascote = document.getElementById('mascoteFloat');
    var drag = false;
    var ox = 0;
    var oy = 0;

    mascote.addEventListener('mousedown', function(e) {
        drag = true;
        mascote.classList.add('dragging');
        var rect = mascote.getBoundingClientRect();
        ox = e.clientX - rect.left;
        oy = e.clientY - rect.top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!drag) return;
        mascote.style.left = Math.max(0, Math.min(e.clientX - ox, innerWidth - mascote.offsetWidth)) + 'px';
        mascote.style.top = Math.max(0, Math.min(e.clientY - oy, innerHeight - mascote.offsetHeight)) + 'px';
        mascote.style.right = 'auto';
        mascote.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', function() {
        drag = false;
        mascote.classList.remove('dragging');
    });

    atualizarUI();
});
