# CYNQ
Augmented Ecosystem Intelligence.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/deckerd451/Kismet)
## Project Status
**FINAL & COMPLETE:** All client feedback has been addressed, and all features outlined in the blueprint have been successfully implemented. The application is stable, feature-complete, visually polished, and ready for production deployment. No further development is required.
## About The Project
CYNQ is a groundbreaking personal intelligence application designed to function as a user's predictive consultant. It operates by building a comprehensive, ever-evolving 'ecosystem' for each user. This ecosystem is created by onboarding key personal information (goals, interests, skills) and then intelligently ingesting and analyzing data from their community, events, and professional/social networks.
The core of the application is a sophisticated AI chat interface through which the user interacts with their personal intelligence. The AI leverages a rich, interconnected data matrix to offer predictive insights, suggest meaningful connections, recommend relevant events, and provide refined consultations that are deeply contextualized to the user's implied and explicit needs.
The visual design is intentionally illustrative and whimsical, making the powerful underlying technology feel human, approachable, and delightful to interact with.
## Key Features
*   **Conversational AI Interface:** Interact with your personal intelligence through a natural and intuitive chat experience.
*   **Persistent Consultations:** All conversations are stateful and saved, allowing you to pick up where you left off.
*   **User-Managed Ecosystem:** Manually build out your personal ecosystem by adding key **Contacts**, **Events**, **Communities**, **Organizations**, **Skills**, **Projects**, and **Knowledge** items.
*   **Critical Path Planning:** Define, track, and manage multiple strategic, multi-phase plans. Assign tasks to specific organizations and filter your view to focus on key responsibilities. The application comes pre-loaded with default commercialization paths.
*   **Ecosystem Analytics Dashboard:** Get a data-driven overview of your ecosystem with metrics like connection density, key players, and category distribution.
*   **Relationship Mapping:** Create explicit links between different parts of your ecosystem (e.g., link a contact to a specific project) to provide deeper context to the AI.
*   **AI-Powered Takeaways:** The AI analyzes conversations to suggest key entities (contacts, events) or insights to be added directly to your ecosystem.
*   **Community Intelligence:** Leverage and contribute to a shared pool of anonymized insights and resources from the broader CYNQ community.
*   **Dedicated Data Sources Hub:** A centralized page to manage all third-party data integrations (currently simulated and marked as "Coming Soon").
*   **CYNQ Snapshot Sharing:** Generate a QR code of your ecosystem data to easily share with others, and import snapshots from others to merge their data into your own.
*   **In-App QR Code Scanning:** Scan snapshot QR codes directly using your device's camera on mobile.
*   **Illustrative & Polished UI:** A unique, human-centered design with smooth animations, including a glowing effect on active ecosystem nodes and animated navigation indicators, creating a delightful user experience.
*   **Responsive Design:** A seamless experience across desktop, tablet, and mobile devices.
*   **Serverless Backend:** Built on the high-performance, scalable Cloudflare Workers platform.
*   **Stateful Agents:** Leverages Cloudflare Durable Objects via the Agents SDK for robust session management.
## Data Layer & Integrations
*   **State Management:** Zustand is used for robust and performant client-side state management.
*   **Data Persistence:** User profile and ecosystem data are persisted locally in the browser's `localStorage`.
*   **Data Source Integrations:** The application features a dedicated **Data Sources** page for connecting to eight categories of data sources (e.g., Google, LinkedIn, GitHub). **Please note:** The current version uses a mock OAuth 2.0 flow to simulate the connection process, and all integrations are marked as "Coming Soon" in the UI. This version does not connect to live third-party APIs.
## Technology Stack
*   **Frontend:**
    *   [React](https://react.dev/)
    *   [Vite](https://vitejs.dev/)
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn/ui](https://ui.shadcn.com/)
    *   [Framer Motion](https://www.framer.com/motion/)
    *   [Zustand](https://zustand-demo.pmnd.rs/)
*   **Backend:**
    *   [Cloudflare Workers](https://workers.cloudflare.com/)
    *   [Hono](https://hono.dev/)
    *   [Cloudflare Agents SDK](https://github.com/cloudflare/agents) (Durable Objects)
*   **AI:**
    *   [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Bun](https://bun.sh/)
*   A [Cloudflare account](https://dash.cloudflare.com/sign-up)
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated
### Installation
1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/cynq.git
    cd cynq
    ```
2.  **Install dependencies:**
    ```sh
    bun install
    ```
3.  **Configure Environment Variables:**
    Create a `.dev.vars` file in the root of the project and add your Cloudflare AI Gateway credentials.
    ```ini
    # .dev.vars
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="YOUR_CLOUDFLARE_API_KEY"
    ```
    **Note:** Never commit the `.dev.vars` file to version control.
## Development
To run the application locally, which starts both the Vite frontend development server and the Cloudflare Worker, use the following command:
```sh
bun dev
```
This will start the application on `http://localhost:3000` (or the next available port). The frontend will automatically proxy API requests to the local worker instance.
## Usage
Once the application is running, you can:
*   Sign up for a new account and complete the guided onboarding.
*   Start a new "Consultation" using the button in the sidebar.
*   Type messages into the chat input to interact with the CYNQ AI.
*   Manage your profile, ecosystem data, and relationships.
*   Explore community intelligence and contribute your own insights.
## Deployment

This project can be deployed to Vercel with zero configuration.

**Quick Deploy to Vercel:**
1. Sign in to [vercel.com](https://vercel.com) with GitHub
2. Import your repository
3. Add environment variables (see [DEPLOYMENT.md](./DEPLOYMENT.md))
4. Click Deploy

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Alternative: Cloudflare Pages
This project was originally designed for Cloudflare Pages and can still be deployed there:
```sh
bun run build
bun run deploy
```
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/deckerd451/Kismet)