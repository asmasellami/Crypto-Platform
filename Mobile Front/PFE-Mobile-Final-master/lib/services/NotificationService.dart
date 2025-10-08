import 'dart:convert';
import 'package:http/http.dart' as http;
import '../entities/notification.dart';
import 'AuthService.dart';

class NotificationService {
  //final String baseUrl = 'http://10.0.2.2:8081/users';
  final String baseUrl = 'http://192.168.1.18:8081/users'; 

  Future<List<UserNotification>> getNotificationsForCurrentUser() async {
    try {
      final token = await AuthService.getTokenFromStorage();
      final response = await http.get(
        Uri.parse('$baseUrl/notifications'),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        List<dynamic> body = jsonDecode(response.body);
        List<UserNotification> notifications =
            body.map((dynamic item) => UserNotification.fromJson(item)).toList();
        return notifications;
      } else {
        throw Exception(
            'Failed to fetch notifications: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to fetch notifications: $e');
    }
  }

    Future<void> markNotificationsAsViewed(int userId) async {
    try {
      final token = await AuthService.getTokenFromStorage();
      final response = await http.put(
        Uri.parse('$baseUrl/viewed/$userId'),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to mark notifications as viewed: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to mark notifications as viewed: $e');
    }
  }


 Future<void> markAllAsRead() async {
    try {
      final token = await AuthService.getTokenFromStorage();
      //final userId = await AuthService.getCurrentUserId();
      final response = await http.put(
        //Uri.parse('$baseUrl/markAllAsViewed/$userId'),
         Uri.parse('$baseUrl/markAllAsViewed/'),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to mark all notifications as read: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to mark all notifications as read: $e');
    }
  }

  Future<void> deleteNotification(int notificationId) async {
    try {
      final token = await AuthService.getTokenFromStorage();
      final response = await http.delete(
        Uri.parse('$baseUrl/notification/$notificationId'),
        headers: <String, String>{
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to delete notification: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to delete notification: $e');
    }
  }

  Future<void> deleteAllNotifications() async {
    try {
      final token = await AuthService.getTokenFromStorage();
      final response = await http.delete(
        Uri.parse('$baseUrl/deleteAllNotif'),
        headers: <String, String>{
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to delete all notifications: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to delete all notifications: $e');
    }
  } 
}