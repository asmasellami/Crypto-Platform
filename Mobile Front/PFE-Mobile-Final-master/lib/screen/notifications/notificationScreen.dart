import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../../entities/notification.dart';
import '../../services/NotificationService.dart';

class NotificationScreen extends StatefulWidget {
  @override
  _NotificationScreenState createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  List<UserNotification> _notifications = [];
  bool _isLoading = true;
  UserNotification? _selectedNotification;

  @override
  void initState() {
    super.initState();
    fetchNotifications();
  }

  Future<void> fetchNotifications() async {
    try {
      final notifications = await NotificationService().getNotificationsForCurrentUser();
      setState(() {
        _notifications = notifications;
        _isLoading = false;
      });
    } catch (e) {
      print('Error fetching notifications: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await NotificationService().markAllAsRead();
      fetchNotifications();
      Fluttertoast.showToast(
        msg: 'All notifications marked as read',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } catch (e) {
      print('Error marking all as read: $e');
      Fluttertoast.showToast(
        msg: 'Failed to mark all as read: $e',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  Future<void> deleteAllNotifications() async {
    try {
      await NotificationService().deleteAllNotifications();
      fetchNotifications();
      Fluttertoast.showToast(
        msg: 'All notifications deleted',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } catch (e) {
      print('Error deleting all notifications: $e');
      Fluttertoast.showToast(
        msg: 'Failed to delete all notifications: $e',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  Future<void> deleteNotification(int notificationId) async {
    try {
      await NotificationService().deleteNotification(notificationId);
      fetchNotifications();
      Fluttertoast.showToast(
        msg: 'Notification deleted',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } catch (e) {
      print('Error deleting notification: $e');
      Fluttertoast.showToast(
        msg: 'Failed to delete notification: $e',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  void toggleDetails(UserNotification notification) {
    setState(() {
      if (_selectedNotification == notification) {
        _selectedNotification = null;
      } else {
        _selectedNotification = notification;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF080C0F),
      appBar: AppBar(
        backgroundColor: Color(0xFF1DA2B4),
        title: Text('My Notifications', style: TextStyle(color: Colors.white)),
      ), 
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  _buildButtonBar(),
                  SizedBox(height: 20),
                  Expanded(
                    child: _notifications.isEmpty
                        ? Center(
                            child: Text(
                              'No notifications',
                              style: TextStyle(color: Colors.white, fontSize: 18),
                            ),
                          )
                        : ListView.builder(
                            itemCount: _notifications.length,
                            itemBuilder: (context, index) {
                              final notification = _notifications[index];
                              return _buildNotificationCard(notification);
                            },
                          ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildButtonBar() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            primary: Colors.red,
            onPrimary: Colors.white,
          ),
          icon: Icon(FontAwesomeIcons.trash),
          label: Text('Delete All'),
          onPressed: deleteAllNotifications,
        ),
      ],
    );
  }

  Widget _buildNotificationCard(UserNotification notification) {
    return Card(
      color: notification.viewed ? Color(0xFF1B2026) : Color(0xFF12161C),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      margin: EdgeInsets.symmetric(vertical: 5),
      child: Padding(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            GestureDetector(
              onTap: () => toggleDetails(notification),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    notification.alertName,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1DA2B4),
                    ),
                  ),
                  SizedBox(height: 5),
                  Text(
                    notification.createdAt,
                    style: TextStyle(fontSize: 14, color: Colors.white),
                  ),
                  SizedBox(height: 5),
                  Text(
                    '${notification.message} ${getFieldDisplayName(notification.alertFieldName)} ${getOperatorMapping(notification.alertoperator)} ${notification.alertthreshold}',
                    style: TextStyle(fontSize: 14, color: Colors.white),
                  ),
                  SizedBox(height: 5),
                  Text('Type: ${notification.alertType}', style: TextStyle(fontSize: 14, color: Colors.white)),
                ],
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                IconButton(
                  icon: Icon(FontAwesomeIcons.trash, color: Colors.white),
                  onPressed: () => deleteNotification(notification.id),
                ),
              ],
            ),
            if (_selectedNotification == notification) _buildDetailedInfo(notification),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailedInfo(UserNotification notification) {
    final detailedTickers = jsonDecode(notification.tickerDetails) as Map<String, dynamic>;
    final fields = getFieldsForAlert(notification.alertType);

    return Padding(
      padding: const EdgeInsets.only(top: 10.0),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Table(
          defaultColumnWidth: IntrinsicColumnWidth(),
          border: TableBorder.all(color: Colors.white),
          children: [
            TableRow(
              decoration: BoxDecoration(color: Color(0xFF1B2026)),
              children: [
                _buildTableCell('Ticker', isHeader: true),
                ...fields.map((field) => _buildTableCell(getFieldDisplayName(field), isHeader: true)),
              ],
            ),
            ...detailedTickers.entries.map((entry) => TableRow(
                  children: [
                    _buildTableCell(entry.key),
                    ...fields.map((field) => _buildTableCell(entry.value[0][field].toString())),
                  ],
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildTableCell(String text, {bool isHeader = false}) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Text(
        text,
        style: TextStyle(
          color: Colors.white,
          fontSize: isHeader ? 14 : 12,
          fontWeight: isHeader ? FontWeight.bold : FontWeight.normal,
        ),
        textAlign: TextAlign.center,
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

  List<String> getFieldsForAlert(String alertType) {
    switch (alertType) {
      case 'futures':
        return ['price', 'change', 'open_interest', 'volume', 'yield', 'basis', 'open_interest_volume'];
      case 'options':
        return ['underlying_price', 'change', 'open_interest', 'volume', 'atm_vol', 'basis', '_25_delta_risk_reversal', '_25_delta_butterfly', 'open_interest_volume'];
      default:
        return [];
    }
  }
}
