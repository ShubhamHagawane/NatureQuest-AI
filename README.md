# NatureQuest AI

**Small outdoor quests to help you spend less time on screens and notice more of the natural world.** Choose an activity, the time you have, and a comfortable pace. NatureQuest uses a local open-weight AI model to make a quest; complete it outside and save a reflection in your journey history.

## How it works

1. Choose walking, birdwatching, gardening, cycling, or nature spotting.
2. Pick 10, 15, 20, 30, or 60 minutes and a difficulty.
3. The React app sends those preferences to the Express API.
4. The API asks Gemma 2 2B, running locally in Ollama, for a safe structured quest.
5. Complete the quest and write a reflection. The browser saves it in local storage.

The Explore page includes quick-start choices that prefill the quest form, plus a shuffleable nature prompt. If Ollama is unavailable, you can create a clearly labelled sample quest instead.

## Features

- AI-generated quests with a title, description, three or four steps, and a reflection prompt.
- Activity, time, difficulty, and optional location preferences.
- Local quest history and reflections without an account or database.
- Sample quests when the model is stopped or unavailable.
- Responsive navigation and layouts for mobile and desktop.

## Project structure

```text
naturequest-ai/
├── client/
│   ├── src/
│   │   ├── components/       # Navbar, activity selector, quest card
│   │   ├── pages/            # Explore, create quest, history
│   │   ├── services/api.js   # API calls and local history
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── server/
│   ├── routes/               # Quest API routes
│   ├── controllers/          # Request validation and responses
│   ├── services/             # Ollama prompt and response validation
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── README.md
└── .gitignore
```

## Technology

- **Client:** React 18, Vite, React Router, Lucide icons, and custom CSS
- **API:** Node.js, Express, and CORS
- **Local AI:** Ollama with the open-weight `gemma2:2b` model
- **History:** Browser `localStorage`

[Ollama's chat API accepts a JSON Schema for structured output](https://docs.ollama.com/capabilities/structured-outputs). The server constrains the quest response to the fields the app expects, then validates it before returning it to the client.

## Requirements

- Node.js 20 or newer and npm
- Ollama installed and running on this computer
- The Gemma 2 2B model downloaded in Ollama

The first model download needs an internet connection. Quest generation runs locally after the model is downloaded; this project does not need a Hugging Face token or hosted inference credits.

## Run on Windows

### 1. Download the model

Install and start [Ollama for Windows](https://ollama.com/download). In PowerShell, download the model:

```powershell
ollama pull gemma2:2b
```

Ollama normally serves its local API at `http://localhost:11434`.

### 2. Start the backend

Open a PowerShell terminal at the project root:

```powershell
cd server
npm install
Copy-Item .env.example .env
npm run dev
```

The example environment file configures:

```env
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:2b
```

Change these values in `server/.env` only if your ports, Ollama address, or model name differ. Keep the backend terminal open while using the app. The API health check is [http://localhost:3001/api/health](http://localhost:3001/api/health).

### 3. Start the frontend

Open a second PowerShell terminal at the project root:

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL printed in that terminal, usually [http://localhost:5173](http://localhost:5173).

Run only one backend process on port `3001`. If you see `EADDRINUSE`, another process is already using that port; stop it with **Ctrl+C** in its terminal before starting the backend again.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3001` | Express API port |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed client origin for CORS |
| `OLLAMA_URL` | `http://localhost:11434` | Ollama API base URL |
| `OLLAMA_MODEL` | `gemma2:2b` | Model tag installed in Ollama |
| `VITE_API_URL` | `http://localhost:3001/api` | Optional API base URL for the client |

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check that the Express API is running |
| `POST` | `/api/quests/generate` | Generate a quest with Ollama |
| `GET` | `/api/quests/sample` | Return a labelled sample quest without calling Ollama |

Example request to generate a quest:

```json
{
  "activity": "walking",
  "location": "a nearby park",
  "durationMinutes": 15,
  "difficulty": "Beginner"
}
```

Supported activities are `walking`, `birdwatching`, `gardening`, `cycling`, and `observing`. Supported durations are `10`, `15`, `20`, `30`, and `60` minutes. Difficulty can be `Beginner`, `Easy`, or `Moderate`. Location is optional.

The API responds with `{ "quest": { ... } }`. A generated quest includes `title`, `description`, `instructions`, `reflectionPrompt`, `emoji`, and `reward`, along with its activity and preferences.

The sample endpoint needs an activity query parameter, for example:

```text
GET /api/quests/sample?activity=walking&durationMinutes=15&difficulty=Beginner
```

## Data and limitations

- Quest history and reflections are stored in the current browser only. Clearing site data or using another browser/device will not carry them over.
- Ollama must be running and the configured model must be available for AI generation.
- Local generation speed depends on the computer and model. The first request may take longer while Ollama loads the model.
- Quest prompts encourage observation; they do not identify plants, birds, or other species.
- Sample quests are fixed examples, not AI-generated results.

## Hacktoberfest Week 1: Touch Grass

NatureQuest AI uses an open-weight model running locally to encourage outdoor time. For a DEV Community write-up, describe the problem, the local Ollama and Gemma setup, a create-and-complete demo, what you learned, and the project's limitations. Include the challenge tags `#devchallenge` and `#hf26challenge`.
