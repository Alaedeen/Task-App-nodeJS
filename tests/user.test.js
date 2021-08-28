import request from 'supertest'
import { app } from '../src/app.js'
import { test } from '@jest/globals'

test('Signup a new user', async () => {
  await request(app)
    .post('/users')
    .send({
      name: 'Jon Doe',
      email: 'jonDoe@example.com',
      password: 'JonPass99!!',
    })
    .expect(201)
})