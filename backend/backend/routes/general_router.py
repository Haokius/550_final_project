from fastapi import HTTPException, APIRouter
from pydantic import List
from sqlalchemy.sql import text
from sqlalchemy.engine import Engine

general_router = APIRouter(
    prefix="/api",
    tags=["api"],
)

@general_router.get("/stocks")
async def get_stock_data():
    return None

# Kevin's Endpoints
@general_router.get("/stocks/highest-fluctuations")
async def get_highest_fluctations(engine: Engine):

    statement = text("""
        WITH MonthlyVolatility AS (
            SELECT S.Ticker, S.year, S.month,
                    AVG(S.High - S.Low) AS AvgMonthlyVolatility
            FROM stock_prices S
            JOIN companies C ON S.Ticker = C.Ticker
            WHERE S.Volume > 10000000
            GROUP BY S.Ticker, Year, Month
        ),
        Subquery AS (
            SELECT Ticker, Year, Month, AvgMonthlyVolatility
            FROM MOnthlyVolatility
            ORDER BY AvgMonthlyVolatility DESC
            LIMIT 10
        )
        SELECT * FROM
        Companies NATURAL JOIN Subquery
        ORDER BY AvgMonthlyVolatility DESC;
    """)

    try:
        with engine.connect() as con:
            response = con.execute(statement)
            results = response.fetchall()
        if results:
            return [dict(row) for row in results]
        else:
            raise HTTPException(404, detail="No stock data found with the specified criteria")
    except Exception as e:
        raise HTTPException(500, detail=f"Error querying database: {str(e)}")
    
@general_router.get("/stocks/highest-liquidity-debt-ratio")
async def get_highest_liquidity_debt_ratio(engine: Engine):
    
    statement = text("""
        WITH ProcessedFinancials AS (
            SELECT DISTINCT F.CIK, F.cash_and_equivalents, F.long_term_debt, F.Year,
                CASE
                    WHEN F.Month BETWEEN 1 AND 3 THEN 1
                    WHEN F.Month BETWEEN 4 AND 6 THEN 2
                    WHEN F.Month BETWEEN 7 AND 9 THEN 3
                    WHEN F.Month BETWEEN 10 AND 12 THEN 4
                    ELSE NULL
                END AS Quarter,
                COALESCE((F.cash_and_equivalents / NULLIF(F.long_term_debt, 0)), -1) AS CashToDebtRatio
            FROM financials F
            WHERE F.long_term_debt IS NOT NULL
            AND F.cash_and_equivalents IS NOT NULL
            ORDER BY CashToDebtRatio DESC
            LIMIT 10
        )
        SELECT C.CompanyName, PF.*
        FROM companies C NATURAL JOIN ProcessedFinancials PF
        ORDER BY PF.CashToDebtRatio DESC;
    """)

    try:
        with engine.connect() as con:
            response = con.execute(statement)
            results = response.fetchall()
        if results:
            return [dict(row) for row in results]
        else:
            raise HTTPException(404, detail="No stock data found with the specified criteria")
    except Exception as e:
        raise HTTPException(500, detail=f"Error querying database: {str(e)}")
    
@general_router.get("/stock/greatest-leverage-differences")
async def get_greatest_leverage_differences(engine: Engine):

    statement = text("""
        WITH DebtToAssetRatios AS (
            SELECT F.CIK, C.CompanyName,
                    (F.long_term_debt / NULLIF(F.Assets, 0)) AS DebtToAssetRatio
            FROM Financials F
            JOIN companies C ON F.CIK::VARCHAR = C.CIK::VARCHAR
            WHERE F.Assets > 0 AND F.long_term_debt IS NOT NULL
        ),
        TopDebtRatios AS (
            SELECT CIK, CompanyName, DebtToAssetRatio,
                    ROW_NUMBER() OVER (ORDER BY DebtToAssetRatio DESC) AS Rank
            FROM DebtToAssetRatios
            WHERE DebtToAssetRatio IS NOT NULL
            LIMIT 5000
        )
        SELECT DISTINCT D1.CIK AS Company1, C1.CompanyName AS Company1Name,
            D2.CIK AS Company2, C2.CompanyName AS Company2Name,
            D1.DebtToAssetRatio AS Company1Ratio,
            D2.DebtToAssetRatio AS Company2Ratio,
            ABS(D1.DebtToAssetRatio - D2.DebtToAssetRatio) AS RatioDifference
        FROM TopDebtRatios D1
        JOIN TopDebtRatios D2
        ON D1.CIK < D2.CIK  -- Ensure we only join each pair once
        JOIN companies C1 ON D1.CIK = C1.CIK
        JOIN companies C2 ON D2.CIK = C2.CIK
        WHERE ABS(D1.DebtToAssetRatio - D2.DebtToAssetRatio) > 0.1
        ORDER BY RatioDifference DESC
        LIMIT 10;
    """)

    try:
        with engine.connect() as con:
            response = con.execute(statement)
            results = response.fetchall()
        if results:
            return [dict(row) for row in results]
        else:
            raise HTTPException(404, detail="No stock data found with the specified criteria")
    except Exception as e:
        raise HTTPException(500, detail=f"Error querying database: {str(e)}")