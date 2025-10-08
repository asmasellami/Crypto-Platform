import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:frontmobile/screen/login/login.dart';
import 'package:frontmobile/screen/login/succ.dart';
import 'package:frontmobile/services/AuthService.dart';

class ResetPassword extends StatefulWidget {
  @override
  _ResetPasswordState createState() => _ResetPasswordState();
}

class _ResetPasswordState extends State<ResetPassword> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController newPasswordController = TextEditingController();

  List<TextEditingController> otpFieldControllers =
      List.generate(6, (index) => TextEditingController());

  bool showVerificationFields = false;
  bool loading = false;

  AuthService authService = AuthService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Color.fromARGB(255, 82, 85, 85),
        title: Text('Reset Password', style: TextStyle(color: Colors.white),),
        leading: IconButton(
          icon: Icon(Icons.arrow_back,color: Colors.white,),
          onPressed: () {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => Login()),
            );
          },
        ),
      ),
      body: Padding(
        padding: EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            SizedBox(height: 20),
            Text(
              'Reset Password',
              style: TextStyle(color: Colors.white, fontSize: 32),
            ),
            Text(
              'Enter your email and we send you a code to reset your password.',
              style: TextStyle(color: Colors.white, fontSize: 16),
            ),
            SizedBox(height: 20),
            TextFormField(
              controller: emailController,
              style: TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Email',
                hintStyle: TextStyle(color: Colors.white),
                prefixIcon: Icon(Icons.email, color: Colors.white),
                filled: true,
                fillColor: Colors.grey[800],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            SizedBox(height: 20),
            if (showVerificationFields)
              Column(
                children: [
                  SizedBox(height: 20), 
                  _buildOtpVerification(),
                  SizedBox(height: 20), 
                  TextFormField(
                    controller: newPasswordController,
                    style: TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'New password',
                      hintStyle: TextStyle(color: Colors.white),
                      prefixIcon: Icon(Icons.lock, color: Colors.white),
                      filled: true,
                      fillColor: Colors.grey[800],
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    obscureText: true,
                  ),
                ],
              ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                if (!showVerificationFields) {
                  sendCode();
                } else {
                  pwdOublie();
                }
              },
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white, backgroundColor: Colors.green,
                padding: EdgeInsets.symmetric(horizontal: 50, vertical: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(showVerificationFields ? 'Update Password' : 'Send Code'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOtpVerification() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Verification Code:',
          style: TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 8),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            for (int i = 0; i < otpFieldControllers.length; i++)
              _buildOtpTextField(otpFieldControllers[i], last: i == otpFieldControllers.length - 1),
          ],
        ),
      ],
    );
  }

  Widget _buildOtpTextField(TextEditingController controller, {required bool last}) {
    return Expanded(
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 4),
        child: TextField(
          controller: controller,
          onChanged: (value) {
            if (value.length == 1 && !last) {
              FocusScope.of(context).nextFocus();
            }
            if (value.length == 0 && !last) {
              FocusScope.of(context).previousFocus();
            }
          },
          textAlign: TextAlign.center,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
          keyboardType: TextInputType.number,
          maxLength: 1,
          decoration: InputDecoration(
            counter: Offstage(),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Colors.green, width: 2),
              borderRadius: BorderRadius.circular(10),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Colors.green, width: 2),
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        ),
      ),
    );
  }

  void sendCode() async {
    final email = emailController.text.trim();
    if (email.isEmpty) {
      Fluttertoast.showToast(
        msg: 'Email field is empty',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
      return;
    }

    if (!_isValidEmail(email)) {
      Fluttertoast.showToast(
        msg: 'Invalid email format',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
      return;
    }

    setState(() {
      loading = true;
    });

    try {
      await authService.initiatePasswordReset(email);
      setState(() {
        showVerificationFields = true;
        loading = false;
      });
      Fluttertoast.showToast(
        msg: 'Code sent successfully',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } catch (e) {
      setState(() {
        loading = false;
      });
      Fluttertoast.showToast(
        msg: 'Error sending code: $e',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  void pwdOublie() async {
    final newPassword = newPasswordController.text.trim();
    final email = emailController.text.trim();

    if (newPassword.isEmpty || email.isEmpty || otpFieldControllers.any((controller) => controller.text.isEmpty)) {
      Fluttertoast.showToast(
        msg: 'Some fields are empty',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
      return;
    }

    setState(() {
      loading = true;
    });

    try {
      String verificationCode = otpFieldControllers.map((controller) => controller.text).join();
      await authService.updatePassword({
        'email': email,
        'code': verificationCode,
        'password': newPassword,
      });
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => PasswordUpdatedSuccess()),
      );
      Fluttertoast.showToast(
        msg: 'Password updated successfully',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } catch (e) {
      setState(() {
        loading = false;
      });
      Fluttertoast.showToast(
        msg: 'Error updating password: ',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  bool _isValidEmail(String email) {
    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
    return emailRegex.hasMatch(email);
  }
}
