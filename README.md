# RAG (Retrieval-Augmented Generation)

**RAG**, sigla para *Retrieval-Augmented Generation* (Geração Aumentada por Recuperação), é uma arquitetura de inteligência artificial que aprimora o desempenho de Modelos de Linguagem Grandes (LLMs) ao conectá-los a uma base de conhecimento externa.

Em vez de depender apenas das informações com as quais foi treinado, um sistema RAG primeiro recupera dados relevantes de uma fonte externa (como documentos, bancos de dados ou APIs) em resposta a uma consulta do usuário. Em seguida, ele fornece esses dados recuperados como contexto para o LLM, que os utiliza para gerar uma resposta mais precisa, atualizada e contextualizada.

### Para que pode ser útil?

1.  **Reduzir Alucinações**: Ao basear as respostas em informações factuais e recuperadas, o RAG diminui significativamente a tendência dos LLMs de "inventar" fatos ou fornecer informações incorretas.
2.  **Utilizar Dados Privados ou Atuais**: Permite que os LLMs respondam a perguntas sobre informações proprietárias, de domínio específico ou muito recentes, que não estavam presentes em seus dados de treinamento originais.
3.  **Aumentar a Transparência e a Confiança**: Como o sistema recupera informações de fontes específicas, ele pode citar suas fontes, permitindo que os usuários verifiquem a procedência das respostas.
4.  **Custo-Benefício**: Atualizar uma base de conhecimento externa é muito mais barato e rápido do que treinar ou fazer o ajuste fino (fine-tuning) de um LLM inteiro para incorporar novas informações.
5.  **Aplicações Práticas**: É ideal para a criação de:
  *   **Chatbots de Suporte ao Cliente**: Que respondem com base em manuais de produtos e políticas da empresa.
  *   **Assistentes de Pesquisa Interna**: Que ajudam funcionários a encontrar informações em documentações e bases de conhecimento corporativas.
  *   **Sistemas de Perguntas e Respostas**: Que fornecem respostas precisas sobre um corpo de texto complexo, como documentos legais ou artigos científicos.

### O que esta aplicação resolve?

Esta é uma API de exemplo que implementa um sistema RAG simples. Ela permite que você:

1.  **Faça upload de documentos**: Envie arquivos (atualmente PDFs) para serem processados, divididos em pedaços (chunks), transformados em vetores (embeddings) e armazenados em um banco de dados vetorial (Qdrant).
2.  **Faça perguntas sobre os documentos**: Envie uma consulta para a API, que irá buscar os trechos mais relevantes dos documentos armazenados e usá-los como contexto para que um LLM (como o GPT da OpenAI) gere uma resposta coesa e baseada nos seus dados.

### Como utilizar a aplicação

Siga os passos abaixo para configurar e executar o projeto.

#### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 20 ou superior)
*   [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
*   Um editor de código, como o [VS Code](https://code.visualstudio.com/)

#### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd rag
```

#### 2. Instalar as dependências

Instale as dependências do projeto Node.js:

```bash
npm install
```

#### 3. Configurar as variáveis de ambiente

Crie um arquivo chamado `.env` na raiz do projeto, copiando o conteúdo de `.env.example` (se houver) ou usando o modelo abaixo:

```env
# Configurações do Servidor
SERVER_PORT=3333

# Configurações do Qdrant (banco de dados vetorial)
QDRANT_HOST=http://localhost
QDRANT_PORT=6333
QDRANT_COLLECTION_NAME=documentos

# Configurações da OpenAI
OPENAI_API_KEY=SUA_CHAVE_DE_API_AQUI
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-3.5-turbo

# Configurações de Upload
UPLOADS_DIR=./uploads
```

**Importante**: Substitua `SUA_CHAVE_DE_API_AQUI` pela sua chave de API da OpenAI.

#### 4. Iniciar os serviços

Para executar a aplicação, você precisa iniciar o banco de dados vetorial Qdrant e o servidor da API.

Primeiro, inicie o Qdrant com o Docker Compose:

```bash
docker-compose up -d
```

Em seguida, inicie o servidor da API em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333` (ou na porta que você definiu no arquivo `.env`).

#### 5. Endpoints da API

A API possui dois endpoints principais:

*   **`POST /document`**: Para fazer upload de um arquivo PDF.
*   **`POST /query`**: Para fazer uma pergunta e obter uma resposta baseada nos documentos.

Você pode usar ferramentas como o [Insomnia](https://insomnia.rest/), [Postman](https://www.postman.com/) ou `curl` para interagir com a API.


