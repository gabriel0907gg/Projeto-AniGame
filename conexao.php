<?php
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "anigame_db";

// Cria a conexão
$conexao = new mysqli($servidor, $usuario, $senha, $banco);

// Verifica se deu erro na conexão
if ($conexao->connect_error) {
    die("Falha na conexão: " . $conexao->connect_error);
}

// Opcional: define o conjunto de caracteres para aceitar acentos (UTF-8)
$conexao->set_charset("utf8");
?>