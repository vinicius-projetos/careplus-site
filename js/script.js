document.addEventListener('DOMContentLoaded', function() {
    var menuItems = document.querySelectorAll('.sb-menu li:not(.sep)');
    for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].onclick = function() {
            var todos = document.querySelectorAll('.sb-menu li');
            for (var j = 0; j < todos.length; j++) {
                todos[j].classList.remove('active');
            }
            this.classList.add('active');
        };
    }

    var btnConfirm = document.getElementById('btnConfirm');
    var confirmModal = document.getElementById('confirmModal');

    function mostrarModalConfirm() {
        if (!confirmModal) return;
        confirmModal.classList.add('show');
        confirmModal.setAttribute('aria-hidden', 'false');
        setTimeout(function() {
            confirmModal.classList.remove('show');
            confirmModal.setAttribute('aria-hidden', 'true');
        }, 2500);
    }

    function confirmarPresenca() {
        if (btnConfirm.disabled) return;
        btnConfirm.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Presença confirmada!';
        btnConfirm.style.background = 'linear-gradient(135deg,#16a34a,#22c55e)';
        btnConfirm.style.borderColor = 'transparent';
        btnConfirm.style.boxShadow = '0 4px 14px rgba(22,163,74,.35),inset 0 1px 0 rgba(255,255,255,.25)';
        btnConfirm.disabled = true;
        mostrarModalConfirm();
    }

    btnConfirm.onclick = confirmarPresenca;

    var notif = document.getElementById('notif');
    var notifBtns = document.querySelectorAll('.notif-btn');
    for (var k = 0; k < notifBtns.length; k++) {
        notifBtns[k].addEventListener('click', function() {
            if (this.classList.contains('primary')) {
                confirmarPresenca();
            }
            notif.style.display = 'none';
        });
    }

    document.getElementById('helpFab').onclick = function() {
        alert('Central de Ajuda - Em breve!');
    };

    var tiers = document.querySelectorAll('.tier');
    for (var t = 0; t < tiers.length; t++) {
        tiers[t].onclick = function() {
            var cor = this.dataset.cor;
            var cor2 = this.dataset.cor2;
            var bg = this.dataset.bg;
            var num = parseInt(this.dataset.tier);

            var todosTiers = document.querySelectorAll('.tier');
            for (var x = 0; x < todosTiers.length; x++) {
                todosTiers[x].classList.remove('atual');
            }
            this.classList.add('atual');

            document.getElementById('tierAtualImg').src = 'assets/img/tiers/tier' + num + '.png';
            document.body.style.background = bg;
            document.body.dataset.tier = num;
            document.documentElement.style.setProperty('--cor', cor);
            document.documentElement.style.setProperty('--cor2', cor2);

            var fill = document.querySelector('.barra-fill');
            if (num === 6) {
                fill.style.background = 'var(--rainbow)';
                fill.style.backgroundSize = '300% 100%';
                fill.style.animation = 'rainbowShift 3s linear infinite';
            } else {
                fill.style.background = '';
                fill.style.backgroundSize = '';
                fill.style.animation = '';
            }
        };
    }
});
