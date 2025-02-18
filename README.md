# Easy Budget - Personal Finance Made Simple

> [!NOTE]
> This repository was created using GitHub Copilot and serves as an experimental project. While functional, it may not follow all industry best practices or security standards. Use at your own discretion.

> [!IMPORTANT]
> **Disclaimer:** This software is provided "as is", without warranty of any kind, express or implied. The author takes no responsibility for any damages or losses that may occur from using this software. By using this application, you acknowledge that:
> - This is an experimental project
> - Financial data should be regularly backed up
> - You should verify all calculations independently
> - The author is not liable for any errors or financial discrepancies
> - This is not a replacement for professional financial software

# Easy Budget - Personal Finance Made Simple

Easy Budget is a modern, user-friendly personal finance application designed to help you take control of your finances. With features like multi-account management, budget tracking, and smart transaction importing, Easy Budget makes managing your money effortless.

## 🌟 Key Features

### Multi-Account Management
- Track multiple accounts (checking, savings, credit cards)
- Real-time balance updates
- Clear overview of all your accounts in one place

### Smart Transaction Management
- Import transactions from bank statements (CSV/Excel)
- Smart column mapping with automatic detection
- Supports multiple date formats
- Handles various currency formats
- Intelligent categorization

### Budget Tracking
- Set monthly and annual budgets
- Track spending by category
- Visual progress bars for budget limits
- Instant overview of your spending patterns

## 🚀 Technical Overview

### Frontend (React + TypeScript)
- Modern React with TypeScript for type safety
- Responsive design using TailwindCSS
- Component-based architecture
- Real-time data updates

### Backend (Node.js + SQLite)
- Express.js REST API
- SQLite database for easy deployment
- Transaction support for data integrity
- Batch operations for efficient imports

## 🔧 Project Structure

```
/Budget
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
│   └── public/           # Static assets
└── backend/              # Node.js backend
    ├── routes/          # API routes
    └── database.ts      # Database configuration
```

## 💡 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/thatapiguy/easy-budget.git
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

3. Start the application:
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev
```

## 🎯 Use Cases

### Personal Finance Management
- Track daily expenses
- Monitor account balances
- Set and follow budgets

### Bank Statement Reconciliation
- Import bank statements
- Match transactions
- Keep your records up to date

### Budget Planning
- Set category-wise budgets
- Track monthly/annual spending
- Get insights into spending patterns

## 🔒 Security

- Local database storage
- No cloud dependency
- Your data stays on your machine

## 🚧 Future Enhancements

- [ ] Custom categories
- [ ] Expense analytics
- [ ] Export reports
- [ ] Mobile app
- [ ] Bank API integration
- [ ] Investment tracking

## 📄 License

MIT License - feel free to use and modify as needed.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the GitHub repository or contact us at support@easybudget.com.

---

Made with ❤️ by [Your Name]