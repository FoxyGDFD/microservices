import * as bcrypt from 'bcryptjs';

export const encodePassword = (password: string): string => {
  const salt: string = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(password, salt);
};
