# Slightly Biased News

An AI-powered news analysis platform that uses multi-agent systems to identify bias, evaluate credibility, and provide diverse perspectives on current events.

## Features

- **Multi-Agent Orchestration**: Specialized agents for fetching, normalizing, and analyzing news.
- **Bias Detection**: Deep analysis of linguistic and structural bias.
- **Credibility Scoring**: Automated evaluation of news sources and authors.
- **Perspective Diversity**: Aggregation of different viewpoints on the same topic.
- **Interactive UI**: Premium dashboard built with Next.js and Tailwind.

## Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS / Vanilla CSS
- **Agents**: Custom JavaScript-based AI Agents
- **API**: Next.js Route Handlers

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/app`: Next.js app router and UI components.
- `src/lib/agents`: The multi-agent implementation.
- `src/components`: React components for the dashboard.
