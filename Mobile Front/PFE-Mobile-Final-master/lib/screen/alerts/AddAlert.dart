import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:frontmobile/entities/alert.dart';
import 'package:frontmobile/services/AlertService.dart';
import 'package:frontmobile/services/AuthService.dart';

class CreateAlertScreen extends StatefulWidget {
  @override
  _CreateAlertScreenState createState() => _CreateAlertScreenState();
}

class _CreateAlertScreenState extends State<CreateAlertScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _thresholdController = TextEditingController();

  final AlertService _alertService = AlertService();
  final AuthService _authService = AuthService();

  String _selectedType = 'futures'; 
  String? _selectedMetric;
  String? _selectedOperator = '>';
  String? _selectedTriggerFrequency = '1min';
  bool _emailNotification = false;

  List<String> _availableMetrics = [];
  final List<String> _futuresMetrics = ['price', 'change', 'open_interest', 'volume', 'yield', 'basis', 'open_interest_volume'];
  final List<String> _optionsMetrics = ['underlying_price', 'change', 'open_interest', 'volume', 'atm_vol', 'basis', '_25_delta_risk_reversal', '_25_delta_butterfly', 'open_interest_volume'];

  @override
  void initState() {
    super.initState();
    _updateMetrics();
  }

  void _updateMetrics() {
    setState(() {
      _availableMetrics = _selectedType == 'futures' ? _futuresMetrics : _optionsMetrics;
      _selectedMetric = _availableMetrics.isNotEmpty ? _availableMetrics[0] : null;
    });
  }

  Future<void> _createAlert(BuildContext context) async {
    try {
      final userId = await _authService.getCurrentUserId();
      if (userId == null) {
        throw Exception('User ID not found');
      }

      final newAlert = await _alertService.createAlert(Alert(
        id: 0, 
        userId: userId,
        name: _nameController.text,
        fieldName: _selectedMetric!,
        operator: _selectedOperator!,
        threshold: double.parse(_thresholdController.text),
        emailNotification: _emailNotification,
        triggerFrequency: _selectedTriggerFrequency!,
        type: _selectedType, 
        active: true, 
      ));

      if (newAlert != null) {
        Fluttertoast.showToast(
          msg: 'Alert created successfully',
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          timeInSecForIosWeb: 1,
          backgroundColor: Colors.green,
          textColor: Colors.white,
          fontSize: 16.0,
        );
     
        Navigator.pop(context, true); 
      } else {
        throw Exception('Failed to create alert');
      }
    } catch (e) {
      print('Error creating alert: $e');
      Fluttertoast.showToast(
        msg: 'Failed to create alert',
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
        title: Text('Create Alert', style: TextStyle(color: Colors.white)),
       backgroundColor: Color(0xFF1DA2B4),
      ), 
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              SizedBox(height: 20),
              _buildTextField(_nameController, 'Name'),
              SizedBox(height: 20),
              _buildRadioListTile('Type', 'futures', 'Futures', 'options', 'Options'),
              SizedBox(height: 20),
              _buildDropdownField('Metric', _selectedMetric, _availableMetrics, (String? newValue) {
                setState(() {
                  _selectedMetric = newValue;
                });
              }),
              SizedBox(height: 20),
              _buildDropdownField('Operator', _selectedOperator, ['>', '<', '=', '!=', '>=', '<='], (String? newValue) {
                setState(() {
                  _selectedOperator = newValue;
                });
              }),
              SizedBox(height: 20),
              _buildTextField(_thresholdController, 'Value', TextInputType.number),
              SizedBox(height: 20),
              _buildDropdownField('Trigger Frequency', _selectedTriggerFrequency, ['1min', '5min', '24h'], (String? newValue) {
                setState(() {
                  _selectedTriggerFrequency = newValue;
                });
              }),
              SizedBox(height: 20),
              SwitchListTile(
                title: Text('Email Notification', style: TextStyle(color: Colors.white)),
                value: _emailNotification,
                onChanged: (bool value) {
                  setState(() {
                    _emailNotification = value;
                  });
                },
                activeColor: Color(0xFF1DA2B4),
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: () async {
                  await _createAlert(context);
                },
                style: ElevatedButton.styleFrom(
                  primary: Color(0xFF1DA2B4),
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text('Create Alert', style: TextStyle(color: Colors.white, fontSize: 16)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label, [TextInputType keyboardType = TextInputType.text]) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Color.fromARGB(255, 255, 255, 255)),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Color(0xFF1DA2B4)),
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.white),
        ),
      ),
      style: TextStyle(color: Colors.white),
      keyboardType: keyboardType,
    );
  }

  Widget _buildRadioListTile(String title, String value1, String text1, String value2, String text2) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: TextStyle(color: Color(0xFF1DA2B4), fontSize: 16)),
        Row(
          children: [
            Expanded(
              child: RadioListTile<String>(
                title: Text(text1, style: TextStyle(color: Colors.white)),
                value: value1,
                groupValue: _selectedType,
                onChanged: (String? value) {
                  setState(() {
                    _selectedType = value!;
                    _updateMetrics();
                  });
                },
                activeColor: Color(0xFF1DA2B4),
              ),
            ),
            Expanded(
              child: RadioListTile<String>(
                title: Text(text2, style: TextStyle(color: Colors.white)),
                value: value2,
                groupValue: _selectedType,
                onChanged: (String? value) {
                  setState(() {
                    _selectedType = value!;
                    _updateMetrics();
                  });
                },
                activeColor: Color(0xFF1DA2B4),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDropdownField(String label, String? value, List<String> items, ValueChanged<String?> onChanged) {
    return DropdownButtonFormField<String>(
      value: value,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Color(0xFF1DA2B4)),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Color(0xFF1DA2B4)),
        ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.white),
        ),
      ),
      iconEnabledColor: Colors.white,
      dropdownColor: Color(0xFF1B2026),
      style: TextStyle(color: Colors.white),
      items: items.map<DropdownMenuItem<String>>((String item) {
        return DropdownMenuItem<String>(
          value: item,
          child: Text(item),
        );
      }).toList(),
      onChanged: onChanged,
    );
  }
}
