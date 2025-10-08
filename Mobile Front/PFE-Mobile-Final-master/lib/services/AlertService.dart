import 'dart:convert';
import 'package:http/http.dart' as http;


import '../entities/alert.dart';
import 'AuthService.dart';



class AlertService {
  //final String baseUrl = 'http://10.0.2.2:8081/users';
  final String baseUrl = 'http://192.168.1.18:8081/users'; 

Future<List<Alert>> getCurrentUserAlerts() async {
  try {
    final token = await AuthService.getTokenFromStorage();
    final response = await http.get(
      Uri.parse('$baseUrl/currentUseralerts'),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      try {
        final List<dynamic> data = jsonDecode(response.body);
        final List<Alert> alerts = data.map((json) => Alert.fromJson(json)).toList();
        return alerts;
      } catch (e) {
        print('Failed to decode JSON: ${response.body}');
        throw Exception('Failed to decode JSON');
      }
    } else if (response.statusCode == 401) {
      throw Exception('Unauthorized access');
    } else {
      throw Exception('Failed to fetch user alerts');
    }
  } catch (e) {
    throw Exception('Failed to fetch user alerts: $e');
  }
}


 Future<void> deleteAlert(int alertId) async {
    try {
      final token = await AuthService.getTokenFromStorage();
      final response = await http.delete(
        Uri.parse('$baseUrl/deleteAlert/$alertId'),
        headers: <String, String>{
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        // Alert deleted successfully
        print('Alert deleted successfully');
      } else if (response.statusCode == 401) {
        throw Exception('Unauthorized access');
      } else {
        throw Exception('Failed to delete alert');
      }
    } catch (e) {
      throw Exception('Failed to delete alert: $e');
    }
  }


   Future<Alert?> createAlert(Alert alert) async {
    try {
      final token = await AuthService.getTokenFromStorage();
      if (token == null) {
        throw Exception('Token not found in storage');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/alerts'),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(alert.toJson()),
      );

      if (response.statusCode == 200) {
        final dynamic responseBody = jsonDecode(response.body);
        final Alert newAlert = Alert.fromJson(responseBody);
        return newAlert;
      } else {
        throw Exception('Failed to create alert: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to create alert: $e');
    }
  }

Future<void> enableAlert(int alertId) async {
    try {
      final token = await AuthService.getTokenFromStorage();
      final response = await http.put(
        Uri.parse('$baseUrl/enableAlert/$alertId'),
        headers: <String, String>{
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to enable alert: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to enable alert: $e');
    }
  }

  Future<void> disableAlert(int alertId) async {
    try {
      final token = await AuthService.getTokenFromStorage();
      final response = await http.put(
        Uri.parse('$baseUrl/disableAlert/$alertId'),
        headers: <String, String>{
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to disable alert: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to disable alert: $e');
    }
  }
}