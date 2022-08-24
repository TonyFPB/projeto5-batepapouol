let mensagens=[];
let usuario;
let idInterval;
let idIntervalMensagens;


function erro(error){
    //funçao que vai mudar a tela de login
    console.log(error);
}

function permanencia(){
    //Funçao que continua mandando status para o servidor
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuario);
    requisicao.catch(erro);
}

function logando(resposta){
    // funçao que vai sair da tela de login
    if(resposta.status === 200){
        idInterval = setInterval( permanencia,5000 );
        idIntervalMensagens = setInterval( pegandoMensagens,10000 );
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
    requisicao.catch(erro);

    //https://mock-api.driven.com.br/api/v6/uol/participants
    /* const dados = {...};
    const requisicao = axios.post('http://...', dados);

    requisicao.then(tratarSucesso);
    requisicao.catch(tratarError); */ 
}

function ImprimeMensagens(resposta){
    mensagens = resposta.data;
    const ul= document.querySelector('.messenger')
    ul.innerHTML=''
    
    for (let i = 0; i < mensagens.length; i++){
        console.log(mensagens[i].type)
        if(mensagens[i].type === "message"){
            ul.innerHTML+=
            `<li class="${mensagens[i].type}">
                <p><span class="time">(${mensagens[i].time}) </span> <span class="name">${mensagens[i].from}</span> para <span class="name">${mensagens[i].to}</span> ${mensagens[i].text}</p>
            </li>`;}
        else if(mensagens[i].type === 'status'){
            ul.innerHTML+=
            `<li class="${mensagens[i].type}">
                <p><span class="time">(${mensagens[i].time}) </span> <span class="name">${mensagens[i].from}</span> ${mensagens[i].text}</p>
            </li>`;}
        else if(mensagens[i].type === 'private_message' && mensagens[i].to === usuario.name){
            ul.innerHTML+=
            `<li class="${mensagens[i].type}">
                <p><span class="time">(${mensagens[i].time}) </span> <span class="name">${mensagens[i].from}</span> para <span class="name">${mensagens[i].to}</span> ${mensagens[i].text}</p>
            </li>`;
        }

    }
}

function pegandoMensagens(){
    //https://mock-api.driven.com.br/api/v6/uol/messages
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessa.then(ImprimeMensagens);
    promessa.catch(erro);
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
    <ion-icon name="people"></ion-icon> Todos
    </li>
    `;
    const listaParticipantes = participantes.data;
    
    for(let i = 0; i<listaParticipantes.length; i++){
        if(listaParticipantes[i].name !== usuario.name){
            lista.innerHTML+=`
            <li>
            <ion-icon name="person-circle"></ion-icon> ${listaParticipantes[i].name}
            </li>  `;
        }
    }
}

function buscandoPartip(){
    //https://mock-api.driven.com.br/api/v6/uol/participants
    const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promessa.then(imprimeParticipantes)
    promessa.catch(erro)
}

function enviarMensagen(){
    const escrita=document.querySelector('.mensagem')

    if(escrita.value !== ''){
        const mensagem = {from:usuario.name, to: 'Todos', text: escrita.value, type: 'message'}
    //https://mock-api.driven.com.br/api/v6/uol/messages
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem)
    requisicao.then(console.log('sucesso'))
    requisicao.catch(erro)

    /* {
        from: "nome do usuário",
        to: "nome do destinatário (Todos se não for um específico)",
        text: "mensagem digitada",
        type: "message" // ou "private_message" para o bônus
    } */
    }
}