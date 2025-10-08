import 'package:flutter/material.dart';
import 'package:frontmobile/model/filter.dart';

class FutureFilter extends StatefulWidget {
  @override
  _FutureFilterState createState() => _FutureFilterState();
}

class _FutureFilterState extends State<FutureFilter> {
  List<Filter> filters = [];
  String selectedColumn = '';
  String selectedOperator = '';
  String filterValue = '';

  List<String> columnOptions = [
    'Ticker',
    'Price',
    'Basis',
    
   
  ];

  Map<String, List<String>> operators = {
    'ticker.value': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is empty', 'Is not empty'],
    'price.value': ['=', '!=', '<', '>', '<=', '>='],
    'change.value': ['=', '!=', '<', '>', '<=', '>='],
    'basis.value': ['=', '!=', '<', '>', '<=', '>='],
    'yield.value': ['=', '!=', '<', '>', '<=', '>='],
    'volume.value': ['=', '!=', '<', '>', '<=', '>='],
    'volume.change_usd_percentage': ['=', '!=', '<', '>', '<=', '>='],
    'open_interest.value': ['=', '!=', '<', '>', '<=', '>='],
    'open_interest.change_usd': ['=', '!=', '<', '>', '<=', '>='],
    'change_usd_percentage': ['=', '!=', '<', '>', '<=', '>='],
    'open_interest_volume.value': ['=', '!=', '<', '>', '<=', '>='],
    'open_interest_volume.change': ['=', '!=', '<', '>', '<=', '>=']
  };

  void addFilter() {
    if (selectedColumn.isNotEmpty && selectedOperator.isNotEmpty && filterValue.isNotEmpty) {
      Filter newFilter = Filter(selectedColumn, selectedOperator, filterValue);
      setState(() {
        filters.add(newFilter);
        selectedColumn = '';
        selectedOperator = '';
        filterValue = '';
      });
    }
  }

  void removeFilter(int index) {
    setState(() {
      filters.removeAt(index);
    });
  }

 @override
Widget build(BuildContext context) {
  return Container(
    padding: EdgeInsets.all(16.0),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Sélection de la colonne
        DropdownButtonFormField(
          value: selectedColumn,
          hint: Text('Select column'),
          items: columnOptions.map((column) {
            return DropdownMenuItem(
              value: column,
              child: Text(column),
            );
          }).toList(),
          onChanged: (value) {
            setState(() {
              selectedColumn = value.toString();
            });
          },
        ),
        SizedBox(height: 10.0),

        // Sélection de l'opérateur
        DropdownButtonFormField(
          value: selectedOperator,
          hint: Text('Select operator'),
          items: selectedColumn.isNotEmpty
              ? operators[selectedColumn]?.map((operator) {
                  return DropdownMenuItem(
                    value: operator,
                    child: Text(operator),
                  );
                }).toList()
              : [],
          onChanged: (value) {
            setState(() {
              selectedOperator = value.toString();
            });
          },
        ),
        SizedBox(height: 10.0),

        // Saisie de la valeur du filtre
        TextFormField(
          decoration: InputDecoration(
            labelText: 'Enter filter value',
          ),
          onChanged: (value) {
            setState(() {
              filterValue = value;
            });
          },
        ),
        SizedBox(height: 10.0),

        // Bouton pour ajouter le filtre
        ElevatedButton(
          onPressed: addFilter,
          child: Text('Add Filter'),
        ),
        SizedBox(height: 20.0),

        // Affichage des filtres ajoutés
        ListView.builder(
          shrinkWrap: true,
          itemCount: filters.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text('Column: ${filters[index].column}'),
              subtitle: Text('Operator: ${filters[index].operator}\nValue: ${filters[index].value}'),
              trailing: IconButton(
                icon: Icon(Icons.delete),
                onPressed: () {
                  removeFilter(index);
                },
              ),
            );
          },
        ),
      ],
    ),
  );
}
}