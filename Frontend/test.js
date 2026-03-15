const axios = require('axios');

async function test() {
  try {
    console.log("Testing /api/extract (First Call)...");
    const res1 = await axios.post('http://localhost:3000/api/extract', { comment_id: "abc123" });
    console.log("Response:", res1.data);

    console.log("\nTesting /api/extract (Second Call - Should hit cache)...");
    const res1_cached = await axios.post('http://localhost:3000/api/extract', { comment_id: "abc123" });
    console.log("Response:", res1_cached.data);

    console.log("\nTesting /api/verify (First Call)...");
    const res2 = await axios.post('http://localhost:3000/api/verify', { drug: "Accutane", side_effect: "dry lips" });
    console.log("Response:", res2.data);

    console.log("\nTesting /api/verify (Second Call - Should hit cache)...");
    const res2_cached = await axios.post('http://localhost:3000/api/verify', { drug: "Accutane", side_effect: "dry lips" });
    console.log("Response:", res2_cached.data);
  } catch (error) {
    console.error("Test failed:", error.response ? error.response.data : error.message);
  }
}

test();
