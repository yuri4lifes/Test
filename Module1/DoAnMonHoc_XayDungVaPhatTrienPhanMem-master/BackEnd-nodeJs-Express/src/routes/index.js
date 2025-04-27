const siteRoute = require('./site');
const userRoute = require('./userApi');
const courseRoute = require('./courseApi');
const lessonRoute = require('./lessonApi');
const uploadRoute = require('./uploadApi');
const activitieRoute = require('./activitieApi');
const paymentRoute = require('./paymentApi');
const orderRoute = require('./orderApi');

function route(app) {
    app.use('/v1/api', userRoute);
    app.use('/v1/api', courseRoute);
    app.use('/v1/api', uploadRoute);
    app.use('/v1/api', lessonRoute);
    app.use('/v1/api', activitieRoute);
    app.use('/v1/api', paymentRoute);
    app.use('/v1/api', orderRoute);
    app.use('/', siteRoute);
}

module.exports = route;
