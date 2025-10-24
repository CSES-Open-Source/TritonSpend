# CSES TritonSpend

TritonSpend is an intelligent finance management application designed specifically for UC San Diego students. Built with modern web technologies and powered by AI, it helps students track budgets, analyze spending patterns, set financial goals, and access personalized financial guidance through an intelligent chatbot.

## 🚀 Features

### Current Features (MVP)
- **Budget Tracking & Analytics**: Monitor spending across customizable categories with real-time budget tracking
- **Expense Categorization**: Organize expenses into categories (Food, Shopping, Transportation, Subscriptions, Others) for better financial insights
- **Financial Goals Management**: Set, track, and manage financial goals with target dates and progress monitoring
- **Transaction History**: Complete transaction management with add, view, and delete capabilities
- **Visual Analytics**: Interactive pie charts and spending visualizations to understand spending patterns
- **User Authentication**: Secure Google OAuth integration for seamless login
- **Responsive Design**: Mobile-first React Native interface optimized for student use

### Upcoming Features (Roadmap 2.0)
- **🤖 AI Finance Chatbot**: Intelligent financial advisor powered by LangChain and Gemini/OpenAI
- **🔒 Enhanced Security**: End-to-end encryption, audit logging, and privacy controls
- **📊 Advanced Analytics**: Time-based trends, income vs expense charts, goal completion timelines
- **🎓 Student Resource Hub**: CalFresh information, scholarship links, UCSD financial aid resources
- **🎨 Personalized Experience**: Custom dashboards, theme switching, and preference-based UI
- **📱 Cross-Platform**: Full iOS and Android support with TestFlight and Play Store distribution

## 🛠 Tech Stack

### Frontend
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **UI Components**: Custom components with React Native
- **Charts**: React Native SVG for data visualization
- **State Management**: React Context API
- **Authentication**: Google OAuth integration

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with advanced triggers and functions
- **Authentication**: Passport.js with Google OAuth 2.0
- **Validation**: Express Validator
- **Session Management**: Express Session
- **File Upload**: Multer

### Database Schema
- **Users**: Profile management with budget tracking
- **Categories**: Customizable spending categories with budget limits
- **Transactions**: Complete transaction history with automatic categorization
- **Goals**: Financial goal setting and tracking
- **Triggers**: Automated expense recalculation and category management

## 🚀 Getting Started

### Prerequisites
- Node.js v18.20.4 (recommended)
- PostgreSQL
- Git
- Expo CLI (for mobile development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CSES-Open-Source/TritonSpend.git
   cd TritonSpend
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up the database**
   ```bash
   cd backend
   npm run setup-db
   ```

4. **Configure environment variables**
   - Create `.env` files in both `backend/` and `frontend/` directories
   - Add your Google OAuth credentials and database connection strings

5. **Run the application**
   ```bash
   # Start backend server
   cd backend
   npm start
   
   # Start frontend (in new terminal)
   cd frontend
   npm start
   ```


## 🤝 Contributing

We welcome contributions from the UCSD community and beyond! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- Setting up your development environment
- Code style and standards
- Submitting pull requests
- Reporting bugs and suggesting features

### Quick Start for Contributors
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Run linting: `npm run lint-check`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to your branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📊 Project Structure

```
TritonSpend/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── db/            # Database configuration
│   │   └── util/          # Utility functions
│   └── package.json
├── frontend/               # React Native mobile app
│   ├── app/               # Expo Router pages
│   ├── components/        # Reusable UI components
│   ├── context/          # React Context providers
│   └── package.json
└── docs/                  # Documentation
```

## 🎯 Team

### Engineering Leadership
- **Engineering Managers**: Himansi Gupta, Vedant Vardhaan
- **Product Manager**: Sharvari Thekkate

### Development Team
- 5 Full-Stack Developers
- 2 UI/UX Designers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions, issues, or collaboration opportunities:

- **Maintainer**: Vedant Vardhaan (vvardhaan@ucsd.edu), Himansi Gupta (h4gupta@ucsd.edu)
- **Organization**: UC San Diego CSES (cses@ucsd.edu)
- **GitHub**: [CSES-Open-Source/TritonSpend](https://github.com/CSES-Open-Source/TritonSpend)

