import 'package:flutter/material.dart';

import '../../model/futures_data.dart';

class FutureDetailsScreen extends StatelessWidget {
  final FuturesData futureData;

  FutureDetailsScreen({required this.futureData});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Future Details'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Ticker: ${futureData.ticker.value}'),
            SizedBox(height: 8),
            Text('Price: ${futureData.price.value.toString()}'),
            SizedBox(height: 8),
            Text('Chg%: ${futureData.change.value.toString()}'),
            SizedBox(height: 8),
            Text('Basis: ${futureData.basis.value.toString()}'),
            /*SizedBox(height: 8),
            Text('Chg%:${futureData.basis.change.toString()}'),*/
            SizedBox(height: 8),
            Text('APR:${futureData.yield.value.toString()}'),
            SizedBox(height: 8),
            Text('24h Volume:${futureData.volume.value.toString()}'),
            SizedBox(height: 8),
            Text('chg%:${futureData.volume.changeUsdPercentage.toString()}'),
            SizedBox(height: 8),
            Text('Open Interest:${futureData.openInterest.value.toString()}'),
            SizedBox(height: 8),
            Text('OI change:${futureData.openInterest.changeUsd.toString()}'),
            SizedBox(height: 8),
            Text('Chg%:${futureData.openInterest.changeUsdPercentage.toString()}'),
            SizedBox(height: 8),
            Text('OI/24H volume:${futureData.openInterestVolume.value.toString()}'),
              SizedBox(height: 8),
            Text('Chg%:${futureData.openInterestVolume.change.toString()}'),
          ],
        ),
      ),
    );
  }
}
