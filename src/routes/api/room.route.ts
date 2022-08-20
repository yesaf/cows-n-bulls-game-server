import { Router } from 'express';
import response from '../../middlewares/response';
import roomController from '../../controllers/room.controller';
import validate from '../../middlewares/validate';
import { createRoomSchema } from '../../utils/validationSchemas';
import authMiddleware from '../../middlewares/auth.middleware';

const router: Router = Router();

router.post('/',
    validate(createRoomSchema),
    authMiddleware,
    response(roomController.create.bind(roomController)),
);

router.get('/',
    response(roomController.find.bind(roomController)),
);

router.delete('',
    authMiddleware,
    response(roomController.delete.bind(roomController)),
);

router.post('/connect',
    authMiddleware,
    response(roomController.connect.bind(roomController)),
);

router.post('/disconnect',
    authMiddleware,
    response(roomController.disconnect.bind(roomController)),
);

export default router;
