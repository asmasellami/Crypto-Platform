import 'package:flutter/material.dart';

class PasswordUpdatedSuccess extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Colors.black,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Icon(Icons.check_circle, color: Colors.green, size: 100.0),
              Text(
                'Successful!',
                style: TextStyle(color: Colors.white, fontSize: 30.0),
              ),
              Text(
                'Your password has been changed. You can now log in to your account using your new password.',
                style: TextStyle(color: Colors.white, fontSize: 15.0),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 20.0),
              ElevatedButton(
                onPressed: () {
                  Navigator.pushReplacementNamed(context, '/login');
                },
                child: Text('Return to login page'),
                style: ElevatedButton.styleFrom(
                  foregroundColor: Colors.white, backgroundColor: Colors.green,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
