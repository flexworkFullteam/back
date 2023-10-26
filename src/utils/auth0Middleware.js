const auth0Middleware = (req, res, next) => {
    console.log('Received JSON:', req.body);  // Log the received JSON
    const { name, sub } = req.body;
    const provider = sub.split('|')[0];  // Extract the provider from the sub property
    // Normalize provider name (e.g., google-oauth2 -> google, linkedin -> linkedin)
    const normalizedProvider = provider.replace('-oauth2', '');
    // Construct auth0Id
    const auth0Id = `${normalizedProvider}${name}Auth0`;
    // Attach extracted data to the request object
    req.auth0Id = auth0Id;
    req.email = req.body.email;
    next();
};

module.exports = auth0Middleware;