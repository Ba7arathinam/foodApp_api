const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Sequelize, DataTypes } = require('sequelize');
const { combinedMeals } = require('./datas');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const sequelize = new Sequelize('bu-training', 'bu-trausr', 'r9*rwr$!usFw0MCPj#fJ', {
  host: '3.7.198.191',
  dialect: 'mysql',
  port: 8993,
});

// Define the User model
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user', // Default role is 'user'
  },
});
//mealsTable

const Meal = sequelize.define('Meals', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  strMeal: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: { // Ensure strMeal is not empty
        msg: 'Meal name is required'
      }
    }
  },
  strMealThumb: {
    type: Sequelize.STRING,
    allowNull: true
  },
  idMeal: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isInt: { // Ensure idMeal is an integer
        msg: 'idMeal must be a number'
      }
    }
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isInt: { // Ensure rating is an integer
        msg: 'Rating must be a number'
      },
      min: 1, // Ensure rating is between 1 and 5
      max: 5
    }
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isInt: { // Ensure amount is an integer
        msg: 'Amount must be a number'
      }
    }
  }
});
const Cart = sequelize.define('FoodApi_Carts', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  strMeal: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: { // Ensure strMeal is not empty
        msg: 'Meal name is required'
      }
    }
  },
  strMealThumb: {
    type: Sequelize.STRING,
    allowNull: true
  },
  idMeal: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isInt: { // Ensure idMeal is an integer
        msg: 'idMeal must be a number'
      }
    }
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isInt: { // Ensure rating is an integer
        msg: 'Rating must be a number'
      },
      min: 1, // Ensure rating is between 1 and 5
      max: 5
    }
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isInt: { // Ensure amount is an integer
        msg: 'Amount must be a number'
      }
    }
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue:1,
    validate: {
      isInt: { // Ensure amount is an integer
        msg: 'Amount must be a number'
      }
    }
  }
});

// Define Sequelize connection sync and start the server
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync(); // Sync all defined models to the DB
    app.listen(9090, () => {
      console.log('Server is live now');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
const dataaa = [
  {
    strMeal: "Baked salmon with fennel & tomatoes",
    strMealThumb: "https://www.themealdb.com/images/media/meals/1548772327.jpg",
    idMeal: "52959",
    rating: 4,
    amount: 150
},
{
    strMeal: "Cajun spiced fish tacos",
    strMealThumb: "https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg",
    idMeal: "52819",
    rating: 3,
    amount: 230
},
{
    strMeal: "Escovitch Fish",
    strMealThumb: "https://www.themealdb.com/images/media/meals/1520084413.jpg",
    idMeal: "52944",
    rating: 5,
    amount: 400
},
{
    strMeal: "Fish fofos",
    strMealThumb: "https://www.themealdb.com/images/media/meals/a15wsa1614349126.jpg",
    idMeal: "53043",
    rating: 2,
    amount: 720
},
{
    strMeal: "Fish pie",
    strMealThumb: "https://www.themealdb.com/images/media/meals/ysxwuq1487323065.jpg",
    idMeal: "52802",
    rating: 4,
    amount: 550
},
{
    strMeal: "Fish Soup (Ukha)",
    strMealThumb: "https://www.themealdb.com/images/media/meals/7n8su21699013057.jpg",
    idMeal: "53079",
    rating: 3,
    amount: 980
},
{
    strMeal: "Fish Stew with Rouille",
    strMealThumb: "https://www.themealdb.com/images/media/meals/vptqpw1511798500.jpg",
    idMeal: "52918",
    rating: 5,
    amount: 1200
},
{
    strMeal: "Garides Saganaki",
    strMealThumb: "https://www.themealdb.com/images/media/meals/wuvryu1468232995.jpg",
    idMeal: "52764",
    rating: 2,
    amount: 1650
},
{
    strMeal: "Grilled Portuguese sardines",
    strMealThumb: "https://www.themealdb.com/images/media/meals/lpd4wy1614347943.jpg",
    idMeal: "53041",
    rating: 4,
    amount: 1350
},
{
    strMeal: "Honey Teriyaki Salmon",
    strMealThumb: "https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg",
    idMeal: "52773",
    rating: 3,
    amount: 1775
},
{
    strMeal: "Kedgeree",
    strMealThumb: "https://www.themealdb.com/images/media/meals/utxqpt1511639216.jpg",
    idMeal: "52887",
    rating: 5,
    amount: 2000
},
{
    strMeal: "Kung Po Prawns",
    strMealThumb: "https://www.themealdb.com/images/media/meals/1525873040.jpg",
    idMeal: "52946",
    rating: 2,
    amount: 880
},
{
    strMeal: "Laksa King Prawn Noodles",
    strMealThumb: "https://www.themealdb.com/images/media/meals/rvypwy1503069308.jpg",
    idMeal: "52821",
    rating: 4,
    amount: 640
},
{
    strMeal: "Mediterranean Pasta Salad",
    strMealThumb: "https://www.themealdb.com/images/media/meals/wvqpwt1468339226.jpg",
    idMeal: "52777",
    rating: 3,
    amount: 1100
},
{
    strMeal: "Mee goreng mamak",
    strMealThumb: "https://www.themealdb.com/images/media/meals/xquakq1619787532.jpg",
    idMeal: "53048",
    rating: 5,
    amount: 1600
},
{
    strMeal: "Nasi lemak",
    strMealThumb: "https://www.themealdb.com/images/media/meals/wai9bw1619788844.jpg",
    idMeal: "53051",
    rating: 2,
    amount: 750
},
{
    strMeal: "Portuguese fish stew (Caldeirada de peixe)",
    strMealThumb: "https://www.themealdb.com/images/media/meals/do7zps1614349775.jpg",
    idMeal: "53045",
    rating: 4,
    amount: 800
},
{
    strMeal: "Recheado Masala Fish",
    strMealThumb: "https://www.themealdb.com/images/media/meals/uwxusv1487344500.jpg",
    idMeal: "52809",
    rating: 3,
    amount: 1250
},
{
    strMeal: "Salmon Avocado Salad",
    strMealThumb: "https://www.themealdb.com/images/media/meals/1549542994.jpg",
    idMeal: "52960",
    rating: 5,
    amount: 300
},
{
    strMeal: "Salmon Prawn Risotto",
    strMealThumb: "https://www.themealdb.com/images/media/meals/xxrxux1503070723.jpg",
    idMeal: "52823",
    rating: 2,
    amount: 175
},
{
    strMeal: "Saltfish and Ackee",
    strMealThumb: "https://www.themealdb.com/images/media/meals/vytypy1511883765.jpg",
    idMeal: "52936",
    rating: 4,
    amount: 800
},
{
    strMeal: "Seafood fideuà",
    strMealThumb: "https://www.themealdb.com/images/media/meals/wqqvyq1511179730.jpg",
    idMeal: "52836",
    rating: 3,
    amount: 400
},
{
    strMeal: "Shrimp Chow Fun",
    strMealThumb: "https://www.themealdb.com/images/media/meals/1529445434.jpg",
    idMeal: "52953",
    rating: 5,
    amount: 1900
},
{
    strMeal: "Sledz w Oleju (Polish Herrings)",
    strMealThumb: "https://www.themealdb.com/images/media/meals/7ttta31593350374.jpg",
    idMeal: "53023",
    rating: 2,
    amount: 170
},
{
    strMeal: "Spring onion and prawn empanadas",
    strMealThumb: "https://www.themealdb.com/images/media/meals/1c5oso1614347493.jpg",
    idMeal: "53040",
    rating: 4,
    amount: 1230
},
{
    strMeal: "Sushi",
    strMealThumb: "https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg",
    idMeal: "53065",
    rating: 3,
    amount: 1500
},
{
    strMeal: "Three Fish Pie",
    strMealThumb: "https://www.themealdb.com/images/media/meals/spswqs1511558697.jpg",
    idMeal: "52882",
    rating: 5,
    amount: 300
},
{
    strMeal: "Tuna and Egg Briks",
    strMealThumb: "https://www.themealdb.com/images/media/meals/2dsltq1560461468.jpg",
    idMeal: "52975",
    rating: 2,
    amount: 560
},
{
    strMeal: "Tuna Nicoise",
    strMealThumb: "https://www.themealdb.com/images/media/meals/yypwwq1511304979.jpg",
    idMeal: "52852",
    rating: 4,
    amount: 900
}
];

//  Meal.bulkCreate(data)
//   .then(() => {
//     console.log('Data inserted successfully.');
//   })
//   .catch((error) => {
//     console.error('Error inserting data:', error);
//   });

app.get('/api/meals',async (req, res) => {
    // const formattedMeals = combinedMeals.map(meal => ({
    //     ...meal,
    //     rating: ratings[combinedMeals.indexOf(meal)],
    //     amount: amounts[combinedMeals.indexOf(meal)]
    // }));
   let meals= await Meal.findAll();
    res.json({ meals: meals });
});
app.get('/meals',async (req, res) => {
    // const formattedMeals = combinedMeals.map(meal => ({
    //     ...meal,
    //     rating: ratings[combinedMeals.indexOf(meal)],
    //     amount: amounts[combinedMeals.indexOf(meal)]
    // }));
   
    res.json({ meals: combinedMeals });
});

// Endpoint to insert 5 data entries into the User table
app.post('/insertData', async (req, res) => {
  try {
    await Meal.bulkCreate(dataaa);
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error inserting data' });
  }
});


// Login route with Sequelize
app.post('/loginAuth', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      throw "User Value Not available";
    }
    const token = jwt.sign({ email, password }, 'shhhshhsh', { expiresIn: '1d' });
    user.token = token;
    await user.save();
    res.json({ token: user.token, id: user.id });
  } catch (error) {
    res.json(error);
  }
});

// Endpoint to create a new user
app.post('/createUser', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Create a new user entry in the User table
    const newUser = await User.create({ email, password });
    
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Logout route with Sequelize
app.get('/logOut/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw "User not found";
    }
    user.token = null;
    await user.save();
    res.json({ message: "Token Removed" });
  } catch (error) {
    res.json({ message: error });
  }
});

// Middleware to check user role
const RolebaseAuth = (role) => {
  return async (req, res, next) => {
    const id = req.headers.id;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      if (role !== user.role) {
        throw "Only Admin has Authorization";
      }
      next();
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error });
    }
  };
};

// Get all user data route with Sequelize
app.get('/getAllUser', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ Datas: users });
  } catch (error) {
    res.json({ message: error });
  }
});

// Get user data by ID route with Sequelize
app.get('/getAllUser/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw "User not found";
    }
    res.json({ Datas: user });
  } catch (error) {
    res.json({ message: error });
  }
});

// Update Password route with Sequelize
app.post('/UpdateData', async (req, res) => {
  const { id, existingPassword, NewPassword, confirmPassword } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw "Invalid Data";
    }
    if (existingPassword !== user.password) {
      return res.status(400).send("Existing Password is not valid");
    }
    if (NewPassword !== confirmPassword) {
      return res.send("New Passwords do not match");
    }
    user.password = NewPassword;
    await user.save();
    res.json({ message: "Updated Successfully" });
  } catch (error) {
    res.json({ message: error });
  }
});

// Verify Token route
app.post('/verifyToken', (req, res) => {
  const token = req.body.token;
  try {
    const decoded = jwt.verify(token, 'shhhshhsh');
    res.json(decoded);
  } catch (err) {
    res.json(err);
  }
});

// Sending mail route
app.post('/send_email', (req, res) => {
  const { name, email, message } = req.body;
  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'bala01225@gmail.com',
      pass: 'hxwcvysxejluinqy',
    },
  });
  const mailOptions = {
    from: email,
    to: 'recipient@example.com',
    subject: 'New Message from ODERZIT Contact Form',
    text: `Name: ${name}\n Email: ${email}\n Message: ${message}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});
