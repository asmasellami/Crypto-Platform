import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:frontmobile/chat/chatScreen.dart';
import 'package:frontmobile/screen/chartScreen.dart';
import 'package:frontmobile/services/AuthService.dart';
import 'package:frontmobile/services/NotificationService.dart';
import '../entities/alert.dart';
import '../services/AlertService.dart';
import 'alerts/AddAlert.dart';
import 'notifications/notificationScreen.dart';
import 'dart:async';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';


class Dashboard extends StatefulWidget {
  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  String? _username;
  List<Alert> _alerts = [];
  int _unreadNotificationsCount = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    fetchUsername();
    fetchAlerts();
    fetchNotificationsPeriodically();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> fetchUsername() async {
    try {
      final authService = AuthService();
      final username = await authService.getCurrentUsername();
      if (mounted) {
        setState(() {
          _username = username;
        });
      }
    } catch (e) {
      print('Error fetching username: $e');
    }
  }

  Future<void> fetchAlerts() async {
    try {
      final alerts = await AlertService().getCurrentUserAlerts();
      if (mounted) {
        setState(() {
          _alerts = alerts;
        });
      }
    } catch (e) {
      print('Error fetching alerts: $e');
    }
  }

  Future<void> fetchNotifications() async {
    try {
      final notifications = await NotificationService().getNotificationsForCurrentUser();
      if (mounted) {
        setState(() {
          _unreadNotificationsCount = notifications.where((n) => !n.viewed).length;
        });
      }
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
        if (mounted) {
          setState(() {
            _unreadNotificationsCount = 0;
          });
        }
      }
    } catch (e) {
      print('Error marking notifications as viewed: $e');
    }
  }

  Future<void> refreshAlerts() async {
    await fetchAlerts();
  }

  Future<void> deleteAlert(int alertId) async {
    try {
      await AlertService().deleteAlert(alertId);
      fetchAlerts();
      Fluttertoast.showToast(
        msg: 'Alert deleted successfully',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } catch (e) {
      print('Error deleting alert: $e');
      Fluttertoast.showToast(
        msg: 'Failed to delete alert: $e',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  Future<void> toggleAlertActive(Alert alert) async {
    try {
      if (alert.active) {
        await AlertService().disableAlert(alert.id);
        Fluttertoast.showToast(
          msg: 'Alert disabled successfully',
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          timeInSecForIosWeb: 1,
          backgroundColor: Colors.green,
          textColor: Colors.white,
          fontSize: 16.0,
        );
      } else {
        await AlertService().enableAlert(alert.id);
        Fluttertoast.showToast(
          msg: 'Alert enabled successfully',
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          timeInSecForIosWeb: 1,
          backgroundColor: Colors.green,
          textColor: Colors.white,
          fontSize: 16.0,
        );
      }
      fetchAlerts();
    } catch (e) {
      print('Error toggling alert status: $e');
      Fluttertoast.showToast(
        msg: 'Failed to toggle alert status: $e',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF080C0F),
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Color(0xFF1DA2B4),
        title: Text('My Alerts', style: TextStyle(color: Colors.white)),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: Icon(Icons.notifications, color: Colors.white),
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
          
          IconButton(
            icon: Icon(Icons.logout, color: Colors.white),
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
      /*drawer: Drawer(
        child: ListView(
          children: [
            ListTile(
              title: Text('Dashboard'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ChartScreen(),
                  ),
                );
              },
            ),
          ],
        ),
      ),*/
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SizedBox(height: 20),
            Expanded(
              child: _alerts.isEmpty
                  ? Center(
                      child: Text(
                        'No alerts found',
                        style: TextStyle(color: Colors.white),
                      ),
                    )
                  : ListView.builder(
                      itemCount: _alerts.length,
                      itemBuilder: (context, index) {
                        final alert = _alerts[index];
                        return _buildAlertCard(alert);
                      },
                    ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Color(0xFF1DA2B4),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => CreateAlertScreen(),
            ),
          ).then((value) {
            if (value == true) {
              refreshAlerts();
            }
          });
        },
        child: Icon(Icons.add, color: Colors.white),
      ),
    );
  }

 Widget _buildAlertCard(Alert alert) {
  return Card(
    color: Color(0xFF1B2026),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    margin: EdgeInsets.symmetric(vertical: 10),
    child: Padding(
      padding: const EdgeInsets.all(20.0),
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                alert.name ?? '',
                style: TextStyle(
                    fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1DA2B4)),
              ),
              SizedBox(height: 10),
              Text(
                '${getFieldDisplayName(alert.fieldName)} ${getOperatorMapping(alert.operator)} ${alert.threshold}',
                style: TextStyle(fontSize: 14, color: Colors.white),
              ),
              SizedBox(height: 10),
              Text('Type: ${alert.type}', style: TextStyle(fontSize: 14, color: Colors.white)),
            ],
          ),
          Positioned(
            top: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.only(top: 50.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  IconButton(
                    icon: Icon(
                      alert.active ? FontAwesomeIcons.pauseCircle : FontAwesomeIcons.playCircle,
                      size: 16,
                      color: Color(0xFF1DA2B4),
                    ),
                    onPressed: () => toggleAlertActive(alert),
                  ),
                  IconButton(
                    icon: Icon(FontAwesomeIcons.trash, size: 16, color: Colors.red),
                    onPressed: () => deleteAlert(alert.id),
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



  String getFieldDisplayName(String fieldName) {
    switch (fieldName) {
      case 'price':
        return 'Price';
      case 'change':
        return 'Chg%';
      case 'open_interest':
        return 'Open Interest';
      case 'volume':
        return '24h Volume';
      case 'yield':
        return 'APR';
      case 'basis':
        return 'Basis';
      case 'open_interest_volume':
        return 'Total OI';
      case 'underlying_price':
        return 'Underlying Price';
      case 'atm_vol':
        return 'ATM Vol';
      case '_25_delta_risk_reversal':
        return '25Δ RR';
      case '_25_delta_butterfly':
        return '25Δ BR';
      default:
        return fieldName;
    }
  }

  String getOperatorMapping(String operator) {
    switch (operator) {
      case '>':
        return 'greater than';
      case '<':
        return 'less than';
      case '=':
        return 'equal to';
      case '!=':
        return 'not equal to';
      case '>=':
        return 'greater than or equal to';
      case '<=':
        return 'less than or equal to';
      default:
        return operator;
    }
  }
}

