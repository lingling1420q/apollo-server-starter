import { Sequelize } from 'sequelize-typescript'
import _ from 'lodash'
import { dbLogger, cache } from '../lib'
import * as models from './models'

const { createContext, EXPECTED_OPTIONS_KEY } = require('dataloader-sequelize')

const config = require('../config/db.json')
const sequelize = new Sequelize({
  ...config,
  define: {
    timestamps: false,
    underscored: true
  },
  logging (sql, timing) {
    dbLogger.info(sql, _.isObject(timing) ? timing : { timing })
  }
})

sequelize.addModels(Object.values(models))

const contextOption = {
  get [EXPECTED_OPTIONS_KEY] () {
    const key = 'SequelizeContext'
    if (cache.get(key)) {
      return cache.get(key)
    }
    const context = createContext(sequelize)
    cache.set(key, context)
    return context
  }
}

export default sequelize
export { models, contextOption }
