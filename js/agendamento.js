document.addEventListener('DOMContentLoaded', function() {
    var calGrid = document.getElementById('calGrid');
    var mesAnoLabel = document.getElementById('mesAnoLabel');
    var btnMesAnt = document.getElementById('btnMesAnt');
    var btnMesProx = document.getElementById('btnMesProx');
    var horariosLista = document.getElementById('horariosLista');
    var horarioHora = document.getElementById('horarioHora');
    var horarioClinica = document.getElementById('horarioClinica');
    var horarioDiaTxt = document.getElementById('horarioDiaTxt');
    var semHorarios = document.getElementById('semHorarios');
    var modalSub = document.getElementById('modalSub');

    var meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    var diasSemana = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    var hoje = new Date();
    var mesAtual = hoje.getMonth();
    var anoAtual = hoje.getFullYear();
    var diaSelecionado = null;
    var horarioEscolhido = null;

    var clinicas = ['Clínica Brooklin', 'Clínica Vila Olímpia', 'Clínica Campo Belo', 'Clínica Moema', 'Clínica Itaim'];
    var horariosBase = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'];

    function gerarDisponibilidade(dia, mes, ano) {
        var seed = dia * 31 + mes * 373 + ano;
        var diaSem = new Date(ano, mes, dia).getDay();
        if (diaSem === 0) return null;

        var disponiveis = [];
        for (var i = 0; i < horariosBase.length; i++) {
            var hash = (seed * (i + 1) * 7) % 100;
            if (hash > 35) {
                disponiveis.push({
                    hora: horariosBase[i],
                    clinica: clinicas[(seed + i) % clinicas.length]
                });
            }
        }
        return disponiveis.length > 0 ? disponiveis : null;
    }

    function temDisponibilidade(dia, mes, ano) {
        var diaSem = new Date(ano, mes, dia).getDay();
        if (diaSem === 0) return false;
        if (mes === hoje.getMonth() && ano === hoje.getFullYear() && dia < hoje.getDate()) return false;
        var disp = gerarDisponibilidade(dia, mes, ano);
        return disp !== null;
    }

    function mostrarHorarios(dia, mes, ano) {
        var horarios = gerarDisponibilidade(dia, mes, ano);
        var diaSem = diasSemana[new Date(ano, mes, dia).getDay()];
        horarioDiaTxt.textContent = diaSem + ', ' + dia + ' de ' + meses[mes];

        if (!horarios || horarios.length === 0) {
            horariosLista.innerHTML = '';
            horariosLista.style.display = 'none';
            semHorarios.style.display = 'block';
            horarioHora.textContent = '--:--';
            horarioClinica.textContent = '';
            return;
        }

        semHorarios.style.display = 'none';
        horariosLista.style.display = 'flex';
        horariosLista.innerHTML = '';

        horarioHora.textContent = horarios[0].hora;
        horarioClinica.textContent = '- ' + horarios[0].clinica;
        horarioEscolhido = horarios[0];

        for (var i = 0; i < horarios.length; i++) {
            var btn = document.createElement('button');
            btn.className = 'ag-horario-slot';
            if (i === 0) btn.classList.add('ativo');
            btn.innerHTML = '<span class="ag-slot-hora">' + horarios[i].hora + '</span><span class="ag-slot-clinica">' + horarios[i].clinica + '</span>';
            btn.dataset.hora = horarios[i].hora;
            btn.dataset.clinica = horarios[i].clinica;

            btn.onclick = function() {
                var todos = horariosLista.querySelectorAll('.ag-horario-slot');
                for (var j = 0; j < todos.length; j++) todos[j].classList.remove('ativo');
                this.classList.add('ativo');
                horarioHora.textContent = this.dataset.hora;
                horarioClinica.textContent = '- ' + this.dataset.clinica;
                horarioEscolhido = { hora: this.dataset.hora, clinica: this.dataset.clinica };
            };

            horariosLista.appendChild(btn);
        }
    }

    function renderCalendario(mes, ano) {
        calGrid.innerHTML = '';
        mesAnoLabel.textContent = meses[mes] + ' ' + ano;

        var primeiroDia = new Date(ano, mes, 1).getDay();
        var totalDias = new Date(ano, mes + 1, 0).getDate();

        for (var v = 0; v < primeiroDia; v++) {
            var vazio = document.createElement('div');
            vazio.className = 'ag-cal-dia vazio';
            calGrid.appendChild(vazio);
        }

        for (var d = 1; d <= totalDias; d++) {
            var el = document.createElement('div');
            el.className = 'ag-cal-dia';
            el.textContent = d;
            el.dataset.dia = d;

            var passado = mes === hoje.getMonth() && ano === hoje.getFullYear() && d < hoje.getDate();
            var ehHoje = d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
            var disponivel = temDisponibilidade(d, mes, ano);

            if (ehHoje) el.classList.add('hoje');

            if (passado) {
                el.classList.add('desabilitado');
            } else if (!disponivel) {
                el.classList.add('indisponivel');
            } else {
                el.classList.add('disponivel');
            }

            if (diaSelecionado && diaSelecionado.d === d && diaSelecionado.m === mes && diaSelecionado.a === ano) {
                el.classList.add('selecionado');
            }

            el.onclick = function() {
                if (this.classList.contains('desabilitado') || this.classList.contains('vazio') || this.classList.contains('indisponivel')) return;
                var todos = calGrid.querySelectorAll('.ag-cal-dia');
                for (var i = 0; i < todos.length; i++) todos[i].classList.remove('selecionado');
                this.classList.add('selecionado');
                var diaNum = parseInt(this.dataset.dia);
                diaSelecionado = { d: diaNum, m: mesAtual, a: anoAtual };
                mostrarHorarios(diaNum, mesAtual, anoAtual);
            };

            calGrid.appendChild(el);
        }
    }

    btnMesAnt.onclick = function() {
        mesAtual--;
        if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
        renderCalendario(mesAtual, anoAtual);
    };

    btnMesProx.onclick = function() {
        mesAtual++;
        if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
        renderCalendario(mesAtual, anoAtual);
    };

    renderCalendario(mesAtual, anoAtual);

    var btnConfirmar = document.getElementById('btnConfirmar');
    var modal = document.getElementById('modalConfirm');
    if (btnConfirmar && modal) {
        btnConfirmar.onclick = function() {
            if (diaSelecionado && horarioEscolhido) {
                var diaSem = diasSemana[new Date(diaSelecionado.a, diaSelecionado.m, diaSelecionado.d).getDay()];
                modalSub.textContent = diaSem + ', ' + diaSelecionado.d + ' de ' + meses[diaSelecionado.m] + ' — ' + horarioEscolhido.hora + ' — ' + horarioEscolhido.clinica;
            }
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            setTimeout(function() {
                modal.classList.remove('show');
                modal.setAttribute('aria-hidden', 'true');
            }, 2500);
        };
    }

    var notifClose = document.getElementById('notifClose');
    var notif = document.getElementById('notifAlerta');
    if (notifClose && notif) {
        notifClose.onclick = function() { notif.style.display = 'none'; };
    }

    var chips = document.querySelectorAll('.ag-chip-x');
    for (var c = 0; c < chips.length; c++) {
        chips[c].onclick = function() { this.parentElement.style.display = 'none'; };
    }

    document.getElementById('helpFab').onclick = function() {
        alert('Central de Ajuda - Em breve!');
    };
});
