const errorMiddleware = (err, req, res, next) => {
    /*
    Create a subscription -> middleware (check for renewal date) -> middleware (check for errors) -> next -> controler
    */
    try {
        // Creates a "shallow copy" of the original error object. It allows you to modify the error (like changing the status code) without mutating the original error object immediately.
        let error = { ...err };
        // Ensuring the human-readable message is attached to your new error object.
        error.message = err.message;
        console.log(err);

        // Mongoose bad ObjectId
        if (err.name === 'CastError') {
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        // Mongoose Duplicate Key
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        // Mongoose validation error
        if (err.name === 'Validation Error') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }

        res.status(err.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;