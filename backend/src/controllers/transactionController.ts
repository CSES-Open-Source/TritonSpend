import { Request, Response } from 'express';
import { check, validationResult, CustomValidator } from 'express-validator';
import moment from 'moment';

const dateValid: CustomValidator = (value: string) => {
    return moment(value, 'YYYY-MM-DD', true).isValid();
}

export const postTransaction = [
    check('userId').isInt().withMessage('User ID has to be an integer!'),
    check('amount').isDecimal().withMessage('Amount has to be a decimal!'),
    check('category').not().isEmpty().withMessage('Please input category'),
    check('date')
        .custom(dateValid)
        .withMessage('Date should be in YYYY-MM-DD format')
];

// Will add transaction validation and status code checks once db is setup