const request = require('request');

async function run() {
    const diff = process.env.INPUT_DIFF;
    const apiKey = process.env.INPUT_APIKEY;

    const options = {
        url: 'https://api.openai.com/v1/engines/davinci/jobs',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        json: {
            prompt: `Please explain the changes in the following diff, while ignoring any libraries folders that were added:\n${diff}`,
            max_tokens: 2048,
            temperature: 0.5,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }

            if (response.statusCode !== 200) {
                reject(body);
                return;
            }

            const explanation = body.choices[0].text;
            resolve(explanation);
        });
    });
}

run().then(explanation => {
    console.log(explanation);
    console.log(`::set-output name=explanation::${explanation}`);
    process.exit(0);
}).catch(error => {
    console.error(error);
    process.exit(1);
});
