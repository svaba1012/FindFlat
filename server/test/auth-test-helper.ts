import request from "supertest";
import { app } from "../app";

export const signin = async () => {
  const email = "misa@misa.com";
  const username = "misa";
  const password = "password";

  const res = await request(app)
    .post("/api/users/signup")
    .send({ email, password, username })
    .expect(201);

  return res.get("Set-Cookie");
};
