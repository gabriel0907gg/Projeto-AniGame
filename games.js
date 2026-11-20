async function buscarJogos() {
  try {
    const resposta = await fetch("games.php");

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
