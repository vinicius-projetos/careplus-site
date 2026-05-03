// pagina de agendamento - calendario e horarios

window.addEventListener('load', function() {

    // pega tudo da tela
    var grade = document.getElementById('calGrid');
    var tituloMes = document.getElementById('mesAnoLabel');
    var btnVoltar = document.getElementById('btnMesAnt');
    var btnAvancar = document.getElementById('btnMesProx');
    var listaHorarios = document.getElementById('horariosLista');
    var horaTexto = document.getElementById('horarioHora');
    var clinicaTexto = document.getElementById('horarioClinica');
    var diaTexto = document.getElementById('horarioDiaTxt');
    var avisoVazio = document.getElementById('semHorarios');
    var modalSub = document.getElementById('modalSub');

    // listas pra usar nos textos
    var meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    var diasSemana = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

    // data de hoje pra nao deixar agendar pra tras
    var hoje = new Date();
    var mesAtual = hoje.getMonth();
    var anoAtual = hoje.getFullYear();

    // o que o usuario escolheu
    var diaEscolhido = null;
    var horarioEscolhido = null;

    var clinicas = ['Clínica Brooklin', 'Clínica Vila Olímpia', 'Clínica Campo Belo', 'Clínica Moema', 'Clínica Itaim'];
    var horariosBase = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'];

    // gera horarios "aleatorios" pra cada dia (mesmo dia sempre da mesmo resultado)
    function gerarHorarios(dia, mes, ano) {
        var semente = dia * 31 + mes * 373 + ano;
        var diaSem = new Date(ano, mes, dia).getDay();

        // domingo nao tem
        if (diaSem === 0) return null;

        var lista = [];
        for (var i = 0; i < horariosBase.length; i++) {
            var num = (semente * (i + 1) * 7) % 100;
            // pega so alguns horarios
            if (num > 35) {
                lista.push({
                    hora: horariosBase[i],
                    clinica: clinicas[(semente + i) % clinicas.length]
                });
            }
        }

        if (lista.length > 0) return lista;
        return null;
    }

    // o dia tem horario livre?
    function temHorario(dia, mes, ano) {
        var diaSem = new Date(ano, mes, dia).getDay();
        if (diaSem === 0) return false;

        // dia que ja passou nao conta
        if (mes === hoje.getMonth() && ano === hoje.getFullYear() && dia < hoje.getDate()) {
            return false;
        }

        return gerarHorarios(dia, mes, ano) !== null;
    }

    // mostra os horarios do dia escolhido na lateral
    function mostrarHorarios(dia, mes, ano) {
        var horarios = gerarHorarios(dia, mes, ano);
        var nomeDiaSem = diasSemana[new Date(ano, mes, dia).getDay()];
        diaTexto.textContent = nomeDiaSem + ', ' + dia + ' de ' + meses[mes];

        // dia sem horario
        if (!horarios || horarios.length === 0) {
            listaHorarios.innerHTML = '';
            listaHorarios.style.display = 'none';
            avisoVazio.style.display = 'block';
            horaTexto.textContent = '--:--';
            clinicaTexto.textContent = '';
            return;
        }

        avisoVazio.style.display = 'none';
        listaHorarios.style.display = 'flex';
        listaHorarios.innerHTML = '';

        // ja deixa o primeiro selecionado
        horaTexto.textContent = horarios[0].hora;
        clinicaTexto.textContent = '- ' + horarios[0].clinica;
        horarioEscolhido = horarios[0];

        // monta cada botao de horario
        for (var i = 0; i < horarios.length; i++) {
            var botao = document.createElement('button');
            botao.className = 'ag-horario-slot';
            if (i === 0) botao.classList.add('ativo');
            botao.innerHTML = '<span class="ag-slot-hora">' + horarios[i].hora + '</span><span class="ag-slot-clinica">' + horarios[i].clinica + '</span>';
            botao.dataset.hora = horarios[i].hora;
            botao.dataset.clinica = horarios[i].clinica;

            // ao clicar troca o ativo e atualiza o titulo
            botao.onclick = function() {
                var todos = listaHorarios.querySelectorAll('.ag-horario-slot');
                for (var j = 0; j < todos.length; j++) {
                    todos[j].classList.remove('ativo');
                }
                this.classList.add('ativo');
                horaTexto.textContent = this.dataset.hora;
                clinicaTexto.textContent = '- ' + this.dataset.clinica;
                horarioEscolhido = {
                    hora: this.dataset.hora,
                    clinica: this.dataset.clinica
                };
            };

            listaHorarios.appendChild(botao);
        }
    }

    // monta o calendario do mes
    function montarCalendario(mes, ano) {
        grade.innerHTML = '';
        tituloMes.textContent = meses[mes] + ' ' + ano;

        var primeiroDia = new Date(ano, mes, 1).getDay();
        var totalDias = new Date(ano, mes + 1, 0).getDate();

        // espacos vazios antes do dia 1
        for (var v = 0; v < primeiroDia; v++) {
            var vazio = document.createElement('div');
            vazio.className = 'ag-cal-dia vazio';
            grade.appendChild(vazio);
        }

        // os dias do mes
        for (var d = 1; d <= totalDias; d++) {
            var dia = document.createElement('div');
            dia.className = 'ag-cal-dia';
            dia.textContent = d;
            dia.dataset.dia = d;

            var jaPassou = mes === hoje.getMonth() && ano === hoje.getFullYear() && d < hoje.getDate();
            var ehHoje = d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
            var temVaga = temHorario(d, mes, ano);

            if (ehHoje) dia.classList.add('hoje');

            if (jaPassou) {
                dia.classList.add('desabilitado');
            } else if (!temVaga) {
                dia.classList.add('indisponivel');
            } else {
                dia.classList.add('disponivel');
            }

            // se ja tinha um dia selecionado antes, marca de novo
            if (diaEscolhido && diaEscolhido.d === d && diaEscolhido.m === mes && diaEscolhido.a === ano) {
                dia.classList.add('selecionado');
            }

            // clicar no dia
            dia.onclick = function() {
                // dias bloqueados nao fazem nada
                if (this.classList.contains('desabilitado')) return;
                if (this.classList.contains('vazio')) return;
                if (this.classList.contains('indisponivel')) return;

                var todos = grade.querySelectorAll('.ag-cal-dia');
                for (var i = 0; i < todos.length; i++) {
                    todos[i].classList.remove('selecionado');
                }
                this.classList.add('selecionado');

                var n = parseInt(this.dataset.dia);
                diaEscolhido = { d: n, m: mesAtual, a: anoAtual };
                mostrarHorarios(n, mesAtual, anoAtual);
            };

            grade.appendChild(dia);
        }
    }

    // botoes de mudar o mes
    btnVoltar.onclick = function() {
        mesAtual = mesAtual - 1;
        if (mesAtual < 0) {
            mesAtual = 11;
            anoAtual = anoAtual - 1;
        }
        montarCalendario(mesAtual, anoAtual);
    };

    btnAvancar.onclick = function() {
        mesAtual = mesAtual + 1;
        if (mesAtual > 11) {
            mesAtual = 0;
            anoAtual = anoAtual + 1;
        }
        montarCalendario(mesAtual, anoAtual);
    };

    // abre a tela ja montada
    montarCalendario(mesAtual, anoAtual);

    // botao confirmar agendamento - abre modal e fecha sozinho
    var btnConfirmar = document.getElementById('btnConfirmar');
    var modal = document.getElementById('modalConfirm');
    if (btnConfirmar && modal) {
        btnConfirmar.onclick = function() {
            if (diaEscolhido && horarioEscolhido) {
                var nomeDiaSem = diasSemana[new Date(diaEscolhido.a, diaEscolhido.m, diaEscolhido.d).getDay()];
                modalSub.textContent = nomeDiaSem + ', ' + diaEscolhido.d + ' de ' + meses[diaEscolhido.m] + ' — ' + horarioEscolhido.hora + ' — ' + horarioEscolhido.clinica;
            }
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            setTimeout(function() {
                modal.classList.remove('show');
                modal.setAttribute('aria-hidden', 'true');
            }, 2500);
        };
    }

    // fechar a notificacao do topo
    var fecharAviso = document.getElementById('notifClose');
    var aviso = document.getElementById('notifAlerta');
    if (fecharAviso && aviso) {
        fecharAviso.onclick = function() {
            aviso.style.display = 'none';
        };
    }

    // fechar as "etiquetas" (chips)
    var chips = document.querySelectorAll('.ag-chip-x');
    for (var c = 0; c < chips.length; c++) {
        chips[c].onclick = function() {
            this.parentElement.style.display = 'none';
        };
    }

    // botao de ajuda
    document.getElementById('helpFab').onclick = function() {
        alert('Central de Ajuda - Em breve!');
    };
});
