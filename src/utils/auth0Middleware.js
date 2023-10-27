const auth0Middleware = (req, res, next) => {
    console.log('Received JSON:', req.body);  // Log the received JSON
    const { sub, email, name } = req.body;
    const provider = sub.split('|')[0];  // Extract the provider from the sub property
    // Normalize provider name (e.g., google-oauth2 -> google, linkedin -> linkedin)
    const normalizedProvider = provider.replace('-oauth2', '');
    // Construct auth0Id
    const auth0Id = `${normalizedProvider}${name}Auth0`;
    // Check if email exists, if not it's probably LinkedIn or another provider without email
    if (!email && normalizedProvider === 'linkedin') {
        // Create a placeholder email using the auth0Id
        req.email = `${auth0Id}@${auth0Id}.com`;
    } else {
        req.email = email;
    }
    // Attach extracted data to the request object
    req.auth0Id = auth0Id;
    next();
};


module.exports = auth0Middleware;