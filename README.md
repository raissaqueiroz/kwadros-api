# Backend do Projeto Kwadros - API REST

Site de vendas de molduras personalizadas com a foto à gosto do cliente com painel administrativo de gestão dos pedidos.

O usuário envia as fotos que deseja ter emolduradas, seleciona o tipo da moldura desejada e efetua o pagamento. O pessoal da administração do Moments Frames consegue visualizar todos os pedidos e os status dele no painel administrativo. Além disso, eles conseguem cadastrar novos usuários para terem acesso a esse painel. Caso alguém esqueça a senha consegue recuperá-la facilmente através do email cadastrado.

## Features

- [x] **Upload de Fotos:** Usuário consegue fazer upload de quantas fotos quiser e removê-las. Ao fazer upload ele tem um preview da foto em miniatura.
- [x] **Pagamento:** Cartão de Crédito via Pagarme e Boleto Bancário via PagHiper.
- [x] **Autenticação** Autenticação e Recuperação de Senha.
- [x] **Crud de Usuários:** Listagem, Criação, Edição e Remoção de Usuários
- [ ] **Listagem de Pedidos:** Listagem de Pedidos Exibindo Fotos e Tipo de Moldura Escolhida.

## Tecnologias Utilizadas

- Criação e Consumo de API's
- Padrões **REST**
- Verbos **HTTPS**
- Status Code
- Endpoints Amigáveis
- Params, Querys e afins
- Upload de Imagens com **Multer**
- Criptografias & Hashs com **Bcrypt**
- Padronização de Cógico com **ESlint**, **Prettier** e **EditorConfig**
- Banco de Dados não Relacional **MongoDB*, utilizando **Mongoose**
- "Travando" Requisições pra API com **CORS**
- Variáveis de Ambiente com **DotEnv**
- Validações com **YUP**
- Testando Requisição pra API com **Insominia**
- Estrutura **MVC**
- **Gitflow** e Commits Semanticos
- Biblioteca de Pagamento **Pagarme** e **PagHiper**

## Preview do Frontend do Projeto

<p align="center">
  <img src="https://github.com/raissaqueiroz/kwadros-webapp/blob/master/screenshots/tela_1.png" width=400 height=200/>
  <img src="https://github.com/raissaqueiroz/kwadros-webapp/blob/master/screenshots/tela_2.png" width=400 height=200/>
</p>

Para ter acesso ao frontend [clique aqui](https://github.com/raissaqueiroz/kwadros-webapp).

## Guia Rápido de Instalação

*1 - Dependências Iniciais*

Antes de qualquer coisa, você precisa ter instaldo o [`NPM & Node`](https://nodejs.org/en/) + [`Git`](https://git-scm.com/). Para Instalar o  siga o passo a passo de cada link listado abaixo:


- [`NPM & Node`](https://nodejs.org/en/)
- [`Git`](https://git-scm.com/)
- [`Yarn`](https://yarnpkg.com/)

*2 - Baixando o Repositório*

Abra o seu terminal e rode os seguintes comandos:

- `git clone https://github.com/raissaqueiroz/kwadros-webapp.git`
- `cd kwadros-webapp`

*3 - Base de Dados e Variáveis de Ambiente*

Será necessário gerar uma string de conexão com o banco. Para tal crie uma conta no atlas (grátis) e gere essa string. Você pode criar sua conta [Clicando aqui](https://www.mongodb.com/cloud/atlas/register).

OBS.: Caso tenha duvidas, você pode seguir [este tutorial aqui](https://medium.com/reprogramabr/conectando-no-banco-de-dados-cloud-mongodb-atlas-bca63399693f)

Tendo gerado a string, procure pelo arquivo .env.example e siga o passo a passo abaixo:

- colo a string no lugar indicado dentro do arquivo. Deverá ficar algo como `MONGO_URL=string-que-vc-criou`
- renomeie o arquivo para .env

Além disso, você vai precisar de uma conta na Pagarme e na PagHiper para gerar chaves privadas pra serem adicionadas nesse arquivo `.env`:

- [Clique aqui pra acessar o site da Pagarme](https://pagar.me/)
- [Clique aqui pra acessar o site da PagHiper](https://www.paghiper.com/)

Ao ter sua conta certinha nos serviços supracitados busque pelas credenciais necessárias citadas no arquivo `.env` que você renomeu localizado na raiz desse projeto e atualize os valores das credenciais contidas nele para as que você obteve no painel da PagHiper e da Pagarme.

*4 - Rodando o Projeto*

Ainda no seu terminal, rode os comandos abaixo:

- `yarn`
- `yarn start` or `yarn dev`

Pronto! a API estará rodando na porta 3333. Caso você deseje alterar para outra porta, basta adicionar ao aquivo .env do projeto como no exemplo a seguir: `PORT=3333`.
