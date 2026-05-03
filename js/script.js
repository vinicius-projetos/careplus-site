// pagina inicial (home)

window.addEventListener('load', function() {

    // menu da esquerda - marca o item clicado como ativo
    var itens = document.querySelectorAll('.sb-menu li:not(.sep)');
    for (var i = 0; i < itens.length; i++) {
        itens[i].onclick = function() {
            var todos = document.querySelectorAll('.sb-menu li');
            for (var j = 0; j < todos.length; j++) {
                todos[j].classList.remove('active');
            }
            this.classList.add('active');
        };
    }

    // botao de confirmar presenca
    var botao = document.getElementById('btnConfirm');
    var modal = document.getElementById('confirmModal');

    function abrirModal() {
        if (!modal) return;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        // fecha sozinho depois de 2.5 segundos
        setTimeout(function() {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
        }, 2500);
    }

    function confirmar() {
        if (botao.disabled) return;
        botao.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Presença confirmada!';
        botao.style.background = 'linear-gradient(135deg,#16a34a,#22c55e)';
        botao.style.borderColor = 'transparent';
        botao.style.boxShadow = '0 4px 14px rgba(22,163,74,.35),inset 0 1px 0 rgba(255,255,255,.25)';
        botao.disabled = true;
        abrirModal();
    }

    botao.onclick = confirmar;

    // notificacao do topo
    var aviso = document.getElementById('notif');
    var botoesAviso = document.querySelectorAll('.notif-btn');
    for (var k = 0; k < botoesAviso.length; k++) {
        botoesAviso[k].onclick = function() {
            if (this.classList.contains('primary')) {
                confirmar();
            }
            aviso.style.display = 'none';
        };
    }

    // botao de ajuda flutuante
    document.getElementById('helpFab').onclick = function() {
        alert('Central de Ajuda - Em breve!');
    };

    // tiers (bronze, prata, etc) - clica e troca o tema da pagina
    var tiers = document.querySelectorAll('.tier');
    for (var t = 0; t < tiers.length; t++) {
        tiers[t].onclick = function() {
            var cor = this.dataset.cor;
            var cor2 = this.dataset.cor2;
            var fundo = this.dataset.bg;
            var num = parseInt(this.dataset.tier);

            // tira o "atual" de todos e poe so neste
            var todos = document.querySelectorAll('.tier');
            for (var x = 0; x < todos.length; x++) {
                todos[x].classList.remove('atual');
            }
            this.classList.add('atual');

            // troca a imagenzinha do mascote do topo
            document.getElementById('tierAtualImg').src = 'assets/img/tiers/tier' + num + '.png';

            // muda o fundo e as cores do site
            document.body.style.background = fundo;
            document.body.dataset.tier = num;
            document.documentElement.style.setProperty('--cor', cor);
            document.documentElement.style.setProperty('--cor2', cor2);

            // se for o tier 6 (lendario), poe arco-iris na barra
            var barra = document.querySelector('.barra-fill');
            if (num === 6) {
                barra.style.background = 'var(--rainbow)';
                barra.style.backgroundSize = '300% 100%';
                barra.style.animation = 'rainbowShift 3s linear infinite';
            } else {
                barra.style.background = '';
                barra.style.backgroundSize = '';
                barra.style.animation = '';
            }
        };
    }
});
