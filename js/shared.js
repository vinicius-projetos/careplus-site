// codigo que roda em todas as paginas

window.addEventListener('load', function() {
    // menu do avatar (canto de cima)
    var avatar = document.getElementById('avatarBtn');
    var menu = document.getElementById('avatarDropdown');
    var caixa = document.getElementById('avatarWrap');

    if (avatar && menu) {
        // clica no avatar -> abre/fecha
        avatar.onclick = function(e) {
            e.stopPropagation();
            menu.classList.toggle('show');
        };

        // clica fora -> fecha
        document.onclick = function(e) {
            if (caixa && !caixa.contains(e.target)) {
                menu.classList.remove('show');
            }
        };
    }
});
