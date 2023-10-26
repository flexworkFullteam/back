const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { User } = require('../DB_connection');

const client = jwksClient({
    jwksUri: 'YOUR_JWKS_URI'
});

function getKey(header, callback){
    client.getSigningKey(header.kid, function(err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

const auth0Middleware = (req, res, next) => {
    const token = req.headers.authorization;
    
    jwt.verify(token, getKey, {
        audience: 'YOUR_AUTH0_AUDIENCE',
        issuer: 'YOUR_AUTH0_ISSUER',
        algorithms: ['RS256']
    }, async (err, decoded) => {
        if (err) return res.status(401).send({ message: 'Unauthorized' });

        req.auth0Id = decoded.sub;
        req.email = decoded.email;

        next();
    });
};

module.exports = auth0Middleware;
