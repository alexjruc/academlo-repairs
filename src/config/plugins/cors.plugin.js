import cors from 'cors'

export const enableCors = (app, acceptedOrigins) => {
    app.use(cors())
}