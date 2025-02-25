const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerDocs = require('./swagger'); // Import the Swagger setup module
const multer = require('multer');
const ConnectDB = require('./connection');
const auth = require('./auth');
const loginRoute = require('./routes/login'); 
const registerRoute = require('./routes/register');
const aboutRoute = require('./routes/about'); 
const articleRoute = require('./routes/article'); 
const awardRoute = require('./routes/award'); 
const blogRoute = require('./routes/blog'); 
const categoryRoute = require('./routes/category');
const consultationRoute = require('./routes/consultation');
const contactRoute = require('./routes/contact');
const expertRoute = require('./routes/expert');
const faqRoute = require('./routes/faq');
const profileRoute = require('./routes/profile');
const projectRoute = require('./routes/project');
const serviceRoute = require('./routes/service');
const testimonialRoute = require('./routes/testimonial');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// DataBase Connection
ConnectDB();

// Use the login and register routes
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/about', aboutRoute);
app.use('/article', articleRoute);
app.use('/award', awardRoute);
app.use('/blog', blogRoute);
app.use('/category', categoryRoute);
app.use('/consultation', consultationRoute);
app.use('/contact', contactRoute);
app.use('/expert', expertRoute);
app.use('/faq', faqRoute);
app.use('/profile', profileRoute);
app.use('/project', projectRoute);
app.use('/service', serviceRoute);
app.use('/testimonial', testimonialRoute);

app.post('/auth/login', auth.login);
app.post('/auth/register', auth.register);

swaggerDocs(app)

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
