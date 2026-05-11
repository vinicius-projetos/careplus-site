// pagina inicial (home)

window.addEventListener('load', function () {

    // botao de confirmar presenca
    var botao = document.getElementById('btnConfirm');
    var modal = document.getElementById('confirmModal');
    var aviso = document.getElementById('notif');
    var botaoNotif = aviso && aviso.querySelector('.notif-btn.primary');

    // marca um botao como "confirmado" (cor verde, desabilitado, com checkmark)
    function marcarConfirmado(el, espacamento) {
        if (!el) return;
        el.innerHTML = '<i class="bi bi-check-circle-fill me-' + espacamento + '"></i>Presença confirmada' + (espacamento === 2 ? '!' : '');
        el.classList.add('btn-confirmado');
        el.disabled = true;
    }

    function fecharNotif() {
        if (aviso) aviso.style.display = 'none';
    }

    // wrappers do localStorage (alguns navegadores em modo privado podem nao ter)
    function salvarPresenca() {
        try { localStorage.setItem('presencaConfirmada', '1'); } catch (e) { /* ignora */ }
    }
    function jaConfirmou() {
        try { return localStorage.getItem('presencaConfirmada') === '1'; } catch (e) { return false; }
    }

    function confirmar() {
        if (botao && botao.disabled) return;
        marcarConfirmado(botao, 2);
        marcarConfirmado(botaoNotif, 1);
        salvarPresenca();
        mostrarModalGlass(modal);
        fecharNotif();
    }

    if (botao) botao.onclick = confirmar;

    // notificacao do topo - botoes
    var botoesAviso = document.querySelectorAll('.notif-btn');
    for (var k = 0; k < botoesAviso.length; k++) {
        botoesAviso[k].onclick = function (ev) {
            if (this.classList.contains('primary')) {
                ev.preventDefault();
                confirmar();
                return;
            }
            fecharNotif();
        };
    }

    var fecharX = document.getElementById('notifClose');
    if (fecharX) fecharX.onclick = fecharNotif;

    // se ja confirmou antes, mantem o cartao confirmado e esconde a notif
    if (jaConfirmou()) {
        marcarConfirmado(botao, 2);
        fecharNotif();
    }

    // tiers (bronze, prata, etc) - clica e troca o tema da pagina
    // obs: o estilo arco-iris do tier 6 e cuidado pelo CSS via body[data-tier="6"]
    var listaTiers = document.querySelector('.tiers');
    var tierAtualImg = document.getElementById('tierAtualImg');
    var raiz = document.documentElement;

    function aplicarTema(tier) {
        var num = Number.parseInt(tier.dataset.tier, 10);

        marcarUnico(listaTiers, tier, '.tier', 'atual');
        tierAtualImg.src = 'assets/img/tiers/tier' + num + '.png';

        document.body.style.background = tier.dataset.bg;
        document.body.dataset.tier = num;
        raiz.style.setProperty('--cor', tier.dataset.cor);
        raiz.style.setProperty('--cor2', tier.dataset.cor2);
    }

    var tiers = document.querySelectorAll('.tier');
    for (var t = 0; t < tiers.length; t++) {
        tiers[t].onclick = function () { aplicarTema(this); };
    }
});
