/* Codigo compartilhado entre todas as paginas */
document.addEventListener('DOMContentLoaded', function() {
    var avatarBtn = document.getElementById('avatarBtn');
    var avatarDropdown = document.getElementById('avatarDropdown');

    if (avatarBtn && avatarDropdown) {
        avatarBtn.onclick = function(e) {
            e.stopPropagation();
            avatarDropdown.classList.toggle('show');
        };
        document.addEventListener('click', function(e) {
            var wrap = document.getElementById('avatarWrap');
            if (wrap && !wrap.contains(e.target)) {
                avatarDropdown.classList.remove('show');
            }
        });
    }
});
