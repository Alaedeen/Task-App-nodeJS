import request from 'supertest'
import { app } from '../src/app.js'
import { test, beforeEach, expect, afterAll } from '@jest/globals'
import { userOneId, userOne, setupDatabase, disconnectFromDatabase } from "./fixtures/db.js";
import { Task } from "../src/models/task.js";

beforeEach(setupDatabase)

afterAll(disconnectFromDatabase)

test('Should create task for user', async ()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From my test'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
    expect(task.owner._id).toEqual(userOneId)
})