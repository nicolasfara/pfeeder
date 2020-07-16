import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { Pet } from '../models/Pet';
import { UserDocument } from '../models/User';
import logger from '../util/logger';

export const getPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const petId = req.params.pet_id;
    const user = req.user as UserDocument;
    try {
        const pet = await Pet.findOne({ _id: petId, userId: user._id });
        if (!pet) {
            res.status(500).json({ code: 1, message: 'Unable o find the pet' });
        } else {
            logger.info(`Pet found: ${pet}`);
            res.json(pet);
        }
    } catch (e) {
        res.status(500).json({ code: 2, message: e });
    }
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
        rationPerDay: [],
    });
    try {
        const petSaved = await pet.save();
        if (petSaved) {
            res.json({ message: 'Pet insert successfully', pet: pet });
        } else {
            res.status(500).json({ code: 2, message: 'Error on save pet' });
        }
    } catch (e) {
        res.status(500).json({ code: 2, message: e });
    }
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

export const addRation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as UserDocument;
    const petId = req.params.pet_id;
    const name: string = req.body.name;
    const time: Date = req.body.time;
    const ration: number = req.body.ration;

    try {
        const addRationResult = await Pet.findOneAndUpdate(
            { _id: petId, userId: user._id },
            { $push: { rationPerDay: { name: name, time: time, ration: ration } } },
        );
        if (addRationResult) {
            res.json({ message: 'Ration added successfully' });
        } else {
            res.status(500).json({ code: 1, message: 'Error on add ration: not pet found' });
        }
    } catch (e) {
        res.status(500).json({ code: 2, message: e });
    }
};

export const getRations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as UserDocument;
    const petId = req.params.pet_id;
    try {
        const rations = await Pet.findOne({ _id: petId, userId: user._id }).select('rationPerDay');
        if (rations) {
            res.json({ rations: rations });
        } else {
            res.status(500).json({ code: 1, message: 'Unable to find the rations for the given pet' });
        }
    } catch (e) {
        res.status(500).json({ code: 2, message: e });
    }
};

export const updateRations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as UserDocument;
    const petId = req.params.pet_id;
    const rationId = req.params.ration_id;

    try {
        const pet = await Pet.findOneAndUpdate(
            { _id: petId, userId: user._id, 'rationPerDay.name': rationId },
            { $set: { 'rationPerDay.$': req.body } },
        );
        logger.info(pet);
        if (pet) {
            res.json({ message: 'Update successfully' });
        } else {
            res.status(500).json({ code: 1, message: 'Unable to find the rationUpdate for the given pet' });
        }
    } catch (e) {
        res.status(500).json({ code: 2, message: e });
    }
};

export const deleteRations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as UserDocument;
    const petId = req.params.pet_id;
    const rationId = req.params.ration_id;

    try {
        const deletedRation = await Pet.findOneAndUpdate(
            {
                _id: petId,
                userId: user._id,
                'rationPerDay.name': rationId,
            },
            { $pull: { rationPerDay: { name: rationId } } },
        );
        if (deletedRation) {
            res.json({ message: `delete ration successfully: ${deletedRation}` });
        } else {
            res.status(500).json({ code: 1, message: 'Unable to find the pet or the ration' });
        }
    } catch (e) {
        res.status(500).json({ code: 1, message: e });
    }
};
