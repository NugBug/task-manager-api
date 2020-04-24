const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const { userOneId, userOne, setupDatabase } = require("./fixtures/dbConfig");

beforeEach(setupDatabase);

test("Should create an incomplete task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Test task"
    })
    .expect(201)

  const task = await Task.findById(response.body);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
})