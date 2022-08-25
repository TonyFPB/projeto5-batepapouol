let mensagens=[];
let usuario;
let idInterval;
let idIntervalMensagens;
let contador = 0
let ultima_mensagem = {from: '', to: '', text: '', type: '', time: ''}
let contatoVerde;

function deuCerto(certeza){
    console.log(certeza)
}

function deuErro(error){
    //funçao que vai consertar os erros
    const objDeErro = error.response
    if(error.response.status === 400 && usuario.name === ''){
        const campo_obrigatorio = document.querySelector('.required');
        campo_obrigatorio.innerHTML = '*Campo obrigatório.';

    }else if(error.response.status === 400 && usuario.name !== ''){
        const campo_obrigatorio = document.querySelector('.required');
        campo_obrigatorio.innerHTML = '*Usuario ja existente.'; 
    }else{
        alert('Algo de errado, erro 400')
        console.log(error)
    }  
} 

function permanencia(){
    //Funçao que continua mandando status para o servidor

    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    requisicao.catch(deuErro);

}

function logando(resposta){
    // funçao que vai sair da tela de login
    const campo_obrigatorio = document.querySelector('.required')
    if(campo_obrigatorio.innerHTML !== ''){
        campo_obrigatorio.innerHTML=''
    }

    if(resposta.status === 200){
        idInterval = setInterval( permanencia,5000 );
        idIntervalMensagens = setInterval( pegandoMensagens,1000 );
        idIntervalParticipantes= setInterval( buscandoPartip,5000 );
        
        const telaInicial = document.querySelector('.first-screen');        
        if(!telaInicial.classList.contains('hidden')){
            telaInicial.classList.add('hidden');
        }
        
    }
}

function logar(){
    // manda mensagem para o servidor para entrar na pagina
    const user = document.querySelector('.user');
    usuario= { 'name' : user.value};
    
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', usuario);
    requisicao.then(logando);
    requisicao.catch(deuErro);

}

function ImprimeMensagens(resposta){
    mensagens = resposta.data;
    const ul= document.querySelector('.messenger')
    ul.innerHTML=''
    
    for (let i = 0; i < mensagens.length; i++){
        if(mensagens[i].type === "message"){
            ul.innerHTML+=
            `<li class="${mensagens[i].type} N${i}">
                <p><span class="time">(${mensagens[i].time}) </span> <span class="name">${mensagens[i].from}</span> para <span class="name">${mensagens[i].to}</span> ${mensagens[i].text}</p>
            </li>`;}
        else if(mensagens[i].type === 'status'){
            ul.innerHTML+=
            `<li class="${mensagens[i].type} N${i}">
                <p><span class="time">(${mensagens[i].time}) </span> <span class="name">${mensagens[i].from}</span> ${mensagens[i].text}</p>
            </li>`;}
        else if(mensagens[i].type === 'private_message' && (mensagens[i].to === usuario.name || mensagens[i].from === usuario.name)){
            ul.innerHTML+=
            `<li class="${mensagens[i].type} N${i}">
                <p><span class="time">(${mensagens[i].time}) </span> <span class="name">${mensagens[i].from}</span> para <span class="name">${mensagens[i].to}</span> ${mensagens[i].text}</p>
            </li>`;
        }
        const comparacaoMensagens= (ultima_mensagem.from !== mensagens[mensagens.length-1].from || ultima_mensagem.time !== mensagens[mensagens.length-1].time || ultima_mensagem.type !== mensagens[mensagens.length-1].type || ultima_mensagem.text !== mensagens[mensagens.length-1].text || ultima_mensagem.to !== mensagens[mensagens.length-1].to)
        if(i === mensagens.length-1 && comparacaoMensagens){
            const ultima = document.querySelector(`.N${mensagens.length-1}`)
            ultima.scrollIntoView()
            
            ultima_mensagem = mensagens[i]
        }
        
    }
}

function pegandoMensagens(){
    //https://mock-api.driven.com.br/api/v6/uol/messages
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(ImprimeMensagens);
    promessa.catch(deuErro);
}

function showSideBar(){
    const bar=document.querySelector('.side-bar');
    if(bar.classList.contains('hidden')){
        bar.classList.remove('hidden');
    }else if(!bar.classList.contains('hidden')){
        bar.classList.add('hidden');
    }
}

function imprimeParticipantes(participantes){

    const lista=document.querySelector('.contatos');
    lista.innerHTML=`
    <li>
    <ion-icon name="people"></ion-icon> <p>Todos</p>
    </li>
    `;
    const listaParticipantes = participantes.data;
    
    for(let i = 0; i<listaParticipantes.length; i++){
        if(listaParticipantes[i].name === contatoVerde){
            lista.innerHTML+=`
            <li  onclick = " selecionarContato(this)">
            <ion-icon name="person-circle"></ion-icon> <p class = 'selecionado'>${listaParticipantes[i].name}</p>
            </li>  `;

        }else if(listaParticipantes[i].name !== usuario.name){
            lista.innerHTML+=`
            <li  onclick = " selecionarContato(this)">
            <ion-icon name="person-circle"></ion-icon> <p>${listaParticipantes[i].name}</p>
            </li>  `;
        }
    }
}

function buscandoPartip(){
    //https://mock-api.driven.com.br/api/v6/uol/participants
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then(imprimeParticipantes)
    promessa.catch(deuErro)
}

function erroAoEnviarMensagem(erro){
    alert('Voce nao esta mais logado')
    window.location.reload()
}

function enviarMensagen(){
    const escrita=document.querySelector('.mensagem')
    
    const mensagem = {from:usuario.name, to: 'Todos', text: escrita.value, type: 'message'}

    //https://mock-api.driven.com.br/api/v6/uol/messages
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem)
    requisicao.then(deuCerto)
    requisicao.catch(erroAoEnviarMensagem)

    /* {
        from: "nome do usuário",
        to: "nome do destinatário (Todos se não for um específico)",
        text: "mensagem digitada",
        type: "message" // ou "private_message" para o bônus
    } */
}

function selecionarContato(contato){
    const paragrafoLista = contato.children[1].classList//sel= .comida .borda-verde
    const listaDeContatos = document.querySelector('.contatos').children
    
    for(let i = 0; i < listaDeContatos.length; i++){
        if(listaDeContatos[i].children[1].classList.contains('selecionado')){
            listaDeContatos[i].children[1].classList.remove('selecionado')
        }
    }
    

    const paragrafo = contato.children[1]
    contatoVerde = paragrafo.innerHTML
    paragrafo.classList.add('selecionado')
}
