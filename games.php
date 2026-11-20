
<?php

$clientId = "lxiw099x27two7ryl5hudv1ggdfg52";
$clientSecret = "mp2h5s0czk42mj7c0vlv43ncnminy2";

$auth = curl_init("https://id.twitch.tv/oauth2/token");

curl_setopt_array($auth, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        "client_id" => $clientId,
        "client_secret" => $clientSecret,
        "grant_type" => "client_credentials"
    ])
]);

$respostaAuth = curl_exec($auth);
$statusAuth = curl_getinfo($auth, CURLINFO_HTTP_CODE);

curl_close($auth);

if ($respostaAuth === false || $statusAuth !== 200) {
    http_response_code(502);
    header("Content-Type: application/json");
    echo json_encode(["error" => "Erro ao obter token"]);
    exit;
}

$dados = json_decode($respostaAuth, true);
$token = $dados["access_token"];

$url = "https://api.igdb.com/v4/games";

$consulta = 'fields id,name,summary,cover.image_id; limit 100;';

$curl = curl_init($url);

curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $consulta,
    CURLOPT_HTTPHEADER => [
        "Client-ID: $clientId",
        "Authorization: Bearer $token",
        "Content-Type: text/plain"
    ]
]);

$resultado = curl_exec($curl);

$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

header("Content-Type: application/json; charset=utf-8");

if ($resultado === false) {
    http_response_code(502);
    echo json_encode(["error" => "Falha na consulta à IGDB"]);
} else {
    http_response_code($status);
    echo $resultado;
}

curl_close($curl);
?>