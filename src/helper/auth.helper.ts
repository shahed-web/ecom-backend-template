import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  userPass: string,
  hashedPass: string
): Promise<boolean> => {
  return await bcrypt.compare(userPass, hashedPass);
};

