<?php
session_start();header('Content-Type: application/json; charset=utf-8');
require __DIR__.'/conexao.php';
$acao=$_GET['acao']??'';
if($acao==='favoritos'){
 if(empty($_SESSION['usuario_id'])){http_response_code(401);echo json_encode(['erro'=>'Faça login']);exit;}
 $uid=(int)$_SESSION['usuario_id'];$st=$conexao->prepare('SELECT midia_id,tipo_midia FROM favoritos WHERE usuario_id=? ORDER BY data_adicionado DESC');$st->bind_param('i',$uid);$st->execute();echo json_encode($st->get_result()->fetch_all(MYSQLI_ASSOC));exit;
}
$tipo=$_GET['tipo']??'';$id=filter_var($_GET['id']??null,FILTER_VALIDATE_INT);
if($acao==='avaliacoes'&&in_array($tipo,['anime','game'],true)&&$id&&$id>0){
 $st=$conexao->prepare('SELECT a.id,a.nota,a.comentario,a.data_avaliacao,u.nome FROM avaliacoes a JOIN usuarios u ON u.id=a.usuario_id WHERE a.tipo_midia=? AND a.midia_id=? ORDER BY a.data_avaliacao DESC LIMIT 100');$st->bind_param('si',$tipo,$id);$st->execute();$rows=$st->get_result()->fetch_all(MYSQLI_ASSOC);
 foreach($rows as &$row){$st2=$conexao->prepare('SELECT r.resposta,u.nome FROM comentarios_resposta r JOIN usuarios u ON u.id=r.usuario_id WHERE r.avaliacao_id=? ORDER BY r.data_resposta LIMIT 100');$st2->bind_param('i',$row['id']);$st2->execute();$row['respostas']=$st2->get_result()->fetch_all(MYSQLI_ASSOC);}echo json_encode($rows);exit;
}
http_response_code(400);echo json_encode(['erro'=>'Requisição inválida']);
