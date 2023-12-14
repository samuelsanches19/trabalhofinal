import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';
import session from 'express-session';

const PORT = 3000;
const HOST = "0.0.0.0";

const app = express();
app.use(cookieParser());

var usuarios = []; 
var mensagens = [];

app.use(session({
    secret: "secreta",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "paginas")));

function Autenticado(request, response, next) {
    if (request.session.Autenticado) {
        next();
    } else {
        response.redirect("/telaLogin.html");
    }
}

app.post('/registrodeusuario', (requisicao, resposta) => {
    if(!(requisicao.body.nome && requisicao.body.idade && requisicao.body.email)){

    var conteudoResposta = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Formulário de Cadastro</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            form {
                max-width: 400px;
                margin: 0 auto;
            }
            label {
                display: block;
                margin-bottom: 8px;
            }
            input {
                width: 100%;
                padding: 8px;
                margin-bottom: 16px;
                box-sizing: border-box;
            }
            input[type="submit"] {
                background-color: #007BFF; 
                color: white;
                cursor: pointer;
            }
            input[type="submit"]:hover {
                background-color: #0056b3; 
            }
        </style>
    </head>
    <body>
    
        <form action="/registrodeusuario" method="post">
            <label for="nome">Nome:</label>
            
                    <input type="text" id="nome" name="nome" value="${requisicao.body.nome}">
    `;

    if (!requisicao.body.nome) {
        conteudoResposta += `
                    <p>Caracteres invalidos. Tente novamente!</p>
        `;
    }

    if (!requisicao.body.idade) {
        conteudoResposta += `
                    <label for="idade">Idade:</label>
                    <input type="number" id="idade" name="idade" value="${requisicao.body.idade}">
                    <p>Invalido!.</p>
                
    `;
    }
    else {
        conteudoResposta+=` <label for="idade">Idade:</label>
        <input type="number" id="idade" name="idade" value="${requisicao.body.idade}">
        `
    }

    if (!requisicao.body.email) {
        conteudoResposta += `
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${requisicao.body.email}">
                    <p>Email invalido!</p>
        `;
    }
     else {
        conteudoResposta +=`<label for="email">Email:</label>
        <input type="email" id="email" name="email" value="${requisicao.body.email}">`}
        conteudoResposta += `
                   
                    <button type="submit">Confirmar cadastro</button>
                </form>
                <ul><!-- LISTA --></ul>
            </div>
        </body>
        </html>
    `;
    
    resposta.end(conteudoResposta);
}

    else {
        const user = {
            name: requisicao.body.nome,
            email: requisicao.body.email,
            idade: requisicao.body.idade
        };

        usuarios.push(user);
        console.log(user);
        let conteudoResposta = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User List</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f8f8f8;
                    margin: 0;
                    padding: 0;
                    text-align: center;
                }
        
                h1 {
                    color: #333;
                }
        
                table {
                    width: 80%;
                    margin: 20px auto;
                    background-color: #fff;
                    border-collapse: collapse;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                th, td {
                    padding: 12px;
                    text-align: left;
                    border: 1px solid #ddd;
                }
        
                th {
                    background-color: #007BFF; 
                    color: white;
                }
        
                tbody tr:hover {
                    background-color: #f2f2f2; 
                }
            </style>
        </head>
        <body>
            <h1>Usuários registrados!</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Idade</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>`;
    
        for (const user of usuarios) {
            conteudoResposta += `
                <tr style="border: 1px solid #ddd;">
                    <td style="padding: 12px;">${user.name}</td>
                    <td style="padding: 12px;">${user.idade}</td>
                    <td style="padding: 12px;">${user.email}</td>
                </tr>`;
        }
    
        conteudoResposta += `
                    </tbody>
                </table>
                <div style="margin-top: 20px;">
                    <a href="/" style="text-decoration: none; padding: 10px 20px; background-color: #4CAF50; color: white;">Voltar ao menu inicial</a>
                    <a href="/cadastrarusuarios.html" style="text-decoration: none; padding: 10px 20px; background-color: #008CBA; color: white; ">Continuar registrando</a>
                </div>
            </body>
            </html>`;
    
    
        resposta.end(conteudoResposta);
}});

app.post('/login', (request, response) => {
    const login = request.body.login;
    const senha = request.body.senha;

    if (login === 'admin' && senha === 'abcd') {
        request.session.Autenticado = true;
        response.redirect('/');
    } else {
        let erroLogin = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ERRO!</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 20px;
                    background-color: #f4f4f4;
                    text-align: center;
                }
        
                .container {
                    max-width: 400px;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                h3 {
                    color: #d9534f;
                }
        
                a {
                    color: #007BFF;
                    text-decoration: none;
                }
        
                a:hover {
                    color: #0056b3;
                }
        
                input {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 15px;
                    box-sizing: border-box;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
        
                input[type="submit"] {
                    background-color: #007BFF;
                    color: white;
                    cursor: pointer;
                }
        
                input[type="submit"]:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h3>Usuário ou senha inválida!</h3>
                <a href="/telaLogin.html">Voltar para a página de login</a>
            </div>
        </body>
        </html
        `;
        response.end(erroLogin);
    }
});


app.get(`/`, Autenticado, (requisicao, resposta) => {
    const UltimoAcesso = requisicao.cookies.UltimoAcesso || "Nunca visitado";
    const data = new Date();
    resposta.cookie("UltimoAcesso", data.toLocaleString(), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    });
    resposta.send(` <style>
    body {
        font-family: Arial;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
        display: flex;
       
        
        
        
    }

    h1 {
        
        color: black;
    }

    a {
        color: red;
        
    }

    a:hover {
        text-decoration: underline;
    }

    

    
 </style>
    <h1><a href="/cadastrarusuarios.html">Registrar<></a><br>
    </h1><br><h1><a href="/batepapo">Bate-Papo</a><br></h1>
    <br><h2>---Ultima vez ${UltimoAcesso}</h2>`);

});

app.listen(PORT, HOST, () => {
    console.log(`Rodando em ${HOST}:${PORT}`);
});

app.get('/batepapo', Autenticado, (requisicao, resposta) => {
    let conteudoResposta = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bate-Papo</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            #chat-container {
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid #ccc;
                padding: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            select, textarea, button {
                margin-bottom: 10px;
                width: 100%; 
                box-sizing: border-box;
            }
            #chat-messages {
                max-height: 200px;
                overflow-y: auto;
                width: 100%;
                border: 1px solid #ccc;
                padding: 10px;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
    
        <div id="container">
        <form action="/mensagemChat" method="POST">
            <label for="users">Selecione o usuário:</label>
            <select name="usuario" id="users">`;
            for(let usuario of usuarios){
                conteudoResposta+=`
                  <option value="${usuario.name}">${usuario.name}</option>`;
                }
                conteudoResposta+=` </select>

                <div id="mensagens"></div>
        
                <label for="mensagem1">Digite sua mensagem:</label>
                <input type="text" id="mensagemtexto" name="mensagemtexto" placeholder="Digite sua mensagem">
                <button type="submit">Enviar Mensagem</button>
                </form>
            </div>`

  for (const mensagem of mensagens) {
      conteudoResposta += `
      <div class="containerS">
          <p>${mensagem.usuario}</p>
          <p class="data">${mensagem.data}</p>
          <p class="mensagem">${mensagem.caracteres}</p>
      </div>
      <hr class="hr">`;
  }

  conteudoResposta += `
  </body>
  </html>`;
    
   

  resposta.send(conteudoResposta);
});

app.post('/mensagemChat', Autenticado, (requisicao, resposta) => {
  const usuario = requisicao.body.usuario; 
  const mensagemUsuario = requisicao.body.mensagemtexto; 

  if (usuario && mensagemUsuario) {
      const data = new Date().toLocaleString();

      const mensagemtxt = {
          usuario: usuario, 
          caracteres: mensagemUsuario,
          data: data,
      };

      mensagens.push(mensagemtxt);
      console.log(mensagens)

      resposta.redirect('/batepapo');
  } else {
      resposta.end(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Erro</title>
          <style>
              body {
                  font-family: 'Helvetica', sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
              }
      
              h1 {
                  color: #ff0000;
                  text-align: center;
                  font-family: 'Verdana', sans-serif;
                  margin-bottom: 20px;
              }
      
              a {
                  font-family: 'Verdana', sans-serif;
                  text-decoration: none;
                  color: #4169E1;
                  padding: 10px 20px;
                  border: 2px solid #4169E1;
                  border-radius: 5px;
                  transition: background-color 0.3s, color 0.3s;
              }
      
              a:hover {
                  background-color: #4169E1;
                  color: #fff;
              }
          </style>
      </head>
      <body>
          <h1>Mensagem inválida</h1>
          <div>
              <a href="/batepapo">Voltar</a>
          </div>
      </body>
      </html>
      `);
  }
});