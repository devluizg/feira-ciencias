# Plano operacional de avaliação da Feira de Ciências

## Decisão principal

Cada jurado receberá um único QR Code privado e individual. Esse QR abrirá um painel com os 13 projetos. O jurado selecionará o projeto que está visitando, registrará a avaliação e voltará ao painel, onde o projeto aparecerá como concluído.

Os QR Codes expostos nos estandes continuarão sendo exclusivos do público geral. Não serão usados pelos jurados. Essa separação reduz erros, evita que o voto técnico seja confundido com a votação por estrelas e permite saber quantas avaliações ainda faltam.

## Critérios oficiais

O formulário técnico seguirá o Guia Oficial de Orientação para Jurados:

1. **Domínio dos conceitos:** conhecimento técnico e científico e integração de conceitos matemáticos, físicos, químicos ou biológicos.
2. **Clareza da explicação:** comunicação, postura da equipe e capacidade de síntese.
3. **Uso de material reciclado:** quantidade e criatividade no uso de sucatas e materiais reutilizados no estande e nos protótipos.

Para respeitar o intervalo oficial de 3,0 a 5,0 e diminuir empates, cada critério terá as opções 3,0; 3,5; 4,0; 4,5; e 5,0. A nota técnica de uma avaliação será a média dos três critérios.

O formulário também terá uma verificação da ficha técnica do estande, sem alterar automaticamente a nota. O jurado confirmará se encontrou: nome do projeto, turma e orientadores, conceito integrado, materiais reutilizados e impacto ambiental. Ausências poderão ser registradas na observação.

## Preparação antes da feira

### 1. Preparar vagas de jurados sem esperar os nomes

Devem ser criados antecipadamente oito códigos, por exemplo `JURADO-01` até `JURADO-08`. Cada código será único. No dia da feira, a organização anota numa folha qual pessoa recebeu cada número. Assim, o sistema funcionará com três, cinco ou até oito jurados sem nova publicação.

Os códigos usados no endereço final devem incluir uma parte aleatória para evitar descoberta, por exemplo `J01-MATA-8472`. O nome do jurado pode ser atualizado na planilha depois da confirmação, sem mudar o QR já impresso.

### 2. Publicar o sistema de dados

O arquivo `Code.gs` precisa ser instalado em uma planilha Google e publicado como Aplicativo da Web. A URL publicada deve ser inserida em `API_URL` no `config.js`. Hoje esses dois campos ainda estão vazios e, enquanto isso, avaliações e ranking não são gravados.

### 3. Gerar e imprimir os materiais

Serão impressos dois conjuntos diferentes:

- **Estandes:** um QR público por projeto, apontando para a página de estrelas.
- **Jurados:** um cartão por jurado, contendo o nome ou número da vaga e um único QR privado para o painel técnico.

O cartão do jurado deve trazer uma instrução curta: “Leia uma vez, escolha o projeto visitado, avalie os três critérios e confirme o envio”. Não é necessário imprimir 13 QRs para cada jurado.

### 4. Fazer um teste completo

Antes da feira, uma pessoa deve simular um jurado no celular:

1. Abrir o QR privado.
2. Avaliar dois projetos.
3. Confirmar que os projetos aparecem como concluídos.
4. Conferir as duas linhas na planilha.
5. Tentar avaliar novamente o mesmo projeto e confirmar o bloqueio.
6. Abrir o ranking e conferir o cálculo.

Depois do teste, as linhas de teste devem ser removidas da planilha.

## Fluxo no dia da feira

### Recepção dos jurados

1. A organização confirma quantos jurados chegaram.
2. Cada pessoa recebe um cartão numerado com seu QR individual.
3. A organização registra a correspondência entre número e nome.
4. Todos fazem uma abertura rápida do painel ainda na recepção.

### Avaliação de cada projeto

1. O jurado visita o estande e permite a apresentação e a demonstração prática.
2. Confere a ficha técnica obrigatória.
3. Faz perguntas sobre a conexão entre matemática, ciência, tecnologia e sustentabilidade.
4. No painel do celular, toca no projeto correspondente.
5. Dá uma nota de 3,0 a 5,0 em cada critério e registra uma observação, se necessário.
6. Envia a avaliação e retorna ao painel.
7. O painel marca o projeto como concluído e mostra quantos ainda faltam.

Cada jurado deve avaliar todos os 13 projetos. A organização não precisa acompanhar a pessoa o tempo inteiro; basta monitorar a planilha ou o painel de controle para verificar pendências.

## Fechamento e ranking

Antes de divulgar o resultado, a organização deve conferir se cada projeto recebeu o mesmo número de avaliações técnicas. Se cinco jurados participaram, cada projeto precisa ter cinco avaliações.

A classificação será calculada assim:

1. Média das notas técnicas dos jurados.
2. Em empate na média técnica, maior média do público.
3. Persistindo o empate, maior quantidade de votos do público.

As notas do público não substituem a comissão: servem somente como desempate.

## Plano de contingência

Devem existir fichas impressas de reserva com os 13 projetos e os três critérios. Se a internet falhar, cada jurado anota as notas no papel, e a organização lança os dados depois usando o código daquele jurado.

Também é recomendável manter um celular da organização com internet móvel para testar a plataforma durante o evento. O site pode abrir pelo Wi-Fi ou pelos dados móveis, mas o envio da nota precisa de conexão.

## Mudanças necessárias no sistema antes da feira

1. Substituir os critérios provisórios pelos critérios oficiais do guia.
2. Alterar a escala para 3,0; 3,5; 4,0; 4,5; e 5,0.
3. Adicionar a conferência da ficha técnica do estande.
4. Criar o painel do jurado com os 13 projetos, progresso e retorno após cada envio.
5. Criar de seis a oito códigos genéricos de jurado.
6. Publicar e configurar o Google Apps Script e a planilha.
7. Criar uma visão de controle para a organização acompanhar avaliações faltantes.
8. Testar celular, duplicidade, planilha e ranking antes de imprimir os QRs definitivos.

## Prioridade de execução

O caminho crítico é: planilha e Apps Script, critérios oficiais, painel do jurado, teste completo e impressão. Ajustes estéticos adicionais devem acontecer somente depois que esse fluxo estiver gravando e calculando corretamente.
