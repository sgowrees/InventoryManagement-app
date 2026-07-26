const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    path: "/",
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
};

const setAuthCookie = (res, token) => {
    res.cookie("token", token, {
        ...cookieOptions,
        expires: new Date(Date.now() + 1000 * 86400),
    });
};

const clearAuthCookie = (res) => {
    res.cookie("token", "", {
        ...cookieOptions,
        expires: new Date(0),
    });
};

module.exports = { cookieOptions, setAuthCookie, clearAuthCookie };
