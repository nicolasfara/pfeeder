import { Request, Response } from 'express';
import { UserDocument } from '../models/User';
import { Notification } from '../models/Notification';

export const getNotifications = (req: Request, res: Response) => {
    const user = req.user as UserDocument;
    Notification.where('userId')
        .equals(user.id)
        .then((not) => res.json({ status: 'success', data: not }))
        .catch((err) => res.send(err));
};
