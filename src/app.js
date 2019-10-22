import express, { json, urlencoded } from 'express'
import morgan from 'morgan'
import { usersRoute, companiesRoute } from './routes'
import { RequestError } from './errors'

const app = express()

app.use(morgan('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))

app.use('/users', usersRoute)
app.use('/companies', companiesRoute)

app.use((req, res, next) => {
    const error = new RequestError({
        message: 'Not Found',
        status: 404,
    })
    next(error)
})

app.use((error, req, res, next) => {
    if (typeof error === 'string') {
        return res.status(500).json({
            error,
        })
    }

    res.status(error.status).json({
        error: {
            message: error.message,
        },
    })
})

export default app
