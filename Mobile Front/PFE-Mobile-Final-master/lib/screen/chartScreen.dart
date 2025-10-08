import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:frontmobile/screen/notifications/notificationScreen.dart';
import 'package:frontmobile/services/AuthService.dart';
import 'package:frontmobile/services/NotificationService.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'package:frontmobile/chat/chatScreen.dart';
import 'dashboard.dart';

class ChartScreen extends StatefulWidget {
  @override
  _ChartScreenState createState() => _ChartScreenState();
}

class _ChartScreenState extends State<ChartScreen> {
  String? _username;
  int _unreadNotificationsCount = 0;
  List<FlSpot> _bitcoinPrices = [];
  List<BarChartGroupData> _ethereumPrices = [];
  List<PieChartSectionData> _pieSections = [];
  bool _isLoading = true;
  int _touchedIndex = -1;

  @override
  void initState() {
    super.initState();
    fetchUsername();
    fetchNotificationsPeriodically();
    fetchCryptoData();
  }

  Future<void> fetchUsername() async {
    try {
      final authService = AuthService();
      final username = await authService.getCurrentUsername();
      setState(() {
        _username = username;
      });
    } catch (e) {
      print('Error fetching username: $e');
    }
  }

  Future<void> fetchNotifications() async {
    try {
      final notifications =
          await NotificationService().getNotificationsForCurrentUser();
      setState(() {
        _unreadNotificationsCount =
            notifications.where((n) => !n.viewed).length;
      });
    } catch (e) {
      print('Error fetching notifications: $e');
    }
  }

  void fetchNotificationsPeriodically() {
    AuthService().isUserLoggedIn().then((isLoggedIn) {
      if (isLoggedIn) {
        fetchNotifications();
      }
    }).catchError((error) {
      print('Error checking user authentication: $error');
    });
    Future.delayed(Duration(seconds: 10), fetchNotificationsPeriodically);
  }

  Future<void> markNotificationsAsViewed() async {
    try {
      final authService = AuthService();
      final userId = await authService.getCurrentUserId();
      if (userId != null) {
        await NotificationService().markNotificationsAsViewed(userId);
        setState(() {
          _unreadNotificationsCount = 0;
        });
      }
    } catch (e) {
      print('Error marking notifications as viewed: $e');
    }
  }

  Future<void> fetchCryptoData() async {
    final bitcoinPrices = await fetchPrices('bitcoin');
    final ethereumPrices = await fetchPrices('ethereum');
    setState(() {
      _bitcoinPrices = bitcoinPrices
          .map((entry) => FlSpot(entry[0].toDouble(), entry[1]))
          .toList();
      _ethereumPrices = ethereumPrices
          .asMap()
          .entries
          .map((entry) => BarChartGroupData(x: entry.key, barRods: [
                BarChartRodData(toY: entry.value[1], color: Color(0xFF1DA2B4))
              ]))
          .toList();
      _pieSections = [
        PieChartSectionData(
            value: bitcoinPrices.last[1], title: 'BTC', color: Colors.blue),
        PieChartSectionData(
            value: ethereumPrices.last[1], title: 'ETH', color: Colors.green),
      ];
      _isLoading = false;
    });
  }

  Future<List<dynamic>> fetchPrices(String coinId) async {
    final response = await http.get(Uri.parse(
        'https://api.coingecko.com/api/v3/coins/$coinId/market_chart?vs_currency=usd&days=7'));
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['prices'] as List;
    } else {
      throw Exception('Failed to load prices');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF080C0F),
      appBar: AppBar(
        backgroundColor: Color(0xFF1DA2B4),
        title: Text('Dashboard', style: TextStyle(color: Colors.white)),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: Icon(Icons.notifications),
                onPressed: () {
                  markNotificationsAsViewed();
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => NotificationScreen(),
                    ),
                  );
                },
              ),
              IconButton(
                icon: Icon(Icons.chat, color: Colors.white),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ChatScreen(),
                    ),
                  );
                },
              ),
              if (_unreadNotificationsCount > 0)
                Positioned(
                  right: 11,
                  top: 11,
                  child: Container(
                    padding: EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    constraints: BoxConstraints(
                      minWidth: 18,
                      minHeight: 18,
                    ),
                    child: Text(
                      '$_unreadNotificationsCount',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
            ],
          ),
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () async {
              try {
                await AuthService().logout();
                Navigator.pushReplacementNamed(context, '/login');
                Fluttertoast.showToast(
                  msg: 'Logout successful',
                  toastLength: Toast.LENGTH_SHORT,
                  gravity: ToastGravity.TOP,
                  timeInSecForIosWeb: 1,
                  backgroundColor: Colors.green,
                  textColor: Colors.white,
                  fontSize: 16.0,
                );
              } catch (e) {
                print('Error during logout: $e');
                Fluttertoast.showToast(
                  msg: 'Failed to logout: $e',
                  toastLength: Toast.LENGTH_SHORT,
                  gravity: ToastGravity.TOP,
                  timeInSecForIosWeb: 1,
                  backgroundColor: Colors.red,
                  textColor: Colors.white,
                  fontSize: 16.0,
                );
              }
            },
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          children: [
            ListTile(
              title: Text('Alerts'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => Dashboard(),
                  ),
                );
              },
            ),
          ],
        ),
      ),
      body: Center(
        child: _isLoading
            ? CircularProgressIndicator()
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _username != null
                      ? Text('Hello, $_username',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.bold))
                      : CircularProgressIndicator(),
                  SizedBox(height: 20),
                  Expanded(
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Card(
                              color: Color(0xFF12161C),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(15),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.stretch,
                                  children: [
                                    Text(
                                      'Cryptocurrency Distribution',
                                      style: TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white),
                                    ),
                                    SizedBox(height: 20),
                                    Container(
                                      height: 300,
                                      child: PieChart(
                                        PieChartData(
                                          sections: _pieSections,
                                          centerSpaceRadius: 50,
                                          sectionsSpace: 2,
                                          pieTouchData: PieTouchData(
                                            touchCallback: (FlTouchEvent event,
                                                PieTouchResponse?
                                                    touchResponse) {
                                              setState(() {
                                                if (event
                                                        .isInterestedForInteractions &&
                                                    touchResponse != null &&
                                                    touchResponse
                                                            .touchedSection !=
                                                        null) {
                                                  _touchedIndex = touchResponse
                                                      .touchedSection!
                                                      .touchedSectionIndex;
                                                  _pieSections = _pieSections
                                                      .map((section) {
                                                    final double percentage = section
                                                            .value /
                                                        _pieSections.fold(
                                                            0,
                                                            (previousValue,
                                                                    element) =>
                                                                previousValue +
                                                                element.value) *
                                                        100;
                                                    return PieChartSectionData(
                                                      value: section.value,
                                                      title:
                                                          '${section.title} (${_touchedIndex == _pieSections.indexOf(section) ? percentage.toStringAsFixed(2) + '%' : ''})',
                                                      color: section.color,
                                                    );
                                                  }).toList();
                                                } else {
                                                  _touchedIndex = -1;
                                                }
                                              });
                                            },
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
