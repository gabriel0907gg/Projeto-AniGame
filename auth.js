let sessao={logado:false,csrf:null};
async function atualizarSessao(){try{sessao=await(await fetch('api.php?acao=sessao',{credentials:'same-origin'})).json();document.querySelectorAll('[data-auth-link]').forEach(el=>{el.textContent=sessao.logado?`Olá, ${sessao.nome}`:'Login';el.href=sessao.logado?'settings.html':'Login.html';});}catch(e){console.error(e);}return sessao;}
async function enviarApi(acao,campos={}){const fd=new FormData();Object.entries(campos).forEach(([k,v])=>fd.append(k,v));const r=await fetch(`api.php?acao=${acao}`,{method:'POST',headers:{'X-CSRF-Token':sessao.csrf||''},body:fd});const j=await r.json();if(!r.ok)throw Error(j.erro||'Erro');return j;}
const sessaoPronta=atualizarSessao();
