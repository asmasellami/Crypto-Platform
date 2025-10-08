// ignore_for_file: non_constant_identifier_names

class OptionsData {
  Ticker ticker;
  Currency currency;
  Expiry expiry;
  UnderlyingPrice underlyingPrice;
  Change change;
  OpenInterest openInterest;
  Volume volume;
  AtmVol atmVol;
  Basis basis;
  DeltaRiskReversal deltaRiskReversal25;
  DeltaButterfly deltaButterfly25;
  OpenInterestVolume openInterestVolume;
  dynamic market;


  OptionsData({
    required this.ticker,
    required this.currency,
    required this.expiry,
    required this.underlyingPrice,
    required this.change,
    required this.openInterest,
    required this.volume,
    required this.atmVol,
    required this.basis,
    required this.deltaRiskReversal25,
    required this.deltaButterfly25,
    required this.openInterestVolume,
    required this.market,
  });

  factory OptionsData.fromJson(Map<String, dynamic> json) {
    return OptionsData(
      ticker: Ticker.fromJson(json['ticker']),
      currency: Currency.fromJson(json['currency']),
      expiry: Expiry.fromJson(json['expiry']),
      underlyingPrice: UnderlyingPrice.fromJson(json['underlying_price']),
      change: Change.fromJson(json['change']),
      openInterest: OpenInterest.fromJson(json['open_interest']),
      volume: Volume.fromJson(json['volume']),
      atmVol: AtmVol.fromJson(json['atm_vol']),
      basis: Basis.fromJson(json['basis']),
      deltaRiskReversal25: DeltaRiskReversal.fromJson(json['_25_delta_risk_reversal']),
      deltaButterfly25: DeltaButterfly.fromJson(json['_25_delta_butterfly']),
      openInterestVolume: OpenInterestVolume.fromJson(json['open_interest_volume']),
      market: json['market'],
    );
  }
}

class Ticker {
  dynamic value;

  Ticker({required this.value});

  factory Ticker.fromJson(Map<String, dynamic> json) {
    return Ticker(value: json['value']);
  }
}

class Currency {
  dynamic value;

  Currency({required this.value});

  factory Currency.fromJson(Map<String, dynamic> json) {
    return Currency(value: json['value']);
  }
}

class Expiry {
  dynamic value;

  Expiry({required this.value});

  factory Expiry.fromJson(Map<String, dynamic> json) {
    return Expiry(value: json['value']);
  }
}

class UnderlyingPrice {
  dynamic value;

  UnderlyingPrice({required this.value});

  factory UnderlyingPrice.fromJson(Map<String, dynamic> json) {
    return UnderlyingPrice(value: json['value']);
  }
}

class Change {
  dynamic value;

  Change({required this.value});

  factory Change.fromJson(Map<String, dynamic> json) {
    return Change(value: json['value']);
  }
}

class OpenInterest {
  dynamic value;
  dynamic intensity;
  dynamic notional;
  dynamic changeUsdPercentage;
  dynamic changeUsd;
  dynamic changeNotional;
  dynamic changeNotionalPercentage;

  OpenInterest({
    required this.value,
    required this.intensity,
    required this.notional,
    required this.changeUsdPercentage,
    required this.changeUsd,
    required this.changeNotional,
    required this.changeNotionalPercentage,
  });

  factory OpenInterest.fromJson(Map<String, dynamic> json) {
    return OpenInterest(
      value: json['value'],
      intensity: json['intensity'],
      notional: json['notional'],
      changeUsdPercentage: json['change_usd_percentage'],
      changeUsd: json['change_usd'],
      changeNotional: json['change_notional'],
      changeNotionalPercentage: json['change_notional_percentage'],
    );
  }
}

class Volume {
  dynamic value;
  dynamic intensity;
  dynamic notional;
  dynamic changeUsdPercentage;
  dynamic changeUsd;
  dynamic changeNotional;
  dynamic changeNotionalPercentage;

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
      value: json['value'],
      intensity: json['intensity'],
      notional: json['notional'],
      changeUsdPercentage: json['change_usd_percentage'],
      changeUsd: json['change_usd'],
      changeNotional: json['change_notional'],
      changeNotionalPercentage: json['change_notional_percentage'],
    );
  }
}

class AtmVol {
  dynamic value;
  dynamic change;
  dynamic intensity;

  AtmVol({
    required this.value,
    required this.change,
    required this.intensity,
  });

  factory AtmVol.fromJson(Map<String, dynamic> json) {
    return AtmVol(
      value: json['value'],
      change: json['change'],
      intensity: json['intensity'],
    );
  }
}

class Basis {
  dynamic value;
  dynamic change;
  dynamic intensity;

  Basis({
    required this.value,
    required this.change,
    required this.intensity,
  });

  factory Basis.fromJson(Map<String, dynamic> json) {
    return Basis(
      value: json['value']?.toDouble() ?? 0.0,
      change: json['change']?.toDouble() ?? 0.0,
      intensity: json['intensity']?.toDouble() ?? 0.0,
    );
  }
}

class DeltaRiskReversal {
  dynamic value;
  dynamic change;
  dynamic intensity;

  DeltaRiskReversal({
    required this.value,
    required this.change,
    required this.intensity,
  });

  factory DeltaRiskReversal.fromJson(Map<String, dynamic> json) {
    return DeltaRiskReversal(
      value: json['value']?.toDouble() ?? 0.0,
      change: json['change']?.toDouble() ?? 0.0,
      intensity: json['intensity']?.toDouble() ?? 0.0,
    );
  }
}

class DeltaButterfly {
  dynamic value;
  dynamic change;
  dynamic intensity;

  DeltaButterfly({
    required this.value,
    required this.change,
    required this.intensity,
  });

  factory DeltaButterfly.fromJson(Map<String, dynamic> json) {
    return DeltaButterfly(
      value: json['value']?.toDouble() ?? 0.0,
      change: json['change']?.toDouble() ?? 0.0,
      intensity: json['intensity']?.toDouble() ?? 0.0,
    );
  }
}

class OpenInterestVolume {
  dynamic value;
  dynamic change;

  OpenInterestVolume({
    required this.value,
    required this.change,
  });

  factory OpenInterestVolume.fromJson(Map<String, dynamic> json) {
    return OpenInterestVolume(
      value: json['value']?.toDouble() ?? 0.0,
      change: json['change']?.toDouble() ?? 0.0,
    );
  }
}
