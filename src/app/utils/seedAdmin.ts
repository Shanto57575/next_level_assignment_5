import { envVars } from "../config/env";
import bcrypt from "bcrypt";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const SeedAdmin = async () => {
  try {
    const email = envVars.ADMIN_EMAIL;
    const password = envVars.ADMIN_PASSWORD;

    const isAdminExists = await User.findOne({ email });

    if (isAdminExists) {
      console.log("Admin Already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      password as string,
      Number(envVars.BCRYPT_SALT_ROUNDS)
    );

    const auths: IAuthProvider = {
      provider: "credentials",
      providerId: email,
    };

    const adminPayload: IUser = {
      name: "Admin",
      email,
      password: hashedPassword,
      role: Role.ADMIN,
      auths,
      isVerified: true,
    };

    const adminInfo = await User.create(adminPayload);
    if (adminInfo) {
      console.log("Admin Created successfully!");
    }
  } catch (error) {
    console.log(error);
  }
};
