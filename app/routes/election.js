const express = require('express');
const asyncMiddleware = require('../middleware/async.middleware');
const router = express.Router();
const CheckAuth = require('../middleware/checkAuth.middleware');
const ElectionController = require('../controller/election.controller');
const IdValidator = require('../middleware/validateObjectId');


const { authAdmin, setUserIdToHeader, auth } = new CheckAuth();
const { validateObjectId } = new IdValidator();
const {
  addElection,
  getAtiveElections,
  getElectionById,
  getAllElections,
  updateElection,
  deleteElection
} = new ElectionController();


router.post('/', authAdmin, asyncMiddleware(addElection));
router.get('/', authAdmin, asyncMiddleware(getAllElections));
router.get('/actives', auth, setUserIdToHeader, asyncMiddleware(getAtiveElections));
router.get('/:id', auth, validateObjectId, asyncMiddleware(getElectionById));
router.put('/:id', authAdmin, validateObjectId, asyncMiddleware(updateElection));
router.delete('/:id', authAdmin, validateObjectId, asyncMiddleware(deleteElection));

// router.get('/:id', async (req, res) => {
//   const election = await Election.findById(req.params.id);
//   if (!election) return res.status(404).send("election is not exist");
//   res.send(election)

// })

// router.post('/', async (req, res) => {
//   const { error } = validate(req.body)
//   if (error) return res.status(400).send(error.details[0].message);

//   let election = new Election({
//     name: req.body.name
//   });
//   election = await election.save();
//   res.send(election)
// })

// router.put('/:id', async (req, res) => {
//   //validate
//   const { error } = validate(req.body)
//   if (error) return res.status(400).send(error.details[0].message);

//   const election = await Election.updateOne({ _id: req.params.id }, { name: req.body.name }, { new: true });
//   if (!election) return res.status(404).send("election is not exist");
//   res.send(election);
// })

// router.delete('/:id', async (req, res) => {
//   //some
//   const election = await Election.findByIdAndRemove(req.params.id);
//   if (!election) return res.status(404).send("election is not exist");
//   res.send(election);
// })

module.exports = router;