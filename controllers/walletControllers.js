const { getWallet } = require('../utilities/supportControllers');
const { catchAsync } = require('../utilities/utitlities');

exports.getWallet = catchAsync(async (req, res, next) => {
  const wallet = await getWallet();

  res.status(200).json({
    status: 'success',
    data: wallet,
  });
});
