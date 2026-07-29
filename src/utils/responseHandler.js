const successResponse = (res, statusCode, message, data={} ) => {
    res.status(statusCode).send({ 
        success: true,
        message,
        data
    });
}


module.exports = {
    successResponse,
}