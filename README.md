# Git Metrics Gathering CLI (Nx Workspace)

> **Note:** This is the complete version of the CLI.  
> There is still some potential for optimisation (see _Known Issues_ below).

This monorepo contains a CLI tool written in **TypeScript** and structured as an **Nx workspace**. It analyzes Git contributor activity across multiple packages in a monorepo.

---

## 🛠 Tech Stack

- **TypeScript** – Fully type-safe implementation
- **Commander** – CLI interface and argument parsing
- **simple-git** – Lightweight Git wrapper for commit analytics
- **tsx** – Run `.ts` files directly without precompilation
- **Jest & Vitest** – Unit test coverage for CLI behavior

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

1. Discovers all local packages (e.g., under `packages/`)
2. Aggregates commit authors per package
3. Identifies contributors who worked across multiple packages
4. Optionally updates the repo’s `README.md` with the result

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

## 🐞 Known Issues

- **Performance (on large repos)**:  
  Git queries run sequentially — parallelization is a clear next step.  
  This was left unoptimized to stay within the **2.5-hour time budget**.

- **CI Cache misses**:  
  Nx Cloud Cache misses in CI. Need to check that out.
