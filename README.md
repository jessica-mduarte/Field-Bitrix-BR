# Field-Bitrix-BR
Esse projeto oferece uma sincronização automatizada entre o Bitrix24 e Field Control, buscando otimizar o workflow automaticamente movendo cards de negócios do CRM para a próxima etapa quando sua Ordem de Serviço correspondente é marcada como concluída na plataforma do Field.

## 🚀 Features
- **Rastreamento de status automático:** Realiza checks diários dentro do Field Control para buscar Ordens de Serviço que já foram concluídas.
- **Verificação de OS:** Mapeia identificadores a partir do ID da OS cadastrado no Bitrix, e busca a Task ID dentro do Field qual contém a informação necessária para determinar se uma Ordem de Serviço foi concluída ou não.
- **Docker App:** Projeto "contêinerizado" com docker para facilitar o deployment em outras plataformas. 

## 📦 Tech Stack
- **Node.js:** Ambiente principal de execução.
- **Fetch API:** Para executar a comunicação com as bibliotecas API do Bitrix e Field Control.
- **Docker:** Para facilitar o setup e deployment do ambiente.

## 📝 Como funciona
1. O script busca cards de negócios que estão ativos em uma pipeline e etapa específicos dentro do CRM do Bitrix.
   
2. Extrai o identificador da Ordem de Serviço de um campo personalizado do Bitrix. No caso deste código, é  UF_CRM_1775677796, mas você pode mudar e adequar para seu projeto.
   
3. Consulta a API do Field em duas etapas. Essas duas etapas são necessárias pois a API do Field não retorna o status de conclusão da Ordem de Serviço se usarmos apenas o identificador da OS. Para obter essa informação, precisamos do Task ID(e esse é um campo que o identificador da OS *pode* nos retornar), que contém o campo "status".
 
     -***Primeira Etapa***: Encontramos o Task ID ao usar o identificador(o ID da Ordem de Serviço que pegamos do Bitrix).
   
     -***Segunda Etapa***: Nós procuramos no endpoint /tasks pelo "status":"done"

4. Se a Task está marcada como "done", o card do negócio é automaticamente movido para o estágio alvo dentro do Bitrix24.

## ⚙️ Setup
1. Clone o repositório.
2. Rode `npm install`.
3. Crie um arquivo `.env` usando de referência o `.env.example`.
4. Mude as variáveis do arquivo .env para correlacionar com as informações verdadeiras do seu Bitrix.
5. Roda o projeto usando `node index.js` ou `docker-compose up`.



## 👑 Contato

Desenvolvido por **Jessica Duarte**.

Se você tem quaisquer dúvidas ou gostaria de contribuir para o projeto, meu e-mail é jessicamirandaduarte@gmail.com

---

*Made with node.js*

