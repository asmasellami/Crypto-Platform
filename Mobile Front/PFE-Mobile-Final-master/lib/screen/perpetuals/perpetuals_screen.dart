import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:frontmobile/screen/perpetuals/perpetuals_details.dart';
import '../../model/perpetuals_data.dart';

class PerpetualDashboard extends StatefulWidget {
  @override
  _PerpetualDashboardState createState() => _PerpetualDashboardState();
}

class _PerpetualDashboardState extends State<PerpetualDashboard> {
  List<PerpetualData> perpetualData = [];

  @override
  void initState() {
    super.initState();
    // Load and parse your JSON data for perpetual data
    loadJsonData();
  }

  Future<void> loadJsonData() async {
    final String data =
        await DefaultAssetBundle.of(context).loadString('assets/perpetuals.json'); 
    final List<dynamic> jsonList = json.decode(data)['perpetuals']; 

    setState(() {
      perpetualData = jsonList.map((e) => PerpetualData.fromJson(e)).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Perpetual Data'),
      ),
      body: perpetualData.isNotEmpty
          ? PaginatedDataTable(
              header: Text('Perpetual Data'),
              columns: [
                DataColumn(label: Text('Ticker')),
                DataColumn(label: Text('Price')),
                DataColumn(label: Text('Open Interest')),
              ],
              source: PerpetualDataSource(perpetualData, context),
              rowsPerPage: 5,
            )
          : Center(
              child: CircularProgressIndicator(),
            ),
    );
  }
}

class PerpetualDataSource extends DataTableSource {
  final List<PerpetualData> _data;
  final BuildContext _context;

  PerpetualDataSource(this._data, this._context);

  @override
  DataRow getRow(int index) {
    final data = _data[index];
    return DataRow(
      onSelectChanged: (selected) {
        Navigator.push(
          _context,
          MaterialPageRoute(
            builder: (_context) => PerpetualDetailsScreen(perpetualData: data),
          ),
        );
      },
      cells: [
        DataCell(Text(data.currency.value.toString())),
        DataCell(Text(data.price.value.toString())),
        DataCell(Text(data.openInterest.value.toString())),
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
