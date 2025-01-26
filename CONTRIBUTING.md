# Contributing to CSES TritonSpend

First off, thank you for considering contributing to TritonSpend! 🎉 We welcome all contributions and are excited to see what you'll bring to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Setting Up the Environment](#setting-up-the-environment)
  - [Setting Up the Local Repository](#setting-up-the-local-repository)
  - [Installing Dependencies](#installing-dependencies)
  - [Setting Up the Local Development Database](#setting-up-local-development-database)
  - [Running the Frontend and Backend](#running-the-backend-and-frontend)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Improving Documentation](#improving-documentation)
  - [Submitting a Pull Request](#submitting-a-pull-request)
- [Development Guidelines](#development-guidelines)
  - [Code Style](#code-style)
  - [Commit Messages](#commit-messages)
- [Contact](#contact)

## Code of Conduct

By participating in this project, you agree to uphold the [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand what actions will and will not be tolerated.

## Getting Started

### Setting Up the Environment

**Note**: You may have to restart terminal after installing each environment.

#### Downloading Git (and Git Bash)

1. Download git and git bash by following [this link](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
2. Set up Git Bash as the shell for running command line prompts (in VSCode or directly openning Git Bash)
3. Run:
   ```bash
   git -v
   ```
   This should output something like this:
   ```bash
   git version 2.46.0.windows.1
   ```

#### Downloading Node.JS

1. Download **nvm (Node Version Manager)**. Follow the instructions on in [this link](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) for the details.
2. Run:
   ```bash
   nvm -v
   ```
   This should output the version of nvm you installed.
3. Install **Node.js v18.20.4**:
   ```bash
   nvm install v18.20.4**
   ```
4. Switch to the installed version:
   ```bash
   nvm use v18.20.4**
   ```
5. Run:
   ```bash
   node -v
   npm -v
   ```
   The results should be something like:
   ```bash
   v18.20.4
   10.7.0
   ```

### Setting Up the Local Repository

1. **Fork the repository** to your GitHub account.
2. **Clone** the origin repository locally:
   ```bash
   git clone https://github.com/CSES-Open-Source/TritonSpend.git
   ```
3. Create a **remote repository**:
   ```bash
   git remote add [your-username] https://github.com/[your-username]/TritonSpend.git
   ```
4. Run:
   ```bash
   git remote -v
   ```
   The output should be something like the following:
   ```bash
   [your-username]    https://github.com/[your-username]/TritonSpend.git (fetch)
   [your-username]    https://github.com/[your-username]/TritonSpend.git (push)
   origin  https://github.com/CSES-Open-Source/TritonSpend.git (fetch)
   origin  https://github.com/CSES-Open-Source/TritonSpend.git (push)
   ```

### Installing Dependencies

1. Open an instance of git bash and run:
   ```bash
   cd frontend
   ```
2. Install frontend libraries:
   ```bash
   npm install
   ```
3. Open another instance of git bash and run:
   ```bash
   cd backend
   ```
4. Install backend libraries:
   ```bash
   npm install
   ```

### Setting Up the Local Development Database

1. Go to [postgresql.org/download/](https://www.postgresql.org/download/) and download PostgreSQL for your OS.
2. Open the installer, and follow the on screeen instructions.

### Running the Backend and Frontend

1. Open an instance of git bash and run:
   ```bash
   cd frontend
   ```
2. Install frontend libraries:
   ```bash
   npm start
   ```
3. Open another instance of git bash and run:
   ```bash
   cd backend
   ```
4. Install backend libraries:
   ```bash
   npm start
   ```

### Phew... That was a lot of setting up. But you are good to go now!

## How to Contribute

### Reporting Bugs

1. Open the [CSES Opensource TritonSpend Github Repo](https://github.com/CSES-Open-Source/TritonSpend/).
2. Click on the **issues** tab (next to code).
3. Create a **new issue**.
4. Select **Bug report** as the type of issue.
5. Fill in the title and description and submit the issue.

### Suggesting Features

1. Open the [CSES Opensource TritonSpend Github Repo](https://github.com/CSES-Open-Source/TritonSpend/).
2. Click on the **issues** tab (next to code).
3. Create a **new issue**.
4. Select **Feature request** as the type of issue.
5. Fill in the title and description and submit the issue.

### Improving Documentation

### Submitting a Pull Request

1. Create a new branch for the current issue you are working on:
   ```bash
   git checkout -b origin/main [name-of-branch]
   ```
2. Make changes to the branch and **commit changes**. I would recomment using VSCode version control or GitHub Desktop for making commits.
3. Run lint in respective frontend and backend directories:
   ```bash
   npm run lint-check
   ```
   Make sure to fix all lint errors before pushing your code.
4. **Push** the commits to your forked repository:
   ```bash
   git push [your-username] HEAD
   ```
   `[your-username]` is whatever you chose to set the name of your remote repository as. To check this type:
   ```bash
   git remote -v
   ```
5. Go to your forked repository and make a **pull request** to the main branch of the original repository. Make sure to fill in the title and description of the pull request.

## Development Guidlines

### Code Style

Please follow these coding style guidelines:

- We recommend using Prettier to format on save, and then running ESLint before making a pull request.
- Indent with tabs and use a 2-space indentation.
- Use semicolons and the end of each line.
- Write clear, concise comments where necessary.
- Use meaningful variable and function names.

### Commit Messages

Please write a rough description for the changes made in each commits

## Contact

For any issues or questions, please contact Shree Venkatesh (s1venkatesh@ucsd.edu) or UC San Diego CSES (cses@ucsd.edu).
