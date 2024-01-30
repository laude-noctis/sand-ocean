const { ObjectId } = require('mongoose').Types;
const { User } = require('../../models');
const router = require('express').Router();

router.get('/', async (req, res) => {
  console.log("Getting all users");
  try {
    const numberOfUsers = await User.aggregate()
      .count('userCount');
    res.json(numberOfUsers);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;