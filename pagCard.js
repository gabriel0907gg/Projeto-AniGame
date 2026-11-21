const parametros = new URLSearchParams(window.location.search);

const tipo = parametros.get("tipo");
const id = parametros.get("id");

console.log("Tipo:", tipo);
console.log("ID:", id);

async function buscarDetalhesAnime(id) {
  const query = `
    query ($id: Int) {
    Media(id: $id, type: ANIME) {
        id
        title {
            romaji
            english
        }
        description(asHtml: false)
        coverImage {
            extraLarge
        }
        genres
        averageScore
        startDate {
            year
            month
            day
        }
    }
}
`;

  const resposta = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
      variables: {
        id: Number(id),
      },
    }),
  });

  const dados = await resposta.json();
  const anime = dados.data.Media;

  console.log(anime);

  const titulo = document.getElementById("titulo-midia");

  titulo.textContent = anime.title.english || anime.title.romaji;

  const capa = document.getElementById("capa-midia");

  capa.src = anime.coverImage.extraLarge;
  capa.alt = anime.title.english || anime.title.romaji;

  document.getElementById("tipo-midia").textContent = "Anime";

  const generos = document.getElementById("generos-midia");

  generos.textContent = anime.genres.join(", ");

  const dataMidia = document.getElementById("data-midia");
  const { day, month, year } = anime.startDate;
  dataMidia.textContent =
    day && month && year
      ? `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`
      : year || "Data desconhecida";

  const descricao = document.getElementById("descricao-midia");
  descricao.textContent = anime.description || "Descrição indisponível.";
}

async function buscarDetalhesGame(id) {
  const resposta = await fetch(`games.php?id=${encodeURIComponent(id)}`);

  if (!resposta.ok) {
    console.error("Erro ao buscar jogo:", resposta.status);
    return;
  }

  const dados = await resposta.json();

  console.log(dados);

  const jogo = dados[0];

  if (!jogo) {
    console.error("Jogo não encontrado.");
    return;
  }

  const titulo = document.getElementById("titulo-midia");
  titulo.textContent = jogo.name;

  const imagem = document.getElementById("capa-midia");

  if (jogo.cover?.image_id) {
    imagem.src = `https://images.igdb.com/igdb/image/upload/t_cover_big/${jogo.cover.image_id}.jpg`;
  } else {
    imagem.src = "img/sem-capa.png";
  }

  imagem.alt = jogo.name;

  document.getElementById("tipo-midia").textContent = "Jogo";

  const generos = document.getElementById("generos-midia");

  generos.textContent =
    jogo.genres?.map((genero) => genero.name).join(", ") ||
    "Gêneros não informados";

  const descricao = document.getElementById("descricao-midia");
  descricao.textContent = jogo.summary || "Descrição indisponível";

  const dataMidia = document.getElementById("data-midia");

  if (jogo.first_release_date) {
    const data = new Date(jogo.first_release_date * 1000);

    dataMidia.textContent = data.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  } else {
    dataMidia.textContent = "Data desconhecida";
  }

  console.log(data);
}

if (tipo === "anime" && id) {
  buscarDetalhesAnime(id);
} else if (tipo === "game" && id) {
  buscarDetalhesGame(id);
}
