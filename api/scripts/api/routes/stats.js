import mongo from '../../mongo';
import economies from '../../utils/economies';

const stats = (req, res) => mongo.fetchFullStats()
  .then((result) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', 0);
    if (result) {
      res.json({
        sucess: true,
        version: process.env.npm_package_version,
        statistics: result,
        economies: economies.list,
      });
    } else {
      res.json({
        sucess: false,
        version: process.env.npm_package_version,
        error: 'Statistics are not ingested yet.',
      });
    }
  });

export default stats;
