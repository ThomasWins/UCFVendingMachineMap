const User = require('../models/userModel');

exports.loginUser = async (req, res) => {
  const db = req.app.locals.db;
  const { login, password } = req.body;

  try {
    const user = await db.collection('Users').findOne({ Login: login, Password: password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid login or password' });
    }

    res.status(200).json({
      id: user.UserId,
      firstName: user.Firstname,
      lastName: user.Lastname,
      favorites: user.Favorites,
      admin: user.Admin,
      error: ''
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
