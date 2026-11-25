<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
  $conexao = new mysqli('localhost', 'root', '', 'anigame_db');
  $conexao->set_charset('utf8mb4');
} catch (mysqli_sql_exception $e) {
  error_log($e->getMessage());
  http_response_code(500);
  exit('Não foi possível conectar ao banco de dados.');
}
