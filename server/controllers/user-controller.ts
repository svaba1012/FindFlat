import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/user-model";
import { BadRequestError } from "../errors/BadRequestError";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  let { email, username, password } = req.body;

  let existingUser = await User.findOne({ username });
  if (existingUser) {
    next(
      new BadRequestError(
        `User with ${username} username already exists`,
        "username"
      )
    );
    return;
  }
  let hashedPassword = await bcrypt.hash(password, 8);
  let user = new User({ email, username, password: hashedPassword });
  await user.save();

  let token = jwt.sign(user.toJSON(), process.env!.JWT_KEY);

  req.session = { token };

  res.send(user);
};
const signin = async (req: Request, res: Response, next: NextFunction) => {
  let { emailOrUsername, password } = req.body;
  let user = await User.findOne({
    $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
  });
  if (!user) {
    next(new BadRequestError("Invalid username, email or password"));
    return;
  }

  let passwordMatch = bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    next(new BadRequestError("Invalid username, email or password"));
    return;
  }

  res.send(user);
};

const signout = (req: Request, res: Response, next: NextFunction) => {};

export default { signin, signup, signout };
