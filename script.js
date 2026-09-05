// =====================================
// MAPA DE RESERVAS - SCRIPT.JS
// PARTE 1
// =====================================


// HOSPEDAGENS

const hospedagens = [

{
categoria:"DUPLO",
quartos:[
"APTO 03(DUPLO)",
"APTO 04(TRIPLO)",
"APTO 05(DUPLO)",    
"APTO 06(TRIPLO)",
"APTO 07(TRIPLO)",
"APTO 09 MADEIRA(DUPLO)",
"APTO 12 MADEIRA(TRIPLO)",
"APTO 13(MADEIRA(DUPLO)",    
"APTO 14 MADEIRA(DUPLO))",
"APTO 15 MADEIRA(QUADRUPLO)"    
]
}

];
const listaQuartos = hospedagens.flatMap(grupo => grupo.quartos);


// MESES

const meses = [

{nome:"Janeiro", dias:31},
{nome:"Fevereiro", dias:28},
{nome:"Março", dias:31},
{nome:"Abril", dias:30},
{nome:"Maio", dias:31},
{nome:"Junho", dias:30},
{nome:"Julho", dias:31},
{nome:"Agosto", dias:31},
{nome:"Setembro", dias:30},
{nome:"Outubro", dias:31},
{nome:"Novembro", dias:30},
{nome:"Dezembro", dias:31}

];



// CONFIGURAÇÕES

const larguraDia = 34;

let reservaEditando = null;

let mesAtual = new Date().getMonth();

let anoAtual = new Date().getFullYear();


let reservas = JSON.parse(
localStorage.getItem("reservas")
) || [];



reservas = reservas.map(r=>{

    if(r.status==="Em Limpeza"){
        r.status="Em-Limpeza";
    }

    return r;

});


localStorage.setItem(
"reservas",
JSON.stringify(reservas)
);

localStorage.setItem(
"reservas",
JSON.stringify(reservas)
);

// ELEMENTOS

const listaHospedagens =
document.getElementById("listaHospedagens");


const cabecalhoMeses =
document.getElementById("cabecalhoMeses");


const gradeReservas =
document.getElementById("gradeReservas");



const modal =
document.getElementById("modalReserva");



let casaSelecionada = "";




// =====================================
// CRIAR LISTA DAS CASAS
// =====================================

// =====================================
// LIMPAR NOTIFICAÇÕES
// =====================================

function limparNotificacoes(){

    document.getElementById("contadorNotificacao").textContent = "0";


    document.getElementById("listaNotificacoes").innerHTML =

    '<div class="itemNotificacao">Nenhuma notificação.</div>';

}
document.getElementById("limparNotificacoes").onclick=function(){

    limparNotificacoes();

};
function carregarHospedagens(){


listaHospedagens.innerHTML="";


listaQuartos.forEach(nome=>{


let div =
document.createElement("div");


div.className="quarto";


div.textContent=nome;


listaHospedagens.appendChild(div);


});


}



// =====================================
// CRIAR CABEÇALHO DO MÊS
// =====================================


function criarCabecalho(){


cabecalhoMeses.innerHTML="";


let mes =
meses[mesAtual];



let bloco =
document.createElement("div");


bloco.className="mes";



let titulo =
document.createElement("div");


titulo.className="nomeMes";


titulo.style.width =
(mes.dias * larguraDia)+"px";


titulo.textContent =
mes.nome;



let dias =
document.createElement("div");


dias.className="dias";



for(let i=1;i<=mes.dias;i++){

    let dia = document.createElement("div");

    dia.className="dia";


    let data = new Date(
        anoAtual,
        mesAtual,
        i
    );


    let semana = data.toLocaleDateString(
        "pt-BR",
        {
            weekday:"short"
        }
    )
    .replace(".","")
    .toUpperCase();


    // fim de semana
    if(data.getDay()==0 || data.getDay()==6){

        dia.classList.add("fimSemana");

    }


    // hoje
    let hoje = new Date();

    if(
        data.getDate()===hoje.getDate() &&
        data.getMonth()===hoje.getMonth() &&
        data.getFullYear()===hoje.getFullYear()
    ){

        dia.classList.add("hoje");

    }



    dia.innerHTML = `

        <span class="semana">
            ${semana}
        </span>

        <span class="numero">
            ${i}
        </span>

    `;


    dias.appendChild(dia);

}
bloco.appendChild(titulo);

bloco.appendChild(dias);


cabecalhoMeses.appendChild(bloco);


}



// =====================================
// DESENHAR MAPA
// =====================================


function renderizarMapa(){


gradeReservas.innerHTML="";


criarCabecalho();



listaQuartos.forEach(casa=>{


let linha =
document.createElement("div");


linha.className="linha";



for(let dia=1; dia<=meses[mesAtual].dias; dia++){


let celula =
document.createElement("div");


celula.className="celula";



// clique no dia

celula.onclick=function(){


abrirModalReserva(
casa,
dia
);


};



linha.appendChild(celula);


}




// carregar reservas da casa


reservas.forEach(reserva=>{


if(
reserva.casa === casa
){


let entrada =
new Date(reserva.entrada+"T00:00:00");


let saida =
new Date(reserva.saida+"T00:00:00");



let anoAtual =
new Date().getFullYear();


let primeiroDiaMes =
new Date(
anoAtual,
mesAtual,
1
);


let ultimoDiaMes =
new Date(
anoAtual,
mesAtual,
meses[mesAtual].dias
);


if(

entrada <= ultimoDiaMes &&

saida > primeiroDiaMes

){

let barra =
criarBarraReserva(reserva);


if(barra){

    linha.appendChild(barra);

}

}
}


});



gradeReservas.appendChild(linha);



});


}




// =====================================
// VERIFICAR MÊS
// =====================================


function mesDaData(data){


return new Date(data).getMonth();


}


// =====================================
// ABRIR MODAL DE RESERVA
// =====================================


function abrirModalReserva(casa,dia){

reservaEditando=null;

document.getElementById("salvarReserva").textContent="Salvar";

casaSelecionada = casa;



let entrada = new Date(
anoAtual,
mesAtual,
dia
);



document.getElementById("casaReserva").value =
casa;



document.getElementById("dataEntrada").value =
entrada.toISOString().split("T")[0];



let saida = new Date(entrada);

saida.setDate(
saida.getDate()+1
);



document.getElementById("dataSaida").value =
saida.toISOString().split("T")[0];



document.getElementById("nomeHospede").value="";
document.getElementById("telefoneHospede").value="";
document.getElementById("statusReserva").value="Check-in";
document.getElementById("observacaoReserva").value = "";


modal.style.display="flex";


}




// =====================================
// FECHAR MODAL
// =====================================


document.getElementById("cancelarReserva")
.onclick=function(){


modal.style.display="none";


};




// =====================================
// SALVAR RESERVA
// =====================================


document.getElementById("salvarReserva")
.onclick=function(){


let dados = {


casa:
document.getElementById("casaReserva").value,


hospede:
document.getElementById("nomeHospede").value,


telefone:
document.getElementById("telefoneHospede").value,

observacao:
document.getElementById("observacaoReserva").value,

entrada:
document.getElementById("dataEntrada").value,


saida:
document.getElementById("dataSaida").value,


status:
document.getElementById("statusReserva").value


};





if(!dados.hospede){

alert("Digite o nome do hóspede");

return;

}




// EDIÇÃO

if(reservaEditando){



dados.id = reservaEditando.id;



if(verificarConflito(dados)){


alert(
"Já existe outra reserva neste período."
);


return;


}



reservas =
reservas.map(r=>{


if(r.id===dados.id){

return dados;

}


return r;


});



}


// NOVA RESERVA

else{


dados.id = Date.now();



if(verificarConflito(dados)){


alert(
"Já existe outra reserva neste período."
);


return;


}



reservas.push(dados);


}




salvarBanco();


modal.style.display="none";


reservaEditando=null;


document.getElementById("salvarReserva").textContent="Salvar";


renderizarMapa();



};




// =====================================
// SALVAR NO NAVEGADOR
// =====================================


function salvarBanco(){


localStorage.setItem(
"reservas",
JSON.stringify(reservas)
);


}




// =====================================
// VERIFICAR RESERVA DUPLICADA
// =====================================


function verificarConflito(nova){

return reservas.some(r=>{


// ignora a própria reserva ao editar
if(
nova.id &&
r.id === nova.id
){
return false;
}


// somente compara o mesmo quarto
if(r.casa !== nova.casa){
return false;
}



let entradaExistente =
new Date(r.entrada+"T00:00:00");


let checkoutExistente =
new Date(r.saida+"T00:00:00");



let novaEntrada =
new Date(nova.entrada+"T00:00:00");


let novaSaida =
new Date(nova.saida+"T00:00:00");



// Permite nova entrada exatamente no checkout
if(
novaEntrada.getTime() === checkoutExistente.getTime()
){
return false;
}



// Verifica sobreposição real de hospedagem

return (

novaEntrada < checkoutExistente &&

novaSaida > entradaExistente

);


});


}



// =====================================
// CRIAR BARRA DA RESERVA
// =====================================

function criarBarraReserva(reserva){

    let barra = document.createElement("div");

    barra.className="reserva";

    barra.classList.add(reserva.status);



    let entrada = new Date(
        reserva.entrada+"T00:00:00"
    );


    let saida = new Date(
        reserva.saida+"T00:00:00"
    );



    let ano = entrada.getFullYear();



    // PRIMEIRO DIA DO MÊS VISUALIZADO

    let inicioMes = new Date(
        ano,
        mesAtual,
        1,
        0,0,0
    );


    let fimMes = new Date(
        ano,
        mesAtual,
        meses[mesAtual].dias,
        23,59,59
    );


    // SE A RESERVA NÃO PASSA PELO MÊS ATUAL NÃO MOSTRA

    if(
        saida <= inicioMes ||
        entrada > fimMes
    ){

        return null;

    }



    // LIMITA A PARTE VISÍVEL DA RESERVA

    let inicioVisual = entrada < inicioMes 
        ? inicioMes 
        : entrada;


    let fimVisual = saida > fimMes 
        ? fimMes 
        : saida;



    let diaInicio =
    inicioVisual.getDate();



    let quantidadeDias =
    Math.round(
    (fimVisual - inicioVisual)
    / 
    (1000*60*60*24)
    );



    barra.style.left =
    ((diaInicio-1)*larguraDia)+"px";



    barra.style.width =
    ((quantidadeDias+1)*larguraDia-4)+"px";



    let nome =
    document.createElement("span");


    nome.textContent =
    reserva.hospede;


    barra.appendChild(nome);



    barra.title =
    "Hóspede: "+reserva.hospede+
    "\nEntrada: "+formatarData(reserva.entrada)+
    "\nCheckout: "+formatarData(reserva.saida);
    "\nObservação: "+(reserva.observacao || "Nenhuma");


    barra.onclick=function(e){

        e.stopPropagation();

        editarReserva(reserva);

    };



    barra.draggable=true;



    barra.ondragstart=function(e){

        e.dataTransfer.setData(
            "reserva",
            JSON.stringify(reserva)
        );

    };


    return barra;

}


function atualizarNotificacoes(){

    let lista=[];

    const hoje=new Date().toISOString().slice(0,10);

    reservas.forEach(r=>{

        if(r.entrada===hoje){

            lista.push("🟢 Check-in hoje - "+r.hospede);

        }

        if(r.saida===hoje){

            lista.push("🔵 Check-out hoje - "+r.hospede);

        }

    });

    document.getElementById("contadorNotificacao").textContent=lista.length;

    document.getElementById("listaNotificacoes").innerHTML=

    lista.length

    ?lista.map(t=>`<div class="itemNotificacao">${t}</div>`).join("")

    :'<div class="itemNotificacao">Nenhuma notificação.</div>';

}

atualizarNotificacoes();

document.getElementById("abrirNotificacoes").onclick=function(){

    const painel=document.getElementById("painelNotificacoes");

    painel.style.display=painel.style.display==="block"?"none":"block";

};
function editarReserva(reserva){

reservaEditando = reserva;


document.getElementById("nomeHospede").value =
reserva.hospede;


document.getElementById("telefoneHospede").value =
reserva.telefone;

document.getElementById("observacaoReserva").value =
reserva.observacao || "";

document.getElementById("casaReserva").value =
reserva.casa;


document.getElementById("dataEntrada").value =
reserva.entrada;


document.getElementById("dataSaida").value =
reserva.saida;


document.getElementById("statusReserva").value =
reserva.status;


modal.style.display="flex";


document.getElementById("salvarReserva").textContent =
"Atualizar";
let btnExcluir = document.getElementById("btnExcluirReserva");


if(btnExcluir){

btnExcluir.style.display="block";


btnExcluir.onclick=function(){


if(confirm("Excluir esta reserva?")){


reservas = reservas.filter(r=>r.id !== reserva.id);


salvarBanco();


modal.style.display="none";


reservaEditando=null;


renderizarMapa();


}


};


}
}


// =====================================
// MOSTRAR RESERVA
// =====================================


function mostrarReserva(reserva){



let opcao =
confirm(

"Cliente: "+
reserva.hospede+

"\nCasa: "+
reserva.casa+

"\nEntrada: "+
formatarData(reserva.entrada)+

"\nSaída: "+
formatarData(reserva.saida)+

"\n\nExcluir reserva?"

);



if(opcao){


reservas =
reservas.filter(
r=>r.id!==reserva.id
);



salvarBanco();


renderizarMapa();


}



}



// =====================================
// FORMATAR DATA
// =====================================


function formatarData(data){


return new Date(data)
.toLocaleDateString(
"pt-BR"
);


}
// =====================================
// ARRASTAR RESERVA PELO MAPA
// =====================================


// =====================================
// ARRASTAR RESERVA PARA OUTRO APARTAMENTO
// =====================================

gradeReservas.ondragover=function(e){

e.preventDefault();

};

gradeReservas.ondrop=function(e){

    e.preventDefault();

    let dados=e.dataTransfer.getData("reserva");

    if(!dados) return;

    let reservaMovida=JSON.parse(dados);

    const area=gradeReservas.getBoundingClientRect();

    // =====================================
    // CALCULAR DIA
    // =====================================

    let posicaoX=e.clientX-area.left;

    let novoDia=Math.floor(
        posicaoX/larguraDia
    )+1;

    if(novoDia<1)
        novoDia=1;

    if(novoDia>meses[mesAtual].dias)
        novoDia=meses[mesAtual].dias;


    // =====================================
    // CALCULAR APARTAMENTO
    // =====================================

    let posicaoY=e.clientY-area.top;

    const primeiraLinha=
        document.querySelector(".linha");

    if(!primeiraLinha)
        return;

    let alturaLinha=primeiraLinha.offsetHeight;

    let novaCasaIndex=Math.floor(
        posicaoY/alturaLinha
    );

    if(novaCasaIndex<0)
        novaCasaIndex=0;

    if(novaCasaIndex>=listaQuartos.length)
        novaCasaIndex=listaQuartos.length-1;


    // IMPORTANTE:
    // usar listaQuartos e NÃO hospedagens

    let novaCasa=listaQuartos[novaCasaIndex];


    // =====================================
    // NOVA DATA DE ENTRADA
    // =====================================

    let novaEntrada=new Date(
        anoAtual,
        mesAtual,
        novoDia
    );


    // =====================================
    // CALCULAR QUANTIDADE DE NOITES
    // =====================================

    let entradaOriginal=
        new Date(
            reservaMovida.entrada+"T00:00:00"
        );

    let saidaOriginal=
        new Date(
            reservaMovida.saida+"T00:00:00"
        );

    let noites=Math.round(
        (saidaOriginal-entradaOriginal)/
        (1000*60*60*24)
    );


    if(noites<1)
        noites=1;


    // =====================================
    // NOVA DATA DE SAÍDA
    // =====================================

    let novaSaida=new Date(novaEntrada);

    novaSaida.setDate(
        novaSaida.getDate()+noites
    );


    // =====================================
    // CRIAR NOVA RESERVA
    // =====================================

    let reservaNova={

        id:reservaMovida.id,

        casa:novaCasa,

        hospede:reservaMovida.hospede,

        telefone:reservaMovida.telefone,

        observacao:reservaMovida.observacao || "",

        status:reservaMovida.status,

        entrada:
            novaEntrada.toISOString().split("T")[0],

        saida:
            novaSaida.toISOString().split("T")[0]

    };


    // =====================================
    // VERIFICAR CONFLITO
    // =====================================

    if(verificarConflito(reservaNova)){

        alert(
            "Este apartamento já possui uma reserva neste período!"
        );

        renderizarMapa();

        return;
    }


    // =====================================
    // ATUALIZAR RESERVA
    // =====================================

    reservas=reservas.map(r=>{

        if(r.id===reservaMovida.id){

            return reservaNova;

        }

        return r;

    });


    // =====================================
    // SALVAR
    // =====================================

    salvarBanco();

    // =====================================
    // REDESENHAR MAPA
    // =====================================

    renderizarMapa();

};




// =====================================
// BOTÃO NOVA RESERVA
// =====================================


document.getElementById("btnNovaReserva")
.onclick=function(){



let hoje =
new Date();



mesAtual = hoje.getMonth();

abrirModalReserva(
hospedagens[0],
hoje.getDate()
);



};


function carregarHospedagensSelect(){

    const select = document.getElementById("casaReserva");

    select.innerHTML = "";

    listaQuartos.forEach(casa => {

        let option = document.createElement("option");

        option.value = casa;
        option.textContent = casa;

        select.appendChild(option);

    });

}


// =====================================
// FILTRO DE MÊS
// =====================================


function criarFiltroMes(){


let select =
document.createElement("select");


select.id="filtroMes";



meses.forEach((mes,index)=>{


let opcao =
document.createElement("option");


opcao.value=index;


opcao.textContent =
mes.nome;


select.appendChild(opcao);



});



select.value =
mesAtual;



select.onchange=function(){


mesAtual =
Number(this.value);


renderizarMapa();


};



document.querySelector(".topo")
.appendChild(select);


}




// =====================================
// INICIAR SISTEMA
// =====================================

window.onload = function(){

    carregarHospedagensSelect();

    carregarHospedagens();

    renderizarMapa();

    criarFiltroMes();

};
