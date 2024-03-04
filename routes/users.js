const express = require('express');
const passport = require("passport");
const userController = require('../controllers/userController');

const router = express.Router();
const authenticateJWT = passport.authenticate('jwt', { session: false });

// router.use(authenticateJWT);
// router.use((req, res, next) => {
//   if (req.path === '/') {
//     authenticateJWT(req, res, next);
//   } else {
//     next();
//   }
// });

router.get('/', authenticateJWT, userController.getAllUser);

// /member/courses => POST
router.post('/register', userController.postAddUser);


router.post('/login', userController.postLoginUser);

// router.get('/edit-course/:courseId', courseController.getEditCourse);

// router.put('/edit-course/:courseId', courseController.putEditCourse);

// router.post('/edit-course', courseController.postEditCourse);

// router.delete('/delete-course', courseController.deleteCourse);

module.exports = router;