
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:frontmobile/chat/chat.dart';

class ChatScreen extends StatelessWidget {
  final TextEditingController _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ChatProvider(),
      child: Scaffold(
        backgroundColor: Color(0xFF080C0F),
        appBar: AppBar(
          title: Row(
            children: [
              CircleAvatar(
                backgroundImage: AssetImage('assets/logo.png'),
              ),
              SizedBox(width: 10),
              Text('Chat with us'),
            ],
          ),
          backgroundColor: Color(0xFF1DA2B4),
        ),
        body: Consumer<ChatProvider>(
          builder: (context, chatProvider, child) {
            return Column(
              children: [
                Expanded(
                  child: chatProvider.messages.isEmpty
                      ? Center(
                          child: Text(
                            'Hello, how can I help you?',
                            style: TextStyle(color: Colors.white, fontSize: 18),
                          ),
                        )
                      : ListView.builder(
                          padding: EdgeInsets.all(10),
                          itemCount: chatProvider.messages.length,
                          itemBuilder: (context, index) {
                            final message = chatProvider.messages[index];
                            final isUser = message['isUser'] ?? false;

                            if (isUser) {
                              return Align(
                                alignment: Alignment.centerRight,
                                child: Container(
                                  margin: EdgeInsets.symmetric(vertical: 5),
                                  padding: EdgeInsets.all(15),
                                  decoration: BoxDecoration(
                                    color: Colors.blueAccent,
                                    borderRadius: BorderRadius.only(
                                      topLeft: Radius.circular(15),
                                      topRight: Radius.circular(15),
                                      bottomLeft: Radius.circular(15),
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black12,
                                        spreadRadius: 1,
                                        blurRadius: 5,
                                      ),
                                    ],
                                  ),
                                  child: Text(
                                    message['text'],
                                    style: TextStyle(color: Colors.white, fontSize: 18),
                                  ),
                                ),
                              );
                            } else {
                              final response = message['response'];
                              if (response != null && response is Map<String, dynamic>) {
                                return Align(
                                  alignment: Alignment.centerLeft,
                                  child: Container(
                                    margin: EdgeInsets.symmetric(vertical: 5),
                                    padding: EdgeInsets.all(15),
                                    decoration: BoxDecoration(
                                      color: Colors.grey[800],
                                      borderRadius: BorderRadius.only(
                                        topLeft: Radius.circular(15),
                                        topRight: Radius.circular(15),
                                        bottomRight: Radius.circular(15),
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black12,
                                          spreadRadius: 1,
                                          blurRadius: 5,
                                        ),
                                      ],
                                    ),
                                    child: _buildResponse(response),
                                  ),
                                );
                              } else {
                                return Align(
                                  alignment: Alignment.centerLeft,
                                  child: Container(
                                    margin: EdgeInsets.symmetric(vertical: 5),
                                    padding: EdgeInsets.all(15),
                                    decoration: BoxDecoration(
                                      color: Colors.grey[800],
                                      borderRadius: BorderRadius.only(
                                        topLeft: Radius.circular(15),
                                        topRight: Radius.circular(15),
                                        bottomRight: Radius.circular(15),
                                      ),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black12,
                                          spreadRadius: 1,
                                          blurRadius: 5,
                                        ),
                                      ],
                                    ),
                                    child: Text(
                                      message['text'] ?? 'Error',
                                      style: TextStyle(color: Colors.white, fontSize: 18),
                                    ),
                                  ),
                                );
                              }
                            }
                          },
                        ),
                ),
                if (chatProvider.loading)
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: CircularProgressIndicator(),
                  ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _controller,
                          decoration: InputDecoration(
                            hintText: 'Ask me about cryptocurrencies...',
                            filled: true,
                            fillColor: Colors.white,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(30),
                              borderSide: BorderSide.none,
                            ),
                            contentPadding: EdgeInsets.symmetric(horizontal: 20),
                          ),
                          style: TextStyle(fontSize: 18),
                        ),
                      ),
                      SizedBox(width: 10),
                      GestureDetector(
                        onTap: () {
                          final query = _controller.text.trim();
                          if (query.isNotEmpty) {
                            chatProvider.sendMessage(query);
                            _controller.clear();
                          }
                        },
                        child: CircleAvatar(
                          backgroundColor: Color(0xFF1DA2B4),
                          radius: 25,
                          child: Icon(Icons.send, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildResponse(Map<String, dynamic> response) {
    if (response.containsKey('ticker')) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${response['ticker']}',
            style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 5),
          _buildResponseField('Table', response['table']),
          _buildResponseField('Currency', response['currency']),
          _buildResponseField('Expiry', response['expiry']),
          _buildResponseField('Price', response['price']),
          _buildResponseField('Change', response['change']),
          _buildResponseField('Open Interest', response['open_interest']),
          _buildResponseField('Open Interest Volume', response['open_interest_volume']),
          _buildResponseField('Underlying Price', response['underlying_price']),
          _buildResponseField('24H Volume', response['volume']),
          _buildResponseField('Market', response['market']),
          _buildResponseField('ATM Volatility', response['atm_vol']),
          _buildResponseField('25 Delta Butterfly', response['_25_delta_butterfly']),
          _buildResponseField('25 Delta Risk Reversal', response['_25_delta_risk_reversal']),
          _buildResponseField('Basis', response['basis']),
        ],
      );
    } 
else if (response.containsKey('message')) {
  final topFuturesPrices = response['top_futures_prices'] ?? [];
  final topOptionsPrices = response['top_options_prices'] ?? [];
  
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 15.0),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Top futures prices:',
          style: TextStyle(color: Color.fromARGB(255, 0, 161, 224), fontSize: 21, fontWeight: FontWeight.bold), // Adjust font size if needed
        ),
        SizedBox(height: 5), 
        ...topFuturesPrices.map((entry) {
          return Padding(
            padding: const EdgeInsets.only(top: 4.0), 
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Ticker: ${entry['ticker']}',
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
                Text(
                  'Price: ${entry['price'].toStringAsFixed(2)}\$',
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ],
            ),
          );
        }).toList(),
        SizedBox(height: 18), 
        Text(
          'Top options prices:',
          style: TextStyle(color: Color.fromARGB(255, 0, 161, 224), fontSize: 21, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 8),
        ...topOptionsPrices.map((entry) {
          return Padding(
            padding: const EdgeInsets.only(top: 4.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Ticker: ${entry['ticker']}',
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
                Text(
                  'Price: ${entry['price'].toStringAsFixed(2)}\$',
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ],
            ),
          );
        }).toList(),
      ],
    ),
  );
}



    else if (response.containsKey('name')){
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${response['name']} (${response['symbol']})',
            style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 5),
          
          Text(
            'Current Price: ${formatNumber(response['current_price'])}\$',
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          Text(
            'Market Cap: ${formatNumber(response['market_cap'])}\$',
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
          Text(
            '24h Volume: ${formatNumber(response['volume_24h'])}\$',
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
        ],
      );
    }
    
    else {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: response.entries.map((entry) {
          return Text(
            '${entry.key}: ${entry.value is num ? formatNumber(entry.value) : entry.value}',
            style: TextStyle(color: Colors.white, fontSize: 18),
          );
        }).toList(),
      );
    }
  }

  Widget _buildResponseField(String label, dynamic value) {
    return value != null
        ? Text(
            '$label: ${value is num ? formatNumber(value) : value}',
            style: TextStyle(color: Colors.white, fontSize: 18),
          )
        : Container();
  }

  String formatNumber(num value) {
    if (value >= 1e12 || value <= -1e12) {
      return formatWithSuffix(value, 1e12, 'T');
    } else if (value >= 1e9 || value <= -1e9) {
      return formatWithSuffix(value, 1e9, 'B');
    } else if (value >= 1e6 || value <= -1e6) {
      return formatWithSuffix(value, 1e6, 'M');
    } else if (value >= 1e3 || value <= -1e3) {
      return formatWithSuffix(value, 1e3, 'K');
    } else {
      return value.toStringAsFixed(2);
    }
  }

  String formatWithSuffix(num value, num divisor, String suffix) {
    final formattedValue = (value / divisor).toStringAsFixed(2);
    final prefix = value < 0 ? '-' : '';
    return '$prefix$formattedValue$suffix';
  }
}
