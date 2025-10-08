 class FuturesData {
   Ticker ticker;
   Currency currency;
   Expiry expiry;
   Price price;
   Change change;
   OpenInterest openInterest;
   Volume volume;
   Yield yield;
   Basis basis;
   OpenInterestVolume openInterestVolume;
  dynamic market;

  FuturesData({
    required this.ticker,
    required this.currency,
    required this.expiry,
    required this.price,
    required this.change,
    required this.openInterest,
    required this.volume,
    required this.yield,
    required this.basis,
    required this.openInterestVolume,
    required this.market,
  });

  factory FuturesData.fromJson(Map<String, dynamic> json) {
    return FuturesData(
      ticker: Ticker.fromJson(json['ticker']),
      currency: Currency.fromJson(json['currency']),
      expiry: Expiry.fromJson(json['expiry']),
      price: Price.fromJson(json['price']),
      change: Change.fromJson(json['change']),
      openInterest: OpenInterest.fromJson(json['open_interest']),
      volume: Volume.fromJson(json['volume']),
      yield: Yield.fromJson(json['yield']),
      basis: Basis.fromJson(json['basis']),
      openInterestVolume: OpenInterestVolume.fromJson(json['open_interest_volume']),
      market: json['market'],
    );
  }
}

class Ticker {
  final dynamic value;

  Ticker({required this.value});

  factory Ticker.fromJson(Map<String, dynamic> json) {
    return Ticker(value: json['value']);
  }
}

class Currency {
  final dynamic value;

  Currency({required this.value});

  factory Currency.fromJson(Map<String, dynamic> json) {
    return Currency(value: json['value']);
  }
}

class Expiry {
  final dynamic value;

  Expiry({required this.value});

  factory Expiry.fromJson(Map<String, dynamic> json) {
    return Expiry(value: json['value']);
  }
}

class Price {
  final dynamic value;

  Price({required this.value});

  factory Price.fromJson(Map<String, dynamic> json) {
    return Price(value: json['value'].toDouble());
  }
}

class Change {
  final dynamic value;

  Change({required this.value});

  factory Change.fromJson(Map<String, dynamic> json) {
    return Change(value: json['value'].toDouble());
  }
}

class OpenInterest {
  final dynamic value;
  final dynamic intensity;
  final dynamic notional;
  final dynamic changeUsdPercentage;
  final dynamic changeUsd;
  final dynamic changeNotional;
  final dynamic changeNotionalPercentage;
  final dynamic changeIntensity;

  OpenInterest({
    required this.value,
    required this.intensity,
    required this.notional,
    required this.changeUsdPercentage,
    required this.changeUsd,
    required this.changeNotional,
    required this.changeNotionalPercentage,
    required this.changeIntensity,
  });

  factory OpenInterest.fromJson(Map<String, dynamic> json) {
    return OpenInterest(
      value: json['value'].toDouble()?? 0.0,
      intensity: json['intensity'].toDouble()?? 0.0,
      notional: json['notional'].toDouble()?? 0.0,
      changeUsdPercentage: json['change_usd_percentage'].toDouble()?? 0.0,
      changeUsd: json['change_usd'].toDouble()?? 0.0,
      changeNotional: json['change_notional'].toDouble()?? 0.0,
      changeNotionalPercentage: json['change_notional_percentage'].toDouble()?? 0.0,
      changeIntensity: json['change_intensity'].toDouble()?? 0.0,
    );
  }
}

class Volume {
  final dynamic value;
  final dynamic intensity;
  final dynamic notional;
  final dynamic changeUsdPercentage;
  final dynamic changeUsd;
  final dynamic changeNotional;
  final dynamic changeNotionalPercentage;

  Volume({
    required this.value,
    required this.intensity,
    required this.notional,
    required this.changeUsdPercentage,
    required this.changeUsd,
    required this.changeNotional,
    required this.changeNotionalPercentage,
  });

  factory Volume.fromJson(Map<String, dynamic> json) {
    return Volume(
      value: json['value'].toDouble()?? 0.0,
      intensity: json['intensity'].toDouble()?? 0.0,
      notional: json['notional'].toDouble()?? 0.0,
      changeUsdPercentage: json['change_usd_percentage'].toDouble()?? 0.0,
      changeUsd: json['change_usd'].toDouble()?? 0.0,
      changeNotional: json['change_notional'].toDouble()?? 0.0,
      changeNotionalPercentage: json['change_notional_percentage'].toDouble()?? 0.0,
    );
  }
}

class Yield {
  final dynamic value;
  final dynamic change;
  final dynamic intensity;

  Yield({required this.value, required this.change, required this.intensity});

  factory Yield.fromJson(Map<String, dynamic> json) {
    return Yield(
      value: json['value'].toDouble()?? 0.0,
      change: json['change'].toDouble()?? 0.0,
      intensity: json['intensity'].toDouble()?? 0.0,
    );
  }
}

class Basis {
  final dynamic value;
  final dynamic change;
  final dynamic intensity;

  Basis({required this.value, required this.change, required this.intensity});

  factory Basis.fromJson(Map<String, dynamic> json) {
    return Basis(
      value: json['value'].toDouble()?? 0.0,
      change: json['change'].toDouble()?? 0.0,
      intensity: json['intensity'].toDouble()?? 0.0,
    );
  }
}

class OpenInterestVolume {
  final dynamic value;
  final dynamic change;

  OpenInterestVolume({required this.value, required this.change});

  factory OpenInterestVolume.fromJson(Map<String, dynamic> json) {
    return OpenInterestVolume(
      value: json['value'].toDouble()?? 0.0,
      change: json['change'].toDouble()?? 0.0,

    );
  }
}
