import pandas as pd
from sklearn.preprocessing import StandardScaler
from io import StringIO

class DataPreprocessor:
    def __init__(self, file_stream):
        self.data = pd.read_csv(file_stream)
        self.clean_data()
        
    def clean_data(self):
        """Handle missing values and outliers"""
        self.data['date'] = pd.to_datetime(self.data['date'])
        self.data['sales'].fillna(method='ffill', inplace=True)
        
        # Remove outliers
        q1 = self.data['sales'].quantile(0.25)
        q3 = self.data['sales'].quantile(0.75)
        iqr = q3 - q1
        self.data = self.data[~((self.data['sales'] < (q1 - 1.5 * iqr)) | 
                              (self.data['sales'] > (q3 + 1.5 * iqr)))]
    
    def resample_data(self, frequency='D'):
        """Resample to daily/weekly/monthly"""
        return self.data.set_index('date').resample(frequency).sum().reset_index()