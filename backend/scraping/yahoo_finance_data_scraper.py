import yfinance as yf
import pandas as pd

sp500_tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "JPM", "JNJ", "V"]

def fetch_data(tickers):
    all_data = []
    for ticker in tickers:
        stock = yf.Ticker(ticker)
        
        historical_data = stock.history(period="max", interval="1d")
        historical_data['Ticker'] = ticker

        historical_data['Dividend Yield'] = stock.info.get("dividendYield")
        historical_data['Debt to Equity'] = stock.info.get("debtToEquity")
        historical_data['Earnings Per Share (EPS)'] = stock.info.get("trailingEps")
        historical_data['Price to Earnings (P/E)'] = stock.info.get("trailingPE")
        historical_data['Price to Book (P/B)'] = stock.info.get("priceToBook")
        historical_data['Sector'] = stock.info.get("sector")
        historical_data['Industry'] = stock.info.get("industry")
        all_data.append(historical_data)

    combined_data = pd.concat(all_data)
    combined_data.to_csv("yahoo_finance_data.csv")

fetch_data(sp500_tickers)