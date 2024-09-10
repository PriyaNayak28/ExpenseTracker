const express = require("express");
const path = require('path');
const cors = require("cors");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

// Import the Sequelize instance
const sequelize = require('./util/database.js');

// Import models
const User = require('./models/user.js');
const Expense = require('./models/expense.js');
const Order = require('./models/order.js');
const Forgotpassword = require('./models/forget-password.js');

// Import routes
const userRoutes = require('./routes/user.js');
const expenseRoutes = require('./routes/expense.js');
const purchaseRoutes = require('./routes/purchase.js');
const premiumFeatureRoutes = require('./routes/premium-feature.js');
const resetPasswordRoutes = require('./routes/reset-password.js');

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));

// Define routes
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);

// Define model relationships
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(result => {
        console.log('Database synced');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log(err);
    });
