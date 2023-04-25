/*
* TO-DO
* modo visual-novel
*/



let controle = {
    timer : 0, 
    ponto : 0, 
    pivot : 0,
    erro : 0,
    dificuldade: 0,
    perda : 0,
    descricoes: ''
    
}

let content;






$(document).ready(function () {
    fetch('./src/json/general.json')
        .then(response => response.json())
        .then(data => {
            controle.descricoes = data.descricoes;
            controle.dicaErrada = data.dicaErrada;
        })
        .then( () => playGame())
        .catch(error => console.error(error));
});

const playGame = function() {
    body = $('body')
    controle.locais_prontos = prepara_jogo()
    console.log(controle.locais_prontos)
    controle.dificuldade = {quantidade: 5, nivel: 'facil' }
    $(document).on("click", _ => console.log(controle));
    
    
    inicio_do_jogo()
    seleciona_opcoes()
    //esta_sala_aqui(0)
}





// ===================================================================================
// Funções
// ===================================================================================
const seleciona_opcoes = _ => {
    $(document).on('click','.mess-btn',function(e){
        let index, local, nomeClasse
        !controle.perda ? nomeClasse = e.target.className : nomeClasse = 'gameover'
        // console.log(nomeClasse)
        switch (true) {
            case nomeClasse.indexOf('inicio') != -1:
                // apresenta o primeiro local do array
                esta_sala_aqui(0)
                break;
            
            case nomeClasse.indexOf('locais_casa') != -1:
                let atual_sala = $('.content section').attr('data-sala')
                mostraOpcoesDeLocais(controle.ponto,atual_sala)
                break;
            
            case nomeClasse.indexOf('local') != -1:
                controle.timer++
                // console.log($(e.target).attr('data-local'))
                local = $(e.target).attr('data-local')
                controle.pivot++
                proximo_local(local)
                break;
            
            case nomeClasse.indexOf('perguntar_alguem') != -1:
                local = $('.content section').attr('data-sala')
                lista_pessoas_no_local(retorna_index_da_sala(local))
                break;
            case nomeClasse.indexOf('perg_pers') != -1:
                controle.timer++
                local = $('.content section').attr('data-sala')
                let npc_id = $(e.target).attr('data-amigo')
                mostra_a_dica(retorna_index_da_sala(local),npc_id)
                break;
                
            case nomeClasse.indexOf('voltar') != -1:
                let x = $(e.target).attr('data-valor')
                esta_sala_aqui(retorna_index_da_sala(x))
                break;
            case nomeClasse.indexOf('gameover') != -1:
                fim_do_jogo_perda()
                break;
        
            default:
                
                break;
        }
    })
}

const fim_do_jogo = (i) => {
    this.sala = controle.locais_prontos[i]
    // content.innerHTML = barra_de_progresso(controle.timer)+
    let $html = barra_de_progresso(controle.timer)+
        '<section class="with-title">'+
        `<h2 class="title">Você encontrou seu gato ${this.sala.artigo[1]} ${this.sala.nome}</h2>`+
        `<p>${controle.descricoes.fim}</p>`+
        '<div class="containers">'+
        // '<button class="mess-btn perguntar_alguem">Perguntar para alguém</button>'+
        // '<button class="mess-btn locais_casa">Procurar em algum cômodo</button>'+
        '</div>'+
        '</section>'
    $('.content').html($html)
}

const lista_pessoas_no_local = (i) => {
    this.sala = controle.locais_prontos[i]
    let amigos = controle.locais_prontos[i++].ocupantes

    let $html = `
            ${barra_de_progresso(controle.timer)}
            <section class="with-title is-dark bg_on" data-sala="${this.sala.id}">
            <h2 class="title">Você encontra alguns amigos ${this.sala.artigo[1]} ${this.sala.nome}</h2>
            <div class="containers">
            <button class="mess-btn perg_pers perg_pers_1" data-amigo="${amigos[0].id}">Perguntar para <strong>${amigos[0].nome}</strong></button>
            <button class="mess-btn perg_pers perg_pers_2" data-amigo="${amigos[1].id}">Perguntar para <strong>${amigos[1].nome}</strong></button>
            <button class="mess-btn perg_pers perg_pers_3" data-amigo="${amigos[2].id}">Perguntar para <strong>${amigos[2].nome}</strong></button>
            <button class="mess-btn is-warning voltar" data-valor="${this.sala.id}">Voltar</button>
            </div>
            </section>
        `


    $('.content').html($html)
}

const mostra_a_dica = (i,npc_id) => {
    this.sala = controle.locais_prontos[i]
    console.log("🚀 ~ file: principal.js:145 ~ controle.descricoes:", controle.descricoes)
    console.log("🚀 ~ file: principal.js:145 ~ controle.dicaErrada:", controle)

    let npc_atual, dica_atual
    let dicas_erradas = shuffle_arr(controle.dicaErrada)
    let proxima_sala = controle.locais_prontos[++i]
    // console.log('controle.erro = ',controle.erro)
    switch (controle.erro) {
        case 1:
        for(let y in sala.ocupantes) {
            if (sala.ocupantes[y].id == npc_id) {
                npc_atual = sala.ocupantes[y]
                dica_atual = dicas_erradas[y]
            }
        }    
        break;    
        default:
        for(let y in sala.ocupantes) {
            if (sala.ocupantes[y].id == npc_id) {
                npc_atual = sala.ocupantes[y]
                dica_atual = proxima_sala.dicas[y]
            }
        }
            break;
    }
    
    // console.log(npc_atual)

    $html = `
        ${barra_de_progresso(controle.timer)}
        <section class="with-title bg_on" data-sala="${this.sala.id}">
        <h2 class="title">${npc_atual.nome}</h2>
        <div class="containers">
        <p class="mess-balloon from-left">${npc_atual.frase+dica_atual}</p>
        <div class="frame">
            <div class="foto_char npc-${npc_atual.id}" title="Imagem representa uma pessoa, sem contornos definidos"></div>
        </div>
        <div class="containers">
        <button class="mess-btn perguntar_alguem">Perguntar para mais alguém</button>
        <button class="mess-btn locais_casa" data-sala="${this.sala.id}">Procurar em outro cômodo</button>
        </div>
        </div>
        </section>
    `
    $('.content').html($html)
}

const proximo_local = (local) => local == controle.locais_prontos[controle.pivot].id ? caminho_correto() : caminho_errado(local)

const retorna_index_da_sala = (sala) => {
    for (i in controle.locais_prontos) {
        if (controle.locais_prontos[i].id === sala) return i
    }
}

const caminho_correto = _ => {
    controle.erro = 0    
    controle.ponto++
    // console.log('Caminho correto ',controle.ponto)
    if (controle.ponto === controle.dificuldade.quantidade - 1) {
        fim_do_jogo(controle.ponto)
    } else {
        na_pista_certa()
        //esta_sala_aqui(controle.ponto)
    }
}

const na_pista_certa = _ => {
    // alert('pista certa')
    $html = '<section class="is-succeess with-title">'+
        '<h2 class="title">Opa!</h2>'+
        '<div class="containers">'+
        `<p>Parece que o bichano esteve neste cômodo, esta cheio de pêlos!</p>`+
        '</div>'+
        '</section>'
    $('.content').html($html)
    setTimeout(function(){esta_sala_aqui(controle.ponto)},3000)
}

const caminho_errado = (local) => {
    switch (true) {
        case local === controle.locais_prontos[controle.ponto].id:
            controle.erro = 0
            //console.log(`Voltando ao caminho ${local}`)
            controle.pivot = controle.ponto
            esta_sala_aqui(controle.ponto)
            break;
        default:
            controle.erro = 1
            if(controle.pivot>(controle.ponto+1)){controle.pivot=(controle.ponto+1)}//assim o erro fica sempre por perto
            // console.log(local)
            // console.log(retorna_index_da_sala(local))
            esta_sala_aqui(retorna_index_da_sala(local))
            break;
    }
}

// Aqui tem um erro
function mostraOpcoesDeLocais (i,sala_atual) {
    const diferente_do_index_atual = (elem,index) => index !== i && index !== (i+1)
    let escolhas = controle.locais_prontos.filter(diferente_do_index_atual);
    escolhas = shuffle_arr(escolhas)
    for (let y = escolhas.length-2; y > 0; y--) {escolhas.pop()}
    console.log(escolhas)
    if (controle.pivot == controle.ponto) {
        escolhas.push(controle.locais_prontos[i+1])
    } else {
        if (!controle.erro) {
            escolhas.push(controle.locais_prontos[i+1])
        } else  {
            escolhas.push(controle.locais_prontos[controle.ponto])
        }
    }
    escolhas = shuffle_arr(escolhas)
    // console.log(escolhas)
    let conteudo = barra_de_progresso(controle.timer)+
        `<section class="is-dark with-title bg_on" data-sala="${this.sala.id}>`+
        '<h2 class="title">Onde esse gato deve estar?</h2>'+
        '<div class="containers">'+
        '<p>Locais</p>'+
        '<div class="containers">'+
        `<button class="mess-btn is-dark local" data-local="${escolhas[0].id}">${escolhas[0].nome}</button>`+
        `<button class="mess-btn is-dark local" data-local="${escolhas[1].id}">${escolhas[1].nome}</button>`+
        `<button class="mess-btn is-dark local" data-local="${escolhas[2].id}">${escolhas[2].nome}</button>`+
        `<button class="mess-btn is-warning voltar" data-valor=${sala_atual}>Voltar</button>`+
        '</div>'+
        '</section>'
    $('.content').html(conteudo)
}

// prepara a sala do atual
const esta_sala_aqui = (i) => {
    this.sala = controle.locais_prontos[i]
    // console.log(this.sala)
    let $html = barra_de_progresso(controle.timer)+
        `<section class="with-title bg_on" data-sala="${this.sala.id}">
            <h2 class="title">Você está ${this.sala.artigo[1]} ${this.sala.nome}</h2>
            <div class="frame">
                <div class="foto_local local-${this.sala.id}" title="Imagem representa uma pessoa, sem contornos definidos"></div>
            </div>
            <p>${this.sala.descricao}</p>
            <div class="containers">
            <button class="mess-btn perguntar_alguem">Perguntar para alguém</button>
            <button class="mess-btn locais_casa" data-sala="${this.sala.id}">Procurar em outro lugar</button>
            </div>
        </section>`
        
    $('.content').html($html)
}

const barra_de_progresso = (timer) => {
    let valor_tempo,classe,mod;
    controle.dificuldade.nivel == 'facil' ? mod = 5 : controle.dificuldade.nivel == 'medio' ? mod = 7 : mod = 10;
    valor_tempo = timer * mod;
    valor_tempo > 80 ? classe = 'is-error' : valor_tempo > 50 ? classe = 'is-warning' : classe = 'is-success';
    

    let str = `
        <header class="mess-container with-title">
            <h3 class="title">Tempo</h3>
            <span class="progress">
                <span class="progress_bar ${classe}" style="width: ${valor_tempo}%"></span>
            </span>
        </header>
    `;

    if (valor_tempo >= 100) {
        controle.perda = 1 
    } 
    
    return str
    
}

const fim_do_jogo_perda = _ => {
    let $html = `<section class="is-dark with-title">
        <h2 class="title">Oh não!</h2>
        <div class="containers">
        <p>${controle.descricoes.fail}</p>
        </div>
        </section>`;

    $('.content').html($html)
}

//Adiciona ocupantes
const prepara_jogo = () => {
    let estes_locais = controle.descricoes;
    // let mix_locais = shuffle_arr(estes_locais)
    console.log("🚀 ~ file: principal.js:327 ~ estes_locais:", estes_locais)
    
    let mix_locais = estes_locais
    for (i in mix_locais) {
        //  mix_locais[i].dicas = shuffle_arr(mix_locais[i].dicas)
        // mix_locais[i].ocupantes = add_amigos()
    }
    // console.log(mix_locais)
    return mix_locais
}

// const mistura_dicas = (arr) => {
// // function mistura_dicas(arr) {
//     let x = []
//     for (let i = 0; i < arr.length; i++) {
//         for (let y = 0; y <  arr[i].length; y++) {
//             let z = arr[i][y]
//             x[i] = shuffle_arr(z)
//         }
//     }
//     return x
// }

// const add_amigos = _ => {
//     let x = shuffle_arr(lista_de_amigos)
//     let y = []
//     for (let i = 0; i < 3; i++) {
//         y.push(x[i])
//     }
//     return y
// }

const shuffle_arr = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const inicio_do_jogo = () => {
    let $html = `<section><p>${controle.descricoes.inicio}</p><div class="containers"></div><button class="mess-btn inicio">CARA, CADÊ MEU GATO??</button></div></section>`
    $('.content').html($html)
}
