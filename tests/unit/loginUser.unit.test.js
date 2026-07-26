process.env.JWT_SECRET = "testsecret";

jest.mock("../../backend/models/userModel");

// IMPORTANT: this package name must match EXACTLY what userController.js requires.
// Check the top of backend/controllers/userController.js:
//   const bcrypt = require("bcrypt");    <- if this, keep "bcrypt" below
//   const bcrypt = require("bcryptjs");  <- if this, change both lines below to "bcryptjs"
jest.mock("bcryptjs", () => ({
    compare: jest.fn()
}));

jest.mock("../../backend/utils/cookieOptions", () => ({
    setAuthCookie: jest.fn(),
    clearAuthCookie: jest.fn()
}));


const bcrypt = require("bcryptjs"); // must match the jest.mock() call above
const User = require("../../backend/models/userModel");
const { loginUser } = require("../../backend/controllers/userController");
const { setAuthCookie } = require("../../backend/utils/cookieOptions");


const mockRequest = (body = {}) => ({
    body
});


const mockResponse = () => {

    const res = {};

    res.status = jest.fn()
        .mockReturnValue(res);

    res.json = jest.fn()
        .mockReturnValue(res);

    res.cookie = jest.fn()
        .mockReturnValue(res);

    return res;
};



describe("loginUser Unit Tests", () => {


    beforeEach(() => {
        jest.clearAllMocks();
    });



    test("should reject missing email or password", async () => {

        const req = mockRequest({
            email: "",
            password: ""
        });

        const res = mockResponse();


        await expect(
            loginUser(req, res)
        )
        .rejects
        .toThrow("Please add email and password");


        expect(res.status)
            .toHaveBeenCalledWith(400);

    });



    test("should reject user not found", async () => {

        User.findOne
            .mockResolvedValue(null);


        const req = mockRequest({
            email: "test@test.com",
            password: "password123"
        });


        const res = mockResponse();


        await expect(
            loginUser(req, res)
        )
        .rejects
        .toThrow("User not found, please signup");


        expect(User.findOne)
            .toHaveBeenCalledWith({
                email: "test@test.com"
            });

    });



    test("should reject incorrect password", async () => {

        User.findOne
            .mockResolvedValue({

                _id: "123",

                password: "hashedPassword"

            });


        bcrypt.compare
            .mockResolvedValue(false);



        const req = mockRequest({

            email: "test@test.com",

            password: "wrongpassword"

        });



        const res = mockResponse();



        await expect(
            loginUser(req, res)
        )
        .rejects
        .toThrow("Invalid email or password");



        expect(bcrypt.compare)
            .toHaveBeenCalledTimes(1);



        expect(bcrypt.compare)
            .toHaveBeenCalledWith(
                "wrongpassword",
                "hashedPassword"
            );

    });



    test("should login successfully", async () => {


        const fakeUser = {

            id: "123",

            _id: "123",

            name: "John",

            email: "test@test.com",

            photo: "photo.jpg",

            phone: "123456789",

            bio: "test bio",

            password: "hashedPassword"

        };


        User.findOne
            .mockResolvedValue(fakeUser);



        bcrypt.compare
            .mockResolvedValue(true);



        const req = mockRequest({

            email: "test@test.com",

            password: "password123"

        });



        const res = mockResponse();



        await loginUser(req, res);



        expect(bcrypt.compare)
            .toHaveBeenCalledWith(
                "password123",
                "hashedPassword"
            );


        expect(setAuthCookie)
            .toHaveBeenCalledWith(
                res,
                expect.any(String)
            );


        expect(res.status)
            .toHaveBeenCalledWith(201);



        expect(res.json)
            .toHaveBeenCalledWith(
                expect.objectContaining({

                    email: "test@test.com",

                    token: expect.any(String)

                })
            );

    });


});