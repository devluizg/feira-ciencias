# Feira de Projetos: passo a passo

## Ranking e avaliação da comissão

Além do voto do público, esta versão tem um link de avaliação técnica para cada projeto:

- `avaliador.html?projeto=101-1&token=CODIGO_DO_AVALIADOR`
- `avaliador.html?projeto=103-3&token=CODIGO_DO_AVALIADOR`

Cada avaliador recebe o seu próprio `token` no QR Code. Os três critérios são: qualidade científica, criatividade/impacto e comunicação. A classificação em `ranking.html` usa a média dos três critérios; se houver empate, usa a média do público e depois a quantidade de votos públicos.

Para que os votos e o ranking sejam compartilhados por todos os celulares, crie uma planilha Google e abra **Extensões > Apps Script**. Copie o conteúdo de `Code.gs`, informe o ID da planilha em `PLANILHA_ID` e troque os códigos no objeto `AVALIADORES`. Em **Implantar > Nova implantação**, escolha **Aplicativo da Web**, execute como sua conta e permita acesso a qualquer pessoa. Copie a URL criada para `API_URL` em `config.js`. O ranking é consulta pública; as respostas detalhadas permanecem somente na sua planilha.

Depois de publicar no GitHub Pages, gere os QRs individuais, por exemplo:

- `https://SEU-USUARIO.github.io/feira-ciencias/avaliador.html?projeto=101-1&token=AV-ANA-2026`
- `https://SEU-USUARIO.github.io/feira-ciencias/avaliador.html?projeto=103-3&token=AV-ANA-2026`

Repita usando um código diferente para cada pessoa avaliadora. Não compartilhe esses QRs com o público. Enquanto `API_URL` estiver vazia, a página de avaliadores fica propositalmente indisponível e os votos públicos continuam no Google Forms.

## 1. Criar o formulário de votos (Google Forms)
Crie um formulário com 4 perguntas, nesta ordem, todas de "Resposta curta" ou "Parágrafo":
Turma, Nota, Nome, Comentário (o comentário não precisa ser obrigatório).
Depois: menu ⋮ > **Receber link pré-preenchido**, preencha qualquer coisa nas 4 perguntas e clique em "Receber link".
Cole o link em um bloco de notas. Ele terá este formato:

  https://docs.google.com/forms/d/e/ID_DO_FORM/viewform?usp=pp_url&entry.111=...&entry.222=...&entry.333=...&entry.444=...

No arquivo **config.js**:
- FORM_ACTION: troque `viewform?...` por `formResponse` (https://docs.google.com/forms/d/e/ID_DO_FORM/formResponse)
- ENTRY_TURMA, ENTRY_NOTA, ENTRY_NOME, ENTRY_COMENTARIO: os números `entry.xxx` na ordem das perguntas.

Os votos caem na aba **Respostas** do Forms (e em planilha, se você vincular).

## 2. Cadastrar temas e resumos
Edite só o arquivo **projetos.js**.

## 2.1 Banners ilustrados dos projetos

Os prompts prontos para gerar as 13 imagens estão em **PROMPTS-IMAGENS.md**. Gere cada arte em 1600 × 600 px e salve-a na pasta `imagens/` com o nome indicado, por exemplo `imagens/103-2-banner.png`. A página do projeto detecta a imagem e a usa automaticamente no banner superior.

## 3. Publicar no GitHub Pages
Crie um repositório público, envie todos os arquivos desta pasta,
depois Settings > Pages > Branch: main / (root) > Save.
O site fica em https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/

## 4. QR Codes

Abra `compartilhar.html` depois de publicar o site. Ela separa dois materiais:

- **Visitantes e público:** `compartilhar-publico.html`, com um QR de votação por projeto.
- **Comissão avaliadora:** `compartilhar-avaliadores.html`, que pede o código individual do avaliador e monta os QRs técnicos de todos os projetos para aquela pessoa.

Antes disso, confira o endereço em `SITE_URL` no `config.js`.

Um QR por projeto aponta, por exemplo, para
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/projeto.html?id=103-2

Há 13 projetos cadastrados. Os identificadores seguem o formato `TURMA-PROJETO`: `101-1`, `102-1`, `102-2`, `103-1`, `103-2`, `103-3`, `104-1`, `201-1`, `202-1`, `203-1`, `204-1`, `301-1` e `302-1`.
