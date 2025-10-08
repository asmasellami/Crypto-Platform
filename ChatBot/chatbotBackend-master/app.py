
from flask import Flask, request, jsonify
import requests
import nltk
import logging
import re
from nltk.tokenize import word_tokenize

nltk.download('punkt')

app = Flask(__name__)

SECRET_KEY = 'AS845fsd,asd//6'

logging.basicConfig(level=logging.DEBUG)

def get_crypto_data(crypto_id):
    url = f'https://api.coingecko.com/api/v3/coins/{crypto_id}'
    response = requests.get(url)
    return response.json()

def get_futures_data():
    url = 'https://be.laevitas.ch/pfe/futures'
    headers = {'secret': SECRET_KEY}
    response = requests.get(url, headers=headers)
    return response.json()

def get_options_data():
    url = 'https://be.laevitas.ch/pfe/options'
    headers = {'secret': SECRET_KEY}
    response = requests.get(url, headers=headers)
    return response.json()

def parse_query(query):
    # Define the regular expression pattern for detecting tickers, case-insensitive
    ticker_pattern = re.compile(r'\b[a-z]{2,}-\d+[a-z]+\d+\b', re.IGNORECASE)
    
    # Tokenize the query and convert to lowercase
    tokens = word_tokenize(query.lower())
    
    # Search for the specific keywords related to intents
    if ('bitcoin' in tokens or 'btc' in tokens) and 'price' in tokens:
        return 'bitcoin'
    elif ('ethereum' in tokens or 'eth' in tokens) and 'price' in tokens:
        return 'ethereum'
    elif 'top' in tokens and 'prices' in tokens:
        return 'top_prices'
    else:
        # Search for ticker pattern in the query
        ticker_match = ticker_pattern.search(query)
        if ticker_match:
            return ticker_match.group().upper()  # Return the ticker in uppercase
        else:
            return None

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    query = data.get('query')
    
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    intent = parse_query(query)

    if intent == 'bitcoin':
        crypto_data = get_crypto_data('bitcoin')
        response = {
            'name': crypto_data['name'],
            'symbol': crypto_data['symbol'],
            'current_price': crypto_data['market_data']['current_price']['usd'],
            'market_cap': crypto_data['market_data']['market_cap']['usd'],
            'volume_24h': crypto_data['market_data']['total_volume']['usd']
        }
    elif intent == 'ethereum':
        crypto_data = get_crypto_data('ethereum')
        response = {
            'name': crypto_data['name'],
            'symbol': crypto_data['symbol'],
            'current_price': crypto_data['market_data']['current_price']['usd'],
            'market_cap': crypto_data['market_data']['market_cap']['usd'],
            'volume_24h': crypto_data['market_data']['total_volume']['usd']
        }
    elif intent == 'top_prices':
        futures_data = get_futures_data()
        options_data = get_options_data()

        futures_tickers_and_prices = []
        for sublist in futures_data:
            ticker = None
            price = None
            for entry in sublist:
                if entry['name'] == 'ticker':
                    ticker = entry['value']
                elif entry['name'] == 'price':
                    price = entry['value']
            if ticker and price:
                futures_tickers_and_prices.append({'ticker': ticker, 'price': price})

        options_tickers_and_prices = []
        for sublist in options_data:
            ticker = None
            price = None
            for entry in sublist:
                if entry['name'] == 'ticker':
                    ticker = entry['value']
                elif entry['name'] == 'underlying_price':
                    price = entry['value']
            if ticker and price:
                options_tickers_and_prices.append({'ticker': ticker, 'price': price})

        top_futures_prices = sorted(futures_tickers_and_prices, key=lambda x: x['price'], reverse=True)[:3]
        top_options_prices = sorted(options_tickers_and_prices, key=lambda x: x['price'], reverse=True)[:3]
        
        response = {
            'message': 'Top prices:',
            'top_futures_prices': top_futures_prices,
            'top_options_prices': top_options_prices
        }
    else:
        ticker = intent
        ticker_data = None
        table_name = None

        futures_data = get_futures_data()
        for sublist in futures_data:
            if any(entry['name'] == 'ticker' and entry['value'].upper() == ticker for entry in sublist):
                ticker_data = sublist
                table_name = 'futures'
                break

        if not ticker_data:
            options_data = get_options_data()
            for sublist in options_data:
                if any(entry['name'] == 'ticker' and entry['value'].upper() == ticker for entry in sublist):
                    ticker_data = sublist
                    table_name = 'options'
                    break

        if ticker_data:
            response = {entry['name']: entry['value'] for entry in ticker_data}
            response['table'] = table_name
        else:
            response = {'error': f'No data found for ticker {ticker} in both futures and options tables'}
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
