from prophet import Prophet
import matplotlib.pyplot as plt
from io import BytesIO
import base64

class SalesForecaster:
    def __init__(self, data):
        self.model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False
        )
        self.data = data.rename(columns={'date': 'ds', 'sales': 'y'})
        
    def fit_model(self):
        self.model.fit(self.data)
        
    def make_forecast(self, periods=30):
        future = self.model.make_future_dataframe(periods=periods)
        return self.model.predict(future)
    
    def plot_to_base64(self, fig):
        """Convert matplotlib figure to base64 for HTML"""
        buf = BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight')
        buf.seek(0)
        return base64.b64encode(buf.read()).decode('utf-8')
    
    def generate_plots(self, forecast):
        """Return dict with all plots as base64"""
        fig1 = self.model.plot(forecast)
        fig2 = self.model.plot_components(forecast)
        
        return {
            'forecast_plot': self.plot_to_base64(fig1),
            'components_plot': self.plot_to_base64(fig2)
        }