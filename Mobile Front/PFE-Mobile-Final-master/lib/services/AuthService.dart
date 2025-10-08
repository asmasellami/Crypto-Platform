import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fluttertoast/fluttertoast.dart';

class AuthService {
  //final String baseUrl = 'http://10.0.2.2:8081/users';
final String baseUrl = 'http://192.168.1.18:8081/users'; 
  Future<String?> login(String username, String password) async {
    try {
      if (username.isEmpty || password.isEmpty) {
        Fluttertoast.showToast(
          msg: 'Make sure to fill all the fields',
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          timeInSecForIosWeb: 1,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 16.0,
        );
        return null; 
      }

      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, String>{
          'username': username,
          'password': password,
        }),
      );

      print('Login response status code: ${response.statusCode}');
      print('Login response body: ${response.body}');

      if (response.statusCode == 200) {
        final token = response.headers['authorization'];
        if (token != null) {
          print('Token received and saved: $token');
          await saveTokenToStorage(token);
          return token;
        } else {
          print('Token not found in response headers');
          return null;
        }
      } else {
        final data = jsonDecode(response.body);
        if (response.statusCode == 401) {
          if (data['errorCause'] == 'disabled') {
            Fluttertoast.showToast(
              msg: 'Make sure to activate your account',
              toastLength: Toast.LENGTH_SHORT,
              gravity: ToastGravity.TOP,
              timeInSecForIosWeb: 1,
              backgroundColor: Colors.red,
              textColor: Colors.white,
              fontSize: 16.0,
            );
          } else {
            Fluttertoast.showToast(
              msg: 'Invalid username or password',
              toastLength: Toast.LENGTH_SHORT,
              gravity: ToastGravity.TOP,
              timeInSecForIosWeb: 1,
              backgroundColor: Colors.red,
              textColor: Colors.white,
              fontSize: 16.0,
            );
          }
        } else if (response.statusCode == 404) {
          Fluttertoast.showToast(
            msg: 'User not found',
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.TOP,
            timeInSecForIosWeb: 1,
            backgroundColor: Colors.red,
            textColor: Colors.white,
            fontSize: 16.0,
          );
        } else {
          throw ('${data['message'] ?? 'Unknown error'}');
        }
      }
    } catch (e) {
      print('Login error: $e');
      throw ('Failed to login: $e');
    }
    return null;
  }

  Future<void> saveTokenToStorage(String token) async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);
      print('Token saved to SharedPreferences: $token');
    } catch (e) {
      throw Exception('Failed to save token: $e');
    }
  }

  static Future<String?> getTokenFromStorage() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      return token;
    } catch (e) {
      throw Exception('Failed to get token from storage: $e');
    }
  }

  Future<http.Response> fetchProtectedData() async {
    try {
      final token = await getTokenFromStorage();
      final response = await http.get(
        Uri.parse('$baseUrl/protected-endpoint'),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      return response;
    } catch (e) {
      throw Exception('Failed to fetch protected data: $e');
    }
  }

 Future<void> registerUser(String username, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, String>{
          'username': username,
          'email': email,
          'password': password,
        }),
      );

      print('Registration response status code: ${response.statusCode}');
      print('Registration response body: ${response.body}');

      if (response.statusCode == 200) {
        final responseBody = response.body;
        if (responseBody.isNotEmpty) {
        
        } else {
          throw Exception('Failed to register: Empty response body');
        }
      } else {
        throw Exception('Failed to register:');
      }
    } catch (e) {
      throw Exception('Failed to register:');
    }
  }


  Future<void> validateEmail(String code) async {
    final response = await http.get(Uri.parse('$baseUrl/verifyEmail/$code'));

    if (response.statusCode != 200) {
      throw Exception('Failed to validate email');
    }
  }

  Future<void> initiatePasswordReset(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/modifier_pwd'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, String>{
          'email': email,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception(
            'Failed to initiate password reset: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to initiate password reset: $e');
    }
  }

  Future<void> updatePassword(Map<String, String> data) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/nouveau_pwd'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(data),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to update password: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to update password: $e');
    }
  }

  Future<void> logout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('token');

      Fluttertoast.showToast(
        msg: ' Logout successful',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } catch (e) {
      print('Logout error: $e');

      Fluttertoast.showToast(
        msg: 'Failed to logout: $e',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );

      throw Exception('Failed to logout: $e');
    }
  }

  Future<void> verifyUser(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/verify'),
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, String>{
          'email': email,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to verify user: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to verify user: $e');
    }
  }

  Future<String?> getCurrentUsername() async {
    try {
      final token = await getTokenFromStorage();
      if (token == null) {
        throw Exception('Token not found in storage');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/userByUsername'),
        headers: <String, String>{
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseBody = jsonDecode(response.body);
        final username = responseBody['username'] as String;
        return username;
      } else {
        throw Exception(
            'Failed to fetch current username: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to fetch current username: $e');
    }
  }

   Future<bool> isUserLoggedIn() async {
    try {
      final token = await getTokenFromStorage();
      return token != null; 
    } catch (e) {
   
      print('Error checking user authentication: $e');
      return false; 
    }
  }

Future<int?> getCurrentUserId() async {
  try {
    final token = await getTokenFromStorage();
    if (token == null) {
      throw Exception('Token not found in storage');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/userById'),
      headers: <String, String>{
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final int userId = int.parse(response.body); 
      return userId;
    } else {
      throw Exception('Failed to fetch current user ID: ${response.statusCode}');
    }
  } catch (e) {
    throw Exception('Failed to fetch current user ID: $e');
  }
}


  //static const String apiUrl = 'http://10.0.2.2:5000/api/chat'; 
  static const String apiUrl = 'http://192.168.1.18:5000/api/chat';

  Future<Map<String, dynamic>> sendMessageChat(String query) async {
    final response = await http.post(
      Uri.parse(apiUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'query': query}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load response');
    }
  }
}
