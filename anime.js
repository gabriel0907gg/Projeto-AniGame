const campoPesquisa = document.getElementById("anime-input");

let temporizador;

campoPesquisa.addEventListener("input", () => {
  clearTimeout(temporizador);
  if (document.getElementById("categoria-busca").value !== "anime") return;

  temporizador = setTimeout(() => {
    searchAnime();
  }, 400);
});

function searchAnime() {
  let input = document.getElementById("anime-input").value.trim();

  const home = document.getElementById("home");
  const resultados = document.getElementById("resultados-pesquisa-anime");

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
  let pagina = 1;
  let carregando = false;
  let fimDosAnimes = false;

  async function recommendations() {
    if (carregando || fimDosAnimes) return;

    carregando = true;

    const botao = document.getElementById("carregar-mais-animes");

    botao.disabled = true;
    botao.textContent = "Carregando...";

    const query = `
    query ($pagina: Int) {
      Page(page: $pagina, perPage: 20) {
        pageInfo {
          hasNextPage
        }
        media(type: ANIME, sort: POPULARITY_DESC) {
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

    let sucesso = false;

    try {
      const resposta = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          variables: {
            pagina: pagina,
          },
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao carregar animes");
      }

      const dados = await resposta.json();

      const animes = dados.data.Page.media;
      const lista = document.getElementById("lista-animes");

      animes.forEach((anime) => {
        const card = document.createElement("article");
        card.classList.add("anime");

        const titulo = document.createElement("h3");
        titulo.classList.add("title");

        titulo.textContent = anime.title.english || anime.title.romaji;

        const imagem = document.createElement("img");
        imagem.classList.add("anime-img");

        imagem.src = anime.coverImage.large;
        imagem.alt = titulo.textContent;

        card.appendChild(titulo);
        card.appendChild(imagem);

        card.addEventListener("click", () => {
          window.location.href = `PagCard.html?tipo=anime&id=${anime.id}`;
        });

        lista.appendChild(card);
      });

      fimDosAnimes = !dados.data.Page.pageInfo.hasNextPage;

      pagina++;
      sucesso = true;
    } catch (erro) {
      console.error("Erro ao carregar animes:", erro);
      observador.disconnect();
    } finally {
      carregando = false;

      botao.disabled = false;
      botao.textContent = "Carregar mais";
      botao.hidden = fimDosAnimes;

      if (sucesso && !fimDosAnimes) {
        observador.unobserve(elementoObservado);
        observador.observe(elementoObservado);
      } else {
        observador.disconnect();
      }
    }
  }

  const elementoObservado = document.getElementById("observador-animes");

  const observador = new IntersectionObserver(
    (entradas) => {
      if (
        entradas[0].isIntersecting &&
        !carregando &&
        !fimDosAnimes &&
        !document.getElementById("home").hidden
      ) {
        recommendations();
      }
    },
    {
      rootMargin: "200px",
    },
  );

  observador.observe(elementoObservado);

  recommendations();
}
