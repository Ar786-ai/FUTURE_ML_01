from flask import Flask, request, render_template
from data_preprocessing import DataPreprocessor
from forecasting import SalesForecaster
import pandas as pd

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        file = request.files['file']
        if not file:
            return render_template('index.html', error="No file uploaded")
        
        try:
            # Process data
            preprocessor = DataPreprocessor(file.stream)
            daily_data = preprocessor.resample_data('D')
            
            # Forecast
            forecaster = SalesForecaster(daily_data)
            forecaster.fit_model()
            forecast = forecaster.make_forecast()
            
            # Generate plots
            plots = forecaster.generate_plots(forecast)
            
            # Get last 30 days of forecast
            forecast_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(30)
            
            return render_template('index.html', 
                                 forecast_data=forecast_data.to_dict('records'),
                                 plots=plots)
            
        except Exception as e:
            return render_template('index.html', error=str(e))
    
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)