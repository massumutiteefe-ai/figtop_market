import MetaTrader5 as mt5
import asyncio
import websockets
import json
import os

async def handle_client(websocket):
    # Try initializing normally first
    initialized = mt5.initialize()
    
    # Common standard installation paths check fallback if default fails
    if not initialized:
        possible_paths = [
            "C:\\Program Files\\MetaTrader 5\\terminal64.exe",
            "C:\\Program Files (x86)\\MetaTrader 5\\terminal.exe"
        ]
        for path in possible_paths:
            if os.path.exists(path):
                print(f"Attempting initialization via path: {path}")
                initialized = mt5.initialize(path=path)
                if initialized:
                    break

    if not initialized:
        error_code = mt5.last_error()
        print(f"MT5 initialization failed. Error Code: {error_code}")
        print("Please ensure your MetaTrader 5 Desktop Application is open and logged into your account.")
        return
        
    print("Successfully connected to MT5 Terminal. Streaming market data...")
    current_symbol = "EURUSD"
    current_tf = mt5.TIMEFRAME_H1
    
    tf_mapping = {
        "M1": mt5.TIMEFRAME_M1,
        "M15": mt5.TIMEFRAME_M15,
        "H1": mt5.TIMEFRAME_H1,
        "H4": mt5.TIMEFRAME_H4,
        "D1": mt5.TIMEFRAME_D1
    }

    while True:
        try:
            try:
                message = await asyncio.wait_for(websocket.recv(), timeout=0.05)
                data = json.loads(message)
                if "symbol" in data:
                    current_symbol = data["symbol"].replace("z", "").upper()
                if "timeframe" in data:
                    current_tf = tf_mapping.get(data["timeframe"], mt5.TIMEFRAME_H1)
            except asyncio.TimeoutError:
                pass

            mt5.symbol_select(current_symbol, True)
            tick = mt5.symbol_info_tick(current_symbol)
            rates = mt5.copy_rates_from_now(current_symbol, current_tf, 20)
            
            if rates is not None and len(rates) > 0:
                candles_payload = [
                    {
                        "time": int(bar['time']),
                        "open": float(bar['open']),
                        "high": float(bar['high']),
                        "low": float(bar['low']),
                        "close": float(bar['close'])
                    }
                    for bar in rates
                ]
                
                bid_price = tick.bid if tick is not None else float(rates[-1]['close'])
                ask_price = tick.ask if tick is not None else bid_price + 0.00020
                
                payload = {
                    "symbol": current_symbol + "z",
                    "bid": bid_price,
                    "ask": ask_price,
                    "candles": candles_payload
                }
                await websocket.send(json.dumps(payload))
                
            await asyncio.sleep(0.4)
        except websockets.exceptions.ConnectionClosed:
            print("Client disconnected.")
            break

async def main():
    async with websockets.serve(handle_client, "localhost", 8080):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())