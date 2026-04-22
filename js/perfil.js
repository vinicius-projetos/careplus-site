document.addEventListener('DOMContentLoaded', function() {

    // Toast
    function mostrarToast(msg) {
        var toast = document.getElementById('pfToast');
        document.getElementById('pfToastMsg').textContent = msg;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 2500);
    }

    // Edição dos cards
    var botoes = document.querySelectorAll('.pf-btn-editar');
    for (var i = 0; i < botoes.length; i++) {
        botoes[i].onclick = function() {
            var btn = this;
            var card = btn.closest('.glass-card');

            if (btn.dataset.section === 'perfil') {
                editarPerfil(card, btn);
            } else {
                editarCampos(card, btn);
            }
        };
    }

    function editarPerfil(card, btn) {
        var nome = card.querySelector('.pf-nome');
        var cargo = card.querySelector('.pf-cargo');
        var local = card.querySelector('.pf-local');

        nome.innerHTML = '<input type="text" class="pf-input" value="' + nome.textContent + '">';
        cargo.innerHTML = '<input type="text" class="pf-input" value="' + cargo.textContent + '">';
        var localTexto = local.textContent.trim();
        local.innerHTML = '<i class="bi bi-geo-alt"></i> <input type="text" class="pf-input" style="width:calc(100% - 20px);display:inline-block" value="' + localTexto + '">';

        btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Salvar';
        btn.classList.add('salvando');

        btn.onclick = function() {
            nome.textContent = nome.querySelector('input').value;
            cargo.textContent = cargo.querySelector('input').value;
            local.innerHTML = '<i class="bi bi-geo-alt"></i> ' + local.querySelector('input').value;

            btn.innerHTML = '<i class="bi bi-pencil me-1"></i>Editar';
            btn.classList.remove('salvando');
            mostrarToast('Perfil atualizado!');
            btn.onclick = function() { editarPerfil(card, btn); };
        };
    }

    function editarCampos(card, btn) {
        var campos = card.querySelectorAll('.pf-campo');

        for (var j = 0; j < campos.length; j++) {
            var span = campos[j].querySelector('span');
            var texto = span.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim();

            if (texto.indexOf('\n') !== -1) {
                span.innerHTML = '<textarea class="pf-input pf-textarea">' + texto + '</textarea>';
            } else {
                span.innerHTML = '<input type="text" class="pf-input" value="' + texto + '">';
            }
        }

        card.classList.add('editando');
        btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Salvar';
        btn.classList.add('salvando');

        btn.onclick = function() {
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
            btn.innerHTML = '<i class="bi bi-pencil me-1"></i>Editar';
            btn.classList.remove('salvando');
            mostrarToast('Dados salvos!');
            btn.onclick = function() { editarCampos(card, btn); };
        };
    }

    // FAB
    document.getElementById('helpFab').onclick = function() {
        alert('Central de Ajuda - Em breve!');
    };
});
