import type { Request, Response } from "express";
import { updateUserById } from "../../utils/user";

function dateConversion(strDateOfBirth: string) {
  if(!strDateOfBirth) return null;
  let numberDateOfBirth = strDateOfBirth.replaceAll('-', '');
  return Number(numberDateOfBirth);
}

export const updateBasicInfo = async (
  req: Request,
  res: Response
) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const { fullName, phoneNumber, gender, dateOfBirth, username } = req.body;

  const updates: Record<string, unknown> = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
  if (gender !== undefined) updates.gender = gender;
  if (dateOfBirth !== undefined) updates.dateOfBirth = dateConversion(dateOfBirth);
  if (username !== undefined) updates.username = username;

  try {
    const updatedUser = await updateUserById(userId, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error("Unexpected Error", err);
    res.status(500).json({ message: "Unexpected Error" });
  }
};
