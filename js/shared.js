// codigo que roda em todas as paginas

window.addEventListener('load', function () {
    // menu do avatar (canto de cima)
    var avatar = document.getElementById('avatarBtn');
    var menu = document.getElementById('avatarDropdown');
    var caixa = document.getElementById('avatarWrap');

    if (avatar && menu) {
        // clica no avatar -> abre/fecha
        avatar.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('show');
        });

        // clica fora -> fecha
        document.addEventListener('click', function (e) {
            if (caixa && !caixa.contains(e.target)) {
                menu.classList.remove('show');
            }
        });
    }

    // botao flutuante de ajuda -> abre o modal da central de ajuda
    var fab = document.getElementById('helpFab');
    var modalEl = document.getElementById('helpModal');
    if (fab && modalEl && window.bootstrap) {
        var helpModal = new bootstrap.Modal(modalEl);
        fab.addEventListener('click', function () {
            helpModal.show();
        });
    }
});

// utilitario: abre um modal "glass" e fecha sozinho depois de X ms
function mostrarModalGlass(modal, tempoMs) {
    if (!modal) return;
    var tempo = typeof tempoMs === 'number' ? tempoMs : 2500;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(function () {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }, tempo);
}

// utilitario: marca um elemento como unico (com a classe dada) dentro de um grupo
function marcarUnico(container, alvo, seletor, classe) {
    var todos = container.querySelectorAll(seletor);
    for (var i = 0; i < todos.length; i++) todos[i].classList.remove(classe);
    alvo.classList.add(classe);
}
