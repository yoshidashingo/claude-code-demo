import { Router } from 'express';
import { taskController, createTaskSchema, updateTaskSchema, reorderTaskSchema } from '../controllers/taskController';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', taskController.getTasks);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.put('/reorder', validate(reorderTaskSchema), taskController.reorderTasks);

export default router;