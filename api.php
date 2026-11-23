<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function out($data,$code=200){http_response_code($code);echo json_encode($data,JSON_UNESCAPED_UNICODE);exit;}
function auth(){if(empty($_SESSION['usuario_id']))out(['erro'=>'Faça login primeiro'],401);return (int)$_SESSION['usuario_id'];}
function csrf(){if(!hash_equals($_SESSION['csrf']??'',$_SERVER['HTTP_X_CSRF_TOKEN']??''))out(['erro'=>'Token de segurança inválido'],403);}
function media(){ $tipo=$_POST['tipo']??$_GET['tipo']??'';$id=filter_var($_POST['id']??$_GET['id']??null,FILTER_VALIDATE_INT);if(!in_array($tipo,['anime','game'],true)||!$id||$id<1)out(['erro'=>'Mídia inválida'],400);return [$tipo,$id]; }
$acao=$_GET['acao']??'';
if($acao==='sessao'){out(['logado'=>!empty($_SESSION['usuario_id']),'nome'=>$_SESSION['nome']??null,'csrf'=>$_SESSION['csrf']??null]);}
if($_SERVER['REQUEST_METHOD']!=='POST')out(['erro'=>'Método não permitido'],405);
if($acao!=='login'&&$acao!=='cadastro')csrf();
require __DIR__.'/conexao.php';
try{
 if($acao==='cadastro'){
  $nome=trim($_POST['nome']??'');$email=trim($_POST['email']??'');$senha=$_POST['senha']??'';
  if(mb_strlen($nome)<2||mb_strlen($nome)>100||!filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($email)>150||strlen($senha)<8)out(['erro'=>'Informe nome, e-mail válido e senha com pelo menos 8 caracteres'],400);
  $hash=password_hash($senha,PASSWORD_DEFAULT);$st=$conexao->prepare('INSERT INTO usuarios(nome,email,senha) VALUES(?,?,?)');$st->bind_param('sss',$nome,$email,$hash);$st->execute();session_regenerate_id(true);$_SESSION['usuario_id']=$conexao->insert_id;$_SESSION['nome']=$nome;$_SESSION['csrf']=bin2hex(random_bytes(32));out(['ok'=>true]);
 }
 if($acao==='login'){
  $email=trim($_POST['email']??'');$senha=$_POST['senha']??'';
  $st=$conexao->prepare('SELECT id,nome,senha FROM usuarios WHERE email=? LIMIT 1');$st->bind_param('s',$email);$st->execute();$u=$st->get_result()->fetch_assoc();
  if(!$u||!password_verify($senha,$u['senha']))out(['erro'=>'E-mail ou senha incorretos'],401);
  session_regenerate_id(true);$_SESSION['usuario_id']=(int)$u['id'];$_SESSION['nome']=$u['nome'];$_SESSION['csrf']=bin2hex(random_bytes(32));out(['ok'=>true]);
 }
 if($acao==='logout'){$_SESSION=[];session_destroy();out(['ok'=>true]);}
 $uid=auth();
 if($acao==='favorito'){
  [$tipo,$midia]=media();$st=$conexao->prepare('SELECT id FROM favoritos WHERE usuario_id=? AND tipo_midia=? AND midia_id=?');$st->bind_param('isi',$uid,$tipo,$midia);$st->execute();$row=$st->get_result()->fetch_assoc();
  if($row){$st=$conexao->prepare('DELETE FROM favoritos WHERE id=? AND usuario_id=?');$st->bind_param('ii',$row['id'],$uid);$st->execute();out(['favorito'=>false]);}
  $st=$conexao->prepare('INSERT INTO favoritos(usuario_id,tipo_midia,midia_id) VALUES(?,?,?)');$st->bind_param('isi',$uid,$tipo,$midia);$st->execute();out(['favorito'=>true]);
 }
 if($acao==='avaliar'){
  [$tipo,$midia]=media();$nota=filter_var($_POST['nota']??null,FILTER_VALIDATE_INT);$comentario=trim($_POST['comentario']??'');if(!$nota||$nota<1||$nota>10||mb_strlen($comentario)>3000)out(['erro'=>'Nota de 1 a 10 e comentário de até 3000 caracteres'],400);
  $st=$conexao->prepare('INSERT INTO avaliacoes(usuario_id,midia_id,tipo_midia,nota,comentario) VALUES(?,?,?,?,?) ON DUPLICATE KEY UPDATE nota=VALUES(nota), comentario=VALUES(comentario),data_avaliacao=CURRENT_TIMESTAMP');$st->bind_param('iisis',$uid,$midia,$tipo,$nota,$comentario);$st->execute();out(['ok'=>true]);
 }
 if($acao==='responder'){
  $avaliacao=filter_var($_POST['avaliacao_id']??null,FILTER_VALIDATE_INT);$resposta=trim($_POST['resposta']??'');if(!$avaliacao||mb_strlen($resposta)<1||mb_strlen($resposta)>2000)out(['erro'=>'Resposta inválida'],400);
  $st=$conexao->prepare('INSERT INTO comentarios_resposta(avaliacao_id,usuario_id,resposta) VALUES(?,?,?)');$st->bind_param('iis',$avaliacao,$uid,$resposta);$st->execute();out(['ok'=>true]);
 }
 out(['erro'=>'Ação inválida'],404);
}catch(mysqli_sql_exception $e){error_log($e->getMessage());if($e->getCode()===1062)out(['erro'=>'E-mail já cadastrado'],409);out(['erro'=>'Erro ao processar solicitação'],500);}
