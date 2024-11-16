import { Request, Response } from 'express';
import * as userService from '../services/user';
import mongoose from 'mongoose';
import User from '../models/user';
import { updateVideoCountsForInterview } from '../services/interview';

// Yeni kullanıcı oluşturma

export const createUserAndAssignToInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, kvkkAccepted } = req.body;
    const { interviewId } = req.params;

    const newUser = await userService.createUserAndAssignToInterview(firstName, lastName, email, phone, kvkkAccepted, new mongoose.Types.ObjectId(interviewId));

    res.status(201).json({ message: 'User created and associated with the interview', user: newUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error creating user or associating with interview', error: error.message });
    } else {
      res.status(500).json({ message: 'Error creating user or associating with interview', error: 'Unknown error' });
    }
  }
};


// Tüm kullanıcıları listeleme
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { notes, status, interviewId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID format' });
      return;
    }

    const watched = status === 'Passed' || status === 'Failed';

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { notes, status, watched },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // İzleme durumunu güncelledikten sonra Interview modelindeki sayacı güncelle
    await updateVideoCountsForInterview(interviewId);

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const trimmedUserId = userId.trim();

    // ObjectId formatında olup olmadığını kontrol edin
    if (!mongoose.Types.ObjectId.isValid(trimmedUserId)) {
      res.status(400).json({ message: 'Invalid user ID format' });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(trimmedUserId);
    if (!deletedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted', deletedUser });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Kullanıcı uyarı durumunu güncelleme
export const updateUserAlert = async (req: Request, res: Response): Promise<void>  => {
  const { userId } = req.params;
  const { alert } = req.body;

  try {
    // Veritabanında kullanıcıyı bul ve alert alanını güncelle
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { alert: alert },
      { new: true } // Güncellenmiş kullanıcıyı döndür
    );

    if (!updatedUser) {
       res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Alert status updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating alert status:', error);
    res.status(500).json({ message: 'Error updating alert status', error });
  }
};
