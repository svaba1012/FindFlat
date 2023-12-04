import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/auth-test-helper";

it("returns 200 hundred on successfull login and cookie with email", async () => {
  await signin();
  let res = await request(app)
    .post("/api/users/signin")
    .send({ emailOrUsername: "misa@misa.com", password: "misa" })
    .expect(200);
  expect(res.get("Set-Cookie")).toBeDefined();
});

it("returns 200 hundred on successfull login and cookie with username", async () => {
  await signin();
  let res = await request(app)
    .post("/api/users/signin")
    .send({ emailOrUsername: "misa@misa.com", password: "misa" })
    .expect(200);
  expect(res.get("Set-Cookie")).toBeDefined();
});

it("returns 400 hundred on bad email", async () => {
  let res = await request(app)
    .post("/api/users/signup")
    .send({ email: "misa@misacom", password: "misa", username: "glisa" })
    .expect(400);
});

it("returns 400 hundred on bad username", async () => {
  let res = await request(app)
    .post("/api/users/signup")
    .send({ email: "misa@misa.com", password: "misa", username: "gla" })
    .expect(400);
});

it("returns 400 hundred on bad password", async () => {
  let res = await request(app)
    .post("/api/users/signup")
    .send({ email: "misa@misa.com", password: "msa", username: "glisa" })
    .expect(400);
});

it("returns 400 hundred if user already exists", async () => {
  await signin();
  let res = await request(app)
    .post("/api/users/signup")
    .send({ email: "misa@misacom", password: "misa", username: "misa" })
    .expect(400);
});

it("returns 400 hundred on bad signin", async () => {
  await signin();
  let res = await request(app)
    .post("/api/users/signin")
    .send({ emailOrUsername: "misa@misa1.com", password: "misa" })
    .expect(400);
  expect(res.get("Set-Cookie")).toBeUndefined;
});

it("returns 200 on signout when registered", async () => {
  let cookie = await signin();
  let res = await request(app)
    .post("/api/users/signout")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(res.get("Set-Cookie")).toBeDefined;
});

it("returns 401 on signout when not registered", async () => {
  let res = await request(app).post("/api/users/signout").send().expect(401);
});
