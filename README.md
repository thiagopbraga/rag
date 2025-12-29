# RAG (Retrieval-Augmented Generation)

**RAG**, short for *Retrieval-Augmented Generation*, is an artificial intelligence architecture that enhances the performance of Large Language Models (LLMs) by connecting them to an external knowledge base.

Instead of relying solely on the information it was trained on, a RAG system first retrieves relevant data from an external source (such as documents, databases, or APIs) in response to a user query. It then provides this retrieved data as context to the LLM, which uses it to generate a more accurate, up-to-date, and contextualized response.

### What is it useful for?

1. **Reducing Hallucinations**: By grounding responses in factual, retrieved information, RAG significantly reduces the tendency of LLMs to “make up” facts or provide incorrect information.
2. **Using Private or Up-to-Date Data**: It allows LLMs to answer questions about proprietary, domain-specific, or very recent information that was not included in their original training data.
3. **Increasing Transparency and Trust**: Since the system retrieves information from specific sources, it can cite its sources, allowing users to verify the origin of the answers.
4. **Cost-Effective**: Updating an external knowledge base is much cheaper and faster than training or fine-tuning an entire LLM to incorporate new information.
5. **Practical Applications**: It is ideal for building:

   * **Customer Support Chatbots**: That respond based on product manuals and company policies.
   * **Internal Research Assistants**: That help employees find information in documentation and corporate knowledge bases.
   * **Question-and-Answer Systems**: That provide accurate answers over complex text corpora, such as legal documents or scientific articles.

### What does this application solve?

This is a sample API that implements a simple RAG system. It allows you to:

1. **Upload documents**: Send files (currently PDFs) to be processed, split into chunks, transformed into vectors (embeddings), and stored in a vector database (Qdrant).
2. **Ask questions about the documents**: Send a query to the API, which will search for the most relevant document excerpts and use them as context for an LLM (such as OpenAI’s GPT) to generate a coherent, data-grounded answer.

### How to use the application

Follow the steps below to set up and run the project.

#### Prerequisites

* [Node.js](https://nodejs.org/) (version 20 or higher)
* [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
* A code editor, such as [VS Code](https://code.visualstudio.com/)

#### 1. Clone the repository

```bash
git clone <REPOSITORY_URL>
cd rag
```

#### 2. Install dependencies

Install the Node.js project dependencies:

```bash
npm install
```

#### 3. Configure environment variables

Create a file named `.env` at the root of the project, copying the contents of `.env.example` (if available) or using the template below:

```env
# Server Settings
SERVER_PORT=3333

# Qdrant Settings (vector database)
QDRANT_HOST=http://localhost
QDRANT_PORT=6333
QDRANT_COLLECTION_NAME=documents

# OpenAI Settings
OPENAI_API_KEY=YOUR_API_KEY_HERE
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-3.5-turbo

# Upload Settings
UPLOADS_DIR=./uploads
```

**Important**: Replace `YOUR_API_KEY_HERE` with your OpenAI API key.

#### 4. Start the services

To run the application, you need to start the Qdrant vector database and the API server.

First, start Qdrant using Docker Compose:

```bash
docker-compose up -d
```

Then, start the API server in development mode:

```bash
npm run dev
```

The server will be available at `http://localhost:3333` (or on the port you defined in the `.env` file).

#### 5. API Endpoints

The API has two main endpoints:

* **`POST /document`**: Upload a PDF file.
* **`POST /query`**: Ask a question and receive an answer based on the uploaded documents.

You can use tools such as [Insomnia](https://insomnia.rest/), [Postman](https://www.postman.com/), or `curl` to interact with the API.
