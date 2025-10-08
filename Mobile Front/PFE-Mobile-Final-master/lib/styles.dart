import 'package:flutter/material.dart';

// Text styles
final TextStyle titleTextStyle = TextStyle(
  color: Colors.black,
  fontWeight: FontWeight.bold,
);

final TextStyle bodyTextStyle = TextStyle(
  color: Colors.black,
);

// Box decoration for cards
final BoxDecoration cardDecoration = BoxDecoration(
  color: Color(0xFF0e151a), // Convert hex color to Flutter Color
  border: Border.all(
    color: Color(0xFF45f3ff), // Convert hex color to Flutter Color
    width: 2,
  ),
  borderRadius: BorderRadius.circular(4),
  boxShadow: [
    BoxShadow(
      color: Colors.black12,
      blurRadius: 3,
      offset: Offset(0, 2),
    ),
  ],
);

// Apply this style to your Scaffold's body
final BoxDecoration bodyDecoration = BoxDecoration(
  color: Color(0xFF333333), // Convert hex color to Flutter Color
);

// Apply this style to your table
final BoxDecoration tableDecoration = BoxDecoration(
  color: Color(0xFF0e151a), // Convert hex color to Flutter Color
  border: Border.all(
    color: Color(0xFF3a4149), // Convert hex color to Flutter Color
    width: 1,
  ),
);

// Apply this style to your table headers and cells
final BoxDecoration cellDecoration = BoxDecoration(
  border: Border.all(
    color: Color(0xFF3a4149), // Convert hex color to Flutter Color
    width: 1,
  ),
);

// Apply this style to your pagination controls
final TextStyle paginationTextStyle = TextStyle(
  color: Colors.white,
);
