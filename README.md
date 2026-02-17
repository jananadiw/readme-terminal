# readme-terminal

[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-purple.svg)](https://www.framer.com/motion/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green.svg)](https://platform.openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8.svg)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)

![Preview](Preview.png)

> An interactive portfolio terminal built as a pannable canvas with draggable photo stamps and an AI-powered chat interface.

## Stack

- **Next.js 16** (App Router, React Compiler, Turbopack)
- **React 19**
- **Framer Motion 12** — LazyMotion, GPU-accelerated animations
- **OpenAI GPT-4o-mini** — streamed responses via Route Handlers
- **Tailwind CSS 4**

## Features

- Infinite pannable canvas with photo stamps from travels
- Draggable, minimizable terminal window
- AI chat that answers questions based on a personal bio (`whoami.md`)
- Built-in commands: `help`, `clear`, `/whoami`
- Deterministic spiral layout for stamp positioning
- Reduced motion support

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env
# Add your OPENAI_API_KEY to .env

# Run dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/              # Next.js App Router pages & API routes
│   └── api/
│       ├── chat/     # OpenAI streaming endpoint
│       └── whoami/   # Bio content endpoint
├── components/
│   ├── atoms/        # Button, Input, ColoredText, TerminalDot, etc.
│   ├── molecules/    # TerminalTitleBar, TerminalPrompt, HistoryItem
│   ├── organisms/    # TerminalWindow, DraggableStamp, WelcomeMessage
│   └── templates/    # HomeTemplate (main canvas + terminal layout)
├── hooks/            # useTerminal, useWhoami, useStampPositions
├── lib/              # Types, constants, command processing
└── styles/           # Theme config
```
