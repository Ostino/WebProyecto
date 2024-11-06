import 'dotenv/config'
import pg from 'pg'

const {Pool} = pg

const connectionString ='postgresql://postgres:israel12@localhost:5432/CuevaAlejandria'

export const db = new Pool({
    allowExitOnIdle:true,
    connectionString
})
try{
    await db.query('SELECT NOW()')
    console.log('DATABASE connected')
}catch(error){
    console.log(error)
}