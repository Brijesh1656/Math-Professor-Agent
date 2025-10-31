# 🧮 Math Professor AI - Intelligent Mathematics Tutor

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Brijesh1656/Math-Professor-Agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.12-646CFF.svg)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%202.5-4285F4.svg)](https://deepmind.google/technologies/gemini/)

**An AI-powered mathematics professor that provides step-by-step solutions using advanced RAG architecture and Google Gemini AI**

[Live Demo](https://math-professor-agent-k6h4.vercel.app) · [Report Bug](https://github.com/Brijesh1656/Math-Professor-Agent/issues) · [Request Feature](https://github.com/Brijesh1656/Math-Professor-Agent/issues)

![Math Professor AI Demo](https://via.placeholder.com/800x400/0a0f1e/60a5fa?text=Math+Professor+AI+Screenshot)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Demo & Screenshots](#-demo--screenshots)
- [Technology Stack](#️-technology-stack)
- [Architecture & Design](#-architecture--design)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Math Professor AI** is a sophisticated web application that acts as your personal mathematics tutor. Built with cutting-edge AI technology, it leverages **Google Gemini 2.5** models to provide detailed, step-by-step solutions to mathematical problems. The application implements an **Agentic RAG (Retrieval-Augmented Generation)** pattern, intelligently routing queries between a local knowledge base and real-time web search to deliver the most accurate and relevant answers.

### 🎯 Project Goals

- Provide instant, accurate mathematical solutions with detailed explanations
- Make mathematics education accessible to everyone
- Implement advanced AI patterns (RAG, Guardrails, Human-in-the-Loop)
- Deliver a modern, intuitive user experience
- Support document analysis for batch question processing

---

## ✨ Key Features

### 🤖 **AI-Powered Intelligence**

#### **Agentic RAG System**
- **Smart Routing**: Automatically determines whether to use the local knowledge base or perform a web search
- **Knowledge Base**: Store and retrieve previously answered questions for instant responses
- **Web Search Grounding**: Leverages Google Search for up-to-date information with source citations
- **Context-Aware**: Understands mathematical context and provides relevant solutions

#### **Input Guardrails**
- **Math Validation**: Ensures all queries are mathematics-related before processing
- **Safety Filters**: Prevents misuse and maintains educational focus
- **Graceful Fallback**: Politely redirects non-math queries

### 📄 **Document Processing**

- **PDF Support**: Upload and analyze PDF documents containing mathematical problems
- **Text File Support**: Process TXT files with question extraction
- **Automatic Question Detection**: AI identifies and extracts mathematical questions from documents
- **Batch Processing**: Handle multiple questions from a single upload

### 🔄 **Human-in-the-Loop Feedback**

- **Answer Refinement**: Users can provide feedback to improve answers
- **Thumbs Up/Down**: Quick feedback mechanism for answer quality
- **Custom Feedback**: Detailed feedback for answer corrections
- **Iterative Improvement**: System learns from user corrections

### 🎨 **Modern User Interface**

- **Glassmorphism Design**: Beautiful frosted glass effects with blur
- **Animated Backgrounds**: Dynamic gradient backgrounds with floating orbs
- **Smooth Animations**: 60fps animations for all interactions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes with a modern dark color scheme
- **Gradient Accents**: Blue, purple, and cyan gradients throughout

### 🛡️ **Robust Error Handling**

- **Automatic Retry Logic**: Exponential backoff for transient failures
- **User-Friendly Messages**: Clear error messages with actionable advice
- **Graceful Degradation**: System continues to function even with partial failures
- **Rate Limit Handling**: Smart handling of API rate limits

---

## 🎬 Demo & Screenshots

### Live Application
🔗 **[Try it now!](https://math-professor-agent-kishi.vercel.app)**

### Key Screens

#### 1. **Home Screen**
- Beautiful landing page with example questions
- Feature highlights
- Easy-to-use interface

#### 2. **Chat Interface**
- Real-time question answering
- Step-by-step solutions
- Source citations
- Feedback mechanism

#### 3. **Document Upload**
- Drag-and-drop file upload
- Question extraction
- One-click question selection

---

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 18.3.1** - Modern UI library with Hooks
- **TypeScript 5.2.2** - Type-safe JavaScript
- **Vite 7.1.12** - Lightning-fast build tool

### **Styling & UI**
- **Tailwind CSS 3.4.4** - Utility-first CSS framework
- **Custom Animations** - Smooth CSS animations
- **Glassmorphism** - Modern frosted glass effects

### **AI & APIs**
- **Google Gemini 2.5 Pro** - Advanced reasoning and solutions
- **Google Gemini 2.5 Flash** - Fast guardrail checks and extraction
- **Google Search Grounding** - Real-time web search integration

### **Document Processing**
- **PDF.js 4.5.136** - PDF parsing and text extraction
- **Marked 16.4.1** - Markdown rendering for formatted answers

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🏗️ Architecture & Design

### **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  (React + TypeScript + Tailwind CSS + Glassmorphism)       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐       │
│  │  Chat Input │  │ File Upload │  │   Feedback   │       │
│  └─────────────┘  └─────────────┘  └──────────────┘       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Gemini Service (geminiService.ts)         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │ Guardrails   │  │ RAG Router   │  │  Refinement│ │  │
│  │  │   Check      │  │   Logic      │  │   Engine   │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  │  ┌──────────────────────────────────────────────────┐ │
│  │  │           Retry Logic with Backoff               │ │
│  │  └──────────────────────────────────────────────────┘ │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────────┐  │
│  │ Google Gemini │  │ Google Search │  │ PDF.js Parser  │  │
│  │   2.5 Pro     │  │   Grounding   │  │                │  │
│  └───────────────┘  └───────────────┘  └────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### **Data Flow**

1. **User Input** → Chat interface or file upload
2. **Guardrail Check** → Validate mathematical relevance
3. **RAG Routing** → Check knowledge base first
4. **AI Processing** → Generate solution with Gemini
5. **Source Grounding** → Attach web sources if applicable
6. **Response Display** → Show formatted answer with sources
7. **Feedback Loop** → Collect user feedback for refinement

### **Key Design Patterns**

#### **1. Agentic RAG (Retrieval-Augmented Generation)**
```typescript
// Check local knowledge base first
const kbResult = searchKB(question);

// If not in KB, use web search
const response = await generateSolution(
  ai, 
  question, 
  kbResult  // null triggers web search
);
```

#### **2. Input Guardrails**
```typescript
// Validate question is math-related
const isMath = await isMathQuestion(ai, question);
if (!isMath) {
  return "Please ask a mathematics question";
}
```

#### **3. Retry with Exponential Backoff**
```typescript
// Automatic retry: 1s → 2s → 4s delays
await retryWithBackoff(async () => {
  return await ai.models.generateContent({...});
}, maxRetries: 3);
```

#### **4. Human-in-the-Loop**
```typescript
// Refine answer based on user feedback
const refined = await refineSolution(
  ai,
  originalQuestion,
  originalAnswer,
  userFeedback
);
```

---

## 📥 Installation

### **Prerequisites**

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **Google Gemini API Key** - [Get it here](https://aistudio.google.com/app/apikey) (Free tier available)

### **Step-by-Step Installation**

#### **1. Clone the Repository**

```bash
# Using HTTPS
git clone https://github.com/Brijesh1656/Math-Professor-Agent.git

# Or using SSH
git clone git@github.com:Brijesh1656/Math-Professor-Agent.git

# Navigate to project directory
cd Math-Professor-Agent/math-routing-agent
```

#### **2. Install Dependencies**

```bash
npm install
```

This will install all required packages:
- React and React DOM
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini SDK
- PDF.js
- Marked
- And more...

#### **3. Configure Environment Variables**

Create a `.env` file in the `math-routing-agent` directory:

```bash
# Create .env file
touch .env
```

Add your Google Gemini API key:

```env
VITE_API_KEY=your_actual_google_gemini_api_key_here
```

> **📝 Note**: 
> - Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
> - Never commit your `.env` file to version control
> - The app allows API key input through the UI if you prefer not to use environment variables

#### **4. Start Development Server**

```bash
npm run dev
```

Or alternatively:

```bash
npm start
```

The application will start at `http://localhost:5173`

You should see:
```
VITE v7.1.12  ready in 200 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### **5. Build for Production**

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

#### **6. Preview Production Build**

```bash
npm run preview
```

---

## 📚 Usage Guide

### **Basic Usage**

#### **1. Asking Questions**

Simply type your mathematical question in the input box and press Enter or click the send button.

**Examples:**
- "What is the Pythagorean theorem?"
- "Solve for x: 2x² - 8x - 10 = 0"
- "Explain the concept of derivatives"
- "How do you find the area of a circle?"

#### **2. Uploading Documents**

1. Click the **upload icon** (📎) in the input area
2. Select a PDF or TXT file containing math problems
3. Wait for AI to extract questions
4. Click on any extracted question to get a solution

**Supported formats:**
- PDF (.pdf)
- Text files (.txt)

#### **3. Using Feedback**

After receiving an answer:

1. Click **"Helpful"** (👍) if the answer is correct
2. Click **"Not Helpful"** (👎) to provide feedback
3. Enter your feedback and click **"Refine Answer"**
4. Receive an improved, corrected answer

#### **4. Saving to Knowledge Base**

Click the **"Knowledge Base"** button to save important answers for quick future reference.

### **Advanced Features**

#### **Web Search Grounding**

When enabled, the AI will search the web for current information and cite sources.

**Sources appear as:**
- Clickable pills with website names
- External link icons
- Direct links to source material

#### **Download Answers**

Click the **download icon** to save any answer as a Markdown file for offline reference.

---

## 🚀 Deployment

### **Deploy to Vercel (Recommended)**

Vercel is the recommended hosting platform for this application.

#### **Quick Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Brijesh1656/Math-Professor-Agent)

#### **Manual Deployment Steps**

1. **Prepare Your Repository**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

3. **Import Project**
   - Click "Add New" → "Project"
   - Select your repository
   - Vercel auto-detects Vite configuration

4. **Configure Environment Variables**
   - Add environment variable:
     - **Name**: `VITE_API_KEY`
     - **Value**: Your Google Gemini API key
   - Click "Deploy"

5. **Access Your App**
   - Get your live URL: `https://your-project.vercel.app`
   - Share with friends!

#### **Vercel CLI Deployment**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### **Environment Variables on Vercel**

Set these in your Vercel project settings:

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_KEY` | Your Google Gemini API Key | Yes |

#### **Automatic Deployments**

Once connected:
- ✅ Push to `main` → Production deployment
- ✅ Pull requests → Preview deployments
- ✅ Instant rollbacks
- ✅ Automatic HTTPS
- ✅ Global CDN

### **Deploy to Other Platforms**

#### **Netlify**

1. Build the project: `npm run build`
2. Drag `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Add environment variables in Netlify dashboard

#### **GitHub Pages**

1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```
3. Run: `npm run deploy`

---

## 📁 Project Structure

```
Math-Professor-Agent/
├── math-routing-agent/              # Main application directory
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── ChatInput.tsx        # Message input component
│   │   │   ├── MessageBubble.tsx    # Chat message display
│   │   │   ├── FileUpload.tsx       # File upload button
│   │   │   ├── ExtractedQuestions.tsx  # Question list from docs
│   │   │   ├── Feedback.tsx         # User feedback component
│   │   │   └── SourcePill.tsx       # Web source badge
│   │   │
│   │   ├── services/                # Business logic services
│   │   │   └── geminiService.ts     # Gemini API integration
│   │   │       ├── isMathQuestion()      # Guardrail check
│   │   │       ├── generateSolution()    # Main AI generation
│   │   │       ├── refineSolution()      # Answer refinement
│   │   │       └── extractQuestionsFromFile()  # Document parsing
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   └── useKnowledgeBase.ts  # Knowledge base management
│   │   │
│   │   ├── App.tsx                  # Main application component
│   │   ├── constants.tsx            # SVG icons and constants
│   │   ├── types.ts                 # TypeScript type definitions
│   │   ├── index.css                # Global styles + animations
│   │   ├── index.tsx                # Application entry point
│   │   └── vite-env.d.ts           # Vite type declarations
│   │
│   ├── public/                      # Static assets
│   ├── dist/                        # Production build (generated)
│   ├── index.html                   # HTML template
│   ├── package.json                 # Dependencies and scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── vite.config.ts               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   └── .env                         # Environment variables (git-ignored)
│
├── vercel.json                      # Vercel deployment configuration
├── README.md                        # This file
└── .gitignore                       # Git ignore rules
```

### **Key Files Explained**

#### **`src/App.tsx`**
Main application component handling:
- Message state management
- File upload processing
- API key management
- Chat flow orchestration

#### **`src/services/geminiService.ts`**
Core AI service with:
- Retry logic with exponential backoff
- Error handling and formatting
- All Gemini API interactions
- RAG routing logic

#### **`src/hooks/useKnowledgeBase.ts`**
Custom hook for:
- Local storage management
- Knowledge base CRUD operations
- Search functionality

#### **`src/index.css`**
Styling including:
- Tailwind CSS imports
- Custom animations (slideIn, float, shimmer)
- Glassmorphism effects
- Gradient backgrounds
- Custom scrollbar

---

## 🔧 API Reference

### **Gemini Service Functions**

#### **`isMathQuestion(ai, question)`**

Validates if a question is mathematics-related using AI guardrails.

```typescript
const isMath = await isMathQuestion(ai, "What is 2+2?");
// Returns: true
```

**Parameters:**
- `ai` (GoogleGenAI): Gemini AI instance
- `question` (string): User's question

**Returns:** `Promise<boolean>`

---

#### **`generateSolution(ai, question, knowledgeBaseResult)`**

Generates a step-by-step solution to a mathematical problem.

```typescript
const { answer, sources } = await generateSolution(
  ai,
  "Explain the Pythagorean theorem",
  null  // No KB result, will use web search
);
```

**Parameters:**
- `ai` (GoogleGenAI): Gemini AI instance
- `question` (string): Math question
- `knowledgeBaseResult` (string | null): Pre-existing answer from KB

**Returns:** `Promise<{ answer: string; sources: Source[] }>`

---

#### **`refineSolution(ai, originalQuestion, originalAnswer, feedback)`**

Refines an answer based on user feedback.

```typescript
const refined = await refineSolution(
  ai,
  "What is calculus?",
  "Previous answer...",
  "Please explain with examples"
);
```

**Parameters:**
- `ai` (GoogleGenAI): Gemini AI instance
- `originalQuestion` (string): Original question
- `originalAnswer` (string): Previous answer
- `feedback` (string): User's feedback

**Returns:** `Promise<string>`

---

#### **`extractQuestionsFromFile(ai, fileContent)`**

Extracts mathematical questions from document text.

```typescript
const questions = await extractQuestionsFromFile(
  ai,
  "1. What is 2+2? 2. Solve x^2 = 4"
);
// Returns: ["What is 2+2?", "Solve x^2 = 4"]
```

**Parameters:**
- `ai` (GoogleGenAI): Gemini AI instance
- `fileContent` (string): Text from uploaded file

**Returns:** `Promise<string[]>`

---

## 🎨 Customization

### **Styling**

The app uses Tailwind CSS with custom styling in `src/index.css`.

**Key customization areas:**

1. **Colors**: Edit the gradient colors in `index.css`
2. **Animations**: Modify animation keyframes
3. **Glassmorphism**: Adjust `backdrop-filter` blur values
4. **Components**: Update Tailwind classes in component files

### **AI Models**

Change AI models in `geminiService.ts`:

```typescript
// Fast model for guardrails
model: 'gemini-2.5-flash'  // Change to gemini-1.5-flash

// Advanced model for solutions
model: 'gemini-2.5-pro'    // Change to gemini-1.5-pro
```

### **System Instructions**

Modify the AI's behavior by editing `SYSTEM_INSTRUCTION` in `geminiService.ts`.

---

## 🐛 Troubleshooting

### **Common Issues**

#### **1. API Key Errors**

**Error:** `There seems to be an issue with the API key`

**Solution:**
- Verify your API key is correct
- Check it's properly set in `.env` as `VITE_API_KEY`
- Restart the dev server after adding the key

#### **2. 503 Service Unavailable**

**Error:** `The AI service is currently experiencing high demand`

**Solution:**
- The app automatically retries 3 times
- Wait a few moments and try again
- Check [Google AI Status](https://status.cloud.google.com/)

#### **3. Build Errors**

**Error:** TypeScript compilation errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

#### **4. PDF Upload Not Working**

**Error:** Cannot read PDF files

**Solution:**
- Ensure PDF.js is properly installed
- Check browser console for errors
- Try a different PDF file
- Verify file isn't password-protected

### **Getting Help**

- 📖 Check the [Issues page](https://github.com/Brijesh1656/Math-Professor-Agent/issues)
- 💬 [Open a new issue](https://github.com/Brijesh1656/Math-Professor-Agent/issues/new)
- 📧 Contact: Check GitHub profile

---

## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### **How to Contribute**

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### **Contribution Guidelines**

- Write clear commit messages
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**

✅ Commercial use  
✅ Modification  
✅ Distribution  
✅ Private use  

---

## 👨‍💻 Author

**Brijesh**

- 🐙 GitHub: [@Brijesh1656](https://github.com/Brijesh1656)
- 📧 Email: Available on GitHub profile
- 🌐 Portfolio: Coming soon!

---

## 🙏 Acknowledgments

Special thanks to:

- **[Google DeepMind](https://deepmind.google/)** - For the amazing Gemini AI models
- **[Vercel](https://vercel.com/)** - For seamless deployment platform
- **[React Team](https://react.dev/)** - For the incredible UI library
- **[Vite Team](https://vitejs.dev/)** - For the blazing-fast build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework
- **Open Source Community** - For inspiration and support

---

## 📊 Project Stats

- **React Version**: 18.3.1
- **TypeScript**: Yes ✅
- **Bundle Size**: ~720 KB (gzipped: ~196 KB)
- **Build Time**: ~1.4s
- **Lighthouse Score**: 95+

---

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Voice input for questions
- [ ] Image upload for handwritten problems
- [ ] Interactive graph plotting
- [ ] Study session tracking
- [ ] Collaborative problem-solving
- [ ] Mobile app (React Native)
- [ ] Advanced LaTeX rendering
- [ ] Quiz generation
- [ ] Progress tracking

---

## 📞 Support

If you encounter any issues or have questions:

1. 📖 Check this README thoroughly
2. 🔍 Search [existing issues](https://github.com/Brijesh1656/Math-Professor-Agent/issues)
3. 🆕 [Open a new issue](https://github.com/Brijesh1656/Math-Professor-Agent/issues/new)
4. ⭐ Star the repo if you find it useful!

---

<div align="center">

### Made with ❤️ for students worldwide

**[⬆ Back to Top](#-math-professor-ai---intelligent-mathematics-tutor)**

---

**If this project helped you, consider giving it a ⭐!**

</div>

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
