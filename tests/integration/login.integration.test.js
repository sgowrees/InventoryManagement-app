const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../../backend/.env"),
    quiet: true
});

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../../backend/server"); // must export the Express app WITHOUT calling .listen() or mongoose.connect()
const User = require("../../backend/models/userModel");

let mongoServer;

beforeAll(async () => {
    // spin up a disposable in-memory MongoDB instead of connecting to the real one
    // binary.version is set to match the installed system mongod exactly,
    // so there's no version-mismatch warning when using MONGOMS_SYSTEM_BINARY
    mongoServer = await MongoMemoryServer.create({
        binary: {
            version: "7.0.39",
            systemBinary: process.env.MONGOMS_SYSTEM_BINARY
        }
    });
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany();

    await request(app)
        .post("/api/users/register")
        .send({
            name: "John",
            email: "test@test.com",
            password: "correctpass"
        });
});


describe("POST /api/users/login Integration Tests", () => {


    test("should reject missing email or password", async () => {

        const res = await request(app)
            .post("/api/users/login")
            .send({});

        expect(res.statusCode)
            .toBe(400);

    });


    test("should reject user that does not exist", async () => {

        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "fake@test.com",
                password: "password123"
            });

        expect(res.statusCode)
            .toBe(400);

    });


    test("should reject wrong password", async () => {

        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "test@test.com",
                password: "wrongpassword"
            });

        expect(res.statusCode)
            .toBe(400);

    });


    test("should login successfully", async () => {

        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "test@test.com",
                password: "correctpass"
            });

        expect(res.statusCode)
            .toBe(201);

        expect(res.body.email)
            .toBe("test@test.com");

        expect(res.body.token)
            .toBeDefined();

        expect(res.headers["set-cookie"])
            .toBeDefined();

    });


});