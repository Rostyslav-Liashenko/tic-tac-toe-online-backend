import { Request, Response } from "express";

const express = require('express');
const app = express();

const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('it is ok!');
});

app.listen(port, () => {
    console.log('Server is start !!!');
});