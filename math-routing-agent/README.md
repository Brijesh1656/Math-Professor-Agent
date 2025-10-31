# 🧮 Math Professor Agent

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Brijesh1656/Math-Professor-Agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> An intelligent AI-powered mathematics tutor that provides step-by-step solutions using advanced RAG (Retrieval-Augmented Generation) technology powered by Google Gemini.

## ✨ Features

- 🤖 **Agentic RAG System**: Intelligently routes queries to a knowledge base or performs web search for accurate, contextual answers
- 🛡️ **Input Guardrails**: Ensures queries are mathematics-related and maintains educational focus
- 📄 **Document Analysis**: Extract mathematical questions directly from uploaded PDF/TXT files
- 🔄 **Human-in-the-Loop Feedback**: Refine and correct answers based on user feedback for continuous improvement
- 🎨 **Modern UI/UX**: Sleek, responsive interface built with React, TypeScript, and Tailwind CSS
- ⚡ **Fast & Efficient**: Built with Vite for lightning-fast development and optimized production builds
- 🌐 **Real-time Web Search**: Leverages Google Search grounding for up-to-date mathematical information

## 🚀 Live Demo

Check out the live application: [Math Professor Agent](https://math-professor-agent-kishi.vercel.app)

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **AI Model**: Google Gemini 2.5 (Flash & Pro)
- **Document Processing**: PDF.js
- **Markdown Rendering**: Marked
- **Deployment**: Vercel

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier available)
- A modern web browser (Chrome, Firefox, Safari, Edge)

## 🏃 Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Brijesh1656/Math-Professor-Agent.git
cd Math-Professor-Agent/math-routing-agent
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Add your Google Gemini API key:

```env
VITE_API_KEY=your_google_gemini_api_key_here
```

> **Note**: You can also enter the API key directly in the application's UI if you prefer not to use environment variables.

### 4. Start the Development Server

```bash
npm run dev
# or
npm start
```

The app will be available at `http://localhost:5173` with hot-reloading enabled.

### 5. Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🌐 Deploying to Vercel

### Quick Deploy

Click the button below to deploy directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Brijesh1656/Math-Professor-Agent)

### Manual Deployment

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Visit [vercel.com](https://vercel.com) and sign in
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel auto-detects the Vite configuration

3. **Configure Environment Variables**:
   - Add `VITE_API_KEY` with your Google Gemini API key
   - Click "Deploy"

4. **Done!** Your app will be live at `https://your-project-name.vercel.app`

### Vercel CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

### Automatic Deployments

Once connected to Vercel:
- ✅ Every push to `main` triggers a production deployment
- ✅ Every pull request creates a preview deployment
- ✅ Automatic HTTPS and global CDN

## 🎯 How to Use

1. **Ask a Math Question**: Type any mathematical question in the chat input
2. **Upload Documents**: Upload PDF or TXT files containing math problems to extract questions automatically
3. **Add to Knowledge Base**: Save important solutions to the knowledge base for quick future reference
4. **Provide Feedback**: Use the feedback feature to refine answers and improve accuracy
5. **View Sources**: Check the sources used to generate answers for verification

## 📁 Project Structure

```
math-routing-agent/
├── src/
│   ├── components/        # React components
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── FileUpload.tsx
│   │   ├── ExtractedQuestions.tsx
│   │   ├── Feedback.tsx
│   │   └── SourcePill.tsx
│   ├── services/          # API and business logic
│   │   └── geminiService.ts
│   ├── hooks/             # Custom React hooks
│   │   └── useKnowledgeBase.ts
│   ├── App.tsx            # Main application component
│   ├── types.ts           # TypeScript type definitions
│   └── index.tsx          # Application entry point
├── public/                # Static assets
├── dist/                  # Production build output
└── package.json           # Dependencies and scripts
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_KEY` | Google Gemini API Key | Optional (can be entered in UI) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Brijesh**
- GitHub: [@Brijesh1656](https://github.com/Brijesh1656)

## 🙏 Acknowledgments

- Powered by [Google Gemini AI](https://deepmind.google/technologies/gemini/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/Brijesh1656/Math-Professor-Agent/issues) on GitHub.

---

<div align="center">
  Made with ❤️ for students struggling with mathematics
</div>

