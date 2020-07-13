import { NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import { Pet } from '../models/Pet';
import { UserDocument } from '../models/User';
import { isNumber } from 'util';

export const getPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.json({ message: 'OK' });
};

export const postPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check('name').run(req);
    await check('age').isNumeric().run(req);
    await check('petType').run(req);
    await check('currentFodder').run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({
            code: 1,
            message: errors.array(),
        });
    }
    const user = req.user as UserDocument;
    const pet = new Pet({
        userId: user._id,
        name: req.body.name,
        age: req.body.age,
        petType: req.body.petType,
        currentFodder: req.body.currentFodder,
        breed: req.body.breed || 'other',
    });
    pet.save()
        .then((pet) => {
            res.json({ message: 'Pet insert successfully', pet: pet });
        })
        .catch((err) => {
            res.status(500).json({ code: 2, message: err });
        });
};
