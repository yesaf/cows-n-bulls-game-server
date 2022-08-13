import { Request, Response, Router } from 'express';
import checkRegister from '../../middlewares/checkRegister';
import response from '../../middlewares/response';
import userController from '../../controllers/user.controller';
import validate from '../../middlewares/validate';
import { loginSchema, registerSchema } from '../../utils/validationSchemas';

const router: Router = Router();


router.post(
    '/register',
    validate(registerSchema),
    checkRegister,
    response(userController.register.bind(userController)),
);
router.post(
    "/login",
    validate(loginSchema),
    response(userController.login.bind(userController)),
);
router.post('/logout');
router.get('/activate/:link');
router.get('/refresh', (req: Request, res: Response) => {
    res.send('Refresh');
});
router.get('/users');

export default router;
