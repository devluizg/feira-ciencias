# Feira de Projetos: passo a passo

## Sistema de votos e ranking

Os votos do público e as avaliações dos jurados são gravados em uma planilha Google. O site confirma a gravação antes de informar que o envio foi concluído.

Cada jurado recebe um único QR privado para `painel-avaliador.html`. O painel lista os 13 projetos, mostra o progresso e impede uma segunda avaliação do mesmo projeto. Os critérios oficiais são domínio dos conceitos, clareza da explicação e uso de material reciclado, com notas de 3,0 a 5,0.

A classificação usa a média técnica dos jurados. Em empate, usa a média do público e, depois, a quantidade de votos públicos. O painel `admin.html` apresenta a classificação provisória, contagens e pendências. As respostas completas permanecem na planilha.

## Configuração obrigatória da planilha

1. Crie uma planilha Google vazia e copie o identificador localizado entre `/d/` e `/edit` na URL.
2. Na planilha, abra **Extensões > Apps Script** e substitua o conteúdo pelo arquivo `Code.gs`.
3. No Apps Script, informe o identificador em `PLANILHA_ID`.
4. Troque os códigos de exemplo no objeto `AVALIADORES` somente na cópia do Apps Script. Não publique códigos reais no GitHub.
5. Em **Configurações do projeto > Propriedades do script**, crie a propriedade `ADMIN_KEY` com uma senha forte para o painel da organização.
6. Em **Implantar > Nova implantação**, escolha **Aplicativo da Web**, execute como sua conta e permita acesso a qualquer pessoa.
7. Copie a URL terminada em `/exec` para `API_URL` em `config.js` e envie a alteração ao GitHub.
8. Faça um voto público e uma avaliação técnica de teste. Confirme as abas `Votos públicos` e `Avaliações` na planilha e depois apague as linhas de teste.

O ranking público começa fechado. Para divulgá-lo, altere `PUBLICAR_RANKING` para `true` no Apps Script e crie uma nova versão da implantação. O painel administrativo funciona mesmo com o ranking público fechado.

## 1. Alternativa temporária com Google Forms

Esta alternativa registra somente o voto público e não alimenta o ranking consolidado. Para a feira, use preferencialmente o Apps Script descrito acima.
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
- **Comissão avaliadora:** `compartilhar-avaliadores.html`, que pede o código individual e monta um cartão com um único QR para o painel daquele jurado.
- **Organização:** `admin.html`, protegido pela propriedade `ADMIN_KEY`, com votos, médias e pendências.

Antes disso, confira o endereço em `SITE_URL` no `config.js`.

Um QR por projeto aponta, por exemplo, para
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/projeto.html?id=103-2

Há 13 projetos cadastrados. Os identificadores seguem o formato `TURMA-PROJETO`: `101-1`, `102-1`, `102-2`, `103-1`, `103-2`, `103-3`, `104-1`, `201-1`, `202-1`, `203-1`, `204-1`, `301-1` e `302-1`.
