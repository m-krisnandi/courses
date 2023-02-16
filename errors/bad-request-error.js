import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {

    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.message = message;

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return [
            { message: this.message }
        ];
    }
}