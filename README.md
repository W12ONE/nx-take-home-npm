# Git Metrics Gathering CLI (Nx Workspace)

> **Note:** This is the complete version of the CLI.  
> There is still some potential for optimisation (see _Performance Optimisations_ below).

This monorepo contains a CLI tool written in **TypeScript** and structured as an **Nx workspace**. It analyses Git contributor activity across multiple packages in a monorepo.

---

## 🛠 Tech Stack

- **TypeScript** – Fully type-safe implementation
- **Commander** – CLI interface and argument parsing
- **simple-git** – Lightweight Git wrapper for commit analytics
- **tsx** – Run `.ts` files directly without precompilation
- **Jest & Vitest** – Unit test coverage for CLI behaviour

---

## 📦 Project Structure

- `apps/git-metrics-gathering-cli-app/` – CLI entry point
- `packages/cli-tools/` – Internal utilities:
  - `git/data-access/` – Git operations
  - `git/metrics/` – Contributor logic
  - `project-discovery/` – Monorepo package discovery
  - `readme-manager/` – Utility to update the README from CLI output

---

## ✅ Functionality

Given a Git repo root path, the CLI:

1. Discovers all local packages under `packages/`
2. Aggregates commit authors per package
3. Identifies contributors who worked across multiple packages
4. Updates or adds a section in the repo’s `README.md` with the result

---

## 🧪 Test Results

The CLI was tested on:

- ✅ [`count-contributors-sample`](https://github.com/nrwl/count-contributors-sample)
- ✅ [`nrwl/nx`](https://github.com/nrwl/nx)

When run on the full Nx monorepo:

- `packages/` contributors: **769**
- Cross-project contributors: **229**
- GitHub total contributors: **1,064**  
  → _Difference expected — this CLI focuses only on contributors under `packages/*`_

---

## ⚙️ Usage

### 1. Install

> ⚠️ Use **npm** for full compatibility — `pnpm` caused issues in this setup

```bash
npm install
```

### 2. Run the CLI

```bash
npx tsx apps/git-metrics-gathering-cli-app/src/main.ts <path-to-repo>
```

Or use preconfigured scripts (ensure paths are correct for your local environment):

```bash
npm run run-app-test-folder
npm run run-app-nx
```

---

## 🧪 Performance Optimisations

To improve runtime performance — especially when analysing large repositories like the full Nx monorepo — two different optimisation strategies were implemented and tested.

The optimisations are available on separate branches:

- [`performance-optimization`](https://github.com/W12ONE/nx-take-home-npm/tree/performance-optimization)
- [`performanmce-optimization-2`](https://github.com/W12ONE/nx-take-home-npm/tree/performanmce-optimization-2) _(typo in branch name)_

### 🚀 Optimisation 1: Parallelisation

Each Git log command for a subdirectory is executed in parallel.  
This reduced execution time from **~8.5s** to around **2.2s**.

### ⚡️ Optimisation 2: Single Git Call + In-Memory Filtering

A single git log is executed across the whole repo and then filtered in memory to match the desired subdirectories.
This further reduced the execution time to around 1.6s, but introduced additional complexity.

Note that the data-access package is no longer used in this version. The code should be refactored so that the git log call is properly encapsulated there again.
It has been retained for now, as the primary focus was on exploring optimisation potential.
Tests will also need to be adjusted before this branch is ready for a pull request.

> At this stage, I'd lean towards **parallelisation** for its balance of clarity and performance.  
> However, if this were to be used in production or at larger scale, the added complexity of the single-call strategy would likely be worth the reduced execution time.
