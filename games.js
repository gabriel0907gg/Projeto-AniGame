const campoPesquisa = document.getElementById("game-input");
let offset = 0;
const limit = 20;
let carregando = false;
let fimDosJogos = false;

let temporizador;

campoPesquisa.addEventListener("input", () => {
  clearTimeout(temporizador);
  if (document.getElementById("categoria-busca").value !== "game") return;

  temporizador = setTimeout(() => {
    searchGames();
  }, 400);
});

async function buscarJogos() {
  if (carregando || fimDosJogos) return;
  carregando = true;

  try {
    const resposta = await fetch(`games.php?limit=${limit}&offset=${offset}`);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar jogos");
    }

    const jogos = await resposta.json();

    if (jogos.length < limit) {
      fimDosJogos = true;
    }

    offset += jogos.length;

    const container = document.getElementById("lista-games");

    jogos.forEach((jogo) => {
      const gameCard = document.createElement("article");
      gameCard.classList.add("game");
      gameCard.dataset.id = jogo.id;

      const gameTitle = document.createElement("h3");
      gameTitle.classList.add("title");
      gameTitle.textContent = jogo.name;

      gameCard.appendChild(gameTitle);

      const gameImage = document.createElement("img");
      gameImage.classList.add("game-img");

      if (jogo.cover?.image_id) {
        gameImage.src = `https://images.igdb.com/igdb/image/upload/t_cover_big/${jogo.cover.image_id}.jpg`;
      } else {
        gameImage.src = "img/sem-capa.png";
      }

      gameImage.alt = jogo.name;
      gameCard.appendChild(gameImage);

      gameCard.addEventListener("click", () => {
        window.location.href = `PagCard.html?tipo=game&id=${jogo.id}`;
      });

      container.appendChild(gameCard);
    });

    console.log(jogos);
  } catch (erro) {
    console.log("Erro ao carregar jogos:", erro);
    console.error("Erro ao carregar jogos:", erro);
  } finally {
    carregando = false;

    const botao = document.getElementById("carregar-mais");

    botao.hidden = fimDosJogos;

    if (!fimDosJogos) {
      observador.unobserve(elementoObservado);
      observador.observe(elementoObservado);
    } else {
      observador.disconnect();
    }
  }
}

buscarJogos();

async function searchGames() {
  const pesquisa = document.getElementById("game-input").value.trim();

  if (!pesquisa) {
    document.getElementById("home").hidden = false;
    document.getElementById("resultados-pesquisa-games").hidden = true;
    return;
  }
  const resposta = await fetch(`games.php?q=${encodeURIComponent(pesquisa)}`);

  if (!resposta.ok) {
    throw new Error("Erro ao pesquisar jogos");
  }

  const jogos = await resposta.json();

  const home = document.getElementById("home");
  const resultados = document.getElementById("resultados-pesquisa-games");
  const lista = document.getElementById("lista-resultados");

  home.hidden = true;
  resultados.hidden = false;
  lista.innerHTML = "";

  jogos.forEach((jogo) => {
    const card = document.createElement("article");
    card.classList.add("game");

    const titulo = document.createElement("h3");
    titulo.classList.add("title");
    titulo.textContent = jogo.name;

    const imagem = document.createElement("img");
    imagem.classList.add("game-img");

    imagem.src = jogo.cover?.image_id
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${jogo.cover.image_id}.jpg`
      : "img/sem-capa.png";

    imagem.alt = jogo.name;

    card.appendChild(titulo);
    card.appendChild(imagem);

    card.addEventListener("click", () => {
      window.location.href = `PagCard.html?tipo=game&id=${jogo.id}`;
    });

    lista.appendChild(card);
  });

  console.log(jogos);
}

const elementoObservado = document.getElementById("observador-jogos");

const observador = new IntersectionObserver(
  (entradas) => {
    if (
      entradas[0].isIntersecting &&
      !carregando &&
      !fimDosJogos &&
      !document.getElementById("home").hidden
    ) {
      buscarJogos();
    }
  },
  {
    rootMargin: "200px",
  },
);

observador.observe(elementoObservado);
