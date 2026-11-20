const parametros = new URLSearchParams(window.location.search);

const tipo = parametros.get("tipo");
const id = parametros.get("id");

console.log("Tipo:", tipo);
console.log("ID:", id);
