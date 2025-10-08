import 'package:flutter/material.dart';

import '../../model/perpetuals_data.dart';

class PerpetualDetailsScreen extends StatelessWidget {
  final PerpetualData perpetualData;

  PerpetualDetailsScreen({required this.perpetualData});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Perpetual Details'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Currency: ${perpetualData.currency.value}'),
            Text('Price: ${perpetualData.price.value}'),
            Text('Change: ${perpetualData.change.value}'),
            Text('Open Interest: ${perpetualData.openInterest.value}'),
            Text('Volume: ${perpetualData.volume.value}'),
            Text('Funding: ${perpetualData.funding.value}'),
            Text('Next Funding Rate: ${perpetualData.nextFr.value}'),
            Text('Yield: ${perpetualData.yield.value}'),
            Text('Open Interest Volume: ${perpetualData.openInterestVolume.value}'),
            Text('Liquidations (Long): ${perpetualData.liquidations.long}'),
            Text('Liquidations (Short): ${perpetualData.liquidations.short}'),
            Text('LS Ratio: ${perpetualData.lsRatio}'),
            Text('Markets: ${perpetualData.markets.value.join(', ')}'),
            Text('Average Yield (1 Day): ${perpetualData.avgYield.one}'),
            Text('Realized Volatility (3 Days): ${perpetualData.realizedVol.three}'),
            Text('Market Cap: ${perpetualData.marketCap}'),
            Text('BTC Correlation (7 Days): ${perpetualData.correlation.btc.seven}'),
            Text('ETH Correlation (7 Days): ${perpetualData.correlation.eth.seven}'),
          ],
        ),
      ),
    );
  }
}
