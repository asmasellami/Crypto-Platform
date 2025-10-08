class UserNotification {
  final int id;
  final int alertId;
  final String username;
  final int userId;
  final String message;
  final bool isSent;
  final String createdAt;
  final bool viewed;
  final String tickerDetails;

  final String alertName;     
  final String alertType;   
  final String alertFieldName;
  final String alertoperator;
  final double alertthreshold;


  UserNotification({
    required this.id,
    required this.alertId,
    required this.username,
    required this.userId,
    required this.message,
    required this.isSent,
    required this.createdAt,
    required this.viewed,
    required this.tickerDetails,

    required this.alertName,
    required this.alertFieldName,
    required this.alertType,
    required this.alertthreshold,
    required this.alertoperator,
    

  });

  factory UserNotification.fromJson(Map<String, dynamic> json) {
    return UserNotification(
      id: json['id'],
      alertId: json['alertId'],
      username: json['username'],
      userId: json['userId'],
      message: json['message'],
      isSent: json['isSent'] ?? false, 
      createdAt: json['createdAt'],
      viewed: json['viewed'] ?? false, 
      tickerDetails: json['tickerDetails'],

      alertName: json['alertName'],
      alertFieldName: json['alertFieldName'],
      alertType: json['alertType'],
      alertthreshold: json['alertthreshold'],
      alertoperator: json['alertoperator'],
    
    );
  }
}
