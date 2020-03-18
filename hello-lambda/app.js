let response;
const luxon = require("luxon");

exports.lambdaHandler = async (event, context) => {
  try {
    // const ret = await axios(url);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: luxon.DateTime.utc()
        // location: ret.data.trim()
      })
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
