const campoPesquisa = document.getElementById("anime-input");

let temporizador;

campoPesquisa.addEventListener("input", () => {
  clearTimeout(temporizador);

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