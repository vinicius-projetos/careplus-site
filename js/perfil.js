// pagina de perfil - editar dados

window.addEventListener('load', function() {

    // mostra mensagenzinha (toast) la em baixo
    function mostrarToast(texto) {
        var toast = document.getElementById('pfToast');
        document.getElementById('pfToastMsg').textContent = texto;
        toast.classList.add('show');
        setTimeout(function() {
            toast.classList.remove('show');
        }, 2500);
    }

    // pega todos os botoes de "editar"
    var botoes = document.querySelectorAll('.pf-btn-editar');
    for (var i = 0; i < botoes.length; i++) {
        botoes[i].onclick = function() {
            var botao = this;
            var card = botao.closest('.glass-card');

            // o card do topo (perfil) tem editar diferente dos outros
            if (botao.dataset.section === 'perfil') {
                editarPerfil(card, botao);
            } else {
                editarCampos(card, botao);
            }
        };
    }

    // editar o card do topo: nome, cargo e local
    function editarPerfil(card, botao) {
        var nome = card.querySelector('.pf-nome');
        var cargo = card.querySelector('.pf-cargo');
        var local = card.querySelector('.pf-local');

        // troca o texto por inputs
        nome.innerHTML = '<input type="text" class="pf-input" value="' + nome.textContent + '">';
        cargo.innerHTML = '<input type="text" class="pf-input" value="' + cargo.textContent + '">';
        var textoLocal = local.textContent.trim();
        local.innerHTML = '<i class="bi bi-geo-alt"></i> <input type="text" class="pf-input" style="width:calc(100% - 20px);display:inline-block" value="' + textoLocal + '">';

        // muda o botao pra "salvar"
        botao.innerHTML = '<i class="bi bi-check-lg me-1"></i>Salvar';
        botao.classList.add('salvando');

        // quando clica em salvar, volta tudo a ser texto
        botao.onclick = function() {
            nome.textContent = nome.querySelector('input').value;
            cargo.textContent = cargo.querySelector('input').value;
            local.innerHTML = '<i class="bi bi-geo-alt"></i> ' + local.querySelector('input').value;

            botao.innerHTML = '<i class="bi bi-pencil me-1"></i>Editar';
            botao.classList.remove('salvando');
            mostrarToast('Perfil atualizado!');

            // volta a funcao de editar pro botao
            botao.onclick = function() {
                editarPerfil(card, botao);
            };
        };
    }

    // editar os outros cards (com varios campos)
    function editarCampos(card, botao) {
        var campos = card.querySelectorAll('.pf-campo');

        // troca cada campo por um input ou textarea
        for (var j = 0; j < campos.length; j++) {
            var span = campos[j].querySelector('span');
            var texto = span.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim();

            // se tem quebra de linha, vira textarea. senao, input normal
            if (texto.indexOf('\n') !== -1) {
                span.innerHTML = '<textarea class="pf-input pf-textarea">' + texto + '</textarea>';
            } else {
                span.innerHTML = '<input type="text" class="pf-input" value="' + texto + '">';
            }
        }

        card.classList.add('editando');
        botao.innerHTML = '<i class="bi bi-check-lg me-1"></i>Salvar';
        botao.classList.add('salvando');

        // salvar - pega o que foi digitado e volta a ser texto
        botao.onclick = function() {
            for (var j = 0; j < campos.length; j++) {
                var input = campos[j].querySelector('input, textarea');
                var span = campos[j].querySelector('span');
                if (input.tagName === 'TEXTAREA') {
                    span.innerHTML = input.value.replace(/\n/g, '<br>');
                } else {
                    span.textContent = input.value;
                }
            }

            card.classList.remove('editando');
            botao.innerHTML = '<i class="bi bi-pencil me-1"></i>Editar';
            botao.classList.remove('salvando');
            mostrarToast('Dados salvos!');

            botao.onclick = function() {
                editarCampos(card, botao);
            };
        };
    }

    // botao de ajuda
    document.getElementById('helpFab').onclick = function() {
        alert('Central de Ajuda - Em breve!');
    };
});
