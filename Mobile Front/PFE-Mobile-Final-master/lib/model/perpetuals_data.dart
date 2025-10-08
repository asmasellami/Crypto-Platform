class PerpetualData {
  Currency currency;
  Price price;
  Change change;
  OpenInterest openInterest;
  Volume volume;
  Funding funding;
  NextFr nextFr;
  Yield yield;
  OpenInterestVolume openInterestVolume;
  Liquidations liquidations;
  double lsRatio;
  Markets markets;
  AvgYield avgYield;
  RealizedVol realizedVol;
  int marketCap;
  Correlation correlation;

  PerpetualData({
    required this.currency,
    required this.price,
    required this.change,
    required this.openInterest,
    required this.volume,
    required this.funding,
    required this.nextFr,
    required this.yield,
    required this.openInterestVolume,
    required this.liquidations,
    required this.lsRatio,
    required this.markets,
    required this.avgYield,
    required this.realizedVol,
    required this.marketCap,
    required this.correlation,
  });

  factory PerpetualData.fromJson(Map<String, dynamic> json) {
    return PerpetualData(
      currency: Currency.fromJson(json['currency']),
      price: Price.fromJson(json['price']),
      change: Change.fromJson(json['change']),
      openInterest: OpenInterest.fromJson(json['open_interest']),
      volume: Volume.fromJson(json['volume']),
      funding: Funding.fromJson(json['funding']),
      nextFr: NextFr.fromJson(json['next_fr']),
      yield: Yield.fromJson(json['yield']),
      openInterestVolume: OpenInterestVolume.fromJson(json['open_interest_volume']),
      liquidations: Liquidations.fromJson(json['liquidations']),
      lsRatio: json['ls_ratio']?.toDouble() ?? 0.0,
      markets: Markets.fromJson(json['markets']),
      avgYield: AvgYield.fromJson(json['avg_yield']),
      realizedVol: RealizedVol.fromJson(json['realized_vol'] ?? {}),
      marketCap: json['market_cap'],
      correlation: Correlation.fromJson(json['correlation']),
    );
  }
}

class Currency {
  dynamic value;

  Currency({required this.value});

  factory Currency.fromJson(Map<String, dynamic> json) {
    return Currency(
      value: json['value'],
    );
  }
}

class Price {
  dynamic value;

  Price({required this.value});

  factory Price.fromJson(Map<String, dynamic> json) {
    return Price(
      value: json['value'],
    );
  }
}

class Change {
  dynamic value;

  Change({required this.value});

  factory Change.fromJson(Map<String, dynamic> json) {
    return Change(
      value: json['value'],
    );
  }
}

class OpenInterest {
  double value;
  double notional;
  double change;
  double changeUsd;
  double changeNotional;
  double changeNotionalPercentage;

  OpenInterest({
    required this.value,
    required this.notional,
    required this.change,
    required this.changeUsd,
    required this.changeNotional,
    required this.changeNotionalPercentage,
  });

  factory OpenInterest.fromJson(Map<String, dynamic> json) {
    return OpenInterest(
      value: json['value']?.toDouble() ?? 0.0,
      notional: json['notional']?.toDouble() ?? 0.0,
      change: json['change']?.toDouble() ?? 0.0,
      changeUsd: json['change_usd']?.toDouble() ?? 0.0,
      changeNotional: json['change_notional']?.toDouble() ?? 0.0,
      changeNotionalPercentage: json['change_notional_percentage']?.toDouble() ?? 0.0,
    );
  }
}

class Volume {
  double value;
  double notional;
  double change;
  double changeUsd;
  double changeNotional;
  double changeNotionalPercentage;

  Volume({
    required this.value,
    required this.notional,
    required this.change,
    required this.changeUsd,
    required this.changeNotional,
    required this.changeNotionalPercentage,
  });

  factory Volume.fromJson(Map<String, dynamic> json) {
    return Volume(
      value: json['value']?.toDouble() ?? 0.0,
      notional: json['notional']?.toDouble() ?? 0.0,
      change: json['change']?.toDouble() ?? 0.0,
      changeUsd: json['change_usd']?.toDouble() ?? 0.0,
      changeNotional: json['change_notional']?.toDouble() ?? 0.0,
      changeNotionalPercentage: json['change_notional_percentage']?.toDouble() ?? 0.0,
    );
  }
}

class Funding {
  double value;
  double intensity;

  Funding({required this.value, required this.intensity});

  factory Funding.fromJson(Map<String, dynamic> json) {
    return Funding(
      value: json['value']?.toDouble() ?? 0.0,
      intensity: json['intensity']?.toDouble() ?? 0.0,
    );
  }
}

class NextFr {
  double value;
  double intensity;

  NextFr({required this.value, required this.intensity});

  factory NextFr.fromJson(Map<String, dynamic> json) {
    return NextFr(
      value: json['value']?.toDouble() ?? 0.0,
      intensity: json['intensity']?.toDouble() ?? 0.0,
    );
  }
}

class Yield {
  double value;

  Yield({required this.value});

  factory Yield.fromJson(Map<String, dynamic> json) {
    return Yield(
      value: json['value']?.toDouble() ?? 0.0,
    );
  }
}

class OpenInterestVolume {
  double value;
  double intensity;
  double change;

  OpenInterestVolume({required this.value, required this.intensity, required this.change});

  factory OpenInterestVolume.fromJson(Map<String, dynamic> json) {
    return OpenInterestVolume(
      value: json['value']?.toDouble() ?? 0.0,
      intensity: json['intensity']?.toDouble() ?? 0.0,
      change: json['change']?.toDouble() ?? 0.0,
    );
  }
}

class Liquidations {
  double long;
  double short;
  double changeLongUsd;
  double changeShortUsd;
  double changeLong;
  double changeShort;

  Liquidations({
    required this.long,
    required this.short,
    required this.changeLongUsd,
    required this.changeShortUsd,
    required this.changeLong,
    required this.changeShort,
  });

  factory Liquidations.fromJson(Map<String, dynamic> json) {
    return Liquidations(
      long: json['long']?.toDouble() ?? 0.0,
      short: json['short']?.toDouble() ?? 0.0,
      changeLongUsd: json['change_long_usd']?.toDouble() ?? 0.0,
      changeShortUsd: json['change_short_usd']?.toDouble() ?? 0.0,
      changeLong: json['change_long']?.toDouble() ?? 0.0,
      changeShort: json['change_short']?.toDouble() ?? 0.0,
    );
  }
}

class Markets {
  List<String> value;

  Markets({required this.value});

  factory Markets.fromJson(Map<String, dynamic> json) {
    return Markets(
      value: List<String>.from(json['value']),
    );
  }
}

class AvgYield {
  double one;
  double three;
  double seven;
  double fourteen;
  double thirty;
  double ninety;
  double threeSixtyFive;

  AvgYield({
    required this.one,
    required this.three,
    required this.seven,
    required this.fourteen,
    required this.thirty,
    required this.ninety,
    required this.threeSixtyFive,
  });

  factory AvgYield.fromJson(Map<String, dynamic> json) {
    return AvgYield(
      one: json['1']?.toDouble() ?? 0.0,
      three: json['3']?.toDouble() ?? 0.0,
      seven: json['7']?.toDouble() ?? 0.0,
      fourteen: json['14']?.toDouble() ?? 0.0,
      thirty: json['30']?.toDouble() ?? 0.0,
      ninety: json['90']?.toDouble() ?? 0.0,
      threeSixtyFive: json['365']?.toDouble() ?? 0.0,
    );
  }
}

class RealizedVol {
  double three;
  double seven;
  double thirty;
  double sixty;
  double ninety;
  double oneEighty;
  double twoSeventy;
  double threeSixtyFive;

  RealizedVol({
    required this.three,
    required this.seven,
    required this.thirty,
    required this.sixty,
    required this.ninety,
    required this.oneEighty,
    required this.twoSeventy,
    required this.threeSixtyFive,
  });

  factory RealizedVol.fromJson(Map<String, dynamic> json) {
    return RealizedVol(
      three: json['3']?.toDouble() ?? 0.0,
      seven: json['7']?.toDouble() ?? 0.0,
      thirty: json['30']?.toDouble() ?? 0.0,
      sixty: json['60']?.toDouble() ?? 0.0,
      ninety: json['90']?.toDouble() ?? 0.0,
      oneEighty: json['180']?.toDouble() ?? 0.0,
      twoSeventy: json['270']?.toDouble() ?? 0.0,
      threeSixtyFive: json['365']?.toDouble() ?? 0.0,
    );
  }
}

class Correlation {
  CorrelationValue btc;
  CorrelationValue eth;

  Correlation({
    required this.btc,
    required this.eth,
  });

  factory Correlation.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return Correlation(
        btc: CorrelationValue(seven: 0.0, thirty: 0.0),
        eth: CorrelationValue(seven: 0.0, thirty: 0.0),
      );
    }

    return Correlation(
      btc: CorrelationValue.fromJson(json['btc']),
      eth: CorrelationValue.fromJson(json['eth']),
    );
  }
}

class CorrelationValue {
  double seven;
  double thirty;

  CorrelationValue({
    required this.seven,
    required this.thirty,
  });

  factory CorrelationValue.fromJson(Map<String, dynamic>? json) {
    if (json == null) {
      return CorrelationValue(seven: 0.0, thirty: 0.0);
    }

    return CorrelationValue(
      seven: json['7']?.toDouble() ?? 0.0,
      thirty: json['30']?.toDouble() ?? 0.0,
    );
  }
}

