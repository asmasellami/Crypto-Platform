class Alert {
  final int id;
  final String name;
  final int userId;
  final String fieldName;
  final String operator;
  final double threshold;
  final bool emailNotification;
  final String triggerFrequency;
  final String type; 
  final bool active;

  Alert({
    required this.id,
    required this.name,
    required this.userId,
    required this.fieldName,
    required this.operator,
    required this.threshold,
    required this.emailNotification,
    required this.triggerFrequency,
    required this.type, 
    required this.active, 
    
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'userId': userId,
      'fieldName': fieldName,
      'operator': operator,
      'threshold': threshold,
      'emailNotification': emailNotification,
      'triggerFrequency': triggerFrequency,
       'type': type, 
      'active': active, 
     
    };
  }

  factory Alert.fromJson(Map<String, dynamic> json) {
    return Alert(
      id: json['id'],
      name: json['name'],
      userId: json['userId'],
      fieldName: json['fieldName'],
      operator: json['operator'],
      threshold: json['threshold'],
      emailNotification: json['emailNotification'],
      triggerFrequency: json['triggerFrequency'],
      type: json['type'], 
       active: json['active'], 
     
    );
  }
}
