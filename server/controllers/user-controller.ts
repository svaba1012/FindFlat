import { NextFunction, Request, Response, query } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/user-model";
import { BadRequestError } from "../errors/BadRequestError";
import { EmailService } from "../services/email/email-service";
import { UnauthorizedError } from "../errors/UnauthorizedError";

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
  let user = new User({
    email,
    username,
    password: hashedPassword,
    verified: false,
  });
  await user.save();

  let tempToken = jwt.sign(user.toJSON(), process.env!.JWT_TEMP_KEY);
  let emailToken = jwt.sign(user.toJSON(), process.env!.EMAIL_JWT_KEY);

  new EmailService().sendVerificationMail(
    user.email,
    user.username,
    user.id,
    emailToken
  );

  res.cookie("tempJwt", tempToken);

  res.status(201).send(user);
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

  if (user.verified) {
    let token = jwt.sign(user.toJSON(), process.env!.JWT_KEY);
    req.session = { jwt: token };
  } else {
    let token = jwt.sign(user.toJSON(), process.env!.JWT_TEMP_KEY);
    res.cookie("tempJwt", token);
  }

  res.send(user);
};

const signout = (req: Request, res: Response, next: NextFunction) => {
  req.session = null;
  res.send({});
};

const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { id } = req.params;
  let { token } = req.query;

  let user = await User.findById(id);
  if (!user) {
    next(new UnauthorizedError());
    return;
  }

  try {
    if (!jwt.verify(token as string, process.env.EMAIL_JWT_KEY)) {
      next(new UnauthorizedError());
      return;
    }
  } catch (e) {
    next(new UnauthorizedError());
    console.log("Server error! " + e);
    return;
  }

  user.verified = true;
  await user.save();

  let token1 = jwt.sign(user.toJSON(), process.env.JWT_KEY);

  req.session = { jwt: token1 };

  res.redirect("http://localhost:3000");
};

export default { signin, signup, signout, confirmEmail };
