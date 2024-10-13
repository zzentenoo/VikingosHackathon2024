from fastapi import APIRouter
from dash import Dash, dcc, html
from dash.dependencies import Input, Output
import pandas as pd
import plotly.express as px

# Crear el router para gestionar el endpoint
router = APIRouter()

# Función para cargar datos desde el JSON del usuario
def load_user_data(user_id: str):
    try:
        df = pd.read_json(f"{user_id}_finances.json")
        df['dates'] = pd.to_datetime(df['dates'], format="%d/%m/%Y")
        return df
    except FileNotFoundError:
        return pd.DataFrame(columns=["dates", "income", "expense"])

# Instancia Dash vinculada al router para FastAPI
dash_app = Dash(__name__, requests_pathname_prefix='/finance-graph/')

# Layout del dashboard con filtros para año y mes, y dos gráficas (línea y pie)
dash_app.layout = html.Div([
    html.H1("Gráfica de Ingresos y Gastos"),

    # Dropdown para seleccionar el año
    dcc.Dropdown(id='year-dropdown', options=[], placeholder="Selecciona un año"),
    
    # Dropdown para seleccionar el mes
    dcc.Dropdown(id='month-dropdown', options=[], placeholder="Selecciona un mes"),

    # Contenedor de la gráfica de línea
    dcc.Graph(id='finance-line-graph'),

    # Contenedor de la gráfica de pie
    dcc.Graph(id='finance-pie-chart')
])

# Callback para llenar el dropdown de años
@dash_app.callback(
    Output('year-dropdown', 'options'),
    Input('year-dropdown', 'id')
)
def update_year_options(_):
    df = load_user_data("user")  # Se puede cambiar el ID dinámicamente
    if df.empty:
        return []

    years = df['dates'].dt.year.unique()
    year_options = [{'label': str(year), 'value': year} for year in years]
    return year_options

# Callback para llenar el dropdown de meses basado en el año seleccionado
@dash_app.callback(
    Output('month-dropdown', 'options'),
    Input('year-dropdown', 'value')
)
def update_month_options(selected_year):
    df = load_user_data("user")
    if df.empty or not selected_year:
        return []

    months_in_year = df[df['dates'].dt.year == selected_year]['dates'].dt.month.unique()
    month_options = [{'label': str(month), 'value': month} for month in months_in_year]
    return month_options

# Callback para actualizar las gráficas según el año y mes seleccionados
@dash_app.callback(
    [Output('finance-line-graph', 'figure'),
     Output('finance-pie-chart', 'figure')],
    [Input('year-dropdown', 'value'),
     Input('month-dropdown', 'value')]
)
def update_graphs(selected_year, selected_month):
    df = load_user_data("user")
    if df.empty or not selected_year or not selected_month:
        return px.line(title="Sin datos disponibles"), px.pie(title="Sin datos disponibles")

    # Filtrar el DataFrame por el año y mes seleccionados
    filtered_df = df[(df['dates'].dt.year == selected_year) & (df['dates'].dt.month == selected_month)]

    if filtered_df.empty:
        return px.line(title="No hay datos para esta selección"), px.pie(title="No hay datos para esta selección")

    # Gráfica de línea de ingresos y gastos
    line_fig = px.line(filtered_df, x='dates', y=['income', 'expense'],
                       labels={'value': 'Cantidad', 'dates': 'Fecha'},
                       title=f'Ingresos y Gastos - {selected_month}/{selected_year}')

    # Gráfica de pie con la suma de ingresos y gastos
    total_income = filtered_df['income'].sum()
    total_expense = filtered_df['expense'].sum()
    pie_fig = px.pie(values=[total_income, total_expense],
                     names=['Ingreso', 'Gasto'],
                     title='Distribución de Ingresos y Gastos')

    return line_fig, pie_fig

# Definir un endpoint específico que cargue la gráfica
@router.get("/show-graph/{user_id}")
async def show_finance_graph(user_id: str):
    return {}

# Incluir Dash en el router como un servidor de gráficos embebido
dash_app.run_server(debug=True)
