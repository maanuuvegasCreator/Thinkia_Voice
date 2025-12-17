
import https from 'https';

const apiKey = 'ecb8b82aad40da827a23a46c0cb2efd09ddc93135fd2976aadf8be91e785f692';

const options = {
    hostname: 'api.elevenlabs.io',
    path: '/v1/convai/conversations?page_size=5',
    method: 'GET',
    headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log(JSON.stringify(parsed, null, 2));
        } catch (e) {
            console.log("Error parsing JSON:", e);
            console.log("Raw data:", data);
        }
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
