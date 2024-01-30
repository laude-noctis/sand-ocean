const { ObjectId } = require('mongoose').Types;
const { User } = require('../../models');
const router = require('express').Router();

// get all users
router.get('/', async (req, res) => {
  console.log("Getting all users");
  try {
    const allUsers = await User.find();
    const numberOfUsers = await User.aggregate().count('userCount');
    
    const usersObject = {
      allUsers,
      users: numberOfUsers[0].userCount
    }
    
    res.json(usersObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// get one (1) user
router.get('/:userId', async (req, res) => {
  console.log("Getting one user");
  try {
    const user = await User.findOne({ _id: req.params.userId })
    .select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User does not exist'})
    }

    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  };
});

// create an user
router.post('/', async (req, res) => {
  console.log("Creating an user");
  try {
      const newUser = await User.create(req.body)
      res.json(newUser)
  } catch (err) {
    console.log(err)
    res.json(500).json(err)
  }
})
module.exports = router;