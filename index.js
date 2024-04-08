const express = require('express');
const cors = require('cors');
const crosConfig={
    origin:"*",
    Credential:true,
    methods:["GET","POST","PUT","DELETE"]
}
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Sequelize, DataTypes } = require('sequelize');
const { combinedMeals } = require('./datas');
const app = express();
app.use(cors(crosConfig));
app.options("",cors(crosConfig))
app.use(express.json());

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
      defaultValue: 'user', // Setting default value to 'user'
    },
  });


app.get('/api/meals', (req, res) => {
    // const formattedMeals = combinedMeals.map(meal => ({
    //     ...meal,
    //     rating: ratings[combinedMeals.indexOf(meal)],
    //     amount: amounts[combinedMeals.indexOf(meal)]
    // }));
    res.json({ meals: combinedMeals });
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
app.post('/insertData', async (req, res) => {
    try {
     
      await User.bulkCreate([
        { email: 'user1@example.com', password: 'password1', role: 'user' },
        { email: 'user2@example.com', password: 'password2', role: 'user' },
        { email: 'user3@example.com', password: 'password3', role: 'user' },
        { email: 'user4@example.com', password: 'password4', role: 'user' },
        { email: 'user5@example.com', password: 'password5', role: 'user' },
      ]);
      
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
    res.json({token:user.token ,id:user.id});
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
