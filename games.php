<?php
header('Content-Type: application/json; charset=utf-8');
$configFile=__DIR__.'/igdb_config.php';
if(!is_file($configFile)){http_response_code(503);echo json_encode(['error'=>'Configure igdb_config.php']);exit;}
$config=require $configFile;
if(empty($config['client_id'])||empty($config['client_secret'])){http_response_code(503);echo json_encode(['error'=>'Credenciais IGDB ausentes']);exit;}
function igdbRequest($url,$body,$headers=[]){$c=curl_init($url);curl_setopt_array($c,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>$body,CURLOPT_HTTPHEADER=>$headers,CURLOPT_TIMEOUT=>15]);$result=curl_exec($c);$code=curl_getinfo($c,CURLINFO_HTTP_CODE);curl_close($c);return [$code,$result];}
$cache=sys_get_temp_dir().'/anigame_igdb_'.hash('sha256',$config['client_id']).'.json';$saved=is_file($cache)?json_decode(file_get_contents($cache),true):null;
if(!$saved||($saved['expires_at']??0)<time()+60){[$status,$auth]=igdbRequest('https://id.twitch.tv/oauth2/token',http_build_query(['client_id'=>$config['client_id'],'client_secret'=>$config['client_secret'],'grant_type'=>'client_credentials']));$token=json_decode($auth?:'',true);if($status!==200||empty($token['access_token'])){http_response_code(502);echo json_encode(['error'=>'Falha na autenticação IGDB']);exit;}$saved=['token'=>$token['access_token'],'expires_at'=>time()+($token['expires_in']??3600)];file_put_contents($cache,json_encode($saved));}
$limit=max(1,min(100,(int)($_GET['limit']??20)));$offset=max(0,(int)($_GET['offset']??0));$sorts=['popular'=>'total_rating_count desc','avaliados'=>'total_rating desc','recentes'=>'first_release_date desc'];$sort=$sorts[$_GET['tipo']??'popular']??$sorts['popular'];
$id=filter_var($_GET['id']??null,FILTER_VALIDATE_INT);
if(isset($_GET['id'])&&(!$id||$id<1)){http_response_code(400);echo json_encode(['error'=>'ID inválido']);exit;}
if($id){$q="fields id,name,summary,storyline,cover.image_id,genres.name,first_release_date,total_rating; where id = $id; limit 1;";}
elseif(trim($_GET['q']??'')!==''){$search=addcslashes(mb_substr(trim($_GET['q']),0,100),'\"');$q='search "'.$search.'"; fields id,name,summary,cover.image_id,genres.name,first_release_date; limit '.$limit.';';}
elseif(trim($_GET['genre']??'')!==''){
 $genre=trim($_GET['genre']);[$status,$raw]=igdbRequest('https://api.igdb.com/v4/genres','fields id,name; limit 100;',['Client-ID: '.$config['client_id'],'Authorization: Bearer '.$saved['token'],'Content-Type: text/plain']);$genres=json_decode($raw?:'[]',true);$found=null;foreach(($genres?:[]) as $g){if(strcasecmp($g['name']??'',$genre)===0){$found=(int)$g['id'];break;}}$q=$found?"fields id,name,cover.image_id; where genres = ($found) & cover != null; sort total_rating_count desc; limit $limit;":"fields id,name; where id = -1; limit 1;";
}else{$q="fields id,name,summary,cover.image_id; where cover != null; sort $sort; limit $limit; offset $offset;";}
[$status,$raw]=igdbRequest('https://api.igdb.com/v4/games',$q,['Client-ID: '.$config['client_id'],'Authorization: Bearer '.$saved['token'],'Content-Type: text/plain']);http_response_code($status>=100&&$status<=599?$status:502);echo $raw?:json_encode(['error'=>'Falha na consulta IGDB']);
