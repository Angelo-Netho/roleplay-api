import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'
import { assert } from '@japa/preset-adonis'
import mail from 'Config/mail'
import test, { group } from 'japa'
import supertest from 'supertest'

import { UserFactory } from './../../database/factories/index'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Password', (group) => {
  test.only('it should send an email with forgot password instructions', async (assert) => {
    const user = await UserFactory.create()

    await supertest(BASE_URL)
      .post('/forgot-password')
      .send({
        email: user.email,
        resetPasswordUrl: 'url',
      })
      .expect(204)

    const mailer = Mail.fake()

    const message = mailer.find((mail) => {
      return mail.to![0].address === user.email
    })

    assert.deepEqual(message?.to![0].address, user.email)
    assert.deepEqual(message?.from?.address, 'no-reply@roleplay.com')
    assert.equal(message?.subject, 'Roleplay: Recuperação de Senha')
    assert.include(message?.html!, user.username)

    Mail.restore()
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
