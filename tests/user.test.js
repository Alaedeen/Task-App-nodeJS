import request from 'supertest'
import { app } from "../src/app.js";
import {test, jest} from '@jest/globals';


jest.useFakeTimers()

test('Signup a new user', async ()=>{
    await request(app).post('/users').send({
        name: 'Jon Doe',
        email: 'jonDoe@example.com',
        password: 'JonPass99!!'
    }).expect(201)
}) 