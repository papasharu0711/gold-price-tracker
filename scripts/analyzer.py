import json
import numpy as np
from datetime import datetime
from scipy import stats

def analyze_gold_prices(filepath='data/gold-prices.json'):
    """
    금 시세 데이터 분석 및 통계 생성
    """
    print("=" * 60)
    print("금 시세 분석 시작")
    print("=" * 60)
    
    # 데이터 로드
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except:
        print("데이터 파일을 찾을 수 없습니다.")
        return
    
    if not data:
        print("분석할 데이터가 없습니다.")
        return
    
    print(f"총 {len(data)}개의 데이터 로드")
    
    # 가격 데이터 추출
    sell_pure_prices = [item['sellPure'] for item in data if item['sellPure'] > 0]
    buy_pure_prices = [item['buyPure'] for item in data if item['buyPure'] > 0]
    
    if not sell_pure_prices:
        print("유효한 가격 데이터가 없습니다.")
        return
    
    # 통계 계산
    current_price = sell_pure_prices[0]
    min_price = min(sell_pure_prices)
    max_price = max(sell_pure_prices)
    avg_price = np.mean(sell_pure_prices)
    median_price = np.median(sell_pure_prices)
    std_dev = np.std(sell_pure_prices)
    volatility = (std_dev / avg_price) * 100
    
    # 이동평균
    ma7 = np.mean(sell_pure_prices[:min(7, len(sell_pure_prices))])
    ma30 = np.mean(sell_pure_prices[:min(30, len(sell_pure_prices))])
    
    # 추세 분석 (선형 회귀)
    x = np.arange(len(sell_pure_prices))
    y = np.array(sell_pure_prices)
    slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
    
    # 추세 판단
    if slope > 100:
        trend = "강한 상승 추세"
        trend_icon = "📈"
    elif slope > 0:
        trend = "완만한 상승 추세"
        trend_icon = "📈"
    elif slope > -100:
        trend = "완만한 하락 추세"
        trend_icon = "📉"
    else:
        trend = "강한 하락 추세"
        trend_icon = "📉"
    
    # 30일 후 예측
    prediction_30d = current_price + (slope * 30)
    change_30d = ((prediction_30d - current_price) / current_price) * 100
    
    # 투자 신호
    position = ((current_price - min_price) / (max_price - min_price)) * 100
    
    if position < 30:
        signal = "저가 매수 기회"
        signal_icon = "🟢"
    elif position > 70:
        signal = "고가 주의"
        signal_icon = "🔴"
    elif slope > 0 and current_price < ma30:
        signal = "매수 고려"
        signal_icon = "🟡"
    elif slope < 0 and current_price > ma30:
        signal = "매도 고려"
        signal_icon = "🟠"
    else:
        signal = "중립"
        signal_icon = "⚪"
    
    # 통계 정보 생성
    statistics = {
        "lastUpdated": datetime.now().isoformat(),
        "dataCount": len(data),
        "currentPrice": {
            "buyPure": data[0]['buyPure'],
            "sellPure": data[0]['sellPure'],
            "sell18K": data[0]['sell18K'],
            "sell14K": data[0]['sell14K']
        },
        "statistics": {
            "minPrice": int(min_price),
            "maxPrice": int(max_price),
            "avgPrice": int(avg_price),
            "medianPrice": int(median_price),
            "volatility": round(volatility, 2),
            "ma7": int(ma7),
            "ma30": int(ma30)
        },
        "trend": {
            "direction": trend,
            "icon": trend_icon,
            "slope": round(slope, 2),
            "prediction30d": int(prediction_30d),
            "change30d": round(change_30d, 2)
        },
        "signal": {
            "message": signal,
            "icon": signal_icon,
            "position": round(position, 1)
        }
    }
    
    # 저장
    with open('data/statistics.json', 'w', encoding='utf-8') as f:
        json.dump(statistics, f, ensure_ascii=False, indent=2)
    
    print("\n분석 결과:")
    print(f"  현재가: {current_price:,}원")
    print(f"  {trend_icon} 추세: {trend}")
    print(f"  30일 후 예상: {int(prediction_30d):,}원 ({change_30d:+.2f}%)")
    print(f"  {signal_icon} 투자 신호: {signal}")
    print(f"\n✓ 통계 저장 완료: data/statistics.json")

if __name__ == "__main__":
    analyze_gold_prices()
