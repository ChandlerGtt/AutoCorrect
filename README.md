# AutoCorrect - Gmail Spell-Check Chrome Extension

A Chrome extension that provides real-time autocorrect functionality for Gmail's compose interface, powered by a Python FastAPI backend and custom spell-checking algorithm.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Development](#development)
- [Browser Permissions](#browser-permissions)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

- **Real-time Spell Checking** - Detects misspelled words as you type in Gmail
- **Visual Feedback** - Floating popup displays correction suggestions
- **Click-to-Correct** - One-click word replacement
- **Context Tracking** - Monitors the last 10 words entered
- **Field Detection** - Works in both Subject and Body fields
- **Dark Mode Support** - Adapts to system theme preferences

---

## Technology Stack

### Programming Languages

| Language | Purpose |
|----------|---------|
| TypeScript | Primary frontend language (ES2020 target) |
| Python 3.13 | Backend API language |
| JavaScript | Build outputs and module system |
| CSS3 | Modern styling with Grid, Flexbox, media queries |
| HTML5 | Extension manifest and popup interface |

### Frontend

- **React 19.1.1** - UI component framework
- **TypeScript 5.6.0** - Static type checking
- **Vite 6.3.5** - Build tool and development server
- **gmail-js 1.1.16** - Gmail interface integration
- **Chrome Extension Manifest V3** - Modern extension standard

### Backend

- **Python 3.13** - Server-side language
- **FastAPI** - Async web framework
- **Pydantic** - Data validation and settings management

### Development Tools

- **ESLint 9.0.0** - Code linting
- **@typescript-eslint** - TypeScript-specific linting rules
- **@types/chrome** - Chrome extension API types
- **@types/react** - React type definitions
- **@types/react-dom** - React DOM type definitions

---

## Project Structure

```
AutoCorrect/
├── src/
│   ├── App.tsx              # Main React application
│   ├── App.css              # Application styles
│   ├── main.tsx             # React entry point
│   ├── background.ts        # Chrome extension service worker
│   ├── content-script.ts    # Gmail page injection script
│   ├── spellcheck.ts        # Edit distance algorithm
│   └── dictionary.json      # Word frequency data
├── backend/
│   ├── main.py              # FastAPI application entry
│   ├── api/
│   │   └── endpoints.py     # API route definitions
│   └── core/
│       └── config.py        # Configuration settings
├── public/
│   └── manifest.json        # Chrome extension manifest
├── package.json             # Node.js dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── eslint.config.js         # ESLint configuration
```

---

## Installation

### Prerequisites

- Node.js (v18 or higher)
- Python 3.13
- Google Chrome browser

### Frontend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd AutoCorrect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run build
   ```

4. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder from the project

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install fastapi pydantic uvicorn
   ```

4. **Run the server:**
   ```bash
   uvicorn main:app --reload
   ```

---

## Usage

1. Ensure the backend server is running
2. Open Gmail in Chrome (https://mail.google.com)
3. Compose a new email
4. Start typing - misspelled words will trigger a floating popup with suggestions
5. Click on a suggestion to replace the misspelled word

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check for application monitoring |
| `/setup` | GET | Verify application initialization |
| `/api/v1/analyze` | POST | Analyze word/text for corrections |

### Example API Usage

```bash
# Health check
curl http://localhost:8000/health

# Setup verification
curl http://localhost:8000/setup

# Analyze text (POST)
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"word": "teh", "context": "this is teh test"}'
```

---

## How It Works

### Spell-Checking Algorithm

The extension uses an **Edit Distance (Levenshtein Distance)** algorithm to find similar words:

#### Edit Distance 1
Words that differ by one operation:
- **Insertions** - Add a character (e.g., "helo" → "hello")
- **Deletions** - Remove a character (e.g., "helllo" → "hello")
- **Transpositions** - Swap adjacent characters (e.g., "hlelo" → "hello")
- **Substitutions** - Replace a character (e.g., "hallo" → "hello")

#### Edit Distance 2
Applies edit distance 1 twice for more distant matches, catching words with multiple errors.

#### Frequency-Based Ranking
Suggestions are ranked by word frequency from a dictionary built from classic literature (Sherlock Holmes corpus from Project Gutenberg).

### Gmail Integration

The extension integrates with Gmail using several browser APIs:

- **MutationObserver** - Detects changes in compose fields
- **Selection API** - Tracks cursor position
- **Range API** - Replaces text with corrections
- **Chrome Messaging** - Communicates between content script and background service worker

### Architecture Flow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Gmail     │ → │   Content    │ → │  Background │
│   Page      │    │   Script     │    │   Worker    │
└─────────────┘    └──────────────┘    └─────────────┘
                          │                    │
                          ↓                    ↓
                   ┌──────────────┐    ┌─────────────┐
                   │  Spell Check │    │   FastAPI   │
                   │  Algorithm   │    │   Backend   │
                   └──────────────┘    └─────────────┘
```

---

## Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

### Configuration Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | TypeScript compiler options |
| `tsconfig.app.json` | App-specific TypeScript config |
| `vite.config.ts` | Vite build configuration |
| `eslint.config.js` | ESLint linting rules |
| `.env` | Backend environment variables |

### Building for Production

1. Run the build command:
   ```bash
   npm run build
   ```

2. The compiled extension will be in the `dist` folder

3. Load the `dist` folder as an unpacked extension in Chrome

---

## Browser Permissions

The extension requires the following Chrome permissions:

| Permission | Purpose |
|------------|---------|
| `activeTab` | Access to the current tab |
| `tabs` | Tab management |
| `storage` | Data persistence |
| `scripting` | Content script injection |
| `host_permissions` | Access to `mail.google.com` |

---

## Future Enhancements

- [ ] NLTK integration for advanced natural language processing
- [ ] Expanded dictionary with more words
- [ ] User-customizable dictionary
- [ ] Grammar checking capabilities
- [ ] Support for other email platforms (Outlook, Yahoo Mail)
- [ ] Machine learning-based suggestions
- [ ] Multi-language support

---

## Contributing

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint for code linting
- Write meaningful commit messages
- Add comments for complex logic

---

## License

This project is developed as part of **CSCE 4201.501** coursework.

---

## Acknowledgments

- Dictionary data sourced from [Project Gutenberg's Sherlock Holmes texts](https://www.gutenberg.org/)
- Built with [gmail-js](https://github.com/nicgirault/gmail-js) for Gmail integration
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [Vite](https://vitejs.dev/) for the build tooling
- [React](https://react.dev/) for the UI framework


**Course:** CSCE 4201.501  
**Project:** AutoCorrect - Gmail Spell-Check Chrome Extension
