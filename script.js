
function searchAnime() {
  let input = document.getElementById("anime-input").value;

  const query = `
    query {
        Media(search: "${input}", type: ANIME) {
            title {
                romaji
                english
            }
            coverImage {
                large
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

      const anime = data.data.Media;

      document.querySelector("#title").textContent =
        anime.title.english || anime.title.romaji;

      document.querySelector("#img").src = anime.coverImage.large;
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

      for (let i = 0; i < 15; i++) {
        const anime = data.data.Page.media[i];

        const animeCard = document.createElement("div");

        animeCard.classList.add("anime-card");

        animeCard.dataset.id = anime.id;

        document.body.appendChild(animeCard);

        const animeTitle = document.createElement("h1");

        animeTitle.textContent = anime.title.english || anime.title.romaji;

        animeCard.appendChild(animeTitle);

        const animeImage = document.createElement("img");

        animeImage.src = anime.coverImage.large;

        animeImage.alt = anime.title.english || anime.title.romaji;

        animeCard.appendChild(animeImage);
      }
    });
}
