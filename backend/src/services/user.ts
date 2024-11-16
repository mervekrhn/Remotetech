import mongoose from 'mongoose';
import User, { IUser } from '../models/user';
import Interview from '../models/interview';

export const createUserAndAssignToInterview = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  kvkkAccepted: boolean,
  interviewId: mongoose.Types.ObjectId
): Promise<IUser> => {
  // Check if interviewId is valid
  if (!mongoose.isValidObjectId(interviewId)) {
    throw new Error('Invalid Interview ID');
  }

  // Find the interview by interviewId
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    throw new Error('Interview not found');
  }

  // Create a new user instance
  const newUser = new User({ firstName, lastName, email, phone, kvkkAccepted });

  // Save the new user to the database
  const savedUser = await newUser.save();

  // Cast savedUser._id to mongoose.Schema.Types.ObjectId
  const userId = savedUser._id as unknown as mongoose.Schema.Types.ObjectId;

  // Add the new user's ID to the userId array in the interview
  interview.userId.push(userId);

  // Save the updated interview document
  await interview.save();

  // Return the newly created user
  return savedUser;
};




export const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

// Tüm kullanıcıları listeleme
export const getUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

// Belirli bir kullanıcıyı silme
export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};
