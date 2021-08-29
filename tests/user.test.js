import request from 'supertest'
import { app } from '../src/app.js'
import { test, beforeEach, expect, afterAll } from '@jest/globals'
import { User } from '../src/models/user.js'
import { userOneId, userOne, setupDatabase, disconnectFromDatabase } from "./fixtures/db.js";

beforeEach(setupDatabase)

afterAll(disconnectFromDatabase);

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'Jon Doe',
      email: 'jondoe@example.com',
      password: 'JonPass99!!',
    })
    .expect(201)

  // assert that the database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Jon Doe',
      email: 'jondoe@example.com',
    },
    token: user.tokens[0].token,
  })
  expect(user.password).not.toBe('JonPass99!!')
})

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200)

  // assert that the token in the response matches users second token
  const user = await User.findById(userOneId)
  expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'dummy@user.com',
      password: 'dummyPassword!',
    })
    .expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(401)
})

test('Should delete profile for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  // asset user is deleted
  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete profile for unauthenticated user', async () => {
  await request(app).delete('/users/me').send().expect(401)
})

test('Should upload avatar image', async () => {
  await request(app).post('/users/me/avatar')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .attach('avatar', 'tests/fixtures/profile-pic.png')
  .expect(200)

  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app).patch('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({
    name: 'dummy user'
  })
  .expect(200)

  const user = await User.findById(userOneId)
  expect(user.name).toBe('dummy user')
})


test('Should not update invalid user fields', async () => {
  await request(app).patch('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({
    location: 'Sousse'
  })
  .expect(400)
})
