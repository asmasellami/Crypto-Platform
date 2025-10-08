import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:frontmobile/model/futures_data.dart';


class FutureDashboard extends StatefulWidget {
  @override
  _FutureDashboardState createState() => _FutureDashboardState();
}

class _FutureDashboardState extends State<FutureDashboard> {
  List<FuturesData> futureData = [];
  List<FuturesData> originalData = [];
  int? _sortColumnIndex;
  bool _sortAscending = true;
  String _selectedMode = 'USD';

  @override
  void initState() {
    super.initState();
    loadJsonData();
    //getFutures();
    _sortColumnIndex = null;
    _sortAscending = true;
  }

  Future<void> loadJsonData() async {
    final String data =
        await DefaultAssetBundle.of(context).loadString('assets/futures.json');
    final List<dynamic> jsonList = json.decode(data)['futures'];

    setState(() {
      futureData = jsonList.map((e) => FuturesData.fromJson(e)).toList();
      originalData = List.from(futureData);
    });
  }




  String getHeaderText(String columnName) {
    if (_selectedMode == 'USD') {
      return columnName;
    } else {
      Map<String, String> notionalLabels = {
        'volume.value': '24h Volume',
        'volume.change_usd_percentage': 'Chg%',
        'open_interest.value': 'Open Interest',
        'open_interest.change_usd': 'OI Change',
        'open_interest.change_usd_percentage': 'Chg%',
        'volume.change_notional_percentage': 'Chg%',
        'open_interest.change_notional_percentage': 'Chg%',
      };
      return notionalLabels.containsKey(columnName)
          ? notionalLabels[columnName]!
          : columnName;
    }
  }

  void _sort<T>(
    Comparable<T> Function(FuturesData d) getField,
    int columnIndex,
    bool ascending,
  ) {
    if (_sortColumnIndex == columnIndex && _sortAscending == ascending) {
      return;
    }

    futureData.sort((a, b) {
      final aValue = getField(a);
      final bValue = getField(b);
      return ascending
          ? Comparable.compare(aValue, bValue)
          : Comparable.compare(bValue, aValue);
    });

    setState(() {
      _sortColumnIndex = columnIndex;
      _sortAscending = ascending;
    });
  }

  void _resetSorting() {
    setState(() {
      _sortColumnIndex = null;
      _sortAscending = true;
      futureData = List.from(originalData);
    });
  }

  double getTotalVolume() {
    if (futureData.isEmpty) return 0;
    return futureData
        .map((future) => future.volume.value)
        .reduce((total, value) => total + value);
  }

  double getTotalOpenInterest() {
    if (futureData.isEmpty) return 0;
    return futureData
        .map((future) => future.openInterest.value)
        .reduce((total, value) => total + value);
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Future Data',
          style:
              TextStyle(color: Colors.white), // Set title text color to white
        ),
        backgroundColor: Color.fromARGB(225, 1, 22, 39),
        actions: [
          IconButton(
            icon: Icon(
              Icons.refresh,
              color: Colors.white, 
            ),
            onPressed: _resetSorting,
          ),
        ],
      ),
      backgroundColor: const Color.fromARGB(225, 1, 22, 39),
      body: ListView(
        children: [
          StatsWidget(
            totalVolume: getTotalVolume(),
            totalOpenInterest: getTotalOpenInterest(),
          ),
          Container(
            child: futureData.isNotEmpty
                ? PaginatedDataTable(
                    columnSpacing: 2.0,
                    /*   header: Text(
                      'Global futures',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          fontSize: 17.0, fontWeight: FontWeight.bold),
                    ), */
                    headingRowColor: MaterialStateProperty.resolveWith<Color>(
                      (Set<MaterialState> states) {
                        return Color.fromARGB(225, 1, 22, 39);
                      },
                    ),
                    columns: [
                      DataColumn(
                        label: Text(
                          'Ticker',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white),
                        ),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => data.ticker.value,
                            columnIndex,
                            ascending),
                      ),
                      DataColumn(
                        label: Text('Price',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white)),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => data.price.value, columnIndex, ascending),
                      ),
                      DataColumn(
                        label: Text('Chg%',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white)),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => data.change.value,
                            columnIndex,
                            ascending),
                      ),
                      DataColumn(
                        label: Text('Basis',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white)),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => data.basis.value, columnIndex, ascending),
                      ),
                      DataColumn(
                        label: Text('Chg%',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white)),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => data.basis.change,
                            columnIndex,
                            ascending),
                      ),
                      DataColumn(
                        label: Text('APR',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white)),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => data.yield.value, columnIndex, ascending),
                      ),
                      DataColumn(
                        label: Text(
                          getHeaderText('24h Volume'),
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white),
                        ),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => data.volume.value,
                            columnIndex,
                            ascending),
                      ),
                      DataColumn(
                        label: Text(
                          getHeaderText('Chg%'),
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white),
                        ),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => _selectedMode == 'USD'
                                ? data.volume.changeUsdPercentage
                                : data.volume.changeNotionalPercentage,
                            columnIndex,
                            ascending),
                      ),
                      DataColumn(
                        label: Text(
                          getHeaderText('Open Interest'),
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white),
                        ),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => data.openInterest.value,
                            columnIndex,
                            ascending),
                      ),
                      DataColumn(
                        label: Text(
                          getHeaderText('OI Change'),
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white),
                        ),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => _selectedMode == 'USD'
                                ? data.openInterest.changeUsd
                                : data.openInterest.changeNotional,
                            columnIndex,
                            ascending),
                      ),
                      DataColumn(
                        label: Text(
                          getHeaderText('Chg%'),
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.white),
                        ),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => _selectedMode == 'USD'
                                ? data.openInterest.changeUsdPercentage
                                : data.openInterest.changeNotionalPercentage,
                            columnIndex,
                            ascending),
                      ),
                      DataColumn(
                        label: Text('OI/24H ',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white)),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => data.openInterestVolume.value,
                            columnIndex,
                            ascending),
                      ),
                      DataColumn(
                        label: Text('Chg%',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white)),
                        onSort: (columnIndex, ascending) => _sort(
                            (data) => data.openInterestVolume.change,
                            columnIndex,
                            ascending),
                      ),
                    ],
                    source: FutureDataSource(futureData, context),
                    rowsPerPage: 9,
                    dataRowHeight: 40,
                    sortColumnIndex: _sortColumnIndex,
                    sortAscending: _sortAscending,
                 
                  )
                : Center(
                   /*  child: CircularProgressIndicator(), */
                  ),
          ),
        ],
      ),
    );
  }
}

class FutureDataSource extends DataTableSource {
  final List<FuturesData> _data;
  final BuildContext _context;

  FutureDataSource(this._data, this._context);

  @override
  DataRow getRow(int index) {
    final data = _data[index];
    return DataRow.byIndex(
      index: index,
      color: MaterialStateProperty.resolveWith<Color>(
        (Set<MaterialState> states) {
          if (states.contains(MaterialState.selected)) {
            return Theme.of(_context).colorScheme.primary.withOpacity(0.08);
          }
          if (index % 2 == 0) {
            return Color.fromARGB(255, 1, 22, 39);
          } else {
            return Color.fromARGB(225, 1, 22, 39);
          }
        },
      ),
      cells: [
        DataCell(
          Text(
            data.ticker.value.toString(),
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white),
          ),
          onTap: () => print("Ticker"),
        ),
        DataCell(
          Text(
            '\$${formatNumber(data.price.value)}',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white),
          ),
          onTap: () => print("Price"),
        ),
        DataCell(
          Text(
            '(${formatNumber(data.change.value)}%)',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white),
          ),
          onTap: () => print("Chg%"),
        ),
        DataCell(
          Container(
            color: getGradientColor(data.basis.intensity),
            child: Center(
              child: Text(
                '${formatNumber(data.yield.value)}%',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          onTap: () => print("Basis"),
        ),
        DataCell(
          Container(
            color: getGradientColor(data.basis.intensity),
            child: Center(
              child: Text(
                '(${formatNumber(data.basis.change)}%)',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          onTap: () => print("Chg%"),
        ),
        DataCell(
          Container(
            color: getGradientColor(data.yield.intensity),
            child: Center(
              child: Text(
                '${formatNumber(data.yield.value)}%',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          onTap: () => print("APR"),
        ),
        DataCell(
          Container(
            color: getGradientColor(data.volume.intensity),
            child: Center(
              child: Text(
                '\$${formatNumber(data.volume.value)}',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          onTap: () => print("24h Volume"),
        ),
        DataCell(
          Container(
            color: getGradientColor(data.volume.intensity),
            child: Center(
              child: Text(
                '(${formatNumber(data.volume.changeUsdPercentage)}%)',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          onTap: () => print("Chg%"),
        ),
        DataCell(
          Container(
            color: getGradientColor(data.openInterest.intensity),
            child: Center(
              child: Text(
                '\$${formatNumber(data.openInterest.value)}',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          onTap: () => print("Open Interest"),
        ),
        DataCell(
          Container(
            color: getGradientColor(data.openInterest.changeIntensity),
            child: Center(
              child: Text(
                '\$${formatNumber(data.openInterest.changeUsd)}',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          onTap: () => print(
            "OI Change",
          ),
        ),
        DataCell(
          Container(
            color: getGradientColor(data.openInterest.changeIntensity),
            child: Center(
              child: Text(
                '(${formatNumber(data.openInterest.changeUsdPercentage)}%)',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          onTap: () => print("Chg%"),
        ),
        DataCell(
          Text(
            '\$${formatNumber(data.openInterestVolume.value)}',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white),
          ),
          onTap: () => print("OI/24H Volume "),
        ),
        DataCell(
          Text(
            '(${formatNumber(data.openInterestVolume.change)}%)',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white),
          ),
          onTap: () => print("Chg% "),
        ),
      ],
    );
  }

  @override
  bool get isRowCountApproximate => false;

  @override
  int get rowCount => _data.length;

  @override
  int get selectedRowCount => 0;
}

class StatsWidget extends StatelessWidget {
  final double totalVolume;
  final double totalOpenInterest;

  const StatsWidget({
    required this.totalVolume,
    required this.totalOpenInterest,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
     
      margin: EdgeInsets.all(30),
      child: Padding(
        padding: EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Total Volume & OI',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 20.0,
              ),
            ),
          
            Text(
              'Total Volume: ${formatNumber(totalVolume)}',
              style: TextStyle(color: Colors.white,fontSize: 16.0,),
              
            ),
            Text(
              'Total Open Interest: ${formatNumber(totalOpenInterest)}',
              style: TextStyle(color: Colors.white,fontSize: 16.0,),
            ),
          ],
        ),
      ),
    );
  }
}

void main() {
  runApp(MaterialApp(
    home: FutureDashboard(),
  ));
}

String formatNumber(dynamic value) {
  if (value is double || value is int) {
    bool isNegative = false;
    if (value is int) {
      if (value < 0) {
        isNegative = true;
        value = -value;
      }
    } else if (value is double) {
      if (value < 0) {
        isNegative = true;
        value = -value;
      }
    }

    if (value >= 1e12) {
      return '${isNegative ? '-' : ''}${(value / 1e12).toStringAsFixed(2)}T';
    } else if (value >= 1e9) {
      return '${isNegative ? '-' : ''}${(value / 1e9).toStringAsFixed(2)}B';
    } else if (value >= 1e6) {
      return '${isNegative ? '-' : ''}${(value / 1e6).toStringAsFixed(2)}M';
    } else if (value >= 1e3) {
      return '${isNegative ? '-' : ''}${(value / 1e3).toStringAsFixed(2)}K';
    } else {
      return '${isNegative ? '-' : ''}${value.toStringAsFixed(2)}';
    }
  } else {
    return 'Invalid Number';
  }
}

String formatValueWithoutCurrency(dynamic value) {
  if (value is double) {
    return value.toStringAsFixed(2);
  } else if (value is int) {
    return value.toString();
  } else {
    return 'Invalid Number';
  }
}

Color getGradientColor(double intensity) {
  if (intensity >= 0) {
    final green = Color.fromRGBO(81, 204, 139, 1.0);
    return green.withOpacity(intensity);
  } else {
    final red = Color.fromRGBO(251, 113, 113, 1.0);
    return red.withOpacity(intensity.abs());
  }
}
