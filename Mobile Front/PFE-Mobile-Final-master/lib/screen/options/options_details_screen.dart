import 'package:flutter/material.dart';
import 'package:frontmobile/model/options_data.dart';

class OptionsDetailsScreen extends StatelessWidget {
  final OptionsData optionsData;

  OptionsDetailsScreen({required this.optionsData});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Options Details'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Ticker: ${optionsData.ticker.value}'),
            Text('Price: ${optionsData.underlyingPrice.value.toString()}'),
            Text('Currency: ${optionsData.currency.value.toString()}'),
            Text('Open Interest: ${optionsData.openInterest.value.toString()}'),
           
          ],
        ),
      ),
    );
  }
}
