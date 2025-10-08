import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:frontmobile/screen/login/login.dart';
import 'package:frontmobile/services/AuthService.dart';
class AccountActivation extends StatefulWidget {
  @override
  _AccountActivationState createState() => _AccountActivationState();
}

class _AccountActivationState extends State<AccountActivation> {
  TextEditingController _emailController = TextEditingController();
  List<TextEditingController> _codeControllers =
      List.generate(6, (index) => TextEditingController());

  bool _showVerificationFields = false;

  AuthService _authService = AuthService();

  void _verifyUserByEmail() async {
    String userEmail = _emailController.text.trim();
    if (userEmail.isEmpty) {
      Fluttertoast.showToast(
        msg: 'Please enter an email.',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
      return;
    }

    try {
      await _authService.verifyUser(userEmail);
      setState(() {
        _showVerificationFields = true;
      });
      Fluttertoast.showToast(
        msg: 'Verification email sent successfully',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } catch (error) {
      print('Verification failed: $error');
      String errorMessage = 'Unexpected error during verification.';
      if (error.toString().contains('404')) {
        errorMessage = 'Email not found!';
      } else if (error.toString().contains('409')) {
        errorMessage = 'Email is already verified';
      }
      Fluttertoast.showToast(
        msg: errorMessage,
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.red,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  void _onValidateCode() async {
    String verificationCode = _codeControllers.map((controller) => controller.text).join();
    try {
      await _authService.validateEmail(verificationCode);
      setState(() {
        _showVerificationFields = false;
      });
      Fluttertoast.showToast(
        msg: 'Your account is successfully verified',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => Login()),
      );
    } catch (error) {
      print('Validation failed: $error');
      String errorMessage = 'Validation failed';
      if (error.toString().contains('500')) {
        errorMessage = 'Invalid code';
      }
      Fluttertoast.showToast(
        msg: errorMessage,
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
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Color.fromARGB(255, 82, 85, 85),
        title: Text('Activate Account', style: TextStyle(color: Colors.white),),
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
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            SizedBox(height: 20),
            Text(
              'Account Activation',
              style: TextStyle(color: Colors.white, fontSize: 32),
            ),
            Text(
              'Enter your email So we can send you a verification code to Activate your account. ',
              style: TextStyle(color: Colors.white, fontSize: 16),
            ),
            SizedBox(height: 20.0),
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
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
              style: TextStyle(color: Colors.white),
            ),
            SizedBox(height: 20.0),
            _showVerificationFields
                ? Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: _buildVerificationCodeFields(),
                  )
                : SizedBox(),
            SizedBox(height: 20.0),
            ElevatedButton(
              onPressed: _showVerificationFields
                  ? _onValidateCode
                  : _verifyUserByEmail,
              child: Text(_showVerificationFields
                  ? 'Validate Code'
                  : 'Send Verification code'),
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white, backgroundColor: Colors.green,
                padding: EdgeInsets.symmetric(horizontal: 50, vertical: 10),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildVerificationCodeFields() {
    List<Widget> fields = [];
    for (int i = 0; i < 6; i++) {
      fields.add(
        Expanded(
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 4),
            child: TextField(
              controller: _codeControllers[i],
              onChanged: (value) {
                if (value.length == 1 && i < 5) {
                  FocusScope.of(context).nextFocus();
                }
                if (value.length == 0 && i > 0) {
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
        ),
      );
    }
    return fields;
  }
}