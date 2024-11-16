import { Request, Response } from 'express';
import * as questionPackageService from '../services/question';

// Create new question package
export const createPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { packageName, questions, questions_time } = req.body;
    const newPackage = await questionPackageService.createQuestionPackage(packageName, questions, questions_time);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating package', error });
  }
};

// Get all question packages
export const getPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const packages = await questionPackageService.getQuestionPackages();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages', error });
  }
};

// Update a question package
export const updatePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { packageName, questions } = req.body;
    const updatedPackage = await questionPackageService.updateQuestionPackage(id, packageName, questions);
    if (!updatedPackage) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }
    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: 'Error updating package', error });
  }
};

// Delete a question package
export const deletePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedPackage = await questionPackageService.deleteQuestionPackage(id);
    if (!deletedPackage) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }
    res.status(200).json({ message: 'Package deleted', deletedPackage });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting package', error });
  }
};