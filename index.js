const { connectToMongoDB } = require('./mongo');
const express = require('express');
const router = require('./server/indexRouter');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const helmet = require('helmet');

const cors = require('cors');

const connectToDB = async () => {
    await connectToMongoDB().then(async (mongoose) => {
        try {
            console.log('Successfully connnected to MongoDB!');
            
        } catch (e) {
            console.log('Could not connect to db', e);
        } finally {
            // mongoose.connection.close();
        }
    })
};
const app = express();
const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());


app.use(helmet());
app.use(cors());
app.use(express.static(__dirname));

// routes
app.get("/", (req, res) => {
    res.render("index");
});
app.use('/api', router);

app.listen(port, () => {
    console.log('App running in port: ', port);
})

connectToDB();
