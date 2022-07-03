const express = require('express');
const router = express.Router();
const CheckAuth = require('../middleware/checkAuth.middleware');
const asyncMiddleware = require('../middleware/async.middleware');
const CondidateController = require('../controller/condidate.controller');
const IdValidator = require('../middleware/validateObjectId');

const { authAdmin, auth } = new CheckAuth();
const { validateObjectId } = new IdValidator();
const {
  addCondidate,
  getCondidateById,
  updateCondidate,
  deleteCondidate

} = new CondidateController();

router.post('/', authAdmin, asyncMiddleware(addCondidate));
router.get('/:id', auth, validateObjectId, asyncMiddleware(getCondidateById));
router.put('/:id', authAdmin, validateObjectId, asyncMiddleware(updateCondidate));
router.delete('/:id', authAdmin, validateObjectId, asyncMiddleware(deleteCondidate));


// router.get('/:id', async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(400).send("invalid id");
//   const condidate = await Condidate.findById(req.params.id);
//   if (!condidate) return res.status(404).send("condidate is not exist");
//   res.send(condidate)

// })

// router.post('/', async (req, res) => {
//   const { error } = validate(req.body)
//   if (error) return res.status(400).send(error.details[0].message);

//   let condidate = new Condidate({
//     ...req.body,
//   });
//   condidate = await condidate.save();
//   res.send(condidate)
// })

// router.put('/:id', async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(400).send("invalid id");
//   //validate
//   const { error } = updateValidate(req.body)
//   if (error) return res.status(400).send(error.details[0].message);

//   const condidate = await Condidate.updateOne({ _id: req.params.id }, { ...req.body }, { new: true });
//   if (!condidate) return res.status(404).send("condidate is not exist");
//   res.send(condidate);
// })

// router.delete('/:id', async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(400).send("invalid id");
//   //some
//   const condidate = await Condidate.findByIdAndRemove(req.params.id);
//   if (!condidate) return res.status(404).send("condidate is not exist");
//   res.send(condidate);
// })

module.exports = router;