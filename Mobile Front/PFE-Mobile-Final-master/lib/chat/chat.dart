import 'package:flutter/material.dart';
import 'package:frontmobile/services/AuthService.dart';

class ChatProvider with ChangeNotifier {
  final AuthService _chatService = AuthService();

  bool loading = false;
  List<Map<String, dynamic>> messages = [];

  Future<void> sendMessage(String query) async {
    loading = true;
    messages.add({'text': query, 'isUser': true});
    notifyListeners();

    try {
      final response = await _chatService.sendMessageChat(query);
      print('Response from backend: $response');
      messages.add({'response': response, 'isUser': false});
    } catch (e) {
      print('Error: $e');
      messages.add({'text': 'Sorry, I could not understand your question.', 'isUser': false});
    } finally {
      loading = false;
      notifyListeners();
    }
  }
}
