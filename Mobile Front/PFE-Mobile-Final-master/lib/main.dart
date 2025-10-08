import 'package:flutter/material.dart';
import 'package:frontmobile/screen/intro_page.dart';
import 'package:frontmobile/screen/login/accountAcctivation.dart';
import 'package:frontmobile/screen/dashboard.dart';
import 'package:frontmobile/screen/register/emailVerification.dart';
import 'package:frontmobile/screen/login/login.dart';
import 'package:frontmobile/screen/register/register.dart';
import 'package:frontmobile/screen/login/resetPassword.dart';


void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: const IntroPage(),
      routes: {
        '/login': (context) => Login(),
        '/dashboard': (context) => Dashboard(),
        '/register': (context) => Register(),
        '/emailVerif': (context) => EmailVerification(),
        '/resetPassword': (context) => ResetPassword(),
         '/activateAccount': (context) => AccountActivation(),
      },
    );
  }
}
