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
        // domingo nao tem
        if (new Date(ano, mes, dia).getDay() === 0) return [];

        var semente = dia * 31 + mes * 373 + ano;
        var lista = [];
        for (var i = 0; i < horariosBase.length; i++) {
            if ((semente * (i + 1) * 7) % 100 > 35) {
                lista.push({
                    hora: horariosBase[i],
                    clinica: clinicas[(semente + i) % clinicas.length]
                });
            }
        }
        return lista;
    }

    // o dia ja passou (anterior a hoje)?
    function diaJaPassou(dia, mes, ano) {
        return mes === hoje.getMonth() && ano === hoje.getFullYear() && dia < hoje.getDate();
    }

    // o dia tem horario livre?
    function temHorario(dia, mes, ano) {
        if (diaJaPassou(dia, mes, ano)) return false;
        return gerarHorarios(dia, mes, ano).length > 0;
    }

    // atualiza o destaque do topo com o horario escolhido
    function atualizarDestaque(h) {
        horaTexto.textContent = h.hora;
        clinicaTexto.textContent = '- ' + h.clinica;
        horarioEscolhido = h;
    }

    // mostra os horarios do dia escolhido na lateral
    function mostrarHorarios(dia, mes, ano) {
        var horarios = gerarHorarios(dia, mes, ano);
        var nomeDiaSem = diasSemana[new Date(ano, mes, dia).getDay()];
        diaTexto.textContent = nomeDiaSem + ', ' + dia + ' de ' + meses[mes];

        // dia sem horario
        if (horarios.length === 0) {
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
        atualizarDestaque(horarios[0]);

        // monta cada botao de horario
        for (var i = 0; i < horarios.length; i++) {
            var h = horarios[i];
            var botao = document.createElement('button');
            botao.className = 'ag-horario-slot' + (i === 0 ? ' ativo' : '');
            botao.innerHTML = '<span class="ag-slot-hora">' + h.hora + '</span><span class="ag-slot-clinica">' + h.clinica + '</span>';
            botao.dataset.hora = h.hora;
            botao.dataset.clinica = h.clinica;

            botao.onclick = function() {
                marcarUnico(listaHorarios, this, '.ag-horario-slot', 'ativo');
                atualizarDestaque({ hora: this.dataset.hora, clinica: this.dataset.clinica });
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
        var ehMesAtual = mes === hoje.getMonth() && ano === hoje.getFullYear();

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

            var jaPassou = ehMesAtual && d < hoje.getDate();
            var ehHoje = ehMesAtual && d === hoje.getDate();
            var estado = jaPassou ? 'desabilitado' : (temHorario(d, mes, ano) ? 'disponivel' : 'indisponivel');

            if (ehHoje) dia.classList.add('hoje');
            dia.classList.add(estado);

            // se ja tinha um dia selecionado antes, marca de novo
            if (diaEscolhido && diaEscolhido.d === d && diaEscolhido.m === mes && diaEscolhido.a === ano) {
                dia.classList.add('selecionado');
            }

            dia.onclick = function() {
                // dias bloqueados nao fazem nada
                if (this.matches('.desabilitado, .vazio, .indisponivel')) return;

                marcarUnico(grade, this, '.ag-cal-dia', 'selecionado');
                var n = Number.parseInt(this.dataset.dia, 10);
                diaEscolhido = { d: n, m: mesAtual, a: anoAtual };
                mostrarHorarios(n, mesAtual, anoAtual);
            };

            grade.appendChild(dia);
        }
    }

    // muda o mes mostrado no calendario (delta = -1 anterior, +1 proximo)
    function mudarMes(delta) {
        mesAtual += delta;
        if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
        else if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
        montarCalendario(mesAtual, anoAtual);
    }

    btnVoltar.onclick = function() { mudarMes(-1); };
    btnAvancar.onclick = function() { mudarMes(1); };

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
            mostrarModalGlass(modal);
        };
    }

    // fechar as "etiquetas" (chips)
    var chips = document.querySelectorAll('.ag-chip-x');
    for (var c = 0; c < chips.length; c++) {
        chips[c].onclick = function() {
            this.parentElement.style.display = 'none';
        };
    }
});
