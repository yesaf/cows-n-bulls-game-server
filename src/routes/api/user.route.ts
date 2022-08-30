import { Router } from 'express';
import checkRegister from '../../middlewares/checkRegister';
import response from '../../middlewares/response';
import userController from '../../controllers/user.controller';
import validate from '../../middlewares/validate';
import { loginSchema, registerSchema } from '../../utils/validationSchemas';
import authMiddleware from '../../middlewares/auth.middleware';

const router: Router = Router();

router.post(
    '/register',
    validate(registerSchema),
    checkRegister,
    response(userController.register.bind(userController)),
);
router.post(
    '/login',
    validate(loginSchema),
    response(userController.login.bind(userController)),
);
router.post('/logout',
    response(userController.logout.bind(userController)),
);
router.get('/activate/:link',
    userController.activate.bind(userController),
);
router.get('/refresh',
    response(userController.refresh.bind(userController)),
);
router.get('/check',
    authMiddleware,
    response(userController.checkAuth.bind(userController)),
);

router.get('/',
    response(userController.getUserById.bind(userController))
);

export default router;
