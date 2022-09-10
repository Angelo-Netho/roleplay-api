import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
test.group('User', () => {
  test.only('it should create an user', async (assert) => {
    const userPayLoad = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
      avatar: 'https://images.com/image/1',
    }
    const { body } = await supertest(BASE_URL).post('/users').send(userPayLoad).expect(201)
    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')
    assert.equal(body.user.email, userPayLoad.email)
    assert.equal(body.user.username, userPayLoad.username)
    assert.equal(body.user.avatar, userPayLoad.avatar)
    assert.notExists(body.user.password, 'Password defined')
  })
})
