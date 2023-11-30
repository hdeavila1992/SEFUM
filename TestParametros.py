import pandas as pd

# Reemplaza 'tu_archivo.xlsx' con la ruta de tu archivo Excel
archivo_excel = 'Sujeto2_10823.xlsx'

# Esto leerá la primera hoja del archivo Excel
df = pd.read_excel(archivo_excel)

print(df.head())

def integrate(x,y,y0,index_begin,index_finish):
    x_to_integrate=x[index_begin:index_finish]
    y_to_integrate=y[index_begin:index_finish]
    I=0
    for i in (len(x_to_integrate)-1):
        I+=x_to_integrate()
