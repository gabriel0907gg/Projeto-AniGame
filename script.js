const campoPesquisa = document.getElementById("anime-input");

let temporizador;

campoPesquisa.addEventListener("input", () => {
  clearTimeout(temporizador);

  temporizador = setTimeout(() => {
    if (document.getElementById("categoria-busca").value === "anime") searchAnime();
  }, 400);
});

function searchAnime() {
  let input = document.getElementById("anime-input").value.trim();

  const home = document.getElementById("home");
  const resultados = document.getElementById("resultados-pesquisa");

  if (input === "") {
    home.hidden = false;
    resultados.hidden = true;
    return;
  }

  home.hidden = true;
  resultados.hidden = false;

  const query = `
    query ($nome: String) {
    Page(page: 1, perPage: 20) {
        media(search: $nome, type: ANIME) {
            id
            title {
                romaji
                english
            }
            coverImage {
                large
            }
        }
    }
}
`;

  fetch("https://graphql.anilist.co", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      query: query,
      variables: {
        nome: input,
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const animes = data.data.Page.media;

      const lista = document.getElementById("lista-resultados");
      lista.innerHTML = "";

      animes.forEach((anime) => {
        const animeCard = document.createElement("article");

        animeCard.classList.add("anime");

        animeCard.dataset.id = anime.id;

        const animeTitle = document.createElement("h3");
        animeTitle.classList.add("title");

        animeTitle.textContent = anime.title.english || anime.title.romaji;

        animeCard.appendChild(animeTitle);

        const animeImage = document.createElement("img");

        animeImage.classList.add("anime-img");

        animeImage.src = anime.coverImage.large;

        animeImage.alt = anime.title.english || anime.title.romaji;

        animeCard.addEventListener("click", () => {
          window.location.href = `PagCard.html?tipo=anime&id=${anime.id}`;
        });

        animeCard.appendChild(animeImage);

        lista.appendChild(animeCard);
      });
    });
}

recommendations();

function recommendations() {
  const query = `
        query {









        
            Page(page: 1, perPage: 15) {
                media(
                    type: ANIME,
                    sort: POPULARITY_DESC
                ) {
                    id
                    title {
                        romaji
                        english
                    }
                    coverImage {
                        large
                    }
                }
            }
        }
    `;

  fetch("https://graphql.anilist.co", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      query: query,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const animes = data.data.Page.media;

      for (let i = 0; i < animes.length; i++) {
        const anime = animes[i];

        const animeCard = document.createElement("article");

        animeCard.classList.add("anime");

        animeCard.dataset.id = anime.id;

        const animeTitle = document.createElement("h3");
        animeTitle.classList.add("title");

        animeTitle.textContent = anime.title.english || anime.title.romaji;

        animeCard.appendChild(animeTitle);

        const animeImage = document.createElement("img");

        animeImage.classList.add("anime-img");

        animeImage.src = anime.coverImage.large;

        animeImage.alt = anime.title.english || anime.title.romaji;

        animeCard.addEventListener("click", () => {
          window.location.href = `PagCard.html?tipo=anime&id=${anime.id}`;
        });

        animeCard.appendChild(animeImage);

        const highlights = document.getElementById("lista-animes");
        highlights.appendChild(animeCard);
      }
    });
}

async function buscarJogos() {
  try {
    const resposta = await fetch("games.php?limit=15");

    if (!resposta.ok) {
      throw new Error("Erro ao buscar jogos");
    }

    const jogos = await resposta.json();

    const container = document.getElementById("lista-games");

    container.innerHTML = "";

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
  }
}

buscarJogos();

async function searchGames() {
  const pesquisa = document.getElementById("game-input").value.trim();

  const resposta = await fetch(`games.php?q=${encodeURIComponent(pesquisa)}`);

  if (!resposta.ok) {
    throw new Error("Erro ao pesquisar jogos");
  }

  const jogos = await resposta.json();

  console.log(jogos);
}
