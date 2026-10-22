export const sendToken = async (user, res, statusCode) => {
    const token = user.createJWT();

    const options = {
        expires : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    return res.status(statusCode).cookie("token", token, options).json({
        success : true,
        token,
        user
    }) 
}