const express = require('express');
const router = express.Router();
const CheckAuth = require('../middleware/checkAuth.middleware');
const asyncMiddleware = require('../middleware/async.middleware');
const UserController = require('../controller/user.controller');
const IdValidator = require('../middleware/validateObjectId');


const { authAdmin, authUser } = new CheckAuth();
const { validateObjectId } = new IdValidator();
const {
  getUsers,
  getUserById,
  updateUser,
  setAdminUser,
  unSetAdminUser,
  getAdminUser,
  deleteUser
} = new UserController();

router.get('/admins', authAdmin, asyncMiddleware(getAdminUser));
router.put('/setAdmin/:melliCode', authAdmin, asyncMiddleware(setAdminUser));
router.put('/unSetAdmin/:melliCode', authAdmin, asyncMiddleware(unSetAdminUser));
router.get('/', authAdmin, asyncMiddleware(getUsers));
router.get('/search/:name', authAdmin, asyncMiddleware(getUsers));
router.get('/:id', authUser, asyncMiddleware(getUserById));
router.put('/:id', authUser, validateObjectId, asyncMiddleware(updateUser));
router.delete('/:id', authAdmin, validateObjectId, asyncMiddleware(deleteUser));


// router.get('/', async (req, res) => {
//   const users = await User.find().populate(
//     {
//       path: 'Elections',
//       populate: {
//         path: 'elections electionId'
//       }
//     }
//   ).sort("name");
//   res.send(users)
// })

// router.get('/:id', async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(400).send("invalid id");
//   const user = await User.findById(req.params.id);
//   if (!user) return res.status(404).send("user is not exist");
//   res.send(user)

// })

// router.post('/', async (req, res) => {
//   const { error } = validate(req.body)
//   if (error) return res.status(400).send(error.details[0].message);

//   let user = await User.findOne({ melliCode: req.body.melliCode });
//   if (user) return res.status(400).send("usre already registered");

//   user = new User(_.pick(req.body, ["name", "melliCode", "password"]));
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt)
//   await user.save();
//   const token = user.generateAuthToken();

//   res.header('x-auth-token', token).send(_.pick(user, ["_id", "name", "melliCode"]))
// })


// router.delete('/:id', async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(400).send("invalid id");
//   const user = await User.findByIdAndRemove(req.params.id);
//   if (!user) return res.status(404).send("user is not exist");
//   res.send(user);
// })

module.exports = router;