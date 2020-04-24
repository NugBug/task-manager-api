const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/dbConfig")

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Josh",
      email: "josh@example.com",
      password: "red12345",
    })
    .expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
      user: {
        name: "Josh",
        email: "josh@example.com"
      },
      token: user.tokens[0].token
    });
    expect(user.password).not.toBe("red12345");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexisting user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "notanemail@example.com",
      password: "wrongpassword",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Shold not get profile for unauthenticated user", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401);
});

test("should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      age: 100
    })
    .expect(200)
  
  const user = await User.findById(userOneId);
  expect(user.age).toEqual(100);
});

test("should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      nonsense: 100
    })
    .expect(400)
});


test("Shold not delete account for unauthenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});

test("Should delete acount for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated