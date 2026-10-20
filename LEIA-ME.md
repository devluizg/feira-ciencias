# Feira de Projetos: passo a passo

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

## 3. Publicar no GitHub Pages
Crie um repositório público, envie todos os arquivos desta pasta,
depois Settings > Pages > Branch: main / (root) > Save.
O site fica em https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/

## 4. QR Codes
Um QR por turma, apontando para
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/turma-1.html (… até turma-8.html)
