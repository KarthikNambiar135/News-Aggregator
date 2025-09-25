const axios = require('axios');
const unfluff = require('unfluff');

const parseUrlContent = async (url) => {
  try {
    // Fetch raw HTML
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (NewsAggregatorBot)'
      }
    });

    // Extract using unfluff
    const parsed = unfluff(html);

    return {
      title: parsed.title,
      summary: parsed.description || parsed.text?.substring(0, 200) + '...',
      fullContent: parsed.text,
      tags: parsed.keywords || []
    };
  } catch (err) {
    console.error('Parser error:', err.message);
    return {
      title: null,
      summary: null,
      fullContent: null,
      tags: []
    };
  }
};

module.exports = { parseUrlContent };
