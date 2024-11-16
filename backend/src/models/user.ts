import mongoose, { Schema, Document } from 'mongoose';

// Kullanıcı tipi (Interface)
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kvkkAccepted: boolean;  // KVKK onayı
  videoId : string;
  notes: string; // Kullanıcının notları
  status: string | null; // Başlangıçta boş
  watched: boolean;
  alert: boolean; // Yeni alan eklendi

  
}

// Kullanıcı şeması (Mongoose Schema)
const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  kvkkAccepted: { type: Boolean, required: true },
  videoId: { type: String, required: false },
  notes: { type: String, default: "" }, // Varsayılan boş
  status: { type: String, enum: ["Passed", "Failed"], default: null }, // Başlangıç değeri boş (null)
  watched: { type: Boolean, default: false },
  alert: { type: Boolean, default: false }, // Varsayılan olarak false


});

// Model oluşturma
const User = mongoose.model<IUser>('User', userSchema);
export default User;
