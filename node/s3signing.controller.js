const responses = require('../models/responses')
const filesService = require('../services/files.service');

const getSignedUrl = (req, res) => {
    const filename = req.query.filename;
    const filetype = req.query.filetype;

    const promise = filesService.getSignedUrl(filename, filetype);

    promise
        .then(response => {
            const responseObj = new responses.ItemsResponse();
            responseObj.items = response;
            res.status(200).json(responseObj)
        })
        .catch(error => {
            const responseObj = new responses.ErrorResponse();
            responsesObj.errors = error.stack;
            res.status(500).send(responseObj);
        })
}

module.exports = {
    getSignedUrl,
}
