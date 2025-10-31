# Math Routing Agent

This project is a sophisticated AI agent that acts as a mathematics professor. It uses a RAG (Retrieval-Augmented Generation) pattern, checking a local knowledge base first before performing a web search to provide users with step-by-step solutions to their math problems.

## Features

- **Agentic RAG System**: Intelligently routes queries to a knowledge base or web search.
- **Input Guardrails**: Ensures queries are math-related.
- **PDF/TXT File Analysis**: Extracts mathematical questions directly from uploaded documents.
- **Human-in-the-Loop Feedback**: Allows users to provide feedback to refine and correct answers.
- **Modern UI/UX**: A sleek, responsive, and visually appealing interface built with React.

## Running Locally

This project uses [Vite](https://vitejs.dev/) as a build tool for a fast and modern development experience.

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge).
- [Node.js](https://nodejs.org/) (v18 or newer) which includes `npm`.

### Setup and First Run

1.  **Install Dependencies:**
    Open your terminal in the project's root directory and run:
    ```bash
    npm install
    ```

2.  **Set up Environment Variables:**
    Create a new file named `.env` in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and add your Google Gemini API key. This step is optional, as you can also enter the key directly in the application's UI.

3.  **Start the Development Server:**
    ```bash
    npm start
    ```
    This command will start the Vite development server, typically on `http://localhost:5173`.

4.  **Open the App:**
    Open your web browser and navigate to the URL provided by the command in your terminal. The app will be running with hot-reloading enabled.

## Deploying to Vercel

This project is optimized for deployment on [Vercel](https://vercel.com/).

### Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier available)
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- A Google Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey)

### Deployment Steps

1.  **Push your code to GitHub** (if not already done):
    ```bash
    git add .
    git commit -m "Prepare for Vercel deployment"
    git push origin main
    ```

2.  **Import Project to Vercel:**
    - Go to [vercel.com](https://vercel.com/) and log in
    - Click "Add New" → "Project"
    - Import your GitHub repository
    - Vercel will auto-detect it as a Vite project

3.  **Configure Environment Variables:**
    - In the deployment settings, add your environment variable:
      - Key: `VITE_API_KEY`
      - Value: Your Google Gemini API key
    - Click "Deploy"

4.  **Access Your Deployed App:**
    - Once deployment completes, Vercel will provide a URL
    - Your app will be live at `https://your-project-name.vercel.app`

### Manual Deployment via CLI

Alternatively, you can deploy using the Vercel CLI:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy to Vercel
vercel

# Follow the prompts and add your VITE_API_KEY when asked
```

### Automatic Deployments

Once connected, Vercel will automatically deploy:
- **Production**: Every push to your main branch
- **Preview**: Every pull request creates a preview deployment

