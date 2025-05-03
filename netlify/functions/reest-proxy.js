// netlify/functions/rewst-proxy.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Get the secret from environment variable
  // You've created this as "rewstsecret" in your Netlify environment variables
  const rewstSecret = process.env.REWSTSECRET;
  
  // CORS headers to allow your Netlify app to access this function
  const headers = {
    'Access-Control-Allow-Origin': '*', // Or replace with your specific domain
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  try {
    // Make the request to Rewst with the secret header
    const response = await fetch(
      'https://engine.rewst.io/webhooks/custom/trigger/0194fce0-33a2-774b-b7b8-b9e44e7c5c9b/0191fd3f-3981-7414-ad00-b0b52b71c763',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-rewst-secret': rewstSecret
        }
      }
    );
    
    // Get the response data
    const data = await response.json();
    
    // Return the data to the client
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error fetching from Rewst:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch data from Rewst', 
        message: error.message 
      })
    };
  }
};