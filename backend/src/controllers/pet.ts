import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { Pet } from '../models/Pet';
import { UserDocument } from '../models/User';
import logger from '../util/logger';
import { DocumentQuery } from 'mongoose';

export const getPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const petId = req.params.pet_id;
    const user = req.user as UserDocument;
    Pet.findOne({ _id: petId, userId: user._id })
        .then((pet) => {
            if (!pet) {
                res.status(500).json({ code: 1, message: 'Unable o find the pet' });
            } else {
                logger.info(`Pet found: ${pet}`);
                res.json(pet);
            }
        })
        .catch((err) => {
            res.status(500).json({ code: 2, message: err });
        });
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

export const putPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as UserDocument;
    const petId = req.params.pet_id;

    try {
        const updatedPet = await Pet.findOneAndUpdate({ _id: petId, userId: user._id }, req.body);
        if (!updatedPet) {
            res.status(500).json({ code: 1, message: 'Unable to find the pet' });
        } else {
            res.json({ message: 'Pet update successfully' });
        }
    } catch (e) {
        res.status(500).json({ code: 3, message: e });
    }
};

export const deletePet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as UserDocument;
    const petId = req.params.pet_id;

    try {
        const deleteResult = await Pet.findOneAndDelete({ _id: petId, userId: user._id });
        if (deleteResult) {
            res.json({ message: 'Pet delete successfully' });
        } else {
            res.status(500).json({ code: 1, message: 'Unable to delete the pet' });
        }
    } catch (e) {
        res.status(500).json({ code: 2, message: e });
    }
};
