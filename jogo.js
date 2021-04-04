console.log('[DevSoutinho] Flappy Bird'); //Só desmonstando que o js estaa ligado

//Criando um objeto global
let globais = {};

//FrameAtual
let frames = 0;

//Efeitos sonoros
const som_hit = new Audio();
const som_caiu = new Audio();
const som_ponto = new Audio();
const som_pulo = new Audio();

som_hit.src = "./efeitos/hit.wav";
som_caiu.src = "./efeitos/caiu.wav";
som_ponto.src = "./efeitos/ponto.wav";
som_pulo.src = "./efeitos/pulo.wav";

const sprites = new Image(); // Criando uma img dentro da memoria
sprites.src = './sprites.png'; // Adicionando o valor a memoria imagem

const canvas = document.querySelector('canvas'); // Seleciona uma determina tag
const contexto = canvas.getContext('2d'); // Define que é 2D

//Criando uma colisao
function criarColisaoChao(flappyBird, chao) {
  const flappyBirdAltura = flappyBird.y + flappyBird.altura;
  const chaoAltura = chao.y;
  if (flappyBirdAltura >= chaoAltura) {
    return true;
  }
  return false;
}
//Colisao com o teto
function criarColisaoTeto(flappyBird) {
  if (flappyBird.y <= 2) {
    return true;
  }
  return false;
}

//Funcao para criar um flasppybird
function criarFlappyBird() {
  //Const que vale o flappybird
  //Facilita o trabalho com demais operacoes
  const flappyBird = {
    sx: 0, //sx, sy -> Souce X and, Posicao inicial
    sy: 0, //sx, sy -> Souce X and, Posicao inicial
    largura: 33, //Tamanho da imagem do sprit
    altura: 24,//Tamanho da imagem do sprit
    x: 10, //Posicao inicial dentro do canvas
    y: 50, //Posicao inicial dentro do canvas
    //Simulando gravidade
    gravidade: 0.25,
    pulo: 4.6,
    velocidade: 0, //Velocidade 
    atualiza() {
      //Adicionando a colisao
      if(criarColisaoChao(flappyBird, globais.chao)) {
        som_hit.play(); //Iniciando o audio
        //Colocando um delay para mudar a tela
        /*
        setTimeout(() => {
          mudaParaTela(telas.inicio); //Alterando o tela após a condicao
        }, 500);
        */
        mudaParaTela(telas.gameover); //Alterando o tela após a condicao
        return;
      }
      if(criarColisaoTeto(flappyBird)) {
        som_hit.play(); //Iniciando o audio
        mudaParaTela(telas.gameover); //Alterando o tela após a condicao
        return;
      }
      //flappyBird.y = flappyBird.y+1;
      flappyBird.y += flappyBird.velocidade;
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
    },
    //Acao de pular
    pula() {
      flappyBird.velocidade =  - flappyBird.pulo;
    },
    movimentos : [
      { spriteX: 0, spriteY: 0 }, //Asa para cima
      { spriteX: 0, spriteY: 26 }, //Asa no meio
      { spriteX: 0, spriteY: 52 }, //Asa para baixo
      { spriteX: 0, spriteY: 26 }, //Asa no meio
    ],
    //Atualiza o frame para saber a troca do sprit
    frameAtual : 0, 
    atualizaFrameAtual() {
      const intervaloDeFrames = 10;
      const passouIntervalo = frames % intervaloDeFrames === 0;
      if (passouIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
    },
    //Desenhar a imagem com uma funcao dentro da propria constantes
    desenha() {
      flappyBird.atualizaFrameAtual();
      //Desestruturar um array dos sprits usados
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
      contexto.drawImage(
        sprites, //Imagem
        spriteX, spriteY, //flappyBird.sx, flappyBird.sy, //sx, sy -> Souce X and, Posicao inicial
        flappyBird.largura, flappyBird.altura, //Tamanho da imagem do sprit
        flappyBird.x, flappyBird.y, //Posicao inicial dentro do canvas
        flappyBird.largura, flappyBird.altura //Tamanho da imagem dentro do canvas
      );
    }
  }
  return flappyBird;
}

//Plano de fundo
function criarPlanoDeFundo() {
  const planoDeFundo = {
    sx: 390, //sx, sy -> Souce X and, Posicao inicial
    sy: 0, //sx, sy -> Souce X and, Posicao inicial
    largura: 275, //Tamanho da imagem do sprit
    altura: 204,//Tamanho da imagem do sprit
    x: 0, //Posicao inicial dentro do canvas
    y: canvas.height - 204, //Posicao inicial dentro do canvas
    //Desenhar a imagem com uma funcao dentro da propria constantes
    atualiza() {
      const movimentoDoPlano = 1;
      const repeteEm = planoDeFundo.largura / 2;
      const movimentacao = planoDeFundo.x - movimentoDoPlano;
      planoDeFundo.x = movimentacao % repeteEm; //Animacao do chao
    },
    desenha() {
      //Pintando o plano de fundo 
      //Criando uma area para ser pintada
      contexto.fillStyle = '#70c5ce';
      //Dando render no quadrado
      contexto.fillRect(
        0, 0, //X e Y iniciais
        canvas.width, canvas.height //Até onde é para dar render
      );
      contexto.drawImage(
        sprites, //Imagem
        planoDeFundo.sx, planoDeFundo.sy, //sx, sy -> Souce X and, Posicao inicial
        planoDeFundo.largura, planoDeFundo.altura, //Tamanho da imagem do sprit
        planoDeFundo.x, planoDeFundo.y, //Posicao inicial dentro do canvas
        planoDeFundo.largura, planoDeFundo.altura //Tamanho da imagem dentro do canvas
      );
      contexto.drawImage(
        sprites, //Imagem
        planoDeFundo.sx, planoDeFundo.sy, //sx, sy -> Souce X and, Posicao inicial
        planoDeFundo.largura, planoDeFundo.altura, //Tamanho da imagem do sprit
        (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y, //Posicao inicial dentro do canvas
        planoDeFundo.largura, planoDeFundo.altura //Tamanho da imagem dentro do canvas
      );
    }
  }
  return planoDeFundo;
}

//Pontos extras
let pontosExtras = 0;

//Canos de fundo
function criarCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    desenha() {
      //Sempre será um par de canos
      canos.paresDeCanosARender.forEach(function(par){
        //Y random para o render dos canos
        const YRandom = par.y;
        //Espacamento padrao de canos
        const espacamentoCanos = 100;
        //Cano ceu
        const canoCeuX = par.x;
        const canoCeuY = YRandom;
        contexto.drawImage(
          sprites, //Imagem
          canos.ceu.spriteX, canos.ceu.spriteY, //sx, sy -> Souce X and, Posicao inicial
          canos.largura, canos.altura, //Tamanho da imagem do sprit
          canoCeuX, canoCeuY, //Posicao inicial dentro do canvas
          canos.largura, canos.altura //Tamanho da imagem dentro do canvas
        );
        //cano chao
        const canoChaoX = par.x;
        const canoChaoY = canos.altura+espacamentoCanos+YRandom;
        contexto.drawImage(
          sprites, //Imagem
          canos.chao.spriteX, canos.chao.spriteY, //sx, sy -> Souce X and, Posicao inicial
          canos.largura, canos.altura, //Tamanho da imagem do sprit
          canoChaoX, canoChaoY, //Posicao inicial dentro do canvas
          canos.largura, canos.altura //Tamanho da imagem dentro do canvas
        );
        //Atualizando o par a cada loop para se trabalhada a colisao
        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY,
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY,  
        }
      });
    },
    temColisaoComFlappyBird(par) {
      //Confirmar se está na area dos canos
      const cabecaFlappyBird = globais.flappyBird.y;
      const peFlappyBird = globais.flappyBird.y + globais.flappyBird.altura;

      if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
        if(cabecaFlappyBird <= par.canoCeu.y) {
          return true;
        }
        if (peFlappyBird >= par.canoChao.y) {
          return true;
        }
      }
      //Som que passou do arro
      if(((globais.flappyBird.x + globais.flappyBird.largura) >= par.x+(globais.flappyBird.largura/2)) && ((globais.flappyBird.x + globais.flappyBird.largura) <= par.x+canos.largura)) {
        som_ponto.play();
        const espacamentoEmFramesDeDistanciaEntreOtempoPeloCano = frames % 20 === 0;
        if (espacamentoEmFramesDeDistanciaEntreOtempoPeloCano) {
          globais.placar.pontuacao+=10;
        }
      } 
      return false;
    },
    paresDeCanosARender: [],
    atualiza() {
      //Adicionar canos conforme frames aumenta
      const passou100Frames = frames % 100 === 0;
      if (passou100Frames) {
        canos.paresDeCanosARender.push({
          x: canvas.width,
          y: -180 * (Math.random() + 1),
        });
      }
      //Movimento dos canos
      canos.paresDeCanosARender.forEach(function(par){
        par.x = par.x-2;
        //Colisao dos canos
        if(canos.temColisaoComFlappyBird(par)) {
          som_hit.play();
          mudaParaTela(telas.gameover); //Alterando o tela após a condicao
        }
        //Limpando os canos que já foram do array
        if(par.x + canos.largura <= 0) {
          canos.paresDeCanosARender.shift();
        }
      });
    }
  }
  return canos;
}

//Chao do jogo
function criarChao() {
  const chao = {
    sx: 0, //sx, sy -> Souce X and, Posicao inicial
    sy: 610, //sx, sy -> Souce X and, Posicao inicial
    largura: 224, //Tamanho da imagem do sprit
    altura: 112,//Tamanho da imagem do sprit
    x: 0, //Posicao inicial dentro do canvas
    //Pega a altura do canvas e subtrai pela altura da imagem
    y: canvas.height - 112, //Posicao inicial dentro do canvas
    //Acoes do chao -> Movimento
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;
      chao.x = movimentacao % repeteEm; //Animacao do chao
    },
    //Desenhar a imagem com uma funcao dentro da propria constantes
    desenha() {
      //Desenhando o chao em duas partes
      contexto.drawImage(
        sprites, //Imagem
        chao.sx, chao.sy, //sx, sy -> Souce X and, Posicao inicial
        chao.largura, chao.altura, //Tamanho da imagem do sprit
        chao.x, chao.y, //Posicao inicial dentro do canvas
        chao.largura, chao.altura //Tamanho da imagem dentro do canvas
      );
      contexto.drawImage(
        sprites, //Imagem
        chao.sx, chao.sy, //sx, sy -> Souce X and, Posicao inicial
        chao.largura, chao.altura, //Tamanho da imagem do sprit
        (chao.x + chao.largura), chao.y, //Posicao inicial dentro do canvas
        chao.largura, chao.altura //Tamanho da imagem dentro do canvas
      );
    }
  }
  return chao;
}

//Mensagem antes do inicio do jogo
const mensagemInicio = {
  sx: 134, //sx, sy -> Souce X and, Posicao inicial
  sy: 0, //sx, sy -> Souce X and, Posicao inicial
  largura: 174, //Tamanho da imagem do sprit
  altura: 152,//Tamanho da imagem do sprit
  x: (canvas.width / 2) - (174 / 2), //Posicao inicial dentro do canvas
  //Pega a altura do canvas e subtrai pela altura da imagem
  y: 50, //Posicao inicial dentro do canvas
  //Desenhar a imagem com uma funcao dentro da propria constantes
  desenha() {
    contexto.drawImage(
      sprites, //Imagem
      mensagemInicio.sx, mensagemInicio.sy, //sx, sy -> Souce X and, Posicao inicial
      mensagemInicio.largura, mensagemInicio.altura, //Tamanho da imagem do sprit
      mensagemInicio.x, mensagemInicio.y, //Posicao inicial dentro do canvas
      mensagemInicio.largura, mensagemInicio.altura //Tamanho da imagem dentro do canvas
    );
  }
}

//Tela de fim de jogo
const mensagemGameOver = {
  sx: 134, //sx, sy -> Souce X and, Posicao inicial
  sy: 153, //sx, sy -> Souce X and, Posicao inicial
  largura: 226, //Tamanho da imagem do sprit
  altura: 200,//Tamanho da imagem do sprit
  x: (canvas.width / 2) - (226 / 2), //Posicao inicial dentro do canvas
  //Pega a altura do canvas e subtrai pela altura da imagem
  y: 50, //Posicao inicial dentro do canvas
  //Desenhar a imagem com uma funcao dentro da propria constantes
  desenha() {
    contexto.drawImage(
      sprites, //Imagem
      mensagemGameOver.sx, mensagemGameOver.sy, //sx, sy -> Souce X and, Posicao inicial
      mensagemGameOver.largura, mensagemGameOver.altura, //Tamanho da imagem do sprit
      mensagemGameOver.x, mensagemGameOver.y, //Posicao inicial dentro do canvas
      mensagemGameOver.largura, mensagemGameOver.altura //Tamanho da imagem dentro do canvas
    );
    //Render da medalha dependente da quantidade de pontos
    let [posicaoXMedalha, posicaoYMedalha] = [];
    if (globais.placar.pontuacao < 100) {
      //Bronze
      [posicaoXMedalha, posicaoYMedalha] = [48, 122];
    } else if ((globais.placar.pontuacao > 100) && (globais.placar.pontuacao < 500)) {
      //Prata clara
      [posicaoXMedalha, posicaoYMedalha] = [0, 76];
    } else if ((globais.placar.pontuacao > 500) && (globais.placar.pontuacao < 1000)) {
      //Prata escura
      [posicaoXMedalha, posicaoYMedalha] = [48, 76];
    } else if (globais.placar.pontuacao > 1000) {
      //Ouro
      [posicaoXMedalha, posicaoYMedalha] = [0, 122];
    }
    contexto.drawImage(
      sprites, //Imagem
      posicaoXMedalha, posicaoYMedalha, //sx, sy -> Souce X and, Posicao inicial
      44, 46, //Tamanho da imagem do sprit
      72, 134, //Posicao inicial dentro do canvas
      48, 48 //Tamanho da imagem dentro do canvas
    );

    contexto.font = '32px "VT323"';
    contexto.textAlign = 'right';
    contexto.fillStyle = 'white';
    contexto.fillText(globais.placar.pontuacao, canvas.width-70, 148);
    contexto.fillText(melhorPontuacao, canvas.width-70, 188);

  }
}

//Tela ativa no momento
//Escopo global com let
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;
  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

//Fora do objeto para não ser reconstruido
let melhorPontuacao = 0;

//Criar placar de pontuacao
function criarPlacar() {
  const placar = {
    pontuacao: 0,
    desenha() {
      contexto.font = '35px "VT323"';
      contexto.textAlign = 'right';
      contexto.fillStyle = 'white';
      //Pontuacao
      contexto.fillText(`${placar.pontuacao}`, canvas.width-20, 35);
    },
    //Atualiza o contador + pontos extras
    atualiza() {
      const intervaloDeFrames = 10;
      const passouIntervalo = frames % intervaloDeFrames === 0;
      if (pontosExtras != 0) {
        placar.pontuacao+=pontosExtras;
        pontosExtras=0;
      }
      if(passouIntervalo) {
        placar.pontuacao++;
      }
      if (placar.pontuacao > melhorPontuacao) {
        melhorPontuacao = placar.pontuacao;
      }
    }
  };

  return placar;
}

//Telas da aplicacao
const telas = {
  inicio: {
    inicializa() {
      globais.flappyBird = criarFlappyBird();
      globais.chao = criarChao();
      globais.planoDeFundo = criarPlanoDeFundo();
      globais.canos = criarCanos();
    },
    desenha() {
      globais.planoDeFundo.desenha();
      globais.flappyBird.desenha();
      globais.chao.desenha();
      mensagemInicio.desenha();
    },
    click() {
      mudaParaTela(telas.jogo);
    },
    atualiza() {
      globais.chao.atualiza();
      globais.planoDeFundo.atualiza();
    }
  },
  jogo: {
    inicializa() {
      globais.placar = criarPlacar();
    },
    desenha() {
      //Chamando o desenho na imagem
      //Renderiza por ordem de chegada
      globais.planoDeFundo.desenha();
      globais.flappyBird.desenha();
      globais.canos.desenha();
      globais.chao.desenha();
      globais.placar.desenha();
    },
    click() {
      globais.flappyBird.pula();
      som_pulo.play();
    },
    atualiza() {    
      //Atualiza sempre que loopar
      globais.flappyBird.atualiza();
      globais.chao.atualiza();
      globais.planoDeFundo.atualiza();
      globais.canos.atualiza();
      globais.placar.atualiza();
    }
  },
  gameover: {
    inicializa() {

    },
    desenha() {
      mensagemGameOver.desenha();
    },
    click() {
      mudaParaTela(telas.inicio);
    },
    atualiza() {

    }
  }
}

//Iniciando o loop com render de frama otimizado
function loop() {

  //Atualiza sempre que loopar
  //flappyBird.atualiza();

  //Chamando o desenho na imagem
  //Renderiza por ordem de chegada
  /*
  planoDeFundo.desenha();
  flappyBird.desenha();
  chao.desenha();
  */

  telaAtiva.desenha();
  telaAtiva.atualiza();
  frames = frames + 1;


  //Otimizacao na chamada de elementos dentro do JS
  requestAnimationFrame(loop); // Recursividade
}

//Click para alterar a ações da tela
window.addEventListener('click', function() {
  if(telaAtiva.click) {
    telaAtiva.click();
  }
});

//Primeiro estado da tela
mudaParaTela(telas.inicio);

//Iniciando o loop
loop();