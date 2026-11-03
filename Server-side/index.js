import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { dbExcute } from './src/dbConfig/dbConnect.js';
import { installRout } from './src/Routes/install.routes.js';
import { authRoute } from './src/Routes/auth.routes.js';
import { userRoute } from './src/Routes/manageUser.routes.js';
import { employeeRoute } from './src/Routes/manageEmployee.routes.js';
// Capitalize variable names carefully (good practice is lowercase 'port' or uppercase 'PORT')
const PORT = process.env.PORT || 5000; 

const app = express();
// use third party api
app.use(cors());
app.use(express.json())

app.get('/health', (req, res)=>{
  res.send(" the server is listen properly")
})

app.use('/api', installRout);
app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', employeeRoute);
// Pass the PORT variable first, then the callback function
app.listen(PORT, async () => {
  console.log(`The Server is listening on port ${PORT}`);
  
  // Test if database is working correctly
  try {
    await dbExcute('SELECT 1', []);
    console.log('Connected to MySQL Database successfully!');
  } catch (error) {
    console.error('An error happened while connecting to the database:', error.message);
    // አማራጭ፡ ዳታቤዙ ካልተገናኘ ሰርቨሩ እንዳይነሳ ማድረግ
    process.exit(1);
  }
});
