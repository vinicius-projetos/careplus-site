// Dados das clínicas
var clinicas = [
    {
        id: 0,
        embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.268084756294!2d-46.688577024889874!3d-23.59471657877689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce50cd03d5b81b%3A0xae87a02790b392a4!2sCare%20Plus%20Clinic%20-%20Vila%20Ol%C3%ADmpia!5e0!3m2!1spt-BR!2sbr!4v1777994403735!5m2!1spt-BR!2sbr'
    },
    {
        id: 1,
        embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.8472084477607!2d-46.70228642023947!3d-23.609812024017526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce573e934b44f1%3A0xc552bd962d85b095!2sCare%20Plus%20Clinic%20-%20Brooklin!5e0!3m2!1spt-BR!2sbr!4v1778083107346!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'
    },
    {
        id: 2,
        embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.1051331281283!2d-46.85460172026499!3d-23.492722424305548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf0200025fe06f%3A0x428f14869a1131bc!2sCare%20Plus!5e0!3m2!1spt-BR!2sbr!4v1777994378198!5m2!1spt-BR!2sbr'
    }
];

function mudarMapa(id) {
    const mapaIframe = document.getElementById('mapa');
    mapaIframe.src = clinicas[id].embed;

    // Remove classe ativo de todos e adiciona no clicado
    document.querySelectorAll('.card-clinica').forEach((card, index) => {
        card.classList.toggle('ativo', index === id);
    });
}
